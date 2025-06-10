// HeyBo Integration Coordinator - Phase 4 Backend Integration
import { DatabaseService } from './database-service';
import { mlService } from './ml-service';
import { apiService } from './api-service';
import { environmentService } from '../config/environment';
import type { 
  Location, 
  HeyBoIngredient, 
  BowlComposition, 
  User, 
  OrderSummary,
  UserPreferences,
  CartItem,
  RecentOrder,
  FavoriteItem
} from '../../types';
import { useChatbotStore } from '../../store/chatbot-store';
import { useLayoutStore } from '../../store/layout-store';

interface IntegrationStatus {
  database: 'connected' | 'disconnected' | 'error';
  mlService: 'healthy' | 'degraded' | 'down';
  apiService: 'healthy' | 'degraded' | 'down';
  overall: 'operational' | 'degraded' | 'critical';
}

export class IntegrationCoordinator {
  private static instance: IntegrationCoordinator;
  private dbService: DatabaseService;
  private status: IntegrationStatus;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  static getInstance(): IntegrationCoordinator {
    if (!IntegrationCoordinator.instance) {
      IntegrationCoordinator.instance = new IntegrationCoordinator();
    }
    return IntegrationCoordinator.instance;
  }

  private constructor() {
    this.dbService = DatabaseService.getInstance();
    this.status = {
      database: 'disconnected',
      mlService: 'down',
      apiService: 'down',
      overall: 'critical'
    };
    this.initializeServices();
    this.startHealthMonitoring();
  }

  // ===================
  // Service Initialization
  // ===================

  private async initializeServices(): Promise<void> {
    try {
      // Initialize database connections
      await this.dbService.initialize();
      this.status.database = 'connected';

      // Test ML service health
      const mlHealth = await mlService.healthCheck();
      this.status.mlService = mlHealth.status;

      // Test API service with a simple request
      await this.testAPIConnectivity();
      this.status.apiService = 'healthy';

      this.updateOverallStatus();
      console.log('✅ All backend services initialized successfully');
    } catch (error) {
      console.error('❌ Service initialization failed:', error);
      this.handleInitializationError(error);
    }
  }

  private async testAPIConnectivity(): Promise<void> {
    try {
      // Test SaladStop API
      await apiService.getLocations('saladstop');
      
      // Test HeyBo API
      await apiService.getLocations('heybo');
    } catch (error) {
      this.status.apiService = 'degraded';
      console.warn('API connectivity test failed, but fallbacks available:', error);
    }
  }

  // ===================
  // Location & Menu Integration
  // ===================

  /**
   * Comprehensive location loading with all data sources
   */
  async loadLocationData(brand: 'saladstop' | 'heybo'): Promise<Location[]> {
    try {
      // Get locations from API
      const locations = await apiService.getLocations(brand);
      
      // Enhance with database information (operating hours, real-time availability)
      const enhancedLocations = await Promise.all(
        locations.map(async (location) => {
          try {
            const dbData = await this.dbService.getLocationDetails(location.id);
            return {
              ...location,
              operatingHours: dbData?.operatingHours || location.operatingHours,
              isActive: dbData?.isActive ?? location.isActive,
              estimatedWaitTime: dbData?.estimatedWaitTime || location.estimatedWaitTime
            };
          } catch (error) {
            console.warn(`Failed to enhance location ${location.id}:`, error);
            return location; // Return original data as fallback
          }
        })
      );

      return enhancedLocations;
    } catch (error) {
      console.error('Failed to load location data:', error);
      // Return fallback data
      return this.getFallbackLocations(brand);
    }
  }

  /**
   * Load menu with ingredient availability integration
   */
  async loadMenuWithAvailability(brand: 'saladstop' | 'heybo', location: Location): Promise<BowlComposition[]> {
    try {
      // Get base menu from API
      const menu = await apiService.getLocationMenu(brand, location.id);
      
      // Get real-time ingredient availability
      const availableIngredients = await apiService.getIngredientAvailability(location.id, location.type);
      const availabilityMap = new Map(availableIngredients.map(ing => [ing.id, ing.isAvailable]));

      // Update menu items with real-time availability
      const updatedMenu = menu.map(item => ({
        ...item,
        isAvailable: this.checkBowlAvailability(item, availabilityMap),
        // Update individual ingredient availability
        base: this.updateIngredientAvailability(item.base, availabilityMap),
        protein: item.protein ? this.updateIngredientAvailability(item.protein, availabilityMap) : undefined,
        extraProtein: item.extraProtein.map(ing => this.updateIngredientAvailability(ing, availabilityMap)),
        sides: item.sides.map(ing => this.updateIngredientAvailability(ing, availabilityMap)),
        extraSides: item.extraSides.map(ing => this.updateIngredientAvailability(ing, availabilityMap)),
        sauce: item.sauce ? this.updateIngredientAvailability(item.sauce, availabilityMap) : undefined,
        garnish: item.garnish ? this.updateIngredientAvailability(item.garnish, availabilityMap) : undefined
      }));

      return updatedMenu;
    } catch (error) {
      console.error('Failed to load menu with availability:', error);
      // Return basic menu without real-time availability
      return apiService.getLocationMenu(brand, location.id);
    }
  }

  // ===================
  // User & Authentication Integration
  // ===================

  /**
   * Comprehensive user authentication flow
   */
  async authenticateUser(phoneNumber: string, otp: string): Promise<{ success: boolean; user?: User; token?: string; message?: string }> {
    try {
      // Verify OTP through API
      const otpResult = await apiService.verifyOTP(phoneNumber, otp);
      
      if (otpResult.success && otpResult.user) {
        // Load comprehensive user data from database
        const enhancedUser = await this.loadUserProfile(otpResult.user.id);
        
        // Store user data in application state
        const chatbotStore = useChatbotStore.getState();
        chatbotStore.setUser(enhancedUser || otpResult.user);
        
        // Save session to database
        if (otpResult.token) {
          const now = new Date();
          await this.dbService.saveSession({
            sessionId: this.generateSessionId(),
            userId: otpResult.user.id,
            userType: otpResult.user.type,
            deviceId: this.getDeviceInfo().userAgent || 'unknown',
            createdAt: now.toISOString(),
            lastActivity: now.toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
            currentStep: 'welcome',
            selections: [],
            cart: [],
            preferences: otpResult.user.preferences || {}
          });
        }

        return {
          success: true,
          user: enhancedUser || otpResult.user,
          token: otpResult.token,
          message: 'Authentication successful'
        };
      }

      return otpResult;
    } catch (error) {
      console.error('Authentication failed:', error);
      return {
        success: false,
        message: 'Authentication service unavailable. Please try again.'
      };
    }
  }

  /**
   * Load comprehensive user profile from all data sources
   */
  async loadUserProfile(userId: string): Promise<User | null> {
    try {
      // Get user data from database
      const dbUser = await this.dbService.getUserProfile(userId);
      if (!dbUser) return null;

      // Enhance with recent orders and favorites from API
      const [recentOrders, favorites] = await Promise.all([
        apiService.getRecentOrders(userId),
        apiService.getFavorites(userId)
      ]);

      return {
        ...dbUser,
        orderHistory: recentOrders,
        favorites: favorites
      };
    } catch (error) {
      console.error('Failed to load user profile:', error);
      return null;
    }
  }

  // ===================
  // ML Recommendations Integration
  // ===================

  /**
   * Get personalized recommendations with full context
   */
  async getPersonalizedRecommendations(location: Location, currentUser?: User): Promise<BowlComposition[]> {
    try {
      if (!currentUser) {
        // For guest users, use popular items
        return apiService.getPopularItems('heybo', location.id);
      }

      // Get available ingredients for location
      const availableIngredients = await apiService.getIngredientAvailability(location.id, location.type);

      // Get ML recommendations
      const mlResult = await mlService.getRecommendations(
        currentUser.preferences,
        location,
        availableIngredients
      );

      // Log recommendation source for analytics
      this.logRecommendationEvent(currentUser.id, location.id, mlResult.source, mlResult.fallbackUsed);

      return mlResult.recommendations;
    } catch (error) {
      console.error('Failed to get personalized recommendations:', error);
      // Ultimate fallback to popular items
      return apiService.getPopularItems('heybo', location.id);
    }
  }

  // ===================
  // Order Processing Integration
  // ===================

  /**
   * Comprehensive order submission with validation and tracking
   */
  async submitOrder(orderSummary: OrderSummary, sessionId: string, userId?: string): Promise<{ success: boolean; orderId?: string; message?: string }> {
    try {
      // Pre-submission validation
      const validationResult = await this.validateOrderBeforeSubmission(orderSummary);
      if (!validationResult.valid) {
        return {
          success: false,
          message: validationResult.message
        };
      }

      // Submit order through API
      const submissionResult = await apiService.submitOrder(orderSummary, sessionId, userId);
      
      if (submissionResult.success && submissionResult.orderId) {
        // Save order details to database for tracking
        await this.dbService.saveOrderSummary({
          orderId: submissionResult.orderId,
          userId: userId,
          sessionId: sessionId,
          orderDetails: orderSummary,
          submittedAt: new Date(),
          status: 'submitted'
        });

        // Update user's order history if authenticated
        if (userId) {
          await this.updateUserOrderHistory(userId, submissionResult.orderId, orderSummary);
        }

        // Log successful order for analytics
        this.logOrderEvent('submitted', submissionResult.orderId, orderSummary.total, userId);

        return submissionResult;
      }

      return submissionResult;
    } catch (error) {
      console.error('Order submission failed:', error);
      return {
        success: false,
        message: 'Order submission failed. Please try again or contact support.'
      };
    }
  }

  // ===================
  // Health Monitoring & Status
  // ===================

  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, 30000); // Check every 30 seconds
  }

  private async performHealthCheck(): Promise<void> {
    try {
      // Check database connectivity
      const dbHealth = await this.dbService.healthCheck();
      this.status.database = dbHealth.connected ? 'connected' : 'error';

      // Check ML service
      const mlHealth = await mlService.healthCheck();
      this.status.mlService = mlHealth.status;

      // Check API service by testing a lightweight endpoint
      try {
        await apiService.getLocations('heybo');
        this.status.apiService = 'healthy';
      } catch {
        this.status.apiService = 'degraded';
      }

      this.updateOverallStatus();
    } catch (error) {
      console.error('Health check failed:', error);
    }
  }

  private updateOverallStatus(): void {
    const { database, mlService, apiService } = this.status;
    
    if (database === 'connected' && mlService === 'healthy' && apiService === 'healthy') {
      this.status.overall = 'operational';
    } else if (database === 'connected' && (apiService === 'healthy' || apiService === 'degraded')) {
      this.status.overall = 'degraded';
    } else {
      this.status.overall = 'critical';
    }
  }

  // ===================
  // Utility Methods
  // ===================

  private checkBowlAvailability(bowl: BowlComposition, availabilityMap: Map<string, boolean>): boolean {
    // Check if all required ingredients are available
    const requiredIngredients = [
      bowl.base?.id,
      bowl.protein?.id,
      ...bowl.extraProtein.map(p => p.id),
      ...bowl.sides.map(s => s.id),
      bowl.sauce?.id,
      bowl.garnish?.id
    ].filter(Boolean) as string[];

    return requiredIngredients.every(id => availabilityMap.get(id) !== false);
  }

  private updateIngredientAvailability(ingredient: HeyBoIngredient, availabilityMap: Map<string, boolean>): HeyBoIngredient {
    const isAvailable = availabilityMap.get(ingredient.id);
    return {
      ...ingredient,
      isAvailable: isAvailable !== undefined ? isAvailable : ingredient.isAvailable
    };
  }

  private async validateOrderBeforeSubmission(order: OrderSummary): Promise<{ valid: boolean; message?: string }> {
    // Check if location is still active
    const location = order.location;
    const currentHour = new Date().getHours();
    
    // Basic operating hours check (would be more sophisticated with real data)
    if (currentHour < 7 || currentHour > 22) {
      return {
        valid: false,
        message: 'Location is currently closed. Please check operating hours.'
      };
    }

    // Check if all items are still available
    try {
      const availableIngredients = await apiService.getIngredientAvailability(location.id, location.type);
      const availabilityMap = new Map(availableIngredients.map(ing => [ing.id, ing.isAvailable]));

      for (const item of order.items) {
        if (!this.checkBowlAvailability(item.bowl, availabilityMap)) {
          return {
            valid: false,
            message: `Some ingredients in "${item.bowl.name}" are no longer available. Please review your order.`
          };
        }
      }
    } catch (error) {
      console.warn('Could not validate ingredient availability:', error);
      // Proceed with order if validation fails (best effort)
    }

    return { valid: true };
  }

  private async updateUserOrderHistory(userId: string, orderId: string, orderSummary: OrderSummary): Promise<void> {
    try {
      const recentOrder: RecentOrder = {
        id: orderId,
        userId: userId,
        items: orderSummary.items,
        location: orderSummary.location.name,
        bowlComposition: orderSummary.items[0]?.bowl || {} as BowlComposition,
        orderDate: new Date(),
        locationId: orderSummary.location.id,
        status: 'pending',
        totalAmount: orderSummary.total,
        rating: null
      };

      await this.dbService.addUserOrder(userId, recentOrder);
    } catch (error) {
      console.error('Failed to update user order history:', error);
    }
  }

  // Analytics and Logging
  private logRecommendationEvent(userId: string, locationId: string, source: string, fallbackUsed: boolean): void {
    if (environmentService.isFeatureEnabled('enableAnalytics')) {
      // Integration with analytics service would go here
      console.log('📊 Recommendation Event:', { userId, locationId, source, fallbackUsed });
    }
  }

  private logOrderEvent(event: string, orderId: string, amount: number, userId?: string): void {
    if (environmentService.isFeatureEnabled('enableAnalytics')) {
      // Integration with analytics service would go here
      console.log('📊 Order Event:', { event, orderId, amount, userId });
    }
  }

  // Fallback and error handling
  private getFallbackLocations(brand: 'saladstop' | 'heybo'): Location[] {
    return [
      {
        id: 'fallback-location',
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

  private handleInitializationError(error: any): void {
    this.status.overall = 'critical';
    
    // In development, be more permissive
    if (environmentService.isDevelopment()) {
      console.warn('⚠️ Some services failed to initialize in development mode');
      this.status.overall = 'degraded';
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  private getDeviceInfo(): any {
    return {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
      language: typeof navigator !== 'undefined' ? navigator.language : 'en'
    };
  }

  // Public interface
  getStatus(): IntegrationStatus {
    return { ...this.status };
  }

  async getHealthReport(): Promise<{
    status: IntegrationStatus;
    details: {
      database: any;
      mlService: any;
      apiService: any;
      environment: any;
    };
  }> {
    const [dbHealth, mlHealth, envHealth] = await Promise.all([
      this.dbService.healthCheck(),
      mlService.healthCheck(),
      Promise.resolve(environmentService.healthCheck())
    ]);

    return {
      status: this.status,
      details: {
        database: dbHealth,
        mlService: mlHealth,
        apiService: { status: this.status.apiService },
        environment: envHealth
      }
    };
  }

  // Cleanup
  destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
}

// Export singleton instance
export const integrationCoordinator = IntegrationCoordinator.getInstance(); 