'use client';

import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRecurringDatesStore } from '@/store/recurring-dates-store';
import { DateTimeSheet } from './date-time-sheet';
import {
  formatCalendarDay,
  getMonthName,
  getDaysOfWeek,
  generateCalendarDates,
  isCurrentMonth,
  formatDisplayDate,
  getDayAbbreviation,
  getDayNumber,
  formatTime12Hour,
  getRecurrenceText
} from '../../lib/date-utils';

interface RecurringCalendarSelectorProps {
  eventId?: string;
}

export function RecurringCalendarSelector({ eventId }: RecurringCalendarSelectorProps) {
  const {
    recurringDates,
    currentMonth,
    isSheetOpen,
    navigateMonth,
    openSheet,
    closeSheet,
    removeRecurringDate,
    hasDateSelected
  } = useRecurringDatesStore();

  // Debug logging for recurring dates
  useEffect(() => {
  }, [recurringDates]);

  // Clean up store on unmount
  useEffect(() => {
    return () => {
      // Don't reset on unmount to preserve data when navigating between steps
    };
  }, []);

  const calendarDates = generateCalendarDates(currentMonth);
  const daysOfWeek = getDaysOfWeek();

  const handleDateClick = (date: Date) => {
    const dateString = formatCalendarDay(date);
    
    // Only allow future dates and current month dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today || !isCurrentMonth(date, currentMonth)) {
      return;
    }

    // Check if date already exists - if so, edit it
    const existingDate = recurringDates.find(rd => rd.date === dateString);
    if (existingDate) {
      openSheet(dateString, existingDate.id);
    } else {
      openSheet(dateString);
    }
  };

  const handleAddDateClick = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = formatCalendarDay(tomorrow);
    openSheet(dateString);
  };

  const handleEditDate = (dateId: string) => {
    const date = recurringDates.find(rd => rd.id === dateId);
    if (date) {
      openSheet(date.date, dateId);
    }
  };

  const handleDeleteDate = (dateId: string) => {
    
    removeRecurringDate(dateId);
    
    // The autosave will be handled by the main form's useEffect that watches recurringDatesFromStore
    setTimeout(() => {
      // This timeout ensures state is updated
    }, 100);
  };

  const getDayClasses = (date: Date) => {
    const baseClasses = "h-10 w-10 flex items-center justify-center text-sm cursor-pointer rounded-full transition-colors";
    const dateString = formatCalendarDay(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isPast = date < today;
    const isToday = formatCalendarDay(date) === formatCalendarDay(today);
    const isSelected = hasDateSelected(dateString);
    const isCurrentMonthDate = isCurrentMonth(date, currentMonth);
    
    if (isPast || !isCurrentMonthDate) {
      return `${baseClasses} text-gray-300 cursor-not-allowed`;
    }
    
    if (isSelected) {
      return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
    }
    
    if (isToday) {
      return `${baseClasses} bg-gray-200 text-gray-900 hover:bg-gray-300`;
    }
    
    return `${baseClasses} text-gray-700 hover:bg-gray-100`;
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Manage dates and times
        </h2>
        <p className="text-gray-600">
          Start by adding the dates and time slots for your recurring event.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div className="space-y-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h3 className="text-lg font-semibold">
              {getMonthName(currentMonth)}
            </h3>
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('next')}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="h-8 flex items-center justify-center text-sm font-medium text-gray-500"
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendarDates.map((date, index) => (
                  <div
                    key={index}
                    className={getDayClasses(date)}
                    onClick={() => handleDateClick(date)}
                  >
                    {date.getDate()}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Date Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed text-blue-600 border-blue-300 hover:bg-blue-50"
            onClick={handleAddDateClick}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add a date
          </Button>
        </div>

        {/* Selected Dates Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Selected Dates</h3>
          
          {recurringDates.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-gray-400 mb-2">
                  <Clock className="h-8 w-8 mx-auto" />
                </div>
                <p className="text-gray-600">No dates selected yet</p>
                <p className="text-sm text-gray-500">
                  Click on a date in the calendar to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            <div 
              className={`space-y-3 ${
                recurringDates.length > 5 
                  ? 'max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100' 
                  : ''
              }`}
            >
              {recurringDates
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((recurringDate) => (
                  <Card key={recurringDate.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Date Header */}
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="text-center">
                              <div className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                                {getDayAbbreviation(recurringDate.date)}
                              </div>
                              <div className="text-xl font-bold text-gray-900">
                                {getDayNumber(recurringDate.date)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {formatDisplayDate(recurringDate.date)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {getRecurrenceText(recurringDate.repeats)} • {recurringDate.timeSlots.length} time slot{recurringDate.timeSlots.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>

                          {/* Time Slots */}
                          <div className="space-y-1">
                            {recurringDate.timeSlots.map((slot) => (
                              <div key={slot.id} className="flex items-center space-x-2 text-sm">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-700">
                                  {formatTime12Hour(slot.startTime)} - {formatTime12Hour(slot.endTime)}
                                </span>
                                <span className="text-gray-500">({slot.duration})</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1 ml-4">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDate(recurringDate.id)}
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDate(recurringDate.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Date/Time Sheet Modal */}
      <DateTimeSheet
        isOpen={isSheetOpen}
        onClose={closeSheet}
        eventId={eventId || ''}
      />
    </div>
  );
}