// API Client for HeyBo Chatbot Widget
// This layer allows switching between mock and real APIs

import { mockAPI } from './mock-api-simple';
// import { realAPI } from './real-api'; // Uncomment when real API is ready

import type {
  User,
  Location,
  HeyBoIngredient,
  BowlComposition,
  RecentOrder,
  FavoriteItem,
  MLRecommendation,
  IngredientCategory,
  DietaryRestriction,
  Allergen
} from "../types";

// Environment flag to switch between mock and real APIs
const USE_MOCK_API = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Generic API interface that both mock and real APIs should implement
interface APIClient {
  session: {
    create(userId?: string): Promise<{ sessionId: string; expiresAt: Date }>;
    get(sessionId: string): Promise<any | null>;
    update(sessionId: string, updates: any): Promise<boolean>;
    clear(sessionId: string): Promise<boolean>;
  };
  
  auth: {
    validateToken(token: string): Promise<User | null>;
    sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }>;
    verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; token?: string }>;
  };
  
  locations: {
    getAll(type?: 'Station' | 'Outlet'): Promise<Location[]>;
    getNearest(lat: number, lng: number, limit?: number): Promise<Location[]>;
    getDetails(locationId: string): Promise<Location | null>;
  };
  
  ingredients: {
    getAll(locationId: string, category?: IngredientCategory): Promise<HeyBoIngredient[]>;
    checkAvailability(ingredientIds: string[], locationId: string): Promise<Record<string, boolean>>;
  };
  
  bowls: {
    getSignature(locationId: string): Promise<BowlComposition[]>;
    getPopular(limit?: number): Promise<BowlComposition[]>;
    getDetails(bowlId: string): Promise<BowlComposition | null>;
  };
  
  orders: {
    getRecent(userId: string, limit?: number): Promise<RecentOrder[]>;
    submit(bowl: BowlComposition, locationId: string, sessionId: string): Promise<{
      success: boolean;
      orderId?: string;
      message: string;
      estimatedReadyTime?: Date;
    }>;
    getStatus(orderId: string): Promise<{
      status: 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
      estimatedReadyTime?: Date;
      updates: Array<{ timestamp: Date; message: string }>;
    } | null>;
  };
  
  favorites: {
    getAll(userId: string): Promise<FavoriteItem[]>;
    add(userId: string, bowl: BowlComposition, name: string): Promise<{ success: boolean; favoriteId?: string }>;
    remove(favoriteId: string): Promise<{ success: boolean }>;
  };
  
  ml: {
    getRecommendations(
      userId?: string,
      dietaryFilters?: DietaryRestriction[],
      allergenFilters?: Allergen[]
    ): Promise<{
      recommendations: MLRecommendation[];
      confidence: number;
      source: string;
    }>;
  };
  
  cart: {
    get(sessionId: string): Promise<{
      items: any[];
      total: number;
      itemCount: number;
    }>;
    add(sessionId: string, item: BowlComposition): Promise<{ success: boolean; cartTotal: number }>;
    remove(sessionId: string, itemId: string): Promise<{ success: boolean; cartTotal: number }>;
    clear(sessionId: string): Promise<{ success: boolean }>;
  };
  
  faq: {
    search(query: string): Promise<{ answer: string; confidence: number }>;
  };
  
  healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, 'up' | 'down'>;
    timestamp: Date;
  }>;
}

// Create the API client instance
const createAPIClient = (): APIClient => {
  if (USE_MOCK_API) {
    console.log('🧪 Using Mock API for development');
    return mockAPI as APIClient;
  } else {
    console.log('🚀 Using Real API for production');
    // return realAPI as APIClient; // Uncomment when real API is ready
    throw new Error('Real API not implemented yet. Set NEXT_PUBLIC_USE_MOCK_API=true to use mock API.');
  }
};

// Export the configured API client
export const apiClient = createAPIClient();

// Export types for convenience
export type { APIClient };

// Utility functions for common API patterns
export const apiUtils = {
  // Handle API errors with user-friendly messages
  handleError(error: any): string {
    if (error.message) {
      return error.message;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return 'Something went wrong. Please try again.';
  },

  // Format prices consistently
  formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  },

  // Format dates consistently
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  // Format time consistently
  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Calculate distance for display
  formatDistance(km: number): string {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  },

  // Validate session before API calls
  async validateSession(sessionId: string): Promise<boolean> {
    try {
      const session = await apiClient.session.get(sessionId);
      return session !== null;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  },

  // Retry API calls with exponential backoff
  async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
};

export default apiClient; 