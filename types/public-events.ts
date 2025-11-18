/**
 * Public-facing event types for the calendar/events directory
 * Matches the publicEventsPaginated GraphQL API schema
 */

// Market constants (shared with venues)
export const MARKETS = [
  { value: 'miami', label: 'Miami' },
  { value: 'orlando', label: 'Orlando' },
  { value: 'tampa', label: 'Tampa' },
  { value: 'jacksonville', label: 'Jacksonville' },
  { value: 'palm-beach', label: 'Palm Beach' }
] as const;

export type MarketValue = typeof MARKETS[number]['value'];

// Date filter types (matching API DateFilterType enum)
// ⚠️ IMPORTANT: API expects UPPERCASE values (TODAY, THIS_WEEKEND, etc.)
export type DateFilterType =
  | 'TODAY'
  | 'THIS_WEEKEND'
  | 'THIS_WEEK'
  | 'THIS_MONTH'
  | 'CUSTOM'
  | '';

export const DATE_FILTER_OPTIONS = [
  { value: '', label: 'All Dates' },
  { value: 'TODAY', label: 'Today' },
  { value: 'THIS_WEEKEND', label: 'This Weekend' },
  { value: 'THIS_WEEK', label: 'This Week' },
  { value: 'THIS_MONTH', label: 'This Month' }
] as const;

// Event tag interface
export interface EventTag {
  tag: {
    id: string;
    name: string;
    display: string;
  };
}

// Venue reference (simplified)
export interface EventVenue {
  id: string;
  name: string;
  city: string;
  state: string;
}

// Event date interface (for recurring events or multiple date options)
export interface EventDate {
  id: string;
  date: string;        // ISO date string
  startTime?: string;  // HH:mm format
  endTime?: string;    // HH:mm format
  soldOut: boolean;
  cancelled: boolean;
}

// Public event interface
export interface PublicEvent {
  id: string;
  title: string;
  slug: string;
  description?: string;
  summary?: string;
  startDate?: string | null;  // ISO datetime (legacy single date, can be null)
  endDate?: string | null;    // ISO datetime (legacy single date, can be null)
  eventDates: EventDate[];    // Array of event dates (primary way to handle dates)
  free: boolean;
  virtual: boolean;
  mainImageUrl?: string;
  bigImageUrl?: string;
  venueName?: string;
  city: string;
  state: string;
  market?: string;
  eventTags: EventTag[];
  venue?: EventVenue;
}

// Pagination types
export interface PublicEventEdge {
  node: PublicEvent;
  cursor: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
  totalCount?: number;
}

export interface PublicEventsPaginated {
  edges: PublicEventEdge[];
  pageInfo: PageInfo;
}

// GraphQL response type
export interface PublicEventsResponse {
  publicEventsPaginated: PublicEventsPaginated;
}

// Query variables for paginated events
export interface PublicEventsQueryVariables {
  first: number;
  after?: string;
  dateFilter?: DateFilterType;
  virtual?: boolean;
  tagNames?: string[];  // Changed from tagIds to tagNames
  city?: string;
  state?: string;
  market?: string;
  search?: string;
}

// Filter state for UI
export interface EventFilters {
  search: string;
  dateFilter: DateFilterType;
  virtual: boolean;
  tagNames: string[];  // Changed from tagIds to tagNames
  city: string;
  state: string;
  market: MarketValue | '';
}

// Default filter values
export const DEFAULT_EVENT_FILTERS: EventFilters = {
  search: '',
  dateFilter: '',
  virtual: false,
  tagNames: [],  // Changed from tagIds
  city: '',
  state: '',
  market: ''
};

// Single event query types
export interface PublicEventResponse {
  publicEvent: PublicEvent | null;
}

export interface PublicEventVariables {
  identifier: string; // slug or ID
}
