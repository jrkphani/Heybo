'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { mockLocationAPI } from '../../lib/mock-api';
import type { Location, LocationType } from '../../types';
import { cn } from '../../lib/utils';
import '../../styles/heybo-design-tokens.css';

interface GPSLocationHandlerProps {
  locationType: LocationType;
  onLocationSelect: (location: Location) => void;
  onShowAllLocations: () => void;
  className?: string;
}

interface GPSState {
  isChecking: boolean;
  hasPermission: boolean | null;
  userLocation: { lat: number; lng: number } | null;
  nearestLocations: Location[];
  error: string | null;
}

export function GPSLocationHandler({ 
  locationType, 
  onLocationSelect, 
  onShowAllLocations,
  className 
}: GPSLocationHandlerProps) {
  const { addMessage, user } = useChatbotStore();
  const [gpsState, setGpsState] = useState<GPSState>({
    isChecking: true,
    hasPermission: null,
    userLocation: null,
    nearestLocations: [],
    error: null
  });

  useEffect(() => {
    checkGPSLocation();
  }, [locationType]);

  const checkGPSLocation = async () => {
    try {
      setGpsState(prev => ({ ...prev, isChecking: true, error: null }));

      // First check website local storage for GPS data
      const storedLocation = localStorage.getItem('heybo_user_location');
      if (storedLocation) {
        try {
          const location = JSON.parse(storedLocation);
          await handleLocationFound(location.lat, location.lng, 'stored');
          return;
        } catch (error) {
          console.warn('Failed to parse stored location:', error);
          localStorage.removeItem('heybo_user_location');
        }
      }

      // Check if geolocation is available
      if (!navigator.geolocation) {
        await handleNoGPS('not_supported');
        return;
      }

      // Request current position
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Store for future use
          localStorage.setItem('heybo_user_location', JSON.stringify(location));
          await handleLocationFound(location.lat, location.lng, 'current');
        },
        async (error) => {
          console.warn('Geolocation error:', error);
          await handleNoGPS('permission_denied');
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 300000 // 5 minutes
        }
      );
    } catch (error) {
      console.error('GPS check failed:', error);
      await handleNoGPS('error');
    }
  };

  const handleLocationFound = async (lat: number, lng: number, source: 'stored' | 'current') => {
    try {
      const nearest = await mockLocationAPI.getNearestLocations(lat, lng, 3);
      const filteredNearest = nearest.filter(loc => loc.type === locationType);

      setGpsState({
        isChecking: false,
        hasPermission: true,
        userLocation: { lat, lng },
        nearestLocations: filteredNearest,
        error: null
      });

      // Add contextual message
      if (source === 'stored') {
        addMessage({
          content: 'Using your saved location to find nearby options',
          type: 'assistant'
        });
      } else {
        addMessage({
          content: 'Found your location! Here are the nearest options',
          type: 'assistant'
        });
      }
    } catch (error) {
      console.error('Failed to load nearest locations:', error);
      await handleNoGPS('api_error');
    }
  };

  const handleNoGPS = async (reason: 'not_supported' | 'permission_denied' | 'error' | 'api_error') => {
    const messages = {
      not_supported: 'Location services not available on this device',
      permission_denied: 'Location access denied. Showing all locations',
      error: 'Unable to get your location. Showing all locations',
      api_error: 'Error loading nearby locations. Showing all locations'
    };

    setGpsState({
      isChecking: false,
      hasPermission: false,
      userLocation: null,
      nearestLocations: [],
      error: messages[reason]
    });

    addMessage({
      content: messages[reason],
      type: 'assistant'
    });

    // Auto-proceed to show all locations
    setTimeout(() => {
      onShowAllLocations();
    }, 1500);
  };

  const handleLocationSelect = (location: Location) => {
    addMessage({
      content: `I'll pick up from ${location.name}`,
      type: 'user'
    });

    setTimeout(() => {
      addMessage({
        content: `Perfect! ${location.name} is a great choice. When would you like to pick up your order?`,
        type: 'assistant'
      });
    }, 500);

    onLocationSelect(location);
  };

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const getOperatingStatus = (location: Location) => {
    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[now.getDay()] as keyof typeof location.operatingHours;
    const todayHours = location.operatingHours[currentDay];

    if (!todayHours) return { status: 'closed', text: 'Closed today' };

    const currentTime = now.getHours() * 100 + now.getMinutes();
    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));

    if (currentTime >= openTime && currentTime <= closeTime) {
      return { status: 'open', text: `Open until ${todayHours.close}` };
    }

    return { status: 'closed', text: `Opens at ${todayHours.open}` };
  };

  if (gpsState.isChecking) {
    return (
      <div className={cn("heybo-chatbot-gps-handler flex flex-col items-center justify-center p-8 space-y-4", className)}>
        <Loader2 className="w-8 h-8 heybo-text-primary-600 animate-spin" />
        <div className="text-center">
          <h3 className="font-medium text-gray-900 mb-1">Finding nearby locations</h3>
          <p className="text-sm text-gray-600">Checking your location for the best options...</p>
        </div>
      </div>
    );
  }

  if (gpsState.error) {
    return (
      <div className={cn("heybo-chatbot-gps-handler flex flex-col items-center justify-center p-8 space-y-4", className)}>
        <AlertCircle className="w-8 h-8 text-amber-500" />
        <div className="text-center">
          <h3 className="font-medium text-gray-900 mb-1">Location unavailable</h3>
          <p className="text-sm text-gray-600">{gpsState.error}</p>
        </div>
      </div>
    );
  }

  if (gpsState.nearestLocations.length === 0) {
    return (
      <div className={cn("heybo-chatbot-gps-handler flex flex-col items-center justify-center p-8 space-y-4", className)}>
        <MapPin className="w-8 h-8 text-gray-400" />
        <div className="text-center">
          <h3 className="font-medium text-gray-900 mb-1">No nearby locations</h3>
          <p className="text-sm text-gray-600">
            No {locationType === 'station' ? 'MRT stations' : 'outlets'} found nearby
          </p>
          <button
            onClick={onShowAllLocations}
            className="mt-3 text-sm heybo-text-primary-600 heybo-hover-text-primary-700 font-medium"
          >
            View all locations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("heybo-chatbot-gps-handler space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-green-600" />
          <h3 className="font-medium text-gray-900">Nearest to you</h3>
        </div>
        <button
          onClick={onShowAllLocations}
          className="text-sm heybo-text-primary-600 heybo-hover-text-primary-700 font-medium"
        >
          Show all
        </button>
      </div>

      {/* Nearest Locations */}
      <div className="space-y-3">
        {gpsState.nearestLocations.map((location) => {
          const operatingStatus = getOperatingStatus(location);
          
          return (
            <motion.button
              key={location.id}
              onClick={() => handleLocationSelect(location)}
              className="w-full p-4 bg-white border border-gray-200 rounded-lg heybo-hover-border-primary-300 hover:shadow-md transition-all duration-200 text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{location.name}</h4>
                    <span className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded-full",
                      operatingStatus.status === 'open' 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    )}>
                      {operatingStatus.status === 'open' ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Navigation className="w-3 h-3" />
                      <span>{formatDistance(location.distance!)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{operatingStatus.text}</span>
                    </div>
                    <span>Wait: {location.estimatedWaitTime}</span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Last ordered location hint */}
      {user?.lastOrderedLocation && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 Your last order was from {user.lastOrderedLocation}
          </p>
        </div>
      )}
    </div>
  );
}
