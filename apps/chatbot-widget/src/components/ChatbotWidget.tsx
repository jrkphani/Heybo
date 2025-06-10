'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2 } from 'lucide-react';
import { useChatbotStore } from '../store/chatbot-store';
import { ChatInterface } from './chat/ChatInterface';
import { EnhancedChatInterface } from './chat/EnhancedChatInterface';
import { AuthenticationFlow } from './auth/AuthenticationFlow';
import { RatingInterface } from './rating/RatingInterface';
import { ErrorDisplay } from './error/ErrorDisplay';
import { HeyBoIcon, HeyBoLuluBrand } from './brand/HeyBoAssets';
import { initializeSessionManagement } from '../lib/api/session';
import { errorHandler } from '../lib/services/error-handler';
import { sessionManager } from '../lib/services/session-manager';
import { ratingService } from '../lib/services/rating-service';
import { cn } from '../lib/utils';
import type { User, RatingData } from '../types';
import '../styles/heybo-design-tokens.css';

interface ChatbotWidgetProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
}

export function ChatbotWidget({ 
  className,
  position = 'bottom-right',
  theme = 'light'
}: ChatbotWidgetProps) {
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
    skipRating
  } = useChatbotStore();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handleToggleWidget = () => {
    if (widgetState === 'collapsed') {
      setWidgetState('expanding');

      // Check authentication status before showing main interface
      if (!auth.isAuthenticated) {
        // Will show authentication flow
        setTimeout(() => setWidgetState('expanded'), 300);
        return;
      }

      // Add welcome message if first time opening and authenticated
      if (currentStep === 'welcome') {
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
    setWidgetState('closing');
    setTimeout(() => setWidgetState('collapsed'), 300);
  };

  const handleReset = () => {
    resetChat();
    setCurrentStep('welcome');

    // Only re-add welcome messages if authenticated
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
      // Ensure user is set in the store and authentication state is updated
      console.log('🔄 Calling authenticateUser...');
      await authenticateUser(user);
      console.log('✅ User authenticated successfully');

      // Check for unrated orders first
      console.log('⭐ Checking for unrated orders...');
      const unratedOrdersList = await ratingService.checkUnratedOrders(user);

      if (unratedOrdersList.length > 0) {
        console.log('📝 Found unrated orders, showing rating interface');
        setUnratedOrders(unratedOrdersList);
        setShowRatingInterface(true);
        setCurrentStep('rating');

        // Show rating prompt message
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
      // Continue with normal flow if rating check fails
    }

    // Set the step to welcome immediately to show the welcome screen
    console.log('🏠 Setting current step to welcome');
    setCurrentStep('welcome');

    // Authentication completed, show welcome messages
    setTimeout(() => {
      console.log('💬 Adding welcome messages');
      addMessage({
        content: `Welcome ${user.name}! I'm LULU, your HeyBo assistant. I'm here to help you create the perfect warm grain bowl! 🥣`,
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
  };

  const handleRatingComplete = (rating?: RatingData) => {
    setShowRatingInterface(false);
    setCurrentStep('welcome');

    // Show welcome messages after rating
    setTimeout(() => {
      addMessage({
        content: rating
          ? "Thank you for your feedback! Now, let's create your next perfect bowl! 🥣"
          : "No problem! Let's create your perfect bowl! 🥣",
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
  };

  const handleRatingSkip = () => {
    setShowRatingInterface(false);
    setCurrentStep('welcome');

    // Show welcome messages after skipping
    setTimeout(() => {
      addMessage({
        content: "No problem! Let's create your perfect bowl! 🥣",
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
  };

  const handleRetryError = async (errorId: string) => {
    const success = await errorHandler.retryError(errorId);
    if (success) {
      removeError(errorId);
    }
  };

  const handleExecuteAction = (actionId: string, action: () => void) => {
    try {
      action();
    } catch (error) {
      console.error('Action execution failed:', error);
    }
  };

  // Position classes - dynamic based on widget state
  const getPositionClasses = () => {
    if (widgetState === 'collapsed') {
      return position === 'bottom-right' ? 'bottom-4 right-4' : 'bottom-4 left-4';
    }
    // When expanded, center the widget on larger screens
    if (!isMobile) {
      return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
    return 'inset-0';
  };

  // Get responsive dimensions
  const getResponsiveDimensions = () => {
    if (isMobile) {
      return { width: '100vw', height: '100vh' };
    }

    // Use CSS classes for responsive behavior
    return {
      width: '60vw',
      height: '85vh'
    };
  };

  // Widget container variants for animation
  const widgetVariants = {
    collapsed: {
      width: 60,
      height: 60,
      borderRadius: 30
    },
    expanding: {
      ...getResponsiveDimensions(),
      borderRadius: isMobile ? 0 : 20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    expanded: {
      ...getResponsiveDimensions(),
      borderRadius: isMobile ? 0 : 20
    },
    closing: {
      width: 60,
      height: 60,
      borderRadius: 30,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  // FAB button variants
  const fabVariants = {
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0
    },
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: 180
    }
  };

  return (
    <div className={cn(
      "heybo-chatbot-widget heybo-chatbot-container",
      getPositionClasses(),
      className
    )}>
      {/* Background overlay for expanded state */}
      {(widgetState === 'expanded' || widgetState === 'expanding') && !isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          style={{ zIndex: -1 }}
          onClick={handleMinimize}
        />
      )}

      <motion.div
        variants={widgetVariants}
        animate={widgetState}
        className={cn(
          "heybo-chatbot-widget",
          "heybo-chatbot-window",
          "relative overflow-hidden",
          // Collapsed state overrides - Official 56px FAB size
          widgetState === 'collapsed' && "w-[56px] h-[56px]",
          theme === 'dark' && "bg-gray-900"
        )}
        style={{
          borderRadius: widgetState === 'collapsed' ? '50%' : (isMobile ? 0 : 20)
        }}
      >
        {/* Main background */}
        {(widgetState === 'expanded' || widgetState === 'expanding') && (
          <div
            className="absolute inset-0"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB'
            }}
          />
        )}
        {/* FAB Button - Official HeyBo Design (56px with gradient and pulse) */}
        <AnimatePresence>
          {widgetState === 'collapsed' && (
            <motion.button
              variants={fabVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={handleToggleWidget}
              className="heybo-chatbot-fab"
              style={{
                background: 'var(--heybo-primary-gradient)',
                border: 'var(--heybo-border-default)'
              }}
              aria-label="Open LULU - HeyBo Chat Assistant"
            >
              {/* HeyBo Icon */}
              <HeyBoIcon
                size={28}
                theme="dark"
                className="drop-shadow-sm relative z-10"
              />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat Interface - Only visible when expanded */}
        <AnimatePresence>
          {(widgetState === 'expanded' || widgetState === 'expanding') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: widgetState === 'expanding' ? 0.2 : 0 }}
              className="relative w-full h-full flex flex-col z-10"
            >
              {/* Header - CSS Namespace Compliant */}
              <div className="heybo-chatbot-header relative z-20">
                <div className="flex items-center space-x-3">
                  <HeyBoLuluBrand
                    logoVariant="header"
                    size="sm"
                    theme="dark"
                    spacing="normal"
                  />
                  <div>
                    <p className="text-xs opacity-80">
                      Let's build your perfect bowl!
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleReset}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="Reset conversation"
                    title="Start over"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>

                  <button
                    onClick={handleMinimize}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="Minimize chat"
                  >
                    {isMobile ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Minimize2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error and Warning Display */}
              {(errors.length > 0 || warnings.length > 0) && (
                <div className="p-4 border-b border-gray-200">
                  <ErrorDisplay
                    errors={errors}
                    warnings={warnings}
                    onDismissError={removeError}
                    onDismissWarning={removeWarning}
                    onRetryError={handleRetryError}
                    onExecuteAction={handleExecuteAction}
                  />
                </div>
              )}

              {/* Chat Content */}
              <div className="flex-1 overflow-hidden relative z-10">
                {(() => {
                  console.log('🔍 ChatbotWidget render decision:', {
                    isAuthenticated: auth.isAuthenticated,
                    authStep: auth.authenticationStep,
                    showRatingInterface,
                    unratedOrdersCount: unratedOrders.length,
                    currentStep
                  });

                  if (!auth.isAuthenticated) {
                    console.log('🔐 Showing AuthenticationFlow');
                    return <AuthenticationFlow onAuthComplete={handleAuthenticationComplete} />;
                  } else if (showRatingInterface && unratedOrders.length > 0) {
                    console.log('⭐ Showing RatingInterface');
                    return (
                      <RatingInterface
                        unratedOrders={unratedOrders}
                        onRatingComplete={handleRatingComplete}
                        onSkip={handleRatingSkip}
                      />
                    );
                  } else {
                    console.log('💬 Showing EnhancedChatInterface');
                    return <EnhancedChatInterface />;
                  }
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default ChatbotWidget;
