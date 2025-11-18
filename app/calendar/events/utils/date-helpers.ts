/**
 * Date utility functions for events
 * Formats dates, calculates relative dates, and generates date badges
 */

import { format, parseISO, isToday, isTomorrow, isThisWeek, isThisMonth, differenceInDays, compareAsc } from 'date-fns';
import type { EventDate } from '@/types/public-events';

/**
 * Format event date for display
 * Uses UTC methods to avoid timezone issues
 */
export function formatEventDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Date TBA';
  try {
    const date = parseISO(dateString);
    // Use UTC methods to avoid timezone conversion
    const utcMonth = date.getUTCMonth();
    const utcDay = date.getUTCDate();
    const utcYear = date.getUTCFullYear();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return `${monthNames[utcMonth]} ${utcDay}, ${utcYear}`;
  } catch {
    return 'Invalid Date';
  }
}

/**
 * Format event date with time
 */
export function formatEventDateTime(dateString: string | null | undefined): string {
  if (!dateString) return 'Date & Time TBA';
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy • h:mm a');
  } catch {
    return 'Invalid Date';
  }
}

/**
 * Format time only
 */
export function formatEventTime(dateString: string | null | undefined): string {
  if (!dateString) return 'Time TBA';
  try {
    const date = parseISO(dateString);
    return format(date, 'h:mm a');
  } catch {
    return 'Invalid Time';
  }
}

/**
 * Format date range for events
 */
export function formatDateRange(startDate: string | null | undefined, endDate: string | null | undefined): string {
  if (!startDate || !endDate) return 'Dates TBA';

  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    // Same day event
    if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
      return `${format(start, 'MMM d, yyyy')} • ${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
    }

    // Multi-day event
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  } catch {
    return 'Invalid Date Range';
  }
}

/**
 * Get relative date label (Today, Tomorrow, etc.)
 */
export function getRelativeDateLabel(dateString: string | null | undefined): string | null {
  if (!dateString) return null;

  try {
    const date = parseISO(dateString);

    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';

    const daysUntil = differenceInDays(date, new Date());

    if (daysUntil > 0 && daysUntil <= 7) {
      return format(date, 'EEEE'); // Day of week
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Get compact date badge text
 * Uses UTC methods to avoid timezone issues
 */
export function getDateBadgeText(startDate: string | null | undefined): string {
  if (!startDate) return 'TBA';

  try {
    const date = parseISO(startDate);
    const relative = getRelativeDateLabel(startDate);

    if (relative === 'Today' || relative === 'Tomorrow') {
      return relative;
    }

    // Use UTC methods to avoid timezone conversion
    const utcMonth = date.getUTCMonth();
    const utcDay = date.getUTCDate();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return `${monthNames[utcMonth]} ${utcDay}`;
  } catch {
    return 'Date TBA';
  }
}

/**
 * Check if event is happening this week
 */
export function isEventThisWeek(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  try {
    return isThisWeek(parseISO(dateString), { weekStartsOn: 0 });
  } catch {
    return false;
  }
}

/**
 * Check if event is happening this month
 */
export function isEventThisMonth(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  try {
    return isThisMonth(parseISO(dateString));
  } catch {
    return false;
  }
}

/**
 * Check if event is in the past
 */
export function isEventPast(endDateString: string | null | undefined): boolean {
  if (!endDateString) return false;
  try {
    return parseISO(endDateString) < new Date();
  } catch {
    return false;
  }
}

/**
 * Check if event is happening now
 */
export function isEventHappeningNow(startDate: string | null | undefined, endDate: string | null | undefined): boolean {
  if (!startDate || !endDate) return false;
  try {
    const now = new Date();
    return parseISO(startDate) <= now && parseISO(endDate) >= now;
  } catch {
    return false;
  }
}

/**
 * Get event status label
 */
export function getEventStatusLabel(startDate: string | null | undefined, endDate: string | null | undefined): string | null {
  if (!startDate || !endDate) return null;

  try {
    if (isEventHappeningNow(startDate, endDate)) {
      return 'Happening Now';
    }

    if (isEventPast(endDate)) {
      return 'Past Event';
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Get future event dates sorted by date
 * Filters out past and cancelled dates
 */
export function getFutureEventDates(eventDates: EventDate[]): EventDate[] {
  if (!eventDates || eventDates.length === 0) {
    return [];
  }

  const now = new Date();
  // Get current date in UTC for comparison (same approach as dashboard)
  const currentUTCDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

  const filtered = eventDates.filter(eventDate => {
    // Skip cancelled dates
    if (eventDate.cancelled) {
      return false;
    }

    try {
      const date = parseISO(eventDate.date);
      // Get event date in UTC (same approach as dashboard)
      const eventUTCDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
      const isFuture = eventUTCDate >= currentUTCDate;
      // Include dates that are today or in the future
      return isFuture;
    } catch {
      return false;
    }
  });

  return filtered.sort((a, b) => {
    try {
      return compareAsc(parseISO(a.date), parseISO(b.date));
    } catch {
      return 0;
    }
  });
}

/**
 * Get date badge text for event with multiple dates
 * Returns "MMM d" for single date, "MMM d +" for multiple dates
 */
export function getEventDatesBadgeText(eventDates: EventDate[], legacyStartDate?: string | null): string {
  const futureDates = getFutureEventDates(eventDates);

  // If no future dates and no legacy date, return TBA
  if (futureDates.length === 0 && !legacyStartDate) {
    return 'TBA';
  }

  // Use first future date if available, otherwise use legacy
  const dateToUse = futureDates.length > 0 ? futureDates[0].date : legacyStartDate;

  if (!dateToUse) {
    return 'TBA';
  }

  try {
    const date = parseISO(dateToUse);
    const relative = getRelativeDateLabel(dateToUse);

    if (relative === 'Today' || relative === 'Tomorrow') {
      // Add "+" if there are multiple dates
      return futureDates.length > 1 ? `${relative} +` : relative;
    }

    // Use UTC methods to avoid timezone conversion
    const utcMonth = date.getUTCMonth();
    const utcDay = date.getUTCDate();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dateText = `${monthNames[utcMonth]} ${utcDay}`;
    return futureDates.length > 1 ? `${dateText} +` : dateText;
  } catch {
    return 'Date TBA';
  }
}

/**
 * Format event dates for tooltip display
 * Returns up to 5 future dates formatted
 */
export function formatEventDatesForTooltip(eventDates: EventDate[], maxDates: number = 5): string[] {
  const futureDates = getFutureEventDates(eventDates);
  const datesToShow = futureDates.slice(0, maxDates);

  return datesToShow.map(eventDate => {
    try {
      const date = parseISO(eventDate.date);
      const dateStr = format(date, 'MMM d, yyyy');

      // Add time if available
      if (eventDate.startTime) {
        const timeStr = eventDate.startTime; // Already in HH:mm format
        return `${dateStr} at ${timeStr}`;
      }

      // Add sold out indicator
      if (eventDate.soldOut) {
        return `${dateStr} (Sold Out)`;
      }

      return dateStr;
    } catch {
      return 'Invalid date';
    }
  });
}
