// HeyBo Navigation Menu Component
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  ChefHat,
  ShoppingCart,
  Heart,
  Star,
  Clock,
  MapPin,
  User,
  Settings,
  HelpCircle,
  ChevronRight,
  Plus
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLayoutStore } from '../../store/layout-store';
import { useChatbotStore } from '../../store/chatbot-store';
import type { NavigationState } from '../../types/layout';

interface NavigationMenuProps {
  className?: string;
  onNavigate?: (stage: string, flow: NavigationState['currentFlow']) => void;
}

interface NavigationItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  stage: string;
  flow: NavigationState['currentFlow'];
  badge?: string | number;
  disabled?: boolean;
  submenu?: NavigationItem[];
}

export function NavigationMenu({ className, onNavigate }: NavigationMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  const { 
    navigation, 
    navigateToStage,
    setCurrentFlow 
  } = useLayoutStore();
  
  const { 
    setCurrentStep,
    currentStep,
    user,
    unratedOrders
  } = useChatbotStore();

  // Generate navigation items based on user state and current context
  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      description: 'Start your bowl journey',
      icon: <Home className="w-5 h-5" />,
      stage: 'welcome',
      flow: 'bowl-building'
    },
    {
      id: 'create-bowl',
      label: 'Create Your Bowl',
      description: 'Build a custom bowl',
      icon: <ChefHat className="w-5 h-5" />,
      stage: 'customization',
      flow: 'bowl-building',
      submenu: [
        {
          id: 'signature-bowls',
          label: 'Signature Bowls',
          icon: <Star className="w-4 h-4" />,
          stage: 'selection',
          flow: 'bowl-building'
        },
        {
          id: 'create-your-own',
          label: 'Create Your Own',
          icon: <Plus className="w-4 h-4" />,
          stage: 'building',
          flow: 'bowl-building'
        }
      ]
    },
    {
      id: 'favorites',
      label: 'My Favorites',
      description: 'Your saved bowls',
      icon: <Heart className="w-5 h-5" />,
      stage: 'selection',
      flow: 'favorites',
      disabled: !user || !user.favorites?.length,
      badge: user?.favorites?.length
    },
    {
      id: 'recent-orders',
      label: 'Recent Orders',
      description: 'Reorder your favorites',
      icon: <Clock className="w-5 h-5" />,
      stage: 'selection',
      flow: 'bowl-building',
      disabled: !user || !user.orderHistory?.length,
      badge: unratedOrders?.length > 0 ? '!' : undefined
    },
    {
      id: 'cart',
      label: 'My Cart',
      description: 'Review your order',
      icon: <ShoppingCart className="w-5 h-5" />,
      stage: 'review',
      flow: 'cart-management'
    }
  ];

  const handleItemClick = (item: NavigationItem) => {
    if (item.disabled) return;
    
    // Handle submenu expansion
    if (item.submenu) {
      setExpandedItem(expandedItem === item.id ? null : item.id);
      return;
    }
    
    // Navigate to the selected item
    navigateToStage(item.stage, item.flow);
    setCurrentFlow(item.flow);
    setCurrentStep(item.stage as any);
    
    // Call custom navigation handler if provided
    onNavigate?.(item.stage, item.flow);
  };

  const isItemActive = (item: NavigationItem) => {
    return navigation.currentFlow === item.flow && navigation.currentStage === item.stage;
  };

  const isItemInCurrentFlow = (item: NavigationItem) => {
    return navigation.currentFlow === item.flow;
  };

  return (
    <nav className={cn('heybo-navigation-menu', className)}>
      <div className="space-y-1 p-2">
        {navigationItems.map((item) => (
          <div key={item.id} className="relative">
            {/* Main Navigation Item */}
            <motion.button
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-heybo-primary focus:ring-opacity-50',
                {
                  // Active state
                  'bg-heybo-primary text-white shadow-md': isItemActive(item),
                  // Current flow state
                  'bg-orange-50 text-heybo-primary border border-orange-200': 
                    !isItemActive(item) && isItemInCurrentFlow(item),
                  // Default state
                  'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800': 
                    !isItemActive(item) && !isItemInCurrentFlow(item),
                  // Disabled state
                  'opacity-50 cursor-not-allowed': item.disabled,
                  // Hover effects
                  'hover:shadow-sm': !item.disabled
                }
              )}
              whileHover={!item.disabled ? { scale: 1.02 } : {}}
              whileTap={!item.disabled ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {/* Icon */}
                <div className={cn(
                  'flex-shrink-0',
                  {
                    'text-white': isItemActive(item),
                    'text-heybo-primary': !isItemActive(item) && isItemInCurrentFlow(item),
                    'text-gray-500': !isItemActive(item) && !isItemInCurrentFlow(item)
                  }
                )}>
                  {item.icon}
                </div>
                
                {/* Label and Description */}
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    'font-medium text-sm',
                    {
                      'text-white': isItemActive(item),
                      'text-heybo-primary': !isItemActive(item) && isItemInCurrentFlow(item),
                      'text-gray-900 dark:text-gray-100': !isItemActive(item) && !isItemInCurrentFlow(item)
                    }
                  )}>
                    {item.label}
                  </div>
                  {item.description && (
                    <div className={cn(
                      'text-xs mt-0.5 truncate',
                      {
                        'text-orange-100': isItemActive(item),
                        'text-orange-600': !isItemActive(item) && isItemInCurrentFlow(item),
                        'text-gray-500 dark:text-gray-400': !isItemActive(item) && !isItemInCurrentFlow(item)
                      }
                    )}>
                      {item.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section - Badge & Chevron */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                {/* Badge */}
                {item.badge && (
                  <span className={cn(
                    'inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-medium rounded-full',
                    {
                      'bg-white/20 text-white': isItemActive(item),
                      'bg-heybo-primary text-white': !isItemActive(item) && typeof item.badge === 'string',
                      'bg-orange-200 text-orange-800': !isItemActive(item) && typeof item.badge === 'number',
                    }
                  )}>
                    {item.badge}
                  </span>
                )}
                
                {/* Submenu Chevron */}
                {item.submenu && (
                  <motion.div
                    animate={{ 
                      rotate: expandedItem === item.id ? 90 : 0 
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className={cn(
                      'w-4 h-4',
                      {
                        'text-white': isItemActive(item),
                        'text-heybo-primary': !isItemActive(item) && isItemInCurrentFlow(item),
                        'text-gray-400': !isItemActive(item) && !isItemInCurrentFlow(item)
                      }
                    )} />
                  </motion.div>
                )}
              </div>
            </motion.button>

            {/* Submenu */}
            <AnimatePresence>
              {item.submenu && expandedItem === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden mt-1"
                >
                  <div className="ml-6 space-y-1">
                    {item.submenu.map((subItem) => (
                      <motion.button
                        key={subItem.id}
                        onClick={() => handleItemClick(subItem)}
                        className={cn(
                          'w-full flex items-center space-x-3 p-2 rounded-md text-left transition-colors duration-200',
                          'focus:outline-none focus:ring-2 focus:ring-heybo-primary focus:ring-opacity-50',
                          {
                            'bg-heybo-primary text-white': isItemActive(subItem),
                            'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800': !isItemActive(subItem)
                          }
                        )}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={cn(
                          'flex-shrink-0',
                          {
                            'text-white': isItemActive(subItem),
                            'text-gray-400': !isItemActive(subItem)
                          }
                        )}>
                          {subItem.icon}
                        </div>
                        <span className={cn(
                          'text-sm font-medium',
                          {
                            'text-white': isItemActive(subItem),
                            'text-gray-700 dark:text-gray-200': !isItemActive(subItem)
                          }
                        )}>
                          {subItem.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 px-2">
        <div className="space-y-1">
          {/* User Profile */}
          {user && (
            <button className="w-full flex items-center space-x-3 p-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
              <div className="w-8 h-8 bg-heybo-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user.type === 'guest' ? 'Guest User' : 'Member'}
                </div>
              </div>
            </button>
          )}

          {/* Help */}
          <button className="w-full flex items-center space-x-3 p-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-600 dark:text-gray-300">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm">Help & Support</span>
          </button>
        </div>
      </div>
    </nav>
  );
} 