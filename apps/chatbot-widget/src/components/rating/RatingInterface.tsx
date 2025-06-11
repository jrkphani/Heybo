'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown, ChevronRight, X, MessageSquare, Search } from 'lucide-react';
import type { UnratedOrder, RatingData, BowlRating } from '../../types';
import { ratingService } from '../../lib/services/rating-service';
import { cn } from '../../lib/utils';

interface RatingInterfaceProps {
  unratedOrders: UnratedOrder[];
  onRatingComplete: (rating?: RatingData) => void;
  onSkip: () => void;
  className?: string;
}

export function RatingInterface({ unratedOrders, onRatingComplete, onSkip, className }: RatingInterfaceProps) {
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [overallRating, setOverallRating] = useState<number | undefined>();
  const [overallComment, setOverallComment] = useState('');
  const [bowlRatings, setBowlRatings] = useState<BowlRating[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentOrder = unratedOrders[currentOrderIndex];

  React.useEffect(() => {
    if (currentOrder) {
      // Initialize bowl ratings
      setBowlRatings(currentOrder.bowls.map(bowl => ({
        bowlId: bowl.id,
        bowlName: bowl.name,
        rating: undefined as any
      })));
    }
  }, [currentOrder]);

  const handleOverallRating = (rating: number) => {
    setOverallRating(rating);
    setError(null);
  };

  const handleBowlRating = (bowlId: string, rating: 'thumbs_up' | 'thumbs_down') => {
    setBowlRatings(prev => 
      prev.map(br => 
        br.bowlId === bowlId 
          ? { ...br, rating }
          : br
      )
    );
    setError(null);
  };

  const handleBowlComment = (bowlId: string, comment: string) => {
    setBowlRatings(prev => 
      prev.map(br => 
        br.bowlId === bowlId 
          ? { ...br, comment }
          : br
      )
    );
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate that at least one rating is provided
      const hasOverallRating = overallRating !== undefined;
      const hasBowlRatings = bowlRatings.some(br => br.rating !== undefined);

      if (!hasOverallRating && !hasBowlRatings) {
        setError('Please provide at least an overall rating or rate individual bowls');
        return;
      }

      if (!currentOrder) {
        setError('No order selected for rating');
        return;
      }

      const ratingData: RatingData = {
        orderId: currentOrder.orderId,
        overallRating: overallRating || undefined,
        overallComment: overallComment.trim() || undefined,
        bowlRatings: bowlRatings.filter(br => br.rating !== undefined),
        timestamp: new Date(),
        skipped: false
      };

      const result = await ratingService.submitRating(ratingData);
      
      if (result.success) {
        // Move to next order or complete
        if (currentOrderIndex < unratedOrders.length - 1) {
          setCurrentOrderIndex(prev => prev + 1);
          resetForm();
        } else {
          onRatingComplete(ratingData);
        }
      } else {
        setError(result.error || 'Failed to submit rating');
      }
    } catch (error) {
      setError('An error occurred while submitting your rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipOrder = async () => {
    try {
      if (!currentOrder) return;
      await ratingService.skipRating(currentOrder.orderId);
      
      if (currentOrderIndex < unratedOrders.length - 1) {
        setCurrentOrderIndex(prev => prev + 1);
        resetForm();
      } else {
        onSkip();
      }
    } catch (error) {
      console.warn('Failed to skip rating:', error);
      // Continue anyway
      if (currentOrderIndex < unratedOrders.length - 1) {
        setCurrentOrderIndex(prev => prev + 1);
        resetForm();
      } else {
        onSkip();
      }
    }
  };

  const handleSkipAll = () => {
    onSkip();
  };

  const resetForm = () => {
    setOverallRating(undefined);
    setOverallComment('');
    setBowlRatings([]);
    setShowComments(false);
    setError(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-SG', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (!currentOrder) {
    return null;
  }

  return (
    <div className={cn("heybo-chatbot-rating h-full flex items-center justify-center bg-black bg-opacity-50 p-4", className)}>
      {/* Modal Container */}
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Feedback</h2>
          </div>
          <button
            onClick={handleSkipAll}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Title and Description */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">We'd love your feedback!</h3>
            <p className="text-sm text-gray-600">
              Tell us what you liked or didn't about each item from your last order
            </p>
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Individual Bowl Ratings */}
          <div className="space-y-3 mb-6">
            {currentOrder.bowls.map((bowl, index) => {
              const bowlRating = bowlRatings.find(br => br.bowlId === bowl.id);
              return (
                <div key={bowl.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[var(--heybo-primary-500)] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {bowl.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{bowl.name}</h4>
                      <p className="text-sm text-gray-600">${(bowl.totalPrice / 100).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600 mr-2">Qty. 1</span>
                    <button
                      onClick={() => handleBowlRating(bowl.id, 'thumbs_up')}
                      className={`p-2 rounded-lg transition-colors ${
                        bowlRating?.rating === 'thumbs_up'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-white text-gray-400 hover:text-green-600 border border-gray-200'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleBowlRating(bowl.id, 'thumbs_down')}
                      className={`p-2 rounded-lg transition-colors ${
                        bowlRating?.rating === 'thumbs_down'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-white text-gray-400 hover:text-red-600 border border-gray-200'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overall Experience Rating */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Hope you enjoyed your last meal! How was your previous ordering experience?
            </p>

            {/* Smiley Face Rating */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              {[
                { value: 1, emoji: '😞', label: 'Very Bad', color: 'text-red-500' },
                { value: 2, emoji: '😕', label: 'Bad', color: 'text-[var(--heybo-primary-500)]' },
                { value: 3, emoji: '😐', label: 'Average', color: 'text-yellow-500' },
                { value: 4, emoji: '😊', label: 'Satisfied', color: 'text-green-500' },
                { value: 5, emoji: '😄', label: 'Very Good', color: 'text-green-600' }
              ].map((rating) => (
                <button
                  key={rating.value}
                  onClick={() => handleOverallRating(rating.value)}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                    overallRating === rating.value
                      ? 'bg-blue-50 border-2 border-blue-300'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl mb-1">{rating.emoji}</span>
                  <span className={`text-xs font-medium ${
                    overallRating === rating.value ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {rating.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Comment Section */}
            <textarea
              value={overallComment}
              onChange={(e) => setOverallComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              maxLength={500}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-6 pt-0">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit'
            )}
          </button>

          {/* Skip Option */}
          {currentOrderIndex < unratedOrders.length - 1 && (
            <div className="text-center mt-3">
              <button
                onClick={handleSkipOrder}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Skip this order ({unratedOrders.length - currentOrderIndex - 1} more to rate)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
