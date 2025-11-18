import { format } from 'date-fns';
import { Event, EventStatus, EVENT_STATUS_LABELS, EVENT_STATUS_COLORS, NextEventDate } from '@/types/events';

/**
 * Format event date for display using separate date and time
 */
export function formatEventDate(dateString: string | null, timeString?: string | null): string {
  if (!dateString) return 'No date';
  
  try {
    // Use date timestamp for date part
    const dateTimestamp = parseInt(dateString, 10);
    const date = new Date(dateTimestamp);
    
    // Get current date in UTC for comparison
    const now = new Date();
    const currentUTCDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    
    // Get event date in UTC
    const eventUTCDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    
    const diffDays = Math.floor((eventUTCDate.getTime() - currentUTCDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return timeString ? `Today at ${timeString}` : 'Today';
    }
    
    if (diffDays === 1) {
      return timeString ? `Tomorrow at ${timeString}` : 'Tomorrow';
    }
    
    if (diffDays === -1) {
      return timeString ? `Yesterday at ${timeString}` : 'Yesterday';
    }
    
    // Use UTC date for formatting to avoid timezone issues
    const utcMonth = date.getUTCMonth();
    const utcDay = date.getUTCDate();
    const utcYear = date.getUTCFullYear();
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const formatted = `${monthNames[utcMonth]} ${utcDay.toString().padStart(2, '0')}, ${utcYear}`;
    return timeString ? `${formatted} at ${timeString}` : formatted;
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format time string for display - extracts only time from timestamp
 */
export function formatEventTime(timeString: string | null): string {
  if (!timeString) return '';
  
  try {
    // Handle timestamp in milliseconds, extract only time part
    const timestamp = parseInt(timeString, 10);
    const timeDate = new Date(timestamp);
    
    return format(timeDate, 'h:mm a');
  } catch {
    return timeString || ''; // Return original if parsing fails
  }
}

/**
 * Format next event date with time for display
 */
export function formatNextEventDate(nextEventDate: NextEventDate | null): string {
  if (!nextEventDate) return 'Invalid date';
  
  try {
    const formattedTime = formatEventTime(nextEventDate.startTime);
    return formatEventDate(nextEventDate.date, formattedTime);
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format date for left sidebar display (e.g., "AUG 01") - uses only date field
 */
export function formatDateForSidebar(nextEventDate: NextEventDate | null): { month: string; day: string } | null {
  if (!nextEventDate) return null;
  
  try {
    // Use only the date field timestamp for the sidebar date display
    const dateTimestamp = parseInt(nextEventDate.date, 10);
    const date = new Date(dateTimestamp);
    
    // Use UTC methods to avoid timezone conversion
    const utcMonth = date.getUTCMonth();
    const utcDay = date.getUTCDate();
    
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                       'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    return {
      month: monthNames[utcMonth],
      day: utcDay.toString().padStart(2, '0')
    };
  } catch {
    return null;
  }
}

/**
 * Get event status with calculated "Past" status
 */
export function getEventStatus(event: Event): EventStatus {
  // If event has explicit status, use it (prioritize status over isDraft)
  if (event.status) {
    return event.status as EventStatus;
  }

  // Fallback: If event is marked as draft and has no explicit status, return DRAFT
  if (event.isDraft) {
    return EventStatus.DRAFT;
  }

  // Default to DRAFT if no status is set
  return EventStatus.DRAFT;
}

/**
 * Get status label for display
 */
export function getEventStatusLabel(status: string): string {
  return EVENT_STATUS_LABELS[status as EventStatus] || status;
}

/**
 * Get status color for badges
 */
export function getEventStatusColor(status: string): string {
  return EVENT_STATUS_COLORS[status as EventStatus] || 'gray';
}

/**
 * Check if event is recurring
 */
export function isRecurringEvent(event: Event): boolean {
  return event.eventOccurrences && event.eventOccurrences.length > 0;
}

/**
 * Get event location display
 */
export function getEventLocationDisplay(event: Event): string {
  if (event.venueName) {
    return event.venueName;
  }
  
  if (event.venue?.name) {
    return event.venue.name;
  }
  
  if (event.address) {
    return event.address;
  }
  
  return 'No location';
}

/**
 * Get company name from event
 */
export function getEventCompanyName(event: Event): string {
  // Use company name from the new API structure
  if (event.company?.name) {
    return event.company.name;
  }
  
  // Fallback to owner info if company is not available
  if (event.owner) {
    return `${event.owner.firstName} ${event.owner.lastName}`;
  }
  
  return 'No Company';
}

/**
 * Get event owner name
 */
export function getEventOwnerName(event: Event): string {
  if (!event.owner) return 'Unknown';
  
  const { firstName, lastName } = event.owner;
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  
  return firstName || lastName || 'Unknown';
}

/**
 * Get market from event location or other fields
 */
export function getEventMarket(event: Event): string {
  return event.market || 'Unknown Market';
}

/**
 * Get count of additional event dates beyond the next one
 */
export function getAdditionalDatesCount(event: Event): number {
  if (!event.eventDates || event.eventDates.length <= 1) {
    return 0;
  }
  // Return count of additional dates (total - 1 for the next/current date)
  return event.eventDates.length - 1;
}

/**
 * Check if event has image
 */
export function hasEventImage(event: Event): boolean {
  return !!(event.mainImageUrl || event.bigImageUrl || event.featuredImageUrl);
}

/**
 * Get event image URL
 */
export function getEventImageUrl(event: Event): string | null {
  return event.mainImageUrl || event.bigImageUrl || event.featuredImageUrl || null;
}

/**
 * Get main genre from event tags with color
 */
export function getEventMainGenre(event: Event): { name: string; color?: string } {
  if (!event.eventTags || event.eventTags.length === 0) {
    return { name: 'No Genre' };
  }

  const mainGenreTag = event.eventTags.find(
    tag => tag.assignmentType === 'MAIN_GENRE'
  );

  if (!mainGenreTag?.tag) {
    return { name: 'No Genre' };
  }

  return {
    name: mainGenreTag.tag.name,
    color: mainGenreTag.tag.color
  };
}

/**
 * Sort events by given field
 */
export function sortEvents(events: Event[], field: string, direction: 'asc' | 'desc'): Event[] {
  return [...events].sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;
    
    switch (field) {
      case 'TITLE':
      case 'title':
        aValue = a.title?.toLowerCase() || '';
        bValue = b.title?.toLowerCase() || '';
        break;
      case 'CREATED_AT':
      case 'createdAt':
      case 'UPDATED_AT':
      case 'updatedAt':
        aValue = new Date(a.createdAt || a.updatedAt);
        bValue = new Date(b.createdAt || b.updatedAt);
        break;
      case 'START_DATE':
      case 'startDate':
        // Use first event date as start date
        aValue = a.eventDates?.[0]?.date ? new Date(a.eventDates[0].date) : new Date(0);
        bValue = b.eventDates?.[0]?.date ? new Date(b.eventDates[0].date) : new Date(0);
        break;
      case 'STATUS':
      case 'status':
        aValue = getEventStatus(a);
        bValue = getEventStatus(b);
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}