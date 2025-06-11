// HeyBo Content Router Component
'use client';

import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutStore } from '../../store/layout-store';
import { useChatbotStore } from '../../store/chatbot-store';
import type { NavigationState } from '../../types/layout';

// Import existing ordering components
import { WelcomeScreen } from '../chat/WelcomeScreen';
import { LocationTypeSelector } from '../ordering/LocationTypeSelector';
import { LocationSelector } from '../ordering/LocationSelector';
import { GPSLocationHandler } from '../ordering/GPSLocationHandler';
import { TimeSelector } from '../ordering/TimeSelector';
import { OrderTypeSelection } from '../ordering/OrderTypeSelection';
import { SignatureBowlsList } from '../ordering/SignatureBowlsList';
import { RecentOrdersList } from '../ordering/RecentOrdersList';
import { FavoritesList } from '../ordering/FavoritesList';
import { CreateYourOwnFlow } from '../ordering/CreateYourOwnFlow';
import { MLSuggestionsStartingPoint } from '../ordering/MLSuggestionsStartingPoint';
import { MLRecommendationsList } from '../ordering/MLRecommendationsList';
import { CartView } from '../ordering/CartView';
import { UpsellingSuggestions } from '../ordering/UpsellingSuggestions';
import type { LocationType, Location, OrderTimeType, BowlComposition, RecentOrder, FavoriteItem } from '../../types';

// Content loading component
function ContentLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="heybo-chatbot-content-router">
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
  const {
    currentStep,
    user,
    setCurrentStep,
    selectedLocation,
    setSelectedLocation
  } = useChatbotStore();

  // Navigation handlers for components
  const handleWelcomeAction = (action: string) => {
    switch (action) {
      case 'create-your-own':
        setCurrentStep('create-your-own');
        break;
      case 'signature-bowls':
        setCurrentStep('signature-bowls');
        break;
      case 'recent-orders':
        setCurrentStep('recent-orders');
        break;
      case 'favorites':
        setCurrentStep('favorites');
        break;
      default:
        setCurrentStep('order-type-selection');
    }
  };

  const handleLocationTypeSelect = (locationType: LocationType) => {
    setCurrentStep('gps-location-check');
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setCurrentStep('time-selection');
  };

  // Import components dynamically based on route
  const getContent = () => {
    const routeKey = `${flow}-${stage}`;

    switch (routeKey) {
      case 'bowl-building-welcome':
        return (
          <WelcomeScreen
            onActionSelect={handleWelcomeAction}
            userName={user?.name}
          />
        );

      case 'bowl-building-location-setup':
        // Map to current step to determine which location component to show
        if (currentStep === 'location-type-selection') {
          return <LocationTypeSelector onLocationTypeSelect={handleLocationTypeSelect} />;
        } else if (currentStep === 'gps-location-check') {
          return (
            <GPSLocationHandler
              locationType="outlet" // This would come from state
              onLocationSelect={handleLocationSelect}
              onShowAllLocations={() => setCurrentStep('location-selection')}
            />
          );
        } else if (currentStep === 'location-selection') {
          return <LocationSelector locationType="outlet" onLocationSelect={handleLocationSelect} />;
        } else if (currentStep === 'time-selection') {
          return (
            <TimeSelector
              onTimeSelect={(timeType: OrderTimeType, time?: Date) => {
                setCurrentStep('order-type-selection');
              }}
            />
          );
        }
        return <LocationTypeSelector onLocationTypeSelect={handleLocationTypeSelect} />;

      case 'bowl-building-selection':
        if (currentStep === 'signature-bowls') {
          return (
            <SignatureBowlsList
              onBowlSelect={(bowl) => {
                setCurrentStep('bowl-review');
              }}
            />
          );
        } else if (currentStep === 'order-type-selection') {
          return (
            <OrderTypeSelection
              onOrderTypeSelect={(orderType) => {
                switch (orderType) {
                  case 'signature-bowls':
                    setCurrentStep('signature-bowls');
                    break;
                  case 'create-your-own':
                    setCurrentStep('create-your-own');
                    break;
                  case 'recent-orders':
                    setCurrentStep('recent-orders');
                    break;
                  case 'favorites':
                    setCurrentStep('favorites');
                    break;
                }
              }}
            />
          );
        }
        return (
          <OrderTypeSelection
            onOrderTypeSelect={(orderType) => {
              setCurrentStep(orderType as any);
            }}
          />
        );

      case 'bowl-building-building':
        if (currentStep === 'create-your-own') {
          return (
            <CreateYourOwnFlow
              onBowlComplete={() => {
                setCurrentStep('bowl-review');
              }}
            />
          );
        } else if (currentStep === 'ml-suggestions-starting-point') {
          return (
            <MLSuggestionsStartingPoint
              dietaryRestrictions={[]}
              allergens={[]}
              onSelectSuggestion={(recommendation) => {
                setCurrentStep('create-your-own');
              }}
              onBuildFromScratch={() => setCurrentStep('create-your-own')}
            />
          );
        } else if (currentStep === 'ml-recommendations') {
          return (
            <MLRecommendationsList
              onBowlSelect={(bowl) => {
                setCurrentStep('bowl-review');
              }}
            />
          );
        }
        return (
          <CreateYourOwnFlow
            onBowlComplete={() => {
              setCurrentStep('bowl-review');
            }}
          />
        );

      case 'bowl-building-customization':
        return (
          <CreateYourOwnFlow
            onBowlComplete={() => {
              setCurrentStep('bowl-review');
            }}
          />
        );

      case 'bowl-building-review':
        return (
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Review Your Bowl
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-medium">Custom Bowl</div>
                <div className="text-sm text-gray-600 mt-1">
                  Review your selections and add to cart
                </div>
              </div>
              <button
                onClick={() => setCurrentStep('cart-review')}
                className="w-full bg-heybo-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-[var(--heybo-primary-600)] transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        );

      case 'cart-management-review':
        return (
          <CartView
            onViewCart={() => {}}
            onAddItems={() => setCurrentStep('order-type-selection')}
            onCheckout={() => setCurrentStep('upselling')}
          />
        );

      case 'cart-management-upselling':
        return (
          <UpsellingSuggestions
            cartItems={[]}
            onAddItem={(item) => {
              console.log('Adding upsell item:', item);
            }}
            onContinue={() => setCurrentStep('order-confirmation')}
            onSkip={() => setCurrentStep('order-confirmation')}
          />
        );

      case 'favorites-selection':
        if (currentStep === 'favorites') {
          return (
            <FavoritesList
              onFavoriteSelect={(favorite) => {
                setCurrentStep('bowl-review');
              }}
            />
          );
        } else if (currentStep === 'recent-orders') {
          return (
            <RecentOrdersList
              onOrderSelect={(order) => {
                setCurrentStep('bowl-review');
              }}
            />
          );
        }
        return (
          <FavoritesList
            onFavoriteSelect={(favorite) => {
              setCurrentStep('bowl-review');
            }}
          />
        );

      case 'order-review-confirmation':
        return (
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Order Confirmed! 🎉
            </h2>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="font-medium text-green-800">Order #12345</div>
                <div className="text-sm text-green-600 mt-1">
                  Your bowl is being prepared! Estimated time: 25-30 minutes
                </div>
              </div>
              <button
                onClick={() => setCurrentStep('welcome')}
                className="w-full bg-heybo-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-[var(--heybo-primary-600)] transition-colors"
              >
                Order Another Bowl
              </button>
            </div>
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