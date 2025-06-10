// HeyBo Authentication API
import type { User } from '../../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface OTPRequest {
  phoneNumber: string;
}

export interface OTPVerification {
  phoneNumber: string;
  otp: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  error?: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  expiresAt?: number;
  attemptsRemaining?: number;
}

// Mock API delay for realistic UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Validate platform token from HeyBo website
 * This would integrate with the actual HeyBo platform API
 */
export async function validatePlatformToken(token: string): Promise<AuthResponse> {
  await delay(500);
  
  try {
    // In production, this would call the actual platform API
    // const response = await fetch('/api/auth/validate-token', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    
    // Mock validation logic
    if (token === 'valid-platform-token' || token.startsWith('heybo_')) {
      return {
        success: true,
        user: {
          id: 'platform-user-123',
          name: 'Platform User',
          email: 'user@heybo.sg',
          phone: '+65 9123 4567',
          type: 'registered',
          preferences: {
            dietaryRestrictions: ['gluten-free'],
            allergens: ['nuts'],
            spiceLevel: 'medium',
            proteinPreference: 'plant-based',
          },
          lastOrderedLocation: 'marina-bay-sands'
        },
        token
      };
    }
    
    return {
      success: false,
      error: 'Invalid token'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Token validation failed'
    };
  }
}

/**
 * Login with email and password for registered users
 */
export async function loginWithCredentials(credentials: LoginCredentials): Promise<AuthResponse> {
  await delay(1500);
  
  try {
    // In production, this would call the actual authentication API
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials)
    // });
    
    // Mock login logic
    if (credentials.email === 'demo@heybo.sg' && credentials.password === 'demo123') {
      const user: User = {
        id: 'user-demo-123',
        name: 'Demo User',
        email: credentials.email,
        phone: '+65 9123 4567',
        type: 'registered',
        preferences: {
          dietaryRestrictions: [],
          allergens: [],
          spiceLevel: 'medium',
          proteinPreference: 'any',
        },
        lastOrderedLocation: 'marina-bay-sands'
      };
      
      return {
        success: true,
        user,
        token: 'demo-auth-token-' + Date.now()
      };
    }
    
    return {
      success: false,
      error: 'Invalid email or password'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Login failed. Please try again.'
    };
  }
}

/**
 * Send OTP to phone number for guest authentication
 */
export async function sendOTP(request: OTPRequest): Promise<OTPResponse> {
  await delay(1000);
  
  try {
    // Validate phone number format
    const phoneRegex = /^\+65\s?[689]\d{7}$/;
    if (!phoneRegex.test(request.phoneNumber)) {
      return {
        success: false,
        message: 'Please enter a valid Singapore mobile number (+65 9XXX XXXX)'
      };
    }
    
    // In production, this would call the actual OTP service
    // const response = await fetch('/api/auth/send-otp', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(request)
    // });
    
    // Mock OTP sending
    return {
      success: true,
      message: 'OTP sent successfully',
      expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutes
      attemptsRemaining: 5
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to send OTP. Please try again.'
    };
  }
}

/**
 * Verify OTP for guest authentication
 */
export async function verifyOTP(verification: OTPVerification): Promise<AuthResponse> {
  await delay(1500);
  
  try {
    // In production, this would call the actual OTP verification API
    // const response = await fetch('/api/auth/verify-otp', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(verification)
    // });
    
    // Mock OTP verification (accept 123456 or 000000 for demo)
    if (verification.otp === '123456' || verification.otp === '000000') {
      const user: User = {
        id: 'guest-' + Date.now(),
        name: 'Guest User',
        phone: verification.phoneNumber,
        type: 'guest',
        preferences: {
          dietaryRestrictions: [],
          allergens: [],
          spiceLevel: 'medium',
          proteinPreference: 'any',
        }
      };
      
      return {
        success: true,
        user,
        token: 'guest-session-' + Date.now()
      };
    }
    
    return {
      success: false,
      error: 'Invalid OTP. Please check and try again.'
    };
  } catch (error) {
    return {
      success: false,
      error: 'OTP verification failed. Please try again.'
    };
  }
}

/**
 * Logout and clear session
 */
export async function logout(): Promise<{ success: boolean }> {
  await delay(300);
  
  try {
    // Clear local storage
    localStorage.removeItem('heybo_guest_session');
    localStorage.removeItem('heybo_platform_token');
    
    // In production, this would also call the logout API
    // await fetch('/api/auth/logout', { method: 'POST' });
    
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * Check if user has valid authentication
 */
export function checkAuthStatus(): { isAuthenticated: boolean; user?: User } {
  try {
    // Check for platform token
    const platformToken = localStorage.getItem('heybo_platform_token');
    if (platformToken) {
      // In production, you'd validate this token
      return { isAuthenticated: true };
    }
    
    // Check for guest session
    const guestSession = localStorage.getItem('heybo_guest_session');
    if (guestSession) {
      const sessionData = JSON.parse(guestSession);
      const now = Date.now();
      
      if (sessionData.expiresAt > now) {
        return { 
          isAuthenticated: true, 
          user: sessionData.user 
        };
      } else {
        // Clean up expired session
        localStorage.removeItem('heybo_guest_session');
      }
    }
    
    return { isAuthenticated: false };
  } catch (error) {
    return { isAuthenticated: false };
  }
}

/**
 * Get current user from session
 */
export function getCurrentUser(): User | null {
  const authStatus = checkAuthStatus();
  return authStatus.user || null;
}
