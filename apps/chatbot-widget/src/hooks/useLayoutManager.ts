// HeyBo Layout Manager Hook
import { useState, useEffect, useCallback } from 'react';
import type { 
  LayoutState, 
  NavigationState, 
  ResponsiveBreakpoint, 
  LayoutMode,
  PaneType,
  NavigationHistoryItem 
} from '../types/layout';
import { 
  getCurrentLayoutConfig, 
  shouldUseDualPane,
  getResponsiveClasses,
  BREAKPOINTS
} from '../lib/config/layout-config';

// Helper function to get current breakpoint
function getCurrentBreakpoint(width: number): ResponsiveBreakpoint {
  const breakpoints = Object.entries(BREAKPOINTS)
    .sort(([, a], [, b]) => b - a); // Sort descending
  
  for (const [breakpoint, breakpointWidth] of breakpoints) {
    if (width >= breakpointWidth) {
      return breakpoint as ResponsiveBreakpoint;
    }
  }
  
  return 'sm';
}

// Helper function to get layout mode
function getLayoutMode(width: number): LayoutMode {
  if (width >= BREAKPOINTS.lg) {
    return 'dual-pane';
  } else if (width >= BREAKPOINTS.md) {
    return 'single-pane';
  } else {
    return 'mobile-stack';
  }
}

export function useLayoutManager() {
  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );

  const [layoutState, setLayoutState] = useState<LayoutState>({
    currentBreakpoint: getCurrentBreakpoint(screenWidth),
    currentMode: getLayoutMode(screenWidth),
    leftPaneCollapsed: false,
    rightPaneCollapsed: false,
    focusedPane: null
  });

  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentFlow: 'bowl-building',
    currentStage: 'welcome',
    previousStage: null,
    canNavigateBack: false,
    navigationHistory: []
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setScreenWidth(newWidth);
      
      const newBreakpoint = getCurrentBreakpoint(newWidth);
      const newMode = getLayoutMode(newWidth);
      
      setLayoutState(prev => ({
        ...prev,
        currentBreakpoint: newBreakpoint,
        currentMode: newMode,
        // Auto-collapse right pane on smaller screens
        rightPaneCollapsed: newMode === 'single-pane' || prev.rightPaneCollapsed,
        // Reset focused pane if switching to single pane
        focusedPane: newMode === 'single-pane' ? null : prev.focusedPane
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Layout state management functions
  const toggleLeftPane = useCallback(() => {
    setLayoutState(prev => ({
      ...prev,
      leftPaneCollapsed: !prev.leftPaneCollapsed
    }));
  }, []);

  const toggleRightPane = useCallback(() => {
    setLayoutState(prev => ({
      ...prev,
      rightPaneCollapsed: !prev.rightPaneCollapsed
    }));
  }, []);

  const setFocusedPane = useCallback((pane: PaneType | null) => {
    setLayoutState(prev => ({
      ...prev,
      focusedPane: pane
    }));
  }, []);

  const collapsePane = useCallback((pane: PaneType, collapsed: boolean) => {
    setLayoutState(prev => ({
      ...prev,
      [`${pane}PaneCollapsed`]: collapsed
    }));
  }, []);

  // Navigation state management functions
  const navigateToStage = useCallback((
    stage: string, 
    flow: NavigationState['currentFlow'] = navigationState.currentFlow
  ) => {
    const historyItem: NavigationHistoryItem = {
      stage: navigationState.currentStage,
      flow: navigationState.currentFlow,
      timestamp: new Date(),
      paneState: {
        leftContent: 'interactive', // This would be dynamic based on current content
        rightContent: 'preview'     // This would be dynamic based on current content
      }
    };

    setNavigationState(prev => ({
      ...prev,
      previousStage: prev.currentStage,
      currentStage: stage,
      currentFlow: flow,
      canNavigateBack: true,
      navigationHistory: [...prev.navigationHistory, historyItem]
    }));
  }, [navigationState.currentFlow, navigationState.currentStage]);

  const navigateBack = useCallback(() => {
    if (!navigationState.canNavigateBack || navigationState.navigationHistory.length === 0) {
      return;
    }

    const previousItem = navigationState.navigationHistory[navigationState.navigationHistory.length - 1];
    
    if (!previousItem) {
      return;
    }
    
    setNavigationState(prev => ({
      ...prev,
      currentStage: previousItem.stage,
      currentFlow: previousItem.flow as NavigationState['currentFlow'],
      previousStage: prev.currentStage,
      navigationHistory: prev.navigationHistory.slice(0, -1),
      canNavigateBack: prev.navigationHistory.length > 1
    }));
  }, [navigationState.canNavigateBack, navigationState.navigationHistory]);

  const resetNavigation = useCallback(() => {
    setNavigationState({
      currentFlow: 'bowl-building',
      currentStage: 'welcome',
      previousStage: null,
      canNavigateBack: false,
      navigationHistory: []
    });
  }, []);

  // Computed values
  const isDualPane = shouldUseDualPane(screenWidth);
  const layoutConfig = getCurrentLayoutConfig(screenWidth);
  const responsiveClasses = getResponsiveClasses(screenWidth);
  
  const isLeftPaneVisible = !layoutState.leftPaneCollapsed;
  const isRightPaneVisible = isDualPane && !layoutState.rightPaneCollapsed;
  const isMobileView = layoutState.currentMode === 'mobile-stack';
  const isSinglePane = layoutState.currentMode === 'single-pane';

  return {
    // Layout state
    layoutState,
    navigationState,
    screenWidth,
    
    // Computed layout properties
    isDualPane,
    isMobileView,
    isSinglePane,
    isLeftPaneVisible,
    isRightPaneVisible,
    layoutConfig,
    responsiveClasses,
    currentBreakpoint: layoutState.currentBreakpoint,
    dimensions: layoutConfig,
    leftPaneCollapsed: layoutState.leftPaneCollapsed,
    rightPaneCollapsed: layoutState.rightPaneCollapsed,
    
    // Layout controls
    toggleLeftPane,
    toggleRightPane,
    setFocusedPane,
    collapsePane,
    setLeftPaneCollapsed: (collapsed: boolean) => collapsePane('left', collapsed),
    setRightPaneCollapsed: (collapsed: boolean) => collapsePane('right', collapsed),
    
    // Navigation controls
    navigateToStage,
    navigateBack,
    resetNavigation,
    
    // Helper functions
    getCurrentBreakpoint: () => getCurrentBreakpoint(screenWidth),
    getLayoutMode: () => getLayoutMode(screenWidth),
    shouldUseDualPane: () => shouldUseDualPane(screenWidth)
  };
} 