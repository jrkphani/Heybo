// HeyBo Session Management Service
import type { User, SessionData, SessionWarning, RecoveryAction } from '../../types';
import { errorHandler } from './error-handler';

export interface SessionConfig {
  timeoutWarningMinutes: number;
  sessionDurationHours: number;
  autoExtendOnActivity: boolean;
  maxInactivityMinutes: number;
}

export class SessionManager {
  private static instance: SessionManager;
  private config: SessionConfig;
  private timeoutWarningTimer: NodeJS.Timeout | null = null;
  private sessionTimeoutTimer: NodeJS.Timeout | null = null;
  private activityTimer: NodeJS.Timeout | null = null;
  private warningListeners: ((warning: SessionWarning) => void)[] = [];
  private sessionListeners: ((session: SessionData | null) => void)[] = [];

  constructor(config: SessionConfig = {
    timeoutWarningMinutes: 5,
    sessionDurationHours: 24,
    autoExtendOnActivity: true,
    maxInactivityMinutes: 30
  }) {
    this.config = config;
    this.setupActivityTracking();
  }

  static getInstance(config?: SessionConfig): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager(config);
    }
    return SessionManager.instance;
  }

  /**
   * Create a new session with comprehensive error handling
   */
  async createSession(user: User): Promise<{ success: boolean; session?: SessionData; error?: string }> {
    try {
      // Check for existing session conflicts
      const existingSession = this.getCurrentSession();
      if (existingSession && existingSession.userId !== user.id) {
        await this.handleSessionConflict(existingSession, user);
      }

      const now = new Date();
      const expiresAt = new Date(now.getTime() + (this.config.sessionDurationHours * 60 * 60 * 1000));
      
      const sessionData: SessionData = {
        sessionId: this.generateSessionId(),
        userId: user.id,
        userType: user.type,
        deviceId: this.getDeviceId(),
        createdAt: now.toISOString(),
        lastActivity: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        currentStep: 'welcome',
        selections: [],
        cart: [],
        preferences: user.preferences || {}
      };

      // Store session with error handling
      const stored = await this.storeSession(sessionData);
      if (!stored) {
        throw new Error('Failed to store session data');
      }

      // Set up session timers
      this.setupSessionTimers(sessionData);
      
      // Notify listeners
      this.notifySessionListeners(sessionData);

      return {
        success: true,
        session: sessionData
      };
    } catch (error) {
      const errorState = errorHandler.createError(
        'session',
        'creation_failed',
        'Failed to create session',
        'Unable to start your session. Please try again.',
        error,
        'high'
      );

      return {
        success: false,
        error: errorState.userMessage
      };
    }
  }

  /**
   * Get current session with validation and recovery
   */
  getCurrentSession(): SessionData | null {
    try {
      const sessionStr = localStorage.getItem('heybo_session');
      if (!sessionStr) return null;

      const session = JSON.parse(sessionStr) as SessionData;
      
      // Validate session integrity
      if (!this.validateSessionIntegrity(session)) {
        this.clearSession();
        errorHandler.createError(
          'session',
          'corrupted',
          'Session data corrupted',
          'Your session has been reset due to data corruption.',
          null,
          'medium'
        );
        return null;
      }

      // Check expiration
      const now = new Date();
      const expiresAt = new Date(session.expiresAt);

      if (expiresAt <= now) {
        this.handleSessionExpiry(session);
        return null;
      }

      // Check for timeout warning
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      const warningThreshold = this.config.timeoutWarningMinutes * 60 * 1000;
      
      if (timeUntilExpiry <= warningThreshold && !this.timeoutWarningTimer) {
        this.showTimeoutWarning(timeUntilExpiry);
      }

      return session;
    } catch (error) {
      this.clearSession();
      errorHandler.createError(
        'session',
        'retrieval_failed',
        'Failed to retrieve session',
        'Unable to load your session. Starting fresh.',
        error,
        'medium'
      );
      return null;
    }
  }

  /**
   * Update session activity and extend if needed
   */
  updateActivity(): void {
    const session = this.getCurrentSession();
    if (!session) return;

    const now = new Date();
    session.lastActivity = now.toISOString();

    // Auto-extend session if configured
    if (this.config.autoExtendOnActivity) {
      const newExpiresAt = new Date(now.getTime() + (this.config.sessionDurationHours * 60 * 60 * 1000));
      session.expiresAt = newExpiresAt.toISOString();
      
      // Reset timers
      this.setupSessionTimers(session);
    }

    this.storeSession(session);
  }

  /**
   * Handle session conflicts when multiple devices are detected
   */
  private async handleSessionConflict(existingSession: SessionData, newUser: User): Promise<void> {
    const warning: SessionWarning = {
      type: 'conflict',
      message: 'Your account is being used on another device. Choose which session to keep.',
      actions: [
        {
          id: 'keep_current',
          label: 'Use this device',
          action: () => this.clearSession(),
          primary: true
        },
        {
          id: 'keep_existing',
          label: 'Keep other device',
          action: () => {
            // Redirect or show message
            throw new Error('Session conflict: keeping existing session');
          }
        }
      ]
    };

    this.notifyWarningListeners(warning);
  }

  /**
   * Handle session expiry with cart preservation
   */
  private handleSessionExpiry(session: SessionData): void {
    // Preserve cart data for recovery
    if (session.cart && session.cart.length > 0) {
      const cartBackup = {
        cart: session.cart,
        timestamp: new Date().toISOString(),
        sessionId: session.sessionId
      };
      localStorage.setItem('heybo_cart_backup', JSON.stringify(cartBackup));
    }

    this.clearSession();

    const warning: SessionWarning = {
      type: 'timeout',
      message: 'Your session has expired. Please sign in again to continue.',
      actions: [
        {
          id: 'sign_in',
          label: 'Sign in',
          action: () => this.redirectToAuth(),
          primary: true
        },
        {
          id: 'continue_guest',
          label: 'Continue as guest',
          action: () => this.startGuestSession()
        }
      ]
    };

    this.notifyWarningListeners(warning);
  }

  /**
   * Show timeout warning with extension option
   */
  private showTimeoutWarning(timeRemaining: number): void {
    const minutes = Math.ceil(timeRemaining / (60 * 1000));
    
    const warning: SessionWarning = {
      type: 'timeout',
      message: `Your session will expire in ${minutes} minute(s). Would you like to extend it?`,
      timeRemaining: timeRemaining,
      actions: [
        {
          id: 'extend_session',
          label: 'Extend session',
          action: () => this.extendSession(),
          primary: true
        },
        {
          id: 'continue',
          label: 'Continue',
          action: () => this.dismissTimeoutWarning()
        }
      ]
    };

    this.notifyWarningListeners(warning);
    
    // Set timer for actual timeout
    this.timeoutWarningTimer = setTimeout(() => {
      this.handleSessionExpiry(this.getCurrentSession()!);
    }, timeRemaining);
  }

  /**
   * Extend current session
   */
  private extendSession(): void {
    const session = this.getCurrentSession();
    if (!session) return;

    const now = new Date();
    const newExpiresAt = new Date(now.getTime() + (this.config.sessionDurationHours * 60 * 60 * 1000));
    
    session.expiresAt = newExpiresAt.toISOString();
    session.lastActivity = now.toISOString();
    
    this.storeSession(session);
    this.setupSessionTimers(session);
    this.dismissTimeoutWarning();
  }

  /**
   * Clear session and cleanup
   */
  clearSession(): void {
    localStorage.removeItem('heybo_session');
    localStorage.removeItem('heybo_guest_session');
    
    this.clearTimers();
    this.notifySessionListeners(null);
  }

  /**
   * Setup session timers for warnings and expiry
   */
  private setupSessionTimers(session: SessionData): void {
    this.clearTimers();

    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
    const warningTime = timeUntilExpiry - (this.config.timeoutWarningMinutes * 60 * 1000);

    if (warningTime > 0) {
      this.timeoutWarningTimer = setTimeout(() => {
        this.showTimeoutWarning(this.config.timeoutWarningMinutes * 60 * 1000);
      }, warningTime);
    }

    this.sessionTimeoutTimer = setTimeout(() => {
      this.handleSessionExpiry(session);
    }, timeUntilExpiry);
  }

  /**
   * Setup activity tracking
   */
  private setupActivityTracking(): void {
    // Only setup activity tracking in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const activityHandler = () => {
      if (this.activityTimer) {
        clearTimeout(this.activityTimer);
      }

      this.activityTimer = setTimeout(() => {
        this.updateActivity();
      }, 1000); // Debounce activity updates
    };

    events.forEach(event => {
      document.addEventListener(event, activityHandler, { passive: true });
    });
  }

  /**
   * Store session with error handling
   */
  private async storeSession(session: SessionData): Promise<boolean> {
    // Skip storage if not in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return false;
    }

    try {
      localStorage.setItem('heybo_session', JSON.stringify(session));
      return true;
    } catch (error) {
      errorHandler.createError(
        'session',
        'storage_failed',
        'Failed to store session',
        'Unable to save your session. Some features may be limited.',
        error,
        'medium'
      );
      return false;
    }
  }

  /**
   * Validate session data integrity
   */
  private validateSessionIntegrity(session: SessionData): boolean {
    const requiredFields = ['sessionId', 'userType', 'createdAt', 'expiresAt'];
    return requiredFields.every(field => session[field as keyof SessionData] !== undefined);
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `heybo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get device identifier
   */
  private getDeviceId(): string {
    // Return a default device ID if not in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return `device_ssr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    let deviceId = localStorage.getItem('heybo_device_id');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('heybo_device_id', deviceId);
    }
    return deviceId;
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    if (this.timeoutWarningTimer) {
      clearTimeout(this.timeoutWarningTimer);
      this.timeoutWarningTimer = null;
    }
    if (this.sessionTimeoutTimer) {
      clearTimeout(this.sessionTimeoutTimer);
      this.sessionTimeoutTimer = null;
    }
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = null;
    }
  }

  /**
   * Helper methods for recovery actions
   */
  private dismissTimeoutWarning(): void {
    if (this.timeoutWarningTimer) {
      clearTimeout(this.timeoutWarningTimer);
      this.timeoutWarningTimer = null;
    }
  }

  private redirectToAuth(): void {
    // Implementation for redirecting to authentication
    console.log('Redirecting to authentication...');
  }

  private startGuestSession(): void {
    // Implementation for starting guest session
    console.log('Starting guest session...');
  }

  /**
   * Event listeners
   */
  onWarning(listener: (warning: SessionWarning) => void): () => void {
    this.warningListeners.push(listener);
    return () => {
      const index = this.warningListeners.indexOf(listener);
      if (index > -1) {
        this.warningListeners.splice(index, 1);
      }
    };
  }

  onSessionChange(listener: (session: SessionData | null) => void): () => void {
    this.sessionListeners.push(listener);
    return () => {
      const index = this.sessionListeners.indexOf(listener);
      if (index > -1) {
        this.sessionListeners.splice(index, 1);
      }
    };
  }

  private notifyWarningListeners(warning: SessionWarning): void {
    this.warningListeners.forEach(listener => listener(warning));
  }

  private notifySessionListeners(session: SessionData | null): void {
    this.sessionListeners.forEach(listener => listener(session));
  }
}

export const sessionManager = SessionManager.getInstance();
