// HeyBo Environment Configuration Service
export interface EnvironmentConfig {
  // API Endpoints
  apis: {
    saladStop: string;
    heyBo: string;
    auth: string;
    sageMaker: string;
  };
  
  // Database Configuration
  database: {
    vendor: {
      connectionString: string;
      maxConnections: number;
      readOnly: true;
    };
    genAI: {
      connectionString: string;
      maxConnections: number;
      readWrite: true;
    };
  };
  
  // Authentication & Security
  auth: {
    sageMakerApiKey: string;
    cloudFrontApiKey: string;
    jwtSecret: string;
    platformApiKey: string;
    platformWebhookSecret: string;
  };
  
  // Feature Flags
  features: {
    enableMLRecommendations: boolean;
    enableFallbackRecommendations: boolean;
    enableAnalytics: boolean;
    enableErrorTracking: boolean;
    enablePerformanceMonitoring: boolean;
    enableDebugLogging: boolean;
    mockApiResponses: boolean;
    bypassAuthentication: boolean;
  };
  
  // Performance Configuration
  performance: {
    mlTimeoutMs: number;
    apiTimeoutMs: number;
    apiRetryAttempts: number;
    apiRetryBackoffMs: number;
    cacheTTL: {
      locations: number;
      menus: number;
      ingredients: number;
      userProfile: number;
    };
  };
  
  // Monitoring & Analytics
  monitoring: {
    sentryDsn?: string;
    datadogApiKey?: string;
    mixpanelToken?: string;
    googleAnalyticsId?: string;
  };
  
  // Development Settings
  development: {
    devMode: boolean;
    localApiPort: number;
    enableApiMocking: boolean;
    testUserPhone: string;
    testOtpCode: string;
    testLocationId: string;
  };
}

class EnvironmentService {
  private static instance: EnvironmentService;
  private config: EnvironmentConfig;

  static getInstance(): EnvironmentService {
    if (!EnvironmentService.instance) {
      EnvironmentService.instance = new EnvironmentService();
    }
    return EnvironmentService.instance;
  }

  private constructor() {
    this.config = this.loadConfiguration();
    this.validateConfiguration();
  }

  private loadConfiguration(): EnvironmentConfig {
    return {
      apis: {
        saladStop: process.env.NEXT_PUBLIC_SALADSTOP_API_URL || 'https://dtymvut4pk8gt.cloudfront.net/api/v1',
        heyBo: process.env.NEXT_PUBLIC_HEYBO_API_URL || 'https://d2o7qvkenn9k24.cloudfront.net/api/v1',
        auth: process.env.NEXT_PUBLIC_AUTH_API_URL || '',
        sageMaker: process.env.NEXT_PUBLIC_SAGEMAKER_ENDPOINT || ''
      },
      
      database: {
        vendor: {
          connectionString: process.env.VENDOR_DB_CONNECTION_STRING || '',
          maxConnections: parseInt(process.env.VENDOR_DB_MAX_CONNECTIONS || '10'),
          readOnly: true
        },
        genAI: {
          connectionString: process.env.GENAI_DB_CONNECTION_STRING || '',
          maxConnections: parseInt(process.env.GENAI_DB_MAX_CONNECTIONS || '20'),
          readWrite: true
        }
      },
      
      auth: {
        sageMakerApiKey: process.env.SAGEMAKER_API_KEY || '',
        cloudFrontApiKey: process.env.CLOUDFRONT_API_KEY || '',
        jwtSecret: process.env.JWT_SECRET || '',
        platformApiKey: process.env.PLATFORM_API_KEY || '',
        platformWebhookSecret: process.env.PLATFORM_WEBHOOK_SECRET || ''
      },
      
      features: {
        enableMLRecommendations: process.env.ENABLE_ML_RECOMMENDATIONS === 'true',
        enableFallbackRecommendations: process.env.ENABLE_FALLBACK_RECOMMENDATIONS !== 'false', // Default true
        enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
        enableErrorTracking: process.env.ENABLE_ERROR_TRACKING === 'true',
        enablePerformanceMonitoring: process.env.ENABLE_PERFORMANCE_MONITORING === 'true',
        enableDebugLogging: process.env.ENABLE_DEBUG_LOGGING === 'true',
        mockApiResponses: process.env.MOCK_API_RESPONSES === 'true',
        bypassAuthentication: process.env.BYPASS_AUTHENTICATION === 'true'
      },
      
      performance: {
        mlTimeoutMs: parseInt(process.env.ML_TIMEOUT_MS || '3000'),
        apiTimeoutMs: parseInt(process.env.API_TIMEOUT_MS || '10000'),
        apiRetryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS || '3'),
        apiRetryBackoffMs: parseInt(process.env.API_RETRY_BACKOFF_MS || '1000'),
        cacheTTL: {
          locations: parseInt(process.env.CACHE_TTL_LOCATIONS || '900000'), // 15 minutes
          menus: parseInt(process.env.CACHE_TTL_MENUS || '900000'), // 15 minutes
          ingredients: parseInt(process.env.CACHE_TTL_INGREDIENTS || '300000'), // 5 minutes
          userProfile: parseInt(process.env.CACHE_TTL_USER_PROFILE || '1800000') // 30 minutes
        }
      },
      
      monitoring: {
        sentryDsn: process.env.SENTRY_DSN,
        datadogApiKey: process.env.DATADOG_API_KEY,
        mixpanelToken: process.env.MIXPANEL_TOKEN,
        googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID
      },
      
      development: {
        devMode: process.env.NEXT_PUBLIC_DEV_MODE === 'true',
        localApiPort: parseInt(process.env.LOCAL_API_PORT || '3000'),
        enableApiMocking: process.env.ENABLE_API_MOCKING === 'true',
        testUserPhone: process.env.TEST_USER_PHONE || '+6591234567',
        testOtpCode: process.env.TEST_OTP_CODE || '123456',
        testLocationId: process.env.TEST_LOCATION_ID || 'test_location_001'
      }
    };
  }

  private validateConfiguration(): void {
    const errors: string[] = [];

    // Validate critical API endpoints
    if (!this.config.apis.saladStop) {
      errors.push('NEXT_PUBLIC_SALADSTOP_API_URL is required');
    }
    
    if (!this.config.apis.heyBo) {
      errors.push('NEXT_PUBLIC_HEYBO_API_URL is required');
    }

    // Validate performance settings
    if (this.config.performance.mlTimeoutMs < 1000 || this.config.performance.mlTimeoutMs > 10000) {
      errors.push('ML_TIMEOUT_MS must be between 1000 and 10000 milliseconds');
    }

    if (this.config.performance.apiRetryAttempts < 1 || this.config.performance.apiRetryAttempts > 5) {
      errors.push('API_RETRY_ATTEMPTS must be between 1 and 5');
    }

    // Validate cache TTL settings
    Object.entries(this.config.performance.cacheTTL).forEach(([key, value]) => {
      if (value < 60000) { // Minimum 1 minute
        errors.push(`Cache TTL for ${key} must be at least 60000ms (1 minute)`);
      }
    });

    // In production, require certain configurations
    if (process.env.NODE_ENV === 'production') {
      if (!this.config.auth.jwtSecret) {
        errors.push('JWT_SECRET is required in production');
      }
      
      if (this.config.features.bypassAuthentication) {
        errors.push('BYPASS_AUTHENTICATION must be false in production');
      }
      
      if (this.config.features.mockApiResponses) {
        errors.push('MOCK_API_RESPONSES must be false in production');
      }
    }

    if (errors.length > 0) {
      console.error('Environment configuration errors:', errors);
      throw new Error(`Environment configuration validation failed: ${errors.join(', ')}`);
    }
  }

  // Getters for configuration sections
  getConfig(): EnvironmentConfig {
    return { ...this.config }; // Return a copy to prevent mutation
  }

  getApiConfig() {
    return this.config.apis;
  }

  getDatabaseConfig() {
    return this.config.database;
  }

  getAuthConfig() {
    return this.config.auth;
  }

  getFeatureFlags() {
    return this.config.features;
  }

  getPerformanceConfig() {
    return this.config.performance;
  }

  getMonitoringConfig() {
    return this.config.monitoring;
  }

  getDevelopmentConfig() {
    return this.config.development;
  }

  // Utility methods
  isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development' || this.config.development.devMode;
  }

  isFeatureEnabled(feature: keyof EnvironmentConfig['features']): boolean {
    return this.config.features[feature];
  }

  // Dynamic configuration updates (for development)
  updateFeatureFlag(feature: keyof EnvironmentConfig['features'], enabled: boolean): void {
    if (this.isDevelopment()) {
      this.config.features[feature] = enabled;
      console.log(`Feature flag ${feature} updated to: ${enabled}`);
    } else {
      console.warn('Feature flags cannot be updated in production');
    }
  }

  // Configuration debugging
  debugConfiguration(): void {
    if (this.config.features.enableDebugLogging) {
      console.group('🔧 HeyBo Environment Configuration');
      console.log('Environment:', process.env.NODE_ENV);
      console.log('Development Mode:', this.isDevelopment());
      console.log('Feature Flags:', this.config.features);
      console.log('Performance Settings:', this.config.performance);
      console.log('API Endpoints:', {
        saladStop: this.config.apis.saladStop,
        heyBo: this.config.apis.heyBo,
        auth: this.config.apis.auth ? '[CONFIGURED]' : '[NOT SET]',
        sageMaker: this.config.apis.sageMaker ? '[CONFIGURED]' : '[NOT SET]'
      });
      console.groupEnd();
    }
  }

  // Health check for configuration
  healthCheck(): { status: 'healthy' | 'degraded' | 'error'; issues: string[] } {
    const issues: string[] = [];
    
    // Check if critical services are configured
    if (!this.config.apis.auth && !this.config.features.bypassAuthentication) {
      issues.push('Authentication API not configured');
    }
    
    if (!this.config.apis.sageMaker && this.config.features.enableMLRecommendations) {
      issues.push('SageMaker endpoint not configured but ML recommendations enabled');
    }
    
    // Check if monitoring is properly configured for production
    if (this.isProduction()) {
      if (!this.config.monitoring.sentryDsn && this.config.features.enableErrorTracking) {
        issues.push('Error tracking enabled but Sentry not configured');
      }
    }

    const status = issues.length === 0 ? 'healthy' : 
                   issues.length <= 2 ? 'degraded' : 'error';

    return { status, issues };
  }
}

// Export singleton instance
export const environmentService = EnvironmentService.getInstance();

// Export configuration for direct access
export const ENV = environmentService.getConfig(); 