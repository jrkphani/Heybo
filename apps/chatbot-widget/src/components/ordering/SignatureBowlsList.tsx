'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Flame, Leaf, Plus, Info } from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { mockSignatureBowlsAPI } from '../../lib/mock-api';
import { cn } from '../../lib/utils';
import type { BowlComposition } from '../../types';

interface SignatureBowlsListProps {
  onBowlSelect: (bowl: BowlComposition) => void;
  className?: string;
}

export function SignatureBowlsList({ onBowlSelect, className }: SignatureBowlsListProps) {
  const { selectedLocation, addMessage, setCurrentStep } = useChatbotStore();
  const [signatureBowls, setSignatureBowls] = useState<BowlComposition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBowl, setSelectedBowl] = useState<BowlComposition | null>(null);

  useEffect(() => {
    loadSignatureBowls();
  }, [selectedLocation]);

  const loadSignatureBowls = async () => {
    if (!selectedLocation) return;
    
    try {
      setIsLoading(true);
      const bowls = await mockSignatureBowlsAPI.getSignatureBowls(selectedLocation.id);
      setSignatureBowls(bowls);
    } catch (error) {
      console.error('Failed to load signature bowls:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBowlSelect = (bowl: BowlComposition) => {
    addMessage({
      content: `I'd like to order the ${bowl.name}`,
      type: 'user'
    });

    setTimeout(() => {
      addMessage({
        content: `Excellent choice! The ${bowl.name} is one of our most popular bowls. Would you like to customize it or add it to your cart as is?`,
        type: 'assistant'
      });
    }, 500);

    setSelectedBowl(bowl);
    setTimeout(() => {
      setCurrentStep('signature-bowl-details');
      onBowlSelect(bowl);
    }, 1000);
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const getBowlTags = (bowl: BowlComposition) => {
    const tags = bowl.tags ? [...bowl.tags] : [];
    
    if (bowl.calories && bowl.calories < 400) tags.push('Light');
    if (bowl.calories && bowl.calories > 600) tags.push('Hearty');
    if (bowl.isPopular) tags.push('Popular');
    
    return tags.slice(0, 3); // Limit to 3 tags
  };

  const getTagIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'popular':
        return <Star className="w-3 h-3" />;
      case 'spicy':
        return <Flame className="w-3 h-3" />;
      case 'vegan':
      case 'vegetarian':
        return <Leaf className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'popular':
        return 'bg-yellow-100 text-yellow-700';
      case 'spicy':
        return 'bg-red-100 text-red-700';
      case 'vegan':
      case 'vegetarian':
        return 'bg-green-100 text-green-700';
      case 'high protein':
        return 'bg-blue-100 text-blue-700';
      case 'light':
        return 'bg-purple-100 text-purple-700';
      case 'hearty':
        return 'bg-[var(--heybo-primary-100)] text-[var(--heybo-primary-700)]';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="heybo-chatbot-signature-bowls">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--heybo-primary-600)]"></div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Signature Bowls</h3>
        <p className="text-sm text-gray-600">
          Chef-crafted bowls with perfectly balanced flavors
        </p>
      </div>

      {/* Bowls Grid */}
      <div className="space-y-4">
        {signatureBowls.map((bowl, index) => (
          <motion.div
            key={bowl.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 group cursor-pointer"
            onClick={() => handleBowlSelect(bowl)}
          >
            <div className="flex">
              {/* Bowl Image */}
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🥣</span>
              </div>

              {/* Bowl Details */}
              <div className="flex-1 p-4 space-y-2">
                {/* Name and Rating */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-[var(--heybo-primary-600)] transition-colors">
                      {bowl.name}
                    </h4>
                    {bowl.rating && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-700">{bowl.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatPrice(bowl.totalPrice)}</div>
                    {bowl.prepTime && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{bowl.prepTime}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {bowl.description}
                </p>

                {/* Tags and Calories */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {getBowlTags(bowl).map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          "inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
                          getTagColor(tag)
                        )}
                      >
                        {getTagIcon(tag)}
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                  
                  {bowl.calories && (
                    <span className="text-xs text-gray-500">
                      {bowl.calories} cal
                    </span>
                  )}
                </div>
              </div>

              {/* Add Button */}
              <div className="flex items-center pr-4">
                <button className="w-8 h-8 bg-[var(--heybo-primary-600)] text-white rounded-full flex items-center justify-center hover:bg-[var(--heybo-primary-700)] transition-colors group-hover:scale-110 transform duration-200">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-[var(--heybo-primary-50)] border border-[var(--heybo-primary-200)] rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-[var(--heybo-primary-600)] mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-[var(--heybo-primary-900)] mb-1">About Our Signature Bowls</div>
            <div className="text-[var(--heybo-primary-700)]">
              Each signature bowl is carefully crafted by our chefs using fresh, high-quality ingredients. 
              You can customize any bowl to match your dietary preferences and taste.
            </div>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Tap any bowl to see full ingredients and customization options
        </p>
      </div>
    </div>
  );
}
