export enum EscoopStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT'
}

export interface EscoopOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Escoop {
  id: string;
  name: string;
  title: string;
  sendDate: string;
  status: EscoopStatus;
  sent: boolean;
  remaining: number;
  bannersRemaining: number;
  market: string;
  locations: string[];
  userId: string;
  owner: EscoopOwner;
  createdAt: string;
  updatedAt: string;
}

// API Types
export interface CreateEscoopInput {
  name: string;
  title: string;
  sendDate: string;
  remaining: number;
  bannersRemaining: number;
  market: string;
  locations: string[];
}

export interface UpdateEscoopInput {
  id: string;
  name?: string;
  title?: string;
  sendDate?: string;
  remaining?: number;
  bannersRemaining?: number;
  market?: string;
  locations?: string[];
}

// Filter Types
export interface EscoopsPaginatedFilterInput {
  first?: number;
  after?: string;
  before?: string;
  search?: string;
  status?: EscoopStatus;
  market?: string;
  sent?: boolean;
  includeTotalCount?: boolean;
}

// Legacy type for compatibility
export interface EscoopsFilterInput extends EscoopsPaginatedFilterInput {}

// Pagination Types
export interface EscoopsPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
  totalCount: number;
}

export interface EscoopEdge {
  node: Escoop;
  cursor: string;
}

export interface EscoopsPaginatedResponse {
  edges: EscoopEdge[];
  pageInfo: EscoopsPageInfo;
}

// Sorting Types
export enum EscoopSortField {
  NAME = 'name',
  TITLE = 'title',
  SEND_DATE = 'sendDate',
  STATUS = 'status',
  CREATED_AT = 'createdAt',
  OWNER = 'owner'
}

export enum EscoopSortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

// Form Types
export interface EscoopFormData {
  name: string;
  title: string;
  sendDate: Date;
  locations: string[];
  remaining: number;
  bannersRemaining: number;
}

// Location Configuration
export interface LocationOption {
  value: string;
  label: string;
  market: string;
}

export const LOCATION_OPTIONS: LocationOption[] = [
  { value: 'Miami-Dade', label: 'Miami-Dade', market: 'miami' },
  { value: 'Broward', label: 'Broward', market: 'miami' },
  { value: 'Palm Beach+', label: 'Palm Beach+', market: 'palm-beach' },
  { value: 'Tampa/St. Pete+', label: 'Tampa/St. Pete+', market: 'tampa' },
  { value: 'Atlanta', label: 'Atlanta', market: 'atlanta' }
];

// Market options
export const MARKET_OPTIONS = [
  { value: 'miami', label: 'Miami' },
  { value: 'palm-beach', label: 'Palm Beach' },
  { value: 'tampa', label: 'Tampa' },
  { value: 'atlanta', label: 'Atlanta' }
] as const;