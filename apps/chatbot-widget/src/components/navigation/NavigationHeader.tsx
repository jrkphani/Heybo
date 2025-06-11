// HeyBo Navigation Header Component
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Home, 
  ShoppingCart, 
  Heart, 
  User,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLayoutStore } from '../../store/layout-store';
import { useChatbotStore } from '../../store/chatbot-store';
import type { NavigationState } from '../../types/layout';

interface NavigationHeaderProps {
  className?: string;
  showMenuToggle?: boolean;
  onMenuToggle?: () => void;
}

interface NavigationBreadcrumb {
  label: string;
  stage: string;
  flow: NavigationState['currentFlow'];
  icon?: React.ReactNode;
}

// Flow icons mapping
const FLOW_ICONS: Record<NavigationState['currentFlow'], React.ReactNode> = {
  'bowl-building': <Home className="w-4 h-4" />,
  'cart-management': <ShoppingCart className="w-4 h-4" />,
  'order-review': <ShoppingCart className="w-4 h-4" />,
  'favorites': <Heart className="w-4 h-4" />
};

// Generate breadcrumbs based on navigation history
function generateBreadcrumbs(
  navigation: NavigationState,
  navigationHistory: NavigationState['navigationHistory']
): NavigationBreadcrumb[] {
  const breadcrumbs: NavigationBreadcrumb[] = [];
  
  // Add home/welcome as root
  breadcrumbs.push({
    label: 'Home',
    stage: 'welcome',
    flow: 'bowl-building',
    icon: <Home className="w-4 h-4" />
  });
  
  // Add significant navigation points from history
  const significantStages = ['selection', 'customization', 'building', 'review'];
  
  navigationHistory.forEach((historyItem) => {
    if (historyItem.stage && significantStages.includes(historyItem.stage)) {
      const flowLabel = historyItem.flow.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      const stageLabel = typeof historyItem.stage === 'string' ?
        historyItem.stage.charAt(0).toUpperCase() + historyItem.stage.slice(1) :
        'Welcome';
      breadcrumbs.push({
        label: `${flowLabel} - ${stageLabel}`,
        stage: historyItem.stage || 'welcome',
        flow: historyItem.flow as NavigationState['currentFlow'],
        icon: FLOW_ICONS[historyItem.flow as NavigationState['currentFlow']]
      });
    }
  });
  
  // Add current stage if different
  if (navigation.currentStage && navigation.currentStage !== 'welcome' && 
      !breadcrumbs.some(b => b.stage === navigation.currentStage)) {
    const currentFlowLabel = navigation.currentFlow.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const stageLabel = typeof navigation.currentStage === 'string' ?
      navigation.currentStage.charAt(0).toUpperCase() + navigation.currentStage.slice(1) :
      'Welcome';
    breadcrumbs.push({
      label: `${currentFlowLabel} - ${stageLabel}`,
      stage: navigation.currentStage || 'welcome',
      flow: navigation.currentFlow,
      icon: FLOW_ICONS[navigation.currentFlow]
    });
  }
  
  return breadcrumbs.slice(-3); // Keep only last 3 items
}

export function NavigationHeader({ 
  className, 
  showMenuToggle = false,
  onMenuToggle 
}: NavigationHeaderProps) {
  const { 
    navigation, 
    navigateBack, 
    navigateToStage,
    resetNavigation 
  } = useLayoutStore();
  
  const { 
    currentStep,
    setCurrentStep 
  } = useChatbotStore();

  const breadcrumbs = generateBreadcrumbs(navigation, navigation.navigationHistory);
  const canGoBack = navigation.canNavigateBack && navigation.navigationHistory.length > 0;

  const handleNavigateBack = () => {
    navigateBack();
    // Sync with chatbot store if needed
    if (navigation.previousStage) {
      setCurrentStep(navigation.previousStage as any);
    }
  };

  const handleBreadcrumbClick = (breadcrumb: NavigationBreadcrumb) => {
    navigateToStage(breadcrumb.stage, breadcrumb.flow);
    setCurrentStep(breadcrumb.stage as any);
  };

  const handleHomeClick = () => {
    resetNavigation();
    setCurrentStep('welcome');
  };

  return (
    <div className={cn(
      'heybo-chatbot-nav-header',
      'heybo-navigation-header flex items-center justify-between p-4 bg-white border-b border-gray-200',
      'dark:bg-gray-900 dark:border-gray-700',
      className
    )}>
      {/* Left Section - Back Button & Breadcrumbs */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {/* Back Button */}
        {canGoBack && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleNavigateBack}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg',
              'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700',
              'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100',
              'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-heybo-primary focus:ring-opacity-50'
            )}
            aria-label="Go back"
            title="Go back"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
        )}

        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 flex-1 min-w-0" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={`${breadcrumb.flow}-${breadcrumb.stage}`} className="flex items-center">
                {index > 0 && (
                  <ChevronLeft className="w-3 h-3 text-gray-400 mx-1 rotate-180 flex-shrink-0" />
                )}
                
                <button
                  onClick={() => handleBreadcrumbClick(breadcrumb)}
                  className={cn(
                    'flex items-center space-x-1 px-2 py-1 rounded-md transition-colors duration-200',
                    'hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-heybo-primary focus:ring-opacity-50',
                    index === breadcrumbs.length - 1
                      ? 'text-heybo-primary font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  )}
                  aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                >
                  <span className="flex-shrink-0">
                    {breadcrumb.icon}
                  </span>
                  <span className="truncate max-w-[120px]">
                    {breadcrumb.label}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Right Section - Menu Toggle & Actions */}
      <div className="flex items-center space-x-2">
        {/* Quick Actions */}
        <div className="hidden md:flex items-center space-x-1">
          <button
            onClick={handleHomeClick}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg',
              'text-gray-600 dark:text-gray-300 hover:text-heybo-primary',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-heybo-primary focus:ring-opacity-50'
            )}
            aria-label="Go to home"
            title="Go to home"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Toggle for Mobile */}
        {showMenuToggle && (
          <button
            onClick={onMenuToggle}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg md:hidden',
              'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-heybo-primary focus:ring-opacity-50'
            )}
            aria-label="Toggle menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Navigation progress indicator component
interface NavigationProgressProps {
  currentFlow: NavigationState['currentFlow'];
  currentStage: string;
  className?: string;
}

export function NavigationProgress({ 
  currentFlow, 
  currentStage, 
  className 
}: NavigationProgressProps) {
  const stagesByFlow = {
    'bowl-building': ['welcome', 'selection', 'customization', 'building', 'review'],
    'cart-management': ['review', 'modification', 'checkout'],
    'order-review': ['confirmation', 'payment', 'tracking'],
    'favorites': ['selection', 'modification', 'adding']
  };

  const stages = stagesByFlow[currentFlow] || [];
  const currentIndex = stages.indexOf(currentStage);
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / stages.length) * 100 : 0;

  return (
    <div className={cn('w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full', className)}>
      <motion.div
        className="h-full bg-heybo-primary rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  );
} 