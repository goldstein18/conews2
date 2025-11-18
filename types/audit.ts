export interface AuditUser {
  firstName: string;
  lastName: string;
}

export interface AuditEntry {
  action: string;
  entityType: string;
  entityId?: string;
  userId?: string;
  createdAt: string;
  user: AuditUser;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface AuditEdge {
  cursor: string;
  node: AuditEntry;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
  totalCount?: number;
}

export interface AuditPaginated {
  edges: AuditEdge[];
  pageInfo: PageInfo;
}

export interface RecentAuditActivityResponse {
  recentAuditActivity: AuditEntry[];
}

export interface AuditHistoryResponse {
  auditHistory: AuditEntry[];
}

export interface MyAuditHistoryResponse {
  myAuditHistory: AuditEntry[];
}

export interface AuditFilterInput {
  entityTypes?: string[];
  actions?: string[];
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export type AuditSortField = 
  | 'createdAt'
  | 'action'
  | 'entityType'
  | 'userId';

import type { SortDirection } from '@/components/ui/sortable-table-header';
export type { SortDirection };

export interface AuditSortInput {
  field: AuditSortField;
  direction: SortDirection;
}

export interface AuditVariables {
  entityTypes?: string[];
  limit?: number;
  first?: number;
  after?: string;
  filter?: AuditFilterInput;
  sort?: AuditSortInput;
}

export interface EntityAuditHistoryVariables {
  entityType: string;
  entityId: string;
  limit?: number;
}

export interface MyAuditHistoryVariables {
  limit?: number;
}

// Entity type options for filters
export const ENTITY_TYPE_OPTIONS = [
  'Employee',
  'User', 
  'Company',
  'Event',
  'Restaurant',
  'Venue'
] as const;

export type EntityTypeOption = typeof ENTITY_TYPE_OPTIONS[number];

// Common action types for filters
export const ACTION_TYPE_OPTIONS = [
  'CREATED',
  'UPDATED', 
  'DELETED',
  'EMPLOYEE_HIRED',
  'EMPLOYEE_TERMINATED',
  'STATUS_CHANGED',
  'LOGIN',
  'LOGOUT'
] as const;

export type ActionTypeOption = typeof ACTION_TYPE_OPTIONS[number];

// Stats interfaces for dashboard
export interface AuditStats {
  todayActions: number;
  totalActions: number;
  activeUsers: number;
  topEntityTypes: Array<{
    entityType: string;
    count: number;
  }>;
}