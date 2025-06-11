'use client';

import React from 'react';
import { MapPin, Clock, Edit3, Trash2 } from 'lucide-react';
import { CollapsibleSection } from '../layout/TwoPaneLayout';
import { useChatbotStore } from '../../store/chatbot-store';
import { cn } from '../../lib/utils';
import { mockIngredients } from '../../lib/mock-ingredient-helpers';
import type { CartItem } from '../../types';

interface OrderSummaryPaneProps {
  className?: string;
}

export function OrderSummaryPane({ className }: OrderSummaryPaneProps) {
  const { 
    selectedLocation, 
    currentBowl, 
    calculateBowlWeight, 
    calculateBowlPrice,
    user 
  } = useChatbotStore();

  // Mock cart items for demonstration
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
        totalPrice: 1690,
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
        name: 'Bowl 2 - Customized',
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
        name: 'Bowl 3 - Customized',
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

  const subtotal = cartItems.reduce((sum, item) => sum + (item.bowl.totalPrice * item.quantity), 0);
  const gst = Math.round(subtotal * 0.07); // 7% GST
  const total = subtotal + gst;

  const formatPrice = (price: number) => {
    return `${(price / 100).toFixed(2)} $`;
  };

  return (
    <div className={cn("heybo-chatbot-order-summary h-full flex flex-col", className)}>
      {/* Bowl Details Section */}
      <CollapsibleSection title="Bowl Details" isOpen={true}>
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.bowl.name}</div>
                <div className="text-gray-500">Qty: {item.quantity}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatPrice(item.bowl.totalPrice)}</div>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Order Details Section */}
      <CollapsibleSection title="Order Details" isOpen={true}>
        <div className="space-y-3">
          {/* Items List */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Item</span>
              <span className="text-gray-600">Price</span>
              <span className="text-gray-600">Total</span>
            </div>
            
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-900">{item.bowl.name}</span>
                <span className="text-gray-600">{formatPrice(item.bowl.totalPrice)}</span>
                <span className="text-gray-900">{formatPrice(item.bowl.totalPrice * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Inclusive of GST</span>
              <span className="text-gray-900">{formatPrice(gst)}</span>
            </div>
            <div className="flex justify-between font-semibold text-[var(--heybo-primary-600)] border-t border-gray-200 pt-2">
              <span>Total Cost</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Pickup Details Section */}
      <CollapsibleSection title="Pickup Details" isOpen={true}>
        <div className="space-y-3">
          {/* Location */}
          {selectedLocation && (
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-[var(--heybo-primary-600)] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{selectedLocation.name}</div>
                <div className="text-sm text-gray-600">{selectedLocation.address}</div>
              </div>
            </div>
          )}

          {/* Pickup Time */}
          <div className="flex items-start space-x-3">
            <Clock className="w-4 h-4 text-[var(--heybo-primary-600)] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Today at 12:30 PM</div>
              <div className="text-sm text-gray-600">Your order will be ready for pickup</div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Spacer to push content up */}
      <div className="flex-1"></div>
    </div>
  );
}
