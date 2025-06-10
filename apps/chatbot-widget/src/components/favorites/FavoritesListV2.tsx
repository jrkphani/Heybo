'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart,
  Star,
  Clock,
  ShoppingCart,
  Filter,
  Search,
  Grid,
  List,
  MoreVertical,
  Trash2,
  Edit3,
  Share2
} from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { useLayoutStore } from '../../store/layout-store';
import { BowlPreviewV2 } from '../bowl/BowlPreviewV2';
import { cn } from '../../lib/utils';

interface FavoriteBowl {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  prepTime: string;
  rating: number;
  ingredients: {
    base: string;
    protein: string;
    sides: string[];
    sauce: string;
    garnish: string;
  };
  dateAdded: Date;
  orderCount: number;
}

interface FavoritesListV2Props {
  onBowlSelect?: (bowl: FavoriteBowl) => void;
  onAddToCart?: (bowl: FavoriteBowl) => void;
  onRemoveFavorite?: (bowlId: string) => void;
  className?: string;
}

export function FavoritesListV2({
  onBowlSelect,
  onAddToCart,
  onRemoveFavorite,
  className
}: FavoritesListV2Props) {
  const { addMessage } = useChatbotStore();
  const { navigateToStage } = useLayoutStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'rating' | 'orders'>('recent');
  const [selectedBowl, setSelectedBowl] = useState<FavoriteBowl | null>(null);

  // Mock favorites data
  const mockFavorites: FavoriteBowl[] = [
    {
      id: 'fav-1',
      name: 'Mediterranean Power Bowl',
      description: 'My go-to healthy bowl with quinoa, grilled chicken, and tahini',
      image: '🥗',
      price: 1850,
      prepTime: '6 mins',
      rating: 5,
      ingredients: {
        base: 'Quinoa',
        protein: 'Grilled Chicken',
        sides: ['Roasted Vegetables', 'Chickpeas', 'Cucumber'],
        sauce: 'Tahini',
        garnish: 'Fresh Herbs'
      },
      dateAdded: new Date(2024, 0, 15),
      orderCount: 8
    },
    {
      id: 'fav-2',
      name: 'Spicy Tofu Delight',
      description: 'Plant-based favorite with brown rice and sriracha',
      image: '🌶️',
      price: 1650,
      prepTime: '5 mins',
      rating: 4,
      ingredients: {
        base: 'Brown Rice',
        protein: 'Spicy Tofu',
        sides: ['Edamame', 'Carrots', 'Avocado'],
        sauce: 'Sriracha Mayo',
        garnish: 'Sesame Seeds'
      },
      dateAdded: new Date(2024, 0, 10),
      orderCount: 5
    },
    {
      id: 'fav-3',
      name: 'Classic Protein Bowl',
      description: 'Simple and satisfying with all the essentials',
      image: '💪',
      price: 1950,
      prepTime: '7 mins',
      rating: 5,
      ingredients: {
        base: 'Brown Rice + Quinoa',
        protein: 'Grilled Chicken',
        sides: ['Broccoli', 'Sweet Potato', 'Black Beans'],
        sauce: 'Lemon Herb',
        garnish: 'Pumpkin Seeds'
      },
      dateAdded: new Date(2024, 0, 5),
      orderCount: 12
    }
  ];

  const filteredFavorites = mockFavorites
    .filter(bowl => 
      bowl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bowl.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'orders':
          return b.orderCount - a.orderCount;
        case 'recent':
        default:
          return b.dateAdded.getTime() - a.dateAdded.getTime();
      }
    });

  const handleBowlSelect = (bowl: FavoriteBowl) => {
    setSelectedBowl(bowl);
    onBowlSelect?.(bowl);
    
    addMessage({
      content: `Tell me about my ${bowl.name} favorite`,
      type: 'user'
    });

    setTimeout(() => {
      addMessage({
        content: `Great choice! Your ${bowl.name} has ${bowl.ingredients.base} as the base with ${bowl.ingredients.protein} and ${bowl.ingredients.sides.join(', ')}. You've ordered this ${bowl.orderCount} times! Would you like to add it to your cart or customize it?`,
        type: 'assistant'
      });
    }, 500);
  };

  const handleAddToCart = (bowl: FavoriteBowl) => {
    onAddToCart?.(bowl);
    
    addMessage({
      content: `Add my ${bowl.name} to cart`,
      type: 'user'
    });

    setTimeout(() => {
      addMessage({
        content: `Perfect! I've added your ${bowl.name} to your cart. It'll be ready in about ${bowl.prepTime}. Anything else you'd like to add?`,
        type: 'assistant'
      });
      navigateToStage('review', 'cart-management');
    }, 500);
  };

  const handleRemoveFavorite = (bowl: FavoriteBowl) => {
    onRemoveFavorite?.(bowl.id);
    
    addMessage({
      content: `Remove ${bowl.name} from favorites`,
      type: 'user'
    });

    setTimeout(() => {
      addMessage({
        content: `I've removed ${bowl.name} from your favorites. You can always add it back later if you change your mind!`,
        type: 'assistant'
      });
    }, 500);
  };

  const handleCustomize = (bowl: FavoriteBowl) => {
    addMessage({
      content: `I want to customize my ${bowl.name}`,
      type: 'user'
    });

    setTimeout(() => {
      addMessage({
        content: `Let's customize your ${bowl.name}! I'll start with your saved recipe and you can make any changes you'd like.`,
        type: 'assistant'
      });
      navigateToStage('building', 'bowl-building');
    }, 500);
  };

  const renderFavoriteCard = (bowl: FavoriteBowl) => (
    <motion.div
      key={bowl.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
    >
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{bowl.image}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {bowl.name}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-2">
                {bowl.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <div className="flex items-center text-yellow-500">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-medium ml-1">{bowl.rating}</span>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3">
        {/* Ingredients Summary */}
        <div className="space-y-2">
          <div className="text-xs">
            <span className="font-medium text-gray-700">Base:</span>
            <span className="text-gray-600 ml-1">{bowl.ingredients.base}</span>
          </div>
          <div className="text-xs">
            <span className="font-medium text-gray-700">Protein:</span>
            <span className="text-gray-600 ml-1">{bowl.ingredients.protein}</span>
          </div>
          <div className="text-xs">
            <span className="font-medium text-gray-700">Sides:</span>
            <span className="text-gray-600 ml-1">{bowl.ingredients.sides.join(', ')}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {bowl.prepTime}
          </div>
          <div>{bowl.orderCount} orders</div>
          <div className="font-medium text-gray-900">
            ${(bowl.price / 100).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex space-x-2">
          <button
            onClick={() => handleAddToCart(bowl)}
            className="flex-1 bg-heybo-primary text-white text-xs py-2 px-3 rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center"
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Add to Cart
          </button>
          <button
            onClick={() => handleCustomize(bowl)}
            className="flex-1 border border-gray-300 text-gray-700 text-xs py-2 px-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <Edit3 className="w-3 h-3 mr-1" />
            Customize
          </button>
        </div>
        
        <div className="flex justify-center mt-2">
          <button
            onClick={() => handleRemoveFavorite(bowl)}
            className="text-xs text-red-500 hover:text-red-700 transition-colors flex items-center"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Remove from Favorites
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderListItem = (bowl: FavoriteBowl) => (
    <motion.div
      key={bowl.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center space-x-4">
        <div className="text-2xl">{bowl.image}</div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{bowl.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{bowl.description}</p>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {bowl.prepTime}
                </div>
                <div className="flex items-center">
                  <Star className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
                  {bowl.rating}
                </div>
                <div>{bowl.orderCount} orders</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-gray-900 mb-2">
                ${(bowl.price / 100).toFixed(2)}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToCart(bowl)}
                  className="bg-heybo-primary text-white text-xs py-1 px-3 rounded hover:bg-orange-600 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleCustomize(bowl)}
                  className="border border-gray-300 text-gray-700 text-xs py-1 px-3 rounded hover:bg-gray-50 transition-colors"
                >
                  Customize
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderEmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="text-6xl mb-4">💝</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Favorites Yet
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Create and save your perfect bowl combinations to quickly reorder them anytime.
      </p>
      
      <button
        onClick={() => navigateToStage('building', 'bowl-building')}
        className="bg-heybo-primary text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors font-medium inline-flex items-center"
      >
        <Heart className="w-4 h-4 mr-2" />
        Create Your First Bowl
      </button>
    </motion.div>
  );

  return (
    <div className={cn("h-full flex flex-col bg-white", className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-500" />
              My Favorites
            </h2>
            <p className="text-sm text-gray-600">
              {filteredFavorites.length} saved bowl{filteredFavorites.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === 'grid' 
                  ? "bg-orange-100 text-orange-600" 
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === 'list' 
                  ? "bg-orange-100 text-orange-600" 
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search your favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="w-4 h-4 mr-2" />
              Sort by:
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="recent">Recently Added</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="orders">Most Ordered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredFavorites.length === 0 ? (
          searchQuery ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No favorites match your search
              </h3>
              <p className="text-gray-600">
                Try a different search term or browse all your favorites.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-heybo-primary hover:text-orange-600 font-medium"
              >
                Clear search
              </button>
            </div>
          ) : (
            renderEmptyState()
          )
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFavorites.map(renderFavoriteCard)}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFavorites.map(renderListItem)}
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
} 