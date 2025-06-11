'use client';

import React from 'react';
import { Calendar } from './calendar';
import { cn } from '../../lib/utils';

interface HeyBoCalendarProps {
  selected?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  fromDate?: Date;
  toDate?: Date;
  className?: string;
  showOutsideDays?: boolean;
}

/**
 * HeyBo-themed calendar component with design system compliance
 * Uses shadcn calendar with HeyBo design tokens and CSS namespacing
 */
export function HeyBoCalendar({
  selected,
  onSelect,
  disabled,
  fromDate,
  toDate,
  className,
  showOutsideDays = false,
  ...props
}: HeyBoCalendarProps) {
  return (
    <div className="heybo-chatbot-calendar-container">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={onSelect}
        disabled={disabled}
        fromDate={fromDate}
        toDate={toDate}
        showOutsideDays={showOutsideDays}
        className={cn("heybo-chatbot-calendar w-full", className)}
        classNames={{
          months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4 w-full flex flex-col",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium text-[var(--heybo-text-primary)]",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            "h-7 w-7 bg-transparent p-0 text-[var(--heybo-text-secondary)] hover:text-[var(--heybo-primary-600)]"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex w-full",
          head_cell: "text-[var(--heybo-text-muted)] rounded-md w-8 font-normal text-[0.8rem] flex-1 text-center",
          row: "flex w-full mt-2",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1",
            "[&:has([aria-selected])]:bg-[var(--heybo-primary-100)] [&:has([aria-selected].day-outside)]:bg-[var(--heybo-primary-50)]/50 [&:has([aria-selected].day-range-end)]:rounded-r-md"
          ),
          day: cn(
            "h-8 w-8 p-0 font-normal text-[var(--heybo-text-primary)] hover:bg-[var(--heybo-primary-100)] hover:text-[var(--heybo-primary-700)] focus:bg-[var(--heybo-primary-100)] focus:text-[var(--heybo-primary-700)] mx-auto rounded-md transition-colors",
            "aria-selected:bg-[var(--heybo-primary-600)] aria-selected:text-white aria-selected:hover:bg-[var(--heybo-primary-700)] aria-selected:hover:text-white aria-selected:focus:bg-[var(--heybo-primary-700)] aria-selected:focus:text-white"
          ),
          day_range_end: "day-range-end",
          day_selected: "bg-[var(--heybo-primary-600)] text-white hover:bg-[var(--heybo-primary-700)] hover:text-white focus:bg-[var(--heybo-primary-700)] focus:text-white",
          day_today: "bg-[var(--heybo-secondary-100)] text-[var(--heybo-secondary-700)] font-medium",
          day_outside: "text-[var(--heybo-text-muted)] opacity-50 aria-selected:bg-[var(--heybo-primary-500)]/50 aria-selected:text-[var(--heybo-text-muted)] aria-selected:opacity-30",
          day_disabled: "text-[var(--heybo-text-muted)] opacity-50 cursor-not-allowed",
          day_range_middle: "aria-selected:bg-[var(--heybo-primary-100)] aria-selected:text-[var(--heybo-primary-700)]",
          day_hidden: "invisible",
        }}
        {...props}
      />
    </div>
  );
}
