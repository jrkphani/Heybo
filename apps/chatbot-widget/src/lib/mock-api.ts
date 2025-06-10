// Mock API functions for HeyBo Chatbot Widget
import { 
  mockUsers, 
  mockLocations, 
  mockIngredients, 
  mockSignatureBowls,
  mockRecentOrders,
  mockFavoriteItems,
  mockMLRecommendations,
  mockFAQResponses,
  mockBases,
  mockProteins,
  mockSides,
  mockSauces,
  mockGarnishes
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

// Utility function to extract all ingredients from a BowlComposition
const getAllIngredients = (bowl: BowlComposition): HeyBoIngredient[] => {
  const ingredients: HeyBoIngredient[] = [];
  
  if (bowl.base) ingredients.push(bowl.base);
  if (bowl.protein) ingredients.push(bowl.protein);
  if (bowl.extraProtein) ingredients.push(...bowl.extraProtein);
  if (bowl.sides) ingredients.push(...bowl.sides);
  if (bowl.extraSides) ingredients.push(...bowl.extraSides);
  if (bowl.sauce) ingredients.push(bowl.sauce);
  if (bowl.garnish) ingredients.push(bowl.garnish);
  
  return ingredients;
};

// Simulate API delay with randomization for realistic testing
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms + Math.random() * 200));

// Enhanced error simulation
const simulateError = (errorRate: number = 0.1) => Math.random() < errorRate;

// Mock Session Management
const mockSessionAPI = {
  sessions: new Map<string, any>(),
  
  async createSession(userId?: string, userType: 'registered' | 'guest' = 'guest'): Promise<{ sessionId: string; expiresAt: Date }> {
    await delay(200);
    
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const session = {
      sessionId,
      userId,
      userType,
      createdAt: new Date(),
      expiresAt,
      isActive: true,
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform
      },
      currentStep: 'welcome',
      orderContext: {},
      cart: [],
      preferences: {}
    };
    
    this.sessions.set(sessionId, session);
    return { sessionId, expiresAt };
  },

  async getSession(sessionId: string): Promise<any | null> {
    await delay(100);
    
    const session = this.sessions.get(sessionId);
    if (!session || session.expiresAt < new Date()) {
      return null;
    }
    
    return session;
  },

  async updateSession(sessionId: string, updates: any): Promise<boolean> {
    await delay(150);
    
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    
    Object.assign(session, updates, { lastActivity: new Date() });
    this.sessions.set(sessionId, session);
    return true;
  },

  async clearSession(sessionId: string): Promise<boolean> {
    await delay(100);
    return this.sessions.delete(sessionId);
  }
};

// Enhanced Authentication API
const mockAuthAPI = {
  async validateToken(token: string): Promise<User | null> {
    await delay(300);
    
    if (simulateError(0.05)) {
      throw new Error('Authentication service temporarily unavailable');
    }
    
    // Simulate token validation
    if (token === "valid-registered-token") {
      return mockUsers[0] || null; // Registered user
    } else if (token === "valid-guest-token") {
      return mockUsers[1] || null; // Guest user
    }
    
    return null; // Invalid token
  },

  async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string; retryAfter?: number }> {
    await delay(800);
    
    // Simulate rate limiting
    if (simulateError(0.15)) {
      return { 
        success: false, 
        message: "Too many OTP requests. Please try again later.", 
        retryAfter: 300 // 5 minutes
      };
    }
    
    // Simulate OTP sending
    if (phoneNumber.startsWith("+65")) {
      return { success: true, message: "OTP sent successfully" };
    }
    
    return { success: false, message: "Invalid phone number format" };
  },

  async verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; token?: string; attemptsLeft?: number }> {
    await delay(600);
    
    // Simulate OTP verification with attempt tracking
    if (otp === "123456") {
      const { sessionId } = await mockSessionAPI.createSession(undefined, 'guest');
      return { success: true, token: sessionId };
    }
    
    return { success: false, attemptsLeft: 4 };
  },

  async refreshToken(token: string): Promise<{ success: boolean; newToken?: string }> {
    await delay(400);
    
    const session = await mockSessionAPI.getSession(token);
    if (!session) {
      return { success: false };
    }
    
    // Extend session
    await mockSessionAPI.updateSession(token, {
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    
    return { success: true, newToken: token };
  }
};

// Enhanced Location API with GPS integration
const mockLocationAPI = {
  async getLocations(type?: 'station' | 'outlet'): Promise<Location[]> {
    await delay(400);
    
    if (simulateError(0.05)) {
      throw new Error('Location service temporarily unavailable');
    }
    
    if (type) {
      return mockLocations.filter(location => location.type === type);
    }
    
    return mockLocations;
  },

  async getNearestLocations(lat: number, lng: number, limit: number = 3): Promise<Location[]> {
    await delay(500);
    
    // Enhanced distance calculation with realistic results
    const locationsWithDistance = mockLocations.map(location => {
      const distance = this.calculateDistance(lat, lng, location.coordinates.lat, location.coordinates.lng);
      return {
        ...location,
        distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
        estimatedTravelTime: Math.ceil(distance * 3) + " mins" // Rough estimate
      };
    });
    
    return locationsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  },

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  },

  async getLocationDetails(locationId: string): Promise<Location | null> {
    await delay(300);
    
    return mockLocations.find(loc => loc.id === locationId) || null;
  },

  async checkLocationAvailability(locationId: string, orderTime: Date): Promise<{ available: boolean; reason?: string }> {
    await delay(200);
    
    const location = mockLocations.find(loc => loc.id === locationId);
    if (!location) {
      return { available: false, reason: 'Location not found' };
    }
    
    // Simulate availability checks
    const hour = orderTime.getHours();
    const dayName = orderTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const day = dayName as keyof typeof location.operatingHours;
    const hours = location.operatingHours[day];
    
    if (!hours) {
      return { available: false, reason: 'Location closed on this day' };
    }
    
    const openHour = parseInt(hours.open?.split(':')[0] || '0');
    const closeHour = parseInt(hours.close?.split(':')[0] || '24');
    
    if (hour < openHour || hour >= closeHour) {
      return { available: false, reason: `Location closed. Open ${hours.open} - ${hours.close}` };
    }
    
    return { available: true };
  }
};

// Enhanced Ingredients API with better availability simulation
const mockIngredientsAPI = {
  async getIngredients(locationId: string, category?: IngredientCategory): Promise<HeyBoIngredient[]> {
    await delay(300);
    
    if (simulateError(0.03)) {
      throw new Error('Ingredient data temporarily unavailable');
    }
    
    let ingredients = [...mockIngredients];
    
    // Filter by category if specified
    if (category) {
      ingredients = ingredients.filter(ingredient => ingredient.category === category);
    }
    
    // Simulate realistic availability based on location and time
    const now = new Date();
    const hour = now.getHours();
    
    ingredients = ingredients.map(ingredient => {
      let isAvailable = ingredient.isAvailable;
      
      // Simulate some ingredients being unavailable at certain locations
      if (locationId === "location-3" && ingredient.id === "protein-2") {
        isAvailable = false; // Steak unavailable at location-3
      }
      
      // Simulate time-based availability (some items run out later in the day)
      if (hour > 20 && Math.random() < 0.2) {
        isAvailable = false;
      }
      
      // Simulate random stockouts
      if (Math.random() < 0.05) {
        isAvailable = false;
      }
      
      return {
        ...ingredient,
        isAvailable,
        stockLevel: isAvailable ? Math.floor(Math.random() * 100) + 20 : 0
      };
    });
    
    return ingredients;
  },

  async getIngredientsByCategory(): Promise<Record<IngredientCategory, HeyBoIngredient[]>> {
    await delay(400);
    
    return {
      base: mockBases,
      protein: mockProteins,
      sides: mockSides,
      sauce: mockSauces,
      garnish: mockGarnishes
    };
  },

  async checkIngredientAvailability(ingredientIds: string[], locationId: string): Promise<Record<string, boolean>> {
    await delay(250);
    
    const availability: Record<string, boolean> = {};
    
    for (const id of ingredientIds) {
      const ingredient = mockIngredients.find(ing => ing.id === id);
      availability[id] = ingredient?.isAvailable ?? false;
      
      // Apply location-specific availability
      if (locationId === "location-3" && id === "protein-2") {
        availability[id] = false;
      }
    }
    
    return availability;
  }
};

// Enhanced Signature Bowls API
export const mockSignatureBowlsAPI = {
  async getSignatureBowls(locationId: string): Promise<BowlComposition[]> {
    await delay(600);
    
    if (simulateError(0.05)) {
      throw new Error('Menu service temporarily unavailable');
    }
    
    // Simulate ingredient availability affecting signature bowls
    return mockSignatureBowls.map(bowl => ({
      ...bowl,
      isAvailable: locationId !== "location-3" || bowl.id !== "signature-2" // Muscle Beach unavailable at location-3
    }));
  },

  async getPopularBowls(limit: number = 5): Promise<BowlComposition[]> {
    await delay(400);
    
    return mockSignatureBowls
      .filter(bowl => bowl.isPopular)
      .slice(0, limit);
  },

  async getBowlDetails(bowlId: string): Promise<BowlComposition | null> {
    await delay(300);
    
    return mockSignatureBowls.find(bowl => bowl.id === bowlId) || null;
  }
};

// Enhanced Orders API with order tracking
export const mockOrdersAPI = {
  orders: new Map<string, any>(),

  async getRecentOrders(userId: string, limit: number = 5): Promise<RecentOrder[]> {
    await delay(500);
    
    if (simulateError(0.05)) {
      throw new Error('Order history temporarily unavailable');
    }
    
    return mockRecentOrders
      .filter(order => order.userId === userId)
      .sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime())
      .slice(0, limit);
  },

  async submitOrder(bowlComposition: BowlComposition, locationId: string, orderTime: Date, sessionId: string): Promise<{ 
    success: boolean; 
    orderId?: string; 
    message: string;
    estimatedReadyTime?: Date;
    trackingCode?: string;
  }> {
    await delay(1000);
    
    if (simulateError(0.02)) {
      return {
        success: false,
        message: 'Order submission failed. Please try again.'
      };
    }
    
    // Simulate order submission
    const orderId = `HB${Date.now().toString().slice(-6)}`;
    const trackingCode = `${orderId}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const estimatedReadyTime = new Date(Date.now() + (6 + Math.random() * 4) * 60 * 1000); // 6-10 minutes
    
    const order = {
      orderId,
      trackingCode,
      bowlComposition,
      locationId,
      orderTime,
      sessionId,
      status: 'confirmed',
      estimatedReadyTime,
      createdAt: new Date()
    };
    
    this.orders.set(orderId, order);
    
    return {
      success: true,
      orderId,
      trackingCode,
      estimatedReadyTime,
      message: `Order ${orderId} confirmed! Ready in 6-10 minutes.`
    };
  },

  async getOrderStatus(orderId: string): Promise<{
    status: 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
    estimatedReadyTime?: Date;
    updates: Array<{ timestamp: Date; message: string }>;
  } | null> {
    await delay(400);
    
    const order = this.orders.get(orderId);
    if (!order) return null;
    
    // Simulate order progression
    const now = new Date();
    const orderAge = now.getTime() - order.createdAt.getTime();
    
    let status: 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled' = 'confirmed';
    const updates = [
      { timestamp: order.createdAt, message: 'Order confirmed and sent to kitchen' }
    ];
    
    if (orderAge > 2 * 60 * 1000) { // 2 minutes
      status = 'preparing';
      updates.push({ 
        timestamp: new Date(order.createdAt.getTime() + 2 * 60 * 1000), 
        message: 'Your bowl is being prepared' 
      });
    }
    
    if (orderAge > 8 * 60 * 1000) { // 8 minutes
      status = 'ready';
      updates.push({ 
        timestamp: new Date(order.createdAt.getTime() + 8 * 60 * 1000), 
        message: 'Your order is ready for pickup!' 
      });
    }
    
    return {
      status,
      estimatedReadyTime: order.estimatedReadyTime,
      updates
    };
  }
};

// Enhanced Favorites API
export const mockFavoritesAPI = {
  async getFavorites(userId: string, limit: number = 5): Promise<FavoriteItem[]> {
    await delay(400);
    
    if (simulateError(0.05)) {
      throw new Error('Favorites service temporarily unavailable');
    }
    
    return mockFavoriteItems
      .filter(fav => fav.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  },

  async addToFavorites(userId: string, bowlComposition: BowlComposition, name: string): Promise<{ success: boolean; favoriteId?: string }> {
    await delay(600);
    
    const favoriteId = `fav-${Date.now()}`;
    
    // Simulate adding to favorites (in real app, this would persist)
    const newFavorite: FavoriteItem = {
      id: favoriteId,
      userId,
      bowlComposition,
      name,
      type: 'custom',
      price: bowlComposition.totalPrice,
      isFavorite: true,
      createdAt: new Date()
    };
    
    mockFavoriteItems.push(newFavorite);
    
    return {
      success: true,
      favoriteId
    };
  },

  async removeFromFavorites(favoriteId: string): Promise<{ success: boolean }> {
    await delay(400);
    
    const index = mockFavoriteItems.findIndex(fav => fav.id === favoriteId);
    if (index !== -1) {
      mockFavoriteItems.splice(index, 1);
      return { success: true };
    }
    
    return { success: false };
  }
};

// Enhanced ML Recommendations API with robust fallback system
export const mockMLAPI = {
  cache: new Map<string, any>(),
  
  async getRecommendations(
    userId?: string,
    dietaryFilters: DietaryRestriction[] = [],
    allergenFilters: Allergen[] = [],
    locationId?: string,
    timeout: number = 3000
  ): Promise<{
    recommendations: MLRecommendation[];
    fallbackUsed: boolean;
    source: 'ml' | 'cached' | 'popular' | 'signature';
    confidence: number;
    processingTime: number;
  }> {
    const startTime = Date.now();
    
    try {
      // Try ML service first with timeout
      const mlResult = await Promise.race([
        this.callMLService(userId, dietaryFilters, allergenFilters, locationId),
        new Promise((_, reject) => setTimeout(() => reject(new Error('ML timeout')), timeout))
      ]);
      
      return {
        ...mlResult as any,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      console.log('ML service unavailable, using fallback');
      
      // Fallback to cached/popular recommendations
      const fallbackResult = await this.getFallbackRecommendations(dietaryFilters, allergenFilters, locationId);
      
      return {
        ...fallbackResult,
        processingTime: Date.now() - startTime
      };
    }
  },

  async callMLService(
    userId?: string,
    dietaryFilters: DietaryRestriction[] = [],
    allergenFilters: Allergen[] = [],
    locationId?: string
  ): Promise<{
    recommendations: MLRecommendation[];
    fallbackUsed: boolean;
    source: 'ml';
    confidence: number;
  }> {
    // Simulate ML service call with variable delay
    await delay(1000 + Math.random() * 2000);
    
    // Simulate ML service failures
    if (simulateError(0.15)) {
      throw new Error('ML service temporarily unavailable');
    }
    
    // Generate ML-style recommendations
    let recommendations = [...mockMLRecommendations];
    
    // Apply user preferences and filters
    if (userId) {
      const user = mockUsers.find(u => u.id === userId);
      if (user?.preferences) {
        // Boost recommendations based on user preferences
        recommendations = recommendations.map(rec => ({
          ...rec,
          confidence: user.preferences.dietaryRestrictions.some(pref => 
            getAllIngredients(rec.bowlComposition).some((ing: HeyBoIngredient) => 
              pref === 'vegetarian' && ing.isVegan
            )
          ) ? rec.confidence + 0.2 : rec.confidence
        }));
      }
    }
    
    // Apply dietary filters
    recommendations = this.applyFiltersToRecommendations(recommendations, dietaryFilters, allergenFilters);
    
    // Sort by confidence and take top 5
    recommendations = recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
    
    // Cache the results
    this.cacheRecommendations(recommendations);
    
    return {
      recommendations,
      fallbackUsed: false,
      source: 'ml',
      confidence: 0.85
    };
  },

  async getFallbackRecommendations(
    dietaryFilters: DietaryRestriction[] = [],
    allergenFilters: Allergen[] = [],
    locationId?: string
  ): Promise<{
    recommendations: MLRecommendation[];
    fallbackUsed: boolean;
    source: 'cached' | 'popular' | 'signature';
    confidence: number;
  }> {
    await delay(200);
    
    // Try cached recommendations first
    const cached = this.getCachedRecommendations(dietaryFilters, allergenFilters);
    if (cached.length > 0) {
      return {
        recommendations: cached,
        fallbackUsed: true,
        source: 'cached',
        confidence: 0.70
      };
    }
    
    // Try popular items
    try {
      const popular = await this.getPopularItems(dietaryFilters, allergenFilters, locationId);
      if (popular.length > 0) {
        return {
          recommendations: popular,
          fallbackUsed: true,
          source: 'popular',
          confidence: 0.65
        };
      }
    } catch (error) {
      console.log('Popular items API failed, using signature bowls');
    }
    
    // Final fallback to signature bowls
    const signature = this.getSignatureBowlRecommendations(dietaryFilters, allergenFilters);
    return {
      recommendations: signature,
      fallbackUsed: true,
      source: 'signature',
      confidence: 0.60
    };
  },

  getCachedRecommendations(
    dietaryFilters: DietaryRestriction[] = [],
    allergenFilters: Allergen[] = []
  ): MLRecommendation[] {
    const cacheKey = `${dietaryFilters.join(',')}-${allergenFilters.join(',')}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < 30 * 60 * 1000) { // 30 minutes
      return cached.recommendations;
    }
    
    return [];
  },

  async getPopularItems(
    dietaryFilters: DietaryRestriction[] = [],
    allergenFilters: Allergen[] = [],
    locationId?: string
  ): Promise<MLRecommendation[]> {
    await delay(300);
    
    // Simulate popular items API call
    if (simulateError(0.1)) {
      throw new Error('Popular items API unavailable');
    }
    
    // Convert popular signature bowls to recommendations
    const popularBowls = mockSignatureBowls.filter(bowl => bowl.isPopular);
    
    const recommendations: MLRecommendation[] = popularBowls.map(bowl => ({
      id: `popular-${bowl.id}`,
      bowlComposition: bowl,
      confidence: 0.75,
      reasoning: `Popular choice - ${bowl.name}`,
      tags: ['popular', 'trending'],
      estimatedCalories: getAllIngredients(bowl).reduce((sum: number, ing: HeyBoIngredient) => sum + (ing.nutritionalInfo?.calories || 0), 0),
      estimatedPrice: bowl.totalPrice || 1200,
      dietaryInfo: {
        isVegan: getAllIngredients(bowl).every((ing: HeyBoIngredient) => ing.isVegan),
        isGlutenFree: getAllIngredients(bowl).every((ing: HeyBoIngredient) => ing.isGlutenFree),
        allergens: [...new Set(getAllIngredients(bowl).flatMap((ing: HeyBoIngredient) => ing.allergens))]
      }
    }));
    
    return this.applyFiltersToRecommendations(recommendations, dietaryFilters, allergenFilters);
  },

  getSignatureBowlRecommendations(
    dietaryFilters: DietaryRestriction[] = [],
    allergenFilters: Allergen[] = []
  ): MLRecommendation[] {
    // Convert all signature bowls to basic recommendations
    const recommendations: MLRecommendation[] = mockSignatureBowls.map(bowl => ({
      id: `signature-${bowl.id}`,
      bowlComposition: bowl,
      confidence: 0.60,
      reasoning: `Signature bowl - ${bowl.name}`,
      tags: ['signature', 'chef-curated'],
      estimatedCalories: getAllIngredients(bowl).reduce((sum: number, ing: HeyBoIngredient) => sum + (ing.nutritionalInfo?.calories || 0), 0),
      estimatedPrice: bowl.totalPrice || 1200,
      dietaryInfo: {
        isVegan: getAllIngredients(bowl).every((ing: HeyBoIngredient) => ing.isVegan),
        isGlutenFree: getAllIngredients(bowl).every((ing: HeyBoIngredient) => ing.isGlutenFree),
        allergens: [...new Set(getAllIngredients(bowl).flatMap((ing: HeyBoIngredient) => ing.allergens))]
      }
    }));
    
    return this.applyFiltersToRecommendations(recommendations, dietaryFilters, allergenFilters);
  },

  applyFiltersToRecommendations(
    recommendations: MLRecommendation[],
    dietaryFilters: DietaryRestriction[] = [],
    allergenFilters: Allergen[] = []
  ): MLRecommendation[] {
    return recommendations.filter(rec => {
      const ingredients = getAllIngredients(rec.bowlComposition);
      
      // Apply dietary restrictions
      for (const filter of dietaryFilters) {
        switch (filter) {
          case 'vegetarian':
            if (!ingredients.every((ing: HeyBoIngredient) => ing.isVegan || ing.category !== 'protein' || ing.subcategory !== 'meat')) {
              return false;
            }
            break;
          case 'vegan':
            if (!ingredients.every((ing: HeyBoIngredient) => ing.isVegan)) {
              return false;
            }
            break;
          case 'gluten-free':
            if (!ingredients.every((ing: HeyBoIngredient) => ing.isGlutenFree)) {
              return false;
            }
            break;
        }
      }
      
      // Apply allergen filters
      for (const allergen of allergenFilters) {
        if (ingredients.some((ing: HeyBoIngredient) => ing.allergens.includes(allergen))) {
          return false;
        }
      }
      
      return true;
    });
  },

  cacheRecommendations(recommendations: MLRecommendation[]): void {
    // Simple caching mechanism
    const cacheKey = 'default';
    this.cache.set(cacheKey, {
      recommendations,
      timestamp: Date.now()
    });
  }
};

// (Duplicate exports removed - they're already at the end of the file)

// Enhanced FAQ API with better semantic search simulation
export const mockFAQAPI = {
  async searchFAQ(query: string): Promise<{ answer: string; confidence: number; sources?: string[] }> {
    await delay(600);
    
    if (simulateError(0.05)) {
      throw new Error('FAQ service temporarily unavailable');
    }
    
    const lowerQuery = query.toLowerCase();
    
    // Enhanced keyword matching with scoring
    let bestMatch = { answer: '', confidence: 0, sources: [] as string[] };
    
    for (const [keyword, answer] of Object.entries(mockFAQResponses)) {
      let score = 0;

      // Check for exact phrase matches
      if (lowerQuery.includes(keyword.toLowerCase())) {
        score += 0.8;
      }

      // Check for word matches
      const queryWords = lowerQuery.split(' ');
      if (queryWords.some(word => keyword.toLowerCase().includes(word))) {
        score += 0.6;
      }

      if (score > bestMatch.confidence) {
        bestMatch = {
          answer,
          confidence: Math.min(score, 0.95), // Cap confidence
          sources: [keyword]
        };
      }
    }
    
    // If no good match found, provide generic helpful response
    if (bestMatch.confidence < 0.3) {
      bestMatch = {
        answer: "I'd be happy to help! Could you be more specific about what you'd like to know? You can ask about our ingredients, nutrition info, ordering process, or anything else about HeyBo.",
        confidence: 0.4,
        sources: ['General Help']
      };
    }
    
    return bestMatch;
  }
};

// Cart management with persistence simulation
export const mockCartAPI = {
  carts: new Map<string, any>(),

  async getCart(sessionId: string): Promise<{
    items: any[];
    total: number;
    itemCount: number;
    lastUpdated: Date;
  }> {
    await delay(100);
    
    const cart = this.carts.get(sessionId) || {
      items: [],
      total: 0,
      itemCount: 0,
      lastUpdated: new Date()
    };
    
    return cart;
  },

  async addToCart(sessionId: string, item: BowlComposition): Promise<{ success: boolean; cartTotal: number }> {
    await delay(300);
    
    if (simulateError(0.02)) {
      throw new Error('Unable to add item to cart. Please try again.');
    }
    
    const cart = this.carts.get(sessionId) || { items: [], total: 0, itemCount: 0 };
    
    cart.items.push({
      id: `item-${Date.now()}`,
      bowl: item,
      price: this.calculatePrice(item),
      addedAt: new Date()
    });
    
    cart.total = cart.items.reduce((sum: number, cartItem: any) => sum + cartItem.price, 0);
    cart.itemCount = cart.items.length;
    cart.lastUpdated = new Date();
    
    this.carts.set(sessionId, cart);
    
    return {
      success: true,
      cartTotal: cart.total
    };
  },

  async removeFromCart(sessionId: string, itemId: string): Promise<{ success: boolean; cartTotal: number }> {
    await delay(200);
    
    const cart = this.carts.get(sessionId);
    if (!cart) {
      return { success: false, cartTotal: 0 };
    }
    
    cart.items = cart.items.filter((item: any) => item.id !== itemId);
    cart.total = cart.items.reduce((sum: number, cartItem: any) => sum + cartItem.price, 0);
    cart.itemCount = cart.items.length;
    cart.lastUpdated = new Date();
    
    this.carts.set(sessionId, cart);
    
    return {
      success: true,
      cartTotal: cart.total
    };
  },

  async clearCart(sessionId: string): Promise<{ success: boolean }> {
    await delay(150);
    
    this.carts.set(sessionId, {
      items: [],
      total: 0,
      itemCount: 0,
      lastUpdated: new Date()
    });
    
    return { success: true };
  },

  calculatePrice(bowl: Partial<BowlComposition>): number {
    if (bowl.totalPrice) {
      return bowl.totalPrice;
    }

    let total = 0;

    // Calculate based on individual ingredients
    if (bowl.base) total += bowl.base.price;
    if (bowl.protein) total += bowl.protein.price;
    if (bowl.sides) total += bowl.sides.reduce((sum, side) => sum + side.price, 0);
    if (bowl.extraSides) total += bowl.extraSides.reduce((sum, side) => sum + side.price, 0);
    if (bowl.extraProtein) total += bowl.extraProtein.reduce((sum, protein) => sum + protein.price, 0);
    if (bowl.sauce) total += bowl.sauce.price;
    if (bowl.garnish) total += bowl.garnish.price;

    return total || 1200; // Default price if no ingredients
  }
};

// Utility functions
export const mockUtilityAPI = {
  calculateWeight(bowl: Partial<BowlComposition>): number {
    if (bowl.totalWeight) {
      return bowl.totalWeight;
    }

    let total = 0;

    // Calculate based on individual ingredients
    if (bowl.base) total += bowl.base.weight;
    if (bowl.protein) total += bowl.protein.weight;
    if (bowl.sides) total += bowl.sides.reduce((sum, side) => sum + side.weight, 0);
    if (bowl.extraSides) total += bowl.extraSides.reduce((sum, side) => sum + side.weight, 0);
    if (bowl.extraProtein) total += bowl.extraProtein.reduce((sum, protein) => sum + protein.weight, 0);
    if (bowl.sauce) total += bowl.sauce.weight;
    if (bowl.garnish) total += bowl.garnish.weight;

    return total;
  },

  calculatePrice(bowl: Partial<BowlComposition>): number {
    return mockCartAPI.calculatePrice(bowl);
  },

  validateBowlComposition(bowl: Partial<BowlComposition>): { isValid: boolean; warnings: string[]; errors: string[] } {
    const warnings: string[] = [];
    const errors: string[] = [];

    // Check for required base
    if (!bowl.base) {
      errors.push('Bowl must have a base (grain)');
    }
    
    // Check weight
    const weight = this.calculateWeight(bowl);
    if (weight > 900) {
      errors.push('Bowl exceeds maximum weight of 900g');
    } else if (weight > 720) {
      warnings.push('Bowl is quite full - you might want to consider splitting into two orders');
    }
    
    // Check for too many proteins
    const proteinCount = (bowl.protein ? 1 : 0) + (bowl.extraProtein ? bowl.extraProtein.length : 0);
    if (proteinCount > 2) {
      warnings.push('Multiple proteins selected - consider fewer proteins for better flavor balance');
    }

    // Check for too many sides
    const sidesCount = (bowl.sides ? bowl.sides.length : 0) + (bowl.extraSides ? bowl.extraSides.length : 0);
    if (sidesCount > 3) {
      warnings.push('Many sides selected - consider fewer sides for better balance');
    }
    
    return {
      isValid: errors.length === 0,
      warnings,
      errors
    };
  },

  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, 'up' | 'down' | 'slow'>;
    timestamp: Date;
  }> {
    await delay(200);
    
    // Simulate service health checks
    const services = {
      auth: Math.random() > 0.05 ? 'up' : 'down',
      locations: Math.random() > 0.03 ? 'up' : 'down', 
      ingredients: Math.random() > 0.05 ? 'up' : 'down',
      ml_recommendations: Math.random() > 0.15 ? 'up' : Math.random() > 0.5 ? 'slow' : 'down',
      orders: Math.random() > 0.02 ? 'up' : 'down',
      cart: Math.random() > 0.01 ? 'up' : 'down',
      faq: Math.random() > 0.05 ? 'up' : 'down'
    } as const;
    
    const downServices = Object.values(services).filter(status => status === 'down').length;
    const slowServices = Object.values(services).filter(status => status === 'slow').length;
    
    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (downServices === 0 && slowServices <= 1) {
      status = 'healthy';
    } else if (downServices <= 1 && slowServices <= 2) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }
    
    return {
      status,
      services,
      timestamp: new Date()
    };
  }
};

// Rating API for post-order feedback
export const mockRatingAPI = {
  async submitRating(orderId: string, rating: {
    overall?: number;
    comments?: string;
    cyoBowlRatings?: Array<{ bowlId: string; thumbsUp: boolean }>;
  }): Promise<{ success: boolean; message: string }> {
    await delay(500);
    
    if (simulateError(0.02)) {
      return {
        success: false,
        message: 'Failed to submit rating. Please try again.'
      };
    }
    
    // In real implementation, this would save to database
    console.log('Rating submitted:', { orderId, rating });
    
    return {
      success: true,
      message: 'Thank you for your feedback!'
    };
  },

  async hasUnratedOrder(userId: string): Promise<{ hasUnrated: boolean; orderId?: string }> {
    await delay(200);
    
    // Simulate checking for unrated orders
    const recentOrders = mockRecentOrders.filter(order => order.userId === userId);
    const unratedOrder = recentOrders.find(order => order.rating === null || order.rating === undefined);
    
    return {
      hasUnrated: !!unratedOrder,
      orderId: unratedOrder?.id
    };
  }
};

// Export missing APIs that are being imported by components
export { mockLocationAPI };
export { mockIngredientsAPI };

// Export the missing APIs that are imported by components
export const mockRecentOrdersAPI = mockOrdersAPI;
export const mockMLRecommendationsAPI = mockMLAPI;

// Export a combined API object for convenience
export const mockAPI = {
  session: mockSessionAPI,
  auth: mockAuthAPI,
  locations: mockLocationAPI,
  ingredients: mockIngredientsAPI,
  signatureBowls: mockSignatureBowlsAPI,
  orders: mockOrdersAPI,
  favorites: mockFavoritesAPI,
  ml: mockMLAPI,
  faq: mockFAQAPI,
  cart: mockCartAPI,
  utility: mockUtilityAPI,
  rating: mockRatingAPI
};
