'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Clock, Plus, Trash2 } from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { mockFavoritesAPI } from '../../lib/mock-api';
import { cn } from '../../lib/utils';
import type { FavoriteItem } from '../../types';

interface FavoritesListProps {
  onFavoriteSelect: (favorite: FavoriteItem) => void;
  className?: string;
}

export function FavoritesList({ onFavoriteSelect, className }: FavoritesListProps) {
  const { user, addMessage, setCurrentStep } = useChatbotStore();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const favoritesData = await mockFavoritesAPI.getFavorites(user.id);
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteSelect = (favorite: FavoriteItem) => {
    addMessage({
      content: `I want to order my favorite: ${favorite.name}`,
      type: 'user'
    });

    setTimeout(() => {
      addMessage({
        content: `Excellent choice! "${favorite.name}" is one of your favorites. Let me check ingredient availability and prepare your order.`,
        type: 'assistant'
      });
    }, 500);

    setTimeout(() => {
      setCurrentStep('favorite-details');
      onFavoriteSelect(favorite);
    }, 1000);
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="heybo-chatbot-favorites">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--heybo-primary-600)]"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Favorites Yet</h3>
          <p className="text-gray-600 mb-4">Save your favorite bowls for quick reordering.</p>
          <button
            onClick={() => setCurrentStep('order-type-selection')}
            className="px-6 py-2 bg-[var(--heybo-primary-600)] text-white rounded-lg hover:bg-[var(--heybo-primary-700)] transition-colors"
          >
            Explore Our Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Your Favorites</h3>
        <p className="text-sm text-gray-600">
          Your saved bowls, ready to order again
        </p>
      </div>

      {/* Favorites Grid */}
      <div className="space-y-4">
        {favorites.map((favorite, index) => (
          <motion.div
            key={favorite.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 group cursor-pointer"
            onClick={() => handleFavoriteSelect(favorite)}
          >
            <div className="flex">
              {/* Favorite Image */}
              <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center flex-shrink-0 relative">
                <span className="text-2xl">🥣</span>
                <div className="absolute top-2 right-2">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </div>
              </div>

              {/* Favorite Details */}
              <div className="flex-1 p-4 space-y-2">
                {/* Name and Type */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-[var(--heybo-primary-600)] transition-colors">
                      {favorite.name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        favorite.type === 'signature' 
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-green-100 text-green-700"
                      )}>
                        {favorite.type === 'signature' ? 'Signature' : 'Custom'}
                      </span>
                      {favorite.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">{favorite.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatPrice(favorite.price)}</div>
                    {favorite.lastOrdered && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>Last: {formatDate(favorite.lastOrdered)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description/Ingredients */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {favorite.description || 'Your custom creation with perfectly balanced ingredients'}
                </p>

                {/* Tags */}
                {favorite.tags && favorite.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {favorite.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {favorite.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{favorite.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-gray-500">
                    Saved {formatDate(favorite.createdAt)}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle remove from favorites
                        console.log('Remove favorite:', favorite.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <button className="flex items-center space-x-1 px-3 py-1 bg-[var(--heybo-primary-600)] text-white rounded-lg hover:bg-[var(--heybo-primary-700)] transition-colors group-hover:scale-105 transform duration-200">
                      <Plus className="w-3 h-3" />
                      <span className="text-sm">Order</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Show More Button (if more than 5 favorites) */}
      {favorites.length >= 5 && (
        <div className="text-center">
          <button className="text-[var(--heybo-primary-600)] hover:text-[var(--heybo-primary-700)] font-medium">
            View All Favorites
          </button>
        </div>
      )}

      {/* Add to Favorites Info */}
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Heart className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-pink-900 mb-1">Pro Tip</div>
            <div className="text-pink-700">
              Save any bowl as a favorite during checkout to quickly reorder it later. 
              Your favorites sync across all devices!
            </div>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Tap any favorite to reorder with current ingredient availability
        </p>
      </div>
    </div>
  );
}
