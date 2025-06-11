import React from 'react';
import { cn } from '../../lib/utils';

interface HeyBoLuluLogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Combined HeyBo + LULU Logo Component
 * Shows the HeyBo logo alongside the LULU text as specified in the design
 */
export function HeyBoLuluLogo({ 
  className, 
  variant = 'dark',
  size = 'md'
}: HeyBoLuluLogoProps) {
  
  const sizeClasses = {
    sm: 'h-4',
    md: 'h-6', 
    lg: 'h-8'
  };

  const textSizes = {
    sm: { fontSize: '16px', lineHeight: '19px' },
    md: { fontSize: '20px', lineHeight: '24px' },
    lg: { fontSize: '24px', lineHeight: '29px' }
  };

  const colors = {
    dark: '#FFFCF8',  // Light color for dark backgrounds
    light: '#572021'  // Dark color for light backgrounds
  };

  return (
    <div className={cn("heybo-chatbot-logo flex items-center space-x-3", className)}>
      {/* HeyBo Logo */}
      <div className="flex items-center">
        <img
          src="https://heybo.sg/wp-content/uploads/2023/06/Heybo-logo.png"
          alt="HeyBo"
          className={sizeClasses[size]}
          style={{
            width: 'auto',
            filter: variant === 'dark' ? 'brightness(0) invert(1)' : 'none'
          }}
        />
      </div>
      
      {/* LULU Text */}
      <div 
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          ...textSizes[size],
          letterSpacing: '-0.03em',
          color: colors[variant]
        }}
      >
        LULU
      </div>
    </div>
  );
}

// Convenience components for common use cases
export const HeyBoLuluLogoDark = (props: Omit<HeyBoLuluLogoProps, 'variant'>) => (
  <HeyBoLuluLogo {...props} variant="dark" />
);

export const HeyBoLuluLogoLight = (props: Omit<HeyBoLuluLogoProps, 'variant'>) => (
  <HeyBoLuluLogo {...props} variant="light" />
);

export const HeyBoLuluLogoSmall = (props: Omit<HeyBoLuluLogoProps, 'size'>) => (
  <HeyBoLuluLogo {...props} size="sm" />
);

export const HeyBoLuluLogoLarge = (props: Omit<HeyBoLuluLogoProps, 'size'>) => (
  <HeyBoLuluLogo {...props} size="lg" />
);
