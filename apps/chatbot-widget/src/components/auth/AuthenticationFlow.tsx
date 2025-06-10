'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { LoginScreen } from './LoginScreen';
import { OTPVerification } from './OTPVerification';
import { useChatbotStore } from '../../store/chatbot-store';
import { apiClient, apiUtils } from '../../lib/api-client';
import { cn } from '../../lib/utils';

interface AuthenticationFlowProps {
  onAuthComplete: (user: any) => void;
  className?: string;
}

type AuthStep = 'login' | 'otp-verification' | 'success';

export function AuthenticationFlow({ onAuthComplete, className }: AuthenticationFlowProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { setUser, setCurrentStep: setChatStep } = useChatbotStore();

  // Check for existing authentication on mount
  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      // Try to get existing session
      const storedSessionId = localStorage.getItem('heybo_session_id');
      if (storedSessionId) {
        try {
          const sessionData = await apiClient.session.get(storedSessionId);
          if (sessionData && sessionData.user) {
            console.log('✅ Found existing session:', sessionData);
            handleAuthSuccess(sessionData.user);
            return;
          }
        } catch (error) {
          console.log('❌ Existing session invalid, clearing:', error);
          localStorage.removeItem('heybo_session_id');
        }
      }

      // Check for platform token in cookies/localStorage
      const platformToken = localStorage.getItem('heybo_platform_token') || 
                           document.cookie.split('; ').find(row => row.startsWith('heybo_token='))?.split('=')[1];
      
      if (platformToken) {
        // Validate existing token using our API
        const user = await apiClient.auth.validateToken(platformToken);
        if (user) {
          console.log('✅ Platform token valid:', user);
          handleAuthSuccess(user);
          return;
        }
      }

      console.log('ℹ️ No existing authentication found');
    } catch (error) {
      console.error('Error checking existing auth:', error);
    }
  };

  const handleAuthSuccess = async (user: any) => {
    setUser(user);
    setSuccessMessage(`Welcome back, ${user.name}!`);
    setCurrentStep('success');
    setError(null);

    try {
      // Create session using our API
      if (!sessionId) {
        const session = await apiClient.session.create(user.id);
        setSessionId(session.sessionId);
        localStorage.setItem('heybo_session_id', session.sessionId);
        console.log('✅ Session created:', session.sessionId);
      }
    } catch (error) {
      console.error('Failed to create session:', error);
      // Continue anyway - session is not critical for authentication
    }

    // Transition to main chat
    setTimeout(() => {
      onAuthComplete(user);
    }, 800);
  };

  const handleAuthError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  };

  const handleLoginSuccess = async (loginData: { type: 'registered' | 'guest'; phone?: string; token?: string }) => {
    try {
      if (loginData.type === 'guest' && loginData.phone) {
        // For guest users, we need to send OTP first
        setPhoneNumber(loginData.phone);
        
        console.log('📞 Sending OTP to:', loginData.phone);
        const otpResult = await apiClient.auth.sendOTP(loginData.phone);
        
        if (otpResult.success) {
          setCurrentStep('otp-verification');
          console.log('✅ OTP sent successfully');
        } else {
          handleAuthError(otpResult.message || 'Failed to send OTP');
        }
      } else if (loginData.type === 'registered' && loginData.token) {
        // For registered users, validate token directly
        console.log('🔐 Validating platform token');
        const user = await apiClient.auth.validateToken(loginData.token);
        
        if (user) {
          localStorage.setItem('heybo_platform_token', loginData.token);
          handleAuthSuccess(user);
        } else {
          handleAuthError('Invalid token. Please log in again.');
        }
      }
         } catch (error) {
       console.error('Login error:', error);
       handleAuthError(apiUtils.handleError(error));
     }
  };

  const handleOTPVerificationSuccess = async (otp: string) => {
    try {
      console.log('🔐 Verifying OTP:', otp);
      const verificationResult = await apiClient.auth.verifyOTP(phoneNumber, otp);
      
             if (verificationResult.success) {
         console.log('✅ OTP verified successfully');
         
         // Store guest session token
         if (verificationResult.token) {
           localStorage.setItem('heybo_guest_token', verificationResult.token);
         }
         
         // Create a guest user object
         const guestUser = {
           id: `guest-${phoneNumber.replace(/\D/g, '')}`,
           name: `Guest User`,
           phone: phoneNumber,
           email: null,
           type: 'guest' as const,
           preferences: {}
         };
         
         handleAuthSuccess(guestUser);
       } else {
         handleAuthError('Invalid OTP. Please try again.');
       }
         } catch (error) {
       console.error('OTP verification error:', error);
       handleAuthError(apiUtils.handleError(error));
     }
  };

  const handleOtpBack = () => {
    setCurrentStep('login');
    setPhoneNumber('');
    setError(null);
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.3
  };

  return (
    <div className={cn("h-full flex flex-col bg-gradient-to-b from-orange-50 to-white", className)}>
      {/* Error/Success Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}
        
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-4 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {currentStep === 'login' && (
              <motion.div
                key="login"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <LoginScreen
                  onAuthSuccess={handleLoginSuccess}
                  onAuthError={handleAuthError}
                />
              </motion.div>
            )}

            {currentStep === 'otp-verification' && (
              <motion.div
                key="otp"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <OTPVerification
                  phoneNumber={phoneNumber}
                  onVerificationSuccess={handleOTPVerificationSuccess}
                  onVerificationError={handleAuthError}
                  onBack={handleOtpBack}
                />
              </motion.div>
            )}

            {currentStep === 'success' && (
              <motion.div
                key="success"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="text-center py-8"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Authentication Complete!
                </h2>
                <p className="text-gray-600">
                  Taking you to your HeyBo assistant...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
