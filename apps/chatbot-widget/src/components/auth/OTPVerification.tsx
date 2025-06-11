'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { HeyBoOTPInput } from '../ui/heybo-otp-input';
import { useChatbotStore } from '../../store/chatbot-store';
import { cn } from '../../lib/utils';
import type { User } from '../../types';

interface OTPVerificationProps {
  phoneNumber: string;
  onVerificationSuccess: (otp: string) => void;
  onVerificationError: (error: string) => void;
  onBack: () => void;
}

export function OTPVerification({ 
  phoneNumber, 
  onVerificationSuccess, 
  onVerificationError, 
  onBack 
}: OTPVerificationProps) {
  const [otpValue, setOtpValue] = useState(
    process.env.NODE_ENV === 'development' ? '123456' : ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [attempts, setAttempts] = useState(0);
  const [otpError, setOtpError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { setLoading } = useChatbotStore();

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    setOtpError(false);
    setErrorMessage('');
  };

  const handleOtpComplete = (value: string) => {
    if (!isLoading) {
      handleVerifyOtp(value);
    }
  };

  const handleVerifyOtp = async (otpCode?: string) => {
    const codeToVerify = otpCode || otpValue;

    if (codeToVerify.length !== 6) {
      setOtpError(true);
      setErrorMessage('Please enter the complete 6-digit OTP');
      return;
    }

    if (attempts >= 5) {
      setOtpError(true);
      setErrorMessage('Too many failed attempts. Please request a new OTP.');
      return;
    }

    setIsLoading(true);
    setLoading(true);
    setOtpError(false);
    setErrorMessage('');

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock verification logic
      if (codeToVerify === '123456' || codeToVerify === '000000') {
        // Successful verification - pass the OTP code to parent
        onVerificationSuccess(codeToVerify);
      } else {
        // Failed verification
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setOtpValue('');
        setOtpError(true);

        if (newAttempts >= 5) {
          setErrorMessage('Too many failed attempts. Please request a new OTP or try again later.');
          onVerificationError('Too many failed attempts. Please request a new OTP or try again later.');
        } else {
          setErrorMessage(`Invalid OTP. ${5 - newAttempts} attempts remaining.`);
          onVerificationError(`Invalid OTP. ${5 - newAttempts} attempts remaining.`);
        }
      }
    } catch (error) {
      setOtpError(true);
      setErrorMessage('Verification failed. Please try again.');
      onVerificationError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);

    try {
      // Simulate resending OTP
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset state
      setOtpValue('');
      setTimeLeft(600);
      setAttempts(0);
      setOtpError(false);
      setErrorMessage('');

      // Show success message (you might want to use a toast here)
      console.log('OTP resent successfully');
    } catch (error) {
      setOtpError(true);
      setErrorMessage('Failed to resend OTP. Please try again.');
      onVerificationError('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="heybo-chatbot-otp"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-800">Verify Your Number</h2>
        <p className="text-gray-600">
          We've sent a 6-digit code to
        </p>
        <p className="font-medium text-gray-800">{phoneNumber}</p>
      </div>

      <div className="space-y-4">
        {/* HeyBo OTP Input */}
        <div className="flex justify-center">
          <HeyBoOTPInput
            maxLength={6}
            onComplete={handleOtpComplete}
            onValueChange={handleOtpChange}
            error={otpError}
            errorMessage={errorMessage}
            disabled={isLoading}
            className="max-w-md"
          />
        </div>

        {/* Timer and Resend */}
        <div className="text-center space-y-2">
          {timeLeft > 0 ? (
            <p className="text-sm text-gray-500">
              Code expires in {formatTime(timeLeft)}
            </p>
          ) : (
            <p className="text-sm text-red-500">
              Code has expired. Please request a new one.
            </p>
          )}
          
          <Button
            variant="ghost"
            onClick={handleResendOtp}
            disabled={isResending || timeLeft > 540} // Allow resend after 1 minute
            className="text-[var(--heybo-primary-600)] hover:text-[var(--heybo-primary-700)] text-sm"
          >
            {isResending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Resending...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend OTP
              </>
            )}
          </Button>
        </div>

        {/* Manual Verify Button */}
        <Button
          onClick={() => handleVerifyOtp()}
          disabled={isLoading || otpValue.length !== 6}
          className={cn(
            "w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600",
            "hover:from-orange-600 hover:to-orange-700",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "text-white font-medium"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify OTP'
          )}
        </Button>
      </div>

      {/* Back Button */}
      <div className="text-center">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center mx-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Change phone number
        </button>
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Didn't receive the code? Check your SMS or try resending.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          For demo: Use 123456 or 000000
        </p>
      </div>
    </motion.div>
  );
}
