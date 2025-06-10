'use client';

import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Minimize2, Maximize2 } from 'lucide-react';
import { useLayoutManager } from '../../hooks/useLayoutManager';
import { cn } from '../../lib/utils';
import type { PaneType } from '../../types/layout';

interface TwoPaneLayoutProps {
  leftPaneContent: ReactNode;
  rightPaneContent: ReactNode;
  className?: string;
  onPaneToggle?: (pane: PaneType, collapsed: boolean) => void;
  onPaneFocus?: (pane: PaneType | null) => void;
}

interface PaneProps {
  children: ReactNode;
  type: PaneType;
  isVisible: boolean;
  isCollapsed: boolean;
  isFocused: boolean;
  isDualPane: boolean;
  isMobileView: boolean;
  onToggle: () => void;
  onFocus: () => void;
  className?: string;
  layoutStyle: React.CSSProperties;
}

function Pane({
  children,
  type,
  isVisible,
  isCollapsed,
  isFocused,
  isDualPane,
  isMobileView,
  onToggle,
  onFocus,
  className,
  layoutStyle
}: PaneProps) {
  const isLeft = type === 'left';
  
  const paneVariants = {
    expanded: {
      width: layoutStyle.width,
      height: layoutStyle.height,
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    collapsed: {
      width: isLeft ? '60px' : '40px',
      height: layoutStyle.height,
      opacity: 0.8,
      x: isLeft ? 0 : 20,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    hidden: {
      width: 0,
      height: 0,
      opacity: 0,
      x: isLeft ? -100 : 100,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    }
  };

  const getAnimationState = () => {
    if (!isVisible) return 'hidden';
    if (isCollapsed) return 'collapsed';
    return 'expanded';
  };

  const paneClasses = cn(
    'heybo-layout-pane relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
    'bg-white dark:bg-gray-900 shadow-lg',
    {
      'heybo-left-pane': isLeft,
      'heybo-right-pane': !isLeft,
      'ring-2 ring-heybo-primary ring-opacity-50': isFocused,
      'cursor-pointer': isCollapsed,
      'min-w-0': true, // Prevent flex item from growing beyond container
    },
    className
  );

  return (
    <motion.div
      className={paneClasses}
      style={layoutStyle}
      variants={paneVariants}
      animate={getAnimationState()}
      onClick={isCollapsed ? onToggle : onFocus}
      role="region"
      aria-label={`${isLeft ? 'Interactive' : 'Preview'} pane`}
      aria-expanded={!isCollapsed}
      tabIndex={0}
    >
      {/* Pane Header with Controls */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <div className={cn(
            'w-2 h-2 rounded-full',
            isFocused ? 'bg-heybo-primary' : 'bg-gray-400'
          )} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {isLeft ? 'Interactive' : 'Preview'}
          </span>
        </div>
        
        {/* Pane Controls */}
        <div className="flex items-center space-x-1">
          {isDualPane && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label={isCollapsed ? 'Expand pane' : 'Collapse pane'}
              title={isCollapsed ? 'Expand pane' : 'Collapse pane'}
            >
              {isCollapsed ? (
                <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              ) : (
                <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Pane Content */}
      <div className={cn(
        'h-[calc(100%-4rem)] overflow-hidden',
        {
          'opacity-0 pointer-events-none': isCollapsed,
          'opacity-100': !isCollapsed
        }
      )}>
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>

      {/* Collapsed State Preview */}
      {isCollapsed && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            {isLeft ? (
              <ChevronRight className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            ) : (
              <ChevronLeft className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Click to expand
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function TwoPaneLayout({
  leftPaneContent,
  rightPaneContent,
  className,
  onPaneToggle,
  onPaneFocus
}: TwoPaneLayoutProps) {
  const {
    layoutState,
    isDualPane,
    isMobileView,
    isSinglePane,
    isLeftPaneVisible,
    isRightPaneVisible,
    layoutConfig,
    responsiveClasses,
    toggleLeftPane,
    toggleRightPane,
    setFocusedPane
  } = useLayoutManager();

  const handlePaneToggle = (pane: PaneType) => {
    if (pane === 'left') {
      toggleLeftPane();
    } else {
      toggleRightPane();
    }
    
    onPaneToggle?.(pane, pane === 'left' ? !layoutState.leftPaneCollapsed : !layoutState.rightPaneCollapsed);
  };

  const handlePaneFocus = (pane: PaneType | null) => {
    setFocusedPane(pane);
    onPaneFocus?.(pane);
  };

  const containerClasses = cn(
    'heybo-two-pane-layout w-full h-full',
    responsiveClasses.container,
    {
      'flex-col': isMobileView || isSinglePane,
      'flex-row': isDualPane,
      'space-y-2': isMobileView,
      'space-x-4': isDualPane,
    },
    className
  );

  // Generate layout styles based on configuration
  const leftPaneStyle: React.CSSProperties = {
    width: layoutConfig.leftPane.width,
    height: layoutConfig.leftPane.height,
    maxWidth: layoutConfig.leftPane.maxWidth,
    maxHeight: layoutConfig.leftPane.maxHeight,
  };

  const rightPaneStyle: React.CSSProperties = {
    width: layoutConfig.rightPane.width,
    height: layoutConfig.rightPane.height,
    maxWidth: layoutConfig.rightPane.maxWidth,
    maxHeight: layoutConfig.rightPane.maxHeight,
  };

  return (
    <div className={containerClasses}>
      {/* Left Pane - Always visible */}
      <Pane
        type="left"
        isVisible={isLeftPaneVisible}
        isCollapsed={layoutState.leftPaneCollapsed}
        isFocused={layoutState.focusedPane === 'left'}
        isDualPane={isDualPane}
        isMobileView={isMobileView}
        onToggle={() => handlePaneToggle('left')}
        onFocus={() => handlePaneFocus('left')}
        layoutStyle={leftPaneStyle}
        className={responsiveClasses.leftPane}
      >
        {leftPaneContent}
      </Pane>

      {/* Right Pane - Conditional based on layout mode */}
      <AnimatePresence mode="wait">
        {(isDualPane || isMobileView) && (
          <Pane
            type="right"
            isVisible={isRightPaneVisible}
            isCollapsed={layoutState.rightPaneCollapsed}
            isFocused={layoutState.focusedPane === 'right'}
            isDualPane={isDualPane}
            isMobileView={isMobileView}
            onToggle={() => handlePaneToggle('right')}
            onFocus={() => handlePaneFocus('right')}
            layoutStyle={rightPaneStyle}
            className={responsiveClasses.rightPane}
          >
            {rightPaneContent}
          </Pane>
        )}
      </AnimatePresence>

      {/* Layout Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs z-50">
          <div>Breakpoint: {layoutState.currentBreakpoint}</div>
          <div>Mode: {layoutState.currentMode}</div>
          <div>Dual Pane: {isDualPane ? 'Yes' : 'No'}</div>
          <div>Mobile: {isMobileView ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
}

// CollapsibleSection component for use in ordering components
interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function CollapsibleSection({
  title,
  children,
  isOpen = true,
  onToggle,
  className
}: CollapsibleSectionProps) {
  return (
    <div className={cn('border border-gray-200 rounded-lg overflow-hidden', className)}>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-900">{title}</span>
        <ChevronRight
          className={cn(
            'w-4 h-4 text-gray-500 transition-transform',
            isOpen && 'rotate-90'
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
