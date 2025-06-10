import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { 
  User, 
  OrderStep, 
  Location, 
  BowlComposition, 
  CartItem, 
  MessageType,
  ErrorState 
} from "@heybo/types";

interface ChatbotState {
  // User session
  user: User | null;
  sessionType: 'registered' | 'guest' | 'unauthenticated';
  sessionId: string | null;
  
  // Order state
  currentStep: OrderStep;
  selectedLocation: Location | null;
  orderTime: Date | null;
  currentBowl: BowlComposition | null;
  cart: CartItem[];
  
  // UI state
  isWidgetOpen: boolean;
  isLoading: boolean;
  errors: ErrorState[];
  
  // Chat state
  messages: MessageType[];
  
  // Actions
  setUser: (user: User | null) => void;
  setSessionType: (type: 'registered' | 'guest' | 'unauthenticated') => void;
  setCurrentStep: (step: OrderStep) => void;
  setSelectedLocation: (location: Location | null) => void;
  setOrderTime: (time: Date | null) => void;
  updateBowl: (ingredient: any, action: 'add' | 'remove') => void;
  addToCart: (bowl: BowlComposition) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  setWidgetOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  addError: (error: ErrorState) => void;
  clearErrors: () => void;
  addMessage: (message: MessageType) => void;
  clearMessages: () => void;
  resetSession: () => void;
}

const initialState = {
  user: null,
  sessionType: 'unauthenticated' as const,
  sessionId: null,
  currentStep: 'welcome' as OrderStep,
  selectedLocation: null,
  orderTime: null,
  currentBowl: null,
  cart: [],
  isWidgetOpen: false,
  isLoading: false,
  errors: [],
  messages: [],
};

export const useChatbotStore = create<ChatbotState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      setUser: (user) => set({ user }),
      
      setSessionType: (sessionType) => set({ sessionType }),
      
      setCurrentStep: (currentStep) => set({ currentStep }),
      
      setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
      
      setOrderTime: (orderTime) => set({ orderTime }),
      
      updateBowl: (ingredient, action) => set((state) => {
        const currentBowl = state.currentBowl;
        if (!currentBowl) return state;
        
        // Type-safe bowl updates with validation
        // This would implement the actual bowl composition logic
        return state;
      }),
      
      addToCart: (bowl) => set((state) => ({
        cart: [...state.cart, {
          id: Date.now().toString(),
          bowl,
          quantity: 1,
          addedAt: new Date(),
        }],
      })),
      
      removeFromCart: (itemId) => set((state) => ({
        cart: state.cart.filter(item => item.id !== itemId),
      })),
      
      clearCart: () => set({ cart: [] }),
      
      setWidgetOpen: (isWidgetOpen) => set({ isWidgetOpen }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      addError: (error) => set((state) => ({
        errors: [...state.errors, error],
      })),
      
      clearErrors: () => set({ errors: [] }),
      
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message],
      })),
      
      clearMessages: () => set({ messages: [] }),
      
      resetSession: () => set(initialState),
    }),
    {
      name: 'heybo-chatbot-store',
    }
  )
);
