'use client';

import React, { useState } from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from './input-otp';
import { cn } from '../../lib/utils';

interface HeyBoOTPInputProps {
  onComplete?: (value: string) => void;
  onValueChange?: (value: string) => void;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  description?: string;
}

/**
 * HeyBo-branded OTP Input component with design system compliance
 * Uses shadcn input-otp with HeyBo design tokens and CSS namespacing
 */
export function HeyBoOTPInput({
  onComplete,
  onValueChange,
  maxLength = 6,
  className,
  disabled = false,
  error = false,
  errorMessage,
  label,
  description,
  ...props
}: HeyBoOTPInputProps) {
  const [value, setValue] = useState('');

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onValueChange?.(newValue);
    
    if (newValue.length === maxLength) {
      onComplete?.(newValue);
    }
  };

  return (
    <div className={cn("heybo-chatbot-otp-container space-y-4", className)}>
      {/* Label */}
      {label && (
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-[var(--heybo-text-primary)]">
            {label}
          </h3>
          {description && (
            <p className="text-sm text-[var(--heybo-text-secondary)]">
              {description}
            </p>
          )}
        </div>
      )}

      {/* OTP Input */}
      <div className="flex justify-center">
        <InputOTP
          maxLength={maxLength}
          value={value}
          onChange={handleValueChange}
          disabled={disabled}
          className="heybo-chatbot-otp-input"
          containerClassName="gap-3"
          {...props}
        >
          <InputOTPGroup className="gap-2">
            <InputOTPSlot 
              index={0} 
              className={cn(
                "heybo-chatbot-otp-slot",
                "h-12 w-12 text-lg font-medium rounded-xl border-2 transition-all duration-200",
                "bg-white text-[var(--heybo-text-primary)]",
                error 
                  ? "border-red-500 focus:border-red-600 focus:ring-red-200" 
                  : "border-[var(--heybo-border-medium)] focus:border-[var(--heybo-primary-600)] focus:ring-[var(--heybo-primary-100)]",
                "data-[active=true]:border-[var(--heybo-primary-600)] data-[active=true]:ring-4 data-[active=true]:ring-[var(--heybo-primary-100)]",
                "hover:border-[var(--heybo-primary-400)]",
                disabled && "opacity-50 cursor-not-allowed bg-[var(--heybo-background-secondary)]"
              )}
            />
            <InputOTPSlot 
              index={1} 
              className={cn(
                "heybo-chatbot-otp-slot",
                "h-12 w-12 text-lg font-medium rounded-xl border-2 transition-all duration-200",
                "bg-white text-[var(--heybo-text-primary)]",
                error 
                  ? "border-red-500 focus:border-red-600 focus:ring-red-200" 
                  : "border-[var(--heybo-border-medium)] focus:border-[var(--heybo-primary-600)] focus:ring-[var(--heybo-primary-100)]",
                "data-[active=true]:border-[var(--heybo-primary-600)] data-[active=true]:ring-4 data-[active=true]:ring-[var(--heybo-primary-100)]",
                "hover:border-[var(--heybo-primary-400)]",
                disabled && "opacity-50 cursor-not-allowed bg-[var(--heybo-background-secondary)]"
              )}
            />
            <InputOTPSlot 
              index={2} 
              className={cn(
                "heybo-chatbot-otp-slot",
                "h-12 w-12 text-lg font-medium rounded-xl border-2 transition-all duration-200",
                "bg-white text-[var(--heybo-text-primary)]",
                error 
                  ? "border-red-500 focus:border-red-600 focus:ring-red-200" 
                  : "border-[var(--heybo-border-medium)] focus:border-[var(--heybo-primary-600)] focus:ring-[var(--heybo-primary-100)]",
                "data-[active=true]:border-[var(--heybo-primary-600)] data-[active=true]:ring-4 data-[active=true]:ring-[var(--heybo-primary-100)]",
                "hover:border-[var(--heybo-primary-400)]",
                disabled && "opacity-50 cursor-not-allowed bg-[var(--heybo-background-secondary)]"
              )}
            />
          </InputOTPGroup>
          
          {maxLength > 3 && (
            <>
              <InputOTPSeparator className="text-[var(--heybo-text-muted)]" />
              <InputOTPGroup className="gap-2">
                <InputOTPSlot 
                  index={3} 
                  className={cn(
                    "heybo-chatbot-otp-slot",
                    "h-12 w-12 text-lg font-medium rounded-xl border-2 transition-all duration-200",
                    "bg-white text-[var(--heybo-text-primary)]",
                    error 
                      ? "border-red-500 focus:border-red-600 focus:ring-red-200" 
                      : "border-[var(--heybo-border-medium)] focus:border-[var(--heybo-primary-600)] focus:ring-[var(--heybo-primary-100)]",
                    "data-[active=true]:border-[var(--heybo-primary-600)] data-[active=true]:ring-4 data-[active=true]:ring-[var(--heybo-primary-100)]",
                    "hover:border-[var(--heybo-primary-400)]",
                    disabled && "opacity-50 cursor-not-allowed bg-[var(--heybo-background-secondary)]"
                  )}
                />
                <InputOTPSlot 
                  index={4} 
                  className={cn(
                    "heybo-chatbot-otp-slot",
                    "h-12 w-12 text-lg font-medium rounded-xl border-2 transition-all duration-200",
                    "bg-white text-[var(--heybo-text-primary)]",
                    error 
                      ? "border-red-500 focus:border-red-600 focus:ring-red-200" 
                      : "border-[var(--heybo-border-medium)] focus:border-[var(--heybo-primary-600)] focus:ring-[var(--heybo-primary-100)]",
                    "data-[active=true]:border-[var(--heybo-primary-600)] data-[active=true]:ring-4 data-[active=true]:ring-[var(--heybo-primary-100)]",
                    "hover:border-[var(--heybo-primary-400)]",
                    disabled && "opacity-50 cursor-not-allowed bg-[var(--heybo-background-secondary)]"
                  )}
                />
                {maxLength > 5 && (
                  <InputOTPSlot 
                    index={5} 
                    className={cn(
                      "heybo-chatbot-otp-slot",
                      "h-12 w-12 text-lg font-medium rounded-xl border-2 transition-all duration-200",
                      "bg-white text-[var(--heybo-text-primary)]",
                      error 
                        ? "border-red-500 focus:border-red-600 focus:ring-red-200" 
                        : "border-[var(--heybo-border-medium)] focus:border-[var(--heybo-primary-600)] focus:ring-[var(--heybo-primary-100)]",
                      "data-[active=true]:border-[var(--heybo-primary-600)] data-[active=true]:ring-4 data-[active=true]:ring-[var(--heybo-primary-100)]",
                      "hover:border-[var(--heybo-primary-400)]",
                      disabled && "opacity-50 cursor-not-allowed bg-[var(--heybo-background-secondary)]"
                    )}
                  />
                )}
              </InputOTPGroup>
            </>
          )}
        </InputOTP>
      </div>

      {/* Error Message */}
      {error && errorMessage && (
        <div className="text-center">
          <p className="text-sm text-red-600 font-medium">
            {errorMessage}
          </p>
        </div>
      )}

      {/* Helper Text */}
      {!error && value.length > 0 && value.length < maxLength && (
        <div className="text-center">
          <p className="text-xs text-[var(--heybo-text-muted)]">
            {maxLength - value.length} digits remaining
          </p>
        </div>
      )}
    </div>
  );
}
