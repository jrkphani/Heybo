// Component API Integration Examples
// This file demonstrates how to integrate frontend components with mock APIs
'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, apiUtils } from '@/lib/api-client';
import type { 
  Location, 
  HeyBoIngredient, 
  BowlComposition, 
  RecentOrder, 
  FavoriteItem,
  MLRecommendation
} from '@/types';

// Example 1: Location Selection Integration
export function LocationSelectorExample() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const locationData = await apiClient.locations.getAll();
      setLocations(locationData);
    } catch (error) {
      console.error('Failed to load locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (location: Location) => {
    setSelectedLocation(location);
    console.log('Selected location:', location.name);
  };

  useEffect(() => {
    loadLocations();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Location Selection API Integration</h3>
      
      {loading && <p>Loading locations...</p>}
      
      <div className="grid gap-2">
        {locations.map(location => (
          <button
            key={location.id}
            onClick={() => handleLocationSelect(location)}
            className={`p-3 border rounded text-left ${
              selectedLocation?.id === location.id 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">{location.name}</div>
            <div className="text-sm text-gray-600">{location.address}</div>
            <div className="text-xs text-gray-500">
              Today: {location.operatingHours.monday.open} - {location.operatingHours.monday.close}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-blue-50 p-3 rounded">
        <h4 className="font-medium text-blue-900">API Usage:</h4>
        <code className="text-sm text-blue-800">
          await apiClient.locations.getAll()
        </code>
      </div>
    </div>
  );
}

// Example 2: Ingredients API Integration
export function IngredientsExample() {
  const [ingredients, setIngredients] = useState<HeyBoIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('base');

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const ingredientData = await apiClient.ingredients.getAll('location-1');
      setIngredients(ingredientData.filter(ing => ing.category === selectedCategory));
    } catch (error) {
      console.error('Failed to load ingredients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, [selectedCategory]);

  const categories = ['base', 'protein', 'sides', 'sauce', 'garnish'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Ingredients API Integration</h3>
      
      {/* Category Selector */}
      <div className="flex space-x-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded text-sm ${
              selectedCategory === category
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p>Loading ingredients...</p>}

      <div className="grid grid-cols-2 gap-2">
        {ingredients.map(ingredient => (
          <div
            key={ingredient.id}
            className={`p-3 border rounded ${
              ingredient.isAvailable 
                ? 'border-gray-200' 
                : 'border-gray-100 bg-gray-50 opacity-50'
            }`}
          >
            <div className="font-medium">{ingredient.name}</div>
            <div className="text-sm text-gray-600">
              {apiUtils.formatPrice(ingredient.price)}
            </div>
            <div className="text-xs text-gray-500">
              {ingredient.isAvailable ? 'Available' : 'Out of stock'}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-3 rounded">
        <h4 className="font-medium text-blue-900">API Usage:</h4>
        <code className="text-sm text-blue-800">
          await apiClient.ingredients.getAll(locationId, category)
        </code>
      </div>
    </div>
  );
}

// Example 3: Favorites API Integration
export function FavoritesExample() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoritesData = await apiClient.favorites.getAll('user-123');
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      await apiClient.favorites.remove(favoriteId);
      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
      console.log('Removed favorite:', favoriteId);
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Favorites API Integration</h3>
      
      {loading && <p>Loading favorites...</p>}
      
      <div className="space-y-3">
        {favorites.map(favorite => (
          <div key={favorite.id} className="border rounded p-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium">{favorite.name}</h4>
                <p className="text-sm text-gray-600">{favorite.description}</p>
                <div className="text-sm text-green-600 mt-1">
                  {apiUtils.formatPrice(favorite.price)}
                </div>
              </div>
              
              <button
                onClick={() => handleRemoveFavorite(favorite.id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {favorites.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No favorites yet. Add some bowls to get started!</p>
        </div>
      )}

      <div className="bg-blue-50 p-3 rounded">
        <h4 className="font-medium text-blue-900">API Usage:</h4>
        <code className="text-sm text-blue-800">
          await apiClient.favorites.getAll(userId)<br />
          await apiClient.favorites.remove(userId, favoriteId)
        </code>
      </div>
    </div>
  );
}

// Example 4: Order History API Integration
export function OrderHistoryExample() {
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
             const ordersData = await apiClient.orders.getRecent('user-123', 10);
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const reorderItem = async (order: RecentOrder) => {
    try {
      // Reorder by submitting the same bowl composition again
      const result = await apiClient.orders.submit(order.bowlComposition, order.locationId, 'session-123');
      console.log('Reordered successfully:', result);
    } catch (error) {
      console.error('Failed to reorder:', error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Order History API Integration</h3>
      
      {loading && <p>Loading order history...</p>}
      
      <div className="space-y-3">
        {orders.map(order => (
          <div key={order.id} className="border rounded p-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium">{order.bowlComposition.name}</h4>
                <p className="text-sm text-gray-600">
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <div className="text-sm text-green-600 mt-1">
                  {apiUtils.formatPrice(order.totalAmount)}
                </div>
                {order.rating && (
                  <div className="text-sm text-yellow-600">
                    ⭐ {order.rating}/5
                  </div>
                )}
              </div>
              
              <button
                onClick={() => reorderItem(order)}
                className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
              >
                Reorder
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {orders.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No previous orders found.</p>
        </div>
      )}

      <div className="bg-blue-50 p-3 rounded">
        <h4 className="font-medium text-blue-900">API Usage:</h4>
        <code className="text-sm text-blue-800">
          await apiClient.orders.getRecent(userId, limit)<br />
          await apiClient.orders.submit(bowl, locationId, sessionId)
        </code>
      </div>
    </div>
  );
}

// Example 5: Session & Cart API Integration
export function SessionCartExample() {
  const [sessionId, setSessionId] = useState<string>('');
  const [cartCount, setCartCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const createSession = async () => {
    try {
      setLoading(true);
      const { sessionId: newSessionId } = await apiClient.session.create();
      setSessionId(newSessionId);
      console.log('Session created:', newSessionId);
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    if (!sessionId) return;
    
    try {
      const cartData = await apiClient.cart.get(sessionId);
      setCartCount(cartData.items.length);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  useEffect(() => {
    if (sessionId) {
      loadCart();
    }
  }, [sessionId]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Session & Cart API Integration</h3>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={createSession}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Session'}
        </button>
        
        {sessionId && (
          <div className="text-sm text-gray-600">
            Session: {sessionId.slice(0, 8)}... | Cart: {cartCount} items
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-3 rounded">
        <h4 className="font-medium text-blue-900">API Usage:</h4>
        <code className="text-sm text-blue-800">
          await apiClient.session.create()<br />
          await apiClient.cart.get(sessionId)<br />
          await apiClient.cart.add(sessionId, bowl, quantity)
        </code>
      </div>
    </div>
  );
}

// Master Example Component
export default function ComponentAPIIntegration() {
  const [activeExample, setActiveExample] = useState('locations');

  const examples = [
    { id: 'locations', label: 'Locations API', component: <LocationSelectorExample /> },
    { id: 'ingredients', label: 'Ingredients API', component: <IngredientsExample /> },
    { id: 'favorites', label: 'Favorites API', component: <FavoritesExample /> },
    { id: 'orders', label: 'Order History API', component: <OrderHistoryExample /> },
    { id: 'session', label: 'Session & Cart API', component: <SessionCartExample /> }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Component API Integration Examples</h1>
      <p className="text-gray-600 mb-6">
        These examples show how to integrate your frontend components with the mock APIs.
      </p>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {examples.map(example => (
            <button
              key={example.id}
              onClick={() => setActiveExample(example.id)}
              className={`px-3 py-2 rounded text-sm ${
                activeExample === example.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-white">
        {examples.find(ex => ex.id === activeExample)?.component}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold text-yellow-900 mb-2">💡 Integration Tips:</h3>
        <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
          <li>Replace hardcoded user/session IDs with values from your store</li>
          <li>Add proper error handling and user feedback</li>
          <li>Use loading states for better UX</li>
          <li>Test with mock APIs first, then switch to real endpoints</li>
          <li>Implement retry logic for network failures</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-2">🔗 Main Components to Integrate:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-800">
          <div>• <code>CreateYourOwnFlowV2</code> → ingredients</div>
          <div>• <code>FavoritesListV2</code> → favorites</div>
          <div>• <code>SignatureBowlsList</code> → bowls</div>
          <div>• <code>CartManagerV2</code> → cart</div>
          <div>• <code>RecentOrdersList</code> → orders</div>
          <div>• <code>LocationSelector</code> → locations</div>
          <div>• <code>MLRecommendations</code> → ml</div>
          <div>• <code>AuthenticationFlow</code> → auth</div>
        </div>
      </div>
    </div>
  );
} 