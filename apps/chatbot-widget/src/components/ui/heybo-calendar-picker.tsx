'use client';

import React, { useState } from 'react';
import { HeyBoCalendar } from './heybo-calendar';
import { Button } from './button';
import { cn } from '../../lib/utils';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './resizable';

interface HeyBoCalendarPickerProps {
  onDateTimeSelect?: (selection: { date: Date; time: string }) => void;
  className?: string;
  disabled?: (date: Date) => boolean;
  fromDate?: Date;
  toDate?: Date;
}

/**
 * HeyBo Calendar Picker - matches the target design with side-by-side layout
 * Calendar on the left, time slots on the right, confirmation at bottom
 */
export function HeyBoCalendarPicker({
  onDateTimeSelect,
  className,
  disabled,
  fromDate,
  toDate,
  ...props
}: HeyBoCalendarPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Generate time slots from 9:00 to 11:45 in 15-minute intervals (matching reference)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 11; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === 11 && minute > 45) break; // Stop at 11:45
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleContinue = () => {
    if (selectedDate && selectedTime && onDateTimeSelect) {
      onDateTimeSelect({
        date: selectedDate,
        time: selectedTime
      });
    }
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    if (disabled) return disabled(date);
    return false;
  };

  return (
    <div className={cn("heybo-chatbot-calendar-picker bg-white rounded-2xl border border-[var(--heybo-border-light)] shadow-lg overflow-hidden w-full max-w-2xl mx-auto", className)}>
      {/* Main Content with Resizable Panels */}
      <div className="h-[500px]">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Calendar Panel */}
          <ResizablePanel defaultSize={65} minSize={55}>
            <div className="h-full p-6 flex flex-col">
              <HeyBoCalendar
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateDisabled}
                fromDate={fromDate}
                toDate={toDate}
                showOutsideDays={false}
                className="flex-1 bg-transparent p-0"
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Time Selection Panel */}
          <ResizablePanel defaultSize={35} minSize={25}>
            <div className="h-full p-6 flex flex-col border-l border-[var(--heybo-border-light)]">
              {/* Time Slots */}
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      disabled={!selectedDate}
                      className={cn(
                        "w-full h-12 text-center font-medium rounded-xl transition-all duration-200",
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
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Footer with confirmation - only show when both date and time are selected */}
      {selectedDate && selectedTime && (
        <div className="border-t border-[var(--heybo-border-light)] p-6 bg-[var(--heybo-background-secondary)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--heybo-text-secondary)]">
                Your meeting is booked for{" "}
                <strong className="text-[var(--heybo-text-primary)]">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at {selectedTime}
                </strong>.
              </p>
            </div>
            <Button
              onClick={handleContinue}
              className="bg-[var(--heybo-primary-600)] text-white hover:bg-[var(--heybo-primary-700)] px-8 rounded-xl font-medium"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
