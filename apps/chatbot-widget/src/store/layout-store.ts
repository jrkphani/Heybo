// HeyBo Layout State Management Store
// @ts-nocheck
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
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

interface LayoutStore extends LayoutState {
  // Navigation state
  navigation: NavigationState;
  
  // Layout computed values
  screenWidth: number;
  isDualPane: boolean;
  isMobileView: boolean;
  isSinglePane: boolean;
  layoutConfig: ReturnType<typeof getCurrentLayoutConfig>;
  responsiveClasses: ReturnType<typeof getResponsiveClasses>;
  
  // Layout actions
  setScreenWidth: (width: number) => void;
  toggleLeftPane: () => void;
  toggleRightPane: () => void;
  setFocusedPane: (pane: PaneType | null) => void;
  collapsePane: (pane: PaneType, collapsed: boolean) => void;
  resetLayout: () => void;
  
  // Navigation actions
  navigateToStage: (stage: string, flow?: NavigationState['currentFlow']) => void;
  navigateBack: () => void;
  resetNavigation: () => void;
  setCurrentFlow: (flow: NavigationState['currentFlow']) => void;
  
  // Utility actions
  updateLayoutForBreakpoint: (breakpoint: ResponsiveBreakpoint) => void;
  optimizeForContent: (leftContent: string, rightContent: string) => void;
  syncWithChatbotStep: (step: string) => void;
}

// Helper function to get current breakpoint from width
function getCurrentBreakpoint(width: number): ResponsiveBreakpoint {
  const breakpoints = Object.entries(BREAKPOINTS)
    .sort(([, a], [, b]) => b - a);
  
  for (const [breakpoint, breakpointWidth] of breakpoints) {
    if (width >= breakpointWidth) {
      return breakpoint as ResponsiveBreakpoint;
    }
  }
  
  return 'sm';
}

// Helper function to get layout mode from width
function getLayoutMode(width: number): LayoutMode {
  if (width >= BREAKPOINTS.lg) {
    return 'dual-pane';
  } else if (width >= BREAKPOINTS.md) {
    return 'single-pane';
  } else {
    return 'mobile-stack';
  }
}

// Initial layout state
const getInitialState = () => {
  const initialWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const initialBreakpoint = getCurrentBreakpoint(initialWidth);
  const initialMode = getLayoutMode(initialWidth);
  
  return {
    // Layout state
    currentBreakpoint: initialBreakpoint,
    currentMode: initialMode,
    leftPaneCollapsed: false,
    rightPaneCollapsed: initialMode === 'single-pane',
    focusedPane: null as PaneType | null,
    
    // Navigation state
    navigation: {
      currentFlow: 'bowl-building' as NavigationState['currentFlow'],
      currentStage: 'welcome',
      previousStage: null as string | null,
      canNavigateBack: false,
      navigationHistory: [] as NavigationHistoryItem[]
    },
    
    // Computed values
    screenWidth: initialWidth,
    isDualPane: shouldUseDualPane(initialWidth),
    isMobileView: initialMode === 'mobile-stack',
    isSinglePane: initialMode === 'single-pane',
    layoutConfig: getCurrentLayoutConfig(initialWidth),
    responsiveClasses: getResponsiveClasses(initialWidth)
  };
};

export const useLayoutStore = create<LayoutStore>()(
  devtools(
    (set, get) => ({
      ...getInitialState(),
      
      // Layout actions
      setScreenWidth: (width: number) => {
        const newBreakpoint = getCurrentBreakpoint(width);
        const newMode = getLayoutMode(width);
        const newIsDualPane = shouldUseDualPane(width);
        const newLayoutConfig = getCurrentLayoutConfig(width);
        const newResponsiveClasses = getResponsiveClasses(width);
        
        set(
          (state) => ({
            screenWidth: width,
            currentBreakpoint: newBreakpoint,
            currentMode: newMode,
            isDualPane: newIsDualPane,
            isMobileView: newMode === 'mobile-stack',
            isSinglePane: newMode === 'single-pane',
            layoutConfig: newLayoutConfig,
            responsiveClasses: newResponsiveClasses,
            // Auto-collapse right pane on smaller screens
            rightPaneCollapsed: newMode === 'single-pane' || state.rightPaneCollapsed,
            // Reset focused pane if switching to single pane
            focusedPane: newMode === 'single-pane' ? null : state.focusedPane
          }),
          false,
          'setScreenWidth'
        );
      },
      
      toggleLeftPane: () => {
        set(
          (state) => ({
            leftPaneCollapsed: !state.leftPaneCollapsed
          }),
          false,
          'toggleLeftPane'
        );
      },
      
      toggleRightPane: () => {
        set(
          (state) => ({
            rightPaneCollapsed: !state.rightPaneCollapsed
          }),
          false,
          'toggleRightPane'
        );
      },
      
      setFocusedPane: (pane: PaneType | null) => {
        set(
          { focusedPane: pane },
          false,
          'setFocusedPane'
        );
      },
      
      collapsePane: (pane: PaneType, collapsed: boolean) => {
        set(
          () => ({
            [`${pane}PaneCollapsed`]: collapsed
          }),
          false,
          'collapsePane'
        );
      },
      
      resetLayout: () => {
        const { screenWidth } = get();
        const initialState = getInitialState();
        
        set(
          {
            ...initialState,
            screenWidth // Preserve current screen width
          },
          false,
          'resetLayout'
        );
      },
      
      // Navigation actions
      navigateToStage: (stage: string, flow?: NavigationState['currentFlow']) => {
        const { navigation } = get();
        const newFlow = flow || navigation.currentFlow;
        
        const historyItem: NavigationHistoryItem = {
          stage: navigation.currentStage,
          flow: navigation.currentFlow,
          timestamp: new Date(),
          paneState: {
            leftContent: 'interactive', // This would be dynamic
            rightContent: 'preview'     // This would be dynamic
          }
        };
        
        set(
          (state) => ({
            navigation: {
              ...state.navigation,
              previousStage: state.navigation.currentStage,
              currentStage: stage,
              currentFlow: newFlow,
              canNavigateBack: true,
              navigationHistory: [...state.navigation.navigationHistory, historyItem]
            }
          }),
          false,
          'navigateToStage'
        );
      },
      
      navigateBack: () => {
        const { navigation } = get();
        
        if (!navigation.canNavigateBack || navigation.navigationHistory.length === 0) {
          return;
        }
        
        const previousItem = navigation.navigationHistory[navigation.navigationHistory.length - 1];
        
        if (!previousItem) {
          return;
        }
        
        set(
          (state) => ({
            navigation: {
              ...state.navigation,
              currentStage: previousItem.stage,
              currentFlow: previousItem.flow as NavigationState['currentFlow'],
              previousStage: state.navigation.currentStage,
              navigationHistory: state.navigation.navigationHistory.slice(0, -1),
              canNavigateBack: state.navigation.navigationHistory.length > 1
            }
          }),
          false,
          'navigateBack'
        );
      },
      
      resetNavigation: () => {
        set(
          (state) => ({
            navigation: {
              currentFlow: 'bowl-building',
              currentStage: 'welcome',
              previousStage: null,
              canNavigateBack: false,
              navigationHistory: []
            }
          }),
          false,
          'resetNavigation'
        );
      },
      
             setCurrentFlow: (flow: NavigationState['currentFlow']) => {
         set(
           (state: LayoutStore) => ({
             navigation: {
               ...state.navigation,
               currentFlow: flow
             }
           }),
           false,
           'setCurrentFlow'
         );
       },
      
      // Utility actions
      updateLayoutForBreakpoint: (breakpoint: ResponsiveBreakpoint) => {
        const width = BREAKPOINTS[breakpoint];
        get().setScreenWidth(width);
      },
      
      optimizeForContent: (leftContent: string, rightContent: string) => {
        const { isDualPane, isMobileView } = get();
        
        // Auto-optimize layout based on content types
        if (!isDualPane) return;
        
        // If right content is empty, collapse right pane
        if (!rightContent.trim()) {
          set(
            { rightPaneCollapsed: true },
            false,
            'optimizeForContent'
          );
          return;
        }
        
        // If left content is minimal, focus on right pane
        if (leftContent.length < 100 && rightContent.length > 300) {
          set(
            { 
              focusedPane: 'right',
              rightPaneCollapsed: false 
            },
            false,
            'optimizeForContent'
          );
          return;
        }
        
        // Default: ensure both panes are visible
        set(
          { 
            leftPaneCollapsed: false,
            rightPaneCollapsed: false 
          },
          false,
          'optimizeForContent'
        );
      },
      
      syncWithChatbotStep: (step: string) => {
        // Map chatbot steps to appropriate navigation stages
        const stageMapping: Record<string, { stage: string; flow: NavigationState['currentFlow'] }> = {
          'welcome': { stage: 'welcome', flow: 'bowl-building' },
          'signature-bowls': { stage: 'selection', flow: 'bowl-building' },
          'create-your-own': { stage: 'customization', flow: 'bowl-building' },
          'bowl-building': { stage: 'building', flow: 'bowl-building' },
          'cart-review': { stage: 'review', flow: 'cart-management' },
          'order-confirmation': { stage: 'confirmation', flow: 'order-review' },
          'favorites': { stage: 'selection', flow: 'favorites' }
        };
        
        const mapping = stageMapping[step];
        if (mapping) {
          get().navigateToStage(mapping.stage, mapping.flow);
        }
      }
    }),
    {
      name: 'heybo-layout-store',
      partialize: (state) => ({
        // Only persist layout preferences, not dynamic state
        leftPaneCollapsed: state.leftPaneCollapsed,
        rightPaneCollapsed: state.rightPaneCollapsed,
        focusedPane: state.focusedPane
      })
    }
  )
); 