'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChefHat,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Minus,
  Scale,
  AlertTriangle,
  Info,
  Sparkles,
  Filter,
  Zap,
  Heart,
  Wheat,
  Leaf,
  Clock,
  ShoppingCart
} from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { useLayoutStore } from '../../store/layout-store';
import { BowlPreviewV2 } from '../bowl/BowlPreviewV2';
import { cn } from '../../lib/utils';

// Types
type StepType = 'base' | 'protein' | 'sides' | 'sauce' | 'garnish' | 'review';
type DietaryPreference = 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'keto' | 'low-carb';

interface Ingredient {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number; // in cents
  weight: number; // in grams
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  allergens: string[];
  dietaryTags: DietaryPreference[];
  icon: string;
  description: string;
  available: boolean;
  popular?: boolean;
}

interface SelectedIngredient extends Ingredient {
  quantity: number;
  totalPrice: number;
  totalWeight: number;
}

interface CreateYourOwnFlowV2Props {
  onBowlComplete?: (bowl: any) => void;
  onAddToCart?: (bowl: any) => void;
  className?: string;
}

const BOWL_STEPS: { id: StepType; title: string; description: string; required: boolean }[] = [
  { id: 'base', title: 'Choose Base', description: 'Start with your foundation', required: true },
  { id: 'protein', title: 'Add Protein', description: 'Power up your bowl', required: false },
  { id: 'sides', title: 'Select Sides', description: 'Add your favorites (up to 3)', required: false },
  { id: 'sauce', title: 'Pick Sauce', description: 'Bring it all together', required: false },
  { id: 'garnish', title: 'Final Touch', description: 'Perfect finishing touches', required: false },
  { id: 'review', title: 'Review & Confirm', description: 'Make it yours', required: false }
];

const WEIGHT_LIMITS = {
  WARNING: 720, // 80% of max
  MAXIMUM: 900  // absolute max
};

export function CreateYourOwnFlowV2({
  onBowlComplete,
  onAddToCart,
  className
}: CreateYourOwnFlowV2Props) {
  const { addMessage } = useChatbotStore();
  const { navigateToStage } = useLayoutStore();

  // State management
  const [currentStep, setCurrentStep] = useState<StepType>('base');
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([]);
  const [showDietaryFilter, setShowDietaryFilter] = useState(false);
  const [bowlName, setBowlName] = useState('');

  // Mock ingredient data - in real app, this would come from API
  const mockIngredients: Ingredient[] = [
    // Bases
    {
      id: 'base-1',
      name: 'Brown Rice',
      category: 'base',
      price: 0, // included in base price
      weight: 150,
      calories: 220,
      protein: 5,
      carbs: 45,
      fat: 2,
      allergens: [],
      dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
      icon: '🍚',
      description: 'Nutty, wholesome brown rice',
      available: true,
      popular: true
    },
    {
      id: 'base-2',
      name: 'Quinoa',
      category: 'base',
      price: 200, // premium base
      weight: 140,
      calories: 185,
      protein: 8,
      carbs: 32,
      fat: 3,
      allergens: [],
      dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
      icon: '🌾',
      description: 'Complete protein superfood',
      available: true,
      popular: true
    },
    {
      id: 'base-3',
      name: 'Cauliflower Rice',
      category: 'base',
      price: 100,
      weight: 120,
      calories: 25,
      protein: 2,
      carbs: 5,
      fat: 0,
      allergens: [],
      dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'keto', 'low-carb'],
      icon: '🥬',
      description: 'Light and fresh cauliflower',
      available: true
    },

    // Proteins
    {
      id: 'protein-1',
      name: 'Grilled Chicken',
      category: 'protein',
      price: 400,
      weight: 120,
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 4,
      allergens: [],
      dietaryTags: [],
      icon: '🍗',
      description: 'Tender, seasoned chicken breast',
      available: true,
      popular: true
    },
    {
      id: 'protein-2',
      name: 'Spicy Tofu',
      category: 'protein',
      price: 350,
      weight: 100,
      calories: 144,
      protein: 15,
      carbs: 5,
      fat: 8,
      allergens: ['soy'],
      dietaryTags: ['vegetarian', 'vegan'],
      icon: '🌶️',
      description: 'Marinated in bold spices',
      available: true,
      popular: true
    },
    {
      id: 'protein-3',
      name: 'Grilled Salmon',
      category: 'protein',
      price: 600,
      weight: 110,
      calories: 206,
      protein: 22,
      carbs: 0,
      fat: 12,
      allergens: ['fish'],
      dietaryTags: [],
      icon: '🐟',
      description: 'Wild-caught, omega-3 rich',
      available: true
    },

    // Sides
    {
      id: 'side-1',
      name: 'Roasted Vegetables',
      category: 'sides',
      price: 150,
      weight: 80,
      calories: 50,
      protein: 2,
      carbs: 12,
      fat: 0,
      allergens: [],
      dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
      icon: '🥕',
      description: 'Seasonal vegetables roasted to perfection',
      available: true,
      popular: true
    },
    {
      id: 'side-2',
      name: 'Avocado',
      category: 'sides',
      price: 200,
      weight: 60,
      calories: 120,
      protein: 2,
      carbs: 6,
      fat: 11,
      allergens: [],
      dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'keto'],
      icon: '🥑',
      description: 'Creamy, fresh avocado slices',
      available: true,
      popular: true
    },
    {
      id: 'side-3',
      name: 'Chickpeas',
      category: 'sides',
      price: 100,
      weight: 70,
      calories: 134,
      protein: 7,
      carbs: 22,
      fat: 2,
      allergens: [],
      dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
      icon: '🫛',
      description: 'Protein-packed legumes',
      available: true
    },
    {
      id: 'side-4',
      name: 'Sweet Potato',
      category: 'sides',
      price: 120,
      weight: 85,
      calories: 103,
      protein: 2,
      carbs: 24,
      fat: 0,
      allergens: [],
      dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
      icon: '🍠',
      description: 'Naturally sweet and nutritious',
      available: true
    },

    // Sauces
    {
      id: 'sauce-1',
      name: 'Tahini',
      category: 'sauce',
      price: 50,
      weight: 30,
      calories: 178,
      protein: 5,
      carbs: 6,
      fat: 16,
      allergens: ['sesame'],
      dietaryTags: ['vegetarian', 'vegan'],
      icon: '🥜',
      description: 'Creamy sesame seed sauce',
      available: true,
      popular: true
    },
    {
      id: 'sauce-2',
      name: 'Lemon Herb',
      category: 'sauce',
      price: 50,
      weight: 25,
      calories: 45,
      protein: 0,
      carbs: 2,
      fat: 4,
      allergens: [],
      dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
      icon: '🍋',
      description: 'Fresh and zesty',
      available: true,
      popular: true
    },
    {
      id: 'sauce-3',
      name: 'Sriracha Mayo',
      category: 'sauce',
      price: 50,
      weight: 25,
      calories: 90,
      protein: 0,
      carbs: 2,
      fat: 10,
      allergens: ['eggs'],
      dietaryTags: ['vegetarian'],
      icon: '🌶️',
      description: 'Spicy and creamy kick',
      available: true
    },

    // Garnishes
    {
      id: 'garnish-1',
      name: 'Fresh Herbs',
      category: 'garnish',
      price: 25,
      weight: 5,
      calories: 5,
      protein: 0,
      carbs: 1,
      fat: 0,
      allergens: [],
      dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
      icon: '🌿',
      description: 'Cilantro, parsley, and mint',
      available: true,
      popular: true
    },
    {
      id: 'garnish-2',
      name: 'Sesame Seeds',
      category: 'garnish',
      price: 25,
      weight: 10,
      calories: 52,
      protein: 2,
      carbs: 2,
      fat: 4,
      allergens: ['sesame'],
      dietaryTags: ['vegetarian', 'vegan'],
      icon: '🌰',
      description: 'Toasted for extra crunch',
      available: true
    },
    {
      id: 'garnish-3',
      name: 'Pumpkin Seeds',
      category: 'garnish',
      price: 30,
      weight: 10,
      calories: 30,
      protein: 1,
      carbs: 1,
      fat: 2,
      allergens: [],
      dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'keto'],
      icon: '🎃',
      description: 'Crunchy and nutritious',
      available: true
    }
  ];

  // Computed values
  const currentStepData = BOWL_STEPS.find(step => step.id === currentStep)!;
  const currentStepIndex = BOWL_STEPS.findIndex(step => step.id === currentStep);
  const totalWeight = selectedIngredients.reduce((sum, ing) => sum + ing.totalWeight, 0);
  const totalPrice = selectedIngredients.reduce((sum, ing) => sum + ing.totalPrice, 0);
  const totalCalories = selectedIngredients.reduce((sum, ing) => sum + (ing.calories * ing.quantity), 0);
  const totalProtein = selectedIngredients.reduce((sum, ing) => sum + (ing.protein * ing.quantity), 0);

  // Filter ingredients based on current step and dietary preferences
  const availableIngredients = useMemo(() => {
    let filtered = mockIngredients.filter(ing => {
      // Filter by current step
      if (ing.category !== currentStep) return false;
      
      // Filter by availability
      if (!ing.available) return false;
      
      // Filter by dietary preferences
      if (dietaryPreferences.length > 0) {
        return dietaryPreferences.every(pref => ing.dietaryTags.includes(pref));
      }
      
      return true;
    });

    // Sort: popular first, then alphabetical
    return filtered.sort((a, b) => {
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [currentStep, dietaryPreferences]);

  // Weight warning state
  const weightWarning = useMemo(() => {
    if (totalWeight >= WEIGHT_LIMITS.MAXIMUM) {
      return { level: 'error', message: 'Maximum bowl weight reached! Consider removing some ingredients.' };
    } else if (totalWeight >= WEIGHT_LIMITS.WARNING) {
      return { level: 'warning', message: 'Your bowl is getting quite full! Consider finalizing soon.' };
    }
    return null;
  }, [totalWeight]);

  // Progress calculation
  const completedSteps = BOWL_STEPS.filter(step => {
    if (step.id === 'review') return false;
    if (step.required) {
      return selectedIngredients.some(ing => ing.category === step.id);
    }
    return true; // Optional steps are considered complete by default
  }).length;

  const progress = Math.round((completedSteps / (BOWL_STEPS.length - 1)) * 100); // Exclude review step

  // Handlers
  const handleIngredientSelect = (ingredient: Ingredient) => {
    const existing = selectedIngredients.find(ing => ing.id === ingredient.id);
    
    if (existing) {
      // Remove if already selected and it's an optional category, or toggle quantity if multiple allowed
      if (['sides', 'garnish'].includes(ingredient.category)) {
        setSelectedIngredients(prev => prev.filter(ing => ing.id !== ingredient.id));
      } else {
        // For base, protein, sauce - replace existing
        setSelectedIngredients(prev => 
          prev.filter(ing => ing.category !== ingredient.category).concat([{
            ...ingredient,
            quantity: 1,
            totalPrice: ingredient.price,
            totalWeight: ingredient.weight
          }])
        );
      }
    } else {
      // Check weight limit before adding
      if (totalWeight + ingredient.weight > WEIGHT_LIMITS.MAXIMUM) {
        addMessage({
          content: `The ${ingredient.name} would make your bowl too heavy. Try removing something first!`,
          type: 'assistant'
        });
        return;
      }

      // Check category limits
      const categoryCount = selectedIngredients.filter(ing => ing.category === ingredient.category).length;
      
      if (ingredient.category === 'sides' && categoryCount >= 3) {
        addMessage({
          content: `You can only choose up to 3 sides. Remove one first to add ${ingredient.name}.`,
          type: 'assistant'
        });
        return;
      }

      if (['base', 'protein', 'sauce'].includes(ingredient.category) && categoryCount >= 1) {
        // Replace existing for single-choice categories
        setSelectedIngredients(prev => 
          prev.filter(ing => ing.category !== ingredient.category).concat([{
            ...ingredient,
            quantity: 1,
            totalPrice: ingredient.price,
            totalWeight: ingredient.weight
          }])
        );
      } else {
        // Add new for multi-choice categories
        setSelectedIngredients(prev => [...prev, {
          ...ingredient,
          quantity: 1,
          totalPrice: ingredient.price,
          totalWeight: ingredient.weight
        }]);
      }

      // Add chat message
      addMessage({
        content: `Add ${ingredient.name} to my bowl`,
        type: 'user'
      });

      setTimeout(() => {
        addMessage({
          content: `Great choice! I've added ${ingredient.name} to your bowl. ${ingredient.description}`,
          type: 'assistant'
        });
      }, 500);
    }
  };

  const handleQuantityChange = (ingredientId: string, delta: number) => {
    setSelectedIngredients(prev => prev.map(ing => {
      if (ing.id !== ingredientId) return ing;
      
      const newQuantity = Math.max(1, ing.quantity + delta);
      const newWeight = ing.weight * newQuantity;
      
      // Check weight limit
      const otherIngredients = prev.filter(i => i.id !== ingredientId);
      const otherWeight = otherIngredients.reduce((sum, i) => sum + i.totalWeight, 0);
      
      if (otherWeight + newWeight > WEIGHT_LIMITS.MAXIMUM) {
        addMessage({
          content: `Adding more ${ing.name} would exceed the weight limit.`,
          type: 'assistant'
        });
        return ing;
      }
      
      return {
        ...ing,
        quantity: newQuantity,
        totalPrice: ing.price * newQuantity,
        totalWeight: newWeight
      };
    }));
  };

  const handleNextStep = () => {
    const currentIndex = BOWL_STEPS.findIndex(step => step.id === currentStep);
    if (currentIndex < BOWL_STEPS.length - 1) {
      const nextStep = BOWL_STEPS[currentIndex + 1];
      if (nextStep) {
        setCurrentStep(nextStep.id);
        
        addMessage({
          content: `Let's move to ${nextStep.title.toLowerCase()}`,
          type: 'user'
        });

        setTimeout(() => {
          addMessage({
            content: `Perfect! Now ${nextStep.description.toLowerCase()}. ${nextStep.required ? 'This step is required.' : 'This step is optional - skip if you prefer.'}`,
            type: 'assistant'
          });
        }, 500);
      }
    }
  };

  const handlePreviousStep = () => {
    const currentIndex = BOWL_STEPS.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      const prevStep = BOWL_STEPS[currentIndex - 1];
      if (prevStep) {
        setCurrentStep(prevStep.id);
      }
    }
  };

  const canProceed = () => {
    if (currentStepData.required) {
      return selectedIngredients.some(ing => ing.category === currentStep);
    }
    return true;
  };

  const handleAddToCart = () => {
    const bowl = {
      id: `bowl-${Date.now()}`,
      name: bowlName || 'Custom Bowl',
      ingredients: selectedIngredients,
      totalPrice,
      totalWeight,
      nutrition: {
        calories: totalCalories,
        protein: totalProtein,
        carbs: selectedIngredients.reduce((sum, ing) => sum + (ing.carbs * ing.quantity), 0),
        fat: selectedIngredients.reduce((sum, ing) => sum + (ing.fat * ing.quantity), 0)
      }
    };

    onAddToCart?.(bowl);
    
    addMessage({
      content: `Add my custom bowl to cart`,
      type: 'user'
    });

    setTimeout(() => {
      addMessage({
        content: `Awesome! I've added your custom ${bowl.name} to your cart. Total: $${(totalPrice / 100).toFixed(2)}. Ready to checkout or want to add more?`,
        type: 'assistant'
      });
      navigateToStage('review', 'cart-management');
    }, 500);
  };

  const renderStepContent = () => {
    if (currentStep === 'review') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Custom Bowl</h3>
            <p className="text-gray-600">Review and customize your creation</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Give your bowl a name (optional)
              </label>
              <input
                type="text"
                value={bowlName}
                onChange={(e) => setBowlName(e.target.value)}
                placeholder="e.g., My Power Bowl"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Ingredients</h4>
              <div className="space-y-2">
                {selectedIngredients.map(ing => (
                  <div key={ing.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{ing.icon}</span>
                      <span className="text-sm text-gray-700">{ing.name}</span>
                      {ing.quantity > 1 && (
                        <span className="text-xs text-gray-500">x{ing.quantity}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        ${(ing.totalPrice / 100).toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleQuantityChange(ing.id, -1)}
                          disabled={ing.quantity <= 1}
                          className="w-6 h-6 rounded bg-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-300 transition-colors flex items-center justify-center text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{ing.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(ing.id, 1)}
                          disabled={totalWeight >= WEIGHT_LIMITS.WARNING}
                          className="w-6 h-6 rounded bg-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-300 transition-colors flex items-center justify-center text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-heybo-primary text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart - ${(totalPrice / 100).toFixed(2)}
              </button>
              <button
                onClick={() => {
                  addMessage({
                    content: `Save this bowl as a favorite`,
                    type: 'user'
                  });
                  setTimeout(() => {
                    addMessage({
                      content: `Great! I've saved your custom bowl to your favorites. You can reorder it anytime!`,
                      type: 'assistant'
                    });
                  }, 500);
                }}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableIngredients.map(ingredient => {
            const isSelected = selectedIngredients.some(ing => ing.id === ingredient.id);
            const selectedIngredient = selectedIngredients.find(ing => ing.id === ingredient.id);
            
            return (
              <motion.button
                key={ingredient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleIngredientSelect(ingredient)}
                className={cn(
                  "p-4 rounded-lg border-2 text-left transition-all relative",
                  isSelected 
                    ? "border-orange-500 bg-orange-50" 
                    : "border-gray-200 bg-white hover:border-orange-300"
                )}
              >
                {ingredient.popular && (
                  <div className="absolute top-2 right-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                  </div>
                )}
                
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{ingredient.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{ingredient.name}</h4>
                      <span className="text-sm font-medium text-gray-700">
                        {ingredient.price > 0 ? `+$${(ingredient.price / 100).toFixed(2)}` : 'Included'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{ingredient.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{ingredient.calories} cal</span>
                      <span>{ingredient.weight}g</span>
                    </div>
                    
                    {ingredient.dietaryTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {ingredient.dietaryTags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                        {ingredient.dietaryTags.length > 2 && (
                          <span className="text-xs text-gray-500">+{ingredient.dietaryTags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {isSelected && (
                  <div className="absolute top-2 left-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {availableIngredients.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No ingredients match your filters
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your dietary preferences or skip this step.
            </p>
            <button
              onClick={() => setDietaryPreferences([])}
              className="text-heybo-primary hover:text-orange-600 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("h-full flex flex-col bg-white", className)}>
      {/* Header with Progress */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <ChefHat className="w-5 h-5 mr-2 text-orange-500" />
              Create Your Own Bowl
            </h2>
            <p className="text-sm text-gray-600">{currentStepData.description}</p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">Step {currentStepIndex + 1} of {BOWL_STEPS.length}</div>
            <div className="text-lg font-semibold text-gray-900">{progress}% Complete</div>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            {BOWL_STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                  index <= currentStepIndex
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-600"
                )}>
                  {index + 1}
                </div>
                {index < BOWL_STEPS.length - 1 && (
                  <div className={cn(
                    "flex-1 h-2 rounded transition-colors",
                    index < currentStepIndex ? "bg-orange-500" : "bg-gray-200"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            {BOWL_STEPS.map(step => (
              <span key={step.id} className="text-center">{step.title}</span>
            ))}
          </div>
        </div>

        {/* Dietary Preferences Filter */}
        <div className="mt-4">
          <button
            onClick={() => setShowDietaryFilter(!showDietaryFilter)}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Dietary Preferences</span>
            {dietaryPreferences.length > 0 && (
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                {dietaryPreferences.length} active
              </span>
            )}
          </button>
          
          <AnimatePresence>
            {showDietaryFilter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex flex-wrap gap-2"
              >
                {(['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'low-carb'] as DietaryPreference[]).map(pref => (
                  <button
                    key={pref}
                    onClick={() => {
                      setDietaryPreferences(prev => 
                        prev.includes(pref) 
                          ? prev.filter(p => p !== pref)
                          : [...prev, pref]
                      );
                    }}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                      dietaryPreferences.includes(pref)
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {pref}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Weight Warning */}
        {weightWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-4 p-3 rounded-lg flex items-center space-x-2",
              weightWarning.level === 'error' 
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-yellow-50 text-yellow-700 border border-yellow-200"
            )}
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{weightWarning.message}</span>
            <div className="ml-auto flex items-center space-x-1 text-xs">
              <Scale className="w-3 h-3" />
              <span>{totalWeight}g / {WEIGHT_LIMITS.MAXIMUM}g</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Current Step Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {currentStepData.title}
              {currentStepData.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            <p className="text-gray-600">{currentStepData.description}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Scale className="w-4 h-4" />
              <span>{totalWeight}g</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4" />
              <span>{totalCalories} cal</span>
            </div>
            <div className="font-semibold text-gray-900">
              ${(totalPrice / 100).toFixed(2)}
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? 's' : ''} selected
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handlePreviousStep}
            disabled={currentStepIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          {currentStep !== 'review' ? (
            <button
              onClick={handleNextStep}
              disabled={!canProceed()}
              className="flex-1 flex items-center justify-center space-x-2 bg-heybo-primary text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {currentStepIndex === BOWL_STEPS.length - 2 ? 'Review Bowl' : 'Continue'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep('base')}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 