'use client';

import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { RecurringCalendarSelector } from './recurring-calendar-selector';
import { useRecurringDatesStore } from '@/store/recurring-dates-store';
import { EventDetailsFormData } from '../../lib/validations';

interface RecurringEventDateProps {
  form: UseFormReturn<EventDetailsFormData>;
  eventId?: string;
}

export function RecurringEventDate({ form, eventId }: RecurringEventDateProps) {
  const { recurringDates } = useRecurringDatesStore();

  // Sync recurring dates with form when they change
  useEffect(() => {
    if (recurringDates.length > 0) {
      // Convert recurring dates to form format
      const recurringDatesData = recurringDates.map(rd => ({
        date: rd.date,
        timeSlots: rd.timeSlots,
        repeats: rd.repeats
      }));
      
      // Update the form with the recurring dates data
      form.setValue('recurringDates' as keyof EventDetailsFormData, recurringDatesData);
      
      // Set a basic recurring pattern for validation compatibility
      if (!form.watch('recurringPattern')) {
        form.setValue('recurringPattern', 'custom');
      }
    } else {
      // Clear recurring dates from form when empty
      form.setValue('recurringDates' as keyof EventDetailsFormData, []);
    }
  }, [recurringDates, form]);

  return <RecurringCalendarSelector eventId={eventId} />;
}