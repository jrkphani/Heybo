'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, ChefHat, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { mockMLAPI } from '../../lib/mock-api';
import type { MLRecommendation, DietaryRestriction, Allergen } from '../../types';
import { cn } from '../../lib/utils';
import '../../styles/heybo-design-tokens.css';

interface MLSuggestionsStartingPointProps {
  dietaryRestrictions: DietaryRestriction[];
  allergens: Allergen[];
  onSelectSuggestion: (recommendation: MLRecommendation) => void;
  onBuildFromScratch: () => void;
  className?: string;
}

interface MLState {
  isLoading: boolean;
  recommendations: MLRecommendation[];
  fallbackUsed: boolean;
  source: 'ml' | 'cached' | 'popular' | 'signature';
  confidence: number;
  error: string | null;
  timeoutOccurred: boolean;
}

export function MLSuggestionsStartingPoint({
  dietaryRestrictions,
  allergens,
  onSelectSuggestion,
  onBuildFromScratch,
  className
}: MLSuggestionsStartingPointProps) {
  const { user, selectedLocation, addMessage } = useChatbotStore();
  const [mlState, setMlState] = useState<MLState>({
    isLoading: true,
    recommendations: [],
    fallbackUsed: false,
    source: 'ml',
    confidence: 1.0,
    error: null,
    timeoutOccurred: false
  });

  useEffect(() => {
    loadMLRecommendations();
  }, [user, selectedLocation, dietaryRestrictions, allergens]);

  const loadMLRecommendations = async (retry = false) => {
    if (!user || !selectedLocation) return;

    try {
      setMlState(prev => ({ 
        ...prev, 
        isLoading: true, 
        error: null,
        timeoutOccurred: false
      }));

      // Add loading message
      if (!retry) {
        addMessage({
          content: 'Let me create some personalized suggestions for you...',
          type: 'assistant'
        });
      }

      const result = await mockMLAPI.getRecommendations(
        user.id,
        dietaryRestrictions,
        allergens,
        selectedLocation.id,
        3000 // 3-second timeout
      );

      setMlState({
        isLoading: false,
        recommendations: result.recommendations,
        fallbackUsed: result.fallbackUsed,
        source: result.source,
        confidence: result.confidence,
        error: null,
        timeoutOccurred: false
      });

      // Add appropriate message based on result
      if (result.fallbackUsed) {
        const fallbackMessages = {
          cached: 'Using your previous preferences to suggest these bowls',
          popular: 'Here are some popular choices that match your preferences',
          signature: 'Our signature bowls that align with your dietary needs'
        };
        
        addMessage({
          content: fallbackMessages[result.source as keyof typeof fallbackMessages] || 
                   'Here are some great options for you',
          type: 'assistant'
        });
      } else {
        addMessage({
          content: 'Perfect! I\'ve created personalized suggestions based on your preferences',
          type: 'assistant'
        });
      }

    } catch (error: unknown) {
      const isTimeout = error instanceof Error && error.message?.includes('timeout');
      
      setMlState({
        isLoading: false,
        recommendations: [],
        fallbackUsed: true,
        source: 'signature',
        confidence: 0.3,
        error: isTimeout ? 'ML service timed out' : 'Failed to load recommendations',
        timeoutOccurred: isTimeout
      });

      addMessage({
        content: isTimeout 
          ? 'AI suggestions are taking longer than expected. You can build from scratch or try again.'
          : 'Having trouble with personalized suggestions. You can build your own bowl instead.',
        type: 'assistant'
      });
    }
  };

  const handleSelectSuggestion = (recommendation: MLRecommendation) => {
    addMessage({
      content: `I'd like to start with the ${recommendation.bowlComposition.name} as a base`,
      type: 'user'
    });

    setTimeout(() => {
      addMessage({
        content: `Great choice! I'll use this as your starting point. You can customize any ingredients as we build your bowl.`,
        type: 'assistant'
      });
    }, 500);

    onSelectSuggestion(recommendation);
  };

  const handleBuildFromScratch = () => {
    addMessage({
      content: 'I want to build my bowl from scratch',
      type: 'user'
    });

    setTimeout(() => {
      addMessage({
        content: 'Perfect! Let\'s build your custom bowl step by step, starting with the base.',
        type: 'assistant'
      });
    }, 500);

    onBuildFromScratch();
  };

  const handleRetry = () => {
    addMessage({
      content: 'Let me try getting AI suggestions again',
      type: 'user'
    });

    setTimeout(() => {
      loadMLRecommendations(true);
    }, 500);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'heybo-text-primary-600';
  };

  const getSourceLabel = (source: string) => {
    const labels = {
      ml: 'AI Personalized',
      cached: 'Based on History',
      popular: 'Popular Choice',
      signature: 'Signature Bowl'
    };
    return labels[source as keyof typeof labels] || 'Recommended';
  };

  if (mlState.isLoading) {
    return (
      <div className={cn("heybo-chatbot-ml-suggestions flex flex-col items-center justify-center p-8 space-y-4", className)}>
        <div className="relative">
          <Sparkles className="w-12 h-12 text-purple-600 animate-pulse" />
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin absolute -bottom-1 -right-1" />
        </div>
        <div className="text-center">
          <h3 className="font-medium text-gray-900 mb-1">Creating your suggestions</h3>
          <p className="text-sm text-gray-600">AI is analyzing your preferences...</p>
        </div>
        <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (mlState.error && mlState.recommendations.length === 0) {
    return (
      <div className={cn("heybo-chatbot-ml-suggestions space-y-6", className)}>
        {/* Error State */}
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500" />
          <div className="text-center">
            <h3 className="font-medium text-gray-900 mb-1">
              {mlState.timeoutOccurred ? 'AI suggestions timed out' : 'Unable to load suggestions'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {mlState.timeoutOccurred
                ? 'The AI is taking longer than usual. You can try again or build from scratch.'
                : 'Don\'t worry! You can still create an amazing bowl manually.'
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {mlState.timeoutOccurred && (
                <button
                  onClick={handleRetry}
                  className="flex items-center space-x-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try AI again</span>
                </button>
              )}

              <button
                onClick={handleBuildFromScratch}
                className="flex items-center space-x-2 px-4 py-2 heybo-bg-primary-600 text-white rounded-lg heybo-hover-bg-primary-700 transition-colors"
              >
                <ChefHat className="w-4 h-4" />
                <span>Build from scratch</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("heybo-chatbot-ml-suggestions space-y-6", className)}>
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Suggestions</h3>
        </div>
        <p className="text-sm text-gray-600">
          Choose a suggestion as your starting point, or build from scratch
        </p>

        {/* Fallback indicator */}
        {mlState.fallbackUsed && (
          <div className="mt-2 inline-flex items-center space-x-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs text-amber-700">
            <Clock className="w-3 h-3" />
            <span>{getSourceLabel(mlState.source)}</span>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="space-y-3">
        {mlState.recommendations.slice(0, 3).map((recommendation, index) => (
          <motion.button
            key={recommendation.id}
            onClick={() => handleSelectSuggestion(recommendation)}
            className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900">
                    {recommendation.bowlComposition.name}
                  </h4>
                  <span className={cn(
                    "px-2 py-0.5 text-xs font-medium rounded-full",
                    getConfidenceColor(recommendation.confidence),
                    "bg-gray-100"
                  )}>
                    {Math.round(recommendation.confidence * 100)}% match
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {recommendation.bowlComposition.description}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>${(recommendation.bowlComposition.totalPrice / 100).toFixed(2)}</span>
                  <span>{recommendation.bowlComposition.totalWeight}g</span>
                  <span>{recommendation.bowlComposition.calories} cal</span>
                </div>
                
                {recommendation.reasoning && (
                  <p className="text-xs text-purple-600 mt-2 italic">
                    "{recommendation.reasoning}"
                  </p>
                )}
              </div>
              
              <div className="ml-4 text-purple-600">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Build from scratch option */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleBuildFromScratch}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg heybo-hover-border-primary-400 hover:bg-orange-50 transition-all duration-200 text-center group"
        >
          <div className="flex items-center justify-center space-x-2">
            <ChefHat className="w-5 h-5 text-gray-400 group-hover:heybo-text-primary-600 transition-colors" />
            <span className="font-medium text-gray-600 group-hover:heybo-text-primary-700 transition-colors">
              Build from scratch instead
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Start with a clean slate and choose every ingredient
          </p>
        </button>
      </div>

      {/* AI Info */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-purple-900 mb-1">How AI Suggestions Work</div>
            <div className="text-purple-700">
              These suggestions are based on your dietary preferences, order history, and popular combinations. 
              You can use any suggestion as a starting point and customize it further.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
