// HeyBo Chatbot Flow Manager
import type {
  User,
  ChatbotStep,
  Location,
  BowlComposition,
  CartItem,
  UnratedOrder,
  RatingData,
  ErrorState,
  SessionWarning,
  DietaryRestriction,
  Allergen
} from '../../types';
import { errorHandler } from './error-handler';
import { sessionManager } from './session-manager';
import { validationService } from './validation-service';
import { ratingService } from './rating-service';
import { mockMLAPI } from '../mock-api';

export interface FlowState {
  currentStep: ChatbotStep;
  user: User | null;
  selectedLocation: Location | null;
  currentBowl: Partial<BowlComposition> | null;
  cart: CartItem[];
  unratedOrders: UnratedOrder[];
  errors: ErrorState[];
  warnings: SessionWarning[];
  isLoading: boolean;
  flowHistory: ChatbotStep[];
}

export class FlowManager {
  private static instance: FlowManager;
  private state: FlowState;
  private stateListeners: ((state: FlowState) => void)[] = [];

  constructor() {
    this.state = {
      currentStep: 'authentication',
      user: null,
      selectedLocation: null,
      currentBowl: null,
      cart: [],
      unratedOrders: [],
      errors: [],
      warnings: [],
      isLoading: false,
      flowHistory: []
    };

    this.setupErrorHandling();
    this.setupSessionManagement();
  }

  static getInstance(): FlowManager {
    if (!FlowManager.instance) {
      FlowManager.instance = new FlowManager();
    }
    return FlowManager.instance;
  }

  /**
   * Initialize the chatbot flow with comprehensive error handling
   */
  async initializeFlow(): Promise<void> {
    try {
      this.setLoading(true);
      
      // Check for existing session
      const existingSession = sessionManager.getCurrentSession();
      if (existingSession && existingSession.userId) {
        // Try to restore user from session
        const user = await this.restoreUserFromSession(existingSession.userId);
        if (user) {
          this.setState({ user });
          await this.handleAuthenticatedUser(user);
          return;
        }
      }

      // Check for platform token
      const platformToken = this.checkPlatformToken();
      if (platformToken) {
        const user = await this.validatePlatformToken(platformToken);
        if (user) {
          this.setState({ user });
          await this.handleAuthenticatedUser(user);
          return;
        }
      }

      // No valid authentication found, start authentication flow
      this.transitionToStep('authentication');
    } catch (error) {
      this.handleFlowError('initialization_failed', error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Handle successful authentication
   */
  async handleAuthenticatedUser(user: User): Promise<void> {
    try {
      this.setLoading(true);

      // Create or update session
      const sessionResult = await sessionManager.createSession(user);
      if (!sessionResult.success) {
        throw new Error(sessionResult.error);
      }

      // Check for unrated orders
      const unratedOrders = await ratingService.checkUnratedOrders(user);
      this.setState({ unratedOrders });

      if (unratedOrders.length > 0) {
        // Show rating interface first
        this.transitionToStep('rating');
      } else {
        // Go directly to welcome
        this.transitionToStep('welcome');
      }
    } catch (error) {
      this.handleFlowError('authentication_processing_failed', error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Handle rating flow completion
   */
  async handleRatingCompletion(rating?: RatingData): Promise<void> {
    try {
      if (rating) {
        const result = await ratingService.submitRating(rating);
        if (!result.success) {
          // Rating failed but don't block the flow
          console.warn('Rating submission failed:', result.error);
        }
      }

      // Clear unrated orders and proceed to welcome
      this.setState({ unratedOrders: [] });
      this.transitionToStep('welcome');
    } catch (error) {
      // Don't block flow for rating errors
      console.warn('Rating completion error:', error);
      this.transitionToStep('welcome');
    }
  }

  /**
   * Handle location selection with validation
   */
  async handleLocationSelection(location: Location): Promise<void> {
    try {
      this.setLoading(true);

      // Validate location is operational
      const isOperational = await this.validateLocationOperational(location);
      if (!isOperational) {
        errorHandler.createError(
          'ordering',
          'location_unavailable',
          'Location temporarily unavailable',
          `${location.name} is currently closed or unavailable. Please select another location.`,
          { location },
          'medium'
        );
        return;
      }

      this.setState({ selectedLocation: location });
      this.transitionToStep('time-selection');
    } catch (error) {
      this.handleFlowError('location_selection_failed', error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Handle ML recommendations with comprehensive fallback
   */
  async handleMLRecommendations(
    dietaryFilters: DietaryRestriction[] = [],
    allergenFilters: Allergen[] = []
  ): Promise<void> {
    try {
      this.setLoading(true);
      this.transitionToStep('ml-recommendations');

      const result = await mockMLAPI.getRecommendations(
        this.state.user?.id,
        dietaryFilters,
        allergenFilters,
        this.state.selectedLocation?.id
      );

      if (result.fallbackUsed) {
        // Show user that fallback was used
        const fallbackMessage = this.getFallbackMessage(result.source);
        this.addWarning({
          type: 'timeout',
          message: fallbackMessage,
          actions: [
            {
              id: 'continue',
              label: 'Continue with suggestions',
              action: () => this.dismissWarning('ml_fallback')
            },
            {
              id: 'manual_build',
              label: 'Build manually instead',
              action: () => this.transitionToStep('create-your-own')
            }
          ]
        });
      }

      // Cache successful ML results
      if (!result.fallbackUsed) {
        mockMLAPI.cacheRecommendations(result.recommendations);
      }

      // Store recommendations in state (would be handled by component)
      console.log('ML recommendations loaded:', result);
    } catch (error) {
      this.handleFlowError('ml_recommendations_failed', error);
      // Fallback to signature bowls
      this.transitionToStep('signature-bowls');
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Handle bowl validation and cart addition
   */
  async handleAddToCart(bowl: BowlComposition): Promise<void> {
    try {
      this.setLoading(true);

      // Validate bowl composition
      const validation = validationService.validateBowl(bowl, this.state.selectedLocation || undefined);
      
      if (!validation.canProceed) {
        // Show blocking errors
        validation.errors.forEach(error => {
          if ('blocking' in error && error.blocking) {
            errorHandler.createError(
              'validation',
              error.code,
              error.message,
              error.message,
              { bowl, error },
              'medium'
            );
          }
        });
        return;
      }

      // Show warnings but allow proceeding
      if (validation.warnings.length > 0) {
        validation.warnings.forEach(warning => {
          if (!warning.dismissible) {
            this.addWarning({
              type: 'timeout',
              message: warning.message,
              actions: [
                {
                  id: 'proceed',
                  label: 'Add to cart anyway',
                  action: () => this.proceedWithCartAddition(bowl),
                  primary: true
                },
                {
                  id: 'modify',
                  label: 'Modify bowl',
                  action: () => this.transitionToStep('bowl-customization')
                }
              ]
            });
            return; // Show one warning at a time
          }
        });
      }

      await this.proceedWithCartAddition(bowl);
    } catch (error) {
      this.handleFlowError('add_to_cart_failed', error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Handle cart validation before checkout
   */
  async handleCartValidation(): Promise<boolean> {
    try {
      this.setLoading(true);

      const validation = await validationService.validateCart(
        this.state.cart,
        this.state.selectedLocation || undefined
      );

      if (!validation.isValid) {
        // Show blocking errors
        validation.errors.forEach(error => {
          if ('blocking' in error && error.blocking) {
            errorHandler.createError(
              'cart',
              error.code,
              error.message,
              error.message,
              { cart: this.state.cart },
              'high'
            );
          }
        });
        return false;
      }

      // Handle item-specific issues (if available)
      // Note: Basic validation doesn't include item details

      return true;
    } catch (error) {
      this.handleFlowError('cart_validation_failed', error);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Transition to a new step with history tracking
   */
  private transitionToStep(step: ChatbotStep): void {
    const previousStep = this.state.currentStep;
    this.setState({
      currentStep: step,
      flowHistory: [...this.state.flowHistory, previousStep]
    });
  }

  /**
   * Go back to previous step
   */
  goBack(): void {
    const history = this.state.flowHistory;
    if (history.length > 0) {
      const previousStep = history[history.length - 1];
      if (previousStep) {
        this.setState({
          currentStep: previousStep,
          flowHistory: history.slice(0, -1)
        });
      }
    }
  }

  /**
   * Handle flow errors with recovery options
   */
  private handleFlowError(code: string, error: any): void {
    errorHandler.createError(
      'ordering',
      code,
      error.message || 'Flow error occurred',
      'Something went wrong. Please try again or contact support.',
      error,
      'high'
    );
  }

  /**
   * Setup error handling listeners
   */
  private setupErrorHandling(): void {
    errorHandler.onError((error) => {
      this.setState({
        errors: [...this.state.errors, error]
      });
    });

    errorHandler.onRecovery((errorId) => {
      this.setState({
        errors: this.state.errors.filter(e => e.id !== errorId)
      });
    });
  }

  /**
   * Setup session management listeners
   */
  private setupSessionManagement(): void {
    sessionManager.onWarning((warning) => {
      this.addWarning(warning);
    });

    sessionManager.onSessionChange((session) => {
      if (!session) {
        // Session expired or cleared
        this.setState({
          user: null,
          currentStep: 'authentication',
          cart: [],
          selectedLocation: null
        });
      }
    });
  }

  // Helper methods
  private setLoading(isLoading: boolean): void {
    this.setState({ isLoading });
  }

  private setState(updates: Partial<FlowState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyStateListeners();
  }

  private addWarning(warning: SessionWarning): void {
    this.setState({
      warnings: [...this.state.warnings, warning]
    });
  }

  private dismissWarning(type: string): void {
    this.setState({
      warnings: this.state.warnings.filter(w => w.type !== type)
    });
  }

  private async proceedWithCartAddition(bowl: BowlComposition): Promise<void> {
    const cartItem: CartItem = {
      id: `cart_${Date.now()}`,
      bowl,
      quantity: 1,
      addedAt: new Date()
    };

    this.setState({
      cart: [...this.state.cart, cartItem]
    });

    this.transitionToStep('cart-review');
  }

  private updateCartItemPrice(itemId: string, newPrice: number): void {
    const updatedCart = this.state.cart.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          bowl: {
            ...item.bowl,
            totalPrice: newPrice
          }
        };
      }
      return item;
    });

    this.setState({ cart: updatedCart });
  }

  private removeFromCart(itemId: string): void {
    this.setState({
      cart: this.state.cart.filter(item => item.id !== itemId)
    });
  }

  private removeUnavailableItems(): void {
    // Implementation would check availability and remove items
    console.log('Removing unavailable items...');
  }

  private async validateLocationOperational(location: Location): Promise<boolean> {
    // Mock validation - in real app, this would check operational status
    return location.isActive && Math.random() > 0.05; // 5% chance of being down
  }

  private checkPlatformToken(): string | null {
    return localStorage.getItem('heybo_platform_token') || 
           document.cookie.split('; ').find(row => row.startsWith('heybo_token='))?.split('=')[1] || 
           null;
  }

  private async validatePlatformToken(token: string): Promise<User | null> {
    // Mock validation - in real app, this would call platform API
    if (token.startsWith('heybo_') || token === 'valid-platform-token') {
      return {
        id: 'platform-user',
        name: 'Platform User',
        email: 'user@heybo.sg',
        phone: '+65 9123 4567',
        type: 'registered',
        preferences: {
          dietaryRestrictions: [],
          allergens: [],
          spiceLevel: 'medium',
          proteinPreference: 'any'
        }
      };
    }
    return null;
  }

  private async restoreUserFromSession(userId: string): Promise<User | null> {
    // Mock user restoration - in real app, this would fetch user data
    return {
      id: userId,
      name: 'Restored User',
      email: 'restored@heybo.sg',
      phone: '+65 9123 4567',
      type: 'registered',
      preferences: {
        dietaryRestrictions: [],
        allergens: [],
        spiceLevel: 'medium',
        proteinPreference: 'any'
      }
    };
  }

  private getFallbackMessage(source: string): string {
    const messages = {
      cached: 'Using previously saved recommendations while our AI is busy.',
      popular: 'Showing popular choices while our personalization service is unavailable.',
      signature: 'Our AI recommendations are temporarily unavailable. Here are our signature bowls instead.'
    };
    return messages[source as keyof typeof messages] || 'Using alternative recommendations.';
  }

  // Public API
  getState(): FlowState {
    return { ...this.state };
  }

  onStateChange(listener: (state: FlowState) => void): () => void {
    this.stateListeners.push(listener);
    return () => {
      const index = this.stateListeners.indexOf(listener);
      if (index > -1) {
        this.stateListeners.splice(index, 1);
      }
    };
  }

  private notifyStateListeners(): void {
    this.stateListeners.forEach(listener => listener(this.state));
  }
}

export const flowManager = FlowManager.getInstance();
