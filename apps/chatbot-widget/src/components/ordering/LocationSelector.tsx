'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Navigation, Star, ChevronRight, AlertTriangle } from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { mockLocationAPI } from '../../lib/mock-api';
import { cn } from '../../lib/utils';
import type { Location, LocationType } from '../../types';

interface LocationSelectorProps {
  locationType: LocationType;
  onLocationSelect: (location: Location) => void;
  className?: string;
}

export function LocationSelector({ locationType, onLocationSelect, className }: LocationSelectorProps) {
  const { addMessage, setCurrentStep, user } = useChatbotStore();
  const [locations, setLocations] = useState<Location[]>([]);
  const [nearestLocations, setNearestLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showAllLocations, setShowAllLocations] = useState(false);

  useEffect(() => {
    loadLocations();
    checkUserLocation();
  }, [locationType]);

  const loadLocations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const locationData = await mockLocationAPI.getLocations(locationType);

      if (locationData.length === 0) {
        setError('No locations available for the selected type. Please try a different option.');
        return;
      }

      setLocations(locationData);
    } catch (error) {
      console.error('Failed to load locations:', error);
      setError('Failed to load locations. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserLocation = () => {
    // Check for GPS data from website local storage
    const storedLocation = localStorage.getItem('heybo_user_location');
    if (storedLocation) {
      try {
        const location = JSON.parse(storedLocation);
        setUserLocation(location);
        loadNearestLocations(location.lat, location.lng);
      } catch (error) {
        console.error('Failed to parse stored location:', error);
      }
    } else {
      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(location);
            loadNearestLocations(location.lat, location.lng);
            // Store for future use
            localStorage.setItem('heybo_user_location', JSON.stringify(location));
          },
          (error) => {
            console.log('Geolocation not available:', error);
          }
        );
      }
    }
  };

  const loadNearestLocations = async (lat: number, lng: number) => {
    try {
      const nearest = await mockLocationAPI.getNearestLocations(lat, lng, 3);
      setNearestLocations(nearest.filter(loc => loc.type === locationType));
    } catch (error) {
      console.error('Failed to load nearest locations:', error);
    }
  };

  const handleLocationSelect = (location: Location) => {
    // Add user message
    addMessage({
      content: `I'll pick up from ${location.name}`,
      type: 'user'
    });

    // Add assistant response
    setTimeout(() => {
      addMessage({
        content: `Perfect! ${location.name} is a great choice. When would you like to pick up your order?`,
        type: 'assistant'
      });
    }, 500);

    // Move to time selection
    setTimeout(() => {
      setCurrentStep('time-selection');
      onLocationSelect(location);
    }, 1000);
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

  const LocationCard = ({ location, showDistance = false }: { location: Location; showDistance?: boolean }) => {
    const operatingStatus = getOperatingStatus(location);
    
    return (
      <motion.button
        onClick={() => handleLocationSelect(location)}
        className="heybo-chatbot-location-selector w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-[var(--heybo-primary-300)] hover:shadow-md transition-all duration-200 group"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        disabled={operatingStatus.status === 'closed'}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            {/* Location Name & Status */}
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900 group-hover:text-[var(--heybo-primary-600)] transition-colors">
                {location.name}
              </h4>
              <span className={cn(
                "text-xs px-2 py-1 rounded-full",
                operatingStatus.status === 'open' 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              )}>
                {operatingStatus.status === 'open' ? 'Open' : 'Closed'}
              </span>
            </div>

            {/* Address */}
            <p className="text-sm text-gray-600">{location.address}</p>

            {/* Details Row */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {showDistance && location.distance && (
                <div className="flex items-center space-x-1">
                  <Navigation className="w-3 h-3" />
                  <span>{formatDistance(location.distance)}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{operatingStatus.text}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span>Wait: {location.estimatedWaitTime}</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="text-gray-400 group-hover:text-[var(--heybo-primary-500)] transition-colors">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </motion.button>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--heybo-primary-600)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Unable to Load Locations</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => loadLocations()}
            className="px-4 py-2 bg-[var(--heybo-primary-600)] text-white rounded-lg hover:bg-[var(--heybo-primary-700)] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-[var(--heybo-primary-100)] rounded-full flex items-center justify-center mx-auto">
          <MapPin className="w-6 h-6 text-[var(--heybo-primary-600)]" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Choose {locationType === 'station' ? 'MRT Station' : 'Outlet'}
        </h3>
        <p className="text-sm text-gray-600">Select your pickup location</p>
      </div>

      {/* Nearest Locations (if GPS available) */}
      {userLocation && nearestLocations.length > 0 && !showAllLocations && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Nearest to you</h4>
            <button
              onClick={() => setShowAllLocations(true)}
              className="text-sm text-[var(--heybo-primary-600)] hover:text-[var(--heybo-primary-700)]"
            >
              Show all
            </button>
          </div>
          
          <div className="space-y-2">
            {nearestLocations.map((location) => (
              <LocationCard key={location.id} location={location} showDistance />
            ))}
          </div>
        </div>
      )}

      {/* All Locations */}
      <AnimatePresence>
        {(showAllLocations || !userLocation || nearestLocations.length === 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">
                All {locationType === 'station' ? 'MRT Stations' : 'Outlets'}
              </h4>
              {showAllLocations && (
                <button
                  onClick={() => setShowAllLocations(false)}
                  className="text-sm text-[var(--heybo-primary-600)] hover:text-[var(--heybo-primary-700)]"
                >
                  Show nearest
                </button>
              )}
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {locations.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          All locations show estimated wait times and current operating status
        </p>
      </div>
    </div>
  );
}
