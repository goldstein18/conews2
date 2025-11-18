import { z } from 'zod';
import { TicketPriority, TicketCategory, TicketStatus } from '@/types/ticket';

// ============================================================================
// Constants
// ============================================================================

export const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
] as const;

export const CATEGORY_OPTIONS = [
  { value: 'GENERAL', label: 'General Inquiry' },
  { value: 'TECHNICAL', label: 'Technical Issue' },
  { value: 'BILLING', label: 'Billing Question' },
  { value: 'FEATURE_REQUEST', label: 'Feature Request' },
  { value: 'BUG_REPORT', label: 'Bug Report' },
] as const;

export const STATUS_OPTIONS = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'WAITING_FOR_CUSTOMER', label: 'Waiting for Customer' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'REOPENED', label: 'Reopened' },
  { value: 'CANCELLED', label: 'Cancelled' },
] as const;

// ============================================================================
// Validation Schemas
// ============================================================================

/**
 * Base schema for ticket creation
 */
export const createTicketSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .trim(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const, {
    message: 'Please select a priority',
  }),
  category: z.enum(['TECHNICAL', 'BILLING', 'FEATURE_REQUEST', 'BUG_REPORT', 'GENERAL'] as const, {
    message: 'Please select a category',
  }),
  companyId: z.string().min(1, 'Company is required'),
});

/**
 * Schema for updating ticket details
 */
export const updateTicketSchema = z.object({
  id: z.string().min(1, 'Ticket ID is required'),
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .trim()
    .optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).optional(),
  category: z.enum(['TECHNICAL', 'BILLING', 'FEATURE_REQUEST', 'BUG_REPORT', 'GENERAL'] as const).optional(),
});

/**
 * Schema for updating ticket status
 */
export const updateTicketStatusSchema = z.object({
  ticketId: z.string().min(1, 'Ticket ID is required'),
  status: z.enum([
    'OPEN',
    'IN_PROGRESS',
    'WAITING_FOR_CUSTOMER',
    'RESOLVED',
    'CLOSED',
    'CANCELLED',
    'REOPENED',
  ] as const, {
    message: 'Please select a status',
  }),
});

/**
 * Schema for assigning a ticket
 */
export const assignTicketSchema = z.object({
  ticketId: z.string().min(1, 'Ticket ID is required'),
  assignedToId: z.string().min(1, 'Please select a staff member'),
});

/**
 * Schema for adding a comment or internal note
 */
export const addCommentSchema = z.object({
  ticketId: z.string().min(1, 'Ticket ID is required'),
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(5000, 'Comment must be less than 5000 characters')
    .trim(),
  isInternal: z.boolean().optional().default(false),
});

/**
 * Schema for file attachment validation
 */
export const fileAttachmentSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  contentType: z.string().min(1, 'Content type is required'),
  fileSize: z
    .number()
    .positive('File size must be positive')
    .max(104857600, 'File size must not exceed 100MB'), // 100MB in bytes
});

// ============================================================================
// Type Exports
// ============================================================================

export type CreateTicketFormData = z.infer<typeof createTicketSchema>;
export type UpdateTicketFormData = z.infer<typeof updateTicketSchema>;
export type UpdateTicketStatusFormData = z.infer<typeof updateTicketStatusSchema>;
export type AssignTicketFormData = z.infer<typeof assignTicketSchema>;
export type AddCommentFormData = z.infer<typeof addCommentSchema>;
export type FileAttachmentFormData = z.infer<typeof fileAttachmentSchema>;

// ============================================================================
// Default Values
// ============================================================================

export const defaultCreateTicketValues: Partial<CreateTicketFormData> = {
  title: '',
  description: '',
  priority: 'MEDIUM',
  category: 'GENERAL',
  companyId: '',
};

export const defaultUpdateTicketValues: Partial<UpdateTicketFormData> = {
  title: '',
  description: '',
  priority: 'MEDIUM',
  category: 'GENERAL',
};

export const defaultAddCommentValues = {
  ticketId: '',
  content: '',
  isInternal: false,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get label for priority value
 */
export function getPriorityLabel(priority: TicketPriority): string {
  return PRIORITY_OPTIONS.find(opt => opt.value === priority)?.label || priority;
}

/**
 * Get label for category value
 */
export function getCategoryLabel(category: TicketCategory): string {
  return CATEGORY_OPTIONS.find(opt => opt.value === category)?.label || category;
}

/**
 * Get label for status value
 */
export function getStatusLabel(status: TicketStatus): string {
  return STATUS_OPTIONS.find(opt => opt.value === status)?.label || status;
}
