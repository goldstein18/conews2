import { format, addDays, addWeeks, addMonths, parse, isBefore, isAfter, startOfDay } from 'date-fns';
import { TimeSlot } from '@/store/recurring-dates-store';

/**
 * Parse a date string as local time to avoid timezone issues
 */
const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
};

/**
 * Format a date string to display format
 * Handles timezone issues by treating the input as a local date
 */
export const formatDisplayDate = (dateString: string): string => {
  try {
    const date = parseLocalDate(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
};

/**
 * Format a date string to short format for UI
 */
export const formatShortDate = (dateString: string): string => {
  try {
    const date = parseLocalDate(dateString);
    return format(date, 'MM/dd');
  } catch {
    return dateString;
  }
};

/**
 * Format a date to calendar day format
 */
export const formatCalendarDay = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Get the day of week abbreviation
 */
export const getDayAbbreviation = (dateString: string): string => {
  try {
    const date = parseLocalDate(dateString);
    return format(date, 'EEE').toUpperCase();
  } catch {
    return '';
  }
};

/**
 * Get the day number
 */
export const getDayNumber = (dateString: string): string => {
  try {
    const date = parseLocalDate(dateString);
    return format(date, 'dd');
  } catch {
    return '';
  }
};

/**
 * Check if a date is in the past
 */
export const isPastDate = (dateString: string): boolean => {
  try {
    const date = parseLocalDate(dateString);
    const today = startOfDay(new Date());
    return isBefore(startOfDay(date), today);
  } catch {
    return false;
  }
};

/**
 * Check if a date is today
 */
export const isToday = (dateString: string): boolean => {
  try {
    const date = parseLocalDate(dateString);
    const today = new Date();
    return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  } catch {
    return false;
  }
};

/**
 * Generate time slots with a given interval
 */
export const generateTimeSlots = (
  startTime: string, 
  endTime: string, 
  intervalMinutes: number = 60
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  try {
    const start = parse(startTime, 'HH:mm', new Date());
    const end = parse(endTime, 'HH:mm', new Date());
    
    let current = start;
    let slotNumber = 1;
    
    while (isBefore(current, end)) {
      const nextSlot = addDays(current, 0);
      nextSlot.setMinutes(current.getMinutes() + intervalMinutes);
      
      if (isAfter(nextSlot, end)) break;
      
      const duration = calculateDuration(
        format(current, 'HH:mm'),
        format(nextSlot, 'HH:mm')
      );
      
      slots.push({
        id: `slot-${slotNumber}`,
        startTime: format(current, 'HH:mm'),
        endTime: format(nextSlot, 'HH:mm'),
        duration
      });
      
      current = nextSlot;
      slotNumber++;
    }
  } catch (error) {
    console.error('Error generating time slots:', error);
  }
  
  return slots;
};

/**
 * Calculate duration between two times
 */
export const calculateDuration = (startTime: string, endTime: string): string => {
  if (!startTime || !endTime) return '';
  
  try {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    
    // Handle next day scenario
    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60;
    }
    
    const diffMinutes = endMinutes - startMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  } catch (error) {
    console.error('Error calculating duration:', error);
    return '';
  }
};

/**
 * Format time to 12-hour format with AM/PM
 */
export const formatTime12Hour = (time24: string): string => {
  try {
    const [hours, minutes] = time24.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return format(date, 'h:mm a');
  } catch {
    return time24;
  }
};

/**
 * Format time to 24-hour format
 */
export const formatTime24Hour = (time: string): string => {
  try {
    // If already in 24-hour format, return as is
    if (/^\d{2}:\d{2}$/.test(time)) {
      return time;
    }
    
    // Parse 12-hour format
    const parsed = parse(time, 'h:mm a', new Date());
    return format(parsed, 'HH:mm');
  } catch {
    return time;
  }
};

/**
 * Validate time slot overlap
 */
export const hasTimeSlotOverlap = (timeSlots: TimeSlot[]): boolean => {
  if (timeSlots.length < 2) return false;
  
  const sortedSlots = [...timeSlots].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );
  
  for (let i = 0; i < sortedSlots.length - 1; i++) {
    const current = sortedSlots[i];
    const next = sortedSlots[i + 1];
    
    if (current.endTime > next.startTime) {
      return true;
    }
  }
  
  return false;
};

/**
 * Get month name for calendar header
 */
export const getMonthName = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

/**
 * Get days of the week for calendar header
 */
export const getDaysOfWeek = (): string[] => {
  return ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
};

/**
 * Generate calendar dates for a given month
 */
export const generateCalendarDates = (month: Date): Date[] => {
  const dates: Date[] = [];
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  
  // Get the first day of the week for the first day of the month
  const startDay = startOfMonth.getDay();
  const adjustedStartDay = startDay === 0 ? 7 : startDay; // Make Sunday = 7
  
  // Add previous month's trailing days
  for (let i = adjustedStartDay - 1; i > 0; i--) {
    const date = new Date(startOfMonth);
    date.setDate(startOfMonth.getDate() - i);
    dates.push(date);
  }
  
  // Add current month's days
  for (let day = 1; day <= endOfMonth.getDate(); day++) {
    dates.push(new Date(month.getFullYear(), month.getMonth(), day));
  }
  
  // Add next month's leading days to complete the grid
  const remainingSlots = 42 - dates.length; // 6 weeks × 7 days
  for (let day = 1; day <= remainingSlots; day++) {
    dates.push(new Date(month.getFullYear(), month.getMonth() + 1, day));
  }
  
  return dates;
};

/**
 * Check if a date belongs to the current month being displayed
 */
export const isCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return date.getMonth() === currentMonth.getMonth() && 
         date.getFullYear() === currentMonth.getFullYear();
};

/**
 * Convert recurring pattern to human readable text
 */
export const getRecurrenceText = (pattern: string): string => {
  switch (pattern.toLowerCase()) {
    case 'once':
      return 'No repeat';
    case 'daily':
      return 'Every day';
    case 'weekly':
      return 'Every week';
    case 'monthly':
      return 'Every month';
    default:
      return 'Custom pattern';
  }
};

/**
 * Generate weekly recurring dates based on selected days of the week
 */
export const generateWeeklyDates = (
  startDate: string,
  endDate: string,
  weekDays: number[]
): string[] => {
  const dates: string[] = [];
  
  try {
    // Parse dates as local time
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
    const startDateTime = new Date(startYear, startMonth - 1, startDay);
    const endDateTime = new Date(endYear, endMonth - 1, endDay);
    
    // Get the start of the week for the start date
    const startOfWeek = new Date(startDateTime);
    startOfWeek.setDate(startDateTime.getDate() - startDateTime.getDay());
    
    let currentWeek = new Date(startOfWeek);
    
    // Generate all dates for each week until we pass the end date
    while (currentWeek <= endDateTime) {
      // Check each day of the week
      for (const dayOfWeek of weekDays) {
        const currentDate = new Date(currentWeek);
        currentDate.setDate(currentWeek.getDate() + dayOfWeek);
        
        // Only add if the date is within our range
        if (currentDate >= startDateTime && currentDate <= endDateTime) {
          dates.push(formatCalendarDay(currentDate));
        }
      }
      
      // Move to next week
      currentWeek = addWeeks(currentWeek, 1);
    }
    
    // Sort dates chronologically
    dates.sort();
  } catch (error) {
    console.error('Error generating weekly dates:', error);
  }
  
  return dates;
};

/**
 * Generate recurring dates between start and end date based on pattern
 */
export const generateRecurringDatesBetween = (
  startDate: string,
  endDate: string,
  pattern: 'daily' | 'weekly' | 'monthly',
  weekDays?: number[]
): string[] => {
  // For weekly pattern with specific days, use the specialized function
  if (pattern === 'weekly' && weekDays && weekDays.length > 0) {
    return generateWeeklyDates(startDate, endDate, weekDays);
  }
  
  const dates: string[] = [];
  
  try {
    // Parse dates as local time
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
    let currentDate = new Date(startYear, startMonth - 1, startDay);
    const endDateTime = new Date(endYear, endMonth - 1, endDay);
    
    // Add start date
    dates.push(formatCalendarDay(currentDate));
    
    // Generate dates until we reach or exceed end date
    while (currentDate < endDateTime) {
      switch (pattern) {
        case 'daily':
          currentDate = addDays(currentDate, 1);
          break;
        case 'weekly':
          currentDate = addWeeks(currentDate, 1);
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, 1);
          break;
      }
      
      // Only add if it's not past the end date
      if (currentDate <= endDateTime) {
        dates.push(formatCalendarDay(currentDate));
      }
    }
  } catch (error) {
    console.error('Error generating recurring dates between dates:', error);
  }
  
  return dates;
};

/**
 * Generate recurring dates based on pattern (original function for backward compatibility)
 */
export const generateRecurringDates = (
  startDate: string,
  pattern: 'daily' | 'weekly' | 'monthly',
  count: number = 10
): string[] => {
  const dates: string[] = [];
  
  try {
    let currentDate = new Date(startDate);
    dates.push(formatCalendarDay(currentDate));
    
    for (let i = 1; i < count; i++) {
      switch (pattern) {
        case 'daily':
          currentDate = addDays(currentDate, 1);
          break;
        case 'weekly':
          currentDate = addWeeks(currentDate, 1);
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, 1);
          break;
      }
      dates.push(formatCalendarDay(currentDate));
    }
  } catch (error) {
    console.error('Error generating recurring dates:', error);
  }
  
  return dates;
};

/**
 * Get the ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
export const getOrdinalSuffix = (num: number): string => {
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${num}th`;
  }
  
  switch (lastDigit) {
    case 1: return `${num}st`;
    case 2: return `${num}nd`;
    case 3: return `${num}rd`;
    default: return `${num}th`;
  }
};

/**
 * Get the position of a date within its month (1st, 2nd, 3rd, 4th, 5th week)
 */
export const getWeekPositionInMonth = (date: Date): number => {
  const dayOfMonth = date.getDate();
  return Math.ceil(dayOfMonth / 7);
};

/**
 * Get the name of a day of the week
 */
export const getDayOfWeekName = (dayNumber: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber] || '';
};

/**
 * Get the ordinal position name (first, second, third, etc.)
 */
export const getOrdinalPositionName = (position: number): string => {
  const positions = ['', 'first', 'second', 'third', 'fourth', 'fifth'];
  return positions[position] || `${position}th`;
};

/**
 * Generate monthly occurrence options based on a date
 */
export const getMonthlyOccurrenceOptions = (dateString: string) => {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    const dayOfMonth = date.getDate();
    const dayOfWeek = date.getDay();
    const weekPosition = getWeekPositionInMonth(date);
    
    return {
      dayOption: {
        value: 'day',
        label: `On the ${getOrdinalSuffix(dayOfMonth)}`,
        dayOfMonth: dayOfMonth
      },
      weekdayOption: {
        value: 'weekday',
        label: `On the ${getOrdinalPositionName(weekPosition)} ${getDayOfWeekName(dayOfWeek)}`,
        weekPosition: weekPosition,
        dayOfWeek: dayOfWeek
      }
    };
  } catch (error) {
    console.error('Error generating monthly options:', error);
    return {
      dayOption: { value: 'day', label: 'On the 1st', dayOfMonth: 1 },
      weekdayOption: { value: 'weekday', label: 'On the first Monday', weekPosition: 1, dayOfWeek: 1 }
    };
  }
};

/**
 * Generate monthly recurring dates based on pattern
 */
export const generateMonthlyDates = (
  startDate: string,
  endDate: string,
  pattern: 'day' | 'weekday',
  dayOfMonth?: number,
  weekPosition?: number,
  dayOfWeek?: number
): string[] => {
  const dates: string[] = [];
  
  try {
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
    const startDateTime = new Date(startYear, startMonth - 1, startDay);
    const endDateTime = new Date(endYear, endMonth - 1, endDay);
    
    let currentDate = new Date(startDateTime);
    
    // Add the start date
    dates.push(formatCalendarDay(currentDate));
    
    // Generate dates for each subsequent month
    while (true) {
      // Move to next month
      currentDate = addMonths(currentDate, 1);
      
      if (pattern === 'day' && dayOfMonth) {
        // Generate for specific day of month
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayOfMonth);
        
        // Handle months that don't have enough days (e.g., Feb 30th -> Feb 28th/29th)
        if (targetDate.getMonth() !== currentDate.getMonth()) {
          // Day doesn't exist in this month, use the last day of the month
          const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
          targetDate.setDate(lastDayOfMonth.getDate());
        }
        
        if (targetDate <= endDateTime) {
          dates.push(formatCalendarDay(targetDate));
        } else {
          break;
        }
      } else if (pattern === 'weekday' && weekPosition && typeof dayOfWeek === 'number') {
        // Generate for specific week position and day of week
        const targetDate = getNthWeekdayOfMonth(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          dayOfWeek,
          weekPosition
        );
        
        if (targetDate && targetDate <= endDateTime) {
          dates.push(formatCalendarDay(targetDate));
        } else {
          break;
        }
      }
    }
  } catch (error) {
    console.error('Error generating monthly dates:', error);
  }
  
  return dates;
};

/**
 * Get the Nth weekday of a specific month (e.g., 1st Tuesday, 3rd Friday)
 */
export const getNthWeekdayOfMonth = (
  year: number,
  month: number,
  dayOfWeek: number,
  weekPosition: number
): Date | null => {
  try {
    // Start from the first day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate the date of the first occurrence of the target day
    let targetDay = 1 + ((dayOfWeek - firstDayOfWeek + 7) % 7);
    
    // Add weeks to get to the desired position
    targetDay += (weekPosition - 1) * 7;
    
    // Check if the date exists in this month
    const targetDate = new Date(year, month, targetDay);
    if (targetDate.getMonth() !== month) {
      return null; // Date doesn't exist (e.g., 5th Friday when there are only 4)
    }
    
    return targetDate;
  } catch (error) {
    console.error('Error getting nth weekday:', error);
    return null;
  }
};

/**
 * Check if a date matches the monthly pattern for end date selection
 */
export const isValidMonthlyEndDate = (
  date: Date,
  pattern: 'day' | 'weekday',
  dayOfMonth?: number,
  weekPosition?: number,
  dayOfWeek?: number
): boolean => {
  try {
    if (pattern === 'day' && dayOfMonth) {
      // For day pattern, check if it's the same day of month
      return date.getDate() === dayOfMonth;
    } else if (pattern === 'weekday' && weekPosition && typeof dayOfWeek === 'number') {
      // For weekday pattern, check if it matches the position and day of week
      const actualDayOfWeek = date.getDay();
      const actualWeekPosition = getWeekPositionInMonth(date);
      
      return actualDayOfWeek === dayOfWeek && actualWeekPosition === weekPosition;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking valid monthly end date:', error);
    return false;
  }
};