'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Edit3, ShoppingCart } from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { cn } from '../../lib/utils';
import { mockIngredients } from '../../lib/mock-ingredient-helpers';
import type { CartItem } from '../../types';
import '../../styles/heybo-design-tokens.css';

interface CartViewProps {
  onViewCart?: () => void;
  onAddItems?: () => void;
  onCheckout?: () => void;
  className?: string;
}

export function CartView({ onViewCart, onAddItems, onCheckout, className }: CartViewProps) {
  const { addMessage, setCurrentStep } = useChatbotStore();

  // Mock cart items (same as in OrderSummaryPane)
  const cartItems: CartItem[] = [
    {
      id: '1',
      bowl: {
        id: 'bowl-1',
        name: 'Bowl 1',
        description: 'A delicious custom bowl with brown rice and grilled chicken',
        base: mockIngredients.brownRice,
        protein: mockIngredients.grilledChicken,
        sides: [],
        extraSides: [],
        extraProtein: [],
        totalWeight: 250,
        totalPrice: 1900,
        isSignature: false,
        imageUrl: '/bowls/bowl-1.jpg',
        tags: [],
        prepTime: '6 mins',
        calories: 450
      },
      quantity: 1,
      addedAt: new Date()
    },
    {
      id: '2',
      bowl: {
        id: 'bowl-2',
        name: 'Bowl 2',
        description: 'A healthy quinoa bowl with tofu protein',
        base: mockIngredients.quinoa,
        protein: mockIngredients.tofu,
        sides: [],
        extraSides: [],
        extraProtein: [],
        totalWeight: 250,
        totalPrice: 1450,
        isSignature: false,
        imageUrl: '/bowls/bowl-2.jpg',
        tags: [],
        prepTime: '5 mins',
        calories: 380
      },
      quantity: 1,
      addedAt: new Date()
    },
    {
      id: '3',
      bowl: {
        id: 'bowl-3',
        name: 'Bowl 3',
        description: 'A premium bowl with brown rice and fresh salmon',
        base: mockIngredients.brownRice,
        protein: mockIngredients.salmon,
        sides: [],
        extraSides: [],
        extraProtein: [],
        totalWeight: 250,
        totalPrice: 1390,
        isSignature: false,
        imageUrl: '/bowls/bowl-3.jpg',
        tags: [],
        prepTime: '7 mins',
        calories: 520
      },
      quantity: 1,
      addedAt: new Date()
    }
  ];

  const addOns = [
    { id: '1', name: 'Banana Cake', price: 1690, emoji: '🍰' },
    { id: '2', name: 'Supertonic', price: 1690, emoji: '🥤' },
    { id: '3', name: 'Greek Yoghurt', price: 1690, emoji: '🥛' }
  ];

  const total = cartItems.reduce((sum, item) => sum + (item.bowl.totalPrice * item.quantity), 0);

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const handleViewCart = () => {
    addMessage({
      content: 'Show me my cart details',
      type: 'user'
    });
    onViewCart?.();
  };

  const handleAddItems = () => {
    addMessage({
      content: 'I want to add more items',
      type: 'user'
    });
    onAddItems?.();
  };

  const handleCheckout = () => {
    addMessage({
      content: 'I\'m ready to checkout',
      type: 'user'
    });
    
    setTimeout(() => {
      addMessage({
        content: 'Perfect! Let me process your order and redirect you to checkout.',
        type: 'assistant'
      });
    }, 500);
    
    onCheckout?.();
  };

  return (
    <div className={cn("heybo-chatbot-cart-view flex flex-col h-full bg-white", className)}>
      {/* Header Message */}
      <div className="heybo-chatbot-cart-header p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Cool, you're all set with your {cartItems.length} bowls! Would you like to view your cart or add more items?
        </h2>

        {/* Action Buttons - Touch Target Compliant */}
        <div className="flex space-x-3">
          <button
            onClick={handleViewCart}
            className="heybo-chatbot-button heybo-chatbot-button-primary heybo-chatbot-touch-target flex items-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>View Cart</span>
          </button>

          <button
            onClick={handleAddItems}
            className="heybo-chatbot-button heybo-chatbot-button-secondary heybo-chatbot-touch-target flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Items</span>
          </button>
        </div>
      </div>

      {/* Cart Verification */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">
          Cool, please verify your order in the cart.
        </h3>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Cart Details</h4>
          
          <div className="space-y-3">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 bg-white rounded-lg p-3 border border-gray-200"
              >
                {/* Bowl Image */}
                <div className="w-12 h-12 bg-[var(--heybo-primary-100)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🥣</span>
                </div>
                
                {/* Bowl Details */}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.bowl.name}</div>
                  <div className="text-sm text-gray-600">
                    {item.bowl.base?.name}, {item.bowl.protein?.name}
                  </div>
                </div>
                
                {/* Quantity Controls - Touch Target Compliant */}
                <div className="flex items-center space-x-2">
                  <button className="heybo-chatbot-touch-target w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button className="heybo-chatbot-touch-target w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                
                {/* Price & Edit */}
                <div className="text-right">
                  <div className="font-medium text-gray-900">{formatPrice(item.bowl.totalPrice)}</div>
                  <button className="text-[var(--heybo-primary-600)] hover:text-[var(--heybo-primary-700)]">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Total */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Total</span>
              <span className="font-semibold text-lg text-[var(--heybo-primary-600)]">
                {formatPrice(total)}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Inclusive of $1.21 GST
            </div>
          </div>
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="p-6 flex-1">
        <h3 className="font-medium text-gray-900 mb-4">
          Complete your bowl with
        </h3>
        
        <div className="space-y-3">
          {addOns.map((addon) => (
            <div key={addon.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[var(--heybo-primary-300)] transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{addon.emoji}</span>
                <span className="font-medium text-gray-900">{addon.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-900">{formatPrice(addon.price)}</span>
                <button className="px-3 py-1 bg-[var(--heybo-primary-600)] text-white text-sm rounded hover:bg-[var(--heybo-primary-700)] transition-colors">
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions - Touch Target Compliant */}
      <div className="heybo-chatbot-cart-actions p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-3">
          <button
            onClick={handleCheckout}
            className="heybo-chatbot-button heybo-chatbot-button-primary heybo-chatbot-touch-target flex-1"
          >
            🛒 Checkout
          </button>

          <button
            onClick={handleAddItems}
            className="heybo-chatbot-button heybo-chatbot-button-secondary heybo-chatbot-touch-target px-6"
          >
            ➕ Add Items
          </button>
        </div>
      </div>
    </div>
  );
}
