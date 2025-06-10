'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Star, Clock, Heart, Sparkles, HelpCircle } from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { cn } from '../../lib/utils';

interface OrderTypeSelectionProps {
  onOrderTypeSelect: (type: string) => void;
  className?: string;
}

export function OrderTypeSelection({ onOrderTypeSelect, className }: OrderTypeSelectionProps) {
  const { addMessage, setCurrentStep, user } = useChatbotStore();

  const orderTypes = [
    {
      id: 'signature',
      title: 'Signature Bowls',
      description: 'Chef-crafted bowls with perfectly balanced flavors',
      icon: Star,
      color: 'from-blue-500 to-blue-600',
      features: ['Ready-made recipes', 'Balanced nutrition', 'Popular choices'],
      estimatedTime: '2 mins'
    },
    {
      id: 'create-your-own',
      title: 'Create Your Own',
      description: 'Build your perfect bowl from scratch',
      icon: ChefHat,
      color: 'from-orange-500 to-orange-600',
      features: ['Full customization', 'Your preferences', 'Unlimited combinations'],
      estimatedTime: '5 mins'
    },
    {
      id: 'recent',
      title: 'Recent Orders',
      description: 'Reorder your previous favorites',
      icon: Clock,
      color: 'from-green-500 to-green-600',
      features: ['Quick reorder', 'Saved preferences', 'Familiar choices'],
      estimatedTime: '1 min'
    },
    {
      id: 'favorites',
      title: 'Your Favorites',
      description: 'Your saved bowls, ready to order',
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      features: ['Personal collection', 'Loved recipes', 'Instant order'],
      estimatedTime: '1 min'
    },
    {
      id: 'ml-recommendations',
      title: 'AI Recommendations',
      description: 'Personalized suggestions just for you',
      icon: Sparkles,
      color: 'from-purple-500 to-purple-600',
      features: ['Smart suggestions', 'Based on preferences', 'Discover new flavors'],
      estimatedTime: '3 mins'
    }
  ];

  const handleOrderTypeSelect = (type: string) => {
    const selectedType = orderTypes.find(t => t.id === type);
    
    addMessage({
      content: `I want to ${selectedType?.title.toLowerCase()}`,
      type: 'user'
    });

    setTimeout(() => {
      let responseMessage = '';
      let nextStep = '';

      switch (type) {
        case 'signature':
          responseMessage = 'Great choice! Let me show you our signature bowls with chef-crafted recipes.';
          nextStep = 'signature-bowls';
          break;
        case 'create-your-own':
          responseMessage = 'Perfect! Let\'s build your custom bowl step by step.';
          nextStep = 'create-your-own';
          break;
        case 'recent':
          responseMessage = 'I\'ll show you your recent orders for quick reordering.';
          nextStep = 'recent-orders';
          break;
        case 'favorites':
          responseMessage = 'Here are your saved favorite bowls!';
          nextStep = 'favorites';
          break;
        case 'ml-recommendations':
          responseMessage = 'Let me create personalized recommendations based on your preferences.';
          nextStep = 'dietary-preferences';
          break;
        default:
          responseMessage = 'Let me help you with that.';
          nextStep = 'welcome';
      }

      addMessage({
        content: responseMessage,
        type: 'assistant'
      });

      setTimeout(() => {
        setCurrentStep(nextStep as any);
        onOrderTypeSelect(type);
      }, 500);
    }, 500);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">How would you like to order?</h3>
        <p className="text-sm text-gray-600">
          Choose your preferred way to build your perfect bowl
        </p>
      </div>

      {/* Order Type Cards */}
      <div className="space-y-4">
        {orderTypes.map((orderType, index) => (
          <motion.button
            key={orderType.id}
            onClick={() => handleOrderTypeSelect(orderType.id)}
            className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all duration-200 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0",
                `bg-gradient-to-r ${orderType.color}`
              )}>
                <orderType.icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {orderType.title}
                  </h4>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    ~{orderType.estimatedTime}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600">{orderType.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {orderType.features.map((feature, featureIndex) => (
                    <span
                      key={featureIndex}
                      className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-full border"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="text-gray-400 group-hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* User Status Info */}
      {user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-blue-700">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <div className="font-medium text-blue-900">Welcome back, {user.name}!</div>
              <div className="text-sm text-blue-700 mt-1">
                {user.orderHistory && user.orderHistory.length > 0 
                  ? `You have ${user.orderHistory.length} previous orders and ${user.favorites?.length || 0} favorites`
                  : 'Start building your order history with your first bowl!'
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Link */}
      <div className="text-center">
        <button
          onClick={() => handleOrderTypeSelect('faq')}
          className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Need help choosing? View FAQ</span>
        </button>
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          All options can be customized to match your dietary preferences and taste
        </p>
      </div>
    </div>
  );
}
