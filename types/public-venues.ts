/**
 * Public-facing venue types for the venues directory
 * This is a subset of the full Venue type used in the dashboard
 */

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

export enum VenueStatus {
  APPROVED = 'APPROVED'
  // Only approved venues are shown publicly
}

// Market constants
export const MARKETS = [
  { value: 'miami', label: 'Miami' },
  { value: 'orlando', label: 'Orlando' },
  { value: 'tampa', label: 'Tampa' },
  { value: 'jacksonville', label: 'Jacksonville' },
  { value: 'palm-beach', label: 'Palm Beach' }
] as const;

export type MarketValue = typeof MARKETS[number]['value'];

// FAQ interface for venues
export interface VenueFAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

// Public venue interface (subset of full Venue type)
export interface PublicVenue {
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
  imageUrl?: string;
  imageBigUrl?: string;
  video?: string;
  videoType?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  market?: string;
  venueType: VenueType;
  status?: VenueStatus;
  hostsPrivateEvents: boolean;
  parkingInformation?: string;
  accessibilityFeatures?: string;
  metadescription?: string;
  faqs?: VenueFAQ[];
  createdAt: string;
}

// Pagination types
export interface PublicVenueEdge {
  node: PublicVenue;
  cursor: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
  totalCount?: number;
}

export interface PublicVenuesPaginated {
  edges: PublicVenueEdge[];
  pageInfo: PageInfo;
}

// GraphQL response type
export interface PublicVenuesResponse {
  publicVenuesPaginated: PublicVenuesPaginated;
}

// Query variables
export interface PublicVenuesQueryVariables {
  first: number;
  after?: string;
  market?: string;
  search?: string;
  city?: string;
  state?: string;
}

// Filter state
export interface VenueFilters {
  market: MarketValue | '';
  search: string;
  venueType: VenueType | 'ALL';
}

// Default filter values
export const DEFAULT_VENUE_FILTERS: VenueFilters = {
  market: 'miami',
  search: '',
  venueType: 'ALL'
};

// Single venue query types
export interface PublicVenueResponse {
  publicVenue: PublicVenue | null;
}

export interface PublicVenueVariables {
  identifier: string;
}
