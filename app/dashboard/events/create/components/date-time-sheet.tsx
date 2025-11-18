'use client';

import { useState, useEffect } from 'react';
import { format, addMonths } from 'date-fns';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { useRecurringDatesStore, RecurringDate, TimeSlot } from '@/store/recurring-dates-store';
import { TimeSlotManager } from './time-slot-manager';
import { InlineDatePicker } from './inline-date-picker';
import { WeekDaySelector } from './week-day-selector';
import { MonthlyOccurrenceSelector } from './monthly-occurrence-selector';
import { generateRecurringDatesBetween, generateMonthlyDates, isValidMonthlyEndDate, getMonthlyOccurrenceOptions } from '../../lib/date-utils';
import { useMutation } from '@apollo/client';
import { AUTO_SAVE_EVENT } from '@/lib/graphql/events';
import { useAutoSave } from '@/store/event-draft-store';

interface DateTimeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

const REPEAT_OPTIONS = [
  { value: 'once', label: 'Once' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
] as const;

export function DateTimeSheet({ isOpen, onClose, eventId }: DateTimeSheetProps) {
  const {
    selectedDate,
    editingDateId,
    addRecurringDate,
    updateRecurringDate,
    getRecurringDateById
  } = useRecurringDatesStore();
  
  // Enhanced autosave with centralized system
  const [autoSaveEventMutation] = useMutation(AUTO_SAVE_EVENT);
  const { scheduleSmartAutoSave, updateFieldValue } = useAutoSave();

  const [formData, setFormData] = useState({
    date: selectedDate || format(new Date(), 'yyyy-MM-dd'),
    repeats: 'once' as 'once' | 'daily' | 'weekly' | 'monthly',
    endDate: '',
    weekDays: [] as number[], // 0=Sunday, 1=Monday, ... 6=Saturday
    monthlyOccurrence: 'day' as 'day' | 'weekday',
    monthlyDay: 1, // Day of the month (1-31)
    monthlyWeekPosition: 1, // 1-5 for first, second, etc.
    monthlyWeekDay: 1 // 0-6 for Sunday-Saturday
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [timeMode, setTimeMode] = useState<'single' | 'multiple'>('single');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form when editing
  useEffect(() => {
    if (editingDateId) {
      const existingDate = getRecurringDateById(editingDateId);
      if (existingDate) {
        setFormData({
          date: existingDate.date,
          repeats: existingDate.repeats,
          endDate: '',
          weekDays: [],
          monthlyOccurrence: 'day',
          monthlyDay: 1,
          monthlyWeekPosition: 1,
          monthlyWeekDay: 1
        });
        setTimeSlots(existingDate.timeSlots);
        setTimeMode(existingDate.timeSlots.length > 1 ? 'multiple' : 'single');
      }
    } else if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
  }, [editingDateId, selectedDate, getRecurringDateById]);

  // Reset form when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        repeats: 'once',
        endDate: '',
        weekDays: [],
        monthlyOccurrence: 'day',
        monthlyDay: 1,
        monthlyWeekPosition: 1,
        monthlyWeekDay: 1
      });
      setTimeSlots([]);
      setTimeMode('single');
      setErrors({});
    }
  }, [isOpen]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate date
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      // Parse the date as local time to avoid timezone issues
      const [year, month, day] = formData.date.split('-').map(Number);
      const selectedDateTime = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDateTime < today) {
        newErrors.date = 'Cannot select past dates';
      }
    }

    // Validate end date for recurring patterns
    if (formData.repeats !== 'once') {
      if (!formData.endDate) {
        newErrors.endDate = 'End date is required for recurring events';
      } else {
        // Parse dates as local time
        const [startYear, startMonth, startDay] = formData.date.split('-').map(Number);
        const [endYear, endMonth, endDay] = formData.endDate.split('-').map(Number);
        const startDateTime = new Date(startYear, startMonth - 1, startDay);
        const endDateTime = new Date(endYear, endMonth - 1, endDay);
        
        if (endDateTime <= startDateTime) {
          newErrors.endDate = 'End date must be after start date';
        }
      }
    }

    // Validate week days for weekly pattern
    if (formData.repeats === 'weekly') {
      if (formData.weekDays.length === 0) {
        newErrors.weekDays = 'Please select at least one day of the week';
      }
    }

    // Validate monthly occurrence
    if (formData.repeats === 'monthly') {
      if (!formData.monthlyOccurrence) {
        newErrors.monthlyOccurrence = 'Please select a monthly occurrence pattern';
      }
    }

    // Validate time slots
    if (timeSlots.length === 0) {
      newErrors.timeSlots = 'At least one time slot is required';
    } else {
      // Validate each time slot
      for (let i = 0; i < timeSlots.length; i++) {
        const slot = timeSlots[i];
        if (!slot.startTime || !slot.endTime) {
          newErrors.timeSlots = 'All time slots must have start and end times';
          break;
        }
        if (slot.startTime >= slot.endTime) {
          newErrors.timeSlots = 'End time must be after start time';
          break;
        }
      }

      // Check for overlapping time slots
      if (timeSlots.length > 1) {
        const sortedSlots = [...timeSlots].sort((a, b) => 
          a.startTime.localeCompare(b.startTime)
        );
        
        for (let i = 0; i < sortedSlots.length - 1; i++) {
          const current = sortedSlots[i];
          const next = sortedSlots[i + 1];
          
          if (current.endTime > next.startTime) {
            newErrors.timeSlots = 'Time slots cannot overlap';
            break;
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    if (editingDateId) {
      // For editing, just update the single date
      const recurringDate: RecurringDate = {
        id: editingDateId,
        date: formData.date,
        repeats: formData.repeats,
        timeSlots: timeSlots
      };
      updateRecurringDate(editingDateId, recurringDate);
    } else {
      // For new dates, handle recurring patterns
      if (formData.repeats === 'once') {
        // Single date
        const recurringDate: RecurringDate = {
          id: generateId(),
          date: formData.date,
          repeats: formData.repeats,
          timeSlots: timeSlots
        };
        addRecurringDate(recurringDate);
      } else {
        // Generate multiple dates for recurring patterns
        let generatedDates: string[];
        
        if (formData.repeats === 'monthly') {
          generatedDates = generateMonthlyDates(
            formData.date,
            formData.endDate,
            formData.monthlyOccurrence,
            formData.monthlyDay,
            formData.monthlyWeekPosition,
            formData.monthlyWeekDay
          );
        } else {
          generatedDates = generateRecurringDatesBetween(
            formData.date,
            formData.endDate,
            formData.repeats,
            formData.weekDays.length > 0 ? formData.weekDays : undefined
          );
        }

        // Create a recurring date entry for each generated date
        generatedDates.forEach(dateString => {
          const recurringDate: RecurringDate = {
            id: generateId(),
            date: dateString,
            repeats: formData.repeats === 'monthly' || formData.repeats === 'weekly' || formData.repeats === 'daily' 
              ? formData.repeats 
              : 'once', // Preserve the pattern type for generated dates
            timeSlots: [...timeSlots] // Copy time slots to each date
          };
          addRecurringDate(recurringDate);
        });
      }
    }

    // Enhanced autosave using centralized smart batching system
    // Use small setTimeout to ensure store state is updated first, then trigger smart autosave
    setTimeout(() => {
      const currentRecurringDates = useRecurringDatesStore.getState().recurringDates;
      
      // Update the recurring dates field with high priority for fast saving
      updateFieldValue('recurringDates', currentRecurringDates, {
        type: 'complex',
        debounceMs: 300, // Very fast for date sheet changes
        priority: 1 // Highest priority
      });
      
      // Schedule smart autosave with immediate execution
      scheduleSmartAutoSave(async (changedFields) => {
        try {
          await autoSaveEventMutation({
            variables: {
              eventId: eventId,
              data: {
                eventType: 'RECURRING',
                ...changedFields
              }
            }
          });
        } catch (error) {
          console.error('DateTimeSheet: Smart autosave failed:', error);
          throw error;
        }
      });
    }, 50); // Reduced delay for faster responsiveness

    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleStartDateChange = (dateString: string) => {
    setFormData(prev => ({ ...prev, date: dateString }));
    setErrors(prev => ({ ...prev, date: '' }));
    
    // For weekly mode, auto-select the day of the week
    if (formData.repeats === 'weekly') {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      setFormData(prev => ({ ...prev, weekDays: [dayOfWeek] }));
    }
    
    // Clear end date if it's before the new start date
    if (formData.endDate && dateString > formData.endDate) {
      setFormData(prev => ({ ...prev, endDate: '' }));
      setErrors(prev => ({ ...prev, endDate: '' }));
    }
  };

  const handleEndDateChange = (dateString: string) => {
    setFormData(prev => ({ ...prev, endDate: dateString }));
    setErrors(prev => ({ ...prev, endDate: '' }));
  };

  const handleWeekDaysChange = (weekDays: number[]) => {
    setFormData(prev => ({ ...prev, weekDays }));
    setErrors(prev => ({ ...prev, weekDays: '' }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <div className="absolute right-4 top-4 z-50">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <SheetHeader className="pb-6">
          <SheetTitle className="text-lg font-semibold">
            Add dates and times
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Date Section */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Date</h3>
            
            {/* Start Date */}
            <InlineDatePicker
              label="Start date"
              value={formData.date}
              onChange={handleStartDateChange}
              error={errors.date}
              required
              placeholder="Select date"
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />

            {/* Repeats */}
            <div className="space-y-2">
              <Label htmlFor="repeats">
                Repeats <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.repeats}
                onValueChange={(value: 'once' | 'daily' | 'weekly' | 'monthly') => {
                  setFormData(prev => {
                    const updates: Partial<typeof prev> = { repeats: value };
                    
                    // Auto-set end date to 3 months for monthly pattern
                    if (value === 'monthly' && prev.date) {
                      const [year, month, day] = prev.date.split('-').map(Number);
                      const startDate = new Date(year, month - 1, day);
                      const endDate = addMonths(startDate, 3);
                      updates.endDate = format(endDate, 'yyyy-MM-dd');
                      
                      // Auto-detect and set monthly occurrence pattern
                      const monthlyOptions = getMonthlyOccurrenceOptions(prev.date);
                      updates.monthlyOccurrence = 'day'; // Default to day pattern
                      updates.monthlyDay = monthlyOptions.dayOption.dayOfMonth;
                      updates.monthlyWeekPosition = monthlyOptions.weekdayOption.weekPosition;
                      updates.monthlyWeekDay = monthlyOptions.weekdayOption.dayOfWeek;
                    }
                    
                    return { ...prev, ...updates };
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select repeat pattern" />
                </SelectTrigger>
                <SelectContent>
                  {REPEAT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Week Day Selector - Show only for weekly pattern */}
            {formData.repeats === 'weekly' && (
              <div>
                <WeekDaySelector
                  selectedDays={formData.weekDays}
                  onChange={handleWeekDaysChange}
                  startDate={formData.date}
                />
                {errors.weekDays && (
                  <p className="text-sm text-red-500 mt-2">{errors.weekDays}</p>
                )}
              </div>
            )}

            {/* Monthly Occurrence Selector - Show only for monthly pattern */}
            {formData.repeats === 'monthly' && (
              <div>
                <MonthlyOccurrenceSelector
                  startDate={formData.date}
                  selectedOccurrence={formData.monthlyOccurrence}
                  onOccurrenceChange={(occurrence, data) => {
                    setFormData(prev => ({
                      ...prev,
                      monthlyOccurrence: occurrence,
                      monthlyDay: data.dayOfMonth || prev.monthlyDay,
                      monthlyWeekPosition: data.weekPosition || prev.monthlyWeekPosition,
                      monthlyWeekDay: data.dayOfWeek || prev.monthlyWeekDay
                    }));
                  }}
                  error={errors.monthlyOccurrence}
                />
              </div>
            )}

            {/* End Date - Show only for recurring patterns */}
            {formData.repeats !== 'once' && (
              <InlineDatePicker
                label="End date"
                value={formData.endDate}
                onChange={handleEndDateChange}
                error={errors.endDate}
                required
                placeholder="Select end date"
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  
                  // Basic date validation (must be after start date and not in the past)
                  if (formData.date) {
                    const [startYear, startMonth, startDay] = formData.date.split('-').map(Number);
                    const startDate = new Date(startYear, startMonth - 1, startDay);
                    startDate.setHours(0, 0, 0, 0);
                    if (date < startDate) return true;
                  } else if (date < today) {
                    return true;
                  }
                  
                  // Monthly pattern validation - only allow dates that match the pattern
                  if (formData.repeats === 'monthly') {
                    return !isValidMonthlyEndDate(
                      date,
                      formData.monthlyOccurrence,
                      formData.monthlyDay,
                      formData.monthlyWeekPosition,
                      formData.monthlyWeekDay
                    );
                  }
                  
                  return false;
                }}
                allowedWeekDays={formData.repeats === 'weekly' ? formData.weekDays : undefined}
                defaultMonth={formData.date ? (() => {
                  const [year, month] = formData.date.split('-').map(Number);
                  return new Date(year, month - 1);
                })() : undefined}
              />
            )}
          </div>

          {/* Time Section */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Time</h3>
            
            <TimeSlotManager
              timeSlots={timeSlots}
              onTimeSlotsChange={setTimeSlots}
              mode={timeMode}
              onModeChange={setTimeMode}
            />
            
            {errors.timeSlots && (
              <p className="text-sm text-red-500">{errors.timeSlots}</p>
            )}
          </div>
        </div>

        <SheetFooter className="pt-6 mt-6 border-t">
          <div className="flex space-x-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Save
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}