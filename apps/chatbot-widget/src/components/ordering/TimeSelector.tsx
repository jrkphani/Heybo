'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Zap } from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { cn } from '../../lib/utils';
import type { OrderTimeType } from '../../types';

interface TimeSelectorProps {
  onTimeSelect: (timeType: OrderTimeType, scheduledTime?: Date) => void;
  className?: string;
}

export function TimeSelector({ onTimeSelect, className }: TimeSelectorProps) {
  const { addMessage, setCurrentStep, selectedLocation } = useChatbotStore();
  const [selectedTimeType, setSelectedTimeType] = useState<OrderTimeType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Start from next 15-minute interval
    let startHour = currentHour;
    let startMinute = Math.ceil(currentMinute / 15) * 15;
    
    if (startMinute >= 60) {
      startHour += 1;
      startMinute = 0;
    }
    
    // Generate slots for next 4 hours
    for (let i = 0; i < 16; i++) { // 4 hours * 4 slots per hour
      const hour = startHour + Math.floor(i / 4);
      const minute = (startMinute + (i % 4) * 15) % 60;
      
      if (hour < 22) { // Stop at 10 PM
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const estimatedReadyTime = selectedLocation?.estimatedWaitTime || '15-20 mins';

  const handleASAPSelect = () => {
    addMessage({
      content: 'I want to pick up ASAP',
      type: 'user'
    });

    setTimeout(() => {
      addMessage({
        content: `Perfect! Your order will be ready for pickup in ${estimatedReadyTime}. Let's start building your bowl!`,
        type: 'assistant'
      });
    }, 500);

    setTimeout(() => {
      setCurrentStep('order-type-selection');
      onTimeSelect('asap');
    }, 1000);
  };

  const handleScheduledSelect = () => {
    if (!selectedDate || !selectedTime) return;

    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
    
    addMessage({
      content: `I want to schedule pickup for ${scheduledDateTime.toLocaleDateString()} at ${selectedTime}`,
      type: 'user'
    });

    setTimeout(() => {
      addMessage({
        content: `Great! Your order is scheduled for pickup on ${scheduledDateTime.toLocaleDateString()} at ${selectedTime}. Let's build your bowl!`,
        type: 'assistant'
      });
    }, 500);

    setTimeout(() => {
      setCurrentStep('order-type-selection');
      onTimeSelect('scheduled', scheduledDateTime);
    }, 1000);
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7); // Allow booking up to 7 days ahead
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
          <Clock className="w-6 h-6 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">When do you want to pick up?</h3>
        <p className="text-sm text-gray-600">
          Pickup from {selectedLocation?.name}
        </p>
      </div>

      {/* ASAP Option */}
      <motion.button
        onClick={handleASAPSelect}
        className="w-full p-4 bg-white border-2 border-orange-200 rounded-xl hover:border-orange-400 hover:shadow-md transition-all duration-200 group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white">
            <Zap className="w-6 h-6" />
          </div>
          
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
              ASAP (Recommended)
            </h4>
            <p className="text-sm text-gray-600">
              Ready in {estimatedReadyTime}
            </p>
          </div>
          
          <div className="text-orange-600 font-medium">
            Fastest
          </div>
        </div>
      </motion.button>

      {/* Scheduled Option */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <h4 className="font-medium text-gray-900">Schedule for later</h4>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getMinDate()}
              max={getMaxDate()}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              disabled={!selectedDate}
            >
              <option value="">Choose a time</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Schedule Button */}
          <button
            onClick={handleScheduledSelect}
            disabled={!selectedDate || !selectedTime}
            className={cn(
              "w-full py-3 rounded-lg font-medium transition-colors",
              selectedDate && selectedTime
                ? "bg-orange-600 text-white hover:bg-orange-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            Schedule Pickup
          </button>
        </div>
      </div>

      {/* Operating Hours Info */}
      {selectedLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium text-blue-900">Operating Hours</div>
              <div className="text-blue-700">
                Today: {(() => {
                  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                  const today = days[new Date().getDay()] as keyof typeof selectedLocation.operatingHours;
                  const todayHours = selectedLocation.operatingHours[today];
                  return todayHours ? `${todayHours.open} - ${todayHours.close}` : 'Closed';
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          ASAP orders are typically ready in {estimatedReadyTime}. Scheduled orders can be placed up to 7 days in advance.
        </p>
      </div>
    </div>
  );
}
