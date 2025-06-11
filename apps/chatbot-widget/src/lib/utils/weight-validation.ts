// HeyBo Weight Validation Utilities
// Official HeyBo Specification: 900g max weight, 720g warning threshold

export interface WeightValidationConfig {
  maxWeight: number;
  warningThreshold: number;
  criticalThreshold: number;
}

export interface WeightValidationResult {
  isValid: boolean;
  status: 'safe' | 'warning' | 'critical' | 'exceeded';
  currentWeight: number;
  remainingWeight: number;
  warningMessage?: string;
  errorMessage?: string;
  suggestions?: string[];
}

export interface IngredientWeight {
  id: string;
  name: string;
  weight: number;
  category: 'base' | 'protein' | 'sides' | 'sauce' | 'garnish';
}

// HeyBo Official Weight Configuration
export const HEYBO_WEIGHT_CONFIG: WeightValidationConfig = {
  maxWeight: 900,        // 900g maximum bowl weight
  warningThreshold: 720, // 80% threshold (720g) - show warning
  criticalThreshold: 850 // 95% threshold (850g) - show critical warning
};

/**
 * Validates the total weight of a bowl composition
 */
export function validateBowlWeight(
  ingredients: IngredientWeight[],
  config: WeightValidationConfig = HEYBO_WEIGHT_CONFIG
): WeightValidationResult {
  const currentWeight = ingredients.reduce((total, ingredient) => total + ingredient.weight, 0);
  const remainingWeight = config.maxWeight - currentWeight;
  const weightPercentage = (currentWeight / config.maxWeight) * 100;

  // Determine status
  let status: WeightValidationResult['status'] = 'safe';
  let warningMessage: string | undefined;
  let errorMessage: string | undefined;
  let suggestions: string[] = [];

  if (currentWeight > config.maxWeight) {
    status = 'exceeded';
    errorMessage = `Bowl weight exceeds maximum limit by ${currentWeight - config.maxWeight}g. Please remove some ingredients.`;
    suggestions = generateWeightReductionSuggestions(ingredients, currentWeight - config.maxWeight);
  } else if (currentWeight >= config.criticalThreshold) {
    status = 'critical';
    warningMessage = `Bowl is very heavy (${Math.round(weightPercentage)}% of limit). Consider lighter options.`;
    suggestions = generateLighterAlternatives(ingredients);
  } else if (currentWeight >= config.warningThreshold) {
    status = 'warning';
    warningMessage = `Bowl is getting heavy (${Math.round(weightPercentage)}% of limit). Choose remaining ingredients carefully.`;
  }

  return {
    isValid: currentWeight <= config.maxWeight,
    status,
    currentWeight,
    remainingWeight,
    warningMessage,
    errorMessage,
    suggestions
  };
}

/**
 * Checks if adding a new ingredient would exceed weight limits
 */
export function canAddIngredient(
  currentIngredients: IngredientWeight[],
  newIngredient: IngredientWeight,
  config: WeightValidationConfig = HEYBO_WEIGHT_CONFIG
): WeightValidationResult {
  const updatedIngredients = [...currentIngredients, newIngredient];
  return validateBowlWeight(updatedIngredients, config);
}

/**
 * Generates suggestions for reducing bowl weight
 */
function generateWeightReductionSuggestions(
  ingredients: IngredientWeight[],
  excessWeight: number
): string[] {
  const suggestions: string[] = [];
  
  // Sort ingredients by weight (heaviest first)
  const sortedIngredients = [...ingredients].sort((a, b) => b.weight - a.weight);
  
  // Find combinations that could reduce the excess weight
  let targetReduction = excessWeight;
  const candidatesForRemoval: IngredientWeight[] = [];
  
  for (const ingredient of sortedIngredients) {
    if (ingredient.category !== 'base') { // Don't suggest removing base
      candidatesForRemoval.push(ingredient);
      targetReduction -= ingredient.weight;
      
      if (targetReduction <= 0) break;
    }
  }
  
  if (candidatesForRemoval.length > 0) {
    suggestions.push(`Consider removing: ${candidatesForRemoval.map(i => i.name).join(', ')}`);
  }
  
  // Category-specific suggestions
  const heavyProteins = ingredients.filter(i => i.category === 'protein' && i.weight > 150);
  if (heavyProteins.length > 0) {
    suggestions.push('Try a lighter protein option');
  }
  
  const manySides = ingredients.filter(i => i.category === 'sides');
  if (manySides.length > 2) {
    suggestions.push('Reduce the number of side ingredients');
  }
  
  return suggestions;
}

/**
 * Generates suggestions for lighter alternatives
 */
function generateLighterAlternatives(ingredients: IngredientWeight[]): string[] {
  const suggestions: string[] = [];
  
  // Check for heavy ingredients and suggest alternatives
  const heavyIngredients = ingredients.filter(i => i.weight > 120);
  
  if (heavyIngredients.length > 0) {
    suggestions.push('Consider lighter portions for heavy ingredients');
  }
  
  const proteinIngredients = ingredients.filter(i => i.category === 'protein');
  if (proteinIngredients.some(p => p.weight > 150)) {
    suggestions.push('Try tofu or lighter protein options');
  }
  
  const sideIngredients = ingredients.filter(i => i.category === 'sides');
  if (sideIngredients.length > 2) {
    suggestions.push('Choose fewer side ingredients');
  }
  
  return suggestions;
}

/**
 * Calculates optimal ingredient portions to stay within weight limits
 */
export function calculateOptimalPortions(
  ingredients: IngredientWeight[],
  targetWeight: number = HEYBO_WEIGHT_CONFIG.warningThreshold
): IngredientWeight[] {
  const currentWeight = ingredients.reduce((total, ingredient) => total + ingredient.weight, 0);
  
  if (currentWeight <= targetWeight) {
    return ingredients; // Already within target
  }
  
  const reductionFactor = targetWeight / currentWeight;
  
  return ingredients.map(ingredient => ({
    ...ingredient,
    weight: Math.round(ingredient.weight * reductionFactor)
  }));
}

/**
 * Gets weight status with color coding for UI
 */
export function getWeightStatusDisplay(
  currentWeight: number,
  config: WeightValidationConfig = HEYBO_WEIGHT_CONFIG
) {
  const percentage = (currentWeight / config.maxWeight) * 100;
  
  if (currentWeight > config.maxWeight) {
    return {
      status: 'exceeded',
      color: 'red',
      message: `${currentWeight}g (${Math.round(percentage)}%) - Exceeds limit!`,
      className: 'text-red-600 bg-red-50 border-red-200'
    };
  } else if (currentWeight >= config.criticalThreshold) {
    return {
      status: 'critical',
      color: 'orange',
      message: `${currentWeight}g (${Math.round(percentage)}%) - Very heavy`,
      className: 'text-orange-600 bg-orange-50 border-orange-200'
    };
  } else if (currentWeight >= config.warningThreshold) {
    return {
      status: 'warning',
      color: 'yellow',
      message: `${currentWeight}g (${Math.round(percentage)}%) - Getting heavy`,
      className: 'text-yellow-600 bg-yellow-50 border-yellow-200'
    };
  } else {
    return {
      status: 'safe',
      color: 'green',
      message: `${currentWeight}g (${Math.round(percentage)}%) - Good weight`,
      className: 'text-green-600 bg-green-50 border-green-200'
    };
  }
}

/**
 * Formats weight for display
 */
export function formatWeight(weight: number): string {
  if (weight >= 1000) {
    return `${(weight / 1000).toFixed(1)}kg`;
  }
  return `${weight}g`;
}

/**
 * Calculates weight distribution by category
 */
export function getWeightDistribution(ingredients: IngredientWeight[]) {
  const distribution = {
    base: 0,
    protein: 0,
    sides: 0,
    sauce: 0,
    garnish: 0
  };
  
  ingredients.forEach(ingredient => {
    distribution[ingredient.category] += ingredient.weight;
  });
  
  const total = Object.values(distribution).reduce((sum, weight) => sum + weight, 0);
  
  return {
    weights: distribution,
    percentages: {
      base: total > 0 ? Math.round((distribution.base / total) * 100) : 0,
      protein: total > 0 ? Math.round((distribution.protein / total) * 100) : 0,
      sides: total > 0 ? Math.round((distribution.sides / total) * 100) : 0,
      sauce: total > 0 ? Math.round((distribution.sauce / total) * 100) : 0,
      garnish: total > 0 ? Math.round((distribution.garnish / total) * 100) : 0
    },
    total
  };
}
