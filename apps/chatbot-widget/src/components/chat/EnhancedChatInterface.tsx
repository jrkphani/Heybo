'use client';

import React, { useState, useEffect } from 'react';
import { useChatbotStore } from '../../store/chatbot-store';
import { useLayoutStore } from '../../store/layout-store';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { WelcomeScreen } from './WelcomeScreen';
import { LoadingIndicator } from './LoadingIndicator';
import { HeyBoChatInterface } from './HeyBoChatInterface';
import { TwoPaneLayout } from '../layout/TwoPaneLayout';
import { OrderSummaryPane } from '../ordering/OrderSummaryPane';
import { CartView } from '../ordering/CartView';
import { LocationTypeSelector } from '../ordering/LocationTypeSelector';
import { LocationSelector } from '../ordering/LocationSelector';
import { GPSLocationHandler } from '../ordering/GPSLocationHandler';
import { TimeSelector } from '../ordering/TimeSelector';
import { SignatureBowlsList } from '../ordering/SignatureBowlsList';
import { MLSuggestionsStartingPoint } from '../ordering/MLSuggestionsStartingPoint';
import { WeightWarningDialog } from '../ordering/WeightWarningDialog';
import { UpsellingSuggestions } from '../ordering/UpsellingSuggestions';
import { RecentOrdersList } from '../ordering/RecentOrdersList';
import { FavoritesList } from '../ordering/FavoritesList';
import { CreateYourOwnFlow } from '../ordering/CreateYourOwnFlow';
import { OrderTypeSelection } from '../ordering/OrderTypeSelection';
import { MLRecommendationsList } from '../ordering/MLRecommendationsList';
// Import Navigation Components
import { NavigationHeader } from '../navigation/NavigationHeader';
import { NavigationMenu } from '../navigation/NavigationMenu';
import { ContentRouter } from '../navigation/ContentRouter';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { LocationType, Location, OrderTimeType, BowlComposition, RecentOrder, FavoriteItem } from '../../types';

export function EnhancedChatInterface() {
  const {
    messages,
    isLoading,
    currentStep,
    currentBowl,
    error,
    selectedLocation,
    addMessage,
    setCurrentStep,
    setSelectedLocation,
    user
  } = useChatbotStore();

  const {
    navigation,
    navigateToStage,
    setCurrentFlow,
    syncWithChatbotStep,
    isDualPane,
    isMobileView
  } = useLayoutStore();

  const [showMobileOrderSummary, setShowMobileOrderSummary] = useState(false);
  const [selectedLocationType, setSelectedLocationType] = useState<LocationType | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [pendingOrderType, setPendingOrderType] = useState<string | null>(null);
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync chatbot step with navigation system
  useEffect(() => {
    syncWithChatbotStep(currentStep);
  }, [currentStep, syncWithChatbotStep]);

  // Map chatbot steps to navigation flows and stages
  const getNavigationMapping = (step: string) => {
    const stepToNavigationMap: Record<string, { flow: typeof navigation.currentFlow; stage: string }> = {
      'welcome': { flow: 'bowl-building', stage: 'welcome' },
      'location-type-selection': { flow: 'bowl-building', stage: 'location-setup' },
      'gps-location-check': { flow: 'bowl-building', stage: 'location-setup' },
      'location-selection': { flow: 'bowl-building', stage: 'location-setup' },
      'time-selection': { flow: 'bowl-building', stage: 'location-setup' },
      'order-type-selection': { flow: 'bowl-building', stage: 'selection' },
      'signature-bowls': { flow: 'bowl-building', stage: 'selection' },
      'recent-orders': { flow: 'favorites', stage: 'selection' },
      'favorites': { flow: 'favorites', stage: 'selection' },
      'create-your-own': { flow: 'bowl-building', stage: 'building' },
      'ml-suggestions-starting-point': { flow: 'bowl-building', stage: 'building' },
      'ml-recommendations': { flow: 'bowl-building', stage: 'building' },
      'bowl-building': { flow: 'bowl-building', stage: 'building' },
      'ingredient-selection': { flow: 'bowl-building', stage: 'customization' },
      'bowl-review': { flow: 'bowl-building', stage: 'review' },
      'add-ons-selection': { flow: 'bowl-building', stage: 'customization' },
      'cart-review': { flow: 'cart-management', stage: 'review' },
      'upselling': { flow: 'cart-management', stage: 'upselling' },
      'order-confirmation': { flow: 'order-review', stage: 'confirmation' }
    };

    return stepToNavigationMap[step] || { flow: 'bowl-building', stage: 'welcome' };
  };

  const handleWelcomeAction = (action: string) => {
    switch (action) {
      case 'create-bowl':
        addMessage({ content: 'I want to create a custom grain bowl', type: 'user' });
        if (!selectedLocation) {
          setPendingOrderType('ml-suggestions-starting-point');
          setTimeout(() => {
            addMessage({
              content: 'Perfect! Let\'s create your custom bowl. First, I need to know your pickup location.',
              type: 'assistant'
            });
            setCurrentStep('location-type-selection');
          }, 500);
        } else {
          setTimeout(() => {
            addMessage({
              content: 'Great! Let me create some personalized suggestions for you, or you can build from scratch.',
              type: 'assistant'
            });
            setCurrentStep('ml-suggestions-starting-point');
          }, 500);
        }
        break;
      case 'favorites':
        addMessage({ content: 'Show me my favorite bowls', type: 'user' });
        if (!selectedLocation) {
          setPendingOrderType('favorites');
          setTimeout(() => {
            addMessage({
              content: 'Great! Let me first help you select a pickup location, then I\'ll show your favorites.',
              type: 'assistant'
            });
            setCurrentStep('location-type-selection');
          }, 500);
        } else {
          setCurrentStep('favorites');
        }
        break;
      case 'previous-order':
        addMessage({ content: 'I want to reorder my last bowl', type: 'user' });
        if (!selectedLocation) {
          setPendingOrderType('recent-orders');
          setTimeout(() => {
            addMessage({
              content: 'Perfect! Let me first help you select a pickup location, then I\'ll show your recent orders.',
              type: 'assistant'
            });
            setCurrentStep('location-type-selection');
          }, 500);
        } else {
          setCurrentStep('recent-orders');
        }
        break;
      case 'signature':
        addMessage({ content: 'Show me your signature bowls', type: 'user' });
        if (!selectedLocation) {
          setPendingOrderType('signature-bowls');
          setTimeout(() => {
            addMessage({
              content: 'Excellent! Let me first help you select a pickup location, then I\'ll show our signature bowls.',
              type: 'assistant'
            });
            setCurrentStep('location-type-selection');
          }, 500);
        } else {
          setCurrentStep('signature-bowls');
        }
        break;
      case 'recent':
        addMessage({ content: 'Show me my recent orders', type: 'user' });
        if (!selectedLocation) {
          setPendingOrderType('recent-orders');
          setTimeout(() => {
            addMessage({
              content: 'Great! Let me first help you select a pickup location, then I\'ll show your recent orders.',
              type: 'assistant'
            });
            setCurrentStep('location-type-selection');
          }, 500);
        } else {
          setCurrentStep('recent-orders');
        }
        break;
      case 'faq':
        addMessage({ content: 'I have some questions', type: 'user' });
        setCurrentStep('faq');
        break;
      default:
        addMessage({ content: `Help me with ${action}`, type: 'user' });
    }
  };

  const handleLocationTypeSelect = (type: LocationType) => {
    setSelectedLocationType(type);
    // First check GPS location, then fall back to full location selection
    setCurrentStep('gps-location-check');
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleTimeSelect = (timeType: OrderTimeType, scheduledTime?: Date) => {
    // Handle time selection logic here
    console.log('Time selected:', timeType, scheduledTime);

    // After time selection, proceed to the pending order type or order type selection
    setTimeout(() => {
      if (pendingOrderType) {
        setCurrentStep(pendingOrderType as any);
        setPendingOrderType(null);
      } else {
        setCurrentStep('order-type-selection');
      }
    }, 1000);
  };

  const handleBowlSelect = (bowl: BowlComposition) => {
    // Handle bowl selection logic here
    console.log('Bowl selected:', bowl);
  };

  const handleRecentOrderSelect = (order: RecentOrder) => {
    // Handle recent order selection logic here
    console.log('Recent order selected:', order);
  };

  const handleFavoriteSelect = (favorite: FavoriteItem) => {
    // Handle favorite selection logic here
    console.log('Favorite selected:', favorite);
  };

  const handleBowlComplete = () => {
    // Handle bowl completion logic here
    console.log('Bowl completed');
  };

  const handleOrderTypeSelect = (type: string) => {
    // Handle order type selection logic here
    console.log('Order type selected:', type);
  };

  const handleViewCart = () => {
    setCurrentStep('cart-review');
  };

  const handleAddItems = () => {
    setCurrentStep('order-type-selection');
  };

  const handleCheckout = () => {
    // Go to upselling first, then order confirmation
    setCurrentStep('upselling');
  };

  // Navigation handlers
  const handleNavigationMenuToggle = () => {
    setShowNavigationMenu(!showNavigationMenu);
  };

  const handleNavigate = (stage: string, flow: typeof navigation.currentFlow) => {
    // Update navigation state
    navigateToStage(stage, flow);
    setCurrentFlow(flow);

    // Map navigation back to chatbot step
    const navigationToStepMap: Record<string, string> = {
      'bowl-building-welcome': 'welcome',
      'bowl-building-location-setup': 'location-type-selection',
      'bowl-building-selection': 'order-type-selection',
      'bowl-building-building': 'create-your-own',
      'bowl-building-customization': 'ingredient-selection',
      'bowl-building-review': 'bowl-review',
      'cart-management-review': 'cart-review',
      'cart-management-upselling': 'upselling',
      'order-review-confirmation': 'order-confirmation',
      'favorites-selection': 'favorites'
    };

    const stepKey = `${flow}-${stage}`;
    const mappedStep = navigationToStepMap[stepKey];
    if (mappedStep) {
      setCurrentStep(mappedStep as any);
    }

    // Close mobile menu
    setShowNavigationMenu(false);
  };

  // Determine if we should show the two-pane layout
  const shouldShowTwoPaneLayout = [
    'cart-review',
    'create-your-own',
    'ml-suggestions-starting-point',
    'bowl-building',
    'ingredient-selection',
    'bowl-review',
    'add-ons-selection',
    'upselling',
    'order-confirmation'
  ].includes(currentStep);

  // Determine if we should use the new navigation system
  const shouldUseNavigationSystem = isDualPane || isMobileView;

  // Render main content based on current step
  const renderMainContent = () => {
    console.log('🎯 EnhancedChatInterface rendering step:', currentStep, 'User:', user?.name);

    switch (currentStep) {
      case 'welcome':
        console.log('🏠 Rendering HeyBoChatInterface');
        return (
          <HeyBoChatInterface className="heybo-chatbot-enhanced-interface" />
        );

      case 'location-type-selection':
        return (
          <div className="p-6 h-full flex items-center justify-center">
            <LocationTypeSelector onLocationTypeSelect={handleLocationTypeSelect} />
          </div>
        );

      case 'gps-location-check':
        return (
          <div className="p-6 h-full flex items-center justify-center">
            {selectedLocationType && (
              <GPSLocationHandler
                locationType={selectedLocationType}
                onLocationSelect={handleLocationSelect}
                onShowAllLocations={() => setCurrentStep('location-selection')}
              />
            )}
          </div>
        );

      case 'location-selection':
        return (
          <div className="p-6 h-full flex items-center justify-center">
            {selectedLocationType && (
              <LocationSelector
                locationType={selectedLocationType}
                onLocationSelect={handleLocationSelect}
              />
            )}
          </div>
        );

      case 'time-selection':
        return (
          <div className="p-6 h-full flex items-center justify-center">
            <TimeSelector onTimeSelect={handleTimeSelect} />
          </div>
        );

      case 'order-type-selection':
        return (
          <div className="p-6 h-full flex items-center justify-center">
            <OrderTypeSelection onOrderTypeSelect={handleOrderTypeSelect} />
          </div>
        );

      case 'signature-bowls':
        return (
          <div className="p-6 h-full overflow-y-auto">
            <SignatureBowlsList onBowlSelect={handleBowlSelect} />
          </div>
        );

      case 'recent-orders':
        return (
          <div className="p-6 h-full overflow-y-auto">
            <RecentOrdersList onOrderSelect={handleRecentOrderSelect} />
          </div>
        );

      case 'favorites':
        return (
          <div className="p-6 h-full overflow-y-auto">
            <FavoritesList onFavoriteSelect={handleFavoriteSelect} />
          </div>
        );

      case 'create-your-own':
        return (
          <CreateYourOwnFlow onBowlComplete={handleBowlComplete} />
        );

      case 'ml-suggestions-starting-point':
        return (
          <MLSuggestionsStartingPoint
            dietaryRestrictions={[]} // Get from user preferences
            allergens={[]} // Get from user preferences
            onSelectSuggestion={(recommendation) => {
              // Handle ML suggestion selection
              console.log('Selected ML suggestion:', recommendation);
              setCurrentStep('create-your-own');
            }}
            onBuildFromScratch={() => setCurrentStep('create-your-own')}
          />
        );

      case 'ml-recommendations':
        return (
          <div className="p-6 h-full overflow-y-auto">
            <MLRecommendationsList onBowlSelect={handleBowlSelect} />
          </div>
        );

      case 'upselling':
        return (
          <UpsellingSuggestions
            cartItems={[]} // Get from cart state
            onAddItem={(item) => {
              // Handle adding upsell item
              console.log('Adding upsell item:', item);
            }}
            onContinue={() => setCurrentStep('order-confirmation')}
            onSkip={() => setCurrentStep('order-confirmation')}
          />
        );

      case 'cart-review':
        return (
          <CartView
            onViewCart={handleViewCart}
            onAddItems={handleAddItems}
            onCheckout={handleCheckout}
          />
        );

      default:
        console.log('❓ Rendering HeyBoChatInterface for step:', currentStep);
        return (
          <HeyBoChatInterface className="heybo-chatbot-enhanced-interface" />
        );
    }
  };

  // For two-pane layout steps with navigation system
  if (shouldShowTwoPaneLayout) {
    // Use navigation system for dual-pane layouts
    if (shouldUseNavigationSystem) {
      return (
        <div className="flex flex-col h-full">
          {/* Global Navigation Header */}
          <NavigationHeader
            showMenuToggle={isMobileView}
            onMenuToggle={handleNavigationMenuToggle}
          />

          {/* Navigation Menu Overlay (Mobile) */}
          {showNavigationMenu && isMobileView && (
            <div className="absolute inset-0 z-50 bg-white">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Navigation</h2>
                <button
                  onClick={() => setShowNavigationMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <NavigationMenu onNavigate={handleNavigate} />
            </div>
          )}

          {/* Main Content with Navigation Router */}
          <div className="flex-1 overflow-hidden">
            <TwoPaneLayout
              leftPaneContent={
                <div className="flex flex-col h-full">
                  {/* Desktop Navigation Menu */}
                  {!isMobileView && (
                    <div className="border-b border-gray-200">
                      <NavigationMenu onNavigate={handleNavigate} className="p-2" />
                    </div>
                  )}

                  {/* Content Router */}
                  <div className="flex-1 overflow-hidden">
                    <ContentRouter />
                  </div>
                </div>
              }
              rightPaneContent={<OrderSummaryPane />}
              className="h-full"
            />
          </div>
        </div>
      );
    }

    // Fallback to original layout for non-navigation systems
    const LayoutComponent = TwoPaneLayout;

    return (
      <LayoutComponent
        leftPaneContent={<OrderSummaryPane />}
        rightPaneContent={
          <div className="flex flex-col h-full">
            {/* Mobile header with menu toggle */}
            {isMobile && (
              <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
                <h2 className="font-semibold text-gray-900">Your Order</h2>
                <button
                  onClick={() => setShowMobileOrderSummary(!showMobileOrderSummary)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  {showMobileOrderSummary ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            )}

            {/* Main content */}
            <div className="flex-1 overflow-hidden">
              {renderMainContent()}
            </div>

            {/* Chat input for two-pane layout */}
            <div className="border-t border-gray-200 bg-white">
              <ChatInput />
            </div>
          </div>
        }
        className="h-full"
      />
    );
  }

  // For single-pane layout steps
  return (
    <div className="h-full bg-white">
      {renderMainContent()}
    </div>
  );
}
