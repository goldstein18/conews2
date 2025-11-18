'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getMonthlyOccurrenceOptions } from '../../lib/date-utils';

interface MonthlyOccurrenceSelectorProps {
  startDate: string;
  selectedOccurrence: 'day' | 'weekday';
  onOccurrenceChange: (occurrence: 'day' | 'weekday', data: {
    dayOfMonth?: number;
    weekPosition?: number;
    dayOfWeek?: number;
  }) => void;
  error?: string;
}

export function MonthlyOccurrenceSelector({
  startDate,
  selectedOccurrence,
  onOccurrenceChange,
  error
}: MonthlyOccurrenceSelectorProps) {
  const [options, setOptions] = React.useState({
    dayOption: { value: 'day', label: 'On the 1st', dayOfMonth: 1 },
    weekdayOption: { value: 'weekday', label: 'On the first Monday', weekPosition: 1, dayOfWeek: 1 }
  });

  // Update options when start date changes
  React.useEffect(() => {
    if (startDate) {
      const newOptions = getMonthlyOccurrenceOptions(startDate);
      setOptions(newOptions);
    }
  }, [startDate]);

  const handleOccurrenceChange = (value: 'day' | 'weekday') => {
    if (value === 'day') {
      onOccurrenceChange('day', {
        dayOfMonth: options.dayOption.dayOfMonth
      });
    } else {
      onOccurrenceChange('weekday', {
        weekPosition: options.weekdayOption.weekPosition,
        dayOfWeek: options.weekdayOption.dayOfWeek
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="monthly-occurrence">
        Occurs <span className="text-red-500">*</span>
      </Label>
      
      <Select 
        value={selectedOccurrence} 
        onValueChange={handleOccurrenceChange}
      >
        <SelectTrigger className={error ? "border-red-500" : ""}>
          <SelectValue placeholder="Select occurrence pattern" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">
            {options.dayOption.label}
          </SelectItem>
          <SelectItem value="weekday">
            {options.weekdayOption.label}
          </SelectItem>
        </SelectContent>
      </Select>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}