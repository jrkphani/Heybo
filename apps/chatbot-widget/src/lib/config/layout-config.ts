// HeyBo Widget Layout Configuration
import type { 
  WidgetLayoutConfig, 
  ResponsiveLayoutConfig,
  ResponsiveBreakpoint 
} from '../../types/layout';

// HeyBo UX Guide breakpoint values (in pixels)
export const BREAKPOINTS: Record<ResponsiveBreakpoint, number> = {
  'sm': 640,   // SM: ≤640px - Mobile devices
  'md': 1024,  // MD: 641-1024px - Tablets & small laptops
  'lg': 1440,  // LG: 1025-1440px - Desktop monitors
  'xl': 1441,  // XL: ≥1441px - Large desktop monitors
  '2xl': 1536  // Keep for compatibility
};

// HeyBo Widget Responsive Layout Configurations - UX Guide Compliant
export const RESPONSIVE_LAYOUTS: ResponsiveLayoutConfig[] = [
  // Extra Large Screens (1536px+) - Keep for compatibility
  {
    breakpoint: '2xl',
    mode: 'dual-pane',
    leftPane: {
      width: '520px',
      height: '680px',
      maxWidth: '520px',
      maxHeight: '680px'
    },
    rightPane: {
      width: '320px',
      height: '680px',
      maxWidth: '320px',
      maxHeight: '680px'
    },
    gap: '1rem'
  },

  // Extra Large Screens (≥1441px) - Premium Experience with Enhanced Coverage
  {
    breakpoint: 'xl',
    mode: 'dual-pane',
    leftPane: {
      width: 'var(--heybo-widget-xl-width)',
      height: 'var(--heybo-widget-xl-height)',
      maxWidth: 'var(--heybo-widget-xl-width)',
      maxHeight: 'var(--heybo-widget-xl-height)'
    },
    rightPane: {
      width: '480px',
      height: 'var(--heybo-widget-xl-height)',
      maxWidth: '480px',
      maxHeight: 'var(--heybo-widget-xl-height)'
    },
    gap: '1rem'
  },

  // Large Screens (1025px - 1440px) - Optimal Dual-Pane Capable
  {
    breakpoint: 'lg',
    mode: 'dual-pane',
    leftPane: {
      width: 'var(--heybo-widget-lg-width)',
      height: 'var(--heybo-widget-lg-height)',
      maxWidth: 'var(--heybo-widget-lg-width)',
      maxHeight: 'var(--heybo-widget-lg-height)'
    },
    rightPane: {
      width: '300px',
      height: 'var(--heybo-widget-lg-height)',
      maxWidth: '300px',
      maxHeight: 'var(--heybo-widget-lg-height)'
    },
    gap: '0.75rem'
  },

  // Medium Screens (641px - 1024px) - Large Corner Widget
  {
    breakpoint: 'md',
    mode: 'single-pane',
    leftPane: {
      width: 'var(--heybo-widget-md-width)',
      height: 'var(--heybo-widget-md-height)',
      maxWidth: 'var(--heybo-widget-md-width)',
      maxHeight: 'var(--heybo-widget-md-height)'
    },
    rightPane: {
      width: '0',
      height: '0',
      maxWidth: '0',
      maxHeight: '0'
    },
    gap: '0'
  },

  // Small Screens (≤640px) - Fullscreen Mobile Widget
  {
    breakpoint: 'sm',
    mode: 'mobile-stack',
    leftPane: {
      width: 'var(--heybo-widget-sm-width)',
      height: 'var(--heybo-widget-sm-height)',
      maxWidth: 'var(--heybo-widget-sm-width)',
      maxHeight: 'var(--heybo-widget-sm-height)'
    },
    rightPane: {
      width: 'var(--heybo-widget-sm-width)',
      height: '60vh',
      maxWidth: 'var(--heybo-widget-sm-width)',
      maxHeight: '60vh'
    },
    gap: '0'
  }
];

// Complete Widget Layout Configuration
export const HEYBO_LAYOUT_CONFIG: WidgetLayoutConfig = {
  responsive: RESPONSIVE_LAYOUTS,
  panes: {
    left: {
      type: 'left',
      content: 'interactive',
      priority: 'primary',
      collapsible: false,
      defaultCollapsed: false
    },
    right: {
      type: 'right',
      content: 'preview',
      priority: 'secondary',
      collapsible: true,
      defaultCollapsed: false
    }
  },
  navigation: {
    embedded: true,
    crossPaneSync: true,
    historyEnabled: true
  }
};

// Helper function to get current layout config based on screen width
export function getCurrentLayoutConfig(screenWidth: number): ResponsiveLayoutConfig {
  let currentBreakpoint: ResponsiveBreakpoint = 'sm';

  // UX Guide breakpoint logic
  if (screenWidth >= BREAKPOINTS.xl) {
    currentBreakpoint = 'xl';  // ≥1441px - Large desktop monitors
  } else if (screenWidth >= BREAKPOINTS.lg) {
    currentBreakpoint = 'lg';  // 1025-1440px - Desktop monitors
  } else if (screenWidth >= BREAKPOINTS.md) {
    currentBreakpoint = 'md';  // 641-1024px - Tablets & small laptops
  } else {
    currentBreakpoint = 'sm';  // ≤640px - Mobile devices
  }

  const layout = RESPONSIVE_LAYOUTS.find(layout => layout.breakpoint === currentBreakpoint);

  // Fallback to small screen layout if not found
  if (!layout) {
    return RESPONSIVE_LAYOUTS.find(l => l.breakpoint === 'sm')!;
  }

  return layout;
}

// Helper function to determine if dual-pane layout should be used
export function shouldUseDualPane(screenWidth: number): boolean {
  const config = getCurrentLayoutConfig(screenWidth);
  return config.mode === 'dual-pane';
}

// Helper function to get responsive CSS classes
export function getResponsiveClasses(screenWidth: number) {
  const config = getCurrentLayoutConfig(screenWidth);
  
  const baseClasses = {
    container: 'heybo-widget-container flex',
    leftPane: 'heybo-left-pane',
    rightPane: 'heybo-right-pane',
    gap: 'gap-4'
  };

  if (config.mode === 'dual-pane') {
    return {
      ...baseClasses,
      container: `${baseClasses.container} flex-row`,
      leftPane: `${baseClasses.leftPane} flex-1`,
      rightPane: `${baseClasses.rightPane} flex-1`,
      gap: 'gap-4'
    };
  } else if (config.mode === 'mobile-stack') {
    return {
      ...baseClasses,
      container: `${baseClasses.container} flex-col`,
      leftPane: `${baseClasses.leftPane} w-full`,
      rightPane: `${baseClasses.rightPane} w-full`,
      gap: 'gap-2'
    };
  } else {
    return {
      ...baseClasses,
      container: `${baseClasses.container} flex-col`,
      leftPane: `${baseClasses.leftPane} w-full`,
      rightPane: 'hidden',
      gap: ''
    };
  }
} 