// HeyBo Chatbot Widget V2 - Integrated with Two-Pane Layout
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { useChatbotStore } from '../store/chatbot-store';
import { useLayoutStore } from '../store/layout-store';
import { useLayoutManager } from '../hooks/useLayoutManager';

// Import new layout system
import { TwoPaneLayoutIntegrated } from './layout/TwoPaneLayoutIntegrated';
import { ControlPlacementManager } from './layout/ControlPlacementManager';

// Import existing components
import { AuthenticationFlow } from './auth/AuthenticationFlow';
import { RatingInterface } from './rating/RatingInterface';
import { ErrorDisplay } from './error/ErrorDisplay';
import { HeyBoIcon, HeyBoLuluBrand } from './brand/HeyBoAssets';

// Import bowl and ordering components for integration
import { BowlPreview } from './bowl/BowlPreview';
import { CartView } from './ordering/CartView';
import { CreateYourOwnFlow } from './ordering/CreateYourOwnFlow';
import { SignatureBowlsList } from './ordering/SignatureBowlsList';
import { FavoritesList } from './ordering/FavoritesList';

// Import services
import { initializeSessionManagement } from '../lib/api/session';
import { errorHandler } from '../lib/services/error-handler';
import { sessionManager } from '../lib/services/session-manager';
import { ratingService } from '../lib/services/rating-service';
import { cn } from '../lib/utils';
import type { User, RatingData, NavigationState, ChatbotStep } from '../types';
import '../styles/heybo-design-tokens.css';

interface ChatbotWidgetV2Props {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'center';
  theme?: 'light' | 'dark';
  enableNewLayout?: boolean;
}

export function ChatbotWidgetV2({ 
  className,
  position = 'bottom-right',
  theme = 'light',
  enableNewLayout = true
}: ChatbotWidgetV2Props) {
  const {
    widgetState,
    setWidgetState,
    currentStep,
    setCurrentStep,
    addMessage,
    resetChat,
    auth,
    initializeAuth,
    authenticateUser,
    errors,
    warnings,
    unratedOrders,
    showRatingInterface,
    setUnratedOrders,
    setShowRatingInterface,
    addError,
    removeError,
    addWarning,
    removeWarning,
    submitRating,
    skipRating,
    currentBowl,
    user
  } = useChatbotStore();

  const {
    navigation,
    navigateToStage,
    setCurrentFlow,
    resetNavigation
  } = useLayoutStore();

  const {
    isMobileView,
    isDualPane,
    currentBreakpoint
  } = useLayoutManager();

  // State for widget behavior
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Initialize authentication and session management
  useEffect(() => {
    initializeSessionManagement();
    initializeAuth();

    // Setup error handling listeners
    const unsubscribeError = errorHandler.onError((error) => {
      addError(error);
    });

    const unsubscribeRecovery = errorHandler.onRecovery((errorId) => {
      removeError(errorId);
    });

    // Setup session management listeners
    const unsubscribeWarning = sessionManager.onWarning((warning) => {
      addWarning(warning);
    });

    return () => {
      unsubscribeError();
      unsubscribeRecovery();
      unsubscribeWarning();
    };
  }, [initializeAuth, addError, removeError, addWarning]);

  // Sync navigation with current step
  useEffect(() => {
    if (currentStep && auth.isAuthenticated) {
      // Map current step to navigation flow/stage
      const stepToNavigation = {
        'welcome': { flow: 'bowl-building' as NavigationState['currentFlow'], stage: 'welcome' },
        'main-menu': { flow: 'bowl-building' as NavigationState['currentFlow'], stage: 'selection' },
        'create-your-own': { flow: 'bowl-building' as NavigationState['currentFlow'], stage: 'building' },
        'signature-bowls': { flow: 'bowl-building' as NavigationState['currentFlow'], stage: 'selection' },
        'favorites': { flow: 'favorites' as NavigationState['currentFlow'], stage: 'selection' },
        'cart': { flow: 'cart-management' as NavigationState['currentFlow'], stage: 'review' },
        'checkout': { flow: 'order-review' as NavigationState['currentFlow'], stage: 'confirmation' },
        'rating': { flow: 'order-review' as NavigationState['currentFlow'], stage: 'rating' }
      };

      const navMapping = stepToNavigation[currentStep as keyof typeof stepToNavigation];
      if (navMapping && navigation.currentStage !== navMapping.stage) {
        navigateToStage(navMapping.stage, navMapping.flow);
      }
    }
  }, [currentStep, auth.isAuthenticated, navigation.currentStage, navigateToStage]);

  const handleToggleWidget = () => {
    if (widgetState === 'collapsed') {
      setWidgetState('expanding');

      // Check authentication status before showing main interface
      if (!auth.isAuthenticated) {
        setTimeout(() => setWidgetState('expanded'), 300);
        return;
      }

      // Initialize navigation state
      if (currentStep === 'welcome') {
        resetNavigation();
        setCurrentFlow('bowl-building');
        
        setTimeout(() => {
          addMessage({
            content: "Hi! I'm LULU, your HeyBo assistant. I'm here to help you create the perfect warm grain bowl! 🥣",
            type: 'assistant'
          });

          setTimeout(() => {
            addMessage({
              content: "What would you like to do today?",
              type: 'assistant',
              metadata: {
                actionType: 'show-main-menu'
              }
            });
          }, 1000);
        }, 500);
      }

      setTimeout(() => setWidgetState('expanded'), 300);
    } else {
      setWidgetState('closing');
      setTimeout(() => setWidgetState('collapsed'), 300);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    setWidgetState('closing');
    setTimeout(() => setWidgetState('collapsed'), 300);
  };

  const handleReset = () => {
    resetChat();
    resetNavigation();
    setCurrentStep('welcome');
    setCurrentFlow('bowl-building');

    if (auth.isAuthenticated) {
      setTimeout(() => {
        addMessage({
          content: "Hi! I'm LULU, your HeyBo assistant. I'm here to help you create the perfect warm grain bowl! 🥣",
          type: 'assistant'
        });

        setTimeout(() => {
          addMessage({
            content: "What would you like to do today?",
            type: 'assistant',
            metadata: {
              actionType: 'show-main-menu'
            }
          });
        }, 1000);
      }, 100);
    }
  };

  const handleAuthenticationComplete = async (user: User) => {
    console.log('🔐 Authentication completed for user:', user);

    try {
      await authenticateUser(user);
      console.log('✅ User authenticated successfully');

      // Check for unrated orders first
      const unratedOrdersList = await ratingService.checkUnratedOrders(user);

      if (unratedOrdersList.length > 0) {
        console.log('📝 Found unrated orders, showing rating interface');
        setUnratedOrders(unratedOrdersList);
        setShowRatingInterface(true);
        setCurrentStep('rating');
        navigateToStage('rating', 'order-review');

        setTimeout(() => {
          addMessage({
            content: `Welcome back, ${user.name}! Before we start, would you like to rate your recent order? Your feedback helps us improve! ⭐`,
            type: 'assistant'
          });
        }, 500);

        return;
      }

      console.log('✨ No unrated orders, proceeding to welcome');
    } catch (error) {
      console.warn('Failed to check unrated orders:', error);
    }

    // Start the main flow
    setCurrentStep('welcome');
    navigateToStage('welcome', 'bowl-building');

    setTimeout(() => {
      addMessage({
        content: `Welcome back, ${user.name}! Ready to create another delicious bowl? 🥣`,
        type: 'assistant'
      });

      setTimeout(() => {
        addMessage({
          content: "What would you like to do today?",
          type: 'assistant',
          metadata: {
            actionType: 'show-main-menu'
          }
        });
      }, 1000);
    }, 300);
  };

  const handleRatingComplete = (rating?: RatingData) => {
    if (rating) {
      submitRating(rating);
      addMessage({
        content: `Thank you for rating your order! Your feedback helps us improve. 🙏`,
        type: 'assistant'
      });
    }

    setShowRatingInterface(false);
    setCurrentStep('welcome');
    navigateToStage('welcome', 'bowl-building');

    setTimeout(() => {
      addMessage({
        content: "Now, what would you like to do today?",
        type: 'assistant',
        metadata: {
          actionType: 'show-main-menu'
        }
      });
    }, 1000);
  };

  const handleRatingSkip = () => {
    skipRating();
    addMessage({
      content: "No problem! You can always rate your orders later.",
      type: 'assistant'
    });

    setShowRatingInterface(false);
    setCurrentStep('welcome');
    navigateToStage('welcome', 'bowl-building');

    setTimeout(() => {
      addMessage({
        content: "What would you like to do today?",
        type: 'assistant',
        metadata: {
          actionType: 'show-main-menu'
        }
      });
    }, 1000);
  };

  const handleNavigation = (stage: string, flow: string) => {
    // Map navigation to chatbot steps
    const navigationToStep = {
      'bowl-building-welcome': 'welcome',
      'bowl-building-selection': 'main-menu',
      'bowl-building-building': 'create-your-own',
      'favorites-selection': 'favorites',
      'cart-management-review': 'cart',
      'order-review-confirmation': 'checkout'
    };

    const stepKey = `${flow}-${stage}` as keyof typeof navigationToStep;
    const newStep = navigationToStep[stepKey];
    
    if (newStep && newStep !== currentStep) {
      setCurrentStep(newStep as ChatbotStep);
    }

    // Add navigation message
    addMessage({
      content: `Navigating to ${stage}`,
      type: 'user'
    });
  };

  // Render different interfaces based on state
  const renderContent = () => {
    // Show rating interface if needed
    if (showRatingInterface && unratedOrders.length > 0) {
      return (
        <RatingInterface
          unratedOrders={unratedOrders}
          onRatingComplete={handleRatingComplete}
          onSkip={handleRatingSkip}
          className="h-full"
        />
      );
    }

    // Show authentication flow if not authenticated
    if (!auth.isAuthenticated) {
      return (
        <AuthenticationFlow
          onAuthComplete={handleAuthenticationComplete}
          className="h-full"
        />
      );
    }

    // Show error display if there are critical errors
    if (errors.some(error => error.severity === 'critical')) {
      return (
        <ErrorDisplay
          errors={errors}
          onRetry={(errorId) => {
            removeError(errorId);
          }}
          className="h-full"
        />
      );
    }

    // Main interface with new layout system
    if (enableNewLayout) {
      return (
        <TwoPaneLayoutIntegrated
          onClose={handleClose}
          onNavigate={handleNavigation}
          className="h-full"
        />
      );
    }

    // Fallback to original chat interface (if new layout disabled)
    return (
      <div className="h-full p-4">
        <p className="text-gray-600">Original chat interface would go here</p>
      </div>
    );
  };

  const getPositionClasses = () => {
    if (isMaximized) {
      return 'fixed inset-4 z-50';
    }

    switch (position) {
      case 'bottom-left':
        return 'fixed bottom-4 left-4 z-50';
      case 'center':
        return 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50';
      case 'bottom-right':
      default:
        return 'fixed bottom-4 right-4 z-50';
    }
  };

  const getResponsiveDimensions = () => {
    if (isMaximized) {
      return 'w-full h-full';
    }

    if (widgetState === 'collapsed') {
      return 'w-16 h-16';
    }

    if (isMinimized) {
      return 'w-80 h-12';
    }

    // Use layout manager dimensions
    if (isMobileView) {
      return 'w-screen h-screen';
    }

    return 'w-[960px] h-[680px]'; // Default size for new layout system
  };

  // Collapsed state - floating button
  if (widgetState === 'collapsed') {
    return (
      <motion.div
        className={cn(
          getPositionClasses(),
          getResponsiveDimensions()
        )}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <button
          onClick={handleToggleWidget}
          className={cn(
            'w-full h-full rounded-full shadow-lg hover:shadow-xl transition-all duration-300',
            'bg-gradient-to-r from-heybo-primary to-orange-600',
            'flex items-center justify-center text-white',
            'hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-200',
            'border-4 border-white'
          )}
          aria-label="Open HeyBo Assistant"
        >
          <HeyBoIcon className="w-8 h-8" />
        </button>
      </motion.div>
    );
  }

  // Expanded widget
  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          getPositionClasses(),
          getResponsiveDimensions(),
          'bg-white rounded-2xl shadow-2xl overflow-hidden',
          'border border-gray-200',
          theme === 'dark' && 'dark bg-gray-900 border-gray-700',
          className
        )}
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          y: 0,
          transition: { type: 'spring', stiffness: 300, damping: 25 }
        }}
        exit={{ 
          scale: 0.8, 
          opacity: 0, 
          y: 20,
          transition: { duration: 0.2 }
        }}
      >
        {/* Widget Header */}
        {!isMobileView && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center space-x-3">
              <HeyBoLuluBrand className="h-8" />
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  HeyBo Assistant
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user ? `Hello, ${user.name}!` : 'Your grain bowl companion'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMaximize}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label={isMaximized ? "Restore size" : "Maximize"}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleMinimize}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Widget Content */}
        <div className={cn(
          'flex-1 relative',
          isMobileView ? 'h-full' : 'h-[calc(100%-5rem)]'
        )}>
          {enableNewLayout ? (
            <ControlPlacementManager className="h-full">
              {renderContent()}
            </ControlPlacementManager>
          ) : (
            renderContent()
          )}
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-2 left-2 text-xs text-gray-400 bg-black/50 text-white p-1 rounded">
            {currentBreakpoint} | {navigation.currentFlow}-{navigation.currentStage} | {currentStep}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default ChatbotWidgetV2; 