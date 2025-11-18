import { 
  Venue, 
  VenueStatus, 
  VenuePriority, 
  VenueType,
  DayOfWeek,
  VenueOperatingHours,
  VenueFAQ
} from '@/types/venues';

// Status helpers
export const getVenueStatusColor = (status: VenueStatus): string => {
  switch (status) {
    case VenueStatus.APPROVED:
      return 'bg-green-100 text-green-800 border-green-200';
    case VenueStatus.PENDING_REVIEW:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case VenueStatus.REJECTED:
      return 'bg-red-100 text-red-800 border-red-200';
    case VenueStatus.SUSPENDED:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getVenueStatusText = (status: VenueStatus): string => {
  switch (status) {
    case VenueStatus.APPROVED:
      return 'Approved';
    case VenueStatus.PENDING_REVIEW:
      return 'Pending Review';
    case VenueStatus.REJECTED:
      return 'Rejected';
    case VenueStatus.SUSPENDED:
      return 'Suspended';
    default:
      return 'Unknown';
  }
};

export const getVenueStatusIcon = (status: VenueStatus): string => {
  switch (status) {
    case VenueStatus.APPROVED:
      return '✓';
    case VenueStatus.PENDING_REVIEW:
      return '⏳';
    case VenueStatus.REJECTED:
      return '✗';
    case VenueStatus.SUSPENDED:
      return '⏸';
    default:
      return '?';
  }
};

// Priority helpers
export const getVenuePriorityColor = (priority: VenuePriority): string => {
  switch (priority) {
    case VenuePriority.HIGH:
      return 'bg-red-100 text-red-800 border-red-200';
    case VenuePriority.MEDIUM:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case VenuePriority.LOW:
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getVenuePriorityText = (priority: VenuePriority): string => {
  switch (priority) {
    case VenuePriority.HIGH:
      return 'High Priority';
    case VenuePriority.MEDIUM:
      return 'Medium Priority';
    case VenuePriority.LOW:
      return 'Low Priority';
    default:
      return 'Unknown Priority';
  }
};

export const getVenuePriorityWeight = (priority: VenuePriority): number => {
  switch (priority) {
    case VenuePriority.HIGH:
      return 3;
    case VenuePriority.MEDIUM:
      return 2;
    case VenuePriority.LOW:
      return 1;
    default:
      return 0;
  }
};

// Venue type helpers
export const getVenueTypeDisplayName = (type: VenueType): string => {
  switch (type) {
    case VenueType.THEATER:
      return 'Theater';
    case VenueType.ART_CENTER:
      return 'Art Center';
    case VenueType.PERFORMING_ARTS_CENTER:
      return 'Performing Arts Center';
    case VenueType.GALLERY:
      return 'Gallery';
    case VenueType.MUSEUM:
      return 'Museum';
    case VenueType.EVENT_SPACE:
      return 'Event Space';
    case VenueType.AMPHITHEATRE:
      return 'Amphitheatre';
    case VenueType.STUDIO:
      return 'Studio';
    case VenueType.ARTIST_COMPLEX:
      return 'Artist Complex';
    case VenueType.COMMUNITY_CENTER:
      return 'Community Center';
    case VenueType.HISTORIC_HOMES:
      return 'Historic Homes';
    case VenueType.ATTRACTION:
      return 'Tourist Attraction';
    case VenueType.Z_OTHER:
      return 'Other';
    default:
      return 'Unknown';
  }
};

// Date and time helpers
export const formatVenueDate = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  return new Date(dateString).toLocaleDateString('en-US', options || defaultOptions);
};

export const formatVenueDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Operating hours helpers
export const getDayOfWeekDisplayName = (day: DayOfWeek): string => {
  switch (day) {
    case DayOfWeek.MONDAY:
      return 'Monday';
    case DayOfWeek.TUESDAY:
      return 'Tuesday';
    case DayOfWeek.WEDNESDAY:
      return 'Wednesday';
    case DayOfWeek.THURSDAY:
      return 'Thursday';
    case DayOfWeek.FRIDAY:
      return 'Friday';
    case DayOfWeek.SATURDAY:
      return 'Saturday';
    case DayOfWeek.SUNDAY:
      return 'Sunday';
    default:
      return 'Unknown Day';
  }
};

export const formatOperatingHours = (operatingHours: VenueOperatingHours[]): Record<string, string> => {
  const formatted: Record<string, string> = {};
  
  operatingHours.forEach(hours => {
    const dayName = getDayOfWeekDisplayName(hours.dayOfWeek);
    
    if (hours.isClosed) {
      formatted[dayName] = 'Closed';
    } else {
      const startTime = formatTime(hours.startTime);
      const endTime = formatTime(hours.endTime);
      formatted[dayName] = `${startTime} - ${endTime}`;
    }
  });
  
  return formatted;
};

export const formatTime = (timeString: string): string => {
  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return timeString; // Return original if parsing fails
  }
};

export const isVenueOpen = (operatingHours: VenueOperatingHours[], date: Date = new Date()): boolean => {
  const dayOfWeek = getDayOfWeekFromDate(date);
  const currentHours = operatingHours.find(hours => hours.dayOfWeek === dayOfWeek);
  
  if (!currentHours || currentHours.isClosed) {
    return false;
  }
  
  const currentTime = date.getHours() * 60 + date.getMinutes();
  const [startHour, startMinute] = currentHours.startTime.split(':').map(Number);
  const [endHour, endMinute] = currentHours.endTime.split(':').map(Number);
  
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;
  
  return currentTime >= startTime && currentTime <= endTime;
};

const getDayOfWeekFromDate = (date: Date): DayOfWeek => {
  const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayMap: Record<number, DayOfWeek> = {
    0: DayOfWeek.SUNDAY,
    1: DayOfWeek.MONDAY,
    2: DayOfWeek.TUESDAY,
    3: DayOfWeek.WEDNESDAY,
    4: DayOfWeek.THURSDAY,
    5: DayOfWeek.FRIDAY,
    6: DayOfWeek.SATURDAY
  };
  
  return dayMap[dayIndex] || DayOfWeek.MONDAY;
};

// Address helpers
export const formatVenueAddress = (venue: Venue): string => {
  return `${venue.address}, ${venue.city}, ${venue.state} ${venue.zipcode}`;
};

export const formatVenueCityState = (venue: Venue): string => {
  return `${venue.city}, ${venue.state}`;
};

// FAQ helpers
export const sortFAQs = (faqs: VenueFAQ[]): VenueFAQ[] => {
  return [...faqs].sort((a, b) => a.order - b.order);
};

export const getActiveFAQs = (faqs: VenueFAQ[]): VenueFAQ[] => {
  return faqs.filter(faq => faq.isActive);
};

export const getPublicFAQs = (faqs: VenueFAQ[]): VenueFAQ[] => {
  return sortFAQs(getActiveFAQs(faqs));
};

// Validation helpers
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+1-?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

export const isValidWebsite = (website: string): boolean => {
  try {
    new URL(website);
    return true;
  } catch {
    return false;
  }
};

export const isValidZipCode = (zipCode: string): boolean => {
  const zipRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;
  return zipRegex.test(zipCode);
};

// Venue statistics helpers
export const calculateVenueStats = (venues: Venue[]) => {
  const stats = {
    totalVenues: venues.length,
    approvedVenues: 0,
    pendingReviewVenues: 0,
    rejectedVenues: 0,
    suspendedVenues: 0,
    activeClients: new Set<string>(),
    venueTypes: {} as Record<VenueType, number>,
    priorities: {} as Record<VenuePriority, number>,
    avgVenuesPerClient: 0,
    mostCommonType: null as VenueType | null,
    mostCommonPriority: null as VenuePriority | null
  };
  
  venues.forEach(venue => {
    // Status counts
    switch (venue.status) {
      case VenueStatus.APPROVED:
        stats.approvedVenues++;
        break;
      case VenueStatus.PENDING_REVIEW:
        stats.pendingReviewVenues++;
        break;
      case VenueStatus.REJECTED:
        stats.rejectedVenues++;
        break;
      case VenueStatus.SUSPENDED:
        stats.suspendedVenues++;
        break;
    }
    
    // Track unique clients
    stats.activeClients.add(venue.companyId);
    
    // Venue type counts
    stats.venueTypes[venue.venueType] = (stats.venueTypes[venue.venueType] || 0) + 1;
    
    // Priority counts
    stats.priorities[venue.priority] = (stats.priorities[venue.priority] || 0) + 1;
  });
  
  // Calculate averages and most common values
  const clientCount = stats.activeClients.size;
  stats.avgVenuesPerClient = clientCount > 0 ? stats.totalVenues / clientCount : 0;
  
  // Find most common venue type
  const mostCommonTypeEntry = Object.entries(stats.venueTypes)
    .sort(([, a], [, b]) => b - a)[0];
  stats.mostCommonType = mostCommonTypeEntry ? mostCommonTypeEntry[0] as VenueType : null;
  
  // Find most common priority
  const mostCommonPriorityEntry = Object.entries(stats.priorities)
    .sort(([, a], [, b]) => b - a)[0];
  stats.mostCommonPriority = mostCommonPriorityEntry ? mostCommonPriorityEntry[0] as VenuePriority : null;
  
  return {
    ...stats,
    activeClients: stats.activeClients.size
  };
};

// Search and filter helpers
export const filterVenuesBySearch = (venues: Venue[], searchTerm: string): Venue[] => {
  if (!searchTerm.trim()) return venues;
  
  const search = searchTerm.toLowerCase();
  
  return venues.filter(venue =>
    venue.name.toLowerCase().includes(search) ||
    venue.company?.name?.toLowerCase().includes(search) ||
    venue.city.toLowerCase().includes(search) ||
    venue.address.toLowerCase().includes(search) ||
    venue.description?.toLowerCase().includes(search)
  );
};

export const sortVenues = (venues: Venue[], field: string, direction: 'asc' | 'desc'): Venue[] => {
  return [...venues].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;
    
    switch (field) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'city':
        aValue = a.city.toLowerCase();
        bValue = b.city.toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'priority':
        aValue = getVenuePriorityWeight(a.priority);
        bValue = getVenuePriorityWeight(b.priority);
        break;
      case 'createdAt':
      case 'updatedAt':
        aValue = new Date(a[field as keyof Venue] as string).getTime();
        bValue = new Date(b[field as keyof Venue] as string).getTime();
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// URL helpers
export const generateVenueSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

// Export configuration objects for external use
export const VENUE_STATUS_CONFIG = {
  [VenueStatus.APPROVED]: {
    label: getVenueStatusText(VenueStatus.APPROVED),
    color: getVenueStatusColor(VenueStatus.APPROVED),
    icon: getVenueStatusIcon(VenueStatus.APPROVED)
  },
  [VenueStatus.PENDING_REVIEW]: {
    label: getVenueStatusText(VenueStatus.PENDING_REVIEW),
    color: getVenueStatusColor(VenueStatus.PENDING_REVIEW),
    icon: getVenueStatusIcon(VenueStatus.PENDING_REVIEW)
  },
  [VenueStatus.REJECTED]: {
    label: getVenueStatusText(VenueStatus.REJECTED),
    color: getVenueStatusColor(VenueStatus.REJECTED),
    icon: getVenueStatusIcon(VenueStatus.REJECTED)
  },
  [VenueStatus.SUSPENDED]: {
    label: getVenueStatusText(VenueStatus.SUSPENDED),
    color: getVenueStatusColor(VenueStatus.SUSPENDED),
    icon: getVenueStatusIcon(VenueStatus.SUSPENDED)
  }
};

export const VENUE_PRIORITY_CONFIG = {
  [VenuePriority.HIGH]: {
    label: getVenuePriorityText(VenuePriority.HIGH),
    color: getVenuePriorityColor(VenuePriority.HIGH),
    weight: getVenuePriorityWeight(VenuePriority.HIGH)
  },
  [VenuePriority.MEDIUM]: {
    label: getVenuePriorityText(VenuePriority.MEDIUM),
    color: getVenuePriorityColor(VenuePriority.MEDIUM),
    weight: getVenuePriorityWeight(VenuePriority.MEDIUM)
  },
  [VenuePriority.LOW]: {
    label: getVenuePriorityText(VenuePriority.LOW),
    color: getVenuePriorityColor(VenuePriority.LOW),
    weight: getVenuePriorityWeight(VenuePriority.LOW)
  }
};