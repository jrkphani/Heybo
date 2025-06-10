# Frontend Components → Mock API Integration Mapping

## 🎯 Overview

This guide maps your existing frontend components to the appropriate mock API endpoints, showing exactly how to integrate them for frontend development.

## 📱 Main Widget Components

### 1. **ChatbotWidgetV2.tsx**
**Mock APIs to integrate:**
- `apiClient.session.create()` - Initialize user sessions
- `apiClient.session.get(sessionId)` - Restore sessions
- `apiClient.healthCheck()` - Monitor system status

**Integration points:**
```typescript
// Initialize session when widget opens
const { sessionId } = await apiClient.session.create(userId);

// Restore session from localStorage
const sessionData = await apiClient.session.get(storedSessionId);
```

---

## 🔐 Authentication Flow

### 2. **AuthenticationFlow.tsx**
**Mock APIs to integrate:**
- `apiClient.auth.sendOTP(phoneNumber)` - Send verification codes
- `apiClient.auth.verifyOTP(phoneNumber, otp)` - Verify user input
- `apiClient.auth.validateToken(token)` - Check existing sessions

**Integration points:**
```typescript
// Send OTP
const result = await apiClient.auth.sendOTP(phoneNumber);

// Verify OTP  
const { success, token } = await apiClient.auth.verifyOTP(phoneNumber, otp);

// Validate existing token
const user = await apiClient.auth.validateToken(storedToken);
```

---

## 📍 Location Selection

### 3. **LocationSelector.tsx**
**Mock APIs to integrate:**
- `apiClient.locations.getAll()` - Get all available locations
- `apiClient.locations.getNearest(lat, lng)` - GPS-based location finding
- `apiClient.locations.getDetails(locationId)` - Get specific location info

**Integration points:**
```typescript
// Load all locations
const locations = await apiClient.locations.getAll();

// Get nearest locations (after GPS permission)
const nearbyLocations = await apiClient.locations.getNearest(userLat, userLng, 5);

// Get specific location details
const locationDetails = await apiClient.locations.getDetails(selectedLocationId);
```

---

## 🥗 Bowl Building & Ordering

### 4. **CreateYourOwnFlowV2.tsx**
**Mock APIs to integrate:**
- `apiClient.ingredients.getAll(locationId, category)` - Load ingredients by category
- `apiClient.ingredients.checkAvailability(ingredientIds, locationId)` - Real-time availability
- `apiClient.ml.getRecommendations()` - Smart suggestions during building

**Integration points:**
```typescript
// Load ingredients by category
const bases = await apiClient.ingredients.getAll(locationId, 'base');
const proteins = await apiClient.ingredients.getAll(locationId, 'protein');

// Check availability before adding
const availability = await apiClient.ingredients.checkAvailability([ingredientId], locationId);

// Get ML suggestions based on current selections
const suggestions = await apiClient.ml.getRecommendations(userId, dietaryFilters, allergenFilters);
```

### 5. **BowlPreviewV2.tsx**
**Mock APIs to integrate:**
- `apiClient.cart.add(sessionId, bowl)` - Add bowl to cart
- `apiClient.favorites.add(userId, bowl, name)` - Save as favorite

**Integration points:**
```typescript
// Add to cart
const result = await apiClient.cart.add(sessionId, completedBowl);

// Save as favorite
const favorite = await apiClient.favorites.add(userId, bowl, customName);
```

---

## 🛒 Cart Management

### 6. **CartManagerV2.tsx**
**Mock APIs to integrate:**
- `apiClient.cart.get(sessionId)` - Load current cart
- `apiClient.cart.remove(sessionId, itemId)` - Remove items
- `apiClient.cart.clear(sessionId)` - Clear entire cart
- `apiClient.orders.submit(bowl, locationId, sessionId)` - Submit final order

**Integration points:**
```typescript
// Load cart contents
const cartData = await apiClient.cart.get(sessionId);

// Remove specific item
await apiClient.cart.remove(sessionId, itemId);

// Submit order
const orderResult = await apiClient.orders.submit(bowl, locationId, sessionId);
```

---

## ❤️ Favorites Management

### 7. **FavoritesListV2.tsx**
**Mock APIs to integrate:**
- `apiClient.favorites.getAll(userId)` - Load user's favorites
- `apiClient.favorites.remove(favoriteId)` - Remove favorites
- `apiClient.cart.add(sessionId, bowl)` - Add favorite to cart

**Integration points:**
```typescript
// Load user favorites
const favorites = await apiClient.favorites.getAll(userId);

// Remove from favorites
await apiClient.favorites.remove(favoriteId);

// Add favorite to cart
await apiClient.cart.add(sessionId, favorite.bowlComposition);
```

---

## 📜 Order History

### 8. **RecentOrdersList.tsx** / **OrderTrackingV2.tsx**
**Mock APIs to integrate:**
- `apiClient.orders.getRecent(userId, limit)` - Load order history
- `apiClient.orders.getStatus(orderId)` - Track specific orders
- `apiClient.orders.submit(bowl, locationId, sessionId)` - Reorder functionality

**Integration points:**
```typescript
// Load recent orders
const recentOrders = await apiClient.orders.getRecent(userId, 10);

// Check order status
const orderStatus = await apiClient.orders.getStatus(orderId);

// Reorder previous order
await apiClient.orders.submit(previousOrder.bowlComposition, locationId, sessionId);
```

---

## 🤖 ML Recommendations

### 9. **MLRecommendations.tsx** / **ChatMessagesV2.tsx**
**Mock APIs to integrate:**
- `apiClient.ml.getRecommendations(userId, dietaryFilters, allergenFilters)` - Personalized suggestions
- `apiClient.bowls.getPopular()` - Fallback popular bowls
- `apiClient.bowls.getSignature(locationId)` - Signature bowl options

**Integration points:**
```typescript
// Get personalized recommendations
const mlResults = await apiClient.ml.getRecommendations(
  userId, 
  ['vegetarian'], 
  ['nuts']
);

// Fallback to popular bowls
const popularBowls = await apiClient.bowls.getPopular(5);

// Get signature bowls for location
const signatureBowls = await apiClient.bowls.getSignature(locationId);
```

---

## 🏆 Signature Bowls

### 10. **SignatureBowlsList.tsx**
**Mock APIs to integrate:**
- `apiClient.bowls.getSignature(locationId)` - Load signature bowls
- `apiClient.bowls.getDetails(bowlId)` - Get detailed bowl info
- `apiClient.cart.add(sessionId, bowl)` - Add to cart

**Integration points:**
```typescript
// Load signature bowls
const signatureBowls = await apiClient.bowls.getSignature(locationId);

// Get bowl details for customization
const bowlDetails = await apiClient.bowls.getDetails(bowlId);

// Add signature bowl to cart
await apiClient.cart.add(sessionId, selectedBowl);
```

---

## 💬 Chat & FAQ

### 11. **ChatMessagesV2.tsx**
**Mock APIs to integrate:**
- `apiClient.faq.search(query)` - Handle FAQ questions
- All other APIs for embedded UI components

**Integration points:**
```typescript
// Handle FAQ queries
const faqResponse = await apiClient.faq.search(userQuestion);

// Embed bowl preview in chat
const bowlData = await apiClient.bowls.getDetails(bowlId);
```

---

## 🎛️ Environment Configuration

### Set these environment variables in `.env.local`:

```bash
# Enable mock APIs for frontend development
NEXT_PUBLIC_USE_MOCK_API=true

# Optional: Adjust mock behavior
NEXT_PUBLIC_MOCK_API_DELAY=300
NEXT_PUBLIC_MOCK_ERROR_RATE=0.05
```

---

## 🔄 Integration Patterns

### **1. Loading States**
```typescript
const [loading, setLoading] = useState(false);

const loadData = async () => {
  try {
    setLoading(true);
    const data = await apiClient.someEndpoint();
    // Handle success
  } catch (error) {
    // Handle error
  } finally {
    setLoading(false);
  }
};
```

### **2. Error Handling**
```typescript
try {
  const result = await apiClient.someEndpoint();
} catch (error) {
  const userMessage = apiUtils.handleError(error);
  setError(userMessage);
}
```

### **3. Session Validation**
```typescript
const isValidSession = await apiUtils.validateSession(sessionId);
if (!isValidSession) {
  // Redirect to authentication
}
```

### **4. Retry Logic**
```typescript
const data = await apiUtils.retryOperation(
  () => apiClient.unreliableEndpoint(),
  3, // max retries
  1000 // base delay
);
```

---

## 🔧 Testing with Mock APIs

### **1. Start Development Server**
```bash
cd apps/chatbot-widget
npm run dev
```

### **2. Test API Integration**
- Use the browser console to see API calls
- Check Network tab for request/response details
- Test error scenarios by temporarily breaking API calls

### **3. Switching to Real APIs**
When backend is ready:
1. Set `NEXT_PUBLIC_USE_MOCK_API=false`
2. Implement the real API client
3. Replace the mock import in `api-client.ts`

---

## ⚡ Quick Start Steps

1. **Copy** the API integration patterns from `ComponentAPIIntegration.tsx`
2. **Replace** hardcoded IDs with values from your stores/context
3. **Add** proper loading states and error handling
4. **Test** each component with mock data
5. **Validate** the user experience flows
6. **Prepare** for real API switch by keeping the same interface

---

## 🎯 Priority Integration Order

**Phase 1: Core Functionality**
1. `AuthenticationFlow.tsx` → auth APIs
2. `LocationSelector.tsx` → locations API
3. `ChatbotWidgetV2.tsx` → session management

**Phase 2: Bowl Building**
4. `CreateYourOwnFlowV2.tsx` → ingredients API
5. `BowlPreviewV2.tsx` → cart API
6. `CartManagerV2.tsx` → cart + orders API

**Phase 3: User Features**
7. `FavoritesListV2.tsx` → favorites API
8. `RecentOrdersList.tsx` → orders API
9. `MLRecommendations.tsx` → ML API

**Phase 4: Enhancement**
10. `SignatureBowlsList.tsx` → bowls API
11. `ChatMessagesV2.tsx` → FAQ + embedded UI
12. `OrderTrackingV2.tsx` → order status API

This approach ensures you have a working frontend quickly while building features incrementally! 