'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, Scale, DollarSign, Clock } from 'lucide-react';
import type { BowlComposition } from '../../types';
import { useChatbotStore } from '../../store/chatbot-store';
import { cn } from '../../lib/utils';

interface BowlPreviewProps {
  bowl: Partial<BowlComposition> | null;
  compact?: boolean;
  showProgress?: boolean;
  showNutrition?: boolean;
  showPrice?: boolean;
  onEdit?: () => void;
  className?: string;
}

export function BowlPreview({
  bowl,
  compact = false,
  showProgress = false,
  showNutrition = false,
  showPrice = true,
  onEdit,
  className
}: BowlPreviewProps) {
  const { calculateBowlWeight, calculateBowlPrice, validateBowl } = useChatbotStore();

  if (!bowl) return null;

  const weight = calculateBowlWeight();
  const price = calculateBowlPrice();
  const validation = validateBowl();
  const weightPercentage = Math.min((weight / 900) * 100, 100);

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

  if (compact) {
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
            
            {/* Progress bar */}
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
          
          {onEdit && (
            <button
              onClick={onEdit}
              className="ml-3 p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
              aria-label="Edit bowl"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Warnings */}
        {validation.warnings.length > 0 && (
          <div className="mt-2 text-xs text-amber-600">
            {validation.warnings[0]}
          </div>
        )}
      </motion.div>
    );
  }

  // Full preview
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">
              {bowl.name || 'Your Custom Bowl'}
            </h3>
            <p className="text-orange-100 text-sm">
              {totalIngredients} ingredients selected
            </p>
          </div>
          
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              aria-label="Edit bowl"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Ingredients List */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Ingredients</h4>
          <div className="space-y-2">
            {allIngredients.map((ingredient, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span className="text-gray-900">{ingredient.name}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {ingredient.category}
                  </span>
                </div>
                <div className="text-gray-600 text-xs">
                  {ingredient.weight}g
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
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
              <div className="text-2xl font-bold text-gray-900">
                ${(price / 100).toFixed(2)}
              </div>
              <div className="text-xs text-gray-600">Total Price</div>
            </div>
          )}
        </div>

        {/* Nutrition (if enabled) */}
        {showNutrition && (
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-medium text-gray-900 mb-2">Nutrition (Estimated)</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-medium">520</div>
                <div className="text-gray-600">Calories</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-medium">28g</div>
                <div className="text-gray-600">Protein</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-medium">12g</div>
                <div className="text-gray-600">Fiber</div>
              </div>
            </div>
          </div>
        )}

        {/* Warnings */}
        {validation.warnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="text-sm text-amber-700">
                {validation.warnings[0]}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
