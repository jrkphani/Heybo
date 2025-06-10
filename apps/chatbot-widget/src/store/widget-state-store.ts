import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Widget-isolated state types
export interface WidgetSessionState {
  sessionId: string;
  isOpen: boolean;
  isMinimized: boolean;
  currentChatState: 'welcome' | 'ordering' | 'cart' | 'checkout' | 'complete';
  lastActivity: Date;
}

export interface WidgetLayoutState {
  mode: 'chat-only' | 'chat-with-embedded-ui' | 'dual-pane-active';
  paneConfig: 'single' | 'dual' | 'stacked';
  currentInterface: 'conversation' | 'bowl-builder' | 'cart-review';
  activeModal: string | null;
}

export interface WidgetUIState {
  showTypingIndicator: boolean;
  inputFocused: boolean;
  scrollPosition: number;
  currentBreakpoint: 'sm' | 'md' | 'lg' | 'xl';
  isDualPaneCapable: boolean;
}

export interface ConversationFlowState {
  currentStep: 'welcome' | 'location' | 'base' | 'protein' | 'sides' | 'sauce' | 'review' | 'checkout';
  completedSteps: string[];
  availableActions: string[];
  navigationHistory: Array<{
    step: string;
    timestamp: Date;
    data?: any;
  }>;
}

// Combined widget state interface
export interface WidgetState {
  session: WidgetSessionState;
  layout: WidgetLayoutState;
  ui: WidgetUIState;
  conversation: ConversationFlowState;
}

// Widget state actions
export interface WidgetStateActions {
  // Session actions
  openWidget: () => void;
  closeWidget: () => void;
  minimizeWidget: () => void;
  updateChatState: (state: WidgetSessionState['currentChatState']) => void;
  
  // Layout actions
  setLayoutMode: (mode: WidgetLayoutState['mode']) => void;
  switchInterface: (interfaceType: WidgetLayoutState['currentInterface']) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  
  // UI actions
  setTypingIndicator: (show: boolean) => void;
  setInputFocus: (focused: boolean) => void;
  updateScrollPosition: (position: number) => void;
  setBreakpoint: (breakpoint: WidgetUIState['currentBreakpoint']) => void;
  
  // Conversation actions
  progressToStep: (step: ConversationFlowState['currentStep']) => void;
  addToHistory: (step: string, data?: any) => void;
  goBackInHistory: () => void;
  resetConversation: () => void;
}

// Generate unique session ID for widget isolation
function generateSessionId(): string {
  return `heybo-widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Initial state factory
function createInitialState(): WidgetState {
  return {
    session: {
      sessionId: generateSessionId(),
      isOpen: false,
      isMinimized: false,
      currentChatState: 'welcome',
      lastActivity: new Date()
    },
    layout: {
      mode: 'chat-only',
      paneConfig: 'single',
      currentInterface: 'conversation',
      activeModal: null
    },
    ui: {
      showTypingIndicator: false,
      inputFocused: false,
      scrollPosition: 0,
      currentBreakpoint: 'sm',
      isDualPaneCapable: false
    },
    conversation: {
      currentStep: 'welcome',
      completedSteps: [],
      availableActions: ['start-order', 'view-menu', 'get-help'],
      navigationHistory: []
    }
  };
}

// Widget-isolated state store
export const useWidgetStateStore = create<WidgetState & WidgetStateActions>()(
  devtools(
    (set, get) => ({
      ...createInitialState(),
      
      // Session actions
      openWidget: () => set((state) => ({
        session: { 
          ...state.session, 
          isOpen: true, 
          isMinimized: false,
          lastActivity: new Date()
        }
      }), false, 'openWidget'),
      
      closeWidget: () => set((state) => ({
        session: { 
          ...state.session, 
          isOpen: false,
          lastActivity: new Date()
        }
      }), false, 'closeWidget'),
      
      minimizeWidget: () => set((state) => ({
        session: { 
          ...state.session, 
          isMinimized: true,
          lastActivity: new Date()
        }
      }), false, 'minimizeWidget'),
      
      updateChatState: (chatState) => set((state) => ({
        session: { 
          ...state.session, 
          currentChatState: chatState,
          lastActivity: new Date()
        }
      }), false, 'updateChatState'),
      
      // Layout actions
      setLayoutMode: (mode) => set((state) => ({
        layout: { ...state.layout, mode }
      }), false, 'setLayoutMode'),
      
      switchInterface: (interfaceType) => set((state) => ({
        layout: { ...state.layout, currentInterface: interfaceType }
      }), false, 'switchInterface'),
      
      openModal: (modalId) => set((state) => ({
        layout: { ...state.layout, activeModal: modalId }
      }), false, 'openModal'),
      
      closeModal: () => set((state) => ({
        layout: { ...state.layout, activeModal: null }
      }), false, 'closeModal'),
      
      // UI actions
      setTypingIndicator: (show) => set((state) => ({
        ui: { ...state.ui, showTypingIndicator: show }
      }), false, 'setTypingIndicator'),
      
      setInputFocus: (focused) => set((state) => ({
        ui: { ...state.ui, inputFocused: focused }
      }), false, 'setInputFocus'),
      
      updateScrollPosition: (position) => set((state) => ({
        ui: { ...state.ui, scrollPosition: position }
      }), false, 'updateScrollPosition'),
      
      setBreakpoint: (breakpoint) => {
        const isDualPaneCapable = breakpoint === 'lg' || breakpoint === 'xl';
        set((state) => ({
          ui: { 
            ...state.ui, 
            currentBreakpoint: breakpoint,
            isDualPaneCapable
          },
          layout: {
            ...state.layout,
            mode: isDualPaneCapable ? 'dual-pane-active' : 'chat-only',
            paneConfig: isDualPaneCapable ? 'dual' : 'single'
          }
        }), false, 'setBreakpoint');
      },
      
      // Conversation actions
      progressToStep: (step) => set((state) => {
        const newCompletedSteps = state.conversation.currentStep !== step 
          ? [...state.conversation.completedSteps, state.conversation.currentStep]
          : state.conversation.completedSteps;
          
        return {
          conversation: {
            ...state.conversation,
            currentStep: step,
            completedSteps: newCompletedSteps
          }
        };
      }, false, 'progressToStep'),
      
      addToHistory: (step, data) => set((state) => ({
        conversation: {
          ...state.conversation,
          navigationHistory: [
            ...state.conversation.navigationHistory,
            { step, timestamp: new Date(), data }
          ]
        }
      }), false, 'addToHistory'),
      
      goBackInHistory: () => set((state) => {
        const history = state.conversation.navigationHistory;
        if (history.length > 0) {
          const previousEntry = history[history.length - 1];
          if (previousEntry) {
            return {
              conversation: {
                ...state.conversation,
                currentStep: previousEntry.step as ConversationFlowState['currentStep'],
                navigationHistory: history.slice(0, -1)
              }
            };
          }
        }
        return state;
      }, false, 'goBackInHistory'),
      
      resetConversation: () => set((state) => ({
        conversation: {
          currentStep: 'welcome',
          completedSteps: [],
          availableActions: ['start-order', 'view-menu', 'get-help'],
          navigationHistory: []
        },
        session: {
          ...state.session,
          currentChatState: 'welcome'
        }
      }), false, 'resetConversation')
    }),
    {
      name: 'heybo-widget-state',
      // Only store essential state, not the entire widget state
      partialize: (state: WidgetState & WidgetStateActions) => ({
        session: {
          sessionId: state.session.sessionId,
          currentChatState: state.session.currentChatState
        },
        conversation: {
          currentStep: state.conversation.currentStep,
          completedSteps: state.conversation.completedSteps
        }
      })
    }
  )
);
