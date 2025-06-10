// Enhanced Cart Manager Component for New Layout System
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Edit3, 
  Trash2, 
  ArrowRight,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle
} from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { useLayoutStore } from '../../store/layout-store';
import { BowlPreviewV2 } from '../bowl/BowlPreviewV2';
import { mockBases, mockProteins, mockSides, mockSauces, mockGarnishes } from '../../lib/mock-data';
import { cn } from '../../lib/utils';

interface CartManagerV2Props {
  variant?: 'full' | 'summary' | 'checkout';
  onEditItem?: (itemId: string) => void;
  onRemoveItem?: (itemId: string) => void;
  onAddItems?: () => void;
  onCheckout?: () => void;
  onClose?: () => void;
  className?: string;
}

export function CartManagerV2({
  variant = 'full',
  onEditItem,
  onRemoveItem,
  onAddItems,
  onCheckout,
  onClose,
  className
}: CartManagerV2Props) {
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const { 
    addMessage
  } = useChatbotStore();

  const { navigateToStage } = useLayoutStore();

  // Mock cart data for demonstration
  const mockCartItems = [
    {
      id: '1',
      bowl: {
        id: 'bowl-1',
        name: 'Mediterranean Bowl',
        description: 'Fresh quinoa with grilled chicken and Mediterranean vegetables',
        base: mockBases[1]!, // Quinoa
        protein: mockProteins[0]!, // Roasted Lemongrass Chicken
        sides: [mockSides[0]!], // Roasted Pumpkin
        extraSides: [],
        extraProtein: [],
        sauce: mockSauces[0]!, // Purple Sweet Potato Dip
        garnish: mockGarnishes[0]!, // Mixed Seeds
        totalWeight: 390,
        totalPrice: 1800,
        isSignature: false,
        imageUrl: '/bowls/mediterranean.jpg',
        tags: ['healthy', 'protein-rich'],
        prepTime: '6 mins',
        calories: 485
      },
      quantity: 2,
      addedAt: new Date()
    },
    {
      id: '2',
      bowl: {
        id: 'bowl-2',
        name: 'Power Protein Bowl',
        description: 'Brown rice with double protein and superfood toppings',
        base: mockBases[0]!, // Brown Rice
        protein: mockProteins[2]!, // Tofu
        sides: [mockSides[1]!], // Charred Corn
        extraSides: [],
        extraProtein: [],
        sauce: mockSauces[1]!, // Spicy Peanut Sauce
        garnish: mockGarnishes[1]!, // Crispy Shallots
        totalWeight: 340,
        totalPrice: 1350,
        isSignature: true,
        imageUrl: '/bowls/power-protein.jpg',
        tags: ['vegan', 'high-protein'],
        prepTime: '5 mins',
        calories: 520
      },
      quantity: 1,
      addedAt: new Date()
    }
  ];

  const cartItems = mockCartItems;
  const subtotal = cartItems.reduce((sum: number, item: any) => sum + (item.bowl.totalPrice * item.quantity), 0);
  const tax = Math.round(subtotal * 0.0875);
  const deliveryFee = subtotal > 2500 ? 0 : 299;
  const total = subtotal + tax + deliveryFee;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsProcessingCheckout(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onCheckout?.();
      navigateToStage('confirmation', 'order-review');
      
      addMessage({
        content: 'Processing your order...',
        type: 'assistant'
      });
    } catch (error) {
      addMessage({
        content: 'Sorry, there was an error processing your order. Please try again.',
        type: 'assistant'
      });
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className={cn("h-full flex flex-col items-center justify-center p-8", className)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-600 mb-6">
            Ready to build some delicious bowls?
          </p>
        </motion.div>
      </div>
    );
  }

  // Summary variant - compact view
  if (variant === 'summary') {
    return (
      <div className={cn("bg-white rounded-lg border border-gray-200 p-4", className)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </h3>
          <div className="text-lg font-bold text-heybo-primary">
            ${(total / 100).toFixed(2)}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {cartItems.slice(0, 2).map((item) => (
            <BowlPreviewV2
              key={item.id}
              bowl={item.bowl}
              variant="compact"
              showPrice={false}
              className="text-sm"
            />
          ))}
          {cartItems.length > 2 && (
            <div className="text-xs text-gray-500 text-center py-2">
              +{cartItems.length - 2} more items
            </div>
          )}
        </div>

        <button
          onClick={handleCheckout}
          disabled={isProcessingCheckout}
          className="w-full bg-heybo-primary text-white py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
        >
          {isProcessingCheckout ? 'Processing...' : 'Checkout'}
        </button>
      </div>
    );
  }

  // Full variant - complete cart management
  return (
    <div className={cn("h-full flex flex-col bg-white", className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Your Cart
          </h2>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              15-20 mins
            </span>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Delivery
            </span>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4">
          <AnimatePresence>
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🥣</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.bowl.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.bowl.description}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-heybo-primary">
                          ${((item.bowl.totalPrice * item.quantity) / 100).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          ${(item.bowl.totalPrice / 100).toFixed(2)} each
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 mb-3">
                      <div className="flex flex-wrap gap-1">
                        {item.bowl.base && (
                          <span className="bg-gray-200 px-2 py-1 rounded">
                            {item.bowl.base.name}
                          </span>
                        )}
                        {item.bowl.protein && (
                          <span className="bg-gray-200 px-2 py-1 rounded">
                            {item.bowl.protein.name}
                          </span>
                        )}
                        {item.bowl.sides?.slice(0, 2).map(side => (
                          <span key={side.id} className="bg-gray-200 px-2 py-1 rounded">
                            {side.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        
                        <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        
                        <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Order Summary & Checkout */}
      <div className="border-t border-gray-200 bg-gray-50 p-6">
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${(subtotal / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${(tax / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? 'Free' : `$${(deliveryFee / 100).toFixed(2)}`}</span>
          </div>
          {deliveryFee === 0 && (
            <div className="text-xs text-green-600 flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              Free delivery on orders over $25
            </div>
          )}
          <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-heybo-primary">${(total / 100).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Add Items
          </button>
          
          <button
            onClick={handleCheckout}
            disabled={isProcessingCheckout}
            className="flex-2 bg-heybo-primary text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center"
          >
            {isProcessingCheckout ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <ArrowRight className="w-5 h-5 mr-2" />
            )}
            {isProcessingCheckout ? 'Processing...' : 'Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
} 