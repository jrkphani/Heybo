'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Star, TrendingUp, Coffee, Cookie, ArrowRight, X } from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import type { CartItem, HeyBoIngredient } from '../../types';
import { cn } from '../../lib/utils';
import '../../styles/heybo-design-tokens.css';

interface UpsellingSuggestionsProps {
  cartItems: CartItem[];
  onAddItem: (item: HeyBoIngredient) => void;
  onContinue: () => void;
  onSkip: () => void;
  className?: string;
}

interface UpsellItem {
  id: string;
  name: string;
  description: string;
  price: number; // cents
  category: 'beverage' | 'snack' | 'dessert' | 'extra';
  imageUrl: string;
  isPopular: boolean;
  tags: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
  };
}

const mockUpsellItems: UpsellItem[] = [
  {
    id: 'beverage-1',
    name: 'Cold Pressed Green Juice',
    description: 'Refreshing blend of kale, spinach, apple, and lemon',
    price: 680, // $6.80
    category: 'beverage',
    imageUrl: '/beverages/green-juice.jpg',
    isPopular: true,
    tags: ['Healthy', 'Detox', 'Vitamin C'],
    nutritionalInfo: { calories: 120, protein: 3 }
  },
  {
    id: 'snack-1',
    name: 'Roasted Chickpea Crunch',
    description: 'Crispy seasoned chickpeas with herbs and spices',
    price: 450, // $4.50
    category: 'snack',
    imageUrl: '/snacks/chickpea-crunch.jpg',
    isPopular: true,
    tags: ['Protein', 'Crunchy', 'Vegan'],
    nutritionalInfo: { calories: 180, protein: 8 }
  },
  {
    id: 'dessert-1',
    name: 'Chia Pudding Cup',
    description: 'Vanilla chia pudding with fresh berries and granola',
    price: 590, // $5.90
    category: 'dessert',
    imageUrl: '/desserts/chia-pudding.jpg',
    isPopular: false,
    tags: ['Healthy', 'Sweet', 'Omega-3'],
    nutritionalInfo: { calories: 220, protein: 6 }
  },
  {
    id: 'beverage-2',
    name: 'Kombucha - Ginger Turmeric',
    description: 'Probiotic fermented tea with anti-inflammatory benefits',
    price: 520, // $5.20
    category: 'beverage',
    imageUrl: '/beverages/kombucha.jpg',
    isPopular: true,
    tags: ['Probiotic', 'Digestive', 'Immunity'],
    nutritionalInfo: { calories: 35, protein: 0 }
  }
];

export function UpsellingSuggestions({
  cartItems,
  onAddItem,
  onContinue,
  onSkip,
  className
}: UpsellingSuggestionsProps) {
  const { addMessage, selectedLocation } = useChatbotStore();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<UpsellItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUpsellSuggestions();
  }, [cartItems, selectedLocation]);

  const loadUpsellSuggestions = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call to get personalized upsell suggestions
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter suggestions based on cart contents and location
      const filteredSuggestions = mockUpsellItems.filter(item => {
        // Logic to filter based on cart contents, dietary preferences, etc.
        return true; // For now, show all
      });
      
      setSuggestions(filteredSuggestions.slice(0, 3)); // Show top 3 suggestions
      
      // Add contextual message
      addMessage({
        content: 'Before we finish, here are some popular add-ons that pair well with your order!',
        type: 'assistant'
      });
      
    } catch (error) {
      console.error('Failed to load upsell suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleAddSelected = () => {
    const itemsToAdd = suggestions.filter(item => selectedItems.includes(item.id));
    
    if (itemsToAdd.length > 0) {
      addMessage({
        content: `Add ${itemsToAdd.map(item => item.name).join(', ')} to my order`,
        type: 'user'
      });

      // Convert UpsellItem to HeyBoIngredient format and add to cart
      itemsToAdd.forEach(item => {
        const ingredient: HeyBoIngredient = {
          id: item.id,
          name: item.name,
          category: 'sides', // Map to appropriate category
          subcategory: item.category,
          isAvailable: true,
          isVegan: item.tags.includes('Vegan'),
          isGlutenFree: false,
          allergens: [],
          nutritionalInfo: {
            calories: item.nutritionalInfo.calories,
            protein: item.nutritionalInfo.protein,
            carbs: 0,
            fat: 0,
            fiber: 0,
            sodium: 0
          },
          weight: 100, // Default weight
          price: item.price,
          description: item.description,
          imageUrl: item.imageUrl
        };
        
        onAddItem(ingredient);
      });

      setTimeout(() => {
        addMessage({
          content: `Perfect! I've added ${itemsToAdd.length} item${itemsToAdd.length > 1 ? 's' : ''} to your order. Let's proceed to checkout.`,
          type: 'assistant'
        });
      }, 500);
    }

    setTimeout(() => {
      onContinue();
    }, itemsToAdd.length > 0 ? 1000 : 0);
  };

  const handleSkip = () => {
    addMessage({
      content: 'No thanks, just the bowl please',
      type: 'user'
    });

    setTimeout(() => {
      addMessage({
        content: 'No problem! Let\'s proceed with your order.',
        type: 'assistant'
      });
    }, 500);

    setTimeout(() => {
      onSkip();
    }, 1000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'beverage': return Coffee;
      case 'snack': return Cookie;
      case 'dessert': return Star;
      default: return Plus;
    }
  };

  const getTotalSelectedPrice = () => {
    return suggestions
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price, 0);
  };

  if (isLoading) {
    return (
      <div className={cn("heybo-chatbot-upselling flex flex-col items-center justify-center p-8 space-y-4", className)}>
        <TrendingUp className="w-8 h-8 text-[var(--heybo-primary-600)] animate-pulse" />
        <div className="text-center">
          <h3 className="font-medium text-gray-900 mb-1">Finding perfect add-ons</h3>
          <p className="text-sm text-gray-600">Checking what goes well with your order...</p>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    // Skip upselling if no suggestions
    setTimeout(() => onContinue(), 100);
    return null;
  }

  return (
    <div className={cn("heybo-chatbot-upselling space-y-6", className)}>
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <TrendingUp className="w-6 h-6 text-[var(--heybo-primary-600)]" />
          <h3 className="text-lg font-semibold text-gray-900">Complete Your Order</h3>
        </div>
        <p className="text-sm text-gray-600">
          Popular add-ons that pair perfectly with your bowl
        </p>
      </div>

      {/* Suggestions */}
      <div className="space-y-3">
        {suggestions.map((item, index) => {
          const isSelected = selectedItems.includes(item.id);
          const IconComponent = getCategoryIcon(item.category);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 border rounded-lg transition-all duration-200 cursor-pointer",
                isSelected
                  ? "border-[var(--heybo-primary-300)] bg-[var(--heybo-primary-50)]"
                  : "border-gray-200 hover:border-[var(--heybo-primary-200)] hover:shadow-sm"
              )}
              onClick={() => handleItemToggle(item.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  isSelected ? "bg-[var(--heybo-primary-100)]" : "bg-gray-100"
                )}>
                  <IconComponent className={cn(
                    "w-6 h-6",
                    isSelected ? "text-[var(--heybo-primary-600)]" : "text-gray-600"
                  )} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        {item.isPopular && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{item.nutritionalInfo.calories} cal</span>
                        <span>{item.nutritionalInfo.protein}g protein</span>
                        <span className="capitalize">{item.category}</span>
                      </div>
                      
                      {item.tags.length > 0 && (
                        <div className="flex items-center space-x-1 mt-2">
                          {item.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        ${(item.price / 100).toFixed(2)}
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center mt-2",
                        isSelected
                          ? "border-[var(--heybo-primary-500)] bg-[var(--heybo-primary-500)]"
                          : "border-gray-300"
                      )}>
                        {isSelected && <Plus className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Items Summary */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[var(--heybo-primary-50)] border border-[var(--heybo-primary-200)] rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-[var(--heybo-primary-900)]">
                  {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                </span>
                <div className="text-sm text-[var(--heybo-primary-700)]">
                  Additional: ${(getTotalSelectedPrice() / 100).toFixed(2)}
                </div>
              </div>
              <Plus className="w-5 h-5 text-[var(--heybo-primary-600)]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleAddSelected}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-[var(--heybo-primary-600)] text-white rounded-lg hover:bg-[var(--heybo-primary-700)] transition-colors font-medium"
        >
          <span>
            {selectedItems.length > 0
              ? `Add ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} & Continue`
              : 'Continue to Checkout'
            }
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleSkip}
          className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          No thanks, just the bowl
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-blue-900 mb-1">Why These Suggestions?</div>
            <div className="text-blue-700">
              These items are popular with customers who ordered similar bowls and complement your meal's nutritional profile.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
