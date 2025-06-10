// HeyBo Session Management
import type { User, ChatbotStep } from '../../types';

export interface SessionData {
  sessionId: string;
  userId?: string;
  userType: 'registered' | 'guest' | 'unauthenticated';
  deviceId: string;
  createdAt: string;
  lastActivity: string;
  expiresAt: string;
  currentStep: ChatbotStep;
  orderTime?: string;
  pickupLocationType?: 'station' | 'outlet';
  locationId?: string;
  selections: any[];
  cart: any[];
  preferences: Record<string, any>;
}

export interface SessionResponse {
  success: boolean;
  session?: SessionData;
  error?: string;
}

// Generate unique identifiers
const generateSessionId = () => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateDeviceId = () => `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Get or create device ID
function getDeviceId(): string {
  let deviceId = localStorage.getItem('heybo_device_id');
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem('heybo_device_id', deviceId);
  }
  return deviceId;
}

/**
 * Create a new session for authenticated user
 */
export async function createSession(user: User): Promise<SessionResponse> {
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
    
    const sessionData: SessionData = {
      sessionId: generateSessionId(),
      userId: user.id,
      userType: user.type,
      deviceId: getDeviceId(),
      createdAt: now.toISOString(),
      lastActivity: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      currentStep: 'welcome',
      selections: [],
      cart: [],
      preferences: user.preferences || {}
    };

    // Store session data
    localStorage.setItem('heybo_session', JSON.stringify(sessionData));
    
    // For guest users, also store in guest session
    if (user.type === 'guest') {
      const guestSessionData = {
        user,
        sessionData,
        expiresAt: expiresAt.getTime()
      };
      localStorage.setItem('heybo_guest_session', JSON.stringify(guestSessionData));
    }

    return {
      success: true,
      session: sessionData
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create session'
    };
  }
}

/**
 * Get current session data
 */
export function getCurrentSession(): SessionData | null {
  try {
    const sessionStr = localStorage.getItem('heybo_session');
    if (!sessionStr) return null;

    const session = JSON.parse(sessionStr) as SessionData;
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);

    // Check if session is expired
    if (expiresAt <= now) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    clearSession();
    return null;
  }
}

/**
 * Update session data
 */
export async function updateSession(updates: Partial<SessionData>): Promise<SessionResponse> {
  try {
    const currentSession = getCurrentSession();
    if (!currentSession) {
      return {
        success: false,
        error: 'No active session found'
      };
    }

    const updatedSession: SessionData = {
      ...currentSession,
      ...updates,
      lastActivity: new Date().toISOString()
    };

    localStorage.setItem('heybo_session', JSON.stringify(updatedSession));

    return {
      success: true,
      session: updatedSession
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update session'
    };
  }
}

/**
 * Update current step in session
 */
export async function updateCurrentStep(step: ChatbotStep): Promise<SessionResponse> {
  return updateSession({ currentStep: step });
}

/**
 * Update location selection in session
 */
export async function updateLocation(locationId: string, locationType: 'station' | 'outlet'): Promise<SessionResponse> {
  return updateSession({ 
    locationId, 
    pickupLocationType: locationType 
  });
}

/**
 * Update order time in session
 */
export async function updateOrderTime(orderTime: Date): Promise<SessionResponse> {
  return updateSession({ 
    orderTime: orderTime.toISOString() 
  });
}

/**
 * Add selection to session
 */
export async function addSelection(selection: any): Promise<SessionResponse> {
  const currentSession = getCurrentSession();
  if (!currentSession) {
    return {
      success: false,
      error: 'No active session found'
    };
  }

  const updatedSelections = [...currentSession.selections, selection];
  return updateSession({ selections: updatedSelections });
}

/**
 * Update cart in session
 */
export async function updateCart(cart: any[]): Promise<SessionResponse> {
  return updateSession({ cart });
}

/**
 * Clear current session
 */
export function clearSession(): void {
  localStorage.removeItem('heybo_session');
  localStorage.removeItem('heybo_guest_session');
}

/**
 * Check if session is valid and not expired
 */
export function isSessionValid(): boolean {
  const session = getCurrentSession();
  return session !== null;
}

/**
 * Get session time remaining in minutes
 */
export function getSessionTimeRemaining(): number {
  const session = getCurrentSession();
  if (!session) return 0;

  const now = new Date();
  const expiresAt = new Date(session.expiresAt);
  const diffMs = expiresAt.getTime() - now.getTime();
  
  return Math.max(0, Math.floor(diffMs / (1000 * 60)));
}

/**
 * Extend session expiry time
 */
export async function extendSession(additionalHours: number = 24): Promise<SessionResponse> {
  const currentSession = getCurrentSession();
  if (!currentSession) {
    return {
      success: false,
      error: 'No active session found'
    };
  }

  const newExpiryTime = new Date();
  newExpiryTime.setHours(newExpiryTime.getHours() + additionalHours);

  return updateSession({ 
    expiresAt: newExpiryTime.toISOString() 
  });
}

/**
 * Clean up expired sessions (call this periodically)
 */
export function cleanupExpiredSessions(): void {
  try {
    const session = getCurrentSession();
    if (!session) {
      // Session is already expired and cleaned up
      return;
    }

    // Check guest session separately
    const guestSessionStr = localStorage.getItem('heybo_guest_session');
    if (guestSessionStr) {
      const guestSession = JSON.parse(guestSessionStr);
      if (guestSession.expiresAt <= Date.now()) {
        localStorage.removeItem('heybo_guest_session');
      }
    }
  } catch (error) {
    // If there's any error, clear all sessions to be safe
    clearSession();
  }
}

/**
 * Initialize session management
 * Call this when the app starts
 */
export function initializeSessionManagement(): void {
  // Clean up any expired sessions on startup
  cleanupExpiredSessions();

  // Set up periodic cleanup (every 5 minutes)
  setInterval(cleanupExpiredSessions, 5 * 60 * 1000);
}
