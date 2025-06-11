'use client';

import React, { useState } from 'react';
import { HeyBoOTPInput } from '../../components/ui/heybo-otp-input';

export default function OTPDemoPage() {
  const [otpValue, setOtpValue] = useState('');
  const [isError, setIsError] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleOTPComplete = (value: string) => {
    console.log('OTP Complete:', value);
    setIsComplete(true);
    
    // Simulate validation
    setTimeout(() => {
      if (value === '123456') {
        alert('OTP Verified Successfully!');
        setIsError(false);
      } else {
        setIsError(true);
        setIsComplete(false);
      }
    }, 1000);
  };

  const handleOTPChange = (value: string) => {
    setOtpValue(value);
    setIsError(false);
    setIsComplete(false);
  };

  const resetDemo = () => {
    setOtpValue('');
    setIsError(false);
    setIsComplete(false);
  };

  return (
    <div className="heybo-chatbot-widget min-h-screen bg-[var(--heybo-background-secondary)] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-[var(--heybo-text-primary)]">
            HeyBo OTP Input Components Demo
          </h1>
          <p className="text-[var(--heybo-text-secondary)]">
            Showcasing the HeyBo-branded OTP input with design system compliance
          </p>
        </div>

        <div className="space-y-8">
          {/* Main OTP Demo */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[var(--heybo-text-primary)] mb-2">
                  Phone Verification
                </h2>
                <p className="text-[var(--heybo-text-secondary)]">
                  Enter the 6-digit code sent to your phone number
                </p>
              </div>

              <HeyBoOTPInput
                maxLength={6}
                onComplete={handleOTPComplete}
                onValueChange={handleOTPChange}
                error={isError}
                errorMessage={isError ? "Invalid OTP. Please try again." : undefined}
                className="max-w-md mx-auto"
              />

              {isComplete && !isError && (
                <div className="text-center">
                  <p className="text-sm text-[var(--heybo-success-600)] font-medium">
                    ✓ Verifying OTP...
                  </p>
                </div>
              )}

              <div className="flex justify-center gap-4">
                <button
                  onClick={resetDemo}
                  className="px-4 py-2 text-sm font-medium text-[var(--heybo-text-secondary)] hover:text-[var(--heybo-primary-600)] transition-colors"
                >
                  Reset Demo
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-[var(--heybo-primary-600)] hover:text-[var(--heybo-primary-700)] transition-colors"
                >
                  Resend Code
                </button>
              </div>
            </div>
          </div>

          {/* Different Variations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 4-Digit OTP */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-[var(--heybo-text-primary)] mb-4 text-center">
                4-Digit PIN
              </h3>
              <HeyBoOTPInput
                maxLength={4}
                label="Enter PIN"
                description="Enter your 4-digit security PIN"
                onComplete={(value) => console.log('PIN:', value)}
              />
            </div>

            {/* Error State Demo */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-[var(--heybo-text-primary)] mb-4 text-center">
                Error State
              </h3>
              <HeyBoOTPInput
                maxLength={6}
                label="Verification Code"
                description="This shows the error state"
                error={true}
                errorMessage="Code expired. Please request a new one."
              />
            </div>

            {/* Disabled State */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-[var(--heybo-text-primary)] mb-4 text-center">
                Disabled State
              </h3>
              <HeyBoOTPInput
                maxLength={6}
                label="Disabled Input"
                description="This input is disabled"
                disabled={true}
              />
            </div>

            {/* Custom Styling Demo */}
            <div className="bg-[var(--heybo-primary-50)] rounded-xl p-6 border border-[var(--heybo-primary-200)]">
              <h3 className="text-lg font-semibold text-[var(--heybo-primary-800)] mb-4 text-center">
                On Colored Background
              </h3>
              <HeyBoOTPInput
                maxLength={6}
                label="Verification Code"
                description="OTP input on colored background"
                onComplete={(value) => console.log('Colored BG OTP:', value)}
              />
            </div>
          </div>
        </div>

        {/* Design System Features */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-[var(--heybo-text-primary)] mb-4">
            Design System Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-[var(--heybo-text-primary)]">
                ✅ HeyBo Design Tokens
              </h3>
              <p className="text-sm text-[var(--heybo-text-secondary)]">
                All colors use CSS variables from the HeyBo design system
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-[var(--heybo-text-primary)]">
                ✅ CSS Namespacing
              </h3>
              <p className="text-sm text-[var(--heybo-text-secondary)]">
                All styles prefixed with .heybo-chatbot- for isolation
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-[var(--heybo-text-primary)]">
                ✅ Touch-Friendly
              </h3>
              <p className="text-sm text-[var(--heybo-text-secondary)]">
                56px touch targets on mobile for easy input
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-[var(--heybo-text-primary)]">
                ✅ Accessibility
              </h3>
              <p className="text-sm text-[var(--heybo-text-secondary)]">
                Proper focus states and keyboard navigation
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-[var(--heybo-text-primary)]">
                ✅ Error Handling
              </h3>
              <p className="text-sm text-[var(--heybo-text-secondary)]">
                Clear error states with helpful messaging
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-[var(--heybo-text-primary)]">
                ✅ Type Safety
              </h3>
              <p className="text-sm text-[var(--heybo-text-secondary)]">
                Full TypeScript support with proper interfaces
              </p>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-[var(--heybo-background-secondary)] rounded-xl p-6 border border-[var(--heybo-border-light)]">
          <h2 className="text-lg font-semibold text-[var(--heybo-text-primary)] mb-4">
            Demo Instructions
          </h2>
          <div className="space-y-2 text-sm text-[var(--heybo-text-secondary)]">
            <p>• Try entering <strong>123456</strong> in the main demo for successful verification</p>
            <p>• Any other 6-digit code will show an error state</p>
            <p>• Test keyboard navigation using Tab and arrow keys</p>
            <p>• On mobile, touch targets are automatically enlarged to 56px</p>
            <p>• All components inherit font-family from parent website</p>
          </div>
        </div>
      </div>
    </div>
  );
}
