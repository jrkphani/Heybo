'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useWidgetStateStore } from '../../store/widget-state-store';
import { useLayoutStore } from '../../store/layout-store';
import { DualPaneLayout } from '../layout/DualPaneLayout';
import { ProgressiveUIDisclosure } from '../navigation/ProgressiveUIDisclosure';
import { EnhancedChatInterface } from '../chat/EnhancedChatInterface';
import { getCurrentLayoutConfig } from '../../lib/config/layout-config';
import '../../styles/heybo-design-tokens.css';

interface ComplianceFixedWidgetProps {
  className?: string;
}

export function ComplianceFixedWidget({ className }: ComplianceFixedWidgetProps) {
  const { 
    session, 
    layout, 
    ui, 
    conversation,
    openWidget,
    closeWidget,
    setBreakpoint,
    setLayoutMode
  } = useWidgetStateStore();
  
  const { currentBreakpoint } = useLayoutStore();
  const [screenWidth, setScreenWidth] = useState(0);

  // Handle responsive breakpoint detection
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      
      let newBreakpoint: 'sm' | 'md' | 'lg' | 'xl' = 'sm';
      
      if (width >= 1441) newBreakpoint = 'xl';
      else if (width >= 1025) newBreakpoint = 'lg';
      else if (width >= 641) newBreakpoint = 'md';
      else newBreakpoint = 'sm';
      
      setBreakpoint(newBreakpoint);
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, [setBreakpoint]);

  // Widget animation variants
  const widgetVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  // Get current layout configuration
  const layoutConfig = getCurrentLayoutConfig(screenWidth);
  const isDualPaneCapable = ui.isDualPaneCapable;

  // Progressive UI levels for different conversation steps
  const progressiveUILevels = [
    {
      id: 'simple-base',
      level: 'simple' as const,
      trigger: 'base-selection',
      component: <SimpleBaseSelection />,
      description: 'Quick grain base selection'
    },
    {
      id: 'intermediate-protein',
      level: 'intermediate' as const,
      trigger: 'protein-selection',
      component: <IntermediateProteinSelection />,
      description: 'Protein options with customization'
    },
    {
      id: 'complex-sides',
      level: 'complex' as const,
      trigger: 'sides-selection',
      component: <ComplexSidesSelection />,
      description: 'Full ingredient customization'
    },
    {
      id: 'review-bowl',
      level: 'review' as const,
      trigger: 'bowl-review',
      component: <BowlReviewSummary />,
      description: 'Final bowl review and confirmation'
    }
  ];

  // Left pane content (chat interface)
  const leftPaneContent = (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <EnhancedChatInterface />
      </div>
      
      {/* Progressive UI Disclosure */}
      <div className="p-4 border-t border-gray-200">
        <ProgressiveUIDisclosure
          levels={progressiveUILevels}
          currentTrigger={`${conversation.currentStep}-selection`}
          onLevelChange={(level) => {
            console.log('UI level changed:', level);
          }}
        />
      </div>
    </div>
  );

  // Right pane content (contextual information)
  const rightPaneContent = (
    <div className="flex flex-col h-full">
      <BowlPreviewPanel />
      <NutritionInfoPanel />
      <QuickActionsPanel />
    </div>
  );

  if (!session.isOpen) {
    return (
      <div className="heybo-chatbot-container">
        <motion.button
          className="heybo-chatbot-fab"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openWidget}
        >
          <span className="text-white font-bold text-lg">🥣</span>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="heybo-chatbot-container">
      <AnimatePresence>
        <motion.div
          variants={widgetVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            "heybo-chatbot-widget",
            isDualPaneCapable && layout.mode === 'dual-pane-active' && "dual-pane",
            className
          )}
        >
          {/* Widget Header */}
          <div className="heybo-chatbot-header">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🥣</span>
              </div>
              <div>
                <h2 className="heybo-chatbot-title">HeyBo LULU</h2>
                <p className="heybo-chatbot-subtitle">Your grain bowl assistant</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Breakpoint indicator for development */}
              <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                {ui.currentBreakpoint.toUpperCase()}
              </div>
              
              <button
                onClick={closeWidget}
                className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
              >
                <span className="text-white">×</span>
              </button>
            </div>
          </div>

          {/* Widget Content */}
          <div className="flex-1 overflow-hidden">
            {isDualPaneCapable && layout.mode === 'dual-pane-active' ? (
              <DualPaneLayout
                leftPaneContent={leftPaneContent}
                rightPaneContent={rightPaneContent}
              />
            ) : (
              <div className="h-full">
                {leftPaneContent}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Simple base selection component
function SimpleBaseSelection() {
  const bases = ['Brown Rice', 'Quinoa', 'Mixed Grains', 'Cauliflower Rice'];
  
  return (
    <div className="grid grid-cols-2 gap-2">
      {bases.map((base) => (
        <button
          key={base}
          className="heybo-chatbot-touch-target bg-[var(--heybo-primary-50)] border border-[var(--heybo-primary-200)] rounded-lg text-sm font-medium text-[var(--heybo-primary-800)] hover:bg-[var(--heybo-primary-100)] transition-colors"
        >
          {base}
        </button>
      ))}
    </div>
  );
}

// Intermediate protein selection component
function IntermediateProteinSelection() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {['Grilled Chicken', 'Tofu', 'Salmon', 'Skip Protein'].map((protein) => (
          <button
            key={protein}
            className="heybo-chatbot-touch-target bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-800 hover:bg-blue-100 transition-colors"
          >
            {protein}
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-600">
        💡 Tip: You can customize portion size after selection
      </div>
    </div>
  );
}

// Complex sides selection component
function ComplexSidesSelection() {
  return (
    <div className="space-y-3">
      <div className="heybo-chatbot-ingredient-grid">
        {['Roasted Vegetables', 'Fresh Greens', 'Avocado', 'Pickled Onions', 'Nuts & Seeds', 'Cheese'].map((side) => (
          <div
            key={side}
            className="heybo-chatbot-ingredient-card"
          >
            <div className="heybo-chatbot-ingredient-name">{side}</div>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-600">
        Select up to 3 sides • Nutrition info updates in real-time
      </div>
    </div>
  );
}

// Bowl review summary component
function BowlReviewSummary() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
      <h4 className="font-medium text-green-800 mb-2">Your Perfect Bowl</h4>
      <div className="text-sm text-green-700 space-y-1">
        <div>• Brown Rice Base</div>
        <div>• Grilled Chicken</div>
        <div>• Roasted Vegetables, Fresh Greens</div>
        <div>• Tahini Sauce</div>
      </div>
      <div className="mt-3 pt-2 border-t border-green-200">
        <div className="flex justify-between text-sm">
          <span className="text-green-700">Total:</span>
          <span className="font-medium text-green-800">$12.50</span>
        </div>
      </div>
    </div>
  );
}

// Bowl preview panel for right pane
function BowlPreviewPanel() {
  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="font-medium text-gray-900 mb-3">Bowl Preview</h3>
      <div className="bg-[var(--heybo-primary-50)] rounded-lg p-3 text-center">
        <div className="text-4xl mb-2">🥣</div>
        <div className="text-sm text-gray-600">Building your perfect bowl...</div>
      </div>
    </div>
  );
}

// Nutrition info panel for right pane
function NutritionInfoPanel() {
  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="font-medium text-gray-900 mb-3">Nutrition</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Calories</span>
          <span className="font-medium">450</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Protein</span>
          <span className="font-medium">25g</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Carbs</span>
          <span className="font-medium">45g</span>
        </div>
      </div>
    </div>
  );
}

// Quick actions panel for right pane
function QuickActionsPanel() {
  return (
    <div className="p-4">
      <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
      <div className="space-y-2">
        <button className="w-full heybo-btn-primary text-sm py-2">
          Add to Cart
        </button>
        <button className="w-full heybo-btn-secondary text-sm py-2">
          Save as Favorite
        </button>
      </div>
    </div>
  );
}
