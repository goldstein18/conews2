'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TimePickerProps {
  value?: string; // 24-hour format HH:MM (e.g., "13:30") or timestamp format
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// Generate time options in 30-minute intervals (12-hour format)
const generateTimeOptions = (): { display: string; value: string }[] => {
  const options: { display: string; value: string }[] = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const display = convert24to12(value);
      options.push({ display, value });
    }
  }

  return options;
};

// Convert 24-hour time to 12-hour format with AM/PM
const convert24to12 = (time: string): string => {
  if (!time) return '';

  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
};

// Convert 12-hour format to 24-hour format
const convert12to24 = (time12: string): string => {
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return '';

  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

export function TimePicker({
  value,
  onChange,
  placeholder = 'Select time',
  disabled = false,
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const timeOptions = generateTimeOptions();

  // Normalize value to ensure it's in 24-hour format (HH:MM)
  const normalizeValue = (val: string): string => {
    if (!val) return '';

    // If it's a timestamp format (YYYY-MM-DD HH:MM:SS.mmm or ISO format), extract time
    // Examples: "2025-11-05 10:00:00.000" or "2025-11-05T10:00:00.000Z"
    if (val.includes(' ') || val.includes('T')) {
      try {
        // Extract time portion from timestamp
        const timePart = val.includes('T')
          ? val.split('T')[1].split('.')[0]  // ISO format: "2025-11-05T10:00:00.000Z"
          : val.split(' ')[1].split('.')[0];  // SQL format: "2025-11-05 10:00:00.000"

        // Return HH:MM format
        if (timePart && timePart.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
          return timePart.substring(0, 5); // Get only HH:MM
        }
      } catch {
        console.warn('[TimePicker] Failed to parse timestamp:', val);
      }
    }

    // If already in HH:MM:SS format, trim to HH:MM
    if (val.match(/^\d{2}:\d{2}:\d{2}$/)) {
      return val.substring(0, 5);
    }

    // If already in HH:MM format (24-hour), use it
    if (val.match(/^\d{2}:\d{2}$/)) {
      return val;
    }

    // If it's H:MM format (single digit hour), pad it
    if (val.match(/^\d{1}:\d{2}$/)) {
      const [h, m] = val.split(':');
      return `${h.padStart(2, '0')}:${m}`;
    }

    // If it contains AM/PM, convert from 12-hour to 24-hour
    if (val.match(/AM|PM/i)) {
      return convert12to24(val);
    }

    return val;
  };

  // Get display value (12-hour format)
  const normalizedValue = normalizeValue(value || '');
  const displayValue = normalizedValue ? convert24to12(normalizedValue) : '';

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return timeOptions;

    const search = searchTerm.toLowerCase().replace(/[^0-9ap]/g, '');

    return timeOptions.filter((option) => {
      const optionText = option.display.toLowerCase().replace(/[^0-9ap]/g, '');
      return optionText.includes(search);
    });
  }, [searchTerm, timeOptions]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);

    // Open dropdown when user types
    if (!open && inputValue) {
      setOpen(true);
    }

    // Try to match exact format and convert to 24-hour
    const match = inputValue.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      const time24 = convert12to24(inputValue);
      // Only update if we get a valid 24-hour format (HH:MM)
      if (time24 && time24.match(/^\d{2}:\d{2}$/)) {
        onChange(time24);
      }
    }
  };

  // Handle option selection
  const handleSelectOption = (option: { display: string; value: string }) => {
    // Ensure we always send 24-hour format (HH:MM)
    const normalizedValue = normalizeValue(option.value);

    console.log('[TimePicker] Selected:', {
      display: option.display,
      originalValue: option.value,
      normalizedValue,
      willSend: normalizedValue
    });
    onChange(normalizedValue);
    setSearchTerm('');
    setOpen(false);
    inputRef.current?.blur();
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  // Clear search term when popover closes
  React.useEffect(() => {
    if (!open) {
      setSearchTerm('');
    }
  }, [open]);

  // Debug: Log value changes
  React.useEffect(() => {
    if (value) {
      const isTimestamp = value.includes(' ') || value.includes('T');
      console.log('[TimePicker] Value received:', {
        rawValue: value,
        isTimestamp,
        normalizedValue,
        displayValue,
        isValid24Hour: normalizedValue.match(/^\d{2}:\d{2}$/) !== null
      });
    }
  }, [value, normalizedValue, displayValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm || displayValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            disabled={disabled}
            className={cn('pl-10', className)}
            autoComplete="off"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[200px] p-0"
        align="start"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <ScrollArea className="h-[300px]">
          <div className="p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={cn(
                    'w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors',
                    option.value === value && 'bg-accent text-accent-foreground'
                  )}
                >
                  {option.display}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                No times found
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
