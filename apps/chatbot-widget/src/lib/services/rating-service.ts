// HeyBo Rating Service
import type { 
  User, 
  RatingData, 
  BowlRating, 
  UnratedOrder, 
  BowlComposition 
} from '../../types';
import { errorHandler } from './error-handler';

export interface RatingConfig {
  enableOverallRating: boolean;
  enableBowlRating: boolean;
  enableComments: boolean;
  maxCommentLength: number;
  autoShowAfterOrder: boolean;
  skipAllowed: boolean;
}

export class RatingService {
  private static instance: RatingService;
  private config: RatingConfig;

  constructor(config: RatingConfig = {
    enableOverallRating: true,
    enableBowlRating: true,
    enableComments: true,
    maxCommentLength: 500,
    autoShowAfterOrder: true,
    skipAllowed: true
  }) {
    this.config = config;
  }

  static getInstance(config?: RatingConfig): RatingService {
    if (!RatingService.instance) {
      RatingService.instance = new RatingService(config);
    }
    return RatingService.instance;
  }

  /**
   * Check if user has unrated orders
   */
  async checkUnratedOrders(user: User): Promise<UnratedOrder[]> {
    try {
      // In production, this would call the actual API
      // const response = await fetch(`/api/orders/unrated?userId=${user.id}`);
      
      // Mock implementation
      const mockUnratedOrders: UnratedOrder[] = [];

      // For testing: Always provide an unrated order
      if (true) {
        const mockOrder: UnratedOrder = {
          orderId: `order_${Date.now()}`,
          orderDate: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000)), // 2 days ago
          bowls: [
            {
              id: 'bowl-1',
              name: 'Signature Lemongrass Bowl',
              description: 'A delicious signature bowl with lemongrass chicken and brown rice',
              base: {
                id: 'base-1',
                name: 'Brown Rice',
                category: 'base',
                subcategory: 'grains',
                isAvailable: true,
                isVegan: true,
                isGlutenFree: true,
                allergens: [],
                nutritionalInfo: {
                  calories: 150,
                  protein: 3,
                  carbs: 31,
                  fat: 1,
                  fiber: 2,
                  sodium: 5
                },
                weight: 120,
                price: 0,
                description: 'Nutty, wholesome brown rice',
                imageUrl: '/ingredients/brown-rice.jpg'
              },
              protein: {
                id: 'protein-1',
                name: 'Roasted Lemongrass Chicken',
                category: 'protein',
                subcategory: 'poultry',
                isAvailable: true,
                isVegan: false,
                isGlutenFree: true,
                allergens: [],
                nutritionalInfo: {
                  calories: 180,
                  protein: 25,
                  carbs: 2,
                  fat: 8,
                  fiber: 0,
                  sodium: 320
                },
                weight: 80,
                price: 0,
                description: 'Tender chicken marinated in aromatic lemongrass',
                imageUrl: '/ingredients/lemongrass-chicken.jpg'
              },
              sides: [],
              extraSides: [],
              extraProtein: [],
              totalWeight: 200,
              totalPrice: 1500,
              isSignature: true,
              imageUrl: '/bowls/signature-lemongrass.jpg',
              tags: ['signature', 'popular'],
              prepTime: '6 mins',
              calories: 330
            }
          ],
          totalAmount: 1500,
          location: 'Marina Bay Sands'
        };
        
        mockUnratedOrders.push(mockOrder);
      }

      return mockUnratedOrders;
    } catch (error) {
      errorHandler.createError(
        'api',
        'unrated_orders_fetch_failed',
        'Failed to fetch unrated orders',
        'Unable to check for previous orders to rate.',
        error,
        'low'
      );
      return [];
    }
  }

  /**
   * Submit rating for an order
   */
  async submitRating(rating: RatingData): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate rating data
      const validation = this.validateRating(rating);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // In production, this would call the actual API
      // const response = await fetch('/api/ratings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(rating)
      // });

      // Mock API call with 5% failure rate
      await this.simulateAPICall();
      
      if (Math.random() < 0.05) {
        throw new Error('Rating submission failed');
      }

      // Store rating locally for analytics
      this.storeRatingLocally(rating);

      return { success: true };
    } catch (error) {
      errorHandler.createError(
        'api',
        'rating_submission_failed',
        'Failed to submit rating',
        'Unable to save your rating. It will be retried automatically.',
        error,
        'medium'
      );

      // Queue for retry
      this.queueRatingForRetry(rating);

      return {
        success: false,
        error: 'Rating submission failed. Will retry automatically.'
      };
    }
  }

  /**
   * Skip rating for an order
   */
  async skipRating(orderId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // In production, this would mark the order as rating-skipped
      // const response = await fetch(`/api/orders/${orderId}/skip-rating`, {
      //   method: 'POST'
      // });

      // Mock implementation
      await this.simulateAPICall();

      // Store skip action locally
      const skipData = {
        orderId,
        skippedAt: new Date().toISOString(),
        action: 'skipped'
      };
      
      const existingSkips = JSON.parse(localStorage.getItem('heybo_skipped_ratings') || '[]');
      existingSkips.push(skipData);
      localStorage.setItem('heybo_skipped_ratings', JSON.stringify(existingSkips));

      return { success: true };
    } catch (error) {
      errorHandler.createError(
        'api',
        'rating_skip_failed',
        'Failed to skip rating',
        'Unable to skip rating. Please try again.',
        error,
        'low'
      );

      return {
        success: false,
        error: 'Failed to skip rating'
      };
    }
  }

  /**
   * Get rating statistics for analytics
   */
  getRatingStats(): {
    totalRatings: number;
    averageOverallRating: number;
    bowlRatingStats: { thumbsUp: number; thumbsDown: number };
    skippedRatings: number;
  } {
    try {
      const ratings = JSON.parse(localStorage.getItem('heybo_ratings') || '[]') as RatingData[];
      const skipped = JSON.parse(localStorage.getItem('heybo_skipped_ratings') || '[]');

      const overallRatings = ratings
        .filter(r => r.overallRating !== undefined)
        .map(r => r.overallRating!);

      const bowlRatings = ratings
        .flatMap(r => r.bowlRatings || [])
        .filter(br => br.rating);

      return {
        totalRatings: ratings.length,
        averageOverallRating: overallRatings.length > 0 
          ? overallRatings.reduce((sum, rating) => sum + rating, 0) / overallRatings.length 
          : 0,
        bowlRatingStats: {
          thumbsUp: bowlRatings.filter(br => br.rating === 'thumbs_up').length,
          thumbsDown: bowlRatings.filter(br => br.rating === 'thumbs_down').length
        },
        skippedRatings: skipped.length
      };
    } catch (error) {
      return {
        totalRatings: 0,
        averageOverallRating: 0,
        bowlRatingStats: { thumbsUp: 0, thumbsDown: 0 },
        skippedRatings: 0
      };
    }
  }

  /**
   * Validate rating data
   */
  private validateRating(rating: RatingData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if rating is completely empty
    if (!rating.overallRating && (!rating.bowlRatings || rating.bowlRatings.length === 0)) {
      errors.push('Please provide at least an overall rating or bowl ratings');
    }

    // Validate overall rating range
    if (rating.overallRating !== undefined) {
      if (rating.overallRating < 1 || rating.overallRating > 5) {
        errors.push('Overall rating must be between 1 and 5 stars');
      }
    }

    // Validate comment length
    if (rating.overallComment && rating.overallComment.length > this.config.maxCommentLength) {
      errors.push(`Comment must be less than ${this.config.maxCommentLength} characters`);
    }

    // Validate bowl ratings
    if (rating.bowlRatings) {
      rating.bowlRatings.forEach((bowlRating, index) => {
        if (!bowlRating.rating) {
          errors.push(`Bowl ${index + 1} rating is required`);
        }
        if (bowlRating.comment && bowlRating.comment.length > this.config.maxCommentLength) {
          errors.push(`Bowl ${index + 1} comment is too long`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Store rating locally for analytics and retry
   */
  private storeRatingLocally(rating: RatingData): void {
    try {
      const existingRatings = JSON.parse(localStorage.getItem('heybo_ratings') || '[]');
      existingRatings.push(rating);
      localStorage.setItem('heybo_ratings', JSON.stringify(existingRatings));
    } catch (error) {
      console.warn('Failed to store rating locally:', error);
    }
  }

  /**
   * Queue rating for retry on failure
   */
  private queueRatingForRetry(rating: RatingData): void {
    try {
      const retryQueue = JSON.parse(localStorage.getItem('heybo_rating_retry_queue') || '[]');
      retryQueue.push({
        rating,
        queuedAt: new Date().toISOString(),
        retryCount: 0
      });
      localStorage.setItem('heybo_rating_retry_queue', JSON.stringify(retryQueue));
    } catch (error) {
      console.warn('Failed to queue rating for retry:', error);
    }
  }

  /**
   * Process retry queue
   */
  async processRetryQueue(): Promise<void> {
    try {
      const retryQueue = JSON.parse(localStorage.getItem('heybo_rating_retry_queue') || '[]');
      const successfulRetries: number[] = [];

      for (let i = 0; i < retryQueue.length; i++) {
        const item = retryQueue[i];
        
        // Skip if too many retries
        if (item.retryCount >= 3) {
          successfulRetries.push(i);
          continue;
        }

        try {
          const result = await this.submitRating(item.rating);
          if (result.success) {
            successfulRetries.push(i);
          } else {
            item.retryCount++;
          }
        } catch (error) {
          item.retryCount++;
        }
      }

      // Remove successful retries from queue
      const updatedQueue = retryQueue.filter((_: any, index: number) => !successfulRetries.includes(index));
      localStorage.setItem('heybo_rating_retry_queue', JSON.stringify(updatedQueue));
    } catch (error) {
      console.warn('Failed to process rating retry queue:', error);
    }
  }

  /**
   * Simulate API call delay
   */
  private async simulateAPICall(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  }

  /**
   * Create a rating template for an order
   */
  createRatingTemplate(order: UnratedOrder): Partial<RatingData> {
    return {
      orderId: order.orderId,
      timestamp: new Date(),
      skipped: false,
      bowlRatings: order.bowls.map(bowl => ({
        bowlId: bowl.id,
        bowlName: bowl.name,
        rating: undefined as any // Will be set by user
      }))
    };
  }

  /**
   * Check if rating should be shown automatically
   */
  shouldShowRating(user: User): boolean {
    if (!this.config.autoShowAfterOrder) return false;
    
    // Check if user has recently completed an order (mock logic)
    const lastOrderTime = localStorage.getItem('heybo_last_order_time');
    if (!lastOrderTime) return false;
    
    const timeSinceOrder = Date.now() - parseInt(lastOrderTime);
    const oneHour = 60 * 60 * 1000;
    
    return timeSinceOrder < oneHour;
  }
}

export const ratingService = RatingService.getInstance();
