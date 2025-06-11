'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Clock, Zap, Plus, RefreshCw } from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { mockMLRecommendationsAPI } from '../../lib/mock-api';
import { cn } from '../../lib/utils';
import type { BowlComposition, DietaryRestriction, Allergen, MLRecommendation } from '../../types';

interface MLRecommendationsListProps {
  onBowlSelect: (bowl: BowlComposition) => void;
  dietaryRestrictions?: DietaryRestriction[];
  allergens?: Allergen[];
  className?: string;
}

export function MLRecommendationsList({ 
  onBowlSelect, 
  dietaryRestrictions = [], 
  allergens = [], 
  className 
}: MLRecommendationsListProps) {
  const { selectedLocation, user, addMessage, setCurrentStep } = useChatbotStore();
  const [recommendations, setRecommendations] = useState<MLRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, [selectedLocation, user, dietaryRestrictions, allergens]);

  const loadRecommendations = async (refresh = false) => {
    if (!selectedLocation || !user) return;
    
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      const recommendationsData = await mockMLRecommendationsAPI.getRecommendations(
        user.id,
        dietaryRestrictions,
        allergens,
        selectedLocation.id
      );
      setRecommendations(recommendationsData.recommendations);
    } catch (error) {
      console.error('Failed to load ML recommendations:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleBowlSelect = (recommendation: MLRecommendation) => {
    addMessage({
      content: `I'd like to try the AI recommended ${recommendation.bowlComposition.name}`,
      type: 'user'
    });

    setTimeout(() => {
      addMessage({
        content: `Great choice! This recommendation is based on your preferences and popular choices. Would you like to customize it or add it to your cart?`,
        type: 'assistant'
      });
    }, 500);

    setTimeout(() => {
      setCurrentStep('ml-recommendation-details');
      onBowlSelect(recommendation.bowlComposition);
    }, 1000);
  };

  const handleRefresh = () => {
    addMessage({
      content: 'Show me different recommendations',
      type: 'user'
    });

    setTimeout(() => {
      addMessage({
        content: 'Let me generate fresh recommendations for you!',
        type: 'assistant'
      });
      loadRecommendations(true);
    }, 500);
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const getRecommendationReason = (recommendation: MLRecommendation) => {
    // Use the reasoning from the ML recommendation if available
    if (recommendation.reasoning) {
      return recommendation.reasoning;
    }

    const bowl = recommendation.bowlComposition;
    const reasons = [
      'Based on your order history',
      'Popular with similar preferences',
      'Matches your dietary needs',
      'High protein content',
      'Balanced nutrition profile',
      'Trending this week'
    ];

    // Simple logic to assign reasons based on bowl properties
    if (dietaryRestrictions.includes('high-protein' as any)) return 'High protein content';
    if (dietaryRestrictions.includes('vegan')) return 'Matches your dietary needs';
    if (bowl.isPopular) return 'Popular with similar preferences';

    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const getConfidenceScore = (recommendation: MLRecommendation) => {
    // Use the confidence from the ML recommendation if available
    if (recommendation.confidence) {
      return Math.floor(recommendation.confidence * 100);
    }
    // Mock confidence score between 85-98%
    return Math.floor(Math.random() * 14) + 85;
  };

  if (isLoading) {
    return (
      <div className="heybo-chatbot-ml-recommendations">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <Sparkles className="w-6 h-6 text-purple-600 absolute top-3 left-3" />
        </div>
        <div className="text-center">
          <h3 className="font-medium text-gray-900">Generating Recommendations</h3>
          <p className="text-sm text-gray-600">AI is analyzing your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
        <p className="text-sm text-gray-600">
          Personalized bowls crafted just for you
        </p>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          <span>{isRefreshing ? 'Generating...' : 'New Recommendations'}</span>
        </button>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => {
          const bowl = recommendation.bowlComposition;
          const confidenceScore = getConfidenceScore(recommendation);
          const reason = getRecommendationReason(recommendation);
          
          return (
            <motion.div
              key={bowl.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 group cursor-pointer"
              onClick={() => handleBowlSelect(recommendation)}
            >
              <div className="flex">
                {/* Bowl Image */}
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0 relative">
                  <span className="text-2xl">🥣</span>
                  <div className="absolute top-2 right-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                </div>

                {/* Bowl Details */}
                <div className="flex-1 p-4 space-y-2">
                  {/* Name and Confidence */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {bowl.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Zap className="w-3 h-3 text-purple-600" />
                          <span className="text-xs font-medium text-purple-700">
                            {confidenceScore}% match
                          </span>
                        </div>
                        {bowl.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-600">{bowl.rating}</span>
                          </div>
                        )}
                      </div>
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

                  {/* AI Reason */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-3 h-3 text-purple-600 flex-shrink-0" />
                      <span className="text-xs text-purple-700 font-medium">Why this bowl?</span>
                    </div>
                    <p className="text-xs text-purple-600 mt-1">{reason}</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {bowl.description}
                  </p>

                  {/* Tags and Calories */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {bowl.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {tag}
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
                  <button className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors group-hover:scale-110 transform duration-200">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Info */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-purple-900 mb-1">How AI Recommendations Work</div>
            <div className="text-purple-700">
              Our AI analyzes your order history, dietary preferences, popular choices, and nutritional balance 
              to suggest bowls you'll love. The more you order, the better the recommendations become!
            </div>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Recommendations update based on your preferences and ordering patterns
        </p>
      </div>
    </div>
  );
}
