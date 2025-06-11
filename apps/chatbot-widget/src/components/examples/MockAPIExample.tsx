// Example component demonstrating mock API usage
'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, apiUtils } from '@/lib/api-client';
import type { Location, HeyBoIngredient, BowlComposition, OperatingHours } from '@/types';

// Helper function to get today's operating hours
function getTodayHours(operatingHours: OperatingHours): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const today = days[new Date().getDay()] as keyof OperatingHours;
  const todayHours = operatingHours[today];
  return `${todayHours.open} - ${todayHours.close}`;
}

export default function MockAPIExample() {
  const [activeTab, setActiveTab] = useState('locations');
  const [sessionId, setSessionId] = useState<string>('');

  // Initialize session on component mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const { sessionId: newSessionId } = await apiClient.session.create();
        setSessionId(newSessionId);
        console.log('Session created:', newSessionId);
      } catch (error) {
        console.error('Failed to create session:', error);
      }
    };

    initSession();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mock API Examples</h1>
      
      {/* Tab Navigation */}
      <div className="flex mb-6 border-b">
        {[
          { id: 'locations', label: 'Locations' },
          { id: 'ingredients', label: 'Ingredients' },
          { id: 'bowls', label: 'Signature Bowls' },
          { id: 'ml', label: 'ML Recommendations' },
          { id: 'cart', label: 'Cart Management' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'locations' && <LocationsExample />}
        {activeTab === 'ingredients' && <IngredientsExample />}
        {activeTab === 'bowls' && <BowlsExample />}
        {activeTab === 'ml' && <MLExample />}
        {activeTab === 'cart' && <CartExample sessionId={sessionId} />}
      </div>
    </div>
  );
}

// Locations Example
function LocationsExample() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchLocations = async (type?: 'Station' | 'Outlet') => {
    try {
      setLoading(true);
      setError('');
      const data = await apiClient.locations.getAll(type);
      setLocations(data);
    } catch (err) {
      setError(apiUtils.handleError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Locations API</h2>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => fetchLocations()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          All Locations
        </button>
        <button
          onClick={() => fetchLocations('Station')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Stations Only
        </button>
        <button
          onClick={() => fetchLocations('Outlet')}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Outlets Only
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading locations...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      
      <div className="grid gap-4 md:grid-cols-2">
        {locations.map(location => (
          <div key={location.id} className="border rounded p-4">
            <h3 className="font-semibold">{location.name}</h3>
            <p className="text-sm text-gray-600">{location.type}</p>
            <p className="text-sm">{location.address}</p>
            <p className="text-sm text-green-600">
              {getTodayHours(location.operatingHours) || 'Hours not available'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Ingredients Example
function IngredientsExample() {
  const [ingredients, setIngredients] = useState<HeyBoIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const fetchIngredients = async (category?: string) => {
    try {
      setLoading(true);
      const data = await apiClient.ingredients.getAll(
        'location-1', 
        category as any
      );
      setIngredients(data);
    } catch (err) {
      console.error('Failed to fetch ingredients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const categories = ['base', 'protein', 'sides', 'sauce', 'garnish'];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Ingredients API</h2>
      
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            fetchIngredients(e.target.value || undefined);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-600">Loading ingredients...</p>}
      
      <div className="grid gap-2 md:grid-cols-3">
        {ingredients.map(ingredient => (
          <div key={ingredient.id} className="border rounded p-3">
            <h4 className="font-medium">{ingredient.name}</h4>
            <p className="text-sm text-gray-600">{ingredient.category}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${
                ingredient.isAvailable ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              <span className="text-xs">
                {ingredient.isAvailable ? 'Available' : 'Out of stock'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Bowls Example
function BowlsExample() {
  const [bowls, setBowls] = useState<BowlComposition[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBowls = async (type: 'signature' | 'popular') => {
    try {
      setLoading(true);
      const data = type === 'signature' 
        ? await apiClient.bowls.getSignature('location-1')
        : await apiClient.bowls.getPopular(5);
      setBowls(data);
    } catch (err) {
      console.error('Failed to fetch bowls:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBowls('signature');
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Signature Bowls API</h2>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => fetchBowls('signature')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Signature Bowls
        </button>
        <button
          onClick={() => fetchBowls('popular')}
          className="px-4 py-2 bg-[var(--heybo-primary-500)] text-white rounded hover:bg-[var(--heybo-primary-600)]"
        >
          Popular Bowls
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading bowls...</p>}
      
      <div className="grid gap-4 md:grid-cols-2">
        {bowls.map(bowl => (
          <div key={bowl.id} className="border rounded p-4">
            <h3 className="font-semibold">{bowl.name}</h3>
            <p className="text-sm text-gray-600">{bowl.description}</p>
            <p className="text-green-600 font-medium mt-2">
              {apiUtils.formatPrice(bowl.totalPrice || 1200)}
            </p>
            {bowl.isPopular && (
              <span className="inline-block bg-[var(--heybo-primary-100)] text-[var(--heybo-primary-800)] text-xs px-2 py-1 rounded mt-2">
                Popular
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ML Recommendations Example
function MLExample() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [source, setSource] = useState('');

  const fetchRecommendations = async (filters?: string[]) => {
    try {
      setLoading(true);
      const data = await apiClient.ml.getRecommendations(
        'user-1',
        filters as any,
        []
      );
      setRecommendations(data.recommendations);
      setConfidence(data.confidence);
      setSource(data.source);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">ML Recommendations API</h2>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => fetchRecommendations()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          All Recommendations
        </button>
        <button
          onClick={() => fetchRecommendations(['vegan'])}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Vegan Only
        </button>
        <button
          onClick={() => fetchRecommendations(['gluten-free'])}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Gluten-Free Only
        </button>
      </div>

      {loading && <p className="text-gray-600">Getting recommendations...</p>}
      
      {!loading && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm">
            <strong>Confidence:</strong> {Math.round(confidence * 100)}% | 
            <strong> Source:</strong> {source}
          </p>
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map(rec => (
          <div key={rec.id} className="border rounded p-4">
            <h3 className="font-semibold">{rec.bowlComposition.name}</h3>
            <p className="text-sm text-gray-600">{rec.reasoning}</p>
            <p className="text-sm mt-2">
              <strong>Confidence:</strong> {Math.round(rec.confidence * 100)}%
            </p>
            <p className="text-green-600 font-medium">
              ~{apiUtils.formatPrice(rec.estimatedPrice || 1200)}
            </p>
            {rec.tags && (
              <div className="flex gap-1 mt-2">
                {rec.tags.map((tag: string) => (
                  <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Cart Management Example
function CartExample({ sessionId }: { sessionId: string }) {
  const [cart, setCart] = useState<any>({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!sessionId) return;
    
    try {
      setLoading(true);
      const data = await apiClient.cart.get(sessionId);
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addSampleItem = async () => {
    if (!sessionId) return;
    
    try {
      const sampleBowl = {
        id: `item-${Date.now()}`,
        name: 'Custom Bowl',
        price: 1200,
        base: 'quinoa',
        protein: 'chicken',
        sides: ['avocado', 'cucumber'],
        sauce: 'tahini',
        garnish: 'sesame'
      } as any;

      await apiClient.cart.add(sessionId, sampleBowl);
      fetchCart();
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };

  const clearCart = async () => {
    if (!sessionId) return;
    
    try {
      await apiClient.cart.clear(sessionId);
      fetchCart();
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [sessionId]);

  if (!sessionId) {
    return <p className="text-gray-600">Creating session...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Cart Management API</h2>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={addSampleItem}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Sample Item
        </button>
        <button
          onClick={clearCart}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Cart
        </button>
        <button
          onClick={fetchCart}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Cart
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading cart...</p>}
      
      <div className="bg-gray-50 rounded p-4 mb-4">
        <h3 className="font-semibold">Cart Summary</h3>
        <p>Items: {cart.itemCount}</p>
        <p>Total: {apiUtils.formatPrice(cart.total)}</p>
      </div>
      
      <div className="space-y-2">
        {cart.items.map((item: any, index: number) => (
          <div key={item.id || index} className="border rounded p-3">
            <h4 className="font-medium">{item.name}</h4>
            <p className="text-green-600">{apiUtils.formatPrice(item.price)}</p>
            <p className="text-sm text-gray-600">
              Added: {item.addedAt ? apiUtils.formatTime(new Date(item.addedAt)) : 'Unknown'}
            </p>
          </div>
        ))}
        
        {cart.items.length === 0 && (
          <p className="text-gray-500 text-center py-8">Cart is empty</p>
        )}
      </div>
    </div>
  );
} 