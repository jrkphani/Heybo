/**
 * HeyBo Chatbot Widget Dimensions Utility
 * Provides tokenized widget dimensions using CSS variables
 */

import { widgetDimensions } from '@heybo/design-tokens';

export interface WidgetDimensions {
  width: string;
  height: string;
  borderRadius: string;
}

/**
 * Get CSS variable value from the document
 */
function getCSSVariable(variableName: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
  
  return value || fallback;
}

/**
 * Get responsive widget dimensions using tokenized design system
 * Falls back to design tokens if CSS variables are not available
 */
export function getResponsiveWidgetDimensions(): WidgetDimensions {
  if (typeof window === 'undefined') {
    // SSR fallback - use XL dimensions
    return {
      width: widgetDimensions.xl.width,
      height: widgetDimensions.xl.height,
      borderRadius: widgetDimensions.xl.radius,
    };
  }

  const width = window.innerWidth;

  // Use tokenized design system values
  if (width <= 640) {
    // SM: ≤640px - Fullscreen Mobile Widget
    return {
      width: getCSSVariable('--heybo-widget-sm-width', widgetDimensions.sm.width),
      height: getCSSVariable('--heybo-widget-sm-height', widgetDimensions.sm.height),
      borderRadius: getCSSVariable('--heybo-widget-sm-radius', widgetDimensions.sm.radius),
    };
  } else if (width <= 1024) {
    // MD: 641px - 1024px - Large Corner Widget
    return {
      width: getCSSVariable('--heybo-widget-md-width', widgetDimensions.md.width),
      height: getCSSVariable('--heybo-widget-md-height', widgetDimensions.md.height),
      borderRadius: getCSSVariable('--heybo-widget-md-radius', widgetDimensions.md.radius),
    };
  } else if (width <= 1440) {
    // LG: 1025px - 1440px - Optimal Dual-Pane Capable
    return {
      width: getCSSVariable('--heybo-widget-lg-width', widgetDimensions.lg.width),
      height: getCSSVariable('--heybo-widget-lg-height', widgetDimensions.lg.height),
      borderRadius: getCSSVariable('--heybo-widget-lg-radius', widgetDimensions.lg.radius),
    };
  } else {
    // XL: 1441px+ - Premium Experience with Enhanced Coverage
    return {
      width: getCSSVariable('--heybo-widget-xl-width', widgetDimensions.xl.width),
      height: getCSSVariable('--heybo-widget-xl-height', widgetDimensions.xl.height),
      borderRadius: getCSSVariable('--heybo-widget-xl-radius', widgetDimensions.xl.radius),
    };
  }
}

/**
 * Get current breakpoint based on screen width
 */
export function getCurrentBreakpoint(): 'sm' | 'md' | 'lg' | 'xl' {
  if (typeof window === 'undefined') return 'xl';
  
  const width = window.innerWidth;
  
  if (width <= 640) return 'sm';
  if (width <= 1024) return 'md';
  if (width <= 1440) return 'lg';
  return 'xl';
}

/**
 * Check if current breakpoint supports dual-pane layout
 */
export function isDualPaneCapable(): boolean {
  const breakpoint = getCurrentBreakpoint();
  return breakpoint === 'lg' || breakpoint === 'xl';
}

/**
 * Get widget positioning margins for current breakpoint
 */
export function getWidgetMargins(): { bottom: string; right: string } {
  const breakpoint = getCurrentBreakpoint();
  
  const marginMap = {
    sm: getCSSVariable('--heybo-widget-sm-margin', widgetDimensions.sm.margin),
    md: getCSSVariable('--heybo-widget-md-margin', widgetDimensions.md.margin),
    lg: getCSSVariable('--heybo-widget-lg-margin', widgetDimensions.lg.margin),
    xl: getCSSVariable('--heybo-widget-xl-margin', widgetDimensions.xl.margin),
  };
  
  const margin = marginMap[breakpoint];
  
  return {
    bottom: margin,
    right: margin,
  };
}
