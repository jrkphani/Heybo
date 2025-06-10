// HeyBo 2-Page Layout System Types
export type ResponsiveBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type LayoutMode = 'single-pane' | 'dual-pane' | 'mobile-stack';

export type PaneType = 'left' | 'right';

export interface LayoutDimensions {
  width: string;
  height: string;
  maxWidth?: string;
  maxHeight?: string;
}

export interface ResponsiveLayoutConfig {
  breakpoint: ResponsiveBreakpoint;
  mode: LayoutMode;
  leftPane: LayoutDimensions;
  rightPane: LayoutDimensions;
  gap: string;
}

export interface PaneConfig {
  type: PaneType;
  content: 'interactive' | 'preview' | 'summary' | 'navigation';
  priority: 'primary' | 'secondary';
  collapsible: boolean;
  defaultCollapsed?: boolean;
}

export interface LayoutState {
  currentBreakpoint: ResponsiveBreakpoint;
  currentMode: LayoutMode;
  leftPaneCollapsed: boolean;
  rightPaneCollapsed: boolean;
  focusedPane: PaneType | null;
}

export interface NavigationState {
  currentFlow: 'bowl-building' | 'cart-management' | 'order-review' | 'favorites';
  currentStage: string;
  previousStage: string | null;
  canNavigateBack: boolean;
  navigationHistory: NavigationHistoryItem[];
}

export interface NavigationHistoryItem {
  stage: string;
  flow: string;
  timestamp: Date;
  paneState: {
    leftContent: string;
    rightContent: string;
  };
}

export interface ControlPlacement {
  pane: PaneType;
  section: 'header' | 'main' | 'footer';
  priority: 'primary' | 'secondary' | 'tertiary';
  responsive: {
    [key in ResponsiveBreakpoint]?: {
      visible: boolean;
      placement?: PaneType;
      section?: 'header' | 'main' | 'footer';
    };
  };
}

export interface WidgetLayoutConfig {
  responsive: ResponsiveLayoutConfig[];
  panes: {
    left: PaneConfig;
    right: PaneConfig;
  };
  navigation: {
    embedded: boolean;
    crossPaneSync: boolean;
    historyEnabled: boolean;
  };
} 