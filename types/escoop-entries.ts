// Escoop Entry Types
export interface EscoopEntry {
  id: string;
  escoopId: string;
  eventId: string;
  status: EscoopEntryStatus;
  locations: string[];
  approvalReason?: string;
  approvedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  escoop: {
    id: string;
    name: string;
    title: string;
    remaining: number;
    status: string;
  };

  event: {
    id: string;
    title: string;
    slug: string;
    status: string;
    image?: string;
    mainImageUrl?: string;
    startDate?: string;
    companyId: string;
  };
}

// Enum for escoop entry status
export enum EscoopEntryStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  DELETED = 'DELETED',
  EXPIRED = 'EXPIRED'
}

// Input types for mutations
export interface CreateEscoopEntryInput {
  escoopId: string;
  eventId: string;
  locations: string[];
}

export interface UpdateEscoopEntryInput {
  id: string;
  escoopId?: string;
  eventId?: string;
  status?: 'PENDING' | 'APPROVED' | 'DECLINED' | 'DELETED' | 'EXPIRED';
  locations?: string[];
  approvalReason?: string;
}

// Search and filter types
export interface EscoopSearchResult {
  id: string;
  name: string;
  title?: string;
  status: string;
  remaining: number;
  market: string;
}

export interface EscoopSearchInput {
  search?: string;
  market?: string;
  status?: string;
}

export interface EventSearchResult {
  id: string;
  title: string;
  startDate?: string;
  status?: string;
  companyId: string;
  mainImageUrl?: string;
}

export interface EventFullData {
  id: string;
  title: string;
  slug: string;
  startDate?: string;
  status?: string;
  image?: string;
  mainImageUrl?: string;
  companyId: string;
}

export interface EventSearchInput {
  search?: string;
  companyId?: string;
  status?: string;
}

// Available locations based on the mockup
export const AVAILABLE_LOCATIONS = [
  'Miami-Dade',
  'Broward',
  'Palm Beach+',
  'Tampa/St. Pete+',
  'Atlanta'
] as const;

export type LocationType = typeof AVAILABLE_LOCATIONS[number];

// Form data types
export interface EscoopEntryFormData {
  escoopId: string;
  eventId: string;
  locations: string[];
  companyId?: string; // Optional for regular users, required for admins
}

// Pagination and filtering
export interface EscoopEntriesPaginatedFilterInput {
  first?: number;
  after?: string;
  includeTotalCount?: boolean;
  status?: EscoopEntryStatus;
  escoopId?: string;
  eventId?: string;
  companyId?: string;
  createdFrom?: string;
  createdTo?: string;
}

export interface EscoopEntriesPaginatedResponse {
  edges: {
    node: EscoopEntry;
    cursor: string;
  }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
    totalCount: number;
  };
}