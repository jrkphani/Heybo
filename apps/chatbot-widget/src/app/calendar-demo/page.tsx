'use client';

import React, { useState } from 'react';
import { TimeSelector } from '../../components/ordering/TimeSelector';
import { HeyBoCalendar } from '../../components/ui/heybo-calendar';
import { HeyBoCalendarPicker } from '../../components/ui/heybo-calendar-picker';
import type { OrderTimeType } from '../../types';

export default function CalendarDemoPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeSelection, setTimeSelection] = useState<{
    type: OrderTimeType;
    scheduledTime?: Date;
  } | null>(null);
  const [calendarPickerSelection, setCalendarPickerSelection] = useState<{
    date: Date;
    time: string;
  } | null>(null);

  const handleTimeSelect = (timeType: OrderTimeType, scheduledTime?: Date) => {
    setTimeSelection({ type: timeType, scheduledTime });
  };

  const handleCalendarPickerSelect = (selection: { date: Date; time: string }) => {
    setCalendarPickerSelection(selection);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getMinDate = () => new Date();
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    return maxDate;
  };

  return (
    <div className="heybo-chatbot-widget min-h-screen bg-[var(--heybo-background-secondary)] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-[var(--heybo-text-primary)]">
            HeyBo Calendar Components Demo
          </h1>
          <p className="text-[var(--heybo-text-secondary)]">
            Showcasing the updated TimeSelector with shadcn calendar and HeyBo design tokens
          </p>
        </div>

        <div className="space-y-8">
          {/* Target Design Calendar Picker */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--heybo-text-primary)]">
              Target Design - Calendar Picker (Matches Reference Image)
            </h2>
            <HeyBoCalendarPicker
              onDateTimeSelect={handleCalendarPickerSelect}
              fromDate={getMinDate()}
              toDate={getMaxDate()}
            />

            {calendarPickerSelection && (
              <div className="bg-[var(--heybo-primary-50)] border border-[var(--heybo-primary-200)] rounded-lg p-4">
                <h3 className="font-medium text-[var(--heybo-primary-800)] mb-2">
                  Calendar Picker Selection:
                </h3>
                <p className="text-[var(--heybo-primary-700)]">
                  Date: <span className="font-medium">
                    {calendarPickerSelection.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </p>
                <p className="text-[var(--heybo-primary-700)]">
                  Time: <span className="font-medium">{calendarPickerSelection.time}</span>
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* TimeSelector Component */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[var(--heybo-text-primary)]">
                TimeSelector Component (Original)
              </h2>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <TimeSelector onTimeSelect={handleTimeSelect} />
              </div>

              {timeSelection && (
              <div className="bg-[var(--heybo-primary-50)] border border-[var(--heybo-primary-200)] rounded-lg p-4">
                <h3 className="font-medium text-[var(--heybo-primary-800)] mb-2">
                  Selection Result:
                </h3>
                <p className="text-[var(--heybo-primary-700)]">
                  Type: <span className="font-medium">{timeSelection.type}</span>
                </p>
                {timeSelection.scheduledTime && (
                  <p className="text-[var(--heybo-primary-700)]">
                    Scheduled Time: <span className="font-medium">
                      {timeSelection.scheduledTime.toLocaleString()}
                    </span>
                  </p>
                )}
              </div>
            )}
            </div>

            {/* Standalone HeyBoCalendar */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[var(--heybo-text-primary)]">
                Standalone HeyBo Calendar
              </h2>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <HeyBoCalendar
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={isDateDisabled}
                  fromDate={getMinDate()}
                  toDate={getMaxDate()}
                  showOutsideDays={false}
                />
              </div>

              {selectedDate && (
                <div className="bg-[var(--heybo-secondary-50)] border border-[var(--heybo-secondary-200)] rounded-lg p-4">
                  <h3 className="font-medium text-[var(--heybo-secondary-800)] mb-2">
                    Selected Date:
                  </h3>
                  <p className="text-[var(--heybo-secondary-700)]">
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Design System Features */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-[var(--heybo-text-primary)] mb-4">
            Design System Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-[var(--heybo-text-primary)]">
                ✅ HeyBo Design Tokens
              </h3>
              <p className="text-sm text-[var(--heybo-text-secondary)]">
                All colors use CSS variables from the HeyBo design system
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-[var(--heybo-text-primary)]">
                ✅ CSS Namespacing
              </h3>
              <p className="text-sm text-[var(--heybo-text-secondary)]">
                All styles prefixed with .heybo-chatbot- for isolation
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-[var(--heybo-text-primary)]">
                ✅ Touch-Friendly
              </h3>
              <p className="text-sm text-[var(--heybo-text-secondary)]">
                44px minimum touch targets for mobile ordering
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-[var(--heybo-text-primary)]">
                ✅ Responsive Design
              </h3>
              <p className="text-sm text-[var(--heybo-text-secondary)]">
                Adapts to different screen sizes and breakpoints
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-[var(--heybo-text-primary)]">
                ✅ Accessibility
              </h3>
              <p className="text-sm text-[var(--heybo-text-secondary)]">
                Proper focus states and keyboard navigation
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-[var(--heybo-text-primary)]">
                ✅ Type Safety
              </h3>
              <p className="text-sm text-[var(--heybo-text-secondary)]">
                Full TypeScript support with proper type definitions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
