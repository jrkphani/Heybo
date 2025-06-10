'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Scale, Info, X } from 'lucide-react';
import type { BowlComposition } from '../../types';
import { cn } from '../../lib/utils';
import '../../styles/heybo-design-tokens.css';

interface WeightWarningDialogProps {
  isOpen: boolean;
  currentWeight: number;
  maxWeight: number;
  bowl: Partial<BowlComposition>;
  warningType: 'approaching' | 'exceeded';
  onContinue: () => void;
  onModify: () => void;
  onClose: () => void;
  className?: string;
}

export function WeightWarningDialog({
  isOpen,
  currentWeight,
  maxWeight,
  bowl,
  warningType,
  onContinue,
  onModify,
  onClose,
  className
}: WeightWarningDialogProps) {
  const percentage = Math.round((currentWeight / maxWeight) * 100);
  const isExceeded = warningType === 'exceeded';
  const isApproaching = warningType === 'approaching';

  const getWarningConfig = () => {
    if (isExceeded) {
      return {
        icon: AlertTriangle,
        iconColor: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        title: 'Bowl Weight Exceeded',
        message: `Your bowl is quite large at ${currentWeight}g (${percentage}% of maximum). You might want to consider splitting this into two orders for better portion control.`,
        continueText: 'Keep this size',
        continueStyle: 'bg-red-600 hover:bg-red-700 text-white',
        modifyText: 'Remove some items'
      };
    } else {
      return {
        icon: Info,
        iconColor: 'text-amber-500',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        title: 'Bowl Getting Full',
        message: `Your bowl is getting quite full at ${currentWeight}g (${percentage}% of maximum). You can continue adding or review your selections.`,
        continueText: 'Continue adding',
        continueStyle: 'bg-amber-600 hover:bg-amber-700 text-white',
        modifyText: 'Review selections'
      };
    }
  };

  const config = getWarningConfig();
  const IconComponent = config.icon;

  const getWeightBarColor = () => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getIngredientsList = () => {
    const ingredients = [];
    if (bowl.base) ingredients.push({ name: bowl.base.name, weight: bowl.base.weight });
    if (bowl.protein) ingredients.push({ name: bowl.protein.name, weight: bowl.protein.weight });
    if (bowl.sides) bowl.sides.forEach(side => ingredients.push({ name: side.name, weight: side.weight }));
    if (bowl.extraSides) bowl.extraSides.forEach(side => ingredients.push({ name: side.name, weight: side.weight }));
    if (bowl.sauce) ingredients.push({ name: bowl.sauce.name, weight: bowl.sauce.weight });
    if (bowl.garnish) ingredients.push({ name: bowl.garnish.name, weight: bowl.garnish.weight });
    
    return ingredients.sort((a, b) => b.weight - a.weight);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="heybo-chatbot-weight-warning fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={cn(
            "bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden",
            className
          )}
        >
          {/* Header */}
          <div className={cn("p-4 border-b", config.bgColor, config.borderColor)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <IconComponent className={cn("w-6 h-6", config.iconColor)} />
                <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Weight Visualization */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Current Weight</span>
                <span className="font-medium text-gray-900">{currentWeight}g / {maxWeight}g</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={cn("h-full rounded-full transition-colors", getWeightBarColor())}
                />
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-sm">
                <Scale className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{percentage}% of maximum capacity</span>
              </div>
            </div>

            {/* Warning Message */}
            <div className={cn("p-4 rounded-lg", config.bgColor, config.borderColor, "border")}>
              <p className="text-sm text-gray-700">{config.message}</p>
            </div>

            {/* Ingredients Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Current Ingredients</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {getIngredientsList().map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{ingredient.name}</span>
                    <span className="text-gray-500">{ingredient.weight}g</span>
                  </div>
                ))}
              </div>
            </div>

            {/* HeyBo Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-blue-900 mb-1">HeyBo Portion Guidelines</div>
                  <div className="text-blue-700">
                    Our bowls are designed for optimal nutrition and satisfaction. 
                    Bowls over 900g might be too large for a single meal and could affect the eating experience.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 pt-0 space-y-3">
            <div className="flex space-x-3">
              <button
                onClick={onModify}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                {config.modifyText}
              </button>
              
              <button
                onClick={onContinue}
                className={cn(
                  "flex-1 px-4 py-2 rounded-lg transition-colors font-medium",
                  config.continueStyle
                )}
              >
                {config.continueText}
              </button>
            </div>
            
            {/* Additional info for exceeded weight */}
            {isExceeded && (
              <p className="text-xs text-gray-500 text-center">
                Large bowls may take longer to prepare and might be difficult to finish in one sitting
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
