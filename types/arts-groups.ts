// Arts Group Status
export enum ArtsGroupStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  DELETED = 'DELETED'
}

// Arts Group Interface
export interface ArtsGroup {
  id: string;
  name: string;
  slug: string;
  description?: string;
  companyId: string;
  address: string;
  market: string;
  phone?: string;
  email?: string;
  website?: string;
  image?: string;
  imageUrl?: string;
  artType?: string;
  memberCount?: number;
  foundedYear?: number;
  status: ArtsGroupStatus;
  declinedReason?: string;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
    email?: string;
  };
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Arts Group Stats
export interface ArtsGroupStats {
  total: number;
  approved: number;
  pending: number;
  declined: number;
  deleted: number;
}

// Filter Input
export interface ArtsGroupsFilterInput {
  status?: ArtsGroupStatus;
  market?: string;
  artType?: string;
  searchTerm?: string;
  companyId?: string;
}

// Pagination
export interface ArtsGroupEdge {
  node: ArtsGroup;
  cursor: string;
}

export interface ArtsGroupPageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface ArtsGroupsPaginatedResponse {
  edges: ArtsGroupEdge[];
  pageInfo: ArtsGroupPageInfo;
  totalCount?: number;
}

// Query Variables
export interface ListArtsGroupsQueryVariables {
  first?: number;
  after?: string;
  includeTotalCount?: boolean;
  filter?: ArtsGroupsFilterInput;
}

export interface GetArtsGroupQueryVariables {
  id: string;
}

// Mutation Variables
export interface CreateArtsGroupInput {
  name: string;
  description?: string;
  companyId: string;
  address: string;
  market: string;
  phone?: string;
  email?: string;
  website?: string;
  image?: string;
  artType?: string;
  memberCount?: number;
  foundedYear?: number;
}

export interface UpdateArtsGroupInput {
  id: string;
  name?: string;
  description?: string;
  address?: string;
  market?: string;
  phone?: string;
  email?: string;
  website?: string;
  image?: string;
  artType?: string;
  memberCount?: number;
  foundedYear?: number;
  status?: ArtsGroupStatus;
}

export interface CreateArtsGroupMutationVariables {
  createArtsGroupInput: CreateArtsGroupInput;
}

export interface UpdateArtsGroupMutationVariables {
  updateArtsGroupInput: UpdateArtsGroupInput;
}

export interface UpdateArtsGroupStatusMutationVariables {
  id: string;
  status: ArtsGroupStatus;
}

export interface DeleteArtsGroupMutationVariables {
  id: string;
}

// Image Upload Types
export interface GenerateArtsGroupImageUploadUrlInput {
  fileName: string;
  contentType: string;
  fileSize: number;
}

export interface ArtsGroupImageUploadResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
  maxFileSize: number;
}

export interface UpdateArtsGroupImageInput {
  id: string;
  image: string;
}

// Response Types
export interface ArtsGroupsResponse {
  artsGroupsPaginated: ArtsGroupsPaginatedResponse;
}

export interface ArtsGroupResponse {
  artsGroup: ArtsGroup;
}

export interface ArtsGroupStatsResponse {
  artsGroupStats: ArtsGroupStats;
}

// Sort Types
export enum ArtsGroupSortField {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  STATUS = 'status',
  MARKET = 'market',
  ART_TYPE = 'artType'
}

export enum ArtsGroupSortDirection {
  ASC = 'asc',
  DESC = 'desc'
}
