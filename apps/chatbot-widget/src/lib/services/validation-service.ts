// HeyBo Validation Service
import type { 
  BowlComposition, 
  CartItem, 
  BowlValidationResult, 
  CartValidationResult,
  CartItemValidation,
  ValidationWarning,
  ValidationError,
  HeyBoIngredient,
  Location
} from '../../types';
import { errorHandler } from './error-handler';

export class ValidationService {
  private static instance: ValidationService;
  
  // HeyBo specific rules
  private readonly MAX_BOWL_WEIGHT = 900; // grams
  private readonly WARNING_THRESHOLD = 0.8; // 80% of max weight
  private readonly MAX_SIDES = 3;
  private readonly REQUIRED_CATEGORIES = ['base']; // Base is required for HeyBo

  static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  /**
   * Validate bowl composition with HeyBo-specific rules
   */
  validateBowl(bowl: Partial<BowlComposition>, location?: Location): BowlValidationResult {
    const warnings: ValidationWarning[] = [];
    const errors: ValidationError[] = [];
    
    // Calculate current weight
    const currentWeight = this.calculateBowlWeight(bowl);
    const warningWeight = this.MAX_BOWL_WEIGHT * this.WARNING_THRESHOLD;
    
    // Weight validation
    let weightStatus: 'under' | 'optimal' | 'warning' | 'over' = 'optimal';
    
    if (currentWeight > this.MAX_BOWL_WEIGHT) {
      weightStatus = 'over';
      warnings.push({
        code: 'WEIGHT_EXCEEDED',
        message: `Bowl exceeds maximum weight of ${this.MAX_BOWL_WEIGHT}g. Current: ${currentWeight}g`,
        severity: 'warning',
        dismissible: false
      });
    } else if (currentWeight > warningWeight) {
      weightStatus = 'warning';
      warnings.push({
        code: 'WEIGHT_WARNING',
        message: `Bowl is getting quite full! Current weight: ${currentWeight}g (${Math.round((currentWeight / this.MAX_BOWL_WEIGHT) * 100)}% of maximum)`,
        severity: 'warning',
        dismissible: true
      });
    } else if (currentWeight < 200) {
      weightStatus = 'under';
      warnings.push({
        code: 'WEIGHT_LOW',
        message: 'Bowl seems quite light. Consider adding more ingredients.',
        severity: 'info',
        dismissible: true
      });
    }

    // Required category validation (HeyBo requires base)
    if (!bowl.base) {
      errors.push({
        code: 'BASE_REQUIRED',
        message: 'Base is required for all HeyBo bowls',
        field: 'base',
        blocking: true
      });
    }

    // Sides limit validation
    const totalSides = (bowl.sides?.length || 0) + (bowl.extraSides?.length || 0);
    if (totalSides > this.MAX_SIDES) {
      warnings.push({
        code: 'SIDES_LIMIT',
        message: `Maximum ${this.MAX_SIDES} sides recommended for optimal taste balance. Current: ${totalSides}`,
        severity: 'warning',
        dismissible: true
      });
    }

    // Ingredient availability validation
    if (location) {
      this.validateIngredientAvailability(bowl, location, warnings, errors);
    }

    // Allergen validation
    this.validateAllergens(bowl, warnings);

    // Price calculation
    const { price: currentPrice, status: priceStatus } = this.calculateBowlPrice(bowl);

    const isValid = errors.length === 0;
    const canProceed = isValid || errors.every(error => !error.blocking);

    return {
      isValid,
      warnings,
      errors,
      totalWeight: currentWeight,
      totalPrice: currentPrice,
      canProceed
    };
  }

  /**
   * Validate entire cart with availability and pricing checks
   */
  async validateCart(cart: CartItem[], location?: Location): Promise<CartValidationResult> {
    const itemValidations: CartItemValidation[] = [];
    const totalErrors: ValidationError[] = [];
    const totalWarnings: ValidationWarning[] = [];

    // Validate each cart item
    for (const item of cart) {
      const itemValidation = await this.validateCartItem(item, location);
      itemValidations.push(itemValidation);
      
      if (!itemValidation.isValid) {
        totalErrors.push(...itemValidation.errors);
      }
      totalWarnings.push(...itemValidation.warnings);
    }

    // Cart-level validations
    if (cart.length === 0) {
      totalErrors.push({
        code: 'CART_EMPTY',
        message: 'Cart is empty',
        blocking: true
      });
    }

    // Check for duplicate items (optional warning)
    const duplicates = this.findDuplicateItems(cart);
    if (duplicates.length > 0) {
      totalWarnings.push({
        code: 'DUPLICATE_ITEMS',
        message: `You have ${duplicates.length} similar items in your cart`,
        severity: 'info',
        dismissible: true
      });
    }

    const isValid = totalErrors.length === 0;
    const canCheckout = isValid || totalErrors.every(error => !error.blocking);

    return {
      isValid,
      warnings: totalWarnings,
      errors: totalErrors,
      totalItems: cart.length,
      totalPrice: cart.reduce((sum, item) => sum + this.calculateBowlPrice(item.bowl).price, 0)
    };
  }

  /**
   * Validate individual cart item
   */
  private async validateCartItem(item: CartItem, location?: Location): Promise<CartItemValidation> {
    const warnings: ValidationWarning[] = [];
    const errors: ValidationError[] = [];
    
    // Validate bowl composition
    const bowlValidation = this.validateBowl(item.bowl, location);
    warnings.push(...bowlValidation.warnings);
    errors.push(...bowlValidation.errors);

    // Check ingredient availability
    let availabilityStatus: 'available' | 'limited' | 'unavailable' = 'available';
    if (location) {
      availabilityStatus = await this.checkItemAvailability(item, location);
      
      if (availabilityStatus === 'unavailable') {
        errors.push({
          code: 'ITEM_UNAVAILABLE',
          message: 'Some ingredients in this item are no longer available',
          blocking: false // Allow user to modify
        });
      } else if (availabilityStatus === 'limited') {
        warnings.push({
          code: 'ITEM_LIMITED',
          message: 'Some ingredients have limited availability',
          severity: 'warning',
          dismissible: true
        });
      }
    }

    // Check price changes
    const currentPrice = this.calculateBowlPrice(item.bowl).price;
    const originalPrice = item.bowl.totalPrice || currentPrice;
    const priceChanged = Math.abs(currentPrice - originalPrice) > 0.01;

    if (priceChanged) {
      warnings.push({
        code: 'PRICE_CHANGED',
        message: `Price has changed from $${(originalPrice / 100).toFixed(2)} to $${(currentPrice / 100).toFixed(2)}`,
        severity: 'warning',
        dismissible: false
      });
    }

    return {
      itemId: item.id,
      isValid: errors.length === 0,
      errors,
      warnings,
      availabilityStatus,
      priceChanged,
      originalPrice: priceChanged ? originalPrice : undefined,
      currentPrice: priceChanged ? currentPrice : undefined
    };
  }

  /**
   * Calculate bowl weight
   */
  private calculateBowlWeight(bowl: Partial<BowlComposition>): number {
    let weight = 0;
    
    if (bowl.base) weight += bowl.base.weight;
    if (bowl.protein) weight += bowl.protein.weight;
    
    bowl.sides?.forEach(side => weight += side.weight);
    bowl.extraSides?.forEach(side => weight += side.weight);
    bowl.extraProtein?.forEach(protein => weight += protein.weight);
    
    if (bowl.sauce) weight += bowl.sauce.weight;
    if (bowl.garnish) weight += bowl.garnish.weight;
    
    return weight;
  }

  /**
   * Calculate bowl price with error handling
   */
  private calculateBowlPrice(bowl: Partial<BowlComposition>): { price: number; status: 'calculated' | 'estimated' | 'error' } {
    try {
      let price = 0;
      
      // Base price (usually included)
      if (bowl.base) price += bowl.base.price || 0;
      
      // Protein price
      if (bowl.protein) price += bowl.protein.price || 0;
      
      // Sides prices
      bowl.sides?.forEach(side => price += side.price || 0);
      bowl.extraSides?.forEach(side => price += side.price || 0);
      bowl.extraProtein?.forEach(protein => price += protein.price || 0);
      
      // Sauce and garnish (usually included)
      if (bowl.sauce) price += bowl.sauce.price || 0;
      if (bowl.garnish) price += bowl.garnish.price || 0;
      
      return { price, status: 'calculated' };
    } catch (error) {
      errorHandler.createError(
        'validation',
        'price_calculation_failed',
        'Failed to calculate bowl price',
        'Price calculation error. Estimated pricing shown.',
        error,
        'low'
      );
      
      return { price: 1500, status: 'error' }; // Fallback price
    }
  }

  /**
   * Validate ingredient availability at location
   */
  private validateIngredientAvailability(
    bowl: Partial<BowlComposition>, 
    location: Location, 
    warnings: ValidationWarning[], 
    errors: ValidationError[]
  ): void {
    const unavailableIngredients: string[] = [];
    const limitedIngredients: string[] = [];

    // Check each ingredient (mock implementation)
    const allIngredients = [
      bowl.base,
      bowl.protein,
      ...(bowl.sides || []),
      ...(bowl.extraSides || []),
      ...(bowl.extraProtein || []),
      bowl.sauce,
      bowl.garnish
    ].filter(Boolean) as HeyBoIngredient[];

    allIngredients.forEach(ingredient => {
      // Mock availability check - in real implementation, this would call an API
      if (Math.random() < 0.05) { // 5% chance of unavailability
        unavailableIngredients.push(ingredient.name);
      } else if (Math.random() < 0.1) { // 10% chance of limited availability
        limitedIngredients.push(ingredient.name);
      }
    });

    if (unavailableIngredients.length > 0) {
      errors.push({
        code: 'INGREDIENTS_UNAVAILABLE',
        message: `Unavailable: ${unavailableIngredients.join(', ')}`,
        blocking: false
      });
    }

    if (limitedIngredients.length > 0) {
      warnings.push({
        code: 'INGREDIENTS_LIMITED',
        message: `Limited availability: ${limitedIngredients.join(', ')}`,
        severity: 'warning',
        dismissible: true
      });
    }
  }

  /**
   * Validate allergens in bowl
   */
  private validateAllergens(bowl: Partial<BowlComposition>, warnings: ValidationWarning[]): void {
    const allergens = new Set<string>();
    
    const allIngredients = [
      bowl.base,
      bowl.protein,
      ...(bowl.sides || []),
      ...(bowl.extraSides || []),
      ...(bowl.extraProtein || []),
      bowl.sauce,
      bowl.garnish
    ].filter(Boolean) as HeyBoIngredient[];

    allIngredients.forEach(ingredient => {
      ingredient.allergens?.forEach(allergen => allergens.add(allergen));
    });

    if (allergens.size > 0) {
      warnings.push({
        code: 'ALLERGENS_PRESENT',
        message: `Contains: ${Array.from(allergens).join(', ')}`,
        severity: 'info',
        dismissible: false
      });
    }
  }

  /**
   * Check item availability at location
   */
  private async checkItemAvailability(item: CartItem, location: Location): Promise<'available' | 'limited' | 'unavailable'> {
    // Mock implementation - in real app, this would call availability API
    const random = Math.random();
    if (random < 0.05) return 'unavailable';
    if (random < 0.15) return 'limited';
    return 'available';
  }

  /**
   * Find duplicate items in cart
   */
  private findDuplicateItems(cart: CartItem[]): CartItem[] {
    const seen = new Map<string, CartItem>();
    const duplicates: CartItem[] = [];

    cart.forEach(item => {
      const signature = this.getBowlSignature(item.bowl);
      if (seen.has(signature)) {
        duplicates.push(item);
      } else {
        seen.set(signature, item);
      }
    });

    return duplicates;
  }

  /**
   * Generate bowl signature for duplicate detection
   */
  private getBowlSignature(bowl: BowlComposition): string {
    const parts = [
      bowl.base?.id || '',
      bowl.protein?.id || '',
      (bowl.sides || []).map(s => s.id).sort().join(','),
      (bowl.extraSides || []).map(s => s.id).sort().join(','),
      (bowl.extraProtein || []).map(p => p.id).sort().join(','),
      bowl.sauce?.id || '',
      bowl.garnish?.id || ''
    ];
    
    return parts.join('|');
  }
}

export const validationService = ValidationService.getInstance();
