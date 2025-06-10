// Mock API Service for HeyBo Chatbot Widget
import { 
  mockUsers, 
  mockLocations, 
  mockIngredients, 
  mockSignatureBowls,
  mockRecentOrders,
  mockFavoriteItems,
  mockMLRecommendations,
  mockFAQResponses
} from './mock-data';
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

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms + Math.random() * 200));

// Error simulation (5% chance by default)
const simulateError = (errorRate: number = 0.05) => Math.random() < errorRate;

// Session storage
const sessionStore = new Map<string, any>();
const cartStore = new Map<string, any[]>();

// Mock API Service
export const mockAPI = {
  // Session Management
  session: {
    async create(userId?: string): Promise<{ sessionId: string; expiresAt: Date }> {
      await delay(200);
      
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      const session = {
        sessionId,
        userId,
        createdAt: new Date(),
        expiresAt,
        isActive: true,
        currentStep: 'welcome',
        cart: [],
        preferences: {}
      };
      
      sessionStore.set(sessionId, session);
      cartStore.set(sessionId, []);
      
      return { sessionId, expiresAt };
    },

    async get(sessionId: string): Promise<any | null> {
      await delay(100);
      const session = sessionStore.get(sessionId);
      return session && session.expiresAt > new Date() ? session : null;
    },

    async update(sessionId: string, updates: any): Promise<boolean> {
      await delay(100);
      const session = sessionStore.get(sessionId);
      if (!session) return false;
      
      sessionStore.set(sessionId, { ...session, ...updates, lastActivity: new Date() });
      return true;
    },

    async clear(sessionId: string): Promise<boolean> {
      await delay(100);
      sessionStore.delete(sessionId);
      cartStore.delete(sessionId);
      return true;
    }
  },

  // Authentication
  auth: {
    async validateToken(token: string): Promise<User | null> {
      await delay(200);
      
      if (simulateError()) {
        throw new Error('Authentication service unavailable');
      }
      
      // Simple token validation
      if (token.includes('valid')) {
        return mockUsers[0] || null;
      }
      return null;
    },

    async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
      await delay(800);
      
      if (phoneNumber.startsWith('+65')) {
        return { success: true, message: 'OTP sent successfully' };
      }
      return { success: false, message: 'Invalid phone number' };
    },

    async verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; token?: string }> {
      await delay(600);

      if (otp === '123456') {
        const { sessionId } = await mockAPI.session.create();
        return { success: true, token: sessionId };
      }
      return { success: false };
    }
  },

  // Locations
  locations: {
    async getAll(type?: 'station' | 'outlet'): Promise<Location[]> {
      await delay(400);
      
      if (simulateError()) {
        throw new Error('Location service unavailable');
      }
      
      let locations = [...mockLocations];
      if (type) {
        locations = locations.filter(loc => loc.type === type);
      }
      
      return locations;
    },

    async getNearest(lat: number, lng: number, limit: number = 3): Promise<Location[]> {
      await delay(500);
      
      const locationsWithDistance = mockLocations.map(location => {
        const distance = this.calculateDistance(lat, lng, location.coordinates.lat, location.coordinates.lng);
        return {
          ...location,
          distance: Math.round(distance * 100) / 100
        };
      });
      
      return locationsWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit);
    },

    async getDetails(locationId: string): Promise<Location | null> {
      await delay(300);
      return mockLocations.find(loc => loc.id === locationId) || null;
    },

    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
      const R = 6371; // Earth's radius in km
      const dLat = this.deg2rad(lat2 - lat1);
      const dLon = this.deg2rad(lon2 - lon1);
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    },

    deg2rad(deg: number): number {
      return deg * (Math.PI/180);
    }
  },

  // Ingredients
  ingredients: {
    async getAll(locationId: string, category?: IngredientCategory): Promise<HeyBoIngredient[]> {
      await delay(300);
      
      let ingredients = [...mockIngredients];
      if (category) {
        ingredients = ingredients.filter(ing => ing.category === category);
      }
      
      // Simulate some unavailable items
      return ingredients.map(ing => ({
        ...ing,
        isAvailable: Math.random() > 0.1 // 90% availability
      }));
    },

    async checkAvailability(ingredientIds: string[], locationId: string): Promise<Record<string, boolean>> {
      await delay(200);
      
      const availability: Record<string, boolean> = {};
      ingredientIds.forEach(id => {
        availability[id] = Math.random() > 0.1; // 90% chance available
      });
      
      return availability;
    }
  },

  // Signature Bowls
  bowls: {
    async getSignature(locationId: string): Promise<BowlComposition[]> {
      await delay(400);
      return [...mockSignatureBowls];
    },

    async getPopular(limit: number = 5): Promise<BowlComposition[]> {
      await delay(300);
      return mockSignatureBowls.filter(bowl => bowl.isPopular).slice(0, limit);
    },

    async getDetails(bowlId: string): Promise<BowlComposition | null> {
      await delay(200);
      return mockSignatureBowls.find(bowl => bowl.id === bowlId) || null;
    }
  },

  // Orders
  orders: {
    async getRecent(userId: string, limit: number = 5): Promise<RecentOrder[]> {
      await delay(300);
      return mockRecentOrders.filter(order => order.userId === userId).slice(0, limit);
    },

    async submit(
      bowlComposition: BowlComposition, 
      locationId: string, 
      sessionId: string
    ): Promise<{ 
      success: boolean; 
      orderId?: string; 
      message: string;
      estimatedReadyTime?: Date;
    }> {
      await delay(1000);
      
      if (simulateError(0.02)) {
        return { success: false, message: 'Order submission failed. Please try again.' };
      }
      
      const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const estimatedReadyTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      
      return {
        success: true,
        orderId,
        message: 'Order submitted successfully!',
        estimatedReadyTime
      };
    },

    async getStatus(orderId: string): Promise<{
      status: 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
      estimatedReadyTime?: Date;
      updates: Array<{ timestamp: Date; message: string }>;
    } | null> {
      await delay(300);
      
      // Simulate order progression
      const statuses = ['confirmed', 'preparing', 'ready', 'completed'] as const;
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)] || 'confirmed';
      
      return {
        status: randomStatus,
        estimatedReadyTime: new Date(Date.now() + 10 * 60 * 1000),
        updates: [
          { timestamp: new Date(Date.now() - 5 * 60 * 1000), message: 'Order confirmed' },
          { timestamp: new Date(), message: `Order is ${randomStatus}` }
        ]
      };
    }
  },

  // Favorites
  favorites: {
    async getAll(userId: string): Promise<FavoriteItem[]> {
      await delay(300);
      return mockFavoriteItems.filter(item => item.userId === userId);
    },

    async add(userId: string, bowl: BowlComposition, name: string): Promise<{ success: boolean; favoriteId?: string }> {
      await delay(400);
      
      const favoriteId = `fav-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      
      return { success: true, favoriteId };
    },

    async remove(favoriteId: string): Promise<{ success: boolean }> {
      await delay(200);
      return { success: true };
    }
  },

  // ML Recommendations
  ml: {
    async getRecommendations(
      userId?: string,
      dietaryFilters: DietaryRestriction[] = [],
      allergenFilters: Allergen[] = []
    ): Promise<{
      recommendations: MLRecommendation[];
      confidence: number;
      source: string;
    }> {
      await delay(2000); // Simulate ML processing time
      
      if (simulateError(0.15)) {
        // Fallback to popular bowls
        const fallbackRecs = mockSignatureBowls.slice(0, 3).map(bowl => ({
          id: `fallback-${bowl.id}`,
          bowlComposition: bowl,
          confidence: 0.6,
          reasoning: 'Popular choice',
          tags: ['popular'],
          estimatedCalories: 450,
          estimatedPrice: 1200
        }));
        
        return {
          recommendations: fallbackRecs,
          confidence: 0.6,
          source: 'fallback'
        };
      }
      
      // Filter recommendations based on dietary restrictions
      let recommendations = [...mockMLRecommendations];
      
      if (dietaryFilters.includes('vegan')) {
        recommendations = recommendations.filter(rec =>
          rec.tags?.includes('vegan') || rec.bowlComposition.tags?.includes('vegan')
        );
      }

      if (dietaryFilters.includes('gluten-free')) {
        recommendations = recommendations.filter(rec =>
          rec.tags?.includes('gluten-free') || rec.bowlComposition.tags?.includes('gluten-free')
        );
      }
      
      return {
        recommendations: recommendations.slice(0, 5),
        confidence: 0.85,
        source: 'ml'
      };
    }
  },

  // Cart Management
  cart: {
    async get(sessionId: string): Promise<{
      items: any[];
      total: number;
      itemCount: number;
    }> {
      await delay(100);
      
      const items = cartStore.get(sessionId) || [];
      const total = items.reduce((sum: number, item: any) => sum + (item.price || 1200), 0);
      
      return {
        items,
        total,
        itemCount: items.length
      };
    },

    async add(sessionId: string, item: BowlComposition): Promise<{ success: boolean; cartTotal: number }> {
      await delay(200);
      
      const cartItems = cartStore.get(sessionId) || [];
      const cartItem = {
        ...item,
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        price: item.totalPrice || 1200,
        addedAt: new Date()
      };
      
      cartItems.push(cartItem);
      cartStore.set(sessionId, cartItems);
      
      const cartTotal = cartItems.reduce((sum: number, item: any) => sum + item.price, 0);
      
      return { success: true, cartTotal };
    },

    async remove(sessionId: string, itemId: string): Promise<{ success: boolean; cartTotal: number }> {
      await delay(200);
      
      const cartItems = cartStore.get(sessionId) || [];
      const filteredItems = cartItems.filter((item: any) => item.id !== itemId);
      cartStore.set(sessionId, filteredItems);
      
      const cartTotal = filteredItems.reduce((sum: number, item: any) => sum + item.price, 0);
      
      return { success: true, cartTotal };
    },

    async clear(sessionId: string): Promise<{ success: boolean }> {
      await delay(100);
      cartStore.set(sessionId, []);
      return { success: true };
    }
  },

  // FAQ
  faq: {
    async search(query: string): Promise<{ answer: string; confidence: number }> {
      await delay(600);
      
      const normalizedQuery = query.toLowerCase();
      
      // Simple keyword matching
      for (const [keyword, answer] of Object.entries(mockFAQResponses)) {
        if (normalizedQuery.includes(keyword)) {
          return { answer, confidence: 0.9 };
        }
      }
      
      return { 
        answer: "I'm sorry, I don't have specific information about that. Would you like to speak with our customer service team?", 
        confidence: 0.3 
      };
    }
  },

  // Health Check
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, 'up' | 'down'>;
    timestamp: Date;
  }> {
    await delay(100);
    
    return {
      status: 'healthy',
      services: {
        auth: 'up',
        locations: 'up',
        ingredients: 'up',
        orders: 'up',
        ml: 'up'
      },
      timestamp: new Date()
    };
  }
};

export default mockAPI; 