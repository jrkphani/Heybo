'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  Wifi,
  WifiOff,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Monitor,
  Smartphone,
  Tablet,
  User,
  ShoppingCart,
  Heart,
  ChefHat,
  MessageCircle,
  Package,
  Info,
  ArrowRight
} from 'lucide-react';
import { ChatbotWidgetV2 } from '../../../components/ChatbotWidgetV2';
import { BowlPreviewV2 } from '../../../components/bowl/BowlPreviewV2';
import { CartManagerV2 } from '../../../components/ordering/CartManagerV2';
import { FavoritesListV2 } from '../../../components/favorites/FavoritesListV2';
import { CreateYourOwnFlowV2 } from '../../../components/ordering/CreateYourOwnFlowV2';
import { OrderTrackingV2 } from '../../../components/ordering/OrderTrackingV2';
import { ChatMessagesV2 } from '../../../components/chat/ChatMessagesV2';
import { useChatbotStore } from '../../../store/chatbot-store';
import { useLayoutStore } from '../../../store/layout-store';
import { cn } from '../../../lib/utils';
import type { ResponsiveBreakpoint } from '../../../types/layout';
import { mockBases, mockProteins, mockSides, mockSauces, mockGarnishes } from '../../../lib/mock-data';
import '../../../styles/heybo-design-tokens.css';

type DemoScenario =
  | 'bowl-customization'
  | 'signature-selection'
  | 'cart-management'
  | 'order-tracking'
  | 'favorites-management'
  | 'chat-interaction'
  | 'complete-flow';

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

interface DemoState {
  activeScenario: DemoScenario;
  viewportSize: ViewportSize;
  isPlaying: boolean;
  autoProgress: boolean;
  showDebugInfo: boolean;
  currentStep: number;
  totalSteps: number;
}

interface ScenarioConfig {
  id: DemoScenario;
  title: string;
  description: string;
  icon: React.ReactNode;
  steps: ScenarioStep[];
  estimatedTime: string;
  complexity: 'simple' | 'moderate' | 'complex';
}

interface ScenarioStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  duration: number;
  actions?: string[];
}

export default function ComprehensiveFlowsDemo() {
  const [demoState, setDemoState] = useState<DemoState>(
    {
      activeScenario: 'complete-flow',
      viewportSize: 'desktop',
      isPlaying: false,
      autoProgress: false,
      showDebugInfo: false,
      currentStep: 0,
      totalSteps: 0
    }
  );

  const { resetBowl, setCurrentStep, addMessage, messages } = useChatbotStore();
  const { setScreenWidth, currentBreakpoint, navigation } = useLayoutStore();

  // Demo scenarios configuration
  const scenarios: ScenarioConfig[] = [
    {
      id: 'complete-flow',
      title: 'Complete User Journey',
      description: 'Full end-to-end experience from browsing to order tracking',
      icon: <ArrowRight className="w-5 h-5" />,
      estimatedTime: '8-10 min',
      complexity: 'complex',
      steps: [
        {
          id: 'welcome',
          title: 'Welcome & Introduction',
          description: 'User opens the HeyBo chatbot widget',
          component: <ChatbotWidgetV2 className="max-w-4xl mx-auto" />,
          duration: 3000
        },
        {
          id: 'browse-signatures',
          title: 'Browse Signature Bowls',
          description: 'Exploring pre-designed healthy bowls',
          component: (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              <BowlPreviewV2
                bowl={{
                  name: 'Mediterranean Power Bowl',
                  base: mockBases[1]!, // Quinoa
                  protein: mockProteins[0]!, // Roasted Lemongrass Chicken
                  sides: [mockSides[0]!, mockSides[1]!], // Roasted Pumpkin, Charred Corn
                  sauce: mockSauces[0]!, // Purple Sweet Potato Dip
                  garnish: mockGarnishes[0]! // Mixed Seeds
                }}
                variant="detailed"
                className=""
              />
              <ChatMessagesV2 className="" />
            </div>
          ),
          duration: 4000
        },
        {
          id: 'create-custom',
          title: 'Create Your Own Bowl',
          description: 'Step-by-step bowl customization process',
          component: <CreateYourOwnFlowV2 className="max-w-5xl mx-auto" />,
          duration: 6000
        },
        {
          id: 'manage-cart',
          title: 'Cart Management',
          description: 'Review items, adjust quantities, and proceed to checkout',
          component: <CartManagerV2 className="max-w-4xl mx-auto" />,
          duration: 4000
        },
        {
          id: 'track-order',
          title: 'Order Tracking',
          description: 'Real-time order status and pickup information',
          component: <OrderTrackingV2 className="max-w-4xl mx-auto" />,
          duration: 5000
        }
      ]
    },
    {
      id: 'bowl-customization',
      title: 'Bowl Customization',
      description: 'Deep dive into the Create Your Own experience',
      icon: <ChefHat className="w-5 h-5" />,
      estimatedTime: '3-4 min',
      complexity: 'moderate',
      steps: [
        {
          id: 'cyo-start',
          title: 'Start Customization',
          description: 'Begin the bowl building process',
          component: <CreateYourOwnFlowV2 className="max-w-4xl mx-auto" />,
          duration: 5000
        },
        {
          id: 'cyo-preview',
          title: 'Live Preview',
          description: 'See bowl updates in real-time',
          component: (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              <CreateYourOwnFlowV2 className="" />
              <BowlPreviewV2
                bowl={{
                  name: 'Custom Bowl in Progress',
                  base: mockBases[0]!, // Brown Rice
                  protein: mockProteins[2]! // Tofu
                }}
                variant="detailed"
                className=""
              />
            </div>
          ),
          duration: 4000
        }
      ]
    },
    {
      id: 'cart-management',
      title: 'Cart & Checkout',
      description: 'Cart operations and checkout flow',
      icon: <ShoppingCart className="w-5 h-5" />,
      estimatedTime: '2-3 min',
      complexity: 'simple',
      steps: [
        {
          id: 'cart-full',
          title: 'Full Cart View',
          description: 'Complete cart management interface',
          component: <CartManagerV2 className="max-w-4xl mx-auto" />,
          duration: 4000
        },
        {
          id: 'cart-checkout',
          title: 'Checkout Process',
          description: 'Streamlined checkout experience',
          component: <CartManagerV2 className="max-w-4xl mx-auto" />,
          duration: 3000
        }
      ]
    },
    {
      id: 'order-tracking',
      title: 'Order Tracking',
      description: 'Real-time order status and updates',
      icon: <Package className="w-5 h-5" />,
      estimatedTime: '2-3 min',
      complexity: 'simple',
      steps: [
        {
          id: 'tracking-full',
          title: 'Full Tracking View',
          description: 'Complete order tracking interface',
          component: <OrderTrackingV2 className="max-w-4xl mx-auto" />,
          duration: 4000
        },
        {
          id: 'tracking-compact',
          title: 'Compact Tracking',
          description: 'Embedded tracking widget',
          component: <OrderTrackingV2 className="max-w-md mx-auto" />,
          duration: 2000
        }
      ]
    },
    {
      id: 'favorites-management',
      title: 'Favorites System',
      description: 'Save and manage favorite bowls',
      icon: <Heart className="w-5 h-5" />,
      estimatedTime: '2-3 min',
      complexity: 'moderate',
      steps: [
        {
          id: 'favorites-grid',
          title: 'Favorites Grid',
          description: 'Browse saved favorites in grid view',
          component: <FavoritesListV2 className="max-w-5xl mx-auto" />,
          duration: 3000
        },
        {
          id: 'favorites-list',
          title: 'Favorites List',
          description: 'Detailed list view with actions',
          component: <FavoritesListV2 className="max-w-4xl mx-auto" />,
          duration: 3000
        }
      ]
    },
    {
      id: 'chat-interaction',
      title: 'Chat Experience',
      description: 'Enhanced conversational interface',
      icon: <MessageCircle className="w-5 h-5" />,
      estimatedTime: '2-3 min',
      complexity: 'simple',
      steps: [
        {
          id: 'chat-full',
          title: 'Full Chat Interface',
          description: 'Complete chat experience with embedded UI',
          component: <ChatMessagesV2 enableEmbeddedUI className="max-w-4xl mx-auto" />,
          duration: 4000
        }
      ]
    }
  ];

  // Get current scenario and step (memoized to prevent infinite re-renders)
  const currentScenario = useMemo(() =>
    scenarios.find(s => s.id === demoState.activeScenario),
    [demoState.activeScenario]
  );
  const currentStep = useMemo(() =>
    currentScenario?.steps[demoState.currentStep],
    [currentScenario, demoState.currentStep]
  );

  // Auto-progress through steps
  useEffect(() => {
    if (!demoState.isPlaying || !demoState.autoProgress || !currentStep) return;

    const timer = setTimeout(() => {
      setDemoState(prev => {
        const nextStep = prev.currentStep + 1;
        if (nextStep >= (currentScenario?.steps.length || 0)) {
          return { ...prev, isPlaying: false, currentStep: 0 };
        }
        return { ...prev, currentStep: nextStep };
      });
    }, currentStep.duration);

    return () => clearTimeout(timer);
  }, [demoState.isPlaying, demoState.autoProgress, demoState.currentStep, currentStep, currentScenario]);

  // Update viewport size
  useEffect(() => {
    const viewportWidths = {
      mobile: 375,
      tablet: 768,
      desktop: 1280
    };
    
    setScreenWidth(viewportWidths[demoState.viewportSize]);
  }, [demoState.viewportSize, setScreenWidth]);

  // Initialize demo
  useEffect(() => {
    if (currentScenario) {
      setDemoState(prev => ({ ...prev, totalSteps: currentScenario.steps.length }));
    }
  }, [currentScenario]);

  // Handle play/pause
  const togglePlayback = () => {
    setDemoState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  // Handle step navigation
  const goToStep = (stepIndex: number) => {
    setDemoState(prev => ({ 
      ...prev, 
      currentStep: Math.max(0, Math.min(stepIndex, (currentScenario?.steps.length || 1) - 1)),
      isPlaying: false
    }));
  };

  // Handle scenario change
  const changeScenario = (scenarioId: DemoScenario) => {
    resetBowl();
    setDemoState(prev => ({ 
      ...prev, 
      activeScenario: scenarioId,
      currentStep: 0,
      isPlaying: false
    }));
  };

  // Handle viewport change
  const changeViewport = (size: ViewportSize) => {
    setDemoState(prev => ({ ...prev, viewportSize: size }));
  };

  // Reset demo
  const resetDemo = () => {
    resetBowl();
    setDemoState(prev => ({ 
      ...prev, 
      currentStep: 0, 
      isPlaying: false 
    }));
  };

  // Get complexity color
  const getComplexityColor = (complexity: ScenarioConfig['complexity']) => {
    switch (complexity) {
      case 'simple': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'complex': return 'text-red-600 bg-red-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            HeyBo Widget Comprehensive Demo
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Explore all Phase 3 integrated components in action
          </p>
          
          {/* Status indicators */}
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-gray-600">All Components Integrated</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-gray-600">Real-time Synchronization</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
              <span className="text-gray-600">Responsive Design</span>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Scenario Selection */}
            <div className="flex flex-wrap gap-2">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => changeScenario(scenario.id)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors",
                    demoState.activeScenario === scenario.id
                      ? "bg-heybo-primary text-white border-heybo-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {scenario.icon}
                  <span className="hidden sm:inline">{scenario.title}</span>
                </button>
              ))}
            </div>

            {/* Viewport Controls */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Viewport:</span>
              {(['mobile', 'tablet', 'desktop'] as ViewportSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => changeViewport(size)}
                  className={cn(
                    "p-2 rounded border",
                    demoState.viewportSize === size
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  )}
                  title={`${size} view`}
                >
                  {size === 'mobile' && <Smartphone className="w-4 h-4" />}
                  {size === 'tablet' && <Tablet className="w-4 h-4" />}
                  {size === 'desktop' && <Monitor className="w-4 h-4" />}
                </button>
              ))}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={togglePlayback}
                className="flex items-center space-x-2 px-4 py-2 bg-heybo-primary text-white rounded-lg hover:bg-heybo-primary-600 transition-colors"
              >
                {demoState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{demoState.isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button
                onClick={resetDemo}
                className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Reset demo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDemoState(prev => ({ ...prev, showDebugInfo: !prev.showDebugInfo }))}
                className={cn(
                  "p-2 border rounded-lg transition-colors",
                  demoState.showDebugInfo
                    ? "bg-gray-100 text-gray-800 border-gray-400"
                    : "text-gray-600 border-gray-300 hover:bg-gray-50"
                )}
                title="Toggle debug info"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Auto-progress toggle */}
          <div className="mt-4 flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={demoState.autoProgress}
                onChange={(e) => setDemoState(prev => ({ ...prev, autoProgress: e.target.checked }))}
                className="rounded border-gray-300 text-heybo-primary focus:ring-heybo-primary"
              />
              <span className="text-sm text-gray-600">Auto-progress through steps</span>
            </label>
            
            {/* Progress indicator */}
            {currentScenario && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Step {demoState.currentStep + 1} of {currentScenario.steps.length}
                </span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-heybo-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((demoState.currentStep + 1) / currentScenario.steps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scenario Info */}
        {currentScenario && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-heybo-primary-50 rounded-lg text-heybo-primary">
                    {currentScenario.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{currentScenario.title}</h2>
                    <p className="text-gray-600">{currentScenario.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-600">Estimated time: {currentScenario.estimatedTime}</span>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    getComplexityColor(currentScenario.complexity)
                  )}>
                    {currentScenario.complexity}
                  </div>
                </div>
              </div>
              
              {/* Step navigation */}
              <div className="flex space-x-2">
                {currentScenario.steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => goToStep(index)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-colors flex items-center justify-center text-sm font-medium",
                      index === demoState.currentStep
                        ? "bg-heybo-primary text-white border-heybo-primary"
                        : index < demoState.currentStep
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200"
                    )}
                    title={step.title}
                  >
                    {index < demoState.currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Current step info */}
            {currentStep && (
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <h3 className="font-medium text-blue-900 mb-1">{currentStep.title}</h3>
                <p className="text-blue-700 text-sm">{currentStep.description}</p>
                {currentStep.actions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {currentStep.actions.map((action, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {action}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* Debug Information */}
        <AnimatePresence>
          {demoState.showDebugInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-900 text-white rounded-lg p-6 mb-8 overflow-hidden"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Info className="w-5 h-5" />
                <span>Debug Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-300 mb-2">Layout State</h4>
                  <ul className="space-y-1">
                    <li>Breakpoint: <span className="text-green-400">{currentBreakpoint}</span></li>
                    <li>Viewport: <span className="text-green-400">{demoState.viewportSize}</span></li>
                    <li>Current Stage: <span className="text-green-400">{navigation.currentStage}</span></li>
                    <li>Current Flow: <span className="text-green-400">{navigation.currentFlow}</span></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-300 mb-2">Demo State</h4>
                  <ul className="space-y-1">
                    <li>Scenario: <span className="text-blue-400">{demoState.activeScenario}</span></li>
                    <li>Step: <span className="text-blue-400">{demoState.currentStep + 1}/{demoState.totalSteps}</span></li>
                    <li>Playing: <span className="text-blue-400">{demoState.isPlaying ? 'Yes' : 'No'}</span></li>
                    <li>Auto-progress: <span className="text-blue-400">{demoState.autoProgress ? 'Yes' : 'No'}</span></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-300 mb-2">Messages</h4>
                  <ul className="space-y-1">
                    <li>Total: <span className="text-purple-400">{messages.length}</span></li>
                    <li>User: <span className="text-purple-400">{messages.filter(m => m.type === 'user').length}</span></li>
                    <li>Assistant: <span className="text-purple-400">{messages.filter(m => m.type === 'assistant').length}</span></li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Demo Content */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <AnimatePresence mode="wait">
            {currentStep && (
              <motion.div
                key={`${demoState.activeScenario}-${demoState.currentStep}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="min-h-[600px] flex items-center justify-center"
              >
                {currentStep.component}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">
            Phase 3: Component Integration - All V2 Components Successfully Implemented
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <span className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Enhanced Chat Interface</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Bowl Customization Flow</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Order Tracking System</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Responsive Design</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
