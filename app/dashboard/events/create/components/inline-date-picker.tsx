'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { formatDisplayDate } from '../../lib/date-utils';

interface InlineDatePickerProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  error?: string;
  disabled?: (date: Date) => boolean;
  defaultMonth?: Date;
  required?: boolean;
  placeholder?: string;
  allowedWeekDays?: number[]; // 0=Sunday, 1=Monday, ... 6=Saturday
}

export function InlineDatePicker({
  label,
  value,
  onChange,
  error,
  disabled,
  defaultMonth,
  required = false,
  placeholder = "Select date",
  allowedWeekDays
}: InlineDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'));
      setIsOpen(false);
    }
  };

  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const isDateDisabled = (date: Date): boolean => {
    // Check if the date is disabled by the original disabled function
    if (disabled && disabled(date)) {
      return true;
    }

    // Check if the day of week is allowed
    if (allowedWeekDays && allowedWeekDays.length > 0) {
      const dayOfWeek = date.getDay();
      if (!allowedWeekDays.includes(dayOfWeek)) {
        return true;
      }
    }

    return false;
  };

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      {/* Date Display Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full justify-between text-left font-normal",
          !value && "text-muted-foreground",
          error && "border-red-500"
        )}
      >
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? formatDisplayDate(value) : placeholder}
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </Button>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Inline Calendar */}
      {isOpen && (
        <div className="border rounded-md bg-background shadow-lg">
          <Calendar
            mode="single"
            selected={parseDate(value)}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            defaultMonth={defaultMonth}
            initialFocus
            className="p-3"
          />
        </div>
      )}
    </div>
  );
}