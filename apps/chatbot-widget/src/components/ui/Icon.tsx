/**
 * HeyBo Icon Component
 * Following HeyBo Design System & Style Guide
 * Uses Lucide React with HeyBo-specific styling
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Icon size variants according to HeyBo Design System
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';

// Icon color variants according to HeyBo Design System
export type IconColor = 
  | 'heybo' 
  | 'ingredient' 
  | 'protein' 
  | 'healthy' 
  | 'premium' 
  | 'spicy' 
  | 'vegetarian' 
  | 'default';

interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  color?: IconColor;
  className?: string;
  strokeWidth?: number;
}

/**
 * HeyBo Icon Component
 * 
 * Features:
 * - Follows HeyBo Design System icon specifications
 * - Uses CSS variables for consistent sizing and colors
 * - Supports all HeyBo food service color variants
 * - 2px stroke width for food items (HeyBo standard)
 * - Pixel-perfect alignment with HeyBo warmth
 * 
 * @param icon - Lucide React icon component
 * @param size - Icon size variant (xs, sm, md, lg, xl, hero)
 * @param color - Icon color variant (heybo, ingredient, protein, etc.)
 * @param className - Additional CSS classes
 * @param strokeWidth - Icon stroke width (default: 2 for food items)
 */
export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = 'md',
  color = 'default',
  className,
  strokeWidth = 2,
}) => {
  return (
    <IconComponent
      className={cn(
        // Base icon classes with HeyBo namespace
        'heybo-chatbot-icon',
        // Size classes
        `heybo-icon-${size}`,
        // Color classes
        `heybo-icon-${color}`,
        // Custom classes
        className
      )}
      strokeWidth={strokeWidth}
      style={{
        // Ensure proper inheritance and CSS variable usage
        color: 'inherit',
      }}
    />
  );
};

// Common HeyBo food service icons with proper typing
export const HeyBoIcons = {
  // Food categories
  bowl: 'Bowl',
  grain: 'Wheat',
  protein: 'Beef',
  vegetable: 'Carrot',
  sauce: 'Droplets',
  garnish: 'Leaf',
  
  // UI icons
  plus: 'Plus',
  minus: 'Minus',
  check: 'Check',
  x: 'X',
  heart: 'Heart',
  star: 'Star',
  
  // Navigation
  chevronLeft: 'ChevronLeft',
  chevronRight: 'ChevronRight',
  chevronUp: 'ChevronUp',
  chevronDown: 'ChevronDown',
  
  // Actions
  edit: 'Edit',
  trash: 'Trash2',
  share: 'Share',
  download: 'Download',
  
  // Status
  loading: 'Loader2',
  success: 'CheckCircle',
  warning: 'AlertTriangle',
  error: 'XCircle',
  info: 'Info',
  
  // Food properties
  spicy: 'Flame',
  vegetarian: 'Leaf',
  vegan: 'Sprout',
  glutenFree: 'ShieldCheck',
  healthy: 'Heart',
  premium: 'Crown',
  
  // Temperature
  hot: 'Thermometer',
  warm: 'Sun',
  cold: 'Snowflake',
  
  // Location & delivery
  location: 'MapPin',
  delivery: 'Truck',
  pickup: 'Store',
  
  // Chat & communication
  message: 'MessageCircle',
  send: 'Send',
  mic: 'Mic',
  
  // User & account
  user: 'User',
  users: 'Users',
  profile: 'UserCircle',
  
  // Shopping & cart
  cart: 'ShoppingCart',
  bag: 'ShoppingBag',
  credit: 'CreditCard',
  
  // Time & scheduling
  clock: 'Clock',
  calendar: 'Calendar',
  
  // Settings & preferences
  settings: 'Settings',
  filter: 'Filter',
  sort: 'ArrowUpDown',
} as const;

export default Icon;
