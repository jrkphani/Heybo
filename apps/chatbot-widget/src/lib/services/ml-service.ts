// HeyBo ML Service - SageMaker Integration with Fallback Strategy
import type { 
  BowlComposition, 
  HeyBoIngredient, 
  UserPreferences, 
  Location,
  MLRecommendationResult,
  MLRecommendationSource
} from '../../types';

interface SageMakerRequest {
  ShopName: string[];
  Cuisine: string[];
  NutrientFilters: Array<{
    Nutrient: string;
    Range: { Min: number; Max: number };
  }>;
  Ingredients: {
    Include: string[];
    Exclude: string[];
    Extra: string[];
  };
  Price: { Target: number };
  AllergenFilters: string[];
  DietFilters: string[];
  LocationContext: {
    location_id: string;
    available_ingredients: string[];
  };
}

interface SageMakerResponse {
  recommendations: Array<{
    bowlComposition: BowlComposition;
    confidence: number;
    reasoning: string;
  }>;
  processingTime: number;
  fallbackUsed: boolean;
}

interface FallbackCache {
  popular: BowlComposition[];
  signature: BowlComposition[];
  cached: BowlComposition[];
  lastUpdated: number;
}

export class MLService {
  private static instance: MLService;
  private sageMakerEndpoint: string;
  private timeout: number = 3000; // 3 seconds
  private cache: Map<string, { data: MLRecommendationResult; expires: number }> = new Map();
  private fallbackCache: FallbackCache;

  static getInstance(): MLService {
    if (!MLService.instance) {
      MLService.instance = new MLService();
    }
    return MLService.instance;
  }

  private constructor() {
    this.sageMakerEndpoint = process.env.NEXT_PUBLIC_SAGEMAKER_ENDPOINT || '';
    this.fallbackCache = {
      popular: [],
      signature: [],
      cached: [],
      lastUpdated: 0
    };
    this.initializeFallbackCache();
  }

  /**
   * Get personalized bowl recommendations with immediate fallback
   */
  async getRecommendations(
    userPreferences: UserPreferences,
    location: Location,
    availableIngredients: HeyBoIngredient[]
  ): Promise<MLRecommendationResult> {
    const cacheKey = this.generateCacheKey(userPreferences, location.id);
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // Start ML processing and fallback simultaneously
    const [mlResult, fallbackResult] = await Promise.allSettled([
      this.callSageMaker(userPreferences, location, availableIngredients),
      this.getFallbackRecommendations(userPreferences, location, availableIngredients)
    ]);

    let result: MLRecommendationResult;

    if (mlResult.status === 'fulfilled' && mlResult.value.recommendations.length > 0) {
      // ML succeeded
      result = {
        recommendations: mlResult.value.recommendations.map(r => r.bowlComposition),
        source: 'ml',
        confidence: mlResult.value.recommendations.reduce((acc, r) => acc + r.confidence, 0) / mlResult.value.recommendations.length,
        fallbackUsed: false
      };
    } else {
      // Use fallback
      const fallback = fallbackResult.status === 'fulfilled' ? fallbackResult.value : this.getEmergencyFallback();
      result = {
        recommendations: fallback.recommendations,
        source: fallback.source,
        confidence: fallback.confidence,
        fallbackUsed: true
      };
    }

    // Cache the result
    this.setCache(cacheKey, result, 30 * 60 * 1000); // 30 minutes
    return result;
  }

  /**
   * Call SageMaker ML endpoint with timeout
   */
  private async callSageMaker(
    userPreferences: UserPreferences,
    location: Location,
    availableIngredients: HeyBoIngredient[]
  ): Promise<SageMakerResponse> {
    const request: SageMakerRequest = this.buildSageMakerRequest(
      userPreferences, 
      location, 
      availableIngredients
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.sageMakerEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SAGEMAKER_API_KEY}`
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`SageMaker API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseSageMakerResponse(data);
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn('SageMaker call failed:', error);
      throw error;
    }
  }

  /**
   * Build SageMaker request payload
   */
  private buildSageMakerRequest(
    userPreferences: UserPreferences,
    location: Location,
    availableIngredients: HeyBoIngredient[]
  ): SageMakerRequest {
    return {
      ShopName: ["heybo"], // Brand-specific
      Cuisine: [], // Can be extended based on user history
      NutrientFilters: this.buildNutrientFilters(userPreferences),
      Ingredients: {
        Include: this.getPreferredIngredients(userPreferences),
        Exclude: this.getExcludedIngredients(userPreferences),
        Extra: []
      },
      Price: { Target: 15 }, // Default target price
      AllergenFilters: userPreferences.allergens,
      DietFilters: userPreferences.dietaryRestrictions,
      LocationContext: {
        location_id: location.id,
        available_ingredients: availableIngredients
          .filter(ing => ing.isAvailable)
          .map(ing => ing.id)
      }
    };
  }

  /**
   * Get fallback recommendations using cached/rule-based logic
   */
  private async getFallbackRecommendations(
    userPreferences: UserPreferences,
    location: Location,
    availableIngredients: HeyBoIngredient[]
  ): Promise<MLRecommendationResult> {
    // Try cached recommendations first
    if (this.fallbackCache.cached.length > 0) {
      return {
        recommendations: this.filterByPreferences(this.fallbackCache.cached, userPreferences).slice(0, 5),
        source: 'cached',
        confidence: 0.7,
        fallbackUsed: true
      };
    }

    // Try popular items
    if (this.fallbackCache.popular.length > 0) {
      return {
        recommendations: this.filterByPreferences(this.fallbackCache.popular, userPreferences).slice(0, 5),
        source: 'popular',
        confidence: 0.6,
        fallbackUsed: true
      };
    }

    // Use signature bowls as last resort
    return {
      recommendations: this.filterByPreferences(this.fallbackCache.signature, userPreferences).slice(0, 5),
      source: 'signature',
      confidence: 0.5,
      fallbackUsed: true
    };
  }

  /**
   * Emergency fallback with minimal recommendations
   */
  private getEmergencyFallback(): MLRecommendationResult {
    const basicBowl: BowlComposition = {
      id: 'emergency-fallback-bowl',
      name: 'Build Your Own Bowl',
      description: 'Start with our popular grain base and customize to your taste',
      base: {
        id: 'brown-rice',
        name: 'Brown Rice',
        category: 'base',
        subcategory: 'grains',
        isAvailable: true,
        isVegan: true,
        isGlutenFree: true,
        allergens: [],
        nutritionalInfo: {
          calories: 150,
          protein: 3,
          carbs: 30,
          fat: 1,
          fiber: 2,
          sodium: 0
        },
        weight: 150,
        price: 0,
        description: 'Nutritious brown rice base',
        imageUrl: ''
      },
      extraProtein: [],
      sides: [],
      extraSides: [],
      totalWeight: 150,
      totalPrice: 800,
      isSignature: false,
      isAvailable: true
    };

    return {
      recommendations: [basicBowl],
      source: 'signature',
      confidence: 0.3,
      fallbackUsed: true
    };
  }

  /**
   * Initialize fallback cache with popular/signature items
   */
  private async initializeFallbackCache(): Promise<void> {
    try {
      // This would typically call the popular items API
      const popularResponse = await this.fetchPopularItems();
      this.fallbackCache.popular = popularResponse;

      // This would typically call the signature bowls API
      const signatureResponse = await this.fetchSignatureBowls();
      this.fallbackCache.signature = signatureResponse;

      this.fallbackCache.lastUpdated = Date.now();
    } catch (error) {
      console.warn('Failed to initialize fallback cache:', error);
    }
  }

  /**
   * Filter recommendations by user preferences
   */
  private filterByPreferences(
    bowls: BowlComposition[], 
    preferences: UserPreferences
  ): BowlComposition[] {
    return bowls.filter(bowl => {
      // Check dietary restrictions
      if (preferences.dietaryRestrictions.includes('vegan')) {
        // Would need to check if all ingredients are vegan
      }
      
      if (preferences.dietaryRestrictions.includes('gluten-free')) {
        // Would need to check if all ingredients are gluten-free
      }

      // Check allergens
      const hasAllergens = preferences.allergens.some(allergen => {
        // Would need to check if bowl contains any user allergens
        return false; // Simplified for now
      });

      return !hasAllergens;
    });
  }

  /**
   * Build nutrient filters based on user preferences
   */
  private buildNutrientFilters(preferences: UserPreferences): Array<{
    Nutrient: string;
    Range: { Min: number; Max: number };
  }> {
    const filters = [];

    // Default protein filter
    filters.push({
      Nutrient: "Protein",
      Range: { Min: 10, Max: 60 }
    });

    // Adjust based on protein preference
    if (preferences.proteinPreference === 'plant-based') {
      // Higher plant protein targets
      filters.push({
        Nutrient: "Fiber",
        Range: { Min: 5, Max: 20 }
      });
    }

    return filters;
  }

  /**
   * Get preferred ingredients based on user preferences
   */
  private getPreferredIngredients(preferences: UserPreferences): string[] {
    const preferred = [];

    if (preferences.proteinPreference === 'plant-based') {
      preferred.push('tofu', 'tempeh', 'legumes');
    }

    if (preferences.dietaryRestrictions.includes('vegan')) {
      preferred.push('vegetables', 'grains', 'legumes');
    }

    return preferred;
  }

  /**
   * Get excluded ingredients based on user preferences
   */
  private getExcludedIngredients(preferences: UserPreferences): string[] {
    const excluded = [];

    // Add allergens to excluded list
    excluded.push(...preferences.allergens);

    // Add dietary restriction exclusions
    if (preferences.dietaryRestrictions.includes('vegan')) {
      excluded.push('meat', 'dairy', 'eggs');
    }

    if (preferences.dietaryRestrictions.includes('vegetarian')) {
      excluded.push('meat', 'fish', 'seafood');
    }

    return excluded;
  }

  /**
   * Fetch popular items (would call actual API)
   */
  private async fetchPopularItems(): Promise<BowlComposition[]> {
    // Mock implementation - would call actual popular items API
    return [];
  }

  /**
   * Fetch signature bowls (would call actual API)
   */
  private async fetchSignatureBowls(): Promise<BowlComposition[]> {
    // Mock implementation - would call actual signature bowls API
    return [];
  }

  /**
   * Parse SageMaker response
   */
  private parseSageMakerResponse(data: any): SageMakerResponse {
    return {
      recommendations: data.recommendations || [],
      processingTime: data.processingTime || 0,
      fallbackUsed: false
    };
  }

  /**
   * Generate cache key for recommendations
   */
  private generateCacheKey(preferences: UserPreferences, locationId: string): string {
    const prefString = JSON.stringify(preferences);
    return `ml_rec_${locationId}_${btoa(prefString).slice(0, 16)}`;
  }

  /**
   * Cache management methods
   */
  private getFromCache(key: string): MLRecommendationResult | null {
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: MLRecommendationResult, ttlMs: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttlMs
    });
  }

  /**
   * Health check for ML service
   */
  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'down'; details: string }> {
    try {
      // Quick health check to SageMaker endpoint
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);

      const response = await fetch(`${this.sageMakerEndpoint}/health`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return { status: 'healthy', details: 'ML service operational' };
      } else {
        return { status: 'degraded', details: 'ML service responding with errors' };
      }
    } catch (error) {
      return { 
        status: 'down', 
        details: `ML service unavailable: ${error}. Fallback active.` 
      };
    }
  }
}

// Export singleton instance
export const mlService = MLService.getInstance(); 