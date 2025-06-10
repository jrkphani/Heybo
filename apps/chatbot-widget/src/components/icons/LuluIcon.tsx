import React from 'react';
import { cn } from '../../lib/utils';

interface LuluIconProps {
  className?: string;
  size?: number | string;
  variant?: 'default' | 'gradient' | 'outline' | 'solid' | 'logo' | 'logo-contrast';
}

/**
 * LULU Icon - The "O" from HeyBo logo designed as the chatbot assistant icon
 * Represents the warm, circular, bowl-like nature of HeyBo's brand
 */
export function LuluIcon({ 
  className, 
  size = 24, 
  variant = 'default' 
}: LuluIconProps) {
  const sizeValue = typeof size === 'number' ? `${size}px` : size;
  
  const baseClasses = "inline-block";

  // Different visual variants for different contexts
  const variantStyles = {
    default: "text-orange-500",
    gradient: "",
    outline: "text-orange-600",
    solid: "text-orange-600",
    logo: "",
    "logo-contrast": ""
  };

  // Combined HeyBo + LULU Logo (for dark backgrounds)
  if (variant === 'logo') {
    return (
      <div
        className={cn(baseClasses, className)}
        style={{ width: sizeValue, height: sizeValue }}
      >
        <div className="flex items-center space-x-3">
          {/* HeyBo Logo */}
          <div className="flex items-center">
            <svg
              viewBox="0 0 102 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-auto"
            >
              <rect width="102" height="25" fill="#FFFCF8"/>
            </svg>
          </div>

          {/* LULU Text */}
          <div
            className="text-[#FFFCF8]"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '24px',
              lineHeight: '29px',
              letterSpacing: '-0.03em'
            }}
          >
            LULU
          </div>
        </div>
      </div>
    );
  }

  // Combined HeyBo + LULU Logo (for light backgrounds)
  if (variant === 'logo-contrast') {
    return (
      <div
        className={cn(baseClasses, className)}
        style={{ width: sizeValue, height: sizeValue }}
      >
        <div className="flex items-center space-x-3">
          {/* HeyBo Logo */}
          <div className="flex items-center">
            <svg
              viewBox="0 0 102 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-auto"
            >
              <rect width="102" height="25" fill="#572021"/>
            </svg>
          </div>

          {/* LULU Text */}
          <div
            className="text-[#572021]"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '24px',
              lineHeight: '29px',
              letterSpacing: '-0.03em'
            }}
          >
            LULU
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div 
        className={cn(baseClasses, className)}
        style={{ width: sizeValue, height: sizeValue }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="luluGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="50%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="luluInnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="100%" stopColor="#FDBA74" />
            </linearGradient>
          </defs>
          
          {/* Outer circle - main bowl shape */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="url(#luluGradient)"
            stroke="#EA580C"
            strokeWidth="2"
          />
          
          {/* Inner circle - bowl interior */}
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="url(#luluInnerGradient)"
            opacity="0.8"
          />
          
          {/* Center dot - representing the grain/ingredient */}
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="#A16B47"
            opacity="0.9"
          />
          
          {/* Subtle highlight for depth */}
          <ellipse
            cx="42"
            cy="42"
            rx="12"
            ry="8"
            fill="#FFF7ED"
            opacity="0.6"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'outline') {
    return (
      <div 
        className={cn(baseClasses, variantStyles.outline, className)}
        style={{ width: sizeValue, height: sizeValue }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer circle outline */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          
          {/* Inner circle outline */}
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.6"
          />
          
          {/* Center dot */}
          <circle
            cx="50"
            cy="50"
            r="6"
            fill="currentColor"
            opacity="0.8"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'solid') {
    return (
      <div 
        className={cn(baseClasses, variantStyles.solid, className)}
        style={{ width: sizeValue, height: sizeValue }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Solid circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="currentColor"
          />
          
          {/* Inner highlight */}
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="#FFF7ED"
            opacity="0.3"
          />
        </svg>
      </div>
    );
  }

  // Default variant
  return (
    <div 
      className={cn(baseClasses, variantStyles.default, className)}
      style={{ width: sizeValue, height: sizeValue }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Main circle with HeyBo orange */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="currentColor"
          opacity="0.9"
        />
        
        {/* Inner circle for depth */}
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="#FED7AA"
          opacity="0.7"
        />
        
        {/* Center grain */}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill="#A16B47"
        />
        
        {/* Highlight */}
        <ellipse
          cx="42"
          cy="42"
          rx="10"
          ry="6"
          fill="#FFF7ED"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}

// Export different sized variants for common use cases
export const LuluIconSmall = (props: Omit<LuluIconProps, 'size'>) => (
  <LuluIcon {...props} size={16} />
);

export const LuluIconMedium = (props: Omit<LuluIconProps, 'size'>) => (
  <LuluIcon {...props} size={24} />
);

export const LuluIconLarge = (props: Omit<LuluIconProps, 'size'>) => (
  <LuluIcon {...props} size={32} />
);

export const LuluIconXL = (props: Omit<LuluIconProps, 'size'>) => (
  <LuluIcon {...props} size={48} />
);

export const LuluIconHero = (props: Omit<LuluIconProps, 'size'>) => (
  <LuluIcon {...props} size={64} />
);
