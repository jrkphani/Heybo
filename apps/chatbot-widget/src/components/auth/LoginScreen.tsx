'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, Loader2, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { HeyBoLuluBrand } from '../brand/HeyBoAssets';
import { useChatbotStore } from '../../store/chatbot-store';
import { cn } from '../../lib/utils';
import type { User } from '../../types';

interface LoginScreenProps {
  onAuthSuccess: (loginData: { type: 'registered' | 'guest'; phone?: string; token?: string }) => void;
  onAuthError: (error: string) => void;
}

export function LoginScreen({ onAuthSuccess, onAuthError }: LoginScreenProps) {
  const [authMode, setAuthMode] = useState<'select' | 'registered' | 'guest'>('select');
  const [email, setEmail] = useState(process.env.NODE_ENV === 'development' ? 'demo@heybo.sg' : '');
  const [password, setPassword] = useState(process.env.NODE_ENV === 'development' ? 'demo123' : '');
  const [phoneNumber, setPhoneNumber] = useState(process.env.NODE_ENV === 'development' ? '+65 9123 4567' : '');
  const [isLoading, setIsLoading] = useState(false);
  const { setLoading } = useChatbotStore();

  const handleRegisteredLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setLoading(true);

    try {
      // Simulate API call for registered user login
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock validation - check for valid credentials
      const validCredentials = [
        { email: 'demo@heybo.sg', password: 'demo123' },
        { email: 'user@heybo.sg', password: 'password123' },
        { email: 'test@heybo.sg', password: 'test123' }
      ];

      const isValidUser = validCredentials.some(
        cred => cred.email === email && cred.password === password
      );

      if (!isValidUser) {
        throw new Error('Invalid credentials');
      }

      // Mock successful login - return login data instead of user object
      onAuthSuccess({
        type: 'registered',
        token: 'mock-platform-token-' + Date.now() // Mock platform token
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        onAuthError('Invalid email or password. Please check your credentials and try again.');
      } else {
        onAuthError('Login failed. Please check your internet connection and try again.');
      }
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    setIsLoading(true);
    setLoading(true);

    try {
      // Validate phone number format
      const phoneRegex = /^\+65\s?[689]\d{3}\s?\d{4}$/;
      if (!phoneRegex.test(phoneNumber)) {
        throw new Error('Invalid phone number format');
      }

      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate potential network errors (10% chance in development)
      if (process.env.NODE_ENV === 'development' && Math.random() < 0.1) {
        throw new Error('Network error');
      }

      // Move to OTP verification step - return login data instead of user object
      onAuthSuccess({
        type: 'guest',
        phone: phoneNumber
      });
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case 'Invalid phone number format':
            onAuthError('Please enter a valid Singapore mobile number (+65 XXXX XXXX)');
            break;
          case 'Network error':
            onAuthError('Network error. Please check your connection and try again.');
            break;
          default:
            onAuthError('Failed to send OTP. Please try again.');
        }
      } else {
        onAuthError('Failed to send OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setLoading(false);
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

  const buttonVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 }
  };

  if (authMode === 'select') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="heybo-chatbot-login"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <HeyBoLuluBrand
              logoVariant="website"
              size="lg"
              theme="light"
              spacing="normal"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Welcome to HeyBo!</h2>
            <p className="text-gray-600">Sign in to start ordering your perfect grain bowl</p>
          </div>
        </div>

        <div className="space-y-3">
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              onClick={() => setAuthMode('registered')}
              className={cn(
                "w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600",
                "hover:from-orange-600 hover:to-orange-700",
                "text-white font-medium text-base",
                "shadow-lg hover:shadow-xl transition-all duration-200"
              )}
            >
              <UserIcon className="w-5 h-5 mr-3" />
              I have an account
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>
          </motion.div>

          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              onClick={() => setAuthMode('guest')}
              variant="outline"
              className={cn(
                "w-full h-14 border-2 border-[var(--heybo-primary-200)]",
                "hover:border-[var(--heybo-primary-300)] hover:bg-[var(--heybo-primary-50)]",
                "text-[var(--heybo-primary-700)] font-medium text-base",
                "transition-all duration-200"
              )}
            >
              <Phone className="w-5 h-5 mr-3" />
              Continue as guest
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>
          </motion.div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            New to HeyBo?{' '}
            <button className="text-[var(--heybo-primary-600)] hover:text-[var(--heybo-primary-700)] font-medium">
              Create an account
            </button>
          </p>
        </div>
      </motion.div>
    );
  }

  if (authMode === 'registered') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6 space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-gray-800">Sign In</h2>
          <p className="text-gray-600">Enter your account details</p>
        </div>

        <form onSubmit={handleRegisteredLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-12 text-base"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-12 text-base"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !email || !password}
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
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setAuthMode('select')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to options
          </button>
        </div>
      </motion.div>
    );
  }

  if (authMode === 'guest') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6 space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-gray-800">Guest Checkout</h2>
          <p className="text-gray-600">Enter your mobile number to continue</p>
        </div>

        <form onSubmit={handleGuestLogin} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+65 9123 4567"
              className="h-12 text-base"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll send you an OTP to verify your number
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !phoneNumber}
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
                Sending OTP...
              </>
            ) : (
              'Send OTP'
            )}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setAuthMode('select')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to options
          </button>
        </div>
      </motion.div>
    );
  }

  return null;
}
