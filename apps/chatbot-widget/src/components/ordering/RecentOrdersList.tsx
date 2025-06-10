'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, RotateCcw, MapPin, Calendar, Star } from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { mockRecentOrdersAPI } from '../../lib/mock-api';
import { cn } from '../../lib/utils';
import type { RecentOrder } from '../../types';

interface RecentOrdersListProps {
  onOrderSelect: (order: RecentOrder) => void;
  className?: string;
}

export function RecentOrdersList({ onOrderSelect, className }: RecentOrdersListProps) {
  const { user, addMessage, setCurrentStep } = useChatbotStore();
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentOrders();
  }, [user]);

  const loadRecentOrders = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const orders = await mockRecentOrdersAPI.getRecentOrders(user.id);
      setRecentOrders(orders);
    } catch (error) {
      console.error('Failed to load recent orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderSelect = (order: RecentOrder) => {
    addMessage({
      content: `I want to reorder from ${order.orderDate}`,
      type: 'user'
    });

    setTimeout(() => {
      addMessage({
        content: `Great choice! I'll recreate your order from ${order.orderDate}. Let me check ingredient availability at your selected location.`,
        type: 'assistant'
      });
    }, 500);

    setTimeout(() => {
      setCurrentStep('recent-order-details');
      onOrderSelect(order);
    }, 1000);
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (recentOrders.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Orders</h3>
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <button
            onClick={() => setCurrentStep('order-type-selection')}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Start Your First Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        <p className="text-sm text-gray-600">
          Reorder your favorites with just one tap
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {recentOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 group cursor-pointer"
            onClick={() => handleOrderSelect(order)}
          >
            {/* Order Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{formatDate(order.orderDate.toISOString())}</span>
                  {order.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{order.rating}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span>{order.location}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-gray-900">{formatPrice(order.totalAmount)}</div>
                <div className="text-sm text-gray-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2 mb-3">
              {order.items.slice(0, 2).map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">🥣</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{item.bowl.name}</div>
                    <div className="text-xs text-gray-600">
                      {item.customizations && item.customizations.length > 0 
                        ? `${item.customizations.slice(0, 2).join(', ')}${item.customizations.length > 2 ? '...' : ''}`
                        : 'Standard recipe'
                      }
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(item.bowl.totalPrice)}
                  </div>
                </div>
              ))}
              
              {order.items.length > 2 && (
                <div className="text-sm text-gray-500 pl-11">
                  +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* Reorder Button */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                {order.status === 'completed' ? 'Order completed' : 'Order in progress'}
              </div>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors group-hover:scale-105 transform duration-200">
                <RotateCcw className="w-4 h-4" />
                <span>Reorder</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Show More Button (if more than 5 orders) */}
      {recentOrders.length >= 5 && (
        <div className="text-center">
          <button className="text-orange-600 hover:text-orange-700 font-medium">
            View All Orders
          </button>
        </div>
      )}

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          We'll check ingredient availability and suggest alternatives if needed
        </p>
      </div>
    </div>
  );
}
