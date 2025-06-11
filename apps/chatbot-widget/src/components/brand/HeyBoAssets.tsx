import React from 'react';
import { cn } from '../../lib/utils';

// Centralized HeyBo brand asset URLs
export const HEYBO_ASSETS = {
  logos: {
    website: 'https://heybo.sg/wp-content/uploads/2023/06/Heybo-logo.png',
    header: 'https://d1cz3dbw9lrv6.cloudfront.net/static/media/logo-header.995a0bcfebba1f72f6d587fb23d63ec8.svg',
  },
  favicon: 'https://d1cz3dbw9lrv6.cloudfront.net/favicon.png',
} as const;

interface HeyBoLogoProps {
  variant?: 'website' | 'header';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  alt?: string;
}

/**
 * Reusable HeyBo Logo Component
 * Handles different logo variants, sizes, and themes consistently
 */
export function HeyBoLogo({ 
  variant = 'website',
  size = 'md',
  theme = 'auto',
  className,
  alt = 'HeyBo'
}: HeyBoLogoProps) {
  const sizeClasses = {
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8',
    xl: 'h-12'
  };

  const getFilterStyle = () => {
    switch (theme) {
      case 'dark':
        return { filter: 'brightness(0) invert(1)' };
      case 'light':
        return { filter: 'none' };
      case 'auto':
      default:
        return {};
    }
  };

  return (
    <img
      src={HEYBO_ASSETS.logos[variant]}
      alt={alt}
      className={cn('heybo-chatbot-assets', sizeClasses[size], 'w-auto', className)}
      style={getFilterStyle()}
    />
  );
}

interface HeyBoIconProps {
  size?: number | string;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  alt?: string;
}

/**
 * HeyBo Icon Component - Optimized for small sizes (buttons, favicons)
 * Uses the header SVG which is optimized for icon usage
 */
export function HeyBoIcon({ 
  size = 24,
  theme = 'auto',
  className,
  alt = 'HeyBo'
}: HeyBoIconProps) {
  const sizeValue = typeof size === 'number' ? `${size}px` : size;

  const getFilterStyle = () => {
    switch (theme) {
      case 'dark':
        return { filter: 'brightness(0) invert(1)' };
      case 'light':
        return { filter: 'none' };
      case 'auto':
      default:
        return {};
    }
  };

  return (
    <img
      src={HEYBO_ASSETS.logos.header}
      alt={alt}
      className={cn('inline-block', className)}
      style={{ 
        width: sizeValue, 
        height: sizeValue,
        ...getFilterStyle()
      }}
    />
  );
}

interface LuluTextProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark';
  className?: string;
}

/**
 * LULU Text Component - Styled according to brand specifications
 */
export function LuluText({ 
  size = 'md',
  theme = 'dark',
  className
}: LuluTextProps) {
  const sizeStyles = {
    sm: { fontSize: '16px', lineHeight: '19px' },
    md: { fontSize: '20px', lineHeight: '24px' },
    lg: { fontSize: '24px', lineHeight: '29px' },
    xl: { fontSize: '32px', lineHeight: '38px' }
  };

  const colors = {
    light: '#572021',  // Dark color for light backgrounds
    dark: '#FFFCF8'    // Light color for dark backgrounds
  };

  return (
    <span 
      className={cn('font-semibold', className)}
      style={{
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        letterSpacing: '-0.03em',
        color: colors[theme],
        ...sizeStyles[size]
      }}
    >
      LULU
    </span>
  );
}

interface HeyBoLuluBrandProps {
  logoVariant?: 'website' | 'header';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark';
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}

/**
 * Combined HeyBo + LULU Brand Component
 * The official brand combination for the chatbot
 */
export function HeyBoLuluBrand({ 
  logoVariant = 'website',
  size = 'md',
  theme = 'dark',
  spacing = 'normal',
  className
}: HeyBoLuluBrandProps) {
  const spacingClasses = {
    tight: 'space-x-2',
    normal: 'space-x-3',
    loose: 'space-x-4'
  };

  return (
    <div className={cn('flex items-center', spacingClasses[spacing], className)}>
      <HeyBoLogo 
        variant={logoVariant}
        size={size}
        theme={theme}
      />
      <LuluText 
        size={size}
        theme={theme}
      />
    </div>
  );
}

// Convenience components for common use cases
export const HeyBoLogoSmall = (props: Omit<HeyBoLogoProps, 'size'>) => (
  <HeyBoLogo {...props} size="sm" />
);

export const HeyBoLogoMedium = (props: Omit<HeyBoLogoProps, 'size'>) => (
  <HeyBoLogo {...props} size="md" />
);

export const HeyBoLogoLarge = (props: Omit<HeyBoLogoProps, 'size'>) => (
  <HeyBoLogo {...props} size="lg" />
);

export const HeyBoIconSmall = (props: Omit<HeyBoIconProps, 'size'>) => (
  <HeyBoIcon {...props} size={16} />
);

export const HeyBoIconMedium = (props: Omit<HeyBoIconProps, 'size'>) => (
  <HeyBoIcon {...props} size={24} />
);

export const HeyBoIconLarge = (props: Omit<HeyBoIconProps, 'size'>) => (
  <HeyBoIcon {...props} size={32} />
);

export const HeyBoLuluBrandDark = (props: Omit<HeyBoLuluBrandProps, 'theme'>) => (
  <HeyBoLuluBrand {...props} theme="dark" />
);

export const HeyBoLuluBrandLight = (props: Omit<HeyBoLuluBrandProps, 'theme'>) => (
  <HeyBoLuluBrand {...props} theme="light" />
);
