// HeyBo Chatbot Error Handling Service
import type { 
  ErrorState, 
  ErrorCategory, 
  RecoveryAction, 
  ChatbotError,
  AuthenticationError,
  OTPError,
  SessionWarning
} from '../../types';

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errors: Map<string, ErrorState> = new Map();
  private errorListeners: ((error: ErrorState) => void)[] = [];
  private recoveryListeners: ((errorId: string) => void)[] = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Create and track a new error
   */
  createError(
    category: ErrorCategory,
    code: string,
    message: string,
    userMessage: string,
    details?: any,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): ErrorState {
    const errorId = `${category}_${code}_${Date.now()}`;
    
    const error: ErrorState = {
      id: errorId,
      category,
      code,
      message,
      userMessage,
      details,
      timestamp: new Date(),
      severity,
      recoverable: this.isRecoverable(category, code),
      retryCount: 0,
      maxRetries: this.getMaxRetries(category, code),
      resolved: false,
      recoveryActions: this.getRecoveryActions(category, code, errorId)
    };

    this.errors.set(errorId, error);
    this.notifyErrorListeners(error);
    
    // Auto-track analytics
    this.trackErrorAnalytics(error);
    
    return error;
  }

  /**
   * Handle authentication errors with specific recovery strategies
   */
  handleAuthError(authError: AuthenticationError): ErrorState {
    const recoveryActions: RecoveryAction[] = [];

    switch (authError.type) {
      case 'invalid_token':
      case 'expired_token':
        recoveryActions.push({
          id: 'clear_session',
          label: 'Sign in again',
          action: () => this.clearSessionAndRedirect(),
          primary: true
        });
        break;
      
      case 'malformed_token':
        recoveryActions.push({
          id: 'clear_session',
          label: 'Clear session and retry',
          action: () => this.clearSessionAndRedirect()
        });
        break;
      
      case 'service_down':
        recoveryActions.push({
          id: 'retry_auth',
          label: 'Try again',
          action: () => this.retryAuthentication()
        });
        recoveryActions.push({
          id: 'manual_escalation',
          label: 'Contact support',
          action: () => this.escalateToSupport('authentication')
        });
        break;
    }

    return this.createError(
      'authentication',
      authError.type,
      authError.message,
      authError.message,
      authError,
      authError.type === 'service_down' ? 'critical' : 'high'
    );
  }

  /**
   * Handle OTP errors with progressive lockout
   */
  handleOTPError(otpError: OTPError): ErrorState {
    const recoveryActions: RecoveryAction[] = [];

    switch (otpError.type) {
      case 'invalid':
        if (otpError.attemptsRemaining && otpError.attemptsRemaining > 0) {
          recoveryActions.push({
            id: 'retry_otp',
            label: `Try again (${otpError.attemptsRemaining} attempts left)`,
            action: () => this.retryOTPEntry(),
            primary: true
          });
        } else {
          recoveryActions.push({
            id: 'lockout_wait',
            label: 'Wait for lockout to expire',
            action: () => this.showLockoutTimer(otpError.lockoutTime || 0)
          });
        }
        break;
      
      case 'expired':
        recoveryActions.push({
          id: 'generate_new_otp',
          label: 'Send new code',
          action: () => this.generateNewOTP(),
          primary: true
        });
        break;
      
      case 'rate_limit':
        recoveryActions.push({
          id: 'wait_rate_limit',
          label: `Wait ${Math.ceil((otpError.lockoutTime || 0) / 60)} minutes`,
          action: () => this.showRateLimitTimer(otpError.lockoutTime || 0)
        });
        break;
      
      case 'service_down':
        recoveryActions.push({
          id: 'try_alternative',
          label: 'Try alternative method',
          action: () => this.tryAlternativeAuth()
        });
        recoveryActions.push({
          id: 'manual_escalation',
          label: 'Contact support',
          action: () => this.escalateToSupport('otp')
        });
        break;
    }

    return this.createError(
      'authentication',
      `otp_${otpError.type}`,
      otpError.message,
      otpError.message,
      otpError,
      otpError.type === 'service_down' ? 'critical' : 'medium'
    );
  }

  /**
   * Handle session warnings and timeouts
   */
  handleSessionWarning(warning: SessionWarning): void {
    // Implementation for session warnings
    console.warn('Session warning:', warning);
  }

  /**
   * Retry an error with exponential backoff
   */
  async retryError(errorId: string): Promise<boolean> {
    const error = this.errors.get(errorId);
    if (!error || !error.recoverable || error.retryCount >= error.maxRetries) {
      return false;
    }

    error.retryCount++;
    
    // Exponential backoff
    const delay = Math.min(1000 * Math.pow(2, error.retryCount - 1), 10000);
    await new Promise(resolve => setTimeout(resolve, delay));

    return true;
  }

  /**
   * Mark error as resolved
   */
  resolveError(errorId: string): void {
    const error = this.errors.get(errorId);
    if (error) {
      error.resolved = true;
      this.notifyRecoveryListeners(errorId);
    }
  }

  /**
   * Get all active errors
   */
  getActiveErrors(): ErrorState[] {
    return Array.from(this.errors.values()).filter(error => !error.resolved);
  }

  /**
   * Clear all errors
   */
  clearAllErrors(): void {
    this.errors.clear();
  }

  /**
   * Subscribe to error events
   */
  onError(listener: (error: ErrorState) => void): () => void {
    this.errorListeners.push(listener);
    return () => {
      const index = this.errorListeners.indexOf(listener);
      if (index > -1) {
        this.errorListeners.splice(index, 1);
      }
    };
  }

  /**
   * Subscribe to recovery events
   */
  onRecovery(listener: (errorId: string) => void): () => void {
    this.recoveryListeners.push(listener);
    return () => {
      const index = this.recoveryListeners.indexOf(listener);
      if (index > -1) {
        this.recoveryListeners.splice(index, 1);
      }
    };
  }

  // Private helper methods
  private isRecoverable(category: ErrorCategory, code: string): boolean {
    const nonRecoverableErrors = [
      'authentication_malformed_token',
      'session_corrupted',
      'api_unauthorized'
    ];
    return !nonRecoverableErrors.includes(`${category}_${code}`);
  }

  private getMaxRetries(category: ErrorCategory, code: string): number {
    const retryMap: Record<string, number> = {
      'api': 3,
      'network': 5,
      'ml': 2,
      'authentication': 1,
      'validation': 0
    };
    return retryMap[category] || 1;
  }

  private getRecoveryActions(category: ErrorCategory, code: string, errorId: string): RecoveryAction[] {
    // Default recovery actions based on category
    const actions: RecoveryAction[] = [];
    
    if (this.isRecoverable(category, code)) {
      actions.push({
        id: 'retry',
        label: 'Try again',
        action: async () => { await this.retryError(errorId); }
      });
    }

    actions.push({
      id: 'dismiss',
      label: 'Dismiss',
      action: () => this.resolveError(errorId)
    });

    return actions;
  }

  private notifyErrorListeners(error: ErrorState): void {
    this.errorListeners.forEach(listener => listener(error));
  }

  private notifyRecoveryListeners(errorId: string): void {
    this.recoveryListeners.forEach(listener => listener(errorId));
  }

  private trackErrorAnalytics(error: ErrorState): void {
    // Track error for analytics
    console.log('Error tracked:', {
      category: error.category,
      code: error.code,
      severity: error.severity,
      timestamp: error.timestamp
    });
  }

  // Recovery action implementations
  private async clearSessionAndRedirect(): Promise<void> {
    localStorage.removeItem('heybo_session');
    localStorage.removeItem('heybo_guest_session');
    localStorage.removeItem('heybo_platform_token');
    window.location.reload();
  }

  private async retryAuthentication(): Promise<void> {
    // Implementation for retrying authentication
    console.log('Retrying authentication...');
  }

  private async escalateToSupport(context: string): Promise<void> {
    // Implementation for escalating to support
    console.log('Escalating to support:', context);
  }

  private async retryOTPEntry(): Promise<void> {
    // Implementation for retrying OTP entry
    console.log('Retrying OTP entry...');
  }

  private async showLockoutTimer(lockoutTime: number): Promise<void> {
    // Implementation for showing lockout timer
    console.log('Showing lockout timer:', lockoutTime);
  }

  private async generateNewOTP(): Promise<void> {
    // Implementation for generating new OTP
    console.log('Generating new OTP...');
  }

  private async showRateLimitTimer(lockoutTime: number): Promise<void> {
    // Implementation for showing rate limit timer
    console.log('Showing rate limit timer:', lockoutTime);
  }

  private async tryAlternativeAuth(): Promise<void> {
    // Implementation for trying alternative authentication
    console.log('Trying alternative authentication...');
  }
}

export const errorHandler = ErrorHandler.getInstance();
