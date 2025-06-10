'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
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
  const [otp, setOtp] = useState(
    process.env.NODE_ENV === 'development'
      ? ['1', '2', '3', '4', '5', '6']
      : ['', '', '', '', '', '']
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [attempts, setAttempts] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
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

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && !isLoading) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpCode?: string) => {
    const codeToVerify = otpCode || otp.join('');
    
    if (codeToVerify.length !== 6) {
      onVerificationError('Please enter the complete 6-digit OTP');
      return;
    }

    if (attempts >= 5) {
      onVerificationError('Too many failed attempts. Please request a new OTP.');
      return;
    }

    setIsLoading(true);
    setLoading(true);

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
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();

        if (newAttempts >= 5) {
          onVerificationError('Too many failed attempts. Please request a new OTP or try again later.');
        } else {
          onVerificationError(`Invalid OTP. ${5 - newAttempts} attempts remaining.`);
        }
      }
    } catch (error) {
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
      setOtp(['', '', '', '', '', '']);
      setTimeLeft(600);
      setAttempts(0);
      inputRefs.current[0]?.focus();
      
      // Show success message (you might want to use a toast here)
      console.log('OTP resent successfully');
    } catch (error) {
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
      className="p-6 space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-800">Verify Your Number</h2>
        <p className="text-gray-600">
          We've sent a 6-digit code to
        </p>
        <p className="font-medium text-gray-800">{phoneNumber}</p>
      </div>

      <div className="space-y-4">
        {/* OTP Input Fields */}
        <div className="flex justify-center space-x-3">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={cn(
                "w-12 h-12 text-center text-lg font-semibold",
                "border-2 rounded-lg",
                digit ? "border-orange-500 bg-orange-50" : "border-gray-300",
                "focus:border-orange-500 focus:ring-orange-500"
              )}
              disabled={isLoading}
            />
          ))}
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
            className="text-orange-600 hover:text-orange-700 text-sm"
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
          disabled={isLoading || otp.some(digit => !digit)}
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
