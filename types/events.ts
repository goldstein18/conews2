// Event-related types

export interface EventOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface EventVenue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

export interface EventDate {
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface NextEventDate {
  date: string;
  startTime: string;
  endTime: string;
}

export interface Company {
  name: string;
}

export interface EventOccurrence {
  id: string;
}

export interface EventTag {
  id: string;
  assignmentType: string;
  tag: {
    id: string;
    name: string;
    type: string;
    color?: string;
  };
}

export interface EventCount {
  eventLikes: number;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  status: string;
  isDraft: boolean;
  summary: string | null;
  venueName: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  market: string | null;
  mainImageUrl: string | null;
  bigImageUrl: string | null;
  featuredImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  owner: EventOwner | null;
  venue: EventVenue | null;
  company: Company | null;
  nextEventDate: NextEventDate | null;
  eventDates: EventDate[];
  eventOccurrences: EventOccurrence[];
  eventTags?: EventTag[];
  _count: EventCount;
}

export interface EventEdge {
  cursor: string;
  node: Event;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
  totalCount?: number;
}

export interface EventsPaginated {
  edges: EventEdge[];
  pageInfo: PageInfo;
}

export interface EventsResponse {
  eventsPaginated: EventsPaginated;
}

export type EventsSortDirection = 'DESC' | 'ASC';
export type EventsSortField = 
  | 'CREATED_AT'
  | 'UPDATED_AT'
  | 'TITLE'
  | 'START_DATE'
  | 'STATUS';

export interface EventsSortInput {
  field: EventsSortField;
  direction: EventsSortDirection;
}

export interface EventsFilterInput {
  first?: number;
  after?: string;
  status?: string;
  userId?: string;
  companyId?: string;
  market?: string;
  search?: string;
  sort?: EventsSortInput;
}

export interface EventsVariables {
  filter?: EventsFilterInput;
}

// Dashboard stats interfaces
export interface EventsSummary {
  totalEvents: number;
  pendingEvents: number;
  liveEvents: number;
  draftEvents: number;
  pastEvents: number;
}

export interface EventsDashboardStats {
  summary: EventsSummary;
}

export interface EventsDashboardStatsResponse {
  eventsDashboardStats: EventsDashboardStats;
}

export interface EventsDashboardStatsVariables {
  market?: string;
  companyId?: string;
}

// Event status enum (matching venue pattern)
export enum EventStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED'
}

// Legacy status constants for backward compatibility
export const EVENT_STATUS = {
  DRAFT: 'DRAFT',
  LIVE: 'LIVE',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  APPROVED: 'APPROVED',
} as const;

// Status display labels
export const EVENT_STATUS_LABELS = {
  [EventStatus.DRAFT]: 'Draft',
  [EventStatus.PENDING]: 'Pending',
  [EventStatus.PENDING_REVIEW]: 'Pending Review',
  [EventStatus.APPROVED]: 'Approved',
  [EventStatus.REJECTED]: 'Rejected',
  [EventStatus.SUSPENDED]: 'Suspended',
  [EventStatus.DELETED]: 'Deleted',
} as const;

// Status colors for badges
export const EVENT_STATUS_COLORS = {
  [EventStatus.DRAFT]: 'gray',
  [EventStatus.PENDING]: 'yellow',
  [EventStatus.PENDING_REVIEW]: 'orange',
  [EventStatus.APPROVED]: 'green',
  [EventStatus.REJECTED]: 'red',
  [EventStatus.SUSPENDED]: 'purple',
  [EventStatus.DELETED]: 'black',
} as const;