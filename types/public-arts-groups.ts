/**
 * Public Arts Groups Types
 * Types for public-facing arts groups directory and detail pages
 */

// Market type (shared with other public directories)
export type MarketValue = 'miami' | 'orlando' | 'tampa' | 'jacksonville';

// Public arts group interface (matches GraphQL publicArtsGroup schema)
export interface PublicArtsGroup {
  id: string;
  name: string;
  slug: string;
  description?: string;
  artType?: string;
  memberCount?: number;
  foundedYear?: number;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  imageUrl?: string;
  imageBigUrl?: string;
  market: string;
  createdAt?: string;
  updatedAt?: string;
}

// Pagination types
export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
  totalCount?: number;
}

export interface PublicArtsGroupEdge {
  node: PublicArtsGroup;
  cursor: string;
}

export interface PublicArtsGroupsPaginated {
  edges: PublicArtsGroupEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

// GraphQL Response types
export interface PublicArtsGroupsPaginatedResponse {
  publicArtsGroupsPaginated: PublicArtsGroupsPaginated;
}

export interface PublicArtsGroupResponse {
  publicArtsGroup: PublicArtsGroup;
}

// Query variables
export interface PublicArtsGroupsQueryVariables {
  first: number;
  after?: string | null;
  filter?: {
    market?: string;
    searchTerm?: string;
    city?: string;
    state?: string;
  };
}

export interface PublicArtsGroupVariables {
  identifier: string;
}

// Filter types
export interface ArtsGroupFilters {
  market?: MarketValue;
  search?: string;
  artType?: string;
  city?: string;
  state?: string;
}

// Constants
export const MARKETS = [
  { value: 'miami', label: 'Miami' },
  { value: 'orlando', label: 'Orlando' },
  { value: 'tampa', label: 'Tampa' },
  { value: 'jacksonville', label: 'Jacksonville' },
] as const;

export const DEFAULT_ARTS_GROUP_FILTERS: ArtsGroupFilters = {
  market: undefined,
  search: '',
  artType: undefined,
  city: undefined,
  state: undefined,
};

// Art type options (common performing arts categories)
export const ART_TYPES = [
  { value: 'THEATER', label: 'Theater' },
  { value: 'DANCE', label: 'Dance' },
  { value: 'MUSIC', label: 'Music' },
  { value: 'OPERA', label: 'Opera' },
  { value: 'BALLET', label: 'Ballet' },
  { value: 'SYMPHONY', label: 'Symphony' },
  { value: 'CHORUS', label: 'Chorus' },
  { value: 'COMEDY', label: 'Comedy' },
  { value: 'CIRCUS', label: 'Circus' },
  { value: 'MIXED', label: 'Mixed Arts' },
  { value: 'OTHER', label: 'Other' },
] as const;
