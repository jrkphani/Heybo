// HeyBo Control Placement Manager Component
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useLayoutStore } from '../../store/layout-store';
import { useChatbotStore } from '../../store/chatbot-store';
import type { NavigationState, ResponsiveBreakpoint } from '../../types/layout';

// Control placement configuration based on UX guide
interface ControlConfig {
  position: 'top' | 'bottom' | 'left' | 'right' | 'floating';
  priority: 'high' | 'medium' | 'low';
  responsive: Partial<Record<ResponsiveBreakpoint, 'show' | 'hide' | 'collapse' | 'floating'>>;
  flow?: NavigationState['currentFlow'][];
  stage?: string[];
}

interface ControlPlacementConfig {
  primaryActions: ControlConfig;
  secondaryActions: ControlConfig;
  navigation: ControlConfig;
  cart: ControlConfig;
  help: ControlConfig;
}

// Control placement configurations per screen size
const CONTROL_PLACEMENT_CONFIGS: Record<ResponsiveBreakpoint, ControlPlacementConfig> = {
  '2xl': {
    primaryActions: {
      position: 'bottom',
      priority: 'high',
      responsive: { '2xl': 'show', xl: 'show', lg: 'show', md: 'show', sm: 'collapse' }
    },
    secondaryActions: {
      position: 'top',
      priority: 'medium',
      responsive: { '2xl': 'show', xl: 'show', lg: 'show', md: 'collapse', sm: 'hide' }
    },
    navigation: {
      position: 'left',
      priority: 'high',
      responsive: { '2xl': 'show', xl: 'show', lg: 'show', md: 'show', sm: 'show' }
    },
    cart: {
      position: 'floating',
      priority: 'high',
      responsive: { '2xl': 'show', xl: 'show', lg: 'show', md: 'show', sm: 'floating' }
    },
    help: {
      position: 'floating',
      priority: 'low',
      responsive: { '2xl': 'show', xl: 'show', lg: 'show', md: 'show', sm: 'hide' }
    }
  },
  'xl': {
    primaryActions: {
      position: 'bottom',
      priority: 'high',
      responsive: { xl: 'show', lg: 'show', md: 'show', sm: 'collapse' }
    },
    secondaryActions: {
      position: 'top',
      priority: 'medium',
      responsive: { xl: 'show', lg: 'show', md: 'collapse', sm: 'hide' }
    },
    navigation: {
      position: 'left',
      priority: 'high',
      responsive: { xl: 'show', lg: 'show', md: 'show', sm: 'show' }
    },
    cart: {
      position: 'right',
      priority: 'high',
      responsive: { xl: 'show', lg: 'show', md: 'show', sm: 'floating' }
    },
    help: {
      position: 'floating',
      priority: 'low',
      responsive: { xl: 'show', lg: 'show', md: 'show', sm: 'hide' }
    }
  },
  'lg': {
    primaryActions: {
      position: 'bottom',
      priority: 'high',
      responsive: { lg: 'show', md: 'show', sm: 'collapse' }
    },
    secondaryActions: {
      position: 'top',
      priority: 'medium',
      responsive: { lg: 'show', md: 'collapse', sm: 'hide' }
    },
    navigation: {
      position: 'left',
      priority: 'high',
      responsive: { lg: 'show', md: 'show', sm: 'show' }
    },
    cart: {
      position: 'right',
      priority: 'high',
      responsive: { lg: 'show', md: 'show', sm: 'floating' }
    },
    help: {
      position: 'floating',
      priority: 'low',
      responsive: { lg: 'show', md: 'show', sm: 'hide' }
    }
  },
  'md': {
    primaryActions: {
      position: 'bottom',
      priority: 'high',
      responsive: { md: 'show', sm: 'collapse' }
    },
    secondaryActions: {
      position: 'top',
      priority: 'medium',
      responsive: { md: 'collapse', sm: 'hide' }
    },
    navigation: {
      position: 'left',
      priority: 'high',
      responsive: { md: 'show', sm: 'show' }
    },
    cart: {
      position: 'floating',
      priority: 'high',
      responsive: { md: 'show', sm: 'floating' }
    },
    help: {
      position: 'floating',
      priority: 'low',
      responsive: { md: 'show', sm: 'hide' }
    }
  },
  'sm': {
    primaryActions: {
      position: 'bottom',
      priority: 'high',
      responsive: { sm: 'show' }
    },
    secondaryActions: {
      position: 'top',
      priority: 'medium',
      responsive: { sm: 'hide' }
    },
    navigation: {
      position: 'bottom',
      priority: 'high',
      responsive: { sm: 'show' }
    },
    cart: {
      position: 'floating',
      priority: 'high',
      responsive: { sm: 'floating' }
    },
    help: {
      position: 'floating',
      priority: 'low',
      responsive: { sm: 'hide' }
    }
  }
};

// Control component props
interface ControlComponentProps {
  children: React.ReactNode;
  config: ControlConfig;
  currentBreakpoint: ResponsiveBreakpoint;
  flow: NavigationState['currentFlow'];
  stage: string;
  className?: string;
}

function ControlComponent({ 
  children, 
  config, 
  currentBreakpoint, 
  flow, 
  stage, 
  className 
}: ControlComponentProps) {
  const responsiveState = config.responsive[currentBreakpoint];
  
  // Check if control should be shown for current flow/stage
  const isRelevantForFlow = !config.flow || config.flow.includes(flow);
  const isRelevantForStage = !config.stage || config.stage.includes(stage);
  
  if (!isRelevantForFlow || !isRelevantForStage || responsiveState === 'hide') {
    return null;
  }

  const getPositionClasses = () => {
    const baseClasses = 'absolute z-10';
    
    switch (config.position) {
      case 'top':
        return `${baseClasses} top-0 left-0 right-0`;
      case 'bottom':
        return `${baseClasses} bottom-0 left-0 right-0`;
      case 'left':
        return `${baseClasses} top-0 bottom-0 left-0`;
      case 'right':
        return `${baseClasses} top-0 bottom-0 right-0`;
      case 'floating':
        return `${baseClasses} top-4 right-4`;
      default:
        return baseClasses;
    }
  };

  const getAnimationVariants = () => {
    switch (config.position) {
      case 'top':
        return {
          initial: { y: -100, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -100, opacity: 0 }
        };
      case 'bottom':
        return {
          initial: { y: 100, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 100, opacity: 0 }
        };
      case 'left':
        return {
          initial: { x: -100, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -100, opacity: 0 }
        };
      case 'right':
        return {
          initial: { x: 100, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: 100, opacity: 0 }
        };
      case 'floating':
        return {
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0, opacity: 0 }
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  };

  return (
    <motion.div
      {...getAnimationVariants()}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        "heybo-chatbot-control-placement",
        getPositionClasses(),
        {
          'opacity-60': responsiveState === 'collapse',
          'pointer-events-auto': config.priority === 'high',
          'pointer-events-none': responsiveState === 'collapse'
        },
        className
      )}
    >
      {responsiveState === 'collapse' ? (
        <div className="transform scale-75 origin-center">
          {children}
        </div>
      ) : (
        children
      )}
    </motion.div>
  );
}

interface ControlPlacementManagerProps {
  children?: React.ReactNode;
  className?: string;
}

export function ControlPlacementManager({ children, className }: ControlPlacementManagerProps) {
  const { 
    currentBreakpoint, 
    navigation, 
    isDualPane 
  } = useLayoutStore();
  
  const { 
    currentStep,
    // cart,
    user 
  } = useChatbotStore();

  const config = CONTROL_PLACEMENT_CONFIGS[currentBreakpoint];

  // Sample control components - in real implementation, these would be imported
  const PrimaryActions = () => (
    <div className="bg-white border-t border-gray-200 p-4 flex space-x-3">
      <button className="flex-1 bg-heybo-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-[var(--heybo-primary-600)] transition-colors">
        Continue
      </button>
      <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
        Back
      </button>
    </div>
  );

  const SecondaryActions = () => (
    <div className="bg-gray-50 border-b border-gray-200 p-3 flex justify-between items-center">
      <div className="flex space-x-2">
        <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
          Save for Later
        </button>
        <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
          Share
        </button>
      </div>
      <div className="text-xs text-gray-500">
        {navigation.currentStage} / {navigation.currentFlow}
      </div>
    </div>
  );

  const CartFloatingButton = () => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-heybo-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="relative">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l1.5-6M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
        {/* {cart?.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cart.length}
          </span>
        )} */}
      </div>
    </motion.button>
  );

  const HelpButton = () => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white border border-gray-300 text-gray-600 w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </motion.button>
  );

  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      {/* Main content area */}
      <div className="relative w-full h-full">
        {children}
      </div>

      {/* Control overlays */}
      <AnimatePresence>
        {/* Primary Actions */}
        <ControlComponent
          key="primary-actions"
          config={config.primaryActions}
          currentBreakpoint={currentBreakpoint}
          flow={navigation.currentFlow}
          stage={navigation.currentStage}
        >
          <PrimaryActions />
        </ControlComponent>

        {/* Secondary Actions */}
        <ControlComponent
          key="secondary-actions"
          config={config.secondaryActions}
          currentBreakpoint={currentBreakpoint}
          flow={navigation.currentFlow}
          stage={navigation.currentStage}
        >
          <SecondaryActions />
        </ControlComponent>

        {/* Cart Button */}
        <ControlComponent
          key="cart"
          config={config.cart}
          currentBreakpoint={currentBreakpoint}
          flow={navigation.currentFlow}
          stage={navigation.currentStage}
        >
          <CartFloatingButton />
        </ControlComponent>

        {/* Help Button */}
        <ControlComponent
          key="help"
          config={config.help}
          currentBreakpoint={currentBreakpoint}
          flow={navigation.currentFlow}
          stage={navigation.currentStage}
          className="top-4 right-20" // Offset from cart button
        >
          <HelpButton />
        </ControlComponent>
      </AnimatePresence>
    </div>
  );
}

// Hook for registering custom controls
export function useControlPlacement(
  controlId: string,
  config: ControlConfig,
  component: React.ComponentType
) {
  const { currentBreakpoint, navigation } = useLayoutStore();
  
  const shouldRender = () => {
    const responsiveState = config.responsive[currentBreakpoint];
    if (responsiveState === 'hide') return false;
    
    const isRelevantForFlow = !config.flow || config.flow.includes(navigation.currentFlow);
    const isRelevantForStage = !config.stage || config.stage.includes(navigation.currentStage);
    
    return isRelevantForFlow && isRelevantForStage;
  };

  return {
    shouldRender: shouldRender(),
    config,
    Component: component
  };
} 