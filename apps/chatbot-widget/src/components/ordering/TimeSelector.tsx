'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Zap } from 'lucide-react';
import { useChatbotStore } from '../../store/chatbot-store';
import { cn } from '../../lib/utils';
import { HeyBoCalendar } from '../ui/heybo-calendar';
import { Button } from '../ui/button';
import type { OrderTimeType } from '../../types';

interface TimeSelectorProps {
  onTimeSelect: (timeType: OrderTimeType, scheduledTime?: Date) => void;
  className?: string;
}

export function TimeSelector({ onTimeSelect, className }: TimeSelectorProps) {
  const { addMessage, setCurrentStep, selectedLocation } = useChatbotStore();
  const [selectedTimeType, setSelectedTimeType] = useState<OrderTimeType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
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

    // Create scheduled datetime by combining selected date and time
    const scheduledDateTime = new Date(selectedDate);
    const timeParts = selectedTime.split(':');
    const hours = parseInt(timeParts[0] || '0', 10);
    const minutes = parseInt(timeParts[1] || '0', 10);
    scheduledDateTime.setHours(hours, minutes, 0, 0);

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
    return new Date();
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7); // Allow booking up to 7 days ahead
    return maxDate;
  };

  // Check if a date should be disabled (past dates)
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className={cn("heybo-chatbot-time-selector space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-[var(--heybo-primary-100)] rounded-full flex items-center justify-center mx-auto">
          <Clock className="w-6 h-6 text-[var(--heybo-primary-600)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--heybo-text-primary)]">When do you want to pick up?</h3>
        <p className="text-sm text-[var(--heybo-text-secondary)]">
          Pickup from {selectedLocation?.name}
        </p>
      </div>

      {/* ASAP Option */}
      <motion.button
        onClick={handleASAPSelect}
        className="w-full p-4 bg-white border-2 border-[var(--heybo-primary-200)] rounded-xl hover:border-[var(--heybo-primary-400)] hover:shadow-md transition-all duration-200 group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-[var(--heybo-primary-500)] to-[var(--heybo-primary-600)] rounded-lg flex items-center justify-center text-white">
            <Zap className="w-6 h-6" />
          </div>

          <div className="flex-1 text-left">
            <h4 className="font-semibold text-[var(--heybo-text-primary)] group-hover:text-[var(--heybo-primary-600)] transition-colors">
              ASAP (Recommended)
            </h4>
            <p className="text-sm text-[var(--heybo-text-secondary)]">
              Ready in {estimatedReadyTime}
            </p>
          </div>
          
          <div className="text-[var(--heybo-primary-600)] font-medium">
            Fastest
          </div>
        </div>
      </motion.button>

      {/* Scheduled Option */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-[var(--heybo-text-secondary)]" />
          <h4 className="font-medium text-[var(--heybo-text-primary)]">Schedule for later</h4>
        </div>

        {/* Calendar and Time Selection Card */}
        <div className="bg-white rounded-xl border border-[var(--heybo-border-light)] shadow-sm overflow-hidden">
          <div className="relative p-0 md:pr-48">
            {/* Calendar Section */}
            <div className="p-6">
              <HeyBoCalendar
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateDisabled}
                fromDate={getMinDate()}
                toDate={getMaxDate()}
                showOutsideDays={false}
                className="bg-transparent p-0"
              />
            </div>

            {/* Time Selection Sidebar */}
            <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l border-[var(--heybo-border-light)]">
              <div className="grid gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    onClick={() => setSelectedTime(time)}
                    disabled={!selectedDate}
                    className={cn(
                      "w-full h-10 text-sm font-medium transition-all duration-200 shadow-none",
                      selectedTime === time
                        ? "bg-[var(--heybo-primary-600)] text-white hover:bg-[var(--heybo-primary-700)] border-[var(--heybo-primary-600)]"
                        : "bg-white text-[var(--heybo-text-primary)] border-[var(--heybo-border-medium)] hover:bg-[var(--heybo-primary-50)] hover:border-[var(--heybo-primary-300)]",
                      !selectedDate && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer with confirmation */}
          <div className="flex flex-col gap-4 border-t border-[var(--heybo-border-light)] px-6 py-5 md:flex-row">
            <div className="text-sm text-[var(--heybo-text-secondary)]">
              {selectedDate && selectedTime ? (
                <>
                  Your pickup is scheduled for{" "}
                  <span className="font-medium text-[var(--heybo-text-primary)]">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>{" "}
                  at <span className="font-medium text-[var(--heybo-text-primary)]">{selectedTime}</span>.
                </>
              ) : (
                <>Select a date and time for your pickup.</>
              )}
            </div>
            <Button
              onClick={handleScheduledSelect}
              disabled={!selectedDate || !selectedTime}
              className={cn(
                "w-full md:ml-auto md:w-auto h-10 px-6 font-medium transition-all duration-200",
                selectedDate && selectedTime
                  ? "bg-[var(--heybo-primary-600)] text-white hover:bg-[var(--heybo-primary-700)] shadow-md hover:shadow-lg"
                  : "bg-[var(--heybo-border-medium)] text-[var(--heybo-text-muted)] cursor-not-allowed"
              )}
              variant="outline"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Operating Hours Info */}
      {selectedLocation && (
        <div className="bg-[var(--heybo-secondary-50)] border border-[var(--heybo-secondary-200)] rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 text-[var(--heybo-secondary-600)] mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium text-[var(--heybo-secondary-800)]">Operating Hours</div>
              <div className="text-[var(--heybo-secondary-700)]">
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
        <p className="text-xs text-[var(--heybo-text-muted)]">
          ASAP orders are typically ready in {estimatedReadyTime}. Scheduled orders can be placed up to 7 days in advance.
        </p>
      </div>
    </div>
  );
}
