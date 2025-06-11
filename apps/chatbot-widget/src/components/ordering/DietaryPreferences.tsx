'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, AlertTriangle, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { DietaryRestriction, Allergen } from '../../types';

interface DietaryPreferencesProps {
  onComplete: (restrictions: DietaryRestriction[], allergens: Allergen[]) => void;
  initialRestrictions?: DietaryRestriction[];
  initialAllergens?: Allergen[];
  className?: string;
}

export function DietaryPreferences({ 
  onComplete, 
  initialRestrictions = [], 
  initialAllergens = [], 
  className 
}: DietaryPreferencesProps) {
  const [selectedRestrictions, setSelectedRestrictions] = useState<DietaryRestriction[]>(initialRestrictions);
  const [selectedAllergens, setSelectedAllergens] = useState<Allergen[]>(initialAllergens);

  const dietaryOptions: { id: DietaryRestriction; label: string; description: string; icon: string }[] = [
    { id: 'vegan', label: 'Vegan', description: 'No animal products', icon: '🌱' },
    { id: 'vegetarian', label: 'Vegetarian', description: 'No meat or fish', icon: '🥬' },
    { id: 'gluten-free', label: 'Gluten-Free', description: 'No gluten-containing ingredients', icon: '🌾' },
    { id: 'dairy-free', label: 'Dairy-Free', description: 'No dairy products', icon: '🥛' },
    { id: 'nut-free', label: 'Nut-Free', description: 'No nuts or nut products', icon: '🥜' },
    { id: 'low-carb', label: 'Low-Carb', description: 'Reduced carbohydrate content', icon: '🥗' },
    { id: 'keto', label: 'Keto', description: 'High fat, very low carb', icon: '🥑' },
    { id: 'paleo', label: 'Paleo', description: 'Whole foods, no processed', icon: '🍖' }
  ];

  const allergenOptions: { id: Allergen; label: string; severity: 'high' | 'medium' | 'low' }[] = [
    { id: 'nuts', label: 'Tree Nuts', severity: 'high' },
    { id: 'peanuts', label: 'Peanuts', severity: 'high' },
    { id: 'dairy', label: 'Dairy/Milk', severity: 'medium' },
    { id: 'eggs', label: 'Eggs', severity: 'medium' },
    { id: 'soy', label: 'Soy', severity: 'medium' },
    { id: 'gluten', label: 'Gluten/Wheat', severity: 'medium' },
    { id: 'shellfish', label: 'Shellfish', severity: 'high' },
    { id: 'fish', label: 'Fish', severity: 'medium' },
    { id: 'sesame', label: 'Sesame', severity: 'low' }
  ];

  const handleRestrictionToggle = (restriction: DietaryRestriction) => {
    setSelectedRestrictions(prev => 
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  const handleAllergenToggle = (allergen: Allergen) => {
    setSelectedAllergens(prev => 
      prev.includes(allergen)
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  const handleContinue = () => {
    onComplete(selectedRestrictions, selectedAllergens);
  };

  const handleSkip = () => {
    onComplete([], []);
  };

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return 'border-red-300 bg-red-50 text-red-700';
      case 'medium': return 'border-yellow-300 bg-yellow-50 text-yellow-700';
      case 'low': return 'border-blue-300 bg-blue-50 text-blue-700';
    }
  };

  return (
    <div className={cn("heybo-chatbot-dietary p-6 space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Leaf className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Dietary Preferences</h3>
        <p className="text-sm text-gray-600">
          Help us customize your bowl to match your dietary needs and preferences
        </p>
      </div>

      {/* Dietary Restrictions */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Dietary Preferences</h4>
        <div className="grid grid-cols-2 gap-3">
          {dietaryOptions.map((option) => (
            <motion.button
              key={option.id}
              onClick={() => handleRestrictionToggle(option.id)}
              className={cn(
                "p-3 border-2 rounded-lg text-left transition-all duration-200",
                selectedRestrictions.includes(option.id)
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{option.icon}</span>
                    <span className="font-medium text-gray-900 text-sm">{option.label}</span>
                  </div>
                  <p className="text-xs text-gray-600">{option.description}</p>
                </div>
                {selectedRestrictions.includes(option.id) && (
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Allergens */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-[var(--heybo-primary-600)]" />
          <h4 className="font-medium text-gray-900">Allergies & Intolerances</h4>
        </div>
        <p className="text-sm text-gray-600">
          Select any allergens we should avoid in your bowl
        </p>
        
        <div className="space-y-2">
          {allergenOptions.map((allergen) => (
            <motion.button
              key={allergen.id}
              onClick={() => handleAllergenToggle(allergen.id)}
              className={cn(
                "w-full p-3 border-2 rounded-lg text-left transition-all duration-200 flex items-center justify-between",
                selectedAllergens.includes(allergen.id)
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-red-300"
              )}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center space-x-3">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium border",
                  getSeverityColor(allergen.severity)
                )}>
                  {allergen.severity}
                </span>
                <span className="font-medium text-gray-900">{allergen.label}</span>
              </div>
              
              {selectedAllergens.includes(allergen.id) ? (
                <Check className="w-4 h-4 text-red-600" />
              ) : (
                <div className="w-4 h-4 border border-gray-300 rounded"></div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Summary */}
      {(selectedRestrictions.length > 0 || selectedAllergens.length > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2">Your Preferences</h5>
          <div className="space-y-1 text-sm text-blue-800">
            {selectedRestrictions.length > 0 && (
              <div>
                <span className="font-medium">Dietary:</span> {selectedRestrictions.join(', ')}
              </div>
            )}
            {selectedAllergens.length > 0 && (
              <div>
                <span className="font-medium">Avoid:</span> {selectedAllergens.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <button
          onClick={handleSkip}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Skip for Now
        </button>
        
        <button
          onClick={handleContinue}
          className="flex-1 px-4 py-3 bg-[var(--heybo-primary-600)] text-white rounded-lg hover:bg-[var(--heybo-primary-700)] transition-colors"
        >
          Continue
        </button>
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          We'll filter ingredients based on your preferences. You can always modify these later.
        </p>
      </div>
    </div>
  );
}
