'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Minus, Info, AlertTriangle } from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { mockIngredientsAPI } from '../../lib/mock-api';
import { cn } from '../../lib/utils';
import type { HeyBoIngredient, IngredientCategory, DietaryRestriction, Allergen } from '../../types';
import { Icon } from '../ui/Icon';
import '../../styles/heybo-design-tokens.css';

interface IngredientSelectorProps {
  category: IngredientCategory;
  title: string;
  description: string;
  onIngredientSelect: (ingredient: HeyBoIngredient) => void;
  dietaryRestrictions?: DietaryRestriction[];
  allergens?: Allergen[];
  required?: boolean;
  multiple?: boolean;
  maxSelections?: number;
  className?: string;
}

export function IngredientSelector({
  category,
  title,
  description,
  onIngredientSelect,
  dietaryRestrictions = [],
  allergens = [],
  required = false,
  multiple = false,
  maxSelections = 1,
  className
}: IngredientSelectorProps) {
  const { selectedLocation, currentBowl } = useChatbotStore();
  const [ingredients, setIngredients] = useState<HeyBoIngredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<HeyBoIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIngredients();
  }, [category, selectedLocation, dietaryRestrictions, allergens]);

  useEffect(() => {
    // Initialize selected ingredients from current bowl
    if (currentBowl) {
      switch (category) {
        case 'base':
          if (currentBowl.base) setSelectedIngredients([currentBowl.base]);
          break;
        case 'protein':
          if (currentBowl.protein) setSelectedIngredients([currentBowl.protein]);
          break;
        case 'sides':
          if (currentBowl.sides) setSelectedIngredients(currentBowl.sides);
          break;
        case 'sauce':
          if (currentBowl.sauce) setSelectedIngredients([currentBowl.sauce]);
          break;
        case 'garnish':
          if (currentBowl.garnish) setSelectedIngredients([currentBowl.garnish]);
          break;
      }
    }
  }, [currentBowl, category]);

  const loadIngredients = async () => {
    if (!selectedLocation) return;
    
    try {
      setIsLoading(true);
      const ingredientData = await mockIngredientsAPI.getIngredientsByCategory();
      const categoryIngredients = ingredientData[category] || [];
      setIngredients(categoryIngredients);
    } catch (error) {
      console.error('Failed to load ingredients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIngredientToggle = (ingredient: HeyBoIngredient) => {
    if (multiple) {
      const isSelected = selectedIngredients.some(i => i.id === ingredient.id);
      
      if (isSelected) {
        // Remove ingredient
        const newSelection = selectedIngredients.filter(i => i.id !== ingredient.id);
        setSelectedIngredients(newSelection);
      } else {
        // Add ingredient (if under limit)
        if (selectedIngredients.length < maxSelections) {
          const newSelection = [...selectedIngredients, ingredient];
          setSelectedIngredients(newSelection);
          onIngredientSelect(ingredient);
        }
      }
    } else {
      // Single selection
      setSelectedIngredients([ingredient]);
      onIngredientSelect(ingredient);
    }
  };

  const isIngredientSelected = (ingredient: HeyBoIngredient) => {
    return selectedIngredients.some(i => i.id === ingredient.id);
  };

  const canSelectMore = () => {
    return !multiple || selectedIngredients.length < maxSelections;
  };

  const formatPrice = (price: number) => {
    return price > 0 ? `+$${(price / 100).toFixed(2)}` : 'Included';
  };

  const getIngredientIcon = (category: IngredientCategory) => {
    switch (category) {
      case 'base': return '🌾';
      case 'protein': return '🍗';
      case 'sides': return '🥬';
      case 'sauce': return '🥄';
      case 'garnish': return '🌿';
      default: return '🥗';
    }
  };

  if (isLoading) {
    return (
      <div className="heybo-chatbot-ingredient-selector flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 heybo-border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className={cn("heybo-chatbot-ingredient-selector p-6 space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="text-3xl mb-2">{getIngredientIcon(category)}</div>
        <h3 className="heybo-text-lg heybo-font-semibold heybo-text-primary" style={{ fontFamily: 'var(--font-fallback)' }}>{title}</h3>
        <p className="heybo-text-sm heybo-text-secondary" style={{ fontFamily: 'var(--font-fallback)' }}>{description}</p>

        {multiple && (
          <div className="text-sm heybo-text-primary-600">
            {selectedIngredients.length} of {maxSelections} selected
          </div>
        )}
      </div>

      {/* Ingredients Grid - Official HeyBo Specification */}
      <div className="heybo-chatbot-ingredient-grid">
        {ingredients.map((ingredient, index) => {
          const isSelected = isIngredientSelected(ingredient);
          const canSelect = canSelectMore() || isSelected;

          return (
            <motion.button
              key={ingredient.id}
              onClick={() => canSelect && handleIngredientToggle(ingredient)}
              disabled={!canSelect}
              className={cn(
                "heybo-chatbot-ingredient-card",
                "heybo-chatbot-touch-target",
                isSelected && "selected",
                !canSelect && "unavailable"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={canSelect ? { scale: 1.01 } : {}}
              whileTap={canSelect ? { scale: 0.99 } : {}}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-2xl mb-2">{getIngredientIcon(category)}</div>
                <div className="heybo-chatbot-ingredient-name">
                  {ingredient.name}
                  {isSelected && (
                    <Icon icon={Check} size="xs" color="healthy" className="inline-block ml-1" />
                  )}
                </div>

                {ingredient.description && (
                  <p className="heybo-text-xs heybo-text-muted mt-1 line-clamp-2" style={{ fontFamily: 'var(--font-fallback)' }}>{ingredient.description}</p>
                )}

                <div className="flex items-center space-x-2 heybo-text-xs heybo-text-muted mt-2" style={{ fontFamily: 'var(--font-fallback)' }}>
                  <span>{ingredient.weight}g</span>
                  <span>{ingredient.nutritionalInfo.calories} cal</span>
                  {ingredient.nutritionalInfo.protein && <span>{ingredient.nutritionalInfo.protein}g protein</span>}
                </div>

                {/* Price */}
                <div className="heybo-font-medium heybo-text-primary mt-2" style={{ fontFamily: 'var(--font-fallback)' }}>
                  {formatPrice(ingredient.price)}
                </div>

                {/* Dietary Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {ingredient.isVegan && (
                    <span className="text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded">
                      Vegan
                    </span>
                  )}
                  {ingredient.isGlutenFree && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded">
                      GF
                    </span>
                  )}
                </div>

                {/* Selection Indicator */}
                {multiple && (
                  <div className="mt-2">
                    {isSelected ? (
                      <div className="w-5 h-5 heybo-bg-primary text-white rounded-full flex items-center justify-center">
                        <Icon icon={Check} size="xs" color="default" className="text-white" />
                      </div>
                    ) : canSelect ? (
                      <div className="w-5 h-5 border-2 heybo-border-light rounded-full flex items-center justify-center">
                        <Icon icon={Plus} size="xs" color="default" className="heybo-text-muted" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-200 rounded-full bg-gray-100"></div>
                    )}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* No Ingredients Available */}
      {ingredients.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">😔</div>
          <p className="text-gray-600">
            No {category} options available that match your dietary preferences.
          </p>
        </div>
      )}

      {/* Skip Option for Non-Required */}
      {!required && !multiple && selectedIngredients.length === 0 && (
        <div className="text-center">
          <button
            onClick={() => onIngredientSelect(null as any)}
            className="heybo-text-primary-600 heybo-hover-text-primary-700 font-medium"
          >
            Skip {title}
          </button>
        </div>
      )}

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          {multiple 
            ? `Select up to ${maxSelections} ${category} options`
            : `Choose one ${category} option${!required ? ' or skip' : ''}`
          }
        </p>
      </div>
    </div>
  );
}
