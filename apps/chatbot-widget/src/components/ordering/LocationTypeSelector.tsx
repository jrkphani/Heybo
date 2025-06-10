'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, Train } from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { cn } from '../../lib/utils';
import type { LocationType } from '../../types';

interface LocationTypeSelectorProps {
  onLocationTypeSelect: (type: LocationType) => void;
  className?: string;
}

export function LocationTypeSelector({ onLocationTypeSelect, className }: LocationTypeSelectorProps) {
  const { addMessage, setCurrentStep } = useChatbotStore();

  const locationTypes = [
    {
      type: 'station' as LocationType,
      title: 'MRT Station',
      description: 'Quick grab-and-go locations',
      icon: Train,
      features: ['Fast service', 'Limited seating', 'Express menu'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      type: 'outlet' as LocationType,
      title: 'Full Outlet',
      description: 'Complete dining experience',
      icon: Building2,
      features: ['Full menu', 'Comfortable seating', 'Dine-in available'],
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const handleLocationTypeSelect = (type: LocationType) => {
    // Add user message
    addMessage({
      content: `I'd like to order from a ${type === 'station' ? 'MRT station' : 'full outlet'}`,
      type: 'user'
    });

    // Add assistant response
    setTimeout(() => {
      addMessage({
        content: `Great choice! Let me show you available ${type === 'station' ? 'MRT stations' : 'outlets'} near you.`,
        type: 'assistant'
      });
    }, 500);

    // Move to location selection
    setTimeout(() => {
      setCurrentStep('location-selection');
      onLocationTypeSelect(type);
    }, 1000);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
          <MapPin className="w-6 h-6 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Choose Location Type</h3>
        <p className="text-sm text-gray-600">Where would you like to pick up your order?</p>
      </div>

      {/* Location Type Cards */}
      <div className="grid grid-cols-1 gap-4">
        {locationTypes.map((locationType) => (
          <motion.button
            key={locationType.type}
            onClick={() => handleLocationTypeSelect(locationType.type)}
            className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all duration-200 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center text-white",
                `bg-gradient-to-r ${locationType.color}`
              )}>
                <locationType.icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {locationType.title}
                  </h4>
                  <p className="text-sm text-gray-600">{locationType.description}</p>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {locationType.features.map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="text-gray-400 group-hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Not sure? MRT stations are perfect for quick orders, while outlets offer the full HeyBo experience.
        </p>
      </div>
    </div>
  );
}
