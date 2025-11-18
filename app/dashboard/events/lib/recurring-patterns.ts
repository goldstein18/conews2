import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { RecurringDate, TimeSlot } from '@/store/recurring-dates-store';

/**
 * Types for API transformation
 */
export interface APITransformationResult {
  useEventDates: boolean;
  useRecurringPattern: boolean;
  useRRule: boolean;
  eventDates?: EventDate[];
  pattern?: 'daily' | 'weekly' | 'monthly';
  startDate?: string;
  endDate?: string;
  times?: {
    startTime: string;
    endTime: string;
  };
  rrule?: RRulePattern;
}

export interface EventDate {
  date: string;
  startTime: string;
  endTime: string;
}

export interface RRulePattern {
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  dtstart?: string;
  interval?: number;
  byweekday?: string[];
  bymonthday?: number[];
  until?: string;
  timezone?: string;
}

export interface TimeSlotConsistencyResult {
  isConsistent: boolean;
  hasMultipleSlots: boolean;
  commonTimeSlot?: TimeSlot;
  reason?: string;
}

/**
 * Parse a date string as local time to avoid timezone issues
 */
const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Generate a unique ID
 */
const generateId = (): string => Math.random().toString(36).substr(2, 9);

/**
 * Calculate duration between two time strings
 */
const calculateDuration = (startTime: string, endTime: string): string => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  const durationMinutes = endMinutes - startMinutes;
  
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
};

/**
 * Convert various date formats to YYYY-MM-DD string
 */
const formatDateFromBackend = (dateValue: unknown): string => {
  
  if (!dateValue) {
    console.warn('formatDateFromBackend: No date value provided');
    return '';
  }
  
  let date: Date;
  
  // Handle different input formats
  if (typeof dateValue === 'number') {
    // Timestamp
    date = new Date(dateValue);
  } else if (typeof dateValue === 'string') {
    // Check if it's a numeric string (timestamp)
    if (/^\d+$/.test(dateValue)) {
      const timestamp = parseInt(dateValue);
      date = new Date(timestamp);
    } else if (/^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
      // Date string like "2025-09-03" or "2025-09-03 00:00:00.000"
      // Parse as UTC to avoid timezone offset issues
      const datePart = dateValue.split(' ')[0]; // Get just the date part
      date = new Date(datePart + 'T00:00:00.000Z'); // Force UTC interpretation
    } else {
      // Regular date string
      date = new Date(dateValue);
    }
  } else {
    console.warn('formatDateFromBackend: Unknown date format:', dateValue);
    return '';
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.warn('formatDateFromBackend: Invalid date created from:', dateValue);
    return '';
  }
  
  // Additional validation for reasonable date ranges
  const year = date.getFullYear();
  if (year < 1970 || year > 2100) {
    console.warn('formatDateFromBackend: Date year out of reasonable range:', year, 'from:', dateValue);
    // Don't return empty, let it continue but log the warning
  }
  
  // Format as YYYY-MM-DD using UTC to avoid timezone offset issues
  // This ensures dates from DB like "2025-09-03 00:00:00.000" stay as "2025-09-03"
  const formatted = date.toISOString().split('T')[0];
  return formatted;
};

/**
 * Extract time from ISO datetime string
 */
const extractTimeFromISO = (isoString: string): string => {
  // Add defensive checks for invalid input
  if (!isoString || typeof isoString !== 'string') {
    console.warn('extractTimeFromISO: Invalid isoString provided:', isoString);
    return '00:00'; // Default fallback time
  }
  
  const date = new Date(isoString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.warn('extractTimeFromISO: Invalid date created from:', isoString);
    return '00:00'; // Default fallback time
  }
  
  return format(date, 'HH:mm');
};

/**
 * Check if all recurring dates have consistent time slots
 * For API transformation, we need:
 * 1. Each date should have exactly 1 time slot
 * 2. All time slots should be identical across dates
 */
export function checkTimeSlotsConsistency(dates: RecurringDate[]): TimeSlotConsistencyResult {
  if (!dates || dates.length === 0) {
    return { 
      isConsistent: false, 
      hasMultipleSlots: false,
      reason: 'No dates provided' 
    };
  }
  
  // Check if any date has multiple time slots
  const hasMultipleSlots = dates.some(date => date.timeSlots.length > 1);
  if (hasMultipleSlots) {
    return {
      isConsistent: false,
      hasMultipleSlots: true,
      reason: 'Some dates have multiple time slots'
    };
  }
  
  // Check if any date has no time slots
  const hasEmptySlots = dates.some(date => date.timeSlots.length === 0);
  if (hasEmptySlots) {
    return {
      isConsistent: false,
      hasMultipleSlots: false,
      reason: 'Some dates have no time slots'
    };
  }
  
  // Get the first time slot as reference
  const referenceSlot = dates[0].timeSlots[0];
  
  // Check if all time slots match the reference
  const allMatch = dates.every(date => {
    const slot = date.timeSlots[0];
    return slot.startTime === referenceSlot.startTime && 
           slot.endTime === referenceSlot.endTime;
  });
  
  return {
    isConsistent: allMatch,
    hasMultipleSlots: false,
    commonTimeSlot: allMatch ? referenceSlot : undefined,
    reason: allMatch ? 'All time slots are consistent' : 'Time slots vary between dates'
  };
}

/**
 * Detect the type of recurring pattern from dates
 */
export function detectRecurringPatternType(dates: RecurringDate[]): 'daily' | 'weekly' | 'monthly' | 'custom' {
  if (!dates || dates.length < 2) {
    return 'custom';
  }
  
  // First, check if dates have explicit pattern types (from pattern generation)
  const explicitPatterns = dates
    .map(d => d.repeats)
    .filter(pattern => pattern !== 'once');
  
  if (explicitPatterns.length > 0) {
    // Use the most common explicit pattern
    const patternCounts = explicitPatterns.reduce((acc, pattern) => {
      acc[pattern] = (acc[pattern] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommonPattern = Object.entries(patternCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    if (['daily', 'weekly', 'monthly'].includes(mostCommonPattern)) {
      return mostCommonPattern as 'daily' | 'weekly' | 'monthly';
    }
  }
  
  // Sort dates chronologically for pattern analysis
  const sortedDates = [...dates].sort((a, b) => a.date.localeCompare(b.date));
  const parsedDates = sortedDates.map(d => parseLocalDate(d.date));
  
  // Check for daily pattern (consecutive days)
  if (isDaily(parsedDates)) {
    return 'daily';
  }
  
  // Check for weekly pattern (same day of week, 7-day intervals)
  if (isWeekly(parsedDates)) {
    return 'weekly';
  }
  
  // Check for monthly pattern (same day of month or same weekday position)
  if (isMonthly(parsedDates)) {
    return 'monthly';
  }
  
  return 'custom';
}

/**
 * Check if dates follow a daily pattern (consecutive days)
 */
function isDaily(dates: Date[]): boolean {
  if (dates.length < 2) return false;
  
  for (let i = 1; i < dates.length; i++) {
    const prevDate = dates[i - 1];
    const currentDate = dates[i];
    const daysDiff = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Should be exactly 1 day apart
    if (daysDiff !== 1) {
      return false;
    }
  }
  
  return true;
}

/**
 * Check if dates follow a weekly pattern (same day of week, 7-day intervals)
 */
function isWeekly(dates: Date[]): boolean {
  if (dates.length < 2) return false;
  
  // Check if all dates are on the same day of the week
  const firstDayOfWeek = dates[0].getDay();
  const allSameWeekday = dates.every(date => date.getDay() === firstDayOfWeek);
  
  if (!allSameWeekday) {
    // Could be multiple weekdays, check if they follow a weekly pattern
    return isMultiWeekdayPattern(dates);
  }
  
  // Check if dates are exactly 7 days apart (or multiples of 7)
  for (let i = 1; i < dates.length; i++) {
    const prevDate = dates[i - 1];
    const currentDate = dates[i];
    const daysDiff = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Should be multiple of 7
    if (daysDiff % 7 !== 0) {
      return false;
    }
  }
  
  return true;
}

/**
 * Check if dates follow a pattern with multiple weekdays (e.g., every Monday and Wednesday)
 */
function isMultiWeekdayPattern(dates: Date[]): boolean {
  // Get unique weekdays
  const weekdays = [...new Set(dates.map(date => date.getDay()))].sort();
  
  if (weekdays.length > 5) return false; // Too many different weekdays
  
  // Group dates by week
  const weekGroups = new Map<string, Date[]>();
  
  dates.forEach(date => {
    // Get Monday of the week for this date
    const monday = new Date(date);
    const dayOfWeek = date.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 6 days from Monday
    monday.setDate(date.getDate() - daysFromMonday);
    
    const weekKey = format(monday, 'yyyy-MM-dd');
    
    if (!weekGroups.has(weekKey)) {
      weekGroups.set(weekKey, []);
    }
    weekGroups.get(weekKey)!.push(date);
  });
  
  // Check if each week has the same weekdays
  const weekGroupsArray = Array.from(weekGroups.values());
  if (weekGroupsArray.length < 2) return true; // Single week
  
  const firstWeekWeekdays = weekGroupsArray[0].map(d => d.getDay()).sort();
  
  return weekGroupsArray.every(weekDates => {
    const weekWeekdays = weekDates.map(d => d.getDay()).sort();
    return JSON.stringify(weekWeekdays) === JSON.stringify(firstWeekWeekdays);
  });
}

/**
 * Check if dates follow a monthly pattern
 */
function isMonthly(dates: Date[]): boolean {
  if (dates.length < 2) return false;
  
  // Check for same day of month pattern (e.g., 3rd of every month)
  if (isSameDayOfMonth(dates)) {
    return true;
  }
  
  // Check for same weekday position pattern (e.g., first Tuesday of every month)
  if (isSameWeekdayPosition(dates)) {
    return true;
  }
  
  return false;
}

/**
 * Check if all dates are on the same day of the month
 */
function isSameDayOfMonth(dates: Date[]): boolean {
  const firstDayOfMonth = dates[0].getDate();
  return dates.every(date => date.getDate() === firstDayOfMonth);
}

/**
 * Check if all dates are on the same weekday position within their month
 * (e.g., first Tuesday, second Friday, etc.)
 */
function isSameWeekdayPosition(dates: Date[]): boolean {
  const firstDate = dates[0];
  const firstWeekday = firstDate.getDay();
  const firstPosition = getWeekdayPositionInMonth(firstDate);
  
  return dates.every(date => {
    return date.getDay() === firstWeekday && 
           getWeekdayPositionInMonth(date) === firstPosition;
  });
}

/**
 * Get the position of a weekday within its month (1 = first, 2 = second, etc.)
 */
function getWeekdayPositionInMonth(date: Date): number {
  const dayOfMonth = date.getDate();
  return Math.ceil(dayOfMonth / 7);
}

/**
 * Main function to transform recurring dates from UI format to API format
 */
export function transformRecurringDatesToAPI(dates: RecurringDate[]): APITransformationResult {
  
  if (!dates || dates.length === 0) {
    return {
      useEventDates: false,
      useRecurringPattern: false,
      useRRule: false
    };
  }
  
  // Check time slot consistency
  const consistency = checkTimeSlotsConsistency(dates);
  
  // If time slots are not consistent or have multiple slots, use eventDates
  if (!consistency.isConsistent) {
    return {
      useEventDates: true,
      useRecurringPattern: false,
      useRRule: false,
      eventDates: convertToEventDates(dates)
    };
  }
  
  // If ALL dates are marked as "once" (manually added individual dates), use eventDates
  if (dates.every(d => d.repeats === 'once')) {
    return {
      useEventDates: true,
      useRecurringPattern: false,
      useRRule: false,
      eventDates: convertToEventDates(dates)
    };
  }
  
  // Detect pattern type
  const patternType = detectRecurringPatternType(dates);
  
  if (patternType === 'custom') {
    return {
      useEventDates: true,
      useRecurringPattern: false,
      useRRule: false,
      eventDates: convertToEventDates(dates)
    };
  }
  
  // Sort dates to get start and end
  const sortedDates = [...dates].sort((a, b) => a.date.localeCompare(b.date));
  const startDate = sortedDates[0].date;
  const endDate = sortedDates[sortedDates.length - 1].date;
  const commonTimeSlot = consistency.commonTimeSlot!;
  
  // Check if we need RRULE for complex patterns
  const needsRRuleResult = needsRRule(dates, patternType);
  
  if (needsRRuleResult) {
    const rrulePattern = generateRRulePattern(dates, patternType, startDate, endDate);
    
    return {
      useEventDates: false,
      useRecurringPattern: false,
      useRRule: true,
      rrule: rrulePattern,
      times: {
        startTime: commonTimeSlot.startTime,
        endTime: commonTimeSlot.endTime
      }
    };
  }
  
  // Use simple recurring pattern
  
  return {
    useEventDates: false,
    useRecurringPattern: true,
    useRRule: false,
    pattern: patternType,
    startDate,
    endDate,
    times: {
      startTime: commonTimeSlot.startTime,
      endTime: commonTimeSlot.endTime
    }
  };
}

/**
 * Convert recurring dates to eventDates format for API
 */
function convertToEventDates(dates: RecurringDate[]): EventDate[] {
  const eventDates: EventDate[] = [];

  dates.forEach(recurringDate => {
    recurringDate.timeSlots.forEach(timeSlot => {
      // Send times as strings (HH:MM format) - backend expects text format
      eventDates.push({
        date: recurringDate.date,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime
      });
    });
  });

  return eventDates.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Determine if pattern needs RRULE instead of simple recurring pattern
 */
function needsRRule(dates: RecurringDate[], patternType: 'daily' | 'weekly' | 'monthly' | 'custom'): boolean {
  if (patternType === 'custom') return false;
  
  const parsedDates = dates.map(d => parseLocalDate(d.date)).sort((a, b) => a.getTime() - b.getTime());
  
  switch (patternType) {
    case 'weekly':
      // Need RRULE if it's a multi-weekday pattern
      const weekdays = [...new Set(parsedDates.map(date => date.getDay()))];
      return weekdays.length > 1;
      
    case 'monthly':
      // For now, use simple pattern for monthly
      // Could be enhanced to detect complex monthly patterns
      return false;
      
    case 'daily':
      // Simple daily pattern should work fine
      return false;
      
    default:
      return false;
  }
}

/**
 * Generate RRULE pattern for complex recurring patterns
 */
function generateRRulePattern(
  dates: RecurringDate[], 
  patternType: 'daily' | 'weekly' | 'monthly' | 'custom',
  startDate: string,
  endDate: string
): RRulePattern {
  const parsedDates = dates.map(d => parseLocalDate(d.date)).sort((a, b) => a.getTime() - b.getTime());
  
  switch (patternType) {
    case 'weekly':
      const weekdays = [...new Set(parsedDates.map(date => date.getDay()))].sort();
      const weekdayNames = weekdays.map(day => {
        const names = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
        return names[day];
      });
      
      return {
        freq: 'WEEKLY',
        dtstart: startDate,
        byweekday: weekdayNames,
        until: endDate
      };
      
    case 'monthly':
      const firstDate = parsedDates[0];
      
      // Check if it's same day of month or same weekday position
      if (isSameDayOfMonth(parsedDates)) {
        return {
          freq: 'MONTHLY',
          dtstart: startDate,
          bymonthday: [firstDate.getDate()],
          until: endDate
        };
      } else {
        // Same weekday position (e.g., first Tuesday)
        const weekdayNames = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
        const weekdayName = weekdayNames[firstDate.getDay()];
        // const position = getWeekdayPositionInMonth(firstDate); // TODO: Use for bysetpos
        
        return {
          freq: 'MONTHLY',
          dtstart: startDate,
          byweekday: [weekdayName],
          // Note: bysetpos would be needed for "first Tuesday" but API might not support it
          // For now, use simple monthly pattern
          until: endDate
        };
      }
      
    default:
      return {
        freq: 'DAILY',
        dtstart: startDate,
        until: endDate
      };
  }
}

/**
 * Transform API data back to UI format (for loading existing events)
 */
export function expandAPIPatternToRecurringDates(apiData: Record<string, unknown>): RecurringDate[] {
  
  // Case 1: Data comes as eventDates array
  if (apiData.eventDates && Array.isArray(apiData.eventDates)) {
    const mappedResults = apiData.eventDates
      .filter((eventDate: Record<string, unknown>) => {
        // More strict filtering to avoid empty/invalid entries
        const hasValidDate = eventDate && eventDate.date && (
          typeof eventDate.date === 'string' || 
          typeof eventDate.date === 'number'
        );
        
        if (!hasValidDate) {
          return false;
        }
        
        // Also filter out entries where the date would be empty after formatting
        const formattedDate = formatDateFromBackend(eventDate.date);
        if (!formattedDate) {
          return false;
        }
        
        return true;
      })
      .map((eventDate: Record<string, unknown>): RecurringDate | null => {
        
        // Safe extraction of times with fallbacks
        const startTime = eventDate.startTime ? extractTimeFromISO(eventDate.startTime as string) : '09:00';
        const endTime = eventDate.endTime ? extractTimeFromISO(eventDate.endTime as string) : '10:00';
        
        // Skip entries with invalid time extraction (both times default to fallback)
        // BUT be more lenient - only skip if BOTH are 00:00 AND the original data was actually empty
        if (startTime === '00:00' && endTime === '00:00' && 
            !eventDate.startTime && !eventDate.endTime) {
          return null; // This will be filtered out later
        }
        
        
        const formattedDate = formatDateFromBackend(eventDate.date);
        
        const recurringDate: RecurringDate = {
          id: generateId(),
          date: formattedDate,
          repeats: 'once' as const,
          timeSlots: [{
            id: generateId(),
            startTime: startTime,
            endTime: endTime,
            duration: calculateDuration(startTime, endTime)
          }]
        };
        
        
        return recurringDate;
      });
    
    // Filter out null values and return properly typed array
    return mappedResults.filter((item): item is RecurringDate => item !== null);
  }
  
  // Case 2: Data comes as simple recurring pattern
  if (apiData.recurringPattern && apiData.recurringStart && apiData.recurringEnd && apiData.times) {
    const timesArray = apiData.times as Array<{ startTime: string; endTime: string }>;
    // Safe fallback for times with validation
    const firstTime = (timesArray && Array.isArray(timesArray) && timesArray[0]) 
      ? timesArray[0] 
      : { startTime: '09:00', endTime: '10:00' };
    
    return expandSimplePattern(
      apiData.recurringPattern as 'daily' | 'weekly' | 'monthly',
      apiData.recurringStart as string,
      apiData.recurringEnd as string,
      firstTime
    );
  }
  
  // Case 3: Data comes as RRULE pattern
  if (apiData.rrulePattern && apiData.times) {
    const timesArray = apiData.times as Array<{ startTime: string; endTime: string }>;
    // Safe fallback for times with validation
    const firstTime = (timesArray && Array.isArray(timesArray) && timesArray[0]) 
      ? timesArray[0] 
      : { startTime: '09:00', endTime: '10:00' };
      
    return expandRRulePattern(
      apiData.rrulePattern as RRulePattern, 
      firstTime
    );
  }
  
  // Unknown API data format, return empty array
  return [];
}

/**
 * Expand simple recurring pattern (daily, weekly, monthly) to individual dates
 */
function expandSimplePattern(
  pattern: 'daily' | 'weekly' | 'monthly',
  startDate: string,
  endDate: string,
  times: { startTime: string; endTime: string }
): RecurringDate[] {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);
  const dates: string[] = [];
  
  switch (pattern) {
    case 'daily':
      let currentDay = new Date(start);
      while (currentDay <= end) {
        dates.push(format(currentDay, 'yyyy-MM-dd'));
        currentDay = addDays(currentDay, 1);
      }
      break;
      
    case 'weekly':
      let currentWeek = new Date(start);
      while (currentWeek <= end) {
        dates.push(format(currentWeek, 'yyyy-MM-dd'));
        currentWeek = addWeeks(currentWeek, 1);
      }
      break;
      
    case 'monthly':
      let currentMonth = new Date(start);
      while (currentMonth <= end) {
        dates.push(format(currentMonth, 'yyyy-MM-dd'));
        currentMonth = addMonths(currentMonth, 1);
      }
      break;
  }
  
  return dates.map(dateString => ({
    id: generateId(),
    date: dateString,
    repeats: pattern,
    timeSlots: [{
      id: generateId(),
      startTime: times.startTime,
      endTime: times.endTime,
      duration: calculateDuration(times.startTime, times.endTime)
    }]
  }));
}

/**
 * Expand RRULE pattern to individual dates
 */
function expandRRulePattern(
  rrule: RRulePattern,
  times: { startTime: string; endTime: string }
): RecurringDate[] {
  const dates: string[] = [];
  
  
  if (!rrule.until) {
    console.warn('RRULE without until date, cannot expand');
    return [];
  }
  
  if (!rrule.dtstart) {
    console.warn('RRULE without dtstart date, cannot expand');
    return [];
  }
  
  const startDate = parseLocalDate(rrule.dtstart);
  const endDate = parseLocalDate(rrule.until);
  const interval = rrule.interval || 1;
  
  switch (rrule.freq) {
    case 'DAILY':
      // Generate daily dates with interval
      let currentDay = new Date(startDate);
      while (currentDay <= endDate) {
        dates.push(format(currentDay, 'yyyy-MM-dd'));
        currentDay = addDays(currentDay, interval);
      }
      break;
      
    case 'WEEKLY':
      if (rrule.byweekday) {
        // Generate dates for specific weekdays
        dates.push(...expandWeeklyRRule(rrule, startDate, endDate));
      }
      break;
      
    case 'MONTHLY':
      if (rrule.bymonthday) {
        // Generate dates for specific day of month
        dates.push(...expandMonthlyByDayRRule(rrule, startDate, endDate));
      } else if (rrule.byweekday) {
        // Generate dates for specific weekday position
        dates.push(...expandMonthlyByWeekdayRRule(rrule, startDate, endDate));
      }
      break;
      
    case 'YEARLY':
      // Handle yearly patterns if needed
      break;
  }
  
  // Determine the repeats value based on the pattern
  let repeatsValue: 'once' | 'daily' | 'weekly' | 'monthly' = 'once';
  switch (rrule.freq) {
    case 'DAILY':
      repeatsValue = 'daily';
      break;
    case 'WEEKLY':
      repeatsValue = 'weekly';
      break;
    case 'MONTHLY':
      repeatsValue = 'monthly';
      break;
    default:
      repeatsValue = 'once';
  }
  
  return dates.map(dateString => ({
    id: generateId(),
    date: dateString,
    repeats: repeatsValue,
    timeSlots: [{
      id: generateId(),
      startTime: times.startTime,
      endTime: times.endTime,
      duration: calculateDuration(times.startTime, times.endTime)
    }]
  }));
}

/**
 * Expand weekly RRULE with specific weekdays
 */
function expandWeeklyRRule(rrule: RRulePattern, startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const interval = rrule.interval || 1;
  
  if (!rrule.byweekday) return dates;
  
  // Convert weekday names to numbers
  const weekdayMap: Record<string, number> = {
    'SU': 0, 'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5, 'SA': 6
  };
  
  const targetWeekdays = rrule.byweekday.map(day => weekdayMap[day]).filter(day => day !== undefined);
  
  // Start from the week containing startDate
  let currentWeekStart = new Date(startDate);
  currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay()); // Go to Sunday
  
  while (currentWeekStart <= endDate) {
    // For each target weekday in this week
    for (const weekday of targetWeekdays) {
      const dateInWeek = new Date(currentWeekStart);
      dateInWeek.setDate(currentWeekStart.getDate() + weekday);
      
      // Only include if it's within the range and not before start date
      if (dateInWeek >= startDate && dateInWeek <= endDate) {
        dates.push(format(dateInWeek, 'yyyy-MM-dd'));
      }
    }
    
    // Move to next week based on interval
    currentWeekStart = addWeeks(currentWeekStart, interval);
  }
  
  return dates.sort();
}

/**
 * Expand monthly RRULE by day of month
 */
function expandMonthlyByDayRRule(rrule: RRulePattern, startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const dayOfMonth = rrule.bymonthday![0];
  const interval = rrule.interval || 1;
  
  let currentDate = new Date(startDate);
  currentDate.setDate(dayOfMonth);
  
  // If the day of month is beyond the start date, start from next month
  if (currentDate < startDate) {
    currentDate = addMonths(currentDate, 1);
    currentDate.setDate(dayOfMonth);
  }
  
  while (currentDate <= endDate) {
    // Validate that the day exists in this month (e.g., Feb 30th doesn't exist)
    if (currentDate.getDate() === dayOfMonth) {
      dates.push(format(currentDate, 'yyyy-MM-dd'));
    }
    currentDate = addMonths(currentDate, interval);
    currentDate.setDate(dayOfMonth);
  }
  
  return dates;
}

/**
 * Expand monthly RRULE by weekday position
 */
function expandMonthlyByWeekdayRRule(rrule: RRulePattern, startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const interval = rrule.interval || 1;
  
  if (!rrule.byweekday) return dates;
  
  // Convert weekday names to numbers  
  const weekdayMap: Record<string, number> = {
    'SU': 0, 'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5, 'SA': 6
  };
  
  const targetWeekday = weekdayMap[rrule.byweekday[0]];
  if (targetWeekday === undefined) return dates;
  
  // For now, assume first occurrence of weekday in month
  // A complete implementation would handle bysetpos for 1st, 2nd, 3rd, etc.
  let currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  
  while (currentMonth <= endDate) {
    // Find first occurrence of target weekday in this month
    let dayOfMonth = 1;
    let dateInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayOfMonth);
    
    while (dateInMonth.getDay() !== targetWeekday && dayOfMonth <= 31) {
      dayOfMonth++;
      dateInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayOfMonth);
    }
    
    // If we found the weekday and it's in range
    if (dateInMonth.getMonth() === currentMonth.getMonth() && 
        dateInMonth >= startDate && dateInMonth <= endDate) {
      dates.push(format(dateInMonth, 'yyyy-MM-dd'));
    }
    
    // Move to next month based on interval
    currentMonth = addMonths(currentMonth, interval);
  }
  
  return dates;
}