// HeyBo API Integration Service
import type { 
  Location, 
  HeyBoIngredient, 
  BowlComposition, 
  User, 
  OrderSummary,
  RecentOrder,
  FavoriteItem
} from '../../types';

interface APIConfig {
  saladStopBaseURL: string;
  heyBoBaseURL: string;
  authAPIBaseURL: string;
  timeout: number;
  retryAttempts: number;
  cacheTTL: {
    locations: number;
    menus: number;
    ingredients: number;
    userProfile: number;
  };
}

interface CacheEntry<T> {
  data: T;
  expires: number;
  lastFetched: number;
}

export class APIService {
  private static instance: APIService;
  private config: APIConfig;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private requestQueue: Map<string, Promise<any>> = new Map();

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  private constructor() {
    this.config = {
      saladStopBaseURL: 'https://dtymvut4pk8gt.cloudfront.net/api/v1',
      heyBoBaseURL: 'https://d2o7qvkenn9k24.cloudfront.net/api/v1',
      authAPIBaseURL: process.env.NEXT_PUBLIC_AUTH_API_URL || '',
      timeout: 10000, // 10 seconds
      retryAttempts: 3,
      cacheTTL: {
        locations: 15 * 60 * 1000, // 15 minutes
        menus: 15 * 60 * 1000, // 15 minutes
        ingredients: 5 * 60 * 1000, // 5 minutes
        userProfile: 30 * 60 * 1000, // 30 minutes
      }
    };
  }

  // Location APIs
  // =============

  /**
   * Get all locations for a brand with caching
   */
  async getLocations(brand: 'saladstop' | 'heybo'): Promise<Location[]> {
    const cacheKey = `locations_${brand}`;
    
    // Check cache first
    const cached = this.getFromCache<Location[]>(cacheKey);
    if (cached) return cached;

    // Prevent duplicate requests
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey)!;
    }

    const baseURL = brand === 'saladstop' ? this.config.saladStopBaseURL : this.config.heyBoBaseURL;
    const request = this.fetchWithRetry<{ locations: any[] }>(`${baseURL}/locations/`)
      .then(response => {
        const locations = response.locations.map(this.mapLocationData);
        this.setCache(cacheKey, locations, this.config.cacheTTL.locations);
        return locations;
      })
      .catch(error => {
        console.error(`Failed to fetch ${brand} locations:`, error);
        // Return fallback data or empty array
        return this.getFallbackLocations(brand);
      })
      .finally(() => {
        this.requestQueue.delete(cacheKey);
      });

    this.requestQueue.set(cacheKey, request);
    return request;
  }

  /**
   * Get menu data for a specific location
   */
  async getLocationMenu(brand: 'saladstop' | 'heybo', locationId: string): Promise<BowlComposition[]> {
    const cacheKey = `menu_${brand}_${locationId}`;
    
    const cached = this.getFromCache<BowlComposition[]>(cacheKey);
    if (cached) return cached;

    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey)!;
    }

    const baseURL = brand === 'saladstop' ? this.config.saladStopBaseURL : this.config.heyBoBaseURL;
    const request = this.fetchWithRetry<{ menu_groups: any[] }>(`${baseURL}/gglocation-menus/?location=${locationId}`)
      .then(response => {
        const menuItems = response.menu_groups.flatMap(group => 
          group.menu_items.map(this.mapMenuItemData)
        );
        this.setCache(cacheKey, menuItems, this.config.cacheTTL.menus);
        return menuItems;
      })
      .catch(error => {
        console.error(`Failed to fetch ${brand} menu for location ${locationId}:`, error);
        return this.getFallbackMenuItems(brand);
      })
      .finally(() => {
        this.requestQueue.delete(cacheKey);
      });

    this.requestQueue.set(cacheKey, request);
    return request;
  }

  // Ingredient APIs
  // ===============

  /**
   * Get ingredient availability for location with best-effort validation
   */
  async getIngredientAvailability(locationId: string, locationType: 'station' | 'outlet'): Promise<HeyBoIngredient[]> {
    const cacheKey = `ingredients_${locationId}_${locationType}`;
    
    const cached = this.getFromCache<HeyBoIngredient[]>(cacheKey);
    if (cached) return cached;

    try {
      // This would call the database service for ingredient availability
      // For now, using mock data with best-effort approach
      const ingredients = await this.fetchIngredientAvailabilityFromDB(locationId, locationType);
      this.setCache(cacheKey, ingredients, this.config.cacheTTL.ingredients);
      return ingredients;
    } catch (error) {
      console.warn('Failed to fetch ingredient availability, using fallback:', error);
      return this.getFallbackIngredients();
    }
  }

  // Authentication APIs
  // ===================

  /**
   * Validate platform token with retry logic
   */
  async validatePlatformToken(token: string): Promise<User | null> {
    try {
      const response = await this.fetchWithRetry<{ user: any; valid: boolean }>(`${this.config.authAPIBaseURL}/validate-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      if (response.valid && response.user) {
        return this.mapUserData(response.user);
      }
      return null;
    } catch (error) {
      console.error('Token validation failed:', error);
      return null;
    }
  }

  /**
   * Send OTP with rate limiting awareness
   */
  async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string; attemptsRemaining?: number }> {
    try {
      const response = await this.fetchWithRetry<{ success: boolean; message: string; attempts_remaining?: number }>(`${this.config.authAPIBaseURL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber })
      });

      return {
        success: response.success,
        message: response.message,
        attemptsRemaining: response.attempts_remaining
      };
    } catch (error) {
      console.error('OTP send failed:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      };
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; user?: User; token?: string; message?: string }> {
    try {
      const response = await this.fetchWithRetry<{ success: boolean; user?: any; token?: string; message?: string }>(`${this.config.authAPIBaseURL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber, otp })
      });

      return {
        success: response.success,
        user: response.user ? this.mapUserData(response.user) : undefined,
        token: response.token,
        message: response.message
      };
    } catch (error) {
      console.error('OTP verification failed:', error);
      return {
        success: false,
        message: 'OTP verification failed. Please try again.'
      };
    }
  }

  // User Data APIs
  // ==============

  /**
   * Get user's recent orders
   */
  async getRecentOrders(userId: string): Promise<RecentOrder[]> {
    const cacheKey = `recent_orders_${userId}`;
    
    const cached = this.getFromCache<RecentOrder[]>(cacheKey);
    if (cached) return cached;

    try {
      // This would call the database service
      const orders = await this.fetchRecentOrdersFromDB(userId);
      this.setCache(cacheKey, orders, 5 * 60 * 1000); // 5 minutes cache
      return orders;
    } catch (error) {
      console.error('Failed to fetch recent orders:', error);
      return [];
    }
  }

  /**
   * Get user's favorite items
   */
  async getFavorites(userId: string): Promise<FavoriteItem[]> {
    const cacheKey = `favorites_${userId}`;
    
    const cached = this.getFromCache<FavoriteItem[]>(cacheKey);
    if (cached) return cached;

    try {
      // This would call the database service
      const favorites = await this.fetchFavoritesFromDB(userId);
      this.setCache(cacheKey, favorites, 10 * 60 * 1000); // 10 minutes cache
      return favorites;
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      return [];
    }
  }

  /**
   * Get popular items for upselling and fallbacks
   */
  async getPopularItems(brand: 'saladstop' | 'heybo', locationId?: string): Promise<BowlComposition[]> {
    const cacheKey = `popular_items_${brand}_${locationId || 'all'}`;
    
    const cached = this.getFromCache<BowlComposition[]>(cacheKey);
    if (cached) return cached;

    try {
      // This would call the popular items API (endpoint TBD)
      const popularResponse = await this.fetchWithRetry<{ popular_items: any[] }>(`${this.config.authAPIBaseURL}/popular-items?brand=${brand}&location=${locationId || ''}`);
      
      const popularItems = popularResponse.popular_items.map(this.mapMenuItemData);
      this.setCache(cacheKey, popularItems, 30 * 60 * 1000); // 30 minutes cache
      return popularItems;
    } catch (error) {
      console.warn('Failed to fetch popular items, using fallback:', error);
      return this.getFallbackPopularItems(brand);
    }
  }

  // Order Handoff API
  // =================

  /**
   * Submit order to platform (final handoff)
   */
  async submitOrder(orderData: OrderSummary, sessionId: string, userId?: string): Promise<{ success: boolean; orderId?: string; message?: string }> {
    try {
      // This is the critical handoff point - API format still pending from customer
      const handoffPayload = {
        session_id: sessionId,
        user_id: userId,
        platform: 'heybo', // or 'saladstop'
        order_details: {
          pickup_time: orderData.orderTime.type === 'scheduled' ? orderData.orderTime.scheduledTime : 'asap',
          location: {
            id: orderData.location.id,
            type: orderData.location.type
          },
          items: orderData.items.map(item => ({
            item_type: item.bowl.isSignature ? 'signature_bowl' : 'cyo_bowl',
            customizations: item.customizations || [],
            add_ons: item.addOns || [],
            total_price: item.bowl.totalPrice / 100 // Convert cents to dollars
          })),
          grand_total: orderData.total / 100 // Convert cents to dollars
        },
        handoff_timestamp: new Date().toISOString()
      };

      const response = await this.fetchWithRetry<{ success: boolean; order_id?: string; message?: string }>(`${this.config.authAPIBaseURL}/submit-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(handoffPayload)
      });

      return {
        success: response.success,
        orderId: response.order_id,
        message: response.message
      };
    } catch (error) {
      console.error('Order submission failed:', error);
      return {
        success: false,
        message: 'Failed to submit order. Please try again or contact support.'
      };
    }
  }

  // Core HTTP Methods
  // =================

  /**
   * Fetch with retry logic and timeout
   */
  private async fetchWithRetry<T>(url: string, options: RequestInit = {}, attempt = 1): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      // Retry logic
      if (attempt < this.config.retryAttempts && !controller.signal.aborted) {
        console.warn(`Request failed, retrying (${attempt}/${this.config.retryAttempts}):`, error);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        return this.fetchWithRetry(url, options, attempt + 1);
      }

      throw error;
    }
  }

  // Data Mapping Methods
  // ====================

  private mapLocationData(locationData: any): Location {
    return {
      id: locationData.id || locationData.location_id,
      name: locationData.name,
      address: locationData.address,
      type: locationData.type || 'outlet',
      coordinates: {
        lat: parseFloat(locationData.latitude) || 0,
        lng: parseFloat(locationData.longitude) || 0
      },
      operatingHours: locationData.operating_hours || {},
      isActive: locationData.is_active !== false,
      estimatedWaitTime: locationData.estimated_wait_time || "10-15 minutes"
    };
  }

  private mapMenuItemData(itemData: any): BowlComposition {
    return {
      id: itemData.id || itemData.item_id,
      name: itemData.name,
      description: itemData.description || '',
      base: this.mapIngredientData(itemData.base || {}),
      protein: itemData.protein ? this.mapIngredientData(itemData.protein) : undefined,
      extraProtein: (itemData.extra_protein || []).map(this.mapIngredientData),
      sides: (itemData.sides || []).map(this.mapIngredientData),
      extraSides: (itemData.extra_sides || []).map(this.mapIngredientData),
      sauce: itemData.sauce ? this.mapIngredientData(itemData.sauce) : undefined,
      garnish: itemData.garnish ? this.mapIngredientData(itemData.garnish) : undefined,
      totalWeight: itemData.total_weight || 0,
      totalPrice: itemData.total_price || 0,
      isSignature: itemData.is_signature || false,
      imageUrl: itemData.image_url,
      tags: itemData.tags || [],
      rating: itemData.rating,
      prepTime: itemData.prep_time,
      calories: itemData.calories,
      isPopular: itemData.is_popular || false,
      isAvailable: itemData.is_available !== false
    };
  }

  private mapIngredientData(ingredientData: any): HeyBoIngredient {
    return {
      id: ingredientData.id || ingredientData.ingredient_id,
      name: ingredientData.name,
      category: ingredientData.category || 'base',
      subcategory: ingredientData.subcategory || '',
      isAvailable: ingredientData.is_available !== false,
      isVegan: ingredientData.is_vegan || false,
      isGlutenFree: ingredientData.is_gluten_free || false,
      allergens: ingredientData.allergens || [],
      nutritionalInfo: {
        calories: ingredientData.calories || 0,
        protein: ingredientData.protein || 0,
        carbs: ingredientData.carbs || 0,
        fat: ingredientData.fat || 0,
        fiber: ingredientData.fiber || 0,
        sodium: ingredientData.sodium || 0
      },
      weight: ingredientData.weight || 0,
      price: ingredientData.price || 0,
      description: ingredientData.description || '',
      imageUrl: ingredientData.image_url || ''
    };
  }

  private mapUserData(userData: any): User {
    return {
      id: userData.id || userData.user_id,
      name: userData.name || userData.full_name,
      email: userData.email,
      phone: userData.phone || userData.phone_number,
      type: userData.type || 'registered',
      preferences: {
        dietaryRestrictions: userData.dietary_restrictions || [],
        allergens: userData.allergens || [],
        spiceLevel: userData.spice_level || 'medium',
        proteinPreference: userData.protein_preference || 'any'
      },
      orderHistory: userData.order_history || [],
      favorites: userData.favorites || [],
      lastOrderedLocation: userData.last_ordered_location
    };
  }

  // Fallback Methods
  // ================

  private getFallbackLocations(brand: 'saladstop' | 'heybo'): Location[] {
    // Return basic fallback locations
    return [
      {
        id: 'fallback-location-1',
        name: 'Marina Bay Sands',
        address: '10 Bayfront Ave, Singapore 018956',
        type: 'outlet',
        coordinates: { lat: 1.2834, lng: 103.8607 },
        operatingHours: {} as any,
        isActive: true,
        estimatedWaitTime: '15-20 minutes'
      }
    ];
  }

  private getFallbackMenuItems(brand: 'saladstop' | 'heybo'): BowlComposition[] {
    // Return basic fallback menu items
    return [];
  }

  private getFallbackIngredients(): HeyBoIngredient[] {
    // Return basic fallback ingredients
    return [];
  }

  private getFallbackPopularItems(brand: 'saladstop' | 'heybo'): BowlComposition[] {
    // Return basic popular items fallback
    return [];
  }

  // Database Integration Methods (would be replaced with actual database service calls)
  // ===================================================================================

  private async fetchIngredientAvailabilityFromDB(locationId: string, locationType: string): Promise<HeyBoIngredient[]> {
    // This would call the database service
    // For now, return empty array
    return [];
  }

  private async fetchRecentOrdersFromDB(userId: string): Promise<RecentOrder[]> {
    // This would call the database service
    return [];
  }

  private async fetchFavoritesFromDB(userId: string): Promise<FavoriteItem[]> {
    // This would call the database service
    return [];
  }

  // Cache Management
  // ================

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (entry && entry.expires > Date.now()) {
      return entry.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
      lastFetched: Date.now()
    });
  }

  /**
   * Clear cache for specific patterns or all
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { totalEntries: number; memoryUsage: number; hitRate: number } {
    return {
      totalEntries: this.cache.size,
      memoryUsage: JSON.stringify([...this.cache.values()]).length,
      hitRate: 0 // Would need hit/miss tracking for actual calculation
    };
  }
}

// Export singleton instance
export const apiService = APIService.getInstance(); 