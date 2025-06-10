import type { HeyBoIngredient, IngredientCategory, NutritionalInfo, Allergen } from '../types';

// Helper function to create complete ingredient objects for mock data
export function createMockIngredient(
  id: string,
  name: string,
  category: IngredientCategory,
  subcategory: string,
  weight: number,
  price: number,
  options: {
    isVegan?: boolean;
    isGlutenFree?: boolean;
    allergens?: Allergen[];
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sodium?: number;
    description?: string;
    imageUrl?: string;
  } = {}
): HeyBoIngredient {
  const nutritionalInfo: NutritionalInfo = {
    calories: options.calories ?? 0,
    protein: options.protein ?? 0,
    carbs: options.carbs ?? 0,
    fat: options.fat ?? 0,
    fiber: options.fiber ?? 0,
    sodium: options.sodium ?? 0,
  };

  return {
    id,
    name,
    category,
    subcategory,
    isAvailable: true,
    isVegan: options.isVegan ?? false,
    isGlutenFree: options.isGlutenFree ?? false,
    allergens: options.allergens ?? [],
    nutritionalInfo,
    weight,
    price,
    description: options.description ?? `Fresh ${name.toLowerCase()}`,
    imageUrl: options.imageUrl ?? `/ingredients/${id}.jpg`,
  };
}

// Pre-defined mock ingredients for common use
export const mockIngredients = {
  // Bases
  brownRice: createMockIngredient('base-1', 'Brown Rice', 'base', 'grains', 150, 0, {
    isVegan: true,
    isGlutenFree: true,
    calories: 110,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    fiber: 1.8,
    sodium: 5,
    description: 'Nutritious brown rice base',
  }),
  
  quinoa: createMockIngredient('base-2', 'Quinoa', 'base', 'grains', 150, 200, {
    isVegan: true,
    isGlutenFree: true,
    calories: 120,
    protein: 4.4,
    carbs: 22,
    fat: 1.9,
    fiber: 2.8,
    sodium: 7,
    description: 'Protein-rich quinoa base',
  }),
  
  cauliflowerRice: createMockIngredient('base-3', 'Cauliflower Lentil Rice', 'base', 'vegetables', 150, 150, {
    isVegan: true,
    isGlutenFree: true,
    calories: 85,
    protein: 6.2,
    carbs: 15,
    fat: 0.8,
    fiber: 4.1,
    sodium: 12,
    description: 'Low-carb cauliflower and lentil rice',
  }),

  // Proteins
  grilledChicken: createMockIngredient('protein-1', 'Grilled Chicken', 'protein', 'meat', 100, 500, {
    isVegan: false,
    isGlutenFree: true,
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sodium: 74,
    description: 'Tender grilled chicken breast',
  }),
  
  steak: createMockIngredient('protein-2', 'Steak', 'protein', 'meat', 100, 700, {
    isVegan: false,
    isGlutenFree: true,
    calories: 250,
    protein: 26,
    carbs: 0,
    fat: 15,
    fiber: 0,
    sodium: 54,
    description: 'Premium beef steak',
  }),
  
  salmon: createMockIngredient('protein-3', 'Salmon', 'protein', 'seafood', 100, 600, {
    isVegan: false,
    isGlutenFree: true,
    calories: 208,
    protein: 22,
    carbs: 0,
    fat: 12,
    fiber: 0,
    sodium: 59,
    description: 'Fresh Atlantic salmon',
  }),
  
  tofu: createMockIngredient('protein-4', 'Tofu', 'protein', 'plant-based', 100, 400, {
    isVegan: true,
    isGlutenFree: true,
    allergens: ['soy' as Allergen],
    calories: 76,
    protein: 8,
    carbs: 1.9,
    fat: 4.8,
    fiber: 0.3,
    sodium: 7,
    description: 'Organic firm tofu',
  }),
  
  falafels: createMockIngredient('protein-5', 'Falafels', 'protein', 'plant-based', 100, 450, {
    isVegan: true,
    isGlutenFree: false,
    allergens: ['gluten' as Allergen],
    calories: 333,
    protein: 13,
    carbs: 32,
    fat: 18,
    fiber: 5,
    sodium: 294,
    description: 'Crispy chickpea falafels',
  }),
};
