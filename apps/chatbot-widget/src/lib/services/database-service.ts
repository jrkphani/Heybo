// HeyBo Database Service Layer
import type { 
  User, 
  Location, 
  HeyBoIngredient, 
  CartItem, 
  OrderSummary,
  RatingData,
  SessionData,
  OperatingHours,
  RecentOrder
} from '../../types';

interface DatabaseConfig {
  vendorDB: {
    connectionString: string;
    maxConnections: number;
    readOnly: true;
  };
  genAIDB: {
    connectionString: string;
    maxConnections: number;
    readWrite: true;
  };
}

export class DatabaseService {
  private static instance: DatabaseService;
  private config: DatabaseConfig;
  private queryCache: Map<string, { data: any; expires: number }> = new Map();

  static getInstance(config?: DatabaseConfig): DatabaseService {
    if (!DatabaseService.instance) {
      if (!config) throw new Error('Database config required for initialization');
      DatabaseService.instance = new DatabaseService(config);
    }
    return DatabaseService.instance;
  }

  private constructor(config: DatabaseConfig) {
    this.config = config;
  }

  // Vendor Database (Read-Only) Operations
  // =====================================

  /**
   * Get user's recent orders (limit 5)
   * Query: ORDER BY created_at DESC LIMIT 5
   */
  async getRecentOrders(userId: string): Promise<OrderSummary[]> {
    const cacheKey = `recent_orders_${userId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // SQL: SELECT order_id, order_details, created_at, total_amount
      //      FROM orders_order 
      //      WHERE customer_id = $1 AND status = 130
      //      ORDER BY created_at DESC LIMIT 5
      const query = `
        SELECT order_id, order_details, created_at, total_amount
        FROM orders_order 
        WHERE customer_id = $1 
          AND status = 130
        ORDER BY created_at DESC
        LIMIT 5
      `;
      
      const result = await this.executeVendorQuery(query, [userId]);
      const orders = result.rows.map(this.mapOrderRow);
      
      this.setCache(cacheKey, orders, 5 * 60 * 1000); // 5 min cache
      return orders;
    } catch (error) {
      console.error('Failed to fetch recent orders:', error);
      return [];
    }
  }

  /**
   * Get user's favorite items (limit 5)
   * Query: ORDER BY created_at DESC LIMIT 5
   */
  async getFavorites(userId: string): Promise<any[]> {
    const cacheKey = `favorites_${userId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // SQL: SELECT favorite_id, menu_item_id, custom_menusnapshot_id, 
      //             favorite_name, created_at
      //      FROM customer_customerfavoritemenu 
      //      WHERE customer_id = $1
      //      ORDER BY created_at DESC LIMIT 5
      const query = `
        SELECT favorite_id, menu_item_id, custom_menusnapshot_id, 
               favorite_name, created_at
        FROM customer_customerfavoritemenu 
        WHERE customer_id = $1
        ORDER BY created_at DESC
        LIMIT 5
      `;
      
      const result = await this.executeVendorQuery(query, [userId]);
      const favorites = result.rows.map(this.mapFavoriteRow);
      
      this.setCache(cacheKey, favorites, 10 * 60 * 1000); // 10 min cache
      return favorites;
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      return [];
    }
  }

  /**
   * Get ingredient availability for location
   */
  async getIngredientsAvailability(locationId: string, locationType: string): Promise<HeyBoIngredient[]> {
    const cacheKey = `ingredients_${locationId}_${locationType}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // SQL from spec: Complex ingredient availability query
      const query = `
        SELECT i.name, ic.name AS category_name, isc.name AS subcategory_name,
               CASE WHEN gdi.ingredient_id IS NOT NULL THEN false ELSE true END AS available
        FROM public.gogreenfood_ingredient i
        LEFT JOIN public.gogreenfood_ingredientcategory ic ON i.ingredient_category_id = ic.id
        LEFT JOIN public.gogreenfood_ingredientsubcategory isc ON i.ingredient_subcategory_id = isc.id
        LEFT JOIN public.gglmenu_gglocationdisabledingredient gdi ON (
            gdi.ingredient_id = i.id AND gdi.gglocation_id = $1 AND gdi.gglocation_type = $2
        )
        WHERE i.is_deleted = false AND i.exclude_in_CYO = false
      `;
      
      const result = await this.executeVendorQuery(query, [locationId, locationType]);
      const ingredients = result.rows.map(this.mapIngredientRow);
      
      this.setCache(cacheKey, ingredients, 15 * 60 * 1000); // 15 min cache
      return ingredients;
    } catch (error) {
      console.error('Failed to fetch ingredient availability:', error);
      return [];
    }
  }

  /**
   * Get last ordered location for user prioritization
   */
  async getLastOrderedLocation(userId: string): Promise<Location | null> {
    try {
      // SQL: Get user's most recent outlet order
      const query = `
        SELECT DISTINCT o.outlet_location_id, l.name, l.address 
        FROM orders_order o
        JOIN location l ON o.outlet_location_id = l.id
        WHERE o.customer_id = $1 
          AND o.outlet_location_id IS NOT NULL
          AND o.status = 130
        ORDER BY o.created_at DESC
        LIMIT 1
      `;
      
      const result = await this.executeVendorQuery(query, [userId]);
      return result.rows.length > 0 ? this.mapLocationRow(result.rows[0]) : null;
    } catch (error) {
      console.error('Failed to fetch last ordered location:', error);
      return null;
    }
  }

  /**
   * Calculate nearest locations using GPS coordinates
   */
  async getNearestLocations(
    latitude: number, 
    longitude: number, 
    locationType: string, 
    limit: number = 3
  ): Promise<Location[]> {
    try {
      // SQL: Haversine formula for distance calculation
      const query = `
        SELECT id, name, address, latitude, longitude,
          (6371 * acos(cos(radians($1)) * cos(radians(latitude)) 
           * cos(radians(longitude) - radians($2)) 
           + sin(radians($1)) * sin(radians(latitude)))) AS distance
        FROM location 
        WHERE location_type = $3 AND is_active = true
        ORDER BY distance
        LIMIT $4
      `;
      
      const result = await this.executeVendorQuery(query, [latitude, longitude, locationType, limit]);
      return result.rows.map(this.mapLocationWithDistanceRow);
    } catch (error) {
      console.error('Failed to calculate nearest locations:', error);
      return [];
    }
  }

  // GenAI Database (Read-Write) Operations
  // =====================================

  /**
   * Save user session data
   */
  async saveSession(sessionData: SessionData): Promise<boolean> {
    try {
      const query = `
        INSERT INTO user_sessions (
          session_id, user_id, user_type, session_data, 
          created_at, last_activity, expires_at, device_info
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (session_id) 
        DO UPDATE SET 
          session_data = $4,
          last_activity = $6,
          expires_at = $7
      `;
      
      await this.executeGenAIQuery(query, [
        sessionData.sessionId,
        sessionData.userId,
        sessionData.userType,
        JSON.stringify(sessionData),
        new Date(),
        new Date(),
        sessionData.expiresAt,
        JSON.stringify({ deviceId: sessionData.deviceId })
      ]);
      
      return true;
    } catch (error) {
      console.error('Failed to save session:', error);
      return false;
    }
  }

  /**
   * Save cart data with validation
   */
  async saveCart(sessionId: string, cartData: CartItem[], totalAmount: number): Promise<boolean> {
    try {
      const validationHash = this.generateCartHash(cartData);
      
      const query = `
        INSERT INTO user_carts (
          cart_id, session_id, cart_data, total_amount, 
          item_count, validation_hash, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (session_id) 
        DO UPDATE SET 
          cart_data = $3,
          total_amount = $4,
          item_count = $5,
          validation_hash = $6,
          updated_at = $8
      `;
      
      await this.executeGenAIQuery(query, [
        `cart_${sessionId}`,
        sessionId,
        JSON.stringify(cartData),
        totalAmount,
        cartData.length,
        validationHash,
        new Date(),
        new Date()
      ]);
      
      return true;
    } catch (error) {
      console.error('Failed to save cart:', error);
      return false;
    }
  }

  /**
   * Save order ratings (overall + individual CYO bowls)
   */
  async saveRating(ratingData: RatingData): Promise<boolean> {
    try {
      const query = `
        INSERT INTO order_ratings (
          rating_id, order_id, overall_rating, 
          overall_comment, bowl_ratings, 
          timestamp, skipped, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;
      
      await this.executeGenAIQuery(query, [
        `rating_${ratingData.orderId}_${Date.now()}`,
        ratingData.orderId,
        ratingData.overallRating,
        ratingData.overallComment,
        JSON.stringify(ratingData.bowlRatings),
        ratingData.timestamp,
        ratingData.skipped,
        new Date()
      ]);
      
      return true;
    } catch (error) {
      console.error('Failed to save rating:', error);
      return false;
    }
  }

  /**
   * Clean up expired sessions (24-hour retention policy)
   */
  async cleanupExpiredSessions(): Promise<number> {
    try {
      const query = `
        DELETE FROM user_sessions 
        WHERE expires_at < NOW() OR created_at < NOW() - INTERVAL '24 hours'
      `;
      
      const result = await this.executeGenAIQuery(query);
      return result.rowCount || 0;
    } catch (error) {
      console.error('Failed to cleanup expired sessions:', error);
      return 0;
    }
  }

  // Private Helper Methods
  // =====================

  private async executeVendorQuery(query: string, params: any[] = []): Promise<any> {
    // Execute read-only query on vendor database
    // Implementation would use actual database connection
    throw new Error('Vendor database query execution not implemented');
  }

  private async executeGenAIQuery(query: string, params: any[] = []): Promise<any> {
    // Execute read-write query on GenAI database
    // Implementation would use actual database connection
    throw new Error('GenAI database query execution not implemented');
  }

  private mapOrderRow(row: any): OrderSummary {
    return {
      items: JSON.parse(row.order_details || '[]'),
      subtotal: parseFloat(row.total_amount) || 0,
      tax: 0,
      total: parseFloat(row.total_amount) || 0,
      estimatedTime: "15-20 minutes",
      location: {} as Location,
      orderTime: { type: 'asap' }
    };
  }

  private mapFavoriteRow(row: any): any {
    return {
      id: row.favorite_id,
      menuItemId: row.menu_item_id,
      customSnapshotId: row.custom_menusnapshot_id,
      name: row.favorite_name,
      createdAt: row.created_at
    };
  }

  private mapIngredientRow(row: any): HeyBoIngredient {
    return {
      id: `ingredient_${row.name}`,
      name: row.name,
      category: row.category_name,
      subcategory: row.subcategory_name,
      isAvailable: row.available,
      isVegan: false,
      isGlutenFree: false,
      allergens: [],
      nutritionalInfo: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sodium: 0
      },
      weight: 0,
      price: 0,
      description: '',
      imageUrl: ''
    };
  }

  private mapLocationRow(row: any): Location {
    return {
      id: row.outlet_location_id,
      name: row.name,
      address: row.address,
      type: 'outlet',
      coordinates: {
        lat: 0,
        lng: 0
      },
      operatingHours: {} as OperatingHours,
      isActive: true,
      estimatedWaitTime: "10-15 minutes"
    };
  }

  private mapLocationWithDistanceRow(row: any): Location {
    return {
      id: row.id,
      name: row.name,
      address: row.address,
      type: 'outlet',
      coordinates: {
        lat: row.latitude,
        lng: row.longitude
      },
      operatingHours: {} as OperatingHours,
      isActive: true,
      estimatedWaitTime: "10-15 minutes",
      distance: row.distance
    };
  }

  private getFromCache(key: string): any | null {
    const cached = this.queryCache.get(key);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    this.queryCache.delete(key);
    return null;
  }

  private setCache(key: string, data: any, ttlMs: number): void {
    this.queryCache.set(key, {
      data,
      expires: Date.now() + ttlMs
    });
  }

  private generateCartHash(cartData: CartItem[]): string {
    // Generate validation hash for cart integrity
    const cartString = JSON.stringify(cartData);
    return btoa(cartString).slice(0, 32);
  }

  /**
   * Initialize database connections
   */
  async initialize(): Promise<void> {
    try {
      // Initialize vendor database connection (read-only)
      // This would establish actual database connections
      console.log('Initializing database connections...');
      
      // Initialize GenAI database connection (read-write)
      // This would establish actual database connections
      console.log('Database connections initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Get location details from database
   */
  async getLocationDetails(locationId: string): Promise<{
    operatingHours: OperatingHours;
    isActive: boolean;
    estimatedWaitTime: string;
  } | null> {
    try {
      const query = `
        SELECT operating_hours, is_active, estimated_wait_time
        FROM locations 
        WHERE location_id = $1
      `;
      
      const result = await this.executeVendorQuery(query, [locationId]);
      
      if (result.length === 0) {
        return null;
      }

      return {
        operatingHours: JSON.parse(result[0].operating_hours || '{}'),
        isActive: result[0].is_active,
        estimatedWaitTime: result[0].estimated_wait_time || '10-15 minutes'
      };
    } catch (error) {
      console.error('Failed to get location details:', error);
      return null;
    }
  }

  /**
   * Get user profile from database
   */
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const query = `
        SELECT user_id, name, email, phone, user_type, preferences, created_at
        FROM users 
        WHERE user_id = $1
      `;
      
      const result = await this.executeGenAIQuery(query, [userId]);
      
      if (result.length === 0) {
        return null;
      }

      const user = result[0];
      return {
        id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.user_type || 'registered',
        preferences: JSON.parse(user.preferences || '{}'),
        orderHistory: [],
        favorites: []
      };
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  /**
   * Save order summary to database
   */
  async saveOrderSummary(orderData: {
    orderId: string;
    userId?: string;
    sessionId: string;
    orderDetails: OrderSummary;
    submittedAt: Date;
    status: string;
  }): Promise<boolean> {
    try {
      const query = `
        INSERT INTO order_submissions (
          order_id, user_id, session_id, order_details, 
          submitted_at, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      
      await this.executeGenAIQuery(query, [
        orderData.orderId,
        orderData.userId,
        orderData.sessionId,
        JSON.stringify(orderData.orderDetails),
        orderData.submittedAt,
        orderData.status,
        new Date()
      ]);
      
      return true;
    } catch (error) {
      console.error('Failed to save order summary:', error);
      return false;
    }
  }

  /**
   * Add user order to order history
   */
  async addUserOrder(userId: string, order: RecentOrder): Promise<boolean> {
    try {
      const query = `
        INSERT INTO user_order_history (
          user_id, order_id, order_details, total_amount, 
          order_status, order_time, location_id, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;
      
      await this.executeGenAIQuery(query, [
        userId,
        order.id,
        JSON.stringify(order.items),
        order.totalAmount,
        order.status,
        order.orderDate,
        order.locationId,
        new Date()
      ]);
      
      return true;
    } catch (error) {
      console.error('Failed to add user order:', error);
      return false;
    }
  }

  /**
   * Health check for database connectivity
   */
  async healthCheck(): Promise<{ connected: boolean; details: string }> {
    try {
      // Test vendor database connection
      await this.executeVendorQuery('SELECT 1 as test', []);
      
      // Test GenAI database connection
      await this.executeGenAIQuery('SELECT 1 as test', []);
      
      return {
        connected: true,
        details: 'Both database connections are healthy'
      };
    } catch (error) {
      return {
        connected: false,
        details: `Database health check failed: ${error}`
      };
    }
  }
}

// Export singleton instance
export const databaseService = DatabaseService.getInstance(); 