'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, MapPin, RefreshCw } from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { cn } from '../../lib/utils';

interface OrderTrackingProps {
  orderId?: string;
  className?: string;
}

interface OrderStatus {
  id: string;
  status: 'preparing' | 'ready' | 'completed';
  estimatedTime: string;
  location: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  orderTime: Date;
  lastUpdate: Date;
}

export function OrderTracking({ orderId, className }: OrderTrackingProps) {
  const { addMessage } = useChatbotStore();
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock order data
    const mockOrder: OrderStatus = {
      id: orderId || 'ORD-12345',
      status: 'preparing',
      estimatedTime: '15-20 minutes',
      location: 'Marina Bay Sands',
      items: [
        { name: 'Mediterranean Power Bowl', quantity: 1 },
        { name: 'Green Goddess Bowl', quantity: 1 }
      ],
      orderTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      lastUpdate: new Date()
    };

    setTimeout(() => {
      setOrder(mockOrder);
      setIsLoading(false);
    }, 1000);
  }, [orderId]);

  const getStatusIcon = (status: OrderStatus['status']) => {
    switch (status) {
      case 'preparing':
        return <Clock className="w-5 h-5 text-[var(--heybo-primary-500)]" />;
      case 'ready':
        return <Package className="w-5 h-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getStatusText = (status: OrderStatus['status']) => {
    switch (status) {
      case 'preparing':
        return 'Being prepared';
      case 'ready':
        return 'Ready for pickup';
      case 'completed':
        return 'Completed';
    }
  };

  const getStatusColor = (status: OrderStatus['status']) => {
    switch (status) {
      case 'preparing':
        return 'text-[var(--heybo-primary-600)] bg-[var(--heybo-primary-50)] border-[var(--heybo-primary-200)]';
      case 'ready':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'completed':
        return 'text-green-700 bg-green-100 border-green-300';
    }
  };

  if (isLoading) {
    return (
      <div className={cn("heybo-chatbot-order-tracking p-6 bg-white rounded-lg border border-gray-200", className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={cn("p-6 bg-white rounded-lg border border-gray-200", className)}>
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 shadow-sm", className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Order #{order.id.slice(-6)}
          </h2>
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        
        <div className={cn(
          "inline-flex items-center space-x-2 px-3 py-2 rounded-full border text-sm font-medium",
          getStatusColor(order.status)
        )}>
          {getStatusIcon(order.status)}
          <span>{getStatusText(order.status)}</span>
        </div>
      </div>

      {/* Order Details */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Timeline */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Order Status</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Order Confirmed</div>
                  <div className="text-sm text-gray-600">
                    {order.orderTime.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  order.status === 'preparing' ? "bg-[var(--heybo-primary-100)]" : "bg-green-100"
                )}>
                  <Clock className={cn(
                    "w-4 h-4",
                    order.status === 'preparing' ? "text-[var(--heybo-primary-600)]" : "text-green-600"
                  )} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Preparing</div>
                  <div className="text-sm text-gray-600">
                    Estimated: {order.estimatedTime}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  order.status === 'ready' || order.status === 'completed' ? "bg-green-100" : "bg-gray-100"
                )}>
                  <Package className={cn(
                    "w-4 h-4",
                    order.status === 'ready' || order.status === 'completed' ? "text-green-600" : "text-gray-400"
                  )} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Ready for Pickup</div>
                  <div className="text-sm text-gray-600">
                    We'll notify you when ready
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[var(--heybo-primary-100)] rounded-lg flex items-center justify-center">
                      <span className="text-lg">🥣</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pickup Location */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-900">Pickup Location</div>
              <div className="text-blue-700">{order.location}</div>
              <div className="text-sm text-blue-600 mt-1">
                Show your order confirmation when collecting
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
