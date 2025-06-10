// HeyBo Chatbot Widget Store
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  ChatbotState,
  ChatMessage,
  User,
  Location,
  BowlComposition,
  HeyBoIngredient,
  ChatbotStep,
  WidgetState,
  IngredientCategory,
  ErrorState,
  SessionWarning,
  UnratedOrder,
  RatingData,
  BowlValidationResult,
  CartValidationResult,
  MLRecommendationSource
} from '../types';
import { createSession, updateCurrentStep, getCurrentSession } from '../lib/api/session';
import { errorHandler } from '../lib/services/error-handler';
import { sessionManager } from '../lib/services/session-manager';
import { validationService } from '../lib/services/validation-service';
import { ratingService } from '../lib/services/rating-service';
import { flowManager } from '../lib/services/flow-manager';
import { mockMLAPI } from '../lib/mock-api';

interface AuthState {
  isAuthenticated: boolean;
  authenticationStep: 'checking' | 'login' | 'otp' | 'authenticated';
  sessionId: string | null;
  sessionExpiresAt: Date | null;
}

interface EnhancedChatbotState extends ChatbotState {
  // Error and warning management
  errors: ErrorState[];
  warnings: SessionWarning[];

  // Rating system
  unratedOrders: UnratedOrder[];
  showRatingInterface: boolean;

  // Enhanced flow management
  flowHistory: ChatbotStep[];
  canGoBack: boolean;

  // Validation states
  bowlValidation: BowlValidationResult | null;
  cartValidation: CartValidationResult | null;

  // ML and fallback states
  mlFallbackUsed: boolean;
  mlSource: MLRecommendationSource | null;
  mlConfidence: number;
}

interface ChatbotStore extends EnhancedChatbotState {
  // Authentication state
  auth: AuthState;
  
  // Additional UI state
  isTyping: boolean;

  // Actions
  setWidgetState: (state: WidgetState) => void;
  setTyping: (typing: boolean) => void;
  setCurrentStep: (step: ChatbotStep) => void;
  setUser: (user: User | null) => void;
  setSelectedLocation: (location: Location | null) => void;
  setCurrentBowl: (bowl: Partial<BowlComposition> | null) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Enhanced error and warning management
  addError: (error: ErrorState) => void;
  removeError: (errorId: string) => void;
  clearErrors: () => void;
  addWarning: (warning: SessionWarning) => void;
  removeWarning: (warningType: string) => void;
  clearWarnings: () => void;

  // Rating system actions
  setUnratedOrders: (orders: UnratedOrder[]) => void;
  setShowRatingInterface: (show: boolean) => void;
  submitRating: (rating: RatingData) => Promise<void>;
  skipRating: (orderId?: string) => Promise<void>;

  // Enhanced flow management
  goBack: () => void;
  resetFlow: () => void;

  // Validation actions
  validateCurrentBowl: () => Promise<void>;
  validateCart: () => Promise<boolean>;

  // ML and recommendation actions
  getMLRecommendations: (dietaryFilters?: string[], allergenFilters?: string[]) => Promise<any>;
  handleMLFallback: (source: string, confidence: number) => void;

  // Authentication actions
  setAuthenticated: (authenticated: boolean) => void;
  setAuthenticationStep: (step: AuthState['authenticationStep']) => void;
  initializeAuth: () => Promise<void>;
  authenticateUser: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  
  // Bowl building actions
  setBowlBase: (base: HeyBoIngredient) => void;
  setBowlProtein: (protein: HeyBoIngredient | null) => void;
  addBowlSide: (side: HeyBoIngredient) => void;
  removeBowlSide: (sideId: string) => void;
  setBowlSauce: (sauce: HeyBoIngredient | null) => void;
  setBowlGarnish: (garnish: HeyBoIngredient | null) => void;
  addExtraProtein: (protein: HeyBoIngredient) => void;
  removeExtraProtein: (proteinId: string) => void;
  addExtraSide: (side: HeyBoIngredient) => void;
  removeExtraSide: (sideId: string) => void;
  
  // Utility actions
  resetBowl: () => void;
  resetChat: () => void;
  calculateBowlWeight: () => number;
  calculateBowlPrice: () => number;
  validateBowl: () => { isValid: boolean; warnings: string[] };
}

const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateSessionId = () => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useChatbotStore = create<ChatbotStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentStep: 'welcome',
        user: null,
        selectedLocation: null,
        currentBowl: null,
        messages: [],
        isLoading: false,
        error: null,
        sessionId: generateSessionId(),
        widgetState: 'collapsed',
        isTyping: false,

        // Enhanced state
        errors: [],
        warnings: [],
        unratedOrders: [],
        showRatingInterface: false,
        flowHistory: [],
        canGoBack: false,
        bowlValidation: null,
        cartValidation: null,
        mlFallbackUsed: false,
        mlSource: null,
        mlConfidence: 0,

        // Authentication state
        auth: {
          isAuthenticated: false,
          authenticationStep: 'checking',
          sessionId: null,
          sessionExpiresAt: null,
        },

        // Widget state actions
        setWidgetState: (state: WidgetState) => {
          set({ widgetState: state }, false, 'setWidgetState');
        },

        setTyping: (typing: boolean) => {
          set({ isTyping: typing }, false, 'setTyping');
        },

        setCurrentStep: (step: ChatbotStep) => {
          set({ currentStep: step }, false, 'setCurrentStep');
        },

        setUser: (user: User | null) => {
          set({ user }, false, 'setUser');
        },

        setSelectedLocation: (location: Location | null) => {
          set({ selectedLocation: location }, false, 'setSelectedLocation');
        },

        setCurrentBowl: (bowl: Partial<BowlComposition> | null) => {
          set({ currentBowl: bowl }, false, 'setCurrentBowl');
        },

        addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
          const newMessage: ChatMessage = {
            ...message,
            id: generateId(),
            timestamp: new Date()
          };
          
          set(
            (state) => ({
              messages: [...state.messages, newMessage]
            }),
            false,
            'addMessage'
          );
        },

        clearMessages: () => {
          set({ messages: [] }, false, 'clearMessages');
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading }, false, 'setLoading');
        },

        setError: (error: string | null) => {
          set({ error }, false, 'setError');
        },

        // Enhanced error and warning management
        addError: (error: ErrorState) => {
          set((state) => ({
            errors: [...state.errors, error]
          }), false, 'addError');
        },

        removeError: (errorId: string) => {
          set((state) => ({
            errors: state.errors.filter(e => e.id !== errorId)
          }), false, 'removeError');
        },

        clearErrors: () => {
          set({ errors: [] }, false, 'clearErrors');
        },

        addWarning: (warning: SessionWarning) => {
          set((state) => ({
            warnings: [...state.warnings, warning]
          }), false, 'addWarning');
        },

        removeWarning: (warningType: string) => {
          set((state) => ({
            warnings: state.warnings.filter(w => w.type !== warningType)
          }), false, 'removeWarning');
        },

        clearWarnings: () => {
          set({ warnings: [] }, false, 'clearWarnings');
        },

        // Rating system actions
        setUnratedOrders: (orders: UnratedOrder[]) => {
          set({ unratedOrders: orders }, false, 'setUnratedOrders');
        },

        setShowRatingInterface: (show: boolean) => {
          set({ showRatingInterface: show }, false, 'setShowRatingInterface');
        },

        submitRating: async (rating: RatingData) => {
          try {
            const result = await ratingService.submitRating(rating);
            if (result.success) {
              // Remove the rated order from unrated orders
              set((state) => ({
                unratedOrders: state.unratedOrders.filter(order => order.orderId !== rating.orderId)
              }), false, 'submitRating:success');
            } else {
              throw new Error(result.error);
            }
          } catch (error) {
            const errorState = errorHandler.createError(
              'api',
              'rating_submission_failed',
              'Failed to submit rating',
              'Unable to save your rating. Please try again.',
              error,
              'medium'
            );
            get().addError(errorState);
          }
        },

        skipRating: async (orderId?: string) => {
          try {
            if (orderId) {
              await ratingService.skipRating(orderId);
              set((state) => ({
                unratedOrders: state.unratedOrders.filter(order => order.orderId !== orderId)
              }), false, 'skipRating:single');
            } else {
              // Skip all ratings
              set({ unratedOrders: [], showRatingInterface: false }, false, 'skipRating:all');
            }
          } catch (error) {
            console.warn('Failed to skip rating:', error);
            // Don't block the flow for skip failures
          }
        },

        // Enhanced flow management
        goBack: () => {
          set((state) => {
            if (state.flowHistory.length > 0) {
              const previousStep = state.flowHistory[state.flowHistory.length - 1];
              if (previousStep) {
                return {
                  currentStep: previousStep,
                  flowHistory: state.flowHistory.slice(0, -1),
                  canGoBack: state.flowHistory.length > 1
                };
              }
            }
            return state;
          }, false, 'goBack');
        },

        resetFlow: () => {
          set({
            currentStep: 'welcome',
            flowHistory: [],
            canGoBack: false,
            errors: [],
            warnings: [],
            currentBowl: null
          }, false, 'resetFlow');
        },

        // Validation actions
        validateCurrentBowl: async () => {
          const { currentBowl, selectedLocation } = get();
          if (!currentBowl) return;

          try {
            const validation = validationService.validateBowl(currentBowl, selectedLocation || undefined);
            set({ bowlValidation: validation }, false, 'validateCurrentBowl');

            // Add warnings as errors if they're not dismissible
            validation.warnings.forEach(warning => {
              if (!warning.dismissible) {
                const errorState = errorHandler.createError(
                  'validation',
                  warning.code,
                  warning.message,
                  warning.message,
                  { bowl: currentBowl },
                  warning.severity === 'warning' ? 'medium' : 'low'
                );
                get().addError(errorState);
              }
            });
          } catch (error) {
            const errorState = errorHandler.createError(
              'validation',
              'bowl_validation_failed',
              'Bowl validation failed',
              'Unable to validate bowl composition.',
              error,
              'low'
            );
            get().addError(errorState);
          }
        },

        validateCart: async () => {
          try {
            // This would validate the cart items
            // For now, return true as cart validation is not implemented in the current store
            return true;
          } catch (error) {
            const errorState = errorHandler.createError(
              'validation',
              'cart_validation_failed',
              'Cart validation failed',
              'Unable to validate cart contents.',
              error,
              'medium'
            );
            get().addError(errorState);
            return false;
          }
        },

        // ML and recommendation actions
        getMLRecommendations: async (dietaryFilters: string[] = [], allergenFilters: string[] = []) => {
          const { user, selectedLocation } = get();

          try {
            set({ isLoading: true }, false, 'getMLRecommendations:start');

            const result = await mockMLAPI.getRecommendations(
              user?.id,
              dietaryFilters as any,
              allergenFilters as any,
              selectedLocation?.id
            );

            set({
              mlFallbackUsed: result.fallbackUsed,
              mlSource: result.source,
              mlConfidence: result.confidence,
              isLoading: false
            }, false, 'getMLRecommendations:success');

            if (result.fallbackUsed) {
              get().handleMLFallback(result.source, result.confidence);
            }

            return result.recommendations;
          } catch (error) {
            set({ isLoading: false }, false, 'getMLRecommendations:error');

            const errorState = errorHandler.createError(
              'ml',
              'recommendations_failed',
              'ML recommendations failed',
              'Unable to get personalized recommendations. Showing popular choices instead.',
              error,
              'medium'
            );
            get().addError(errorState);

            // Trigger fallback
            get().handleMLFallback('signature', 0.3);
            throw error;
          }
        },

        handleMLFallback: (source: string, confidence: number) => {
          set({
            mlFallbackUsed: true,
            mlSource: source as MLRecommendationSource,
            mlConfidence: confidence
          }, false, 'handleMLFallback');

          const fallbackMessages = {
            cached: 'Using previously saved recommendations while our AI is busy.',
            popular: 'Showing popular choices while our personalization service is unavailable.',
            signature: 'Our AI recommendations are temporarily unavailable. Here are our signature bowls instead.'
          };

          const message = fallbackMessages[source as keyof typeof fallbackMessages] || 'Using alternative recommendations.';

          const warning: SessionWarning = {
            type: 'timeout',
            message,
            actions: [
              {
                id: 'continue',
                label: 'Continue with suggestions',
                action: () => get().removeWarning('timeout')
              },
              {
                id: 'manual_build',
                label: 'Build manually instead',
                action: () => {
                  get().removeWarning('timeout');
                  get().setCurrentStep('create-your-own');
                }
              }
            ]
          };

          get().addWarning(warning);
        },

        // Authentication actions
        setAuthenticated: (authenticated: boolean) => {
          set((state) => ({
            auth: { ...state.auth, isAuthenticated: authenticated }
          }), false, 'setAuthenticated');
        },

        setAuthenticationStep: (step: AuthState['authenticationStep']) => {
          set((state) => ({
            auth: { ...state.auth, authenticationStep: step }
          }), false, 'setAuthenticationStep');
        },

        initializeAuth: async () => {
          const session = getCurrentSession();
          if (session) {
            set((state) => ({
              auth: {
                ...state.auth,
                isAuthenticated: true,
                authenticationStep: 'authenticated',
                sessionId: session.sessionId,
                sessionExpiresAt: new Date(session.expiresAt)
              },
              // Always start with welcome step for authenticated users
              currentStep: 'welcome',
              sessionId: session.sessionId
            }), false, 'initializeAuth');
          } else {
            set((state) => ({
              auth: {
                ...state.auth,
                isAuthenticated: false,
                authenticationStep: 'login'
              },
              currentStep: 'welcome'
            }), false, 'initializeAuth');
          }
        },

        authenticateUser: async (user: User) => {
          try {
            const sessionResponse = await createSession(user);
            if (sessionResponse.success && sessionResponse.session) {
              set((state) => ({
                user,
                auth: {
                  ...state.auth,
                  isAuthenticated: true,
                  authenticationStep: 'authenticated',
                  sessionId: sessionResponse.session!.sessionId,
                  sessionExpiresAt: new Date(sessionResponse.session!.expiresAt)
                },
                sessionId: sessionResponse.session!.sessionId,
                currentStep: 'welcome',
                // Clear any previous state that might interfere
                messages: [],
                errors: [],
                warnings: [],
                showRatingInterface: false
              }), false, 'authenticateUser');

              // Update session step to ensure it's saved
              await updateCurrentStep('welcome');
            } else {
              throw new Error('Failed to create session');
            }
          } catch (error) {
            set((state) => ({
              error: 'Authentication failed',
              auth: {
                ...state.auth,
                isAuthenticated: false,
                authenticationStep: 'login'
              }
            }), false, 'authenticateUser:error');
          }
        },

        logout: async () => {
          try {
            // Clear session data
            localStorage.removeItem('heybo_session');
            localStorage.removeItem('heybo_guest_session');
            localStorage.removeItem('heybo_platform_token');

            set({
              user: null,
              auth: {
                isAuthenticated: false,
                authenticationStep: 'login',
                sessionId: null,
                sessionExpiresAt: null
              },
              currentStep: 'welcome',
              messages: [],
              selectedLocation: null,
              currentBowl: null,
              error: null
            }, false, 'logout');
          } catch (error) {
            console.error('Logout error:', error);
          }
        },

        // Bowl building actions
        setBowlBase: (base: HeyBoIngredient) => {
          set(
            (state) => ({
              currentBowl: {
                ...state.currentBowl,
                base
              }
            }),
            false,
            'setBowlBase'
          );
        },

        setBowlProtein: (protein: HeyBoIngredient | null) => {
          set(
            (state) => ({
              currentBowl: {
                ...state.currentBowl,
                protein: protein || undefined
              }
            }),
            false,
            'setBowlProtein'
          );
        },

        addBowlSide: (side: HeyBoIngredient) => {
          set(
            (state) => {
              const currentSides = state.currentBowl?.sides || [];
              
              // Check if already selected
              if (currentSides.some(s => s.id === side.id)) {
                return state;
              }
              
              // Limit to 3 sides
              if (currentSides.length >= 3) {
                return state;
              }
              
              return {
                currentBowl: {
                  ...state.currentBowl,
                  sides: [...currentSides, side]
                }
              };
            },
            false,
            'addBowlSide'
          );
        },

        removeBowlSide: (sideId: string) => {
          set(
            (state) => ({
              currentBowl: {
                ...state.currentBowl,
                sides: state.currentBowl?.sides?.filter(side => side.id !== sideId) || []
              }
            }),
            false,
            'removeBowlSide'
          );
        },

        setBowlSauce: (sauce: HeyBoIngredient | null) => {
          set(
            (state) => ({
              currentBowl: {
                ...state.currentBowl,
                sauce: sauce || undefined
              }
            }),
            false,
            'setBowlSauce'
          );
        },

        setBowlGarnish: (garnish: HeyBoIngredient | null) => {
          set(
            (state) => ({
              currentBowl: {
                ...state.currentBowl,
                garnish: garnish || undefined
              }
            }),
            false,
            'setBowlGarnish'
          );
        },

        addExtraProtein: (protein: HeyBoIngredient) => {
          set(
            (state) => {
              const currentExtraProtein = state.currentBowl?.extraProtein || [];
              
              // Check if already selected
              if (currentExtraProtein.some(p => p.id === protein.id)) {
                return state;
              }
              
              return {
                currentBowl: {
                  ...state.currentBowl,
                  extraProtein: [...currentExtraProtein, protein]
                }
              };
            },
            false,
            'addExtraProtein'
          );
        },

        removeExtraProtein: (proteinId: string) => {
          set(
            (state) => ({
              currentBowl: {
                ...state.currentBowl,
                extraProtein: state.currentBowl?.extraProtein?.filter(protein => protein.id !== proteinId) || []
              }
            }),
            false,
            'removeExtraProtein'
          );
        },

        addExtraSide: (side: HeyBoIngredient) => {
          set(
            (state) => {
              const currentExtraSides = state.currentBowl?.extraSides || [];
              
              // Check if already selected
              if (currentExtraSides.some(s => s.id === side.id)) {
                return state;
              }
              
              return {
                currentBowl: {
                  ...state.currentBowl,
                  extraSides: [...currentExtraSides, side]
                }
              };
            },
            false,
            'addExtraSide'
          );
        },

        removeExtraSide: (sideId: string) => {
          set(
            (state) => ({
              currentBowl: {
                ...state.currentBowl,
                extraSides: state.currentBowl?.extraSides?.filter(side => side.id !== sideId) || []
              }
            }),
            false,
            'removeExtraSide'
          );
        },

        // Utility actions
        resetBowl: () => {
          set({ currentBowl: null }, false, 'resetBowl');
        },

        resetChat: () => {
          set({
            currentStep: 'welcome',
            user: null,
            selectedLocation: null,
            currentBowl: null,
            messages: [],
            isLoading: false,
            error: null,
            sessionId: generateSessionId()
          }, false, 'resetChat');
        },

        calculateBowlWeight: () => {
          const { currentBowl } = get();
          if (!currentBowl) return 0;
          
          let weight = 0;
          if (currentBowl.base) weight += currentBowl.base.weight;
          if (currentBowl.protein) weight += currentBowl.protein.weight;
          if (currentBowl.sides) weight += currentBowl.sides.reduce((sum, side) => sum + side.weight, 0);
          if (currentBowl.extraSides) weight += currentBowl.extraSides.reduce((sum, side) => sum + side.weight, 0);
          if (currentBowl.extraProtein) weight += currentBowl.extraProtein.reduce((sum, protein) => sum + protein.weight, 0);
          if (currentBowl.sauce) weight += currentBowl.sauce.weight;
          if (currentBowl.garnish) weight += currentBowl.garnish.weight;
          
          return weight;
        },

        calculateBowlPrice: () => {
          const { currentBowl } = get();
          if (!currentBowl) return 1290; // Base price $12.90
          
          let price = 1290; // Base price
          if (currentBowl.base) price += currentBowl.base.price;
          if (currentBowl.protein) price += currentBowl.protein.price;
          if (currentBowl.sides) price += currentBowl.sides.reduce((sum, side) => sum + side.price, 0);
          if (currentBowl.extraSides) price += currentBowl.extraSides.reduce((sum, side) => sum + side.price, 0);
          if (currentBowl.extraProtein) price += currentBowl.extraProtein.reduce((sum, protein) => sum + protein.price, 0);
          if (currentBowl.sauce) price += currentBowl.sauce.price;
          if (currentBowl.garnish) price += currentBowl.garnish.price;
          
          return price;
        },

        validateBowl: () => {
          const { currentBowl, calculateBowlWeight } = get();
          const warnings: string[] = [];
          
          if (!currentBowl?.base) {
            warnings.push("Base is required for all HeyBo bowls");
          }
          
          const weight = calculateBowlWeight();
          if (weight > 720) {
            warnings.push(`Bowl is getting quite full! Current weight: ${weight}g (${Math.round(weight/900*100)}% of maximum)`);
          }
          if (weight > 900) {
            warnings.push(`Bowl exceeds maximum weight of 900g. Current: ${weight}g`);
          }
          
          const totalSides = (currentBowl?.sides?.length || 0) + (currentBowl?.extraSides?.length || 0);
          if (totalSides > 3) {
            warnings.push("More than 3 sides may affect taste balance");
          }
          
          return {
            isValid: warnings.length === 0 || warnings.every(w => w.includes("may affect")),
            warnings
          };
        }
      }),
      {
        name: 'heybo-chatbot-storage',
        partialize: (state) => ({
          // Only persist essential data, not UI state
          user: state.user,
          selectedLocation: state.selectedLocation,
          currentBowl: state.currentBowl,
          sessionId: state.sessionId
        })
      }
    ),
    {
      name: 'heybo-chatbot-store'
    }
  )
);
