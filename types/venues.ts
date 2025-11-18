export enum VenueStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED'
}

export enum VenuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum VenueType {
  ATTRACTION = 'ATTRACTION',
  PERFORMING_ARTS_CENTER = 'PERFORMING_ARTS_CENTER',
  MUSEUM = 'MUSEUM',
  ARTIST_COMPLEX = 'ARTIST_COMPLEX',
  GALLERY = 'GALLERY',
  Z_OTHER = 'Z_OTHER',
  ART_CENTER = 'ART_CENTER',
  STUDIO = 'STUDIO',
  THEATER = 'THEATER',
  EVENT_SPACE = 'EVENT_SPACE',
  AMPHITHEATRE = 'AMPHITHEATRE',
  COMMUNITY_CENTER = 'COMMUNITY_CENTER',
  HISTORIC_HOMES = 'HISTORIC_HOMES'
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

export interface VenueOperatingHours {
  id: string;
  venueId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isClosed: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
}

export interface VenueFAQ {
  id: string;
  venueId: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
}

export interface VenueFAQEntity {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Company {
  id: string;
  name: string;
  email?: string;
}

export interface VenueOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Venue {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  phone?: string;
  website?: string;
  venueType: VenueType;
  status: VenueStatus;
  priority: VenuePriority;
  companyId: string;
  company: Company;
  hostsPrivateEvents: boolean;
  parkingInformation?: string;
  accessibilityFeatures?: string;
  adminNotes?: string;
  image?: string;
  imageUrl?: string;
  imageBig?: string;
  imageBigUrl?: string;
  operatingHours?: VenueOperatingHours[];
  faqs?: VenueFAQ[];
  owner?: VenueOwner;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
}

// GraphQL Input Types
export interface CreateVenueInput {
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  phone?: string;
  website?: string;
  venueType: VenueType;
  companyId: string;
  priority?: VenuePriority;
  hostsPrivateEvents?: boolean;
  parkingInformation?: string;
  accessibilityFeatures?: string;
  adminNotes?: string;
  image?: string;
  imageBig?: string;
}

export interface UpdateVenueInput {
  id: string;
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  phone?: string;
  website?: string;
  venueType?: VenueType;
  status?: VenueStatus;
  priority?: VenuePriority;
  hostsPrivateEvents?: boolean;
  parkingInformation?: string;
  accessibilityFeatures?: string;
  adminNotes?: string;
  image?: string;
  imageBig?: string;
}

export interface CreateVenueOperatingHoursInput {
  venueId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isClosed?: boolean;
}

export interface UpdateVenueOperatingHoursInput {
  id: string;
  startTime?: string;
  endTime?: string;
  isClosed?: boolean;
}

export interface CreateVenueFAQInput {
  venueId: string;
  question: string;
  answer: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateVenueFAQInput {
  id: string;
  question?: string;
  answer?: string;
  order?: number;
  isActive?: boolean;
}

// Response Types
export interface VenueEdge {
  node: Venue;
  cursor: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
  totalCount?: number;
}

export interface VenuesPaginated {
  edges: VenueEdge[];
  pageInfo: PageInfo;
}

export interface VenuesResponse {
  venuesPaginated: VenuesPaginated;
}

export interface VenueResponse {
  venue: Venue;
}

export interface MyCompaniesDropdownResponse {
  getMyCompaniesForDropdown: Company[];
}

export interface VenueOperatingHoursResponse {
  getVenueOperatingHours: VenueOperatingHours[];
}

export interface VenueFAQsResponse {
  getVenueFAQs: VenueFAQ[];
}

// Mutation Variables
export interface CreateVenueMutationVariables {
  createVenueInput: CreateVenueInput;
}

export interface UpdateVenueMutationVariables {
  updateVenueInput: UpdateVenueInput;
}

export interface CreateVenueOperatingHoursMutationVariables {
  createVenueOperatingHoursInput: CreateVenueOperatingHoursInput;
}

export interface UpdateVenueOperatingHoursMutationVariables {
  updateVenueOperatingHoursInput: UpdateVenueOperatingHoursInput;
}

export interface CreateVenueFAQMutationVariables {
  createVenueFAQInput: CreateVenueFAQInput;
}

export interface UpdateVenueFAQMutationVariables {
  updateVenueFAQInput: UpdateVenueFAQInput;
}

// Query Variables
export interface VenuesQueryVariables {
  filter?: {
    first?: number;
    after?: string;
    search?: string;
    city?: string;
    status?: VenueStatus;
    priority?: VenuePriority;
    includeTotalCount?: boolean;
    sort?: {
      field: string;
      direction: 'asc' | 'desc';
    };
  };
}

export interface VenueQueryVariables {
  identifier: string;
}

export interface VenueOperatingHoursQueryVariables {
  venueId: string;
}

export interface VenueFAQsQueryVariables {
  venueId: string;
  activeOnly?: boolean;
}

// Filter and Sort Types
export type VenueSortField = 'name' | 'createdAt' | 'updatedAt' | 'priority' | 'status' | 'city';
export type VenueSortDirection = 'asc' | 'desc';

export interface VenueFilters {
  search: string;
  status: VenueStatus | 'ALL';
  priority: VenuePriority | 'ALL';
  city: string;
}

export interface VenueSorting {
  field: VenueSortField;
  direction: VenueSortDirection;
}

// Stats Types
export interface VenueStats {
  totalVenues: number;
  approvedVenues: number;
  pendingReviewVenues: number;
  activeClients: number;
  rejectedVenues: number;
}

// Form Types
export interface VenueFormData extends CreateVenueInput {
  operatingHours?: CreateVenueOperatingHoursInput[];
  faqs?: CreateVenueFAQInput[];
}

export interface OperatingHoursFormData {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isClosed: boolean;
}

export interface FAQFormData {
  question: string;
  answer: string;
  isActive: boolean;
}