'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Phone, Key } from 'lucide-react';
import { apiClient, apiUtils } from '../../lib/api-client';
import { useChatbotStore } from '../../store/chatbot-store';

interface SimpleAuthProps {
  onAuthComplete: (user: any) => void;
  className?: string;
}

export function SimpleAuth({ onAuthComplete, className }: SimpleAuthProps) {
  const [authStep, setAuthStep] = useState<'phone' | 'otp' | 'complete'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { setUser } = useChatbotStore();

  // Check for existing authentication on mount
  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      // Check for existing session
      const storedSessionId = localStorage.getItem('heybo_session_id');
      if (storedSessionId) {
        const sessionData = await apiClient.session.get(storedSessionId);
        if (sessionData?.user) {
          console.log('✅ Found existing session');
          handleAuthSuccess(sessionData.user);
          return;
        }
      }

      // Check for platform token
      const platformToken = localStorage.getItem('heybo_platform_token');
      if (platformToken) {
        const user = await apiClient.auth.validateToken(platformToken);
        if (user) {
          console.log('✅ Platform token valid');
          handleAuthSuccess(user);
          return;
        }
      }
    } catch (error) {
      console.log('ℹ️ No existing authentication found');
    }
  };

  const handleAuthSuccess = async (user: any) => {
    setUser(user);
    setAuthStep('complete');
    setError(null);

    try {
      // Create session if needed
      if (!sessionId) {
        const session = await apiClient.session.create(user.id);
        setSessionId(session.sessionId);
        localStorage.setItem('heybo_session_id', session.sessionId);
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }

    setTimeout(() => {
      onAuthComplete(user);
    }, 1000);
  };

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.auth.sendOTP(phoneNumber);
      
      if (result.success) {
        console.log('✅ OTP sent successfully');
        setAuthStep('otp');
      } else {
        setError(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setError(apiUtils.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.auth.verifyOTP(phoneNumber, otp);
      
      if (result.success) {
        console.log('✅ OTP verified successfully');
        
        // Create guest user
        const guestUser = {
          id: `guest-${phoneNumber.replace(/\D/g, '')}`,
          name: `Guest User`,
          phone: phoneNumber,
          email: null,
          type: 'guest' as const,
          preferences: {}
        };
        
        if (result.token) {
          localStorage.setItem('heybo_guest_token', result.token);
        }
        
        handleAuthSuccess(guestUser);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setError(apiUtils.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setAuthStep('phone');
    setOtp('');
    setError(null);
  };

  return (
    <div className={`heybo-chatbot-simple-auth h-full flex flex-col bg-gradient-to-b from-orange-50 to-white ${className || ''}`}>
      {/* Header */}
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to HeyBo
        </h1>
        <p className="text-gray-600">
          {authStep === 'phone' && 'Enter your phone number to get started'}
          {authStep === 'otp' && 'Enter the OTP sent to your phone'}
          {authStep === 'complete' && 'Authentication complete!'}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4">
          {authStep === 'phone' && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+65 9123 4567"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <button
                onClick={handleSendOTP}
                disabled={loading || !phoneNumber.trim()}
                className="w-full bg-[var(--heybo-primary-500)] text-white py-3 rounded-lg font-medium hover:bg-[var(--heybo-primary-600)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </>
          )}

          {authStep === 'otp' && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-lg tracking-wider"
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  OTP sent to {phoneNumber}
                </p>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || !otp.trim()}
                  className="w-full bg-[var(--heybo-primary-500)] text-white py-3 rounded-lg font-medium hover:bg-[var(--heybo-primary-600)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                
                <button
                  onClick={handleBack}
                  disabled={loading}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
                >
                  Back
                </button>
              </div>
            </>
          )}

          {authStep === 'complete' && (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Welcome!</h3>
                <p className="text-gray-600">Taking you to your HeyBo assistant...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-gray-500">
          By continuing, you agree to HeyBo's Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
} 