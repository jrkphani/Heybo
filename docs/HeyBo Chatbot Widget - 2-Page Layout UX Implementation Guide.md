# HeyBo Chatbot Widget - Universal Navigation & 2-Page Layout Guide

**Version:** 3.0  
**Date:** June 2025  
**Focus:** Widget-Embedded Navigation System + Dual-Pane Layout for HeyBo Grain Bowl Ordering  
**Context:** Chatbot Widget Embedded in HeyBo Website  
**Brand:** HeyBo - Warm Grain Bowls, Bold Energy, Wholesome Nutrition

---

## Table of Contents

1. [Widget-Embedded Navigation Architecture](#1-widget-embedded-navigation-architecture)
2. [Chatbot Widget Navigation Components](#2-chatbot-widget-navigation-components)
3. [Widget State Management & Isolation](#3-widget-state-management--isolation)
4. [Single-Pane Widget Navigation](#4-single-pane-widget-navigation)
5. [2-Page Layout Within Widget Constraints](#5-2-page-layout-within-widget-constraints)
6. [Widget Responsive Behavior](#6-widget-responsive-behavior)
7. [HeyBo Website Integration](#7-heybo-website-integration)
8. [Conversational Navigation Flow](#8-conversational-navigation-flow)
9. [Widget Accessibility & Focus Management](#9-widget-accessibility--focus-management)
10. [Chat Interface Navigation Patterns](#10-chat-interface-navigation-patterns)
11. [Widget Implementation Guide](#11-widget-implementation-guide)
12. [Performance & Widget Constraints](#12-performance--widget-constraints)

---

## 1. Widget-Embedded Navigation Architecture

### **Chatbot Widget Navigation Constraints**

The navigation system operates within the constraints of a chatbot widget embedded in the HeyBo website:

#### **Widget Container Limitations**

- **Fixed Widget Dimensions**:
  - Desktop: 400px width × 600px max height
  - Tablet: 360px width × 500px max height  
  - Mobile: Full screen overlay when active
- **Embedded Context**: Widget exists within parent HeyBo website, not standalone
- **Z-Index Management**: Widget must layer above website content without conflicts
- **Focus Trapping**: Navigation must stay within widget boundaries

#### **Conversational Navigation Philosophy**

- **Chat-First Design**: Navigation integrated with conversational interface
- **Progressive Disclosure**: Information revealed through chat interaction
- **Context Preservation**: Bot remembers user progress across widget sessions
- **Mixed Interface**: Combination of chat messages and interactive UI elements

### **Widget-Specific Navigation Hierarchy**

#### **Layer 1: Widget Container Controls**

1. **Widget Header**: Always visible, contains minimize/close controls
2. **Chat Area**: Primary interaction space with embedded navigation
3. **Input Area**: Message input with quick action buttons
4. **Widget Status**: Connection, typing indicators, error states

#### **Layer 2: Conversational Navigation**

1. **Bot Messages**: Guide user through ordering process
2. **Quick Reply Buttons**: Fast navigation options in chat
3. **Interactive Cards**: Rich UI components within conversation
4. **Embedded Forms**: Ordering interfaces within chat context

#### **Layer 3: Modal/Overlay Navigation**

1. **Bowl Building Interface**: Overlay within widget for complex interactions
2. **Cart Review Modal**: Slide-up interface for order management
3. **Help Overlay**: FAQ and support within widget bounds

### **HeyBo Brand Integration in Widget Navigation**

#### **Widget-Constrained Visual Identity**

- **Header Gradient**: Orange (#F97316) to darker orange (#EA580C) widget header
- **Chat Bubble Colors**: Bot messages in warm gray, user messages in orange
- **Action Button Styling**: Orange primary actions, yellow secondary highlights
- **Progress Indicators**: Grain bowl filling animation for order progress

#### **Personality Expression Within Widget**

- **Conversational Tone**: Navigation instructions delivered through friendly bot messaging
- **Energy Through Animation**: Micro-interactions that reflect HeyBo's vibrant energy
- **Warmth in Transitions**: Soft animations between navigation states
- **Confidence in Guidance**: Clear, decisive bot responses and navigation cues

---

## 2. Chatbot Widget Navigation Components

### **Widget Header Navigation (Always Present)**

The widget header provides persistent navigation while respecting the embedded context:

#### **Header Structure (Compact for Widget)**

```typescript
interface ChatbotWidgetHeader {
  brand: {
    miniLogo: HeyboBrandIcon; // 24px height mini logo
    chatTitle: "Order Your Bowl" | "Build Your Bowl" | currentStep;
  };
  windowControls: {
    minimizeButton: () => void;
    closeButton: () => void;
    fullscreenToggle?: () => void; // Mobile only
  };
  contextualStatus: {
    orderProgress: ProgressDots;
    connectionStatus: "connected" | "connecting" | "offline";
    typingIndicator: boolean;
  };
}
```

#### **Widget Header Visual Implementation**

```css
.heybo-chatbot-widget-header {
  position: sticky;
  top: 0;
  height: 48px; /* Compact for widget */
  background: linear-gradient(135deg, var(--orange-500) 0%, var(--orange-600) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  z-index: 10;
  box-shadow: 0 1px 4px rgba(249, 115, 22, 0.2);
  border-radius: 16px 16px 0 0; /* Matches widget border radius */
}

.widget-brand-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.widget-mini-logo {
  width: 24px;
  height: 24px;
}

.widget-chat-title {
  font-size: 14px;
  font-weight: 600;
}

.widget-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.widget-control-button {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;
}

.widget-control-button:hover {
  background: rgba(255, 255, 255, 0.3);
}
```

### **Conversational Navigation Interface**

#### **Chat-Integrated Navigation Elements**

```typescript
interface ConversationalNavigation {
  botMessages: {
    navigationPrompts: NavigationMessage[];
    progressUpdates: ProgressMessage[];
    helpGuidance: HelpMessage[];
  };
  quickReplyButtons: {
    navigationOptions: QuickReply[];
    maxVisible: 4; // Constraint for widget width
    scrollable: boolean;
  };
  interactiveCards: {
    bowlBuildingCard: BowlBuilderCard;
    cartSummaryCard: CartSummaryCard;
    locationSelectionCard: LocationCard;
  };
  embeddedInterfaces: {
    ingredientSelector: EmbeddedIngredientGrid;
    cartReview: EmbeddedCartInterface;
    checkoutForm: EmbeddedCheckoutForm;
  };
}
```

#### **Quick Reply Navigation Buttons**

```css
.chat-quick-replies {
  display: flex;
  gap: 8px;
  margin: 12px 16px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.quick-reply-button {
  background: var(--orange-50);
  color: var(--orange-700);
  border: 1px solid var(--orange-200);
  border-radius: 16px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: fit-content;
}

.quick-reply-button:hover {
  background: var(--orange-100);
  border-color: var(--orange-300);
}

.quick-reply-button.primary {
  background: var(--orange-500);
  color: white;
  border-color: var(--orange-500);
}

.quick-reply-button.primary:hover {
  background: var(--orange-600);
}

/* Widget width constraint handling */
.quick-replies-container {
  max-width: 100%;
  overflow-x: auto;
}

.quick-replies-container::-webkit-scrollbar {
  height: 4px;
}

.quick-replies-container::-webkit-scrollbar-track {
  background: var(--gray-100);
  border-radius: 2px;
}

.quick-replies-container::-webkit-scrollbar-thumb {
  background: var(--orange-300);
  border-radius: 2px;
}
```

### **Widget-Embedded Interactive Cards**

#### **Bowl Building Card (Within Chat)**

```typescript
interface BowlBuildingCard {
  header: {
    title: "Build Your Bowl";
    currentStep: "Base" | "Protein" | "Sides" | "Sauce";
    progress: "2 of 4";
  };
  compactInterface: {
    categoryTabs: CategoryTab[]; // Horizontal scroll on mobile
    selectedItems: SelectedItem[];
    primaryAction: "Continue" | "Add to Cart";
  };
  expandedView: {
    triggerButton: "Customize Details";
    modalContent: FullBowlBuilderInterface;
  };
}
```

#### **Interactive Card Implementation**

```css
.chat-interactive-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  margin: 8px 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-header {
  background: var(--orange-50);
  padding: 12px 16px;
  border-bottom: 1px solid var(--orange-200);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--brown-800);
  margin: 0;
}

.card-subtitle {
  font-size: 12px;
  color: var(--brown-600);
  margin-top: 2px;
}

.card-content {
  padding: 16px;
}

.card-actions {
  padding: 12px 16px;
  background: var(--gray-50);
  border-top: 1px solid var(--gray-200);
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* Responsive card layout within widget */
@media (max-width: 400px) {
  .chat-interactive-card {
    margin: 8px 8px;
  }
  
  .card-actions {
    flex-direction: column;
  }
  
  .card-actions .button {
    width: 100%;
  }
}
```

### **Widget Modal/Overlay Navigation**

#### **In-Widget Modal System**

```typescript
interface WidgetModalSystem {
  modalTypes: {
    fullBowlBuilder: {
      size: 'large'; // Takes most of widget space
      dismissible: true;
      navigation: 'tabbed';
    };
    cartReview: {
      size: 'medium';
      dismissible: true;
      navigation: 'linear';
    };
    help: {
      size: 'small';
      dismissible: true;
      navigation: 'searchable';
    };
  };
  constraints: {
    maxWidth: 'calc(100% - 32px)'; // Account for widget padding
    maxHeight: 'calc(100vh - 120px)'; // Account for header and input
    zIndex: 100; // Above chat content
  };
}
```

#### **Widget Modal Implementation**

```css
.widget-modal-overlay {
  position: absolute;
  top: 48px; /* Below widget header */
  left: 0;
  right: 0;
  bottom: 60px; /* Above input area */
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
  backdrop-filter: blur(2px);
}

.widget-modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.widget-modal-header {
  background: var(--orange-500);
  color: white;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.widget-modal-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.widget-modal-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.widget-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.widget-modal-actions {
  padding: 12px 16px;
  background: var(--gray-50);
  border-top: 1px solid var(--gray-200);
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* Mobile widget modal (full screen) */
@media (max-width: 640px) {
  .widget-modal-overlay {
    top: 0;
    bottom: 0;
    padding: 0;
  }
  
  .widget-modal {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
}
```

### **Chat Input Area Navigation**

#### **Enhanced Input with Navigation**

```typescript
interface ChatInputNavigation {
  inputField: {
    placeholder: string; // Context-aware placeholders
    suggestions: string[]; // Quick input suggestions
    voiceInput: boolean;
  };
  quickActions: {
    cartButton: CartQuickAccess;
    helpButton: HelpQuickAccess;
    menuButton: NavigationMenu;
  };
  contextualButtons: {
    // Changes based on current step
    currentStepActions: ContextualAction[];
  };
}
```

#### **Input Area Implementation**

```css
.widget-input-area {
  position: sticky;
  bottom: 0;
  background: white;
  border-top: 1px solid var(--gray-200);
  padding: 12px 16px;
  border-radius: 0 0 16px 16px;
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.chat-input {
  flex: 1;
  border: 1px solid var(--gray-300);
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 14px;
  background: var(--gray-50);
  resize: none;
  max-height: 100px;
  min-height: 40px;
}

.chat-input:focus {
  outline: none;
  border-color: var(--orange-500);
  background: white;
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.1);
}

.input-quick-actions {
  display: flex;
  gap: 4px;
}

.input-action-button {
  width: 40px;
  height: 40px;
  border: none;
  background: var(--orange-500);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.input-action-button:hover {
  background: var(--orange-600);
  transform: scale(1.05);
}

.input-action-button.secondary {
  background: var(--gray-200);
  color: var(--gray-700);
}

.input-action-button.secondary:hover {
  background: var(--gray-300);
}

/* Contextual input hints */
.input-hints {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
  overflow-x: auto;
}

.input-hint {
  background: var(--yellow-100);
  color: var(--yellow-800);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid var(--yellow-200);
}

.input-hint:hover {
  background: var(--yellow-200);
}
```

---

## 3. Widget State Management & Isolation

### **Widget-Isolated State Architecture**

The navigation state operates independently from the parent HeyBo website to prevent conflicts:

#### **Isolated Widget State**

```typescript
interface WidgetNavigationState {
  // Widget-specific state (isolated from parent site)
  widgetSession: {
    sessionId: string;
    isOpen: boolean;
    isMinimized: boolean;
    currentChatState: 'welcome' | 'ordering' | 'cart' | 'checkout' | 'complete';
  };
  
  // Ordering flow state
  conversationFlow: {
    currentStep: OrderingStep;
    completedSteps: OrderingStep[];
    availableActions: ConversationAction[];
    botContext: BotMemoryContext;
  };
  
  // Layout state within widget
  widgetLayout: {
    mode: 'chat-only' | 'chat-with-embedded-ui' | 'modal-overlay';
    paneConfig: 'single' | 'dual' | 'stacked';
    currentInterface: 'conversation' | 'bowl-builder' | 'cart-review';
  };
  
  // Widget UI state
  interfaceState: {
    activeModal: string | null;
    showTypingIndicator: boolean;
    inputFocused: boolean;
    scrollPosition: number;
  };
}
```

#### **State Isolation Implementation**

```typescript
// Widget-scoped state management (doesn't interfere with parent site)
export const useWidgetNavigationStore = create<WidgetNavigationState>()((set, get) => ({
  widgetSession: {
    sessionId: generateSessionId(),
    isOpen: false,
    isMinimized: false,
    currentChatState: 'welcome'
  },
  
  conversationFlow: {
    currentStep: 'location-selection',
    completedSteps: [],
    availableActions: ['start-order', 'view-menu', 'get-help'],
    botContext: {}
  },
  
  widgetLayout: {
    mode: 'chat-only',
    paneConfig: 'single',
    currentInterface: 'conversation'
  },
  
  interfaceState: {
    activeModal: null,
    showTypingIndicator: false,
    inputFocused: false,
    scrollPosition: 0
  },
  
  // Widget-specific actions
  actions: {
    openWidget: () => set((state) => ({
      widgetSession: { ...state.widgetSession, isOpen: true }
    })),
    
    minimizeWidget: () => set((state) => ({
      widgetSession: { ...state.widgetSession, isMinimized: true }
    })),
    
    progressConversation: (step: OrderingStep) => set((state) => ({
      conversationFlow: {
        ...state.conversationFlow,
        currentStep: step,
        completedSteps: [...state.conversationFlow.completedSteps, state.conversationFlow.currentStep]
      }
    })),
    
    switchInterface: (interfaceType: WidgetInterface) => set((state) => ({
      widgetLayout: { ...state.widgetLayout, currentInterface: interfaceType }
    }))
  }
}));
```

### **Conversation Memory & Context Preservation**

#### **Bot Context Management**

```typescript
interface BotMemoryContext {
  userPreferences: {
    dietaryRestrictions: DietaryRestriction[];
    favoriteIngredients: string[];
    spicePreference: 'mild' | 'medium' | 'spicy';
    previousOrders: OrderSummary[];
  };
  
  currentOrderContext: {
    selectedLocation: Location | null;
    orderTime: 'asap' | Date;
    currentBowl: BowlComposition | null;
    cart: CartItem[];
  };
  
  conversationHistory: {
    messages: ChatMessage[];
    userIntents: RecognizedIntent[];
    botActions: BotAction[];
    navigationPath: NavigationEvent[];
  };
  
  sessionMetadata: {
    startTime: Date;
    lastActivity: Date;
    deviceType: 'mobile' | 'tablet' | 'desktop';
    referralSource: string;
  };
}
```

### **Widget-Parent Communication Protocol**

#### **Safe Communication Interface**

```typescript
interface WidgetParentCommunication {
  // Messages widget can send to parent HeyBo site
  outgoingMessages: {
    orderCompleted: (orderData: OrderSummary) => void;
    userAuthenticated: (userData: UserData) => void;
    widgetClosed: () => void;
    errorOccurred: (error: WidgetError) => void;
  };
  
  // Messages widget can receive from parent site
  incomingMessages: {
    userSessionData: (session: UserSession) => void;
    locationData: (location: GeolocationData) => void;
    themePreferences: (theme: ThemeData) => void;
    orderComplete: (confirmation: OrderConfirmation) => void;
  };
  
  // Security constraints
  messageValidation: {
    allowedOrigins: string[];
    messageTypes: string[];
    dataValidation: (data: any) => boolean;
  };
}
```

#### **Communication Implementation**

```typescript
// Safe postMessage communication with parent site
export const useWidgetCommunication = () => {
  const sendToParent = useCallback((message: WidgetMessage) => {
    // Only send to verified HeyBo domains
    const allowedOrigins = [
      'https://heybo.com',
      'https://www.heybo.com',
      'https://staging.heybo.com'
    ];
    
    const parentOrigin = window.parent.location.origin;
    if (allowedOrigins.includes(parentOrigin)) {
      window.parent.postMessage({
        type: 'heybo-widget-message',
        payload: message,
        timestamp: Date.now()
      }, parentOrigin);
    }
  }, []);
  
  const listenToParent = useCallback((callback: (message: ParentMessage) => void) => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin and message format
      if (!allowedOrigins.includes(event.origin)) return;
      if (event.data.type !== 'heybo-parent-message') return;
      
      callback(event.data.payload);
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  return { sendToParent, listenToParent };
};
```

---

## 4. Single-Pane Widget Navigation

### **Chat-First Navigation Architecture**

Single-pane navigation in the widget prioritizes conversational flow with embedded UI elements:

#### **Conversational Navigation Stack**

```typescript
interface ChatNavigationStack {
  conversationFlow: [
    'welcome-greeting',           // Bot introduces itself and HeyBo
    'location-time-setup',        // Where and when for pickup/delivery
    'ordering-path-selection',    // Recent, favorites, build new, or signature
    'bowl-building-conversation', // Guided ingredient selection via chat
    'customization-refinement',  // Portion sizes, preferences, allergies
    'cart-review-conversation',   // Order summary and final adjustments
    'checkout-process',          // Payment and confirmation
    'order-confirmation'         // Success and tracking information
  ];
  
  navigationMethods: {
    chatMessages: BotNavigationMessage[];
    quickReplyButtons: QuickReplyNavigation[];
    embeddedCards: InteractiveCardNavigation[];
    inlineModals: ModalNavigationTrigger[];
  };
}
```

#### **Widget Chat Navigation Patterns**

**Bot-Guided Navigation Messages**:

```typescript
interface BotNavigationMessage {
  messageType: 'guidance' | 'progress' | 'options' | 'confirmation';
  content: {
    text: string;
    quickReplies?: QuickReply[];
    embeddedUI?: EmbeddedUIComponent;
    navigationHints?: NavigationHint[];
  };
  
  // Examples:
  locationGuidance: {
    text: "I'll help you build the perfect warm grain bowl! First, where would you like to pick up your order?";
    quickReplies: ['Find nearby locations', 'Use my current location', 'Enter address'];
    embeddedUI: LocationSelectionCard;
  };
  
  bowlBuildingGuidance: {
    text: "Great choice on location! Now let's build your bowl. What grain base sounds good today?";
    quickReplies: ['Brown rice', 'Quinoa', 'Mixed grains', 'Surprise me'];
    embeddedUI: BaseSelectionGrid;
  };
}
```

#### **Single-Pane Chat Interface Implementation**

```css
.widget-single-pane-chat {
  height: calc(100vh - 108px); /* Account for header + input */
  display: flex;
  flex-direction: column;
}

.chat-messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  scroll-behavior: smooth;
}

.chat-message {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.bot-message {
  align-items: flex-start;
}

.user-message {
  align-items: flex-end;
}

.message-bubble {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
}

.bot-message .message-bubble {
  background: white;
  color: var(--brown-800);
  border: 1px solid var(--gray-200);
  border-bottom-left-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-message .message-bubble {
  background: var(--orange-500);
  color: white;
  border-bottom-right-radius: 6px;
}

/* Widget-specific message constraints */
@media (max-width: 400px) {
  .message-bubble {
    max-width: 90%;
    font-size: 13px;
  }
  
  .chat-messages-container {
    padding: 12px;
  }
}
```

### **Progressive UI Disclosure in Chat**

#### **Embedded UI Cards Within Conversation**

```typescript
interface EmbeddedUIProgression {
  simple: {
    trigger: 'bot introduces concept';
    ui: 'quick reply buttons';
    example: 'base selection buttons';
  };
  
  intermediate: {
    trigger: 'user needs more options';
    ui: 'interactive card with grid';
    example: 'ingredient selection grid';
  };
  
  complex: {
    trigger: 'user needs detailed customization';
    ui: 'slide-up modal with full interface';
    example: 'detailed bowl builder';
  };
  
  review: {
    trigger: 'user completes section';
    ui: 'summary card with edit options';
    example: 'bowl preview with modification buttons';
  };
}
```

#### **Chat-Embedded UI Card Implementation**

```css
.chat-embedded-card {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  margin: 8px 0;
  overflow: hidden;
  max-width: 100%;
}

.embedded-card-header {
  background: var(--orange-100);
  color: var(--orange-800);
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
  border-bottom: 1px solid var(--orange-200);
}

.embedded-card-content {
  padding: 12px;
}

/* Ingredient selection grid within chat */
.chat-ingredient-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin: 8px 0;
}

.chat-ingredient-option {
  background: white;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  padding: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 12px;
}

.chat-ingredient-option:hover {
  border-color: var(--orange-300);
  background: var(--orange-50);
}

.chat-ingredient-option.selected {
  border-color: var(--orange-500);
  background: var(--orange-100);
  color: var(--orange-800);
}

.chat-ingredient-option.unavailable {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--gray-100);
}

/* Progress indicator within chat */
.chat-progress-indicator {
  background: linear-gradient(90deg, var(--orange-50) 0%, var(--yellow-50) 100%);
  border-radius: 20px;
  padding: 8px 12px;
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.progress-bowl-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--brown-400);
  position: relative;
  overflow: hidden;
}

.progress-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, var(--green-300), var(--orange-300));
  transition: height 0.3s ease;
}

.progress-text {
  color: var(--brown-700);
  font-weight: 500;
}
```

### **Mobile Widget Single-Pane Optimization**

#### **Mobile Fullscreen Widget Navigation**

```typescript
interface MobileWidgetNavigation {
  fullscreenMode: {
    trigger: 'widget opened on mobile';
    layout: 'full viewport overlay';
    navigation: 'header with back button + chat interface';
    dismissal: 'back button or background tap';
  };
  
  gestureNavigation: {
    swipeDown: 'minimize widget';
    swipeUp: 'expand embedded UI';
    swipeLeft: 'previous step (if applicable)';
    swipeRight: 'next step (if applicable)';
  };
  
  mobileOptimizations: {
    largerTouchTargets: '44px minimum';
    thumbZoneActions: 'critical actions in bottom third';
    reducedAnimations: 'battery preservation';
    offlineSupport: 'cached responses';
  };
}
```

#### **Mobile Widget CSS Implementation**

```css
/* Mobile widget takes full screen */
@media (max-width: 640px) {
  .heybo-chatbot-widget {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    z-index: 10000; /* Above everything on mobile */
  }
  
  .widget-header {
    height: 56px;
    padding: 0 16px;
    background: var(--orange-500);
  }
  
  .mobile-back-button {
    background: none;
    border: none;
    color: white;
    padding: 8px;
    margin-left: -8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .chat-messages-container {
    height: calc(100vh - 120px); /* Header + input area */
    padding: 16px;
  }
  
  .widget-input-area {
    padding: 16px;
    background: white;
    border-top: 1px solid var(--gray-200);
  }
  
  /* Mobile-optimized touch targets */
  .quick-reply-button {
    min-height: 44px;
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .chat-ingredient-option {
    min-height: 44px;
    padding: 12px 8px;
  }
  
  .input-action-button {
    width: 48px;
    height: 48px;
  }
}

/* Tablet widget remains cornered but larger */
@media (min-width: 641px) and (max-width: 1023px) {
  .heybo-chatbot-widget {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 380px;
    height: 600px;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
}

/* Desktop widget */
@media (min-width: 1024px) {
  .heybo-chatbot-widget {
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 400px;
    height: 600px;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
}
```

---

## 5. 2-Page Layout Navigation Integration

### **Dual-Pane Navigation Architecture**

When screen space allows for 2-pane layout, navigation becomes more sophisticated:

#### **Pane-Specific Navigation Roles**

**Left Pane (Primary Navigation)**:

- **Task Progression**: Step-by-step ordering flow controls
- **Category Navigation**: Ingredient category selection
- **Primary Actions**: Main task completion buttons
- **Search & Filtering**: Content discovery tools

**Right Pane (Contextual Navigation)**:

- **Information Navigation**: Detail level controls
- **Quick Actions**: Shortcuts and convenience functions
- **Preview Controls**: Visualization and confirmation tools
- **Secondary Actions**: Supporting task functions

#### **Cross-Pane Navigation Patterns**

**Synchronized Navigation**:

```typescript
interface SynchronizedNavigation {
  trigger: 'left-pane-selection';
  effect: 'right-pane-update';
  animation: 'connected-transition';
  timing: 'immediate' | 'debounced';
}

// Example: Ingredient selection triggers bowl preview update
const ingredientSelectionSync = {
  leftPaneAction: 'selectIngredient',
  rightPaneResponse: 'updateBowlPreview',
  visualConnection: 'animated-line-from-selection-to-preview',
  timing: 'immediate'
};
```

**Independent Navigation**:

```typescript
interface IndependentNavigation {
  leftPaneSteps: OrderStep[];
  rightPaneViews: InformationView[];
  crossPaneActions: CrossPaneAction[];
  conflictResolution: ConflictResolutionStrategy;
}

// Example: User can switch nutrition detail level while building bowl
const independentInfoControl = {
  leftPaneTask: 'ingredient-selection',
  rightPaneControl: 'nutrition-detail-toggle',
  independence: true,
  effect: 'information-display-only'
};
```

### **2-Pane Navigation Visual Design**

#### **Navigation Visual Hierarchy**

```css
.dual-pane-container {
  display: grid;
  grid-template-columns: 60% 40%;
  gap: 1px;
  height: calc(100vh - 64px); /* Account for global header */
}

.left-pane {
  background: var(--gray-50);
  display: flex;
  flex-direction: column;
}

.left-pane-nav {
  background: white;
  border-bottom: 1px solid var(--gray-200);
  padding: 16px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.right-pane {
  background: white;
  border-left: 1px solid var(--gray-200);
  display: flex;
  flex-direction: column;
}

.right-pane-nav {
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 10;
}
```

#### **Cross-Pane Visual Connections**

```css
.cross-pane-connection {
  position: absolute;
  background: var(--orange-300);
  height: 2px;
  z-index: 20;
  animation: connectionPulse 0.3s ease-out;
  border-radius: 1px;
}

@keyframes connectionPulse {
  0% { width: 0; opacity: 0; }
  50% { opacity: 1; }
  100% { width: 100%; opacity: 0; }
}

.selection-highlight {
  position: relative;
}

.selection-highlight::after {
  content: '';
  position: absolute;
  top: 0;
  right: -1px;
  width: 3px;
  height: 100%;
  background: var(--orange-500);
  opacity: 0;
  transition: opacity 0.2s ease-out;
}

.selection-highlight.active::after {
  opacity: 1;
}
```

---

## 6. Widget Responsive Behavior

### **Widget Dimension Breakpoints & Responsive Strategy**

The chatbot widget adapts across four distinct breakpoint categories, each with specific dimensional constraints and navigation behaviors:

#### **Breakpoint System for Widget Sizing**

```typescript
interface WidgetBreakpoints {
  sm: {
    screenSize: '320px - 640px';
    widgetBehavior: 'fullscreen-overlay';
    dimensions: {
      width: '100vw';
      height: '100vh';
      borderRadius: '0';
      position: 'fixed-fullscreen';
    };
    navigationStyle: 'mobile-first-chat';
  };
  
  md: {
    screenSize: '641px - 1024px';
    widgetBehavior: 'large-corner-widget';
    dimensions: {
      width: '420px';
      height: '600px';
      borderRadius: '16px';
      position: 'bottom-right-corner';
    };
    navigationStyle: 'enhanced-chat-with-embedded-ui';
  };
  
  lg: {
    screenSize: '1025px - 1440px';
    widgetBehavior: 'optimal-dual-pane-capable';
    dimensions: {
      width: '480px';
      height: '640px';
      borderRadius: '20px';
      position: 'bottom-right-with-margin';
    };
    navigationStyle: 'dual-pane-or-enhanced-single';
  };
  
  xl: {
    screenSize: '1441px+';
    widgetBehavior: 'premium-experience';
    dimensions: {
      width: '520px';
      height: '680px';
      borderRadius: '24px';
      position: 'optimally-positioned';
    };
    navigationStyle: 'full-dual-pane-with-rich-interactions';
  };
}
```

### **Breakpoint-Specific Widget Styling**

#### **Small (SM) - Mobile Devices**

```css
/* SM: 320px - 640px - Fullscreen Mobile Widget */
@media (max-width: 640px) {
  .heybo-chatbot-widget {
    /* Fullscreen overlay behavior */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    z-index: 10000;
    box-shadow: none;
  }
  
  .widget-header {
    height: 56px;
    padding: 0 16px;
    background: linear-gradient(135deg, var(--orange-500) 0%, var(--orange-600) 100%);
  }
  
  .widget-brand-section .widget-mini-logo {
    width: 28px;
    height: 28px;
  }
  
  .widget-chat-title {
    font-size: 16px;
    font-weight: 600;
  }
  
  .chat-messages-container {
    height: calc(100vh - 128px); /* Header + input area */
    padding: 16px;
  }
  
  .widget-input-area {
    padding: 16px;
    min-height: 72px;
  }
  
  /* Mobile-optimized touch targets */
  .quick-reply-button {
    min-height: 48px;
    padding: 12px 16px;
    font-size: 14px;
    border-radius: 20px;
  }
  
  .chat-ingredient-option {
    min-height: 48px;
    padding: 12px;
    font-size: 13px;
  }
  
  .input-action-button {
    width: 48px;
    height: 48px;
  }
  
  /* Mobile navigation patterns */
  .mobile-back-button {
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .chat-embedded-card {
    margin: 12px 0;
    border-radius: 16px;
  }
  
  .chat-ingredient-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
```

#### **Medium (MD) - Tablets & Small Laptops**

```css
/* MD: 641px - 1024px - Large Corner Widget */
@media (min-width: 641px) and (max-width: 1024px) {
  .heybo-chatbot-widget {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 420px;
    height: 600px;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    z-index: 1000;
  }
  
  .widget-header {
    height: 52px;
    padding: 0 16px;
  }
  
  .widget-mini-logo {
    width: 26px;
    height: 26px;
  }
  
  .widget-chat-title {
    font-size: 15px;
    font-weight: 600;
  }
  
  .chat-messages-container {
    height: calc(600px - 120px); /* Total height - header - input */
    padding: 16px;
  }
  
  .widget-input-area {
    padding: 14px 16px;
    min-height: 68px;
  }
  
  /* Enhanced chat interface for medium screens */
  .quick-reply-button {
    min-height: 44px;
    padding: 10px 14px;
    font-size: 13px;
    border-radius: 18px;
  }
  
  .chat-ingredient-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .chat-ingredient-option {
    min-height: 44px;
    padding: 10px 8px;
    font-size: 12px;
    border-radius: 10px;
  }
  
  .input-action-button {
    width: 44px;
    height: 44px;
  }
  
  /* Medium screen embedded UI */
  .chat-embedded-card {
    margin: 10px 0;
    border-radius: 14px;
  }
  
  .embedded-card-content {
    padding: 14px;
  }
}
```

#### **Large (LG) - Desktop Monitors**

```css
/* LG: 1025px - 1440px - Optimal Dual-Pane Capable */
@media (min-width: 1025px) and (max-width: 1440px) {
  .heybo-chatbot-widget {
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 480px;
    height: 640px;
    border-radius: 20px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    z-index: 1000;
  }
  
  .widget-header {
    height: 56px;
    padding: 0 20px;
  }
  
  .widget-mini-logo {
    width: 28px;
    height: 28px;
  }
  
  .widget-chat-title {
    font-size: 16px;
    font-weight: 600;
  }
  
  .chat-messages-container {
    height: calc(640px - 128px); /* Total height - header - input */
    padding: 20px;
  }
  
  .widget-input-area {
    padding: 16px 20px;
    min-height: 72px;
  }
  
  /* Large screen dual-pane preparation */
  .widget-content.dual-pane-ready {
    display: grid;
    grid-template-columns: 60% 40%;
    gap: 1px;
    height: 100%;
  }
  
  .chat-pane {
    background: var(--gray-50);
    padding: 16px;
  }
  
  .context-pane {
    background: white;
    border-left: 1px solid var(--gray-200);
    padding: 16px;
  }
  
  /* Enhanced interaction elements */
  .quick-reply-button {
    min-height: 40px;
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 16px;
  }
  
  .chat-ingredient-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  
  .chat-ingredient-option {
    min-height: 40px;
    padding: 8px 6px;
    font-size: 12px;
    border-radius: 8px;
  }
  
  .input-action-button {
    width: 42px;
    height: 42px;
  }
  
  /* Rich embedded UI for large screens */
  .chat-embedded-card {
    margin: 8px 0;
    border-radius: 12px;
  }
  
  .embedded-card-content {
    padding: 16px;
  }
}
```

#### **Extra Large (XL) - Large Desktop Monitors**

```css
/* XL: 1441px+ - Premium Experience */
@media (min-width: 1441px) {
  .heybo-chatbot-widget {
    position: fixed;
    bottom: 40px;
    right: 40px;
    width: 520px;
    height: 680px;
    border-radius: 24px;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
    z-index: 1000;
  }
  
  .widget-header {
    height: 60px;
    padding: 0 24px;
  }
  
  .widget-mini-logo {
    width: 32px;
    height: 32px;
  }
  
  .widget-chat-title {
    font-size: 18px;
    font-weight: 600;
  }
  
  .chat-messages-container {
    height: calc(680px - 140px); /* Total height - header - input */
    padding: 24px;
  }
  
  .widget-input-area {
    padding: 20px 24px;
    min-height: 80px;
  }
  
  /* Full dual-pane layout for XL screens */
  .widget-content.dual-pane-active {
    display: grid;
    grid-template-columns: 55% 45%;
    gap: 2px;
    height: 100%;
  }
  
  .chat-pane {
    background: var(--gray-50);
    padding: 20px;
    border-radius: 0 0 0 24px;
  }
  
  .context-pane {
    background: white;
    border-left: 1px solid var(--gray-200);
    padding: 20px;
    border-radius: 0 0 24px 0;
  }
  
  /* Premium interaction elements */
  .quick-reply-button {
    min-height: 36px;
    padding: 6px 10px;
    font-size: 14px;
    border-radius: 14px;
  }
  
  .chat-ingredient-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
  
  .chat-ingredient-option {
    min-height: 36px;
    padding: 6px 4px;
    font-size: 11px;
    border-radius: 6px;
  }
  
  .input-action-button {
    width: 40px;
    height: 40px;
  }
  
  /* Rich embedded UI with enhanced spacing */
  .chat-embedded-card {
    margin: 6px 0;
    border-radius: 10px;
  }
  
  .embedded-card-content {
    padding: 18px;
  }
  
  /* XL-specific enhancements */
  .context-pane-header {
    background: var(--orange-50);
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 16px;
  }
  
  .context-pane-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--orange-800);
  }
}
```

### **Breakpoint-Specific Navigation Behaviors**

#### **SM (Mobile) - Chat-Only Navigation**

```typescript
interface SMNavigationBehavior {
  primaryInterface: 'fullscreen-chat';
  navigationMethod: 'conversational-only';
  secondaryUI: 'minimal-embedded-cards';
  gestureSupport: {
    swipeDown: 'minimize-widget';
    swipeUp: 'expand-embedded-ui';
    backGesture: 'previous-conversation-step';
  };
  limitations: {
    noDualPane: true;
    limitedEmbeddedUI: true;
    focusOnChat: true;
  };
}
```

#### **MD (Tablet) - Enhanced Chat Navigation**

```typescript
interface MDNavigationBehavior {
  primaryInterface: 'enhanced-chat-with-rich-cards';
  navigationMethod: 'chat-plus-embedded-ui';
  secondaryUI: 'interactive-card-interfaces';
  modalSupport: {
    slideUpModals: true;
    overlayDialogs: true;
    embeddedForms: true;
  };
  capabilities: {
    richEmbeddedUI: true;
    betterTouchTargets: true;
    moreVisualSpace: true;
  };
}
```

#### **LG (Desktop) - Dual-Pane Ready Navigation**

```typescript
interface LGNavigationBehavior {
  primaryInterface: 'chat-with-optional-dual-pane';
  navigationMethod: 'hybrid-chat-and-traditional-ui';
  secondaryUI: 'full-embedded-interfaces';
  dualPaneSupport: {
    contextualSidebar: true;
    realTimePreview: true;
    independentNavigation: true;
  };
  capabilities: {
    fullDualPane: true;
    richInteractions: true;
    simultaneousViews: true;
  };
}
```

#### **XL (Large Desktop) - Premium Navigation**

```typescript
interface XLNavigationBehavior {
  primaryInterface: 'full-dual-pane-with-chat-integration';
  navigationMethod: 'seamless-chat-and-ui-hybrid';
  secondaryUI: 'premium-embedded-experiences';
  enhancedFeatures: {
    advancedPreview: true;
    detailedNutrition: true;
    richAnimations: true;
    premiumInteractions: true;
  };
  capabilities: {
    optimalDualPane: true;
    premiumExperience: true;
    fullFeatureSet: true;
  };
}
```

### **Responsive Widget State Management**

#### **Breakpoint Detection & State**

```typescript
interface ResponsiveWidgetState {
  currentBreakpoint: 'sm' | 'md' | 'lg' | 'xl';
  widgetDimensions: {
    width: number;
    height: number;
    borderRadius: number;
    position: WidgetPosition;
  };
  navigationCapabilities: {
    supportsDualPane: boolean;
    allowsRichEmbeddedUI: boolean;
    enablesGestures: boolean;
    supportsModals: boolean;
  };
  interfaceMode: 'chat-only' | 'chat-with-cards' | 'dual-pane-ready' | 'dual-pane-active';
}

export const useResponsiveWidget = () => {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl'>('sm');
  const [widgetConfig, setWidgetConfig] = useState<ResponsiveWidgetState>();
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      let newBreakpoint: 'sm' | 'md' | 'lg' | 'xl';
      
      if (width <= 640) newBreakpoint = 'sm';
      else if (width <= 1024) newBreakpoint = 'md';
      else if (width <= 1440) newBreakpoint = 'lg';
      else newBreakpoint = 'xl';
      
      setBreakpoint(newBreakpoint);
      
      // Update widget configuration based on breakpoint
      setWidgetConfig(getWidgetConfigForBreakpoint(newBreakpoint));
    };
    
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);
  
  return { breakpoint, widgetConfig };
};
```

This comprehensive breakpoint system ensures the HeyBo chatbot widget provides an optimal experience across all device sizes while maintaining brand consistency and functional navigation patterns.

---

## 7. HeyBo-Specific Navigation Features

### **Grain Bowl Journey Navigation**

#### **HeyBo Ordering Flow Navigation**

```typescript
interface HeyBoOrderingFlow {
  steps: [
    'welcome-location',      // Location and time selection
    'base-selection',        // Required: grain base selection
    'protein-selection',     // Optional: protein selection  
    'sides-selection',       // 0-3 sides selection
    'sauce-garnish',         // Optional: sauce and garnish
    'customization-review',  // Bowl customization and naming
    'cart-management',       // Add to cart and review
    'checkout-confirmation'  // Final order placement
  ];
  navigationRules: {
    baseRequired: true;
    proteinOptional: true;
    sidesMax: 3;
    sauceMax: 1;
    garnishMax: 1;
  };
  progressIndicators: {
    visual: 'warm-grain-bowl-filling';
    textual: 'step-counter-with-names';
    nutritional: 'real-time-macro-tracking';
  };
}
```

#### **HeyBo Brand Visual Navigation Cues**

```css
.heybo-progress-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: linear-gradient(90deg, var(--orange-50) 0%, var(--yellow-50) 100%);
  border-radius: 12px;
  margin-bottom: 16px;
}

.progress-bowl-visual {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--brown-500);
  position: relative;
  overflow: hidden;
}

.progress-ingredients {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, var(--green-300), var(--orange-300));
  transition: height 0.3s ease-out;
}

.progress-text {
  flex: 1;
}

.progress-step-name {
  font-weight: 600;
  color: var(--brown-800);
  font-size: 14px;
}

.progress-step-count {
  font-size: 12px;
  color: var(--brown-600);
  margin-top: 2px;
}
```

### **Warm Grain Bowl Context Navigation**

#### **Category-Specific Navigation Icons**

```typescript
interface HeyBoCategoryIcons {
  base: 'grain-bowl-icon';      // Bowl with rice/grain representation
  protein: 'protein-icon';      // Meat/chicken/tofu representation  
  sides: 'vegetables-icon';     // Mixed vegetables representation
  sauce: 'sauce-drizzle-icon';  // Sauce drizzle representation
  garnish: 'herbs-icon';        // Fresh herbs/garnish representation
}
```

#### **Nutritional Navigation Integration**

```css
.heybo-nutrition-nav {
  background: var(--green-50);
  border: 1px solid var(--green-200);
  border-radius: 8px;
  padding: 12px;
  margin: 16px 0;
}

.nutrition-progress-bar {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.macro-progress {
  flex: 1;
  height: 6px;
  background: var(--gray-200);
  border-radius: 3px;
  overflow: hidden;
}

.macro-fill {
  height: 100%;
  transition: width 0.3s ease-out;
  border-radius: 3px;
}

.protein-fill { background: var(--orange-500); }
.carbs-fill { background: var(--yellow-500); }
.fat-fill { background: var(--green-500); }

.nutrition-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--gray-600);
}
```

### **HeyBo Contextual Quick Actions**

#### **Bowl Building Quick Actions**

```typescript
interface HeyBoBowlQuickActions {
  nutritionToggle: {
    icon: 'nutrition-facts-icon';
    action: () => void;
    tooltip: 'View nutrition details';
  };
  saveAsFavorite: {
    icon: 'heart-icon';
    action: () => void;
    tooltip: 'Save this bowl combination';
  };
  shareRecipe: {
    icon: 'share-icon';
    action: () => void;
    tooltip: 'Share this healthy bowl';
  };
  startOver: {
    icon: 'refresh-icon';
    action: () => void;
    tooltip: 'Start bowl building over';
  };
}
```

---

## 8. Bowl Building Navigation Flow

### **Step-by-Step Navigation Architecture**

#### **Base Selection (Required Step)**

```typescript
interface BaseSelectionNavigation {
  header: {
    title: 'Choose Your Grain Base';
    subtitle: 'Foundation of your warm bowl';
    progress: '1 of 5';
  };
  content: {
    baseOptions: GrainBaseOption[];
    nutritionalInfo: boolean;
    filterControls: ['whole-grain', 'gluten-free'];
  };
  navigation: {
    nextEnabled: boolean; // Only after base selection
    nextAction: () => navigateToProteinSelection();
    skipEnabled: false;   // Base is required
  };
  rightPane: {
    bowlPreview: EmptyBowlWithSelectedBase;
    nutritionTracker: BaseMacroInformation;
    helpText: 'Your base provides sustained energy...';
  };
}
```

#### **Protein Selection (Optional Step)**

```typescript
interface ProteinSelectionNavigation {
  header: {
    title: 'Add Protein';
    subtitle: 'Power up your bowl (optional)';
    progress: '2 of 5';
  };
  navigation: {
    nextEnabled: true;    // Can proceed without protein
    nextAction: () => navigateToSidesSelection();
    skipEnabled: true;
    skipAction: () => navigateToSidesSelection();
    backAction: () => navigateToBaseSelection();
  };
  proteinSpecific: {
    preparationOptions: ['grilled', 'crispy', 'marinated'];
    portionSlider: ProteinPortionControl;
    multipleProteins: boolean; // Allow extra protein selection
  };
}
```

#### **Sides Selection (Multi-Select Step)**

```typescript
interface SidesSelectionNavigation {
  header: {
    title: 'Choose Your Sides';
    subtitle: 'Select up to 3 delicious additions';
    progress: '3 of 5';
  };
  selectionRules: {
    minimum: 0;
    maximum: 3;
    currentCount: number;
    canProceed: boolean;
  };
  categoryFilters: {
    roastedVegetables: boolean;
    freshVegetables: boolean;
    premiumSides: boolean;
  };
  navigation: {
    nextEnabled: true;
    nextAction: () => navigateToSauceGarnish();
    addMoreEnabled: currentCount < 3;
    removeLastEnabled: currentCount > 0;
  };
}
```

### **Dynamic Navigation Based on Selections**

#### **Smart Navigation Flow**

```typescript
interface SmartNavigationFlow {
  skipLogic: {
    // Skip protein if user indicated vegetarian preference
    skipProteinIf: (user: User) => user.dietaryPreferences.includes('vegetarian');
    
    // Skip sauce if user has allergen restrictions
    skipSauceIf: (user: User) => user.allergens.includes('dairy') && allSaucesContainDairy;
    
    // Auto-proceed if user consistently skips optional steps
    autoSkipPattern: UserSkipBehavior;
  };
  
  backtrackingRules: {
    // Can always go back to previous steps
    allowBacktracking: true;
    
    // Preserve selections when going back
    preserveSelections: true;
    
    // Show change confirmation for major modifications
    confirmMajorChanges: boolean;
  };
  
  progressPrediction: {
    // Estimate completion time based on current selections
    estimatedStepsRemaining: number;
    
    // Suggest express completion path
    expressPathAvailable: boolean;
    expressPathAction: () => void;
  };
}
```

---

## 9. Navigation Accessibility

### **Keyboard Navigation Patterns**

#### **Tab Order for 2-Pane Layout**

```typescript
interface AccessibleTabOrder {
  sequence: [
    'global-navigation-header',
    'left-pane-contextual-navigation',
    'left-pane-primary-content',
    'left-pane-primary-actions',
    'right-pane-information-controls',
    'right-pane-secondary-actions',
    'global-quick-actions-fab'
  ];
  shortcuts: {
    'Alt+1': 'focus-left-pane';
    'Alt+2': 'focus-right-pane';
    'Alt+C': 'focus-cart';
    'Alt+B': 'go-back';
    'Alt+H': 'open-help';
    'Escape': 'close-modals-or-panels';
  };
}
```

#### **Screen Reader Navigation Support**

```typescript
interface ScreenReaderNavigation {
  landmarks: {
    banner: 'global-navigation-header';
    main: 'primary-content-area';
    complementary: 'right-pane-information';
    navigation: 'contextual-navigation-toolbar';
  };
  liveRegions: {
    status: 'order-progress-announcements';
    alert: 'error-and-warning-messages';
    log: 'bowl-building-activity-log';
  };
  skipLinks: {
    skipToMainContent: () => void;
    skipToCart: () => void;
    skipToNavigation: () => void;
  };
}
```

#### **Accessible Navigation Implementation**

```html
<!-- Global Navigation Header with ARIA -->
<header role="banner" class="heybo-global-nav-header">
  <nav aria-label="Primary navigation">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <button aria-label="Go back to previous step" class="back-button">
      <svg aria-hidden="true"><!-- Back icon --></svg>
      <span>Back</span>
    </button>
    
    <h1 class="screen-reader-only">HeyBo Grain Bowl Builder</h1>
    
    <div aria-live="polite" aria-atomic="true" class="progress-announcement">
      Step 2 of 5: Protein Selection
    </div>
    
    <button aria-label="View cart with 2 items, total $24.50" class="cart-button">
      <svg aria-hidden="true"><!-- Cart icon --></svg>
      <span aria-hidden="true">Cart (2)</span>
    </button>
  </nav>
</header>

<!-- Two-Pane Layout with Proper ARIA -->
<main id="main-content" class="dual-pane-container">
  <section aria-label="Ingredient selection" class="left-pane">
    <nav aria-label="Ingredient categories" class="category-navigation">
      <ul role="tablist">
        <li role="tab" aria-selected="true" aria-controls="protein-panel">
          Protein
        </li>
        <li role="tab" aria-selected="false" aria-controls="sides-panel">
          Sides
        </li>
      </ul>
    </nav>
    
    <div id="protein-panel" role="tabpanel" aria-labelledby="protein-tab">
      <!-- Protein selection content -->
    </div>
  </section>
  
  <aside aria-label="Bowl preview and nutrition information" class="right-pane">
    <div aria-live="polite" class="bowl-preview-updates">
      <!-- Announcements about bowl changes -->
    </div>
    
    <section aria-labelledby="nutrition-heading">
      <h2 id="nutrition-heading">Nutritional Information</h2>
      <!-- Nutrition details -->
    </section>
  </aside>
</main>
```

### **Focus Management Strategies**

#### **Focus Flow in 2-Pane Layout**

```typescript
interface FocusManagement {
  paneTransition: {
    // When moving from left to right pane
    leftToRight: () => {
      // Focus first interactive element in right pane
      document.querySelector('.right-pane [tabindex="0"]')?.focus();
    };
    
    // When completing action in right pane, return to left
    rightToLeft: () => {
      // Return focus to triggering element in left pane
      previousFocusElement?.focus();
    };
  };
  
  modalFocus: {
    // Trap focus within modal dialogs
    trapFocus: (modal: HTMLElement) => void;
    
    // Return focus when modal closes
    returnFocus: (previousElement: HTMLElement) => void;
  };
  
  dynamicContent: {
    // Focus management when content updates
    announceChanges: (message: string) => void;
    
    // Focus new content when it appears
    focusNewContent: (element: HTMLElement) => void;
  };
}
```

---

## 10. Cross-Pane Navigation Patterns

### **Synchronized Navigation Behaviors**

#### **Selection-to-Preview Synchronization**

```typescript
interface SelectionPreviewSync {
  trigger: IngredientSelection;
  response: {
    bowlPreviewUpdate: BowlVisualizationUpdate;
    nutritionUpdate: NutritionInformationUpdate;
    priceUpdate: PriceCalculationUpdate;
    visualConnection: AnimationEffect;
  };
  timing: {
    immediate: ['bowlPreview', 'priceUpdate'];
    debounced: ['nutritionCalculation'];
    delayed: ['visualConnection'];
  };
}
```

#### **Cross-Pane Visual Connection Implementation**

```css
.selection-to-preview-animation {
  position: relative;
}

.selection-to-preview-animation::before {
  content: '';
  position: absolute;
  top: 50%;
  right: -20px;
  width: 0;
  height: 2px;
  background: var(--orange-400);
  border-radius: 1px;
  animation: connectionLine 0.5s ease-out forwards;
  z-index: 20;
}

@keyframes connectionLine {
  0% {
    width: 0;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    width: calc(40vw - 40px);
    opacity: 0;
  }
}

.bowl-preview-highlight {
  animation: previewPulse 0.3s ease-out;
}

@keyframes previewPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
```

### **Independent Navigation Actions**

#### **Right-Pane Independent Controls**

```typescript
interface IndependentRightPaneNavigation {
  informationControls: {
    nutritionDetailLevel: {
      options: ['summary', 'detailed', 'complete'];
      currentLevel: string;
      toggleAction: () => void;
    };
    allergenDisplay: {
      showAllergens: boolean;
      toggleAction: () => void;
    };
    sourceInformation: {
      showSources: boolean;
      toggleAction: () => void;
    };
  };
  
  quickActions: {
    saveCurrentBowl: () => void;
    shareConfiguration: () => void;
    printNutrition: () => void;
    compareWithPrevious: () => void;
  };
  
  viewModes: {
    currentMode: 'preview' | 'nutrition' | 'summary';
    switchMode: (mode: ViewMode) => void;
  };
}
```

### **Navigation Conflict Resolution**

#### **Conflict Resolution Strategies**

```typescript
interface NavigationConflictResolution {
  scenarios: {
    // User tries to proceed without required selections
    incompleteSelection: {
      behavior: 'block-and-highlight-missing';
      message: 'Please select a grain base to continue';
      focusAction: () => focusRequiredField();
    };
    
    // User modifies bowl while viewing summary
    summaryModification: {
      behavior: 'update-summary-immediately';
      visualCue: 'highlight-changed-sections';
    };
    
    // Navigation action conflicts with unsaved changes
    unsavedChanges: {
      behavior: 'show-confirmation-dialog';
      options: ['save-and-proceed', 'discard-and-proceed', 'cancel'];
    };
  };
  
  priorityRules: {
    // Left pane navigation takes priority over right pane
    leftPanePriority: true;
    
    // Required fields block navigation
    enforceRequiredFields: true;
    
    // User explicit actions override automatic behaviors
    userActionPriority: true;
  };
}
```

---

## 11. Implementation Guide

### **React Component Architecture**

#### **Navigation Provider Setup**

```typescript
// Navigation Context Provider
interface NavigationContextValue {
  currentScreen: string;
  navigationState: GlobalNavigationState;
  actions: NavigationActions;
  layoutMode: 'single-pane' | 'dual-pane';
}

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigationState, setNavigationState] = useState<GlobalNavigationState>(initialState);
  const [layoutMode, setLayoutMode] = useState<'single-pane' | 'dual-pane'>('single-pane');
  
  // Responsive layout detection
  useEffect(() => {
    const handleResize = () => {
      setLayoutMode(window.innerWidth >= 1024 ? 'dual-pane' : 'single-pane');
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const value = {
    currentScreen: navigationState.currentScreen,
    navigationState,
    actions: {
      navigateTo: (screen: string, options?: NavigationOptions) => {
        // Implementation
      },
      goBack: () => {
        // Implementation
      },
      updateProgress: (progress: OrderProgress) => {
        // Implementation
      }
    },
    layoutMode
  };
  
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
```

#### **Universal Navigation Hook**

```typescript
// Custom hook for navigation that works across layouts
export const useHeyBoNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useHeyBoNavigation must be used within NavigationProvider');
  }
  
  const { navigationState, actions, layoutMode } = context;
  
  return {
    // Current state
    currentScreen: navigationState.currentScreen,
    currentStep: navigationState.currentStep,
    progress: navigationState.orderProgress,
    layoutMode,
    
    // Navigation actions
    navigateTo: actions.navigateTo,
    goBack: actions.goBack,
    canGoBack: navigationState.navigationHistory.length > 0,
    
    // Layout-specific helpers
    isDesktopLayout: layoutMode === 'dual-pane',
    isMobileLayout: layoutMode === 'single-pane',
    
    // Progress helpers
    updateProgress: actions.updateProgress,
    completeStep: (step: string) => actions.updateProgress({ ...navigationState.orderProgress, completedSteps: [...navigationState.orderProgress.completedSteps, step] }),
    
    // Quick actions
    openCart: () => actions.navigateTo('cart'),
    openHelp: () => actions.navigateTo('help'),
    resetToHome: () => actions.navigateTo('welcome')
  };
};
```

#### **Navigation Components**

**Global Navigation Header Component**:

```typescript
interface GlobalNavigationHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightActions?: React.ReactNode;
}

export const GlobalNavigationHeader: React.FC<GlobalNavigationHeaderProps> = ({
  title,
  showBackButton = true,
  onBackClick,
  rightActions
}) => {
  const { goBack, canGoBack, currentStep, progress } = useHeyBoNavigation();
  const { cart } = useCartStore();
  
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      goBack();
    }
  };
  
  return (
    <header className="heybo-global-nav-header">
      <div className="nav-left">
        {showBackButton && canGoBack && (
          <button 
            onClick={handleBackClick}
            className="back-button"
            aria-label="Go back to previous step"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        )}
        
        <div className="nav-title">
          <h1>{title || currentStep}</h1>
          <div className="progress-indicator">
            Step {progress.completed + 1} of {progress.total}
          </div>
        </div>
      </div>
      
      <div className="nav-right">
        {rightActions}
        
        <button 
          className="cart-button"
          aria-label={`View cart with ${cart.items.length} items, total $${cart.total.toFixed(2)}`}
        >
          <ShoppingCart size={24} />
          {cart.items.length > 0 && (
            <span className="cart-badge">{cart.items.length}</span>
          )}
        </button>
      </div>
    </header>
  );
};
```

**Responsive Layout Container**:

```typescript
interface ResponsiveLayoutProps {
  leftPane: React.ReactNode;
  rightPane?: React.ReactNode;
  singlePaneContent?: React.ReactNode;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  leftPane,
  rightPane,
  singlePaneContent
}) => {
  const { layoutMode } = useHeyBoNavigation();
  
  if (layoutMode === 'single-pane') {
    return (
      <div className="single-pane-layout">
        {singlePaneContent || leftPane}
      </div>
    );
  }
  
  return (
    <div className="dual-pane-layout">
      <div className="left-pane">
        {leftPane}
      </div>
      {rightPane && (
        <div className="right-pane">
          {rightPane}
        </div>
      )}
    </div>
  );
};
```

### **Navigation State Management**

#### **Zustand Store for Navigation**

```typescript
interface NavigationStore {
  // State
  currentScreen: string;
  currentStep: string;
  orderProgress: OrderProgress;
  navigationHistory: NavigationHistoryItem[];
  layoutMode: 'single-pane' | 'dual-pane';
  
  // UI State
  isLoading: boolean;
  isPanelOpen: boolean;
  activeModal: string | null;
  
  // Actions
  navigateTo: (screen: string, options?: NavigationOptions) => void;
  goBack: () => void;
  updateProgress: (progress: Partial<OrderProgress>) => void;
  setLayoutMode: (mode: 'single-pane' | 'dual-pane') => void;
  
  // UI Actions
  setLoading: (loading: boolean) => void;
  togglePanel: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  // Initial state
  currentScreen: 'welcome',
  currentStep: 'location-selection',
  orderProgress: { completed: 0, total: 6, completedSteps: [] },
  navigationHistory: [],
  layoutMode: 'single-pane',
  isLoading: false,
  isPanelOpen: false,
  activeModal: null,
  
  // Actions
  navigateTo: (screen, options = {}) => {
    const currentState = get();
    
    // Add current screen to history
    const newHistoryItem: NavigationHistoryItem = {
      screen: currentState.currentScreen,
      step: currentState.currentStep,
      timestamp: Date.now(),
      state: options.preserveState ? { ...currentState } : undefined
    };
    
    set({
      currentScreen: screen,
      currentStep: options.step || screen,
      navigationHistory: [...currentState.navigationHistory, newHistoryItem]
    });
    
    // Analytics tracking
    if (window.heyboAnalytics) {
      window.heyboAnalytics.track('navigation', {
        from: currentState.currentScreen,
        to: screen,
        step: options.step
      });
    }
  },
  
  goBack: () => {
    const currentState = get();
    const history = currentState.navigationHistory;
    
    if (history.length === 0) return;
    
    const previousItem = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    
    set({
      currentScreen: previousItem.screen,
      currentStep: previousItem.step,
      navigationHistory: newHistory,
      ...(previousItem.state && { ...previousItem.state })
    });
  },
  
  updateProgress: (progressUpdate) => {
    const currentState = get();
    set({
      orderProgress: { ...currentState.orderProgress, ...progressUpdate }
    });
  },
  
  setLayoutMode: (mode) => set({ layoutMode: mode }),
  setLoading: (loading) => set({ isLoading: loading }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null })
}));
```

---

## 12. Performance & State Considerations

### **Navigation Performance Optimization**

#### **Lazy Loading Strategy**

```typescript
// Lazy load navigation destinations
const LazyBowlBuilding = lazy(() => import('../components/BowlBuilding'));
const LazyCartReview = lazy(() => import('../components/CartReview'));
const LazyCheckout = lazy(() => import('../components/Checkout'));

// Navigation with lazy loading
export const NavigationRouter: React.FC = () => {
  const { currentScreen } = useHeyBoNavigation();
  
  const renderScreen = () => {
    switch (currentScreen) {
      case 'bowl-building':
        return (
          <Suspense fallback={<BowlBuildingLoader />}>
            <LazyBowlBuilding />
          </Suspense>
        );
      case 'cart':
        return (
          <Suspense fallback={<CartLoader />}>
            <LazyCartReview />
          </Suspense>
        );
      case 'checkout':
        return (
          <Suspense fallback={<CheckoutLoader />}>
            <LazyCheckout />
          </Suspense>
        );
      default:
        return <WelcomeScreen />;
    }
  };
  
  return (
    <div className="navigation-container">
      {renderScreen()}
    </div>
  );
};
```

#### **State Persistence Strategy**

```typescript
// Persist navigation state across sessions
interface NavigationPersistence {
  saveNavigationState: (state: GlobalNavigationState) => void;
  loadNavigationState: () => GlobalNavigationState | null;
  clearNavigationState: () => void;
}

export const useNavigationPersistence = (): NavigationPersistence => {
  const saveNavigationState = (state: GlobalNavigationState) => {
    try {
      localStorage.setItem('heybo-navigation-state', JSON.stringify({
        currentScreen: state.currentScreen,
        currentStep: state.currentStep,
        orderProgress: state.orderProgress,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to save navigation state:', error);
    }
  };
  
  const loadNavigationState = (): GlobalNavigationState | null => {
    try {
      const stored = localStorage.getItem('heybo-navigation-state');
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      
      // Check if state is too old (more than 1 hour)
      if (Date.now() - parsed.timestamp > 3600000) {
        clearNavigationState();
        return null;
      }
      
      return parsed;
    } catch (error) {
      console.warn('Failed to load navigation state:', error);
      return null;
    }
  };
  
  const clearNavigationState = () => {
    localStorage.removeItem('heybo-navigation-state');
  };
  
  return {
    saveNavigationState,
    loadNavigationState,
    clearNavigationState
  };
};
```

### **Cross-Pane State Synchronization**

#### **Real-Time State Sync**

```typescript
// Hook for managing cross-pane state synchronization
export const useCrossPaneSync = () => {
  const [leftPaneState, setLeftPaneState] = useState<LeftPaneState>();
  const [rightPaneState, setRightPaneState] = useState<RightPaneState>();
  
  // Synchronize left pane changes to right pane
  useEffect(() => {
    if (leftPaneState?.selectedIngredients) {
      setRightPaneState(prev => ({
        ...prev,
        bowlPreview: generateBowlPreview(leftPaneState.selectedIngredients),
        nutritionInfo: calculateNutrition(leftPaneState.selectedIngredients),
        totalPrice: calculatePrice(leftPaneState.selectedIngredients)
      }));
    }
  }, [leftPaneState?.selectedIngredients]);
  
  // Handle right pane independent actions
  const updateRightPaneView = useCallback((viewType: RightPaneViewType) => {
    setRightPaneState(prev => ({
      ...prev,
      currentView: viewType
    }));
  }, []);
  
  return {
    leftPaneState,
    rightPaneState,
    updateLeftPane: setLeftPaneState,
    updateRightPane: setRightPaneState,
    updateRightPaneView
  };
};
```

This comprehensive guide provides a complete navigation system that works seamlessly across HeyBo's single-pane and 2-pane layouts, maintaining brand consistency and optimizing the warm grain bowl ordering experience.
