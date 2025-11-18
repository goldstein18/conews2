export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_CUSTOMER'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED'
  | 'REOPENED';

export type TicketPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT';

export type TicketCategory =
  | 'TECHNICAL'
  | 'BILLING'
  | 'FEATURE_REQUEST'
  | 'BUG_REPORT'
  | 'GENERAL';

export interface TicketUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface TicketCompany {
  id: string;
  name: string;
  email: string;
}

export interface TicketAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  contentType: string;
  createdAt: string;
}

export interface TicketComment {
  id: string;
  content: string;
  isInternal: boolean;
  ticketId: string;
  user: TicketUser;
  attachments: TicketAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketCount {
  comments: number;
  attachments: number;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  company: TicketCompany;
  user: TicketUser;
  assignedTo?: TicketUser | null;
  comments: TicketComment[];
  attachments: TicketAttachment[];
  _count?: TicketCount;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  closedAt?: string | null;
  lastCommentAt?: string | null;
}

export interface TicketEdge {
  cursor: string;
  node: Ticket;
}

export interface TicketPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface TicketsPaginated {
  edges: TicketEdge[];
  pageInfo: TicketPageInfo;
  totalCount: number;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  waitingForCustomer: number;
  resolved: number;
  closed: number;
  cancelled: number;
  reopened: number;
  urgent: number;
  high: number;
  unassigned: number;
}

export interface TicketFilterInput {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  searchTerm?: string;
  companyId?: string;
  assignedToId?: string;
}

export type TicketSortField =
  | 'createdAt'
  | 'updatedAt'
  | 'title'
  | 'status'
  | 'priority'
  | 'lastCommentAt';

import type { SortDirection } from '@/components/ui/sortable-table-header';
export type { SortDirection };

export interface TicketSortInput {
  field: TicketSortField;
  direction: SortDirection;
}

// Response types for GraphQL queries
export interface TicketResponse {
  ticket: Ticket;
}

export interface MyTicketsResponse {
  myTickets: Ticket[];
}

export interface MyAssignedTicketsResponse {
  myAssignedTickets: Ticket[];
}

export interface TicketsByCompanyResponse {
  ticketsByCompany: Ticket[];
}

export interface TicketsResponse {
  tickets: Ticket[];
}

export interface TicketsPaginatedResponse {
  ticketsPaginated: TicketsPaginated;
}

export interface TicketStatsResponse {
  ticketStats: TicketStats;
}

// Mutation input types
export interface CreateTicketInput {
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
  companyId: string;
}

export interface UpdateTicketInput {
  id: string;
  title?: string;
  description?: string;
  priority?: TicketPriority;
  category?: TicketCategory;
}

export interface UpdateTicketStatusInput {
  ticketId: string;
  status: TicketStatus;
}

export interface AssignTicketInput {
  ticketId: string;
  assignedToId: string;
}

export interface AddCommentInput {
  ticketId: string;
  content: string;
  isInternal: boolean;
}

export interface GenerateAttachmentUploadUrlInput {
  ticketId: string;
  fileName: string;
  contentType: string;
  fileSize: number;
}

export interface PresignedUploadUrl {
  uploadUrl: string;
  key: string;
  expiresIn: number;
  maxFileSize: number;
}

// Mutation response types
export interface CreateTicketResponse {
  createTicket: Ticket;
}

export interface UpdateTicketResponse {
  updateTicket: Ticket;
}

export interface UpdateTicketStatusResponse {
  updateTicketStatus: Ticket;
}

export interface AssignTicketResponse {
  assignTicket: Ticket;
}

export interface AddTicketCommentResponse {
  addTicketComment: TicketComment;
}

export interface GenerateTicketAttachmentUploadUrlResponse {
  generateTicketAttachmentUploadUrl: PresignedUploadUrl;
}

export interface DeleteTicketResponse {
  deleteTicket: Ticket;
}
