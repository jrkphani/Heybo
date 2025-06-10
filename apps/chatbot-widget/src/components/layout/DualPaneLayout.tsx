'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useLayoutStore } from '../../store/layout-store';
import { useWidgetStateStore } from '../../store/widget-state-store';
import { getCurrentLayoutConfig } from '../../lib/config/layout-config';
import '../../styles/heybo-design-tokens.css';

interface DualPaneLayoutProps {
  leftPaneContent: React.ReactNode;
  rightPaneContent: React.ReactNode;
  className?: string;
}

export function DualPaneLayout({ 
  leftPaneContent, 
  rightPaneContent, 
  className 
}: DualPaneLayoutProps) {
  const { currentBreakpoint, isDualPane } = useLayoutStore();
  const { ui, layout, setLayoutMode } = useWidgetStateStore();
  const [screenWidth, setScreenWidth] = useState(0);

  // Update screen width and layout mode based on breakpoint
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      
      const layoutConfig = getCurrentLayoutConfig(width);
      const shouldUseDualPane = layoutConfig.mode === 'dual-pane';
      
      if (shouldUseDualPane && ui.isDualPaneCapable) {
        setLayoutMode('dual-pane-active');
      } else {
        setLayoutMode('chat-only');
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [ui.isDualPaneCapable, setLayoutMode]);

  // Animation variants for pane transitions
  const paneVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const rightPaneVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  // Get current layout configuration
  const layoutConfig = getCurrentLayoutConfig(screenWidth);

  // Single pane mode for smaller screens
  if (layout.mode !== 'dual-pane-active' || !ui.isDualPaneCapable) {
    return (
      <div className={cn(
        "heybo-chatbot-single-pane",
        "flex flex-col h-full w-full",
        className
      )}>
        <motion.div
          variants={paneVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex-1 overflow-hidden"
        >
          {leftPaneContent}
        </motion.div>
      </div>
    );
  }

  // Dual pane mode for larger screens
  return (
    <div
      className={cn(
        "heybo-chatbot-dual-pane",
        "flex h-full w-full gap-4",
        className
      )}
      style={{
        height: '100%',
        width: '100%'
      }}
    >
      {/* Left Pane - Primary Chat Interface */}
      <motion.div
        variants={paneVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn(
          "heybo-chatbot-left-pane",
          "flex flex-col bg-gray-50 border-r border-gray-200",
          "overflow-hidden flex-1",
          "min-w-0" // Prevent flex item from overflowing
        )}
        style={{
          borderRadius: '20px 0 0 20px',
          flex: '2' // Takes 2/3 of the space
        }}
      >
        {/* Left Pane Header */}
        <div className="heybo-left-pane-header bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Chat</h3>
              <p className="text-xs text-gray-600">Build your perfect bowl</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
        </div>

        {/* Left Pane Content */}
        <div className="flex-1 overflow-hidden">
          {leftPaneContent}
        </div>
      </motion.div>

      {/* Right Pane - Contextual Information */}
      <AnimatePresence>
        <motion.div
          variants={rightPaneVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            "heybo-chatbot-right-pane",
            "flex flex-col bg-white",
            "overflow-hidden",
            "min-w-0" // Prevent flex item from overflowing
          )}
          style={{
            borderRadius: '0 20px 20px 0',
            flex: '1', // Takes 1/3 of the space
            minWidth: '300px' // Minimum width for usability
          }}
        >
          {/* Right Pane Header */}
          <div className="heybo-right-pane-header bg-orange-50 border-b border-orange-200 p-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-orange-800 text-sm">Bowl Preview</h3>
                <p className="text-xs text-orange-600">Real-time customization</p>
              </div>
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">🥣</span>
              </div>
            </div>
          </div>

          {/* Right Pane Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {rightPaneContent}
          </div>

          {/* Right Pane Footer - Quick Actions */}
          <div className="heybo-right-pane-footer bg-gray-50 border-t border-gray-200 p-3">
            <div className="flex gap-2">
              <button className="flex-1 bg-orange-500 text-white text-xs py-2 px-3 rounded-lg hover:bg-orange-600 transition-colors">
                Add to Cart
              </button>
              <button className="bg-white border border-gray-300 text-gray-700 text-xs py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                Save
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Cross-pane synchronization hook
export function useCrossPaneSync() {
  const { layout } = useWidgetStateStore();
  
  const syncLeftToRight = (data: any) => {
    if (layout.mode === 'dual-pane-active') {
      // Trigger right pane update with animation
      const event = new CustomEvent('heybo-cross-pane-sync', {
        detail: { source: 'left', data }
      });
      window.dispatchEvent(event);
    }
  };

  const syncRightToLeft = (data: any) => {
    if (layout.mode === 'dual-pane-active') {
      // Trigger left pane update with animation
      const event = new CustomEvent('heybo-cross-pane-sync', {
        detail: { source: 'right', data }
      });
      window.dispatchEvent(event);
    }
  };

  return { syncLeftToRight, syncRightToLeft };
}

// Visual connection animation component
export function CrossPaneConnection({ 
  fromElement, 
  toElement, 
  trigger 
}: {
  fromElement: string;
  toElement: string;
  trigger: boolean;
}) {
  const [showConnection, setShowConnection] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShowConnection(true);
      const timer = setTimeout(() => setShowConnection(false), 300);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [trigger]);

  if (!showConnection) return null;

  return (
    <motion.div
      className="absolute bg-orange-300 h-0.5 z-20 pointer-events-none"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: '100%', opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        top: '50%',
        left: 0,
        right: 0,
        borderRadius: '1px'
      }}
    />
  );
}
