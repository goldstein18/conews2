'use client';

import { UseFormReturn } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { TimePicker } from '@/components/ui/time-picker';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { EventDetailsFormData } from '../../lib/validations';

interface SingleEventDateProps {
  form: UseFormReturn<EventDetailsFormData>;
}

export function SingleEventDate({ form }: SingleEventDateProps) {
  // Helper function to create date without timezone issues
  const createLocalDate = (dateString: string) => {
    if (!dateString) return undefined;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Start Date */}
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="flex items-center space-x-1">
              <span>Start Date</span>
              <span className="text-red-500">*</span>
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value ? (
                      format(createLocalDate(field.value) || new Date(), 'dd/MM/yyyy')
                    ) : (
                      <span>dd/mm/yyyy</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? createLocalDate(field.value) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(format(date, 'yyyy-MM-dd'));
                    }
                  }}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Start Time */}
      <FormField
        control={form.control}
        name="startTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center space-x-1">
              <span>Start Time</span>
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <TimePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Start Time"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* End Time */}
      <FormField
        control={form.control}
        name="endTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center space-x-1">
                <span>End Time (Optional)</span>
            </FormLabel>
            <FormControl>
              <TimePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="End Time (Optional)"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}