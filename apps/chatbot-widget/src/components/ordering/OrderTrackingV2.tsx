'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  MapPin, 
  Phone, 
  MessageCircle, 
  AlertCircle, 
  RefreshCw,
  Star,
  ChefHat,
  Timer,
  Navigation,
  Bell,
  Receipt
} from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { useLayoutStore } from '../../store/layout-store';
import { cn } from '../../lib/utils';
import type { OrderStatus, Location, BowlComposition } from '../../types';
import '../../styles/heybo-design-tokens.css';

interface OrderTrackingV2Props {
  orderId?: string;
  variant?: 'full' | 'compact' | 'embedded';
  showActions?: boolean;
  onOrderUpdate?: (order: Order) => void;
  onContactSupport?: () => void;
  className?: string;
}

interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  location: Location;
  estimatedTime: string;
  actualTime?: string;
  total: number;
  orderTime: Date;
  lastUpdate: Date;
  trackingHistory: TrackingEvent[];
  deliveryPerson?: DeliveryPerson;
  specialInstructions?: string;
}

interface OrderItem {
  id: string;
  name: string;
  bowl: BowlComposition;
  quantity: number;
  price: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  prepTime?: string;
}

interface TrackingEvent {
  id: string;
  status: OrderStatus;
  message: string;
  timestamp: Date;
  estimatedTime?: string;
  location?: string;
}

interface DeliveryPerson {
  name: string;
  phone: string;
  vehicle: string;
  currentLocation?: { lat: number; lng: number };
  eta?: string;
}

export function OrderTrackingV2({
  orderId,
  variant = 'full',
  showActions = true,
  onOrderUpdate,
  onContactSupport,
  className
}: OrderTrackingV2Props) {
  const { currentBowl, setCurrentStep, addMessage } = useChatbotStore();
  const { navigateToStage } = useLayoutStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showTrackingHistory, setShowTrackingHistory] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // Mock order data - replace with actual API call
  const mockOrder: Order = {
    id: orderId || 'ORD-2024-001234',
    status: 'preparing',
    items: [
      {
        id: 'item-1',
        name: 'Mediterranean Power Bowl',
        bowl: currentBowl as BowlComposition || {
          id: 'bowl-1',
          name: 'Mediterranean Power Bowl',
          description: 'Fresh and nutritious bowl with quinoa base',
          base: {
            id: 'quinoa',
            name: 'Quinoa',
            category: 'base',
            subcategory: 'grains',
            isAvailable: true,
            isVegan: true,
            isGlutenFree: true,
            allergens: [],
            nutritionalInfo: { calories: 150, protein: 6, carbs: 25, fat: 2, fiber: 3, sodium: 10 },
            weight: 100,
            price: 0,
            description: 'Organic quinoa',
            imageUrl: ''
          },
          protein: {
            id: 'grilled-chicken',
            name: 'Grilled Chicken',
            category: 'protein',
            subcategory: 'meat',
            isAvailable: true,
            isVegan: false,
            isGlutenFree: true,
            allergens: [],
            nutritionalInfo: { calories: 200, protein: 30, carbs: 0, fat: 8, fiber: 0, sodium: 400 },
            weight: 120,
            price: 300,
            description: 'Free-range grilled chicken',
            imageUrl: ''
          },
          extraProtein: [],
          sides: [],
          extraSides: [],
          totalWeight: 450,
          totalPrice: 1299,
          isSignature: true,
          calories: 520,
          prepTime: '12-15 minutes'
        },
        quantity: 1,
        price: 1299,
        status: 'preparing',
        prepTime: '12-15 minutes'
      }
    ],
    location: {
      id: 'loc-001',
      name: 'HeyBo Marina Bay',
      address: '123 Marina Bay Road, Singapore 018956',
      type: 'outlet',
      coordinates: { lat: 1.2825, lng: 103.8598 },
      operatingHours: {
        monday: { open: '08:00', close: '22:00' },
        tuesday: { open: '08:00', close: '22:00' },
        wednesday: { open: '08:00', close: '22:00' },
        thursday: { open: '08:00', close: '22:00' },
        friday: { open: '08:00', close: '22:00' },
        saturday: { open: '09:00', close: '23:00' },
        sunday: { open: '09:00', close: '23:00' }
      },
      isActive: true,
      estimatedWaitTime: '12-15 min'
    },
    estimatedTime: '2:45 PM',
    total: 1299,
    orderTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    lastUpdate: new Date(),
    trackingHistory: [
      {
        id: 'track-1',
        status: 'confirmed',
        message: 'Order confirmed and sent to kitchen',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        estimatedTime: '2:45 PM'
      },
      {
        id: 'track-2',
        status: 'preparing',
        message: 'Your bowl is being prepared by our chefs',
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        estimatedTime: '2:45 PM'
      }
    ],
    specialInstructions: 'Extra sauce on the side, please'
  };

  // Load order data
  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrder(mockOrder);
      setIsLoading(false);
    };

    loadOrder();
  }, [orderId]);

  // Simulate real-time updates
  useEffect(() => {
    if (!order) return;

    const interval = setInterval(() => {
      // Simulate status progression
      const now = new Date();
      const orderAge = now.getTime() - order.orderTime.getTime();
      
      // Progress status based on time elapsed
      if (orderAge > 20 * 60 * 1000 && order.status === 'preparing') { // 20 minutes
        const updatedOrder = {
          ...order,
          status: 'ready' as OrderStatus,
          lastUpdate: now,
          trackingHistory: [...order.trackingHistory, {
            id: `track-${Date.now()}`,
            status: 'ready' as OrderStatus,
            message: 'Your order is ready for pickup!',
            timestamp: now
          }]
        };
        setOrder(updatedOrder);
        onOrderUpdate?.(updatedOrder);
        
        if (notifications) {
          addMessage({
            content: '🎉 Great news! Your Mediterranean Power Bowl is ready for pickup!',
            type: 'assistant'
          });
        }
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [order, notifications, onOrderUpdate, addMessage]);

  // Refresh order status
  const refreshOrder = useCallback(async () => {
    setRefreshing(true);
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 500));
    setRefreshing(false);
  }, []);

  // Get status color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'preparing':
        return 'text-orange-600 bg-orange-100';
      case 'ready':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-gray-600 bg-gray-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get status icon
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'preparing':
        return <ChefHat className="w-5 h-5" />;
      case 'ready':
        return <Bell className="w-5 h-5" />;
      case 'completed':
        return <Package className="w-5 h-5" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  // Get progress percentage
  const getProgressPercentage = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 20;
      case 'confirmed':
        return 40;
      case 'preparing':
        return 70;
      case 'ready':
        return 90;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  // Handle support contact
  const handleContactSupport = () => {
    onContactSupport?.();
    addMessage({
      content: 'I need help with my order',
      type: 'user'
    });
  };

  // Handle reorder
  const handleReorder = () => {
    setCurrentStep('create-your-own');
    navigateToStage('customization', 'bowl-building');
    addMessage({
      content: 'I\'d like to order this again',
      type: 'user'
    });
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heybo-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={cn("text-center p-8", className)}>
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
        <p className="text-gray-600">We couldn't find an order with this ID.</p>
      </div>
    );
  }

  // Compact variant for embedded use
  if (variant === 'compact') {
    return (
      <div className={cn("bg-white border border-gray-200 rounded-lg p-4", className)}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={cn("p-1 rounded-full", getStatusColor(order.status))}>
              {getStatusIcon(order.status)}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Order #{order.id.slice(-6)}</h4>
              <p className="text-sm text-gray-600">{order.status.replace('-', ' ')}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{order.estimatedTime}</p>
            <p className="text-xs text-gray-600">Estimated ready</p>
          </div>
        </div>
        
        <div className="bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-heybo-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage(order.status)}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{order.items.length} item(s)</span>
          <span className="text-gray-900 font-medium">${(order.total / 100).toFixed(2)}</span>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={cn("heybo-order-tracking-v2", className)}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Order #{order.id.slice(-6)}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Placed at {order.orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <button
              onClick={refreshOrder}
              disabled={refreshing}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              title="Refresh status"
            >
              <RefreshCw className={cn("w-5 h-5", refreshing && "animate-spin")} />
            </button>
          </div>

          {/* Status and progress */}
          <div className="flex items-center space-x-3 mb-4">
            <div className={cn("p-2 rounded-full", getStatusColor(order.status))}>
              {getStatusIcon(order.status)}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 capitalize">
                {order.status.replace('-', ' ')}
              </p>
              <p className="text-sm text-gray-600">
                {order.status === 'preparing' && 'Your delicious bowl is being crafted'}
                {order.status === 'ready' && 'Ready for pickup!'}
                {order.status === 'confirmed' && 'Order confirmed and sent to kitchen'}
                {order.status === 'completed' && 'Enjoy your meal!'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-heybo-primary">{order.estimatedTime}</p>
              <p className="text-sm text-gray-600">Estimated ready</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-gray-200 rounded-full h-3 mb-2">
            <motion.div 
              className="bg-gradient-to-r from-heybo-primary to-heybo-secondary h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage(order.status)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Confirmed</span>
            <span>Preparing</span>
            <span>Ready</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Order items */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-heybo-primary-50 rounded-lg flex items-center justify-center">
                  <ChefHat className="w-8 h-8 text-heybo-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  {item.prepTime && (
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Timer className="w-3 h-3 mr-1" />
                      {item.prepTime}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${(item.price / 100).toFixed(2)}</p>
                  <div className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    getStatusColor(item.status)
                  )}>
                    {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Special instructions */}
          {order.specialInstructions && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Special Instructions:</strong> {order.specialInstructions}
              </p>
            </div>
          )}
        </div>

        {/* Location details */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Pickup Location</h3>
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">{order.location.name}</p>
              <p className="text-sm text-gray-600">{order.location.address}</p>
              <p className="text-sm text-gray-600 mt-1">
                Current wait time: {order.location.estimatedWaitTime}
              </p>
            </div>
          </div>
        </div>

        {/* Tracking history */}
        <div className="p-6">
          <button
            onClick={() => setShowTrackingHistory(!showTrackingHistory)}
            className="flex items-center justify-between w-full text-left mb-4"
          >
            <h3 className="font-medium text-gray-900">Order Timeline</h3>
            <motion.div
              animate={{ rotate: showTrackingHistory ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.div>
          </button>

          <AnimatePresence>
            {showTrackingHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-4">
                  {order.trackingHistory.map((event, index) => (
                    <div key={event.id} className="flex items-start space-x-3">
                      <div className={cn(
                        "w-3 h-3 rounded-full mt-2",
                        index === 0 ? "bg-heybo-primary" : "bg-gray-300"
                      )} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{event.message}</p>
                        <p className="text-sm text-gray-600">
                          {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {event.estimatedTime && ` • ETA: ${event.estimatedTime}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex flex-wrap gap-3">
              {order.status === 'ready' && (
                <button className="flex-1 bg-heybo-primary text-white px-4 py-2 rounded-lg hover:bg-heybo-primary-600 transition-colors">
                  I'm Here to Pick Up
                </button>
              )}
              
              <button
                onClick={handleReorder}
                className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Order Again
              </button>
              
              <button
                onClick={handleContactSupport}
                className="px-4 py-2 text-heybo-primary border border-heybo-primary rounded-lg hover:bg-heybo-primary-50 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setNotifications(!notifications)}
                className={cn(
                  "px-4 py-2 border rounded-lg transition-colors",
                  notifications 
                    ? "bg-heybo-primary text-white border-heybo-primary" 
                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                )}
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 