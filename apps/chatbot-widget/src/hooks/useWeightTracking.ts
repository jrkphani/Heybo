import { useState, useEffect, useCallback } from 'react';
import { 
  validateBowlWeight, 
  canAddIngredient, 
  getWeightStatusDisplay,
  HEYBO_WEIGHT_CONFIG,
  type WeightValidationConfig,
  type WeightValidationResult,
  type IngredientWeight
} from '../lib/utils/weight-validation';

export interface UseWeightTrackingOptions {
  config?: WeightValidationConfig;
  onWeightWarning?: (result: WeightValidationResult) => void;
  onWeightExceeded?: (result: WeightValidationResult) => void;
  onWeightSafe?: (result: WeightValidationResult) => void;
}

export interface WeightTrackingState {
  ingredients: IngredientWeight[];
  currentWeight: number;
  validationResult: WeightValidationResult;
  statusDisplay: ReturnType<typeof getWeightStatusDisplay>;
  hasShownWarning: boolean;
  hasShownExceeded: boolean;
}

export function useWeightTracking(options: UseWeightTrackingOptions = {}) {
  const {
    config = HEYBO_WEIGHT_CONFIG,
    onWeightWarning,
    onWeightExceeded,
    onWeightSafe
  } = options;

  const [state, setState] = useState<WeightTrackingState>(() => {
    const initialResult = validateBowlWeight([], config);
    return {
      ingredients: [],
      currentWeight: 0,
      validationResult: initialResult,
      statusDisplay: getWeightStatusDisplay(0, config),
      hasShownWarning: false,
      hasShownExceeded: false
    };
  });

  // Update validation when ingredients change
  const updateValidation = useCallback((ingredients: IngredientWeight[]) => {
    const validationResult = validateBowlWeight(ingredients, config);
    const statusDisplay = getWeightStatusDisplay(validationResult.currentWeight, config);
    
    setState(prev => ({
      ...prev,
      ingredients,
      currentWeight: validationResult.currentWeight,
      validationResult,
      statusDisplay
    }));

    return validationResult;
  }, [config]);

  // Handle weight threshold notifications
  useEffect(() => {
    const { validationResult, hasShownWarning, hasShownExceeded } = state;
    
    if (validationResult.status === 'exceeded' && !hasShownExceeded) {
      setState(prev => ({ ...prev, hasShownExceeded: true }));
      onWeightExceeded?.(validationResult);
    } else if (
      (validationResult.status === 'warning' || validationResult.status === 'critical') && 
      !hasShownWarning
    ) {
      setState(prev => ({ ...prev, hasShownWarning: true }));
      onWeightWarning?.(validationResult);
    } else if (validationResult.status === 'safe') {
      // Reset warnings when weight becomes safe
      if (hasShownWarning || hasShownExceeded) {
        setState(prev => ({ 
          ...prev, 
          hasShownWarning: false, 
          hasShownExceeded: false 
        }));
        onWeightSafe?.(validationResult);
      }
    }
  }, [state.validationResult, state.hasShownWarning, state.hasShownExceeded, onWeightWarning, onWeightExceeded, onWeightSafe]);

  // Add ingredient with validation
  const addIngredient = useCallback((ingredient: IngredientWeight): WeightValidationResult => {
    const newIngredients = [...state.ingredients, ingredient];
    return updateValidation(newIngredients);
  }, [state.ingredients, updateValidation]);

  // Remove ingredient
  const removeIngredient = useCallback((ingredientId: string): WeightValidationResult => {
    const newIngredients = state.ingredients.filter(ing => ing.id !== ingredientId);
    return updateValidation(newIngredients);
  }, [state.ingredients, updateValidation]);

  // Update ingredient (e.g., change portion size)
  const updateIngredient = useCallback((ingredientId: string, updates: Partial<IngredientWeight>): WeightValidationResult => {
    const newIngredients = state.ingredients.map(ing => 
      ing.id === ingredientId ? { ...ing, ...updates } : ing
    );
    return updateValidation(newIngredients);
  }, [state.ingredients, updateValidation]);

  // Replace ingredient (e.g., swap protein)
  const replaceIngredient = useCallback((oldIngredientId: string, newIngredient: IngredientWeight): WeightValidationResult => {
    const newIngredients = state.ingredients.map(ing => 
      ing.id === oldIngredientId ? newIngredient : ing
    );
    return updateValidation(newIngredients);
  }, [state.ingredients, updateValidation]);

  // Check if ingredient can be added without exceeding limits
  const canAddIngredientSafely = useCallback((ingredient: IngredientWeight): WeightValidationResult => {
    return canAddIngredient(state.ingredients, ingredient, config);
  }, [state.ingredients, config]);

  // Set all ingredients at once (e.g., loading from saved bowl)
  const setIngredients = useCallback((ingredients: IngredientWeight[]): WeightValidationResult => {
    return updateValidation(ingredients);
  }, [updateValidation]);

  // Reset all ingredients
  const resetIngredients = useCallback((): WeightValidationResult => {
    return updateValidation([]);
  }, [updateValidation]);

  // Get ingredients by category
  const getIngredientsByCategory = useCallback((category: IngredientWeight['category']) => {
    return state.ingredients.filter(ing => ing.category === category);
  }, [state.ingredients]);

  // Get weight by category
  const getWeightByCategory = useCallback((category: IngredientWeight['category']) => {
    return state.ingredients
      .filter(ing => ing.category === category)
      .reduce((total, ing) => total + ing.weight, 0);
  }, [state.ingredients]);

  // Get remaining weight capacity
  const getRemainingCapacity = useCallback(() => {
    return Math.max(0, config.maxWeight - state.currentWeight);
  }, [state.currentWeight, config.maxWeight]);

  // Get weight percentage
  const getWeightPercentage = useCallback(() => {
    return Math.min((state.currentWeight / config.maxWeight) * 100, 100);
  }, [state.currentWeight, config.maxWeight]);

  // Check if bowl is at capacity for a category
  const isCategoryAtCapacity = useCallback((category: IngredientWeight['category'], maxItems: number = 3) => {
    return getIngredientsByCategory(category).length >= maxItems;
  }, [getIngredientsByCategory]);

  // Get weight distribution
  const getWeightDistribution = useCallback(() => {
    const distribution = {
      base: 0,
      protein: 0,
      sides: 0,
      sauce: 0,
      garnish: 0
    };

    state.ingredients.forEach(ingredient => {
      distribution[ingredient.category] += ingredient.weight;
    });

    return distribution;
  }, [state.ingredients]);

  // Get heaviest ingredients (for suggestions)
  const getHeaviestIngredients = useCallback((limit: number = 3) => {
    return [...state.ingredients]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, limit);
  }, [state.ingredients]);

  return {
    // State
    ingredients: state.ingredients,
    currentWeight: state.currentWeight,
    validationResult: state.validationResult,
    statusDisplay: state.statusDisplay,
    isValid: state.validationResult.isValid,
    status: state.validationResult.status,
    
    // Actions
    addIngredient,
    removeIngredient,
    updateIngredient,
    replaceIngredient,
    setIngredients,
    resetIngredients,
    
    // Validation
    canAddIngredientSafely,
    
    // Queries
    getIngredientsByCategory,
    getWeightByCategory,
    getRemainingCapacity,
    getWeightPercentage,
    isCategoryAtCapacity,
    getWeightDistribution,
    getHeaviestIngredients,
    
    // Configuration
    config
  };
}
