// Enhanced Bowl Preview Component for New Layout System
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit3, 
  Scale, 
  DollarSign, 
  Clock, 
  Heart,
  ShoppingCart,
  Info,
  Plus,
  Minus,
  Check,
  AlertCircle
} from 'lucide-react';
import type { BowlComposition } from '../../types';
import { useChatbotStore } from '../../store/chatbot-store';
import { useLayoutStore } from '../../store/layout-store';
import { cn } from '../../lib/utils';

interface BowlPreviewV2Props {
  bowl: Partial<BowlComposition> | null;
  variant?: 'compact' | 'detailed' | 'summary';
  showProgress?: boolean;
  showNutrition?: boolean;
  showPrice?: boolean;
  showActions?: boolean;
  isEditable?: boolean;
  onEdit?: () => void;
  onAddToCart?: () => void;
  onAddToFavorites?: () => void;
  className?: string;
}

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
}

export function BowlPreviewV2({
  bowl,
  variant = 'detailed',
  showProgress = false,
  showNutrition = true,
  showPrice = true,
  showActions = true,
  isEditable = true,
  onEdit,
  onAddToCart,
  onAddToFavorites,
  className
}: BowlPreviewV2Props) {
  const [showNutritionDetails, setShowNutritionDetails] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);

  const { 
    calculateBowlWeight, 
    calculateBowlPrice, 
    validateBowl,
    addMessage 
  } = useChatbotStore();

  const { navigation } = useLayoutStore();

  if (!bowl) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 p-8">
        <div className="text-center">
          <div className="text-4xl mb-4">🥣</div>
          <p className="text-sm">Your bowl preview will appear here</p>
        </div>
      </div>
    );
  }

  const weight = calculateBowlWeight();
  const price = calculateBowlPrice();
  const validation = validateBowl();
  const weightPercentage = Math.min((weight / 900) * 100, 100);

  // Calculate nutrition (mock data - would come from actual ingredients)
  const nutrition: NutritionInfo = {
    calories: bowl.calories || 450,
    protein: 25,
    carbs: 35,
    fat: 18,
    fiber: 8,
    sodium: 580
  };

  // Get all selected ingredients
  const allIngredients = [
    bowl.base ? { ...bowl.base, category: 'Base' } : null,
    bowl.protein ? { ...bowl.protein, category: 'Protein' } : null,
    ...(bowl.sides || []).map(side => ({ ...side, category: 'Side' })),
    ...(bowl.extraSides || []).map(side => ({ ...side, category: 'Extra Side' })),
    ...(bowl.extraProtein || []).map(protein => ({ ...protein, category: 'Extra Protein' })),
    bowl.sauce ? { ...bowl.sauce, category: 'Sauce' } : null,
    bowl.garnish ? { ...bowl.garnish, category: 'Garnish' } : null
  ].filter((ingredient): ingredient is NonNullable<typeof ingredient> => ingredient !== null);

  const totalIngredients = allIngredients.length;
  const requiredSteps = ['base', 'protein', 'sides', 'sauce', 'garnish'];
  const completedSteps = [
    bowl.base ? 'base' : null,
    bowl.protein ? 'protein' : null,
    (bowl.sides && bowl.sides.length > 0) ? 'sides' : null,
    bowl.sauce ? 'sauce' : null,
    bowl.garnish ? 'garnish' : null
  ].filter(Boolean).length;

  const progressPercentage = (completedSteps / requiredSteps.length) * 100;
  const isComplete = completedSteps === requiredSteps.length;

  const handleAddToCart = async () => {
    if (!isComplete) return;
    
    setIsAddingToCart(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onAddToCart?.();
      addMessage({
        content: 'Added to cart successfully! 🛒',
        type: 'assistant'
      });
    } catch (error) {
      addMessage({
        content: 'Sorry, there was an error adding to cart. Please try again.',
        type: 'assistant'
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToFavorites = async () => {
    setIsAddingToFavorites(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      onAddToFavorites?.();
      addMessage({
        content: 'Added to favorites! ❤️',
        type: 'assistant'
      });
    } catch (error) {
      addMessage({
        content: 'Sorry, there was an error adding to favorites. Please try again.',
        type: 'assistant'
      });
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  // Compact variant for mobile or small spaces
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-3 border border-orange-200",
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm text-gray-900">
              {bowl.name || 'Custom Bowl'}
            </h4>
            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
              <span className="flex items-center">
                <Scale className="w-3 h-3 mr-1" />
                {weight}g
              </span>
              {showPrice && (
                <span className="flex items-center">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {(price / 100).toFixed(2)}
                </span>
              )}
              <span>{totalIngredients} ingredients</span>
            </div>
            
            {showProgress && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Bowl completion</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          
          {isEditable && onEdit && (
            <button
              onClick={onEdit}
              className="ml-3 p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
              aria-label="Edit bowl"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>

        {validation.warnings.length > 0 && (
          <div className="mt-2 text-xs text-amber-600 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {validation.warnings[0]}
          </div>
        )}
      </motion.div>
    );
  }

  // Summary variant for cart/order views
  if (variant === 'summary') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          "bg-white border border-gray-200 rounded-lg p-4 shadow-sm",
          className
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              {bowl.name || 'Custom Bowl'}
            </h3>
            
            <div className="space-y-1 text-sm text-gray-600">
              {allIngredients.slice(0, 3).map((ingredient, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                  {ingredient.name}
                </div>
              ))}
              {allIngredients.length > 3 && (
                <div className="text-xs text-gray-500 ml-3.5">
                  +{allIngredients.length - 3} more ingredients
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-semibold text-lg text-heybo-primary">
              ${(price / 100).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              {weight}g • {nutrition.calories} cal
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Detailed variant - main preview
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col",
        className
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">
            {bowl.name || 'Your Custom Bowl'}
          </h3>
          
          {isEditable && onEdit && (
            <button
              onClick={onEdit}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              aria-label="Edit bowl"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="flex items-center justify-between text-orange-100 text-sm">
          <span>{totalIngredients} ingredients selected</span>
          {isComplete && (
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-1" />
              <span>Complete</span>
            </div>
          )}
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Bowl Visual */}
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-6xl mb-2">🥣</div>
            <div className="text-sm text-gray-600">
              Estimated prep time: {bowl.prepTime || '5-7 mins'}
            </div>
          </div>

          {/* Progress Indicator */}
          {showProgress && (
            <div>
              <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                <span>Bowl completion</span>
                <span className="font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={cn(
                    "h-3 rounded-full transition-all duration-500",
                    progressPercentage === 100 
                      ? "bg-gradient-to-r from-green-500 to-green-600" 
                      : "bg-gradient-to-r from-orange-500 to-orange-600"
                  )}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Missing: {requiredSteps.length - completedSteps} components</span>
                <span>{completedSteps}/{requiredSteps.length}</span>
              </div>
            </div>
          )}

          {/* Ingredients List */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Ingredients</h4>
            <div className="space-y-2">
              {allIngredients.map((ingredient, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-2"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span className="text-gray-900 font-medium">{ingredient.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                      {ingredient.category}
                    </span>
                  </div>
                  <div className="text-gray-600 text-xs">
                    {ingredient.weight}g
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {weight}g
              </div>
              <div className="text-xs text-gray-600">Total Weight</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    weightPercentage > 80 ? "bg-red-500" : 
                    weightPercentage > 60 ? "bg-yellow-500" : "bg-green-500"
                  )}
                  style={{ width: `${weightPercentage}%` }}
                />
              </div>
            </div>
            
            {showPrice && (
              <div className="text-center">
                <div className="text-2xl font-bold text-heybo-primary">
                  ${(price / 100).toFixed(2)}
                </div>
                <div className="text-xs text-gray-600">Total Price</div>
              </div>
            )}
          </div>

          {/* Nutrition Information */}
          {showNutrition && (
            <div>
              <button
                onClick={() => setShowNutritionDetails(!showNutritionDetails)}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="font-medium text-gray-900">Nutrition Facts</h4>
                <Info className="w-4 h-4 text-gray-500" />
              </button>
              
              <AnimatePresence>
                {showNutritionDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span>Calories</span>
                          <span className="font-medium">{nutrition.calories}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Protein</span>
                          <span className="font-medium">{nutrition.protein}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbs</span>
                          <span className="font-medium">{nutrition.carbs}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fat</span>
                          <span className="font-medium">{nutrition.fat}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fiber</span>
                          <span className="font-medium">{nutrition.fiber}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sodium</span>
                          <span className="font-medium">{nutrition.sodium}mg</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Warnings */}
          {validation.warnings.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-amber-800 mb-1">
                    Bowl Recommendations
                  </div>
                  {validation.warnings.map((warning, index) => (
                    <div key={index} className="text-amber-700">
                      {warning}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={handleAddToCart}
              disabled={!isComplete || isAddingToCart}
              className={cn(
                "flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all",
                isComplete 
                  ? "bg-heybo-primary text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-200"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              )}
            >
              {isAddingToCart ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
              <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
            </button>
            
            <button
              onClick={handleAddToFavorites}
              disabled={isAddingToFavorites}
              className="p-3 border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Add to favorites"
            >
              {isAddingToFavorites ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
              ) : (
                <Heart className="w-4 h-4" />
              )}
            </button>
          </div>
          
          {!isComplete && (
            <div className="mt-2 text-xs text-gray-500 text-center">
              Complete your bowl to add to cart
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
} 