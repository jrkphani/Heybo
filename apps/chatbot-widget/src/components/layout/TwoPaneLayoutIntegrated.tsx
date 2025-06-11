// HeyBo Integrated Two-Pane Layout Component
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PanelLeft, 
  PanelRight, 
  X, 
  ArrowLeft, 
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLayoutManager } from '../../hooks/useLayoutManager';
import { useLayoutStore } from '../../store/layout-store';
import { useChatbotStore } from '../../store/chatbot-store';

// Import navigation components
import { NavigationHeader, NavigationProgress } from '../navigation/NavigationHeader';
import { NavigationMenu } from '../navigation/NavigationMenu';
import { LeftPaneContent, RightPaneContent } from '../navigation/ContentRouter';

// Import layout components
import { TwoPaneLayout } from './TwoPaneLayout';

interface TwoPaneLayoutIntegratedProps {
  className?: string;
  onClose?: () => void;
  onNavigate?: (stage: string, flow: string) => void;
  children?: React.ReactNode; // Fallback content if not using navigation system
}

export function TwoPaneLayoutIntegrated({ 
  className, 
  onClose, 
  onNavigate,
  children 
}: TwoPaneLayoutIntegratedProps) {
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);
  
  const {
    currentBreakpoint,
    isMobileView,
    isDualPane,
    dimensions,
    leftPaneCollapsed,
    rightPaneCollapsed,
    setLeftPaneCollapsed,
    setRightPaneCollapsed
  } = useLayoutManager();

  const { navigation } = useLayoutStore();
  const { currentStep } = useChatbotStore();

  // Handle navigation menu toggle
  const handleNavigationMenuToggle = () => {
    setShowNavigationMenu(!showNavigationMenu);
  };

  // Handle custom navigation
  const handleNavigation = (stage: string, flow: string) => {
    setShowNavigationMenu(false); // Close menu on navigation
    onNavigate?.(stage, flow);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + B: Toggle left pane
      if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
        event.preventDefault();
        setLeftPaneCollapsed(!leftPaneCollapsed);
      }
      
      // Cmd/Ctrl + Shift + B: Toggle right pane
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'B') {
        event.preventDefault();
        setRightPaneCollapsed(!rightPaneCollapsed);
      }
      
      // Escape: Close navigation menu
      if (event.key === 'Escape') {
        setShowNavigationMenu(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [leftPaneCollapsed, rightPaneCollapsed, setLeftPaneCollapsed, setRightPaneCollapsed]);

  // Left Pane Content with Navigation
  const leftPaneContent = (
    <div className="flex flex-col h-full">
      {/* Navigation Header */}
      <NavigationHeader
        showMenuToggle={isMobileView}
        onMenuToggle={handleNavigationMenuToggle}
      />
      
      {/* Navigation Progress */}
      <NavigationProgress
        currentFlow={navigation.currentFlow}
        currentStage={navigation.currentStage}
        className="mx-4 mb-2"
      />
      
      {/* Main Content or Navigation Menu */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {showNavigationMenu ? (
            <motion.div
              key="navigation-menu"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full overflow-y-auto"
            >
              <NavigationMenu
                onNavigate={handleNavigation}
                className="h-full"
              />
            </motion.div>
          ) : (
            <motion.div
              key="main-content"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full overflow-y-auto"
            >
              {children ? (
                children
              ) : (
                <LeftPaneContent
                  flow={navigation.currentFlow}
                  stage={navigation.currentStage}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Mobile Navigation Toggle */}
      {isMobileView && !showNavigationMenu && (
        <div className="border-t border-gray-200 p-3">
          <button
            onClick={handleNavigationMenuToggle}
            className={cn(
              'w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg',
              'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700',
              'text-gray-700 dark:text-gray-200 transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-heybo-primary focus:ring-opacity-50'
            )}
          >
            <PanelLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Menu</span>
          </button>
        </div>
      )}
    </div>
  );

  // Right Pane Content with Preview
  const rightPaneContent = (
    <div className="flex flex-col h-full">
      {/* Right Pane Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Preview
        </h3>
        
        {/* Right pane controls */}
        <div className="flex items-center space-x-2">
          {!isMobileView && (
            <button
              onClick={() => setRightPaneCollapsed(!rightPaneCollapsed)}
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg',
                'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-heybo-primary focus:ring-opacity-50'
              )}
              aria-label={rightPaneCollapsed ? "Expand preview" : "Collapse preview"}
              title={rightPaneCollapsed ? "Expand preview" : "Collapse preview"}
            >
              {rightPaneCollapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
      
      {/* Right Pane Content */}
      <div className="flex-1 overflow-y-auto">
        <RightPaneContent
          flow={navigation.currentFlow}
          stage={navigation.currentStage}
        />
      </div>
    </div>
  );

  // Additional controls overlay
  const controlsOverlay = (
    <div className="absolute top-4 left-4 z-20">
      <div className="flex items-center space-x-2">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg',
              'bg-white/90 backdrop-blur-sm border border-gray-200',
              'text-gray-600 hover:text-gray-800',
              'hover:bg-white transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-heybo-primary focus:ring-opacity-50'
            )}
            aria-label="Close widget"
            title="Close widget"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {/* Pane toggle buttons for desktop */}
        {!isMobileView && (
          <>
            <button
              onClick={() => setLeftPaneCollapsed(!leftPaneCollapsed)}
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg',
                'bg-white/90 backdrop-blur-sm border border-gray-200',
                'text-gray-600 hover:text-gray-800',
                'hover:bg-white transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-heybo-primary focus:ring-opacity-50'
              )}
              aria-label={leftPaneCollapsed ? "Show main content" : "Hide main content"}
              title={leftPaneCollapsed ? "Show main content" : "Hide main content"}
            >
              {leftPaneCollapsed ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => setRightPaneCollapsed(!rightPaneCollapsed)}
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg',
                'bg-white/90 backdrop-blur-sm border border-gray-200',
                'text-gray-600 hover:text-gray-800',
                'hover:bg-white transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-heybo-primary focus:ring-opacity-50'
              )}
              aria-label={rightPaneCollapsed ? "Show preview" : "Hide preview"}
              title={rightPaneCollapsed ? "Show preview" : "Hide preview"}
            >
              {rightPaneCollapsed ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className={cn('heybo-chatbot-two-pane-integrated relative w-full h-full', className)}>
      <TwoPaneLayout
        leftPaneContent={leftPaneContent}
        rightPaneContent={rightPaneContent}
        className={cn(
          'heybo-two-pane-layout-integrated h-full',
          className
        )}
        onPaneToggle={(pane, collapsed) => {
          if (pane === 'left') {
            setLeftPaneCollapsed(collapsed);
          } else {
            setRightPaneCollapsed(collapsed);
          }
        }}
        onPaneFocus={(pane) => {
          // Handle pane focus if needed
        }}
      />
      
      {/* Controls overlay */}
      {controlsOverlay}
      
      {/* Mobile navigation menu overlay */}
      {isMobileView && showNavigationMenu && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 z-30"
          onClick={() => setShowNavigationMenu(false)}
        >
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Navigation
              </h2>
              <button
                onClick={() => setShowNavigationMenu(false)}
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg',
                  'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-heybo-primary focus:ring-opacity-50'
                )}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavigationMenu
                onNavigate={handleNavigation}
                className="h-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// Export convenience hook for using with the integrated layout
export function useIntegratedLayout() {
  const layoutManager = useLayoutManager();
  const { navigation } = useLayoutStore();
  const { currentStep } = useChatbotStore();

  return {
    ...layoutManager,
    navigation,
    currentStep,
    isNavigationReady: navigation.currentFlow && navigation.currentStage
  };
} 