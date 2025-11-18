'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WeekDaySelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
  startDate?: string;
}

const WEEK_DAYS = [
  { label: 'Mo', value: 1 },
  { label: 'Tu', value: 2 },
  { label: 'We', value: 3 },
  { label: 'Th', value: 4 },
  { label: 'Fr', value: 5 },
  { label: 'Sa', value: 6 },
  { label: 'Su', value: 0 }
];

export function WeekDaySelector({ selectedDays, onChange, startDate }: WeekDaySelectorProps) {
  // Auto-select the day of the week when start date changes
  React.useEffect(() => {
    if (startDate && selectedDays.length === 0) {
      const [year, month, day] = startDate.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      onChange([dayOfWeek]);
    }
  }, [startDate, selectedDays.length, onChange]);

  const toggleDay = (dayValue: number) => {
    if (selectedDays.includes(dayValue)) {
      // Don't allow deselecting if it's the only day selected
      if (selectedDays.length > 1) {
        onChange(selectedDays.filter(day => day !== dayValue));
      }
    } else {
      onChange([...selectedDays, dayValue].sort());
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-base font-medium">Repeat on</h4>
      <div className="flex space-x-2">
        {WEEK_DAYS.map((day) => (
          <Button
            key={day.value}
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => toggleDay(day.value)}
            className={cn(
              "w-12 h-12 rounded-full border-2 transition-colors",
              selectedDays.includes(day.value)
                ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                : "text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            {day.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

// Make sure React is available
import * as React from 'react';