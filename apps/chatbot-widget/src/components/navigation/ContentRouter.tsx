// HeyBo Content Router Component
'use client';

import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutStore } from '../../store/layout-store';
import { useChatbotStore } from '../../store/chatbot-store';
import type { NavigationState } from '../../types/layout';

// Content loading component
function ContentLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-heybo-primary"></div>
        <span className="text-gray-600 dark:text-gray-400">{message}</span>
      </div>
    </div>
  );
}

// Content wrapper with animations
interface ContentWrapperProps {
  children: React.ReactNode;
  animationKey: string;
  className?: string;
}

function ContentWrapper({ children, animationKey, className }: ContentWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Left Pane Content Router
interface LeftPaneContentProps {
  flow: NavigationState['currentFlow'];
  stage: string;
}

function LeftPaneContent({ flow, stage }: LeftPaneContentProps) {
  const { currentStep, user } = useChatbotStore();

  // Import components dynamically based on route
  const getContent = () => {
    const routeKey = `${flow}-${stage}`;
    
    switch (routeKey) {
      case 'bowl-building-welcome':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Welcome to HeyBo! 🥣
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ready to build your perfect warm grain bowl? Let's get started!
            </p>
            <div className="space-y-3">
              <button className="w-full bg-heybo-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                Create Your Bowl
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Browse Signature Bowls
              </button>
            </div>
          </div>
        );
        
      case 'bowl-building-selection':
        return (
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Choose Your Bowl
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-heybo-primary cursor-pointer transition-colors">
                  <div className="text-sm font-medium">Signature Bowls</div>
                  <div className="text-xs text-gray-500">Chef curated</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-heybo-primary cursor-pointer transition-colors">
                  <div className="text-sm font-medium">Create Your Own</div>
                  <div className="text-xs text-gray-500">Customize</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'bowl-building-customization':
      case 'bowl-building-building':
        return (
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Build Your Bowl
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Base</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>Brown Rice</option>
                  <option>Quinoa</option>
                  <option>Mixed Greens</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Protein</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>Grilled Chicken</option>
                  <option>Tofu</option>
                  <option>Salmon</option>
                </select>
              </div>
              <button className="w-full bg-heybo-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                Continue
              </button>
            </div>
          </div>
        );
        
      case 'cart-management-review':
        return (
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Review Your Order
            </h2>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="font-medium text-sm">Custom Bowl</div>
                <div className="text-xs text-gray-500">Brown Rice, Chicken, Vegetables</div>
                <div className="text-sm font-medium text-heybo-primary mt-1">$12.99</div>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>$12.99</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>$1.04</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>$14.03</span>
                </div>
              </div>
              <button className="w-full bg-heybo-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </div>
        );
        
      case 'favorites-selection':
        return (
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Your Favorites
            </h2>
            {user?.favorites?.length ? (
              <div className="space-y-3">
                {user.favorites.map((favorite, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 hover:border-heybo-primary cursor-pointer transition-colors">
                    <div className="font-medium text-sm">{favorite.name}</div>
                    <div className="text-xs text-gray-500">{favorite.description}</div>
                    <div className="text-sm font-medium text-heybo-primary mt-1">${(favorite.price / 100).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                  No favorites yet
                </div>
                <button className="bg-heybo-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                  Browse Bowls
                </button>
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              {flow.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Content for {stage} stage is being developed.
            </p>
          </div>
        );
    }
  };

  const routeKey = `${flow}-${stage}`;
  
  return (
    <ContentWrapper animationKey={routeKey} className="h-full">
      <Suspense fallback={<ContentLoader message="Loading content..." />}>
        {getContent()}
      </Suspense>
    </ContentWrapper>
  );
}

// Right Pane Content Router
interface RightPaneContentProps {
  flow: NavigationState['currentFlow'];
  stage: string;
}

function RightPaneContent({ flow, stage }: RightPaneContentProps) {
  const { currentBowl, user } = useChatbotStore();

  const getPreviewContent = () => {
    const routeKey = `${flow}-${stage}`;
    
    switch (flow) {
      case 'bowl-building':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Bowl Preview
            </h3>
            {currentBowl ? (
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-gray-400 text-4xl">🥣</span>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-sm">
                      {currentBowl.name || 'Custom Bowl'}
                    </div>
                    {currentBowl.base && (
                      <div className="text-xs text-gray-600">
                        Base: {currentBowl.base.name}
                      </div>
                    )}
                    {currentBowl.protein && (
                      <div className="text-xs text-gray-600">
                        Protein: {currentBowl.protein.name}
                      </div>
                    )}
                    <div className="text-sm font-medium text-heybo-primary">
                      ${((currentBowl.totalPrice || 0) / 100).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-medium mb-2">Nutrition Info</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Calories</span>
                      <span>{currentBowl.calories || 450}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Protein</span>
                      <span>25g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carbs</span>
                      <span>35g</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">🥣</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Your bowl preview will appear here
                </div>
              </div>
            )}
          </div>
        );
        
      case 'cart-management':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-sm font-medium">Delivery Info</div>
                <div className="text-xs text-gray-500 mt-1">
                  Estimated: 25-30 minutes
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-sm font-medium">Location</div>
                <div className="text-xs text-gray-500 mt-1">
                  Marina Bay Station
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'favorites':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-white border border-gray-200 rounded-lg p-3 text-left hover:border-heybo-primary transition-colors">
                <div className="text-sm font-medium">Add to Cart</div>
                <div className="text-xs text-gray-500">Add selected favorite</div>
              </button>
              <button className="w-full bg-white border border-gray-200 rounded-lg p-3 text-left hover:border-heybo-primary transition-colors">
                <div className="text-sm font-medium">Customize</div>
                <div className="text-xs text-gray-500">Modify this bowl</div>
              </button>
            </div>
          </div>
        );
        
      case 'order-review':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Order Status
            </h3>
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-sm font-medium text-green-800">Order Confirmed</div>
                <div className="text-xs text-green-600 mt-1">
                  We're preparing your bowl!
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Preview
            </h3>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              Preview content will appear here based on your selections.
            </div>
          </div>
        );
    }
  };

  return (
    <ContentWrapper animationKey={`${flow}-${stage}-preview`} className="h-full">
      <Suspense fallback={<ContentLoader message="Loading preview..." />}>
        {getPreviewContent()}
      </Suspense>
    </ContentWrapper>
  );
}

// Main Content Router Component
export function ContentRouter() {
  const { navigation } = useLayoutStore();
  const { isDualPane, isMobileView } = useLayoutStore();

  return (
    <>
      {/* Left Pane Content */}
      <LeftPaneContent 
        flow={navigation.currentFlow} 
        stage={navigation.currentStage} 
      />
      
      {/* Right Pane Content - Only render if dual pane or mobile */}
      {(isDualPane || isMobileView) && (
        <RightPaneContent 
          flow={navigation.currentFlow} 
          stage={navigation.currentStage} 
        />
      )}
    </>
  );
}

// Export individual content components for direct use
export { LeftPaneContent, RightPaneContent, ContentWrapper, ContentLoader }; 