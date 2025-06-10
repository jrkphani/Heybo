# Mock API Setup Guide

This guide will help you get started with the mock APIs for frontend development.

## Quick Start

1. **Environment Setup**
   Create a `.env.local` file in the chatbot-widget directory:
   ```bash
   # Enable mock APIs
   NEXT_PUBLIC_USE_MOCK_API=true
   
   # Optional: Adjust mock behavior
   NEXT_PUBLIC_MOCK_API_DELAY=300
   NEXT_PUBLIC_MOCK_ERROR_RATE=0.05
   ```

2. **Import and Use the API Client**
   ```tsx
   import { apiClient, apiUtils } from '@/lib/api-client';
   
   // Example: Get locations
   const locations = await apiClient.locations.getAll();
   
   // Example: Submit an order
   const result = await apiClient.orders.submit(bowl, locationId, sessionId);
   
   // Example: Handle errors
   try {
     const recommendations = await apiClient.ml.getRecommendations(userId);
   } catch (error) {
     const message = apiUtils.handleError(error);
     console.error('Failed to get recommendations:', message);
   }
   ```

3. **React Hook Example**
   ```tsx
   import { useState, useEffect } from 'react';
   import { apiClient } from '@/lib/api-client';
   
   function useLocations() {
     const [locations, setLocations] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
   
     useEffect(() => {
       const fetchLocations = async () => {
         try {
           setLoading(true);
           const data = await apiClient.locations.getAll();
           setLocations(data);
           setError(null);
         } catch (err) {
           setError(apiUtils.handleError(err));
         } finally {
           setLoading(false);
         }
       };
   
       fetchLocations();
     }, []);
   
     return { locations, loading, error };
   }
   ```

## Available APIs

### Session Management
- `apiClient.session.create(userId?)` - Create new session
- `apiClient.session.get(sessionId)` - Get session data
- `apiClient.session.update(sessionId, updates)` - Update session
- `apiClient.session.clear(sessionId)` - Clear session

### Authentication
- `apiClient.auth.validateToken(token)` - Validate user token
- `apiClient.auth.sendOTP(phoneNumber)` - Send OTP
- `apiClient.auth.verifyOTP(phoneNumber, otp)` - Verify OTP

### Locations
- `apiClient.locations.getAll(type?)` - Get all locations
- `apiClient.locations.getNearest(lat, lng, limit?)` - Get nearest locations
- `apiClient.locations.getDetails(locationId)` - Get location details

### Ingredients
- `apiClient.ingredients.getAll(locationId, category?)` - Get ingredients
- `apiClient.ingredients.checkAvailability(ids, locationId)` - Check availability

### Bowls
- `apiClient.bowls.getSignature(locationId)` - Get signature bowls
- `apiClient.bowls.getPopular(limit?)` - Get popular bowls
- `apiClient.bowls.getDetails(bowlId)` - Get bowl details

### Orders
- `apiClient.orders.getRecent(userId, limit?)` - Get recent orders
- `apiClient.orders.submit(bowl, locationId, sessionId)` - Submit order
- `apiClient.orders.getStatus(orderId)` - Get order status

### Favorites
- `apiClient.favorites.getAll(userId)` - Get user favorites
- `apiClient.favorites.add(userId, bowl, name)` - Add to favorites
- `apiClient.favorites.remove(favoriteId)` - Remove from favorites

### ML Recommendations
- `apiClient.ml.getRecommendations(userId?, dietaryFilters?, allergenFilters?)` - Get recommendations

### Cart Management
- `apiClient.cart.get(sessionId)` - Get cart contents
- `apiClient.cart.add(sessionId, item)` - Add to cart
- `apiClient.cart.remove(sessionId, itemId)` - Remove from cart
- `apiClient.cart.clear(sessionId)` - Clear cart

### FAQ
- `apiClient.faq.search(query)` - Search FAQ

### Health Check
- `apiClient.healthCheck()` - Check service health

## Mock Data Features

- **Realistic Delays**: API calls have random delays (200-800ms) to simulate network latency
- **Error Simulation**: 5% chance of errors to test error handling
- **Session Management**: In-memory session storage
- **Cart Persistence**: Cart data persists during session
- **ML Fallbacks**: Simulates ML service failures with fallback responses
- **Ingredient Availability**: 90% of ingredients are marked as available
- **Order Tracking**: Realistic order status progression

## Testing Scenarios

### Test Authentication Flow
```tsx
// Test OTP flow
const otpResult = await apiClient.auth.sendOTP('+6512345678');
const verifyResult = await apiClient.auth.verifyOTP('+6512345678', '123456');
// Use token from verifyResult.token
```

### Test Order Flow
```tsx
// Create session
const { sessionId } = await apiClient.session.create();

// Add items to cart
await apiClient.cart.add(sessionId, bowlComposition);

// Submit order
const orderResult = await apiClient.orders.submit(bowl, locationId, sessionId);

// Track order
if (orderResult.orderId) {
  const status = await apiClient.orders.getStatus(orderResult.orderId);
}
```

### Test ML Recommendations
```tsx
// Get basic recommendations
const recs = await apiClient.ml.getRecommendations();

// Get filtered recommendations
const veganRecs = await apiClient.ml.getRecommendations(
  userId, 
  ['vegan'], 
  ['nuts']
);
```

## Switching to Real APIs

When the backend is ready:

1. Set `NEXT_PUBLIC_USE_MOCK_API=false` in your environment
2. Implement the real API service following the `APIClient` interface
3. Update the import in `api-client.ts`:
   ```tsx
   import { realAPI } from './real-api';
   ```
4. No changes needed in your components!

## Utility Functions

The `apiUtils` object provides helpful utilities:

- `apiUtils.handleError(error)` - Consistent error message handling
- `apiUtils.formatPrice(cents)` - Format prices as $X.XX
- `apiUtils.formatDate(date)` - Format dates consistently
- `apiUtils.formatTime(date)` - Format times consistently
- `apiUtils.formatDistance(km)` - Format distances (km/m)
- `apiUtils.validateSession(sessionId)` - Validate session before API calls
- `apiUtils.retryOperation(fn, retries?, delay?)` - Retry failed operations

## Tips for Development

1. **Use React DevTools**: The mock APIs log responses to console
2. **Test Error States**: Set `NEXT_PUBLIC_MOCK_ERROR_RATE=0.5` to trigger more errors
3. **Speed Up Development**: Set `NEXT_PUBLIC_MOCK_API_DELAY=0` for instant responses
4. **Persist Data**: Mock data resets on page refresh - this is intentional for testing
5. **Session Management**: Always create a session before making user-specific API calls 