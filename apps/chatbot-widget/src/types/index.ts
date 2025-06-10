// HeyBo Chatbot Widget Types

// Core ingredient and bowl types
export type IngredientCategory = 'base' | 'protein' | 'sides' | 'sauce' | 'garnish';

export interface NutritionalInfo {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sodium: number; // mg
}

// Add missing NutritionSummary interface
export interface NutritionSummary {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sodium: number; // mg
  sugar?: number; // grams
  saturatedFat?: number; // grams
  cholesterol?: number; // mg
  vitaminC?: number; // mg
  calcium?: number; // mg
  iron?: number; // mg
}

export interface HeyBoIngredient {
  id: string;
  name: string;
  category: IngredientCategory;
  subcategory: string;
  isAvailable: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  allergens: Allergen[];
  nutritionalInfo: NutritionalInfo;
  weight: number; // grams
  price: number; // cents
  description: string;
  imageUrl: string;
}

export interface BowlComposition {
  id: string;
  name: string;
  description: string;
  base: HeyBoIngredient;
  protein?: HeyBoIngredient;
  extraProtein: HeyBoIngredient[];
  sides: HeyBoIngredient[];
  extraSides: HeyBoIngredient[];
  sauce?: HeyBoIngredient;
  garnish?: HeyBoIngredient;
  totalWeight: number;
  totalPrice: number; // cents
  isSignature?: boolean;
  imageUrl?: string;
  tags?: string[];
  rating?: number;
  prepTime?: string;
  calories?: number;
  isPopular?: boolean;
  isAvailable?: boolean;
}

// User and authentication types
export type UserType = 'registered' | 'guest' | 'unauthenticated';
export type DietaryRestriction = 'vegan' | 'vegetarian' | 'gluten-free' | 'dairy-free' | 'nut-free' | 'low-carb' | 'keto' | 'paleo';
export type Allergen = 'nuts' | 'peanuts' | 'dairy' | 'gluten' | 'soy' | 'eggs' | 'shellfish' | 'fish' | 'sesame';
export type MessageType = 'user' | 'assistant' | 'system';

export interface UserPreferences {
  dietaryRestrictions: DietaryRestriction[];
  allergens: Allergen[];
  spiceLevel: 'mild' | 'medium' | 'hot';
  proteinPreference: 'any' | 'plant-based' | 'meat' | 'seafood';
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  type: UserType;
  preferences: UserPreferences;
  orderHistory?: RecentOrder[];
  favorites?: FavoriteItem[];
  lastOrderedLocation?: string;
}

// Location types
export type LocationType = 'station' | 'outlet';

export interface OperatingHours {
  monday: { open: string; close: string };
  tuesday: { open: string; close: string };
  wednesday: { open: string; close: string };
  thursday: { open: string; close: string };
  friday: { open: string; close: string };
  saturday: { open: string; close: string };
  sunday: { open: string; close: string };
}

export interface Location {
  id: string;
  name: string;
  address: string;
  type: LocationType;
  coordinates: {
    lat: number;
    lng: number;
  };
  operatingHours: OperatingHours;
  isActive: boolean;
  estimatedWaitTime: string;
  distance?: number; // km, calculated when fetching nearest locations
}

// Order types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface RecentOrder {
  id: string;
  userId: string;
  items: CartItem[];
  location: string;
  bowlComposition: BowlComposition;
  orderDate: Date;
  locationId: string;
  status: OrderStatus;
  totalAmount: number; // cents
  rating?: number | null;
}

export interface FavoriteItem {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: 'signature' | 'custom';
  rating?: number;
  price: number;
  lastOrdered?: Date;
  tags?: string[];
  bowlComposition: BowlComposition;
  createdAt: Date;
  isFavorite: boolean;
}

// ML and recommendations
export interface MLRecommendation {
  id: string;
  bowlComposition: BowlComposition;
  confidence: number; // 0-1
  reasoning: string;
  tags: string[];
}

// Chat and widget types
// MessageType already defined above

export interface ChatMessage {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  status?: MessageStatus;
  embeddedUI?: EmbeddedUIComponent;
  metadata?: {
    bowlData?: Partial<BowlComposition>;
    locationData?: Location;
    ingredientData?: HeyBoIngredient[];
    actionType?: string;
  };
}

export type MessageStatus = 'sending' | 'sent' | 'failed' | 'delivered';

export interface EmbeddedUIComponent {
  type: 'bowl-preview' | 'quick-actions' | 'ingredient-grid' | 'nutrition-info' | 'order-summary';
  data: BowlPreviewData | QuickActionsData | IngredientGridData | NutritionInfoData | OrderSummaryData;
  interactive: boolean;
}

// Specific data types for each embedded UI component
export interface BowlPreviewData {
  bowl: Partial<BowlComposition>;
  name?: string;
  price?: number;
  weight?: number;
  totalPrice?: number;
  totalWeight?: number;
  nutritionSummary?: NutritionSummary;
}

export interface QuickActionsData {
  actions: Array<{
    id: string;
    label: string;
    action: string;
    icon?: string;
    disabled?: boolean;
  }>;
}

export interface IngredientGridData {
  category: IngredientCategory;
  ingredients: HeyBoIngredient[];
  selectedIngredients: string[];
  maxSelections?: number;
}

export interface NutritionInfoData {
  nutrition: NutritionSummary;
  showDetailed: boolean;
  macroBreakdown: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface OrderSummaryData {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  estimatedTime?: string;
}

export type WidgetState = 'collapsed' | 'expanding' | 'expanded' | 'closing';

export type ChatbotStep =
  | 'welcome'
  | 'authentication'
  | 'location-type-selection'
  | 'gps-location-check'
  | 'location-selection'
  | 'time-selection'
  | 'order-type-selection'
  | 'signature-bowls'
  | 'signature-bowl-details'
  | 'recent-orders'
  | 'recent-order-details'
  | 'favorites'
  | 'favorite-details'
  | 'create-your-own'
  | 'dietary-preferences'
  | 'ml-processing'
  | 'ml-suggestions-starting-point'
  | 'ingredient-category-selection'
  | 'ingredient-selection'
  | 'ml-recommendations'
  | 'ml-recommendation-details'
  | 'bowl-building'
  | 'bowl-customization'
  | 'bowl-review'
  | 'add-ons-selection'
  | 'cart-review'
  | 'upselling'
  | 'order-confirmation'
  | 'rating'
  | 'faq';

export interface ChatbotState {
  currentStep: ChatbotStep;
  user: User | null;
  selectedLocation: Location | null;
  currentBowl: Partial<BowlComposition> | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sessionId: string;
  widgetState: WidgetState;
}

// Order flow types
export type OrderPath = 'signature' | 'recent' | 'favorites' | 'create-your-own' | 'ml-recommendations';

export interface OrderStep {
  path: OrderPath;
  step: ChatbotStep;
  data?: Record<string, unknown>;
  isCompleted: boolean;
}

// Time selection types
export type OrderTimeType = 'asap' | 'scheduled';

export interface OrderTime {
  type: OrderTimeType;
  scheduledTime?: Date;
  estimatedReady?: Date;
}

// Cart and checkout types
export interface CartItem {
  id: string;
  bowl: BowlComposition;
  quantity: number;
  addedAt: Date;
  customizations?: string[];
  addOns?: HeyBoIngredient[];
}

export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  estimatedTime: string;
  location: Location;
  orderTime: OrderTime;
}

// Rating types
export interface OrderRating {
  orderId: string;
  overallRating?: number; // 1-5 stars
  comments?: string;
  cyoBowlRatings?: {
    bowlId: string;
    rating: 'thumbs_up' | 'thumbs_down';
  }[];
  ratedAt: Date;
}

// API response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface OrderCompletionData {
  orderId: string;
  status: OrderStatus;
  estimatedTime: string;
}

export interface ErrorDetails {
  code: string;
  context?: Record<string, unknown>;
  stackTrace?: string;
}

export interface IngredientSelectionState {
  category: IngredientCategory;
  selectedIngredients: HeyBoIngredient[];
  availableIngredients: HeyBoIngredient[];
  isRequired: boolean;
  maxSelections?: number;
}

// Widget configuration
export interface WidgetConfig {
  apiBaseUrl: string;
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  position: 'bottom-right' | 'bottom-left';
  enableAnalytics: boolean;
  enableFAQ: boolean;
  enableMLRecommendations: boolean;
  maxBowlWeight: number; // grams
  warningThreshold: number; // percentage of max weight
}

// Analytics and tracking
export interface AnalyticsEvent {
  eventType: string;
  timestamp: Date;
  userId?: string;
  sessionId: string;
  data: Record<string, unknown>;
}

export interface SessionData {
  sessionId: string;
  userId?: string;
  userType: 'registered' | 'guest' | 'unauthenticated';
  deviceId: string;
  createdAt: string; // ISO string for localStorage compatibility
  lastActivity: string; // ISO string for localStorage compatibility
  expiresAt: string; // ISO string for localStorage compatibility
  currentStep: ChatbotStep;
  selections: HeyBoIngredient[];
  cart: CartItem[];
  preferences: UserPreferences;
}

// Validation types
export interface ValidationWarning {
  code: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  dismissible: boolean;
}

export interface BowlValidationResult {
  isValid: boolean;
  warnings: ValidationWarning[];
  errors: ValidationError[];
  totalWeight: number;
  totalPrice: number;
  canProceed: boolean;
}

export interface CartValidationResult {
  isValid: boolean;
  warnings: ValidationWarning[];
  errors: ValidationError[];
  totalItems: number;
  totalPrice: number;
}

// ML Recommendation types
export type MLRecommendationSource = 'ml' | 'cached' | 'popular' | 'signature';

export interface MLRecommendationResult {
  recommendations: BowlComposition[];
  source: MLRecommendationSource;
  confidence: number;
  fallbackUsed: boolean;
}

// Error types
export interface ChatbotError {
  code: string;
  message: string;
  details?: ErrorDetails;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
  retryCount?: number;
  maxRetries?: number;
}

// Enhanced error handling types
export type ErrorCategory =
  | 'authentication'
  | 'session'
  | 'ordering'
  | 'cart'
  | 'api'
  | 'validation'
  | 'network'
  | 'ml'
  | 'checkout';

export interface ErrorState {
  id: string;
  category: ErrorCategory;
  code: string;
  message: string;
  userMessage: string;
  details?: ErrorDetails;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
  retryCount: number;
  maxRetries: number;
  resolved: boolean;
  recoveryActions?: RecoveryAction[];
}

export interface RecoveryAction {
  id: string;
  label: string;
  action: () => Promise<void> | void;
  primary?: boolean;
}

// Session management types
export interface SessionWarning {
  type: 'timeout' | 'conflict' | 'storage' | 'sync';
  message: string;
  timeRemaining?: number;
  actions: RecoveryAction[];
}

// OTP and authentication error types
export interface OTPError {
  type: 'invalid' | 'expired' | 'rate_limit' | 'service_down';
  attemptsRemaining?: number;
  lockoutTime?: number;
  message: string;
}

export interface AuthenticationError {
  type: 'invalid_token' | 'expired_token' | 'malformed_token' | 'service_down';
  message: string;
  recoverable: boolean;
  redirectRequired?: boolean;
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  warnings: ValidationWarning[];
  errors: ValidationError[];
  canProceed: boolean;
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
  blocking: boolean;
}

// Bowl validation specific types - extended version
export interface DetailedBowlValidationResult extends BowlValidationResult {
  weightStatus: 'under' | 'optimal' | 'warning' | 'over';
  currentWeight: number;
  maxWeight: number;
  priceStatus: 'calculated' | 'estimated' | 'error';
  currentPrice: number;
}

// Cart validation types - extended version
export interface DetailedCartValidationResult extends CartValidationResult {
  items: CartItemValidation[];
  totalErrors: ValidationError[];
  totalWarnings: ValidationWarning[];
  canCheckout: boolean;
}

export interface CartItemValidation {
  itemId: string;
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  availabilityStatus: 'available' | 'limited' | 'unavailable';
  priceChanged: boolean;
  originalPrice: number | undefined;
  currentPrice: number | undefined;
}

// Rating system types
export interface RatingData {
  orderId: string;
  overallRating: number | undefined; // 1-5 stars
  overallComment: string | undefined;
  bowlRatings: BowlRating[];
  timestamp: Date;
  skipped: boolean;
}

export interface BowlRating {
  bowlId: string;
  bowlName: string;
  rating: 'thumbs_up' | 'thumbs_down';
  comment?: string;
}

export interface UnratedOrder {
  orderId: string;
  orderDate: Date;
  bowls: BowlComposition[];
  totalAmount: number;
  location: string;
}

// Component prop types
export interface IngredientCardProps {
  ingredient: HeyBoIngredient;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (ingredient: HeyBoIngredient) => void;
  showNutrition?: boolean;
  showPrice?: boolean;
}

export interface BowlPreviewProps {
  bowl: Partial<BowlComposition>;
  showNutrition?: boolean;
  showPrice?: boolean;
  onEdit?: () => void;
}

export interface LocationCardProps {
  location: Location;
  isSelected: boolean;
  onSelect: (location: Location) => void;
  showDistance?: boolean;
  showWaitTime?: boolean;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Layout and responsive design types
export * from './layout';

// Re-export for convenience
export type { User as HeyBoUser };
export type { Location as HeyBoLocation };
export type { BowlComposition as HeyBoBowl };
