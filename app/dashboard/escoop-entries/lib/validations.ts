import { z } from 'zod';
import { AVAILABLE_LOCATIONS } from '@/types/escoop-entries';

// Constants for form options
export const LOCATION_OPTIONS = AVAILABLE_LOCATIONS.map(location => ({
  value: location,
  label: location
}));

// Base escoop entry schema
export const escoopEntryBaseSchema = z.object({
  escoopId: z.string().min(1, 'Please select an escoop'),
  eventId: z.string().min(1, 'Please select an event'),
  locations: z.array(z.string()).min(1, 'Please select at least one location'),
  companyId: z.string().optional(), // Will be made required conditionally
});

// Create escoop entry schema - dynamic based on user role
export const createEscoopEntrySchema = (requireCompany = false) => {
  if (requireCompany) {
    return escoopEntryBaseSchema.extend({
      companyId: z.string().min(1, 'Please select a company'),
    });
  }
  return escoopEntryBaseSchema;
};

// Update escoop entry schema
export const updateEscoopEntrySchema = z.object({
  id: z.string().min(1, 'ID is required'),
  status: z.enum(['PENDING', 'APPROVED', 'DECLINED', 'DELETED', 'EXPIRED']).optional(),
  locations: z.array(z.string()).min(1, 'Please select at least one location').optional(),
  approvalReason: z.string().optional(),
}).refine((data) => {
  // If status is APPROVED, DECLINED, DELETED, or EXPIRED, approvalReason should be provided
  if ((data.status === 'APPROVED' || data.status === 'DECLINED' || data.status === 'DELETED' || data.status === 'EXPIRED') && !data.approvalReason) {
    return false;
  }
  return true;
}, {
  message: 'Approval reason is required when changing status',
  path: ['approvalReason'],
});

// Update escoop entry schema with selectors (for edit form)
export const updateEscoopEntryWithSelectorsSchema = (requireCompany = false) => {
  const baseSchema = z.object({
    id: z.string().min(1, 'ID is required'),
    escoopId: z.string().min(1, 'Please select an escoop'),
    eventId: z.string().min(1, 'Please select an event'),
    status: z.enum(['PENDING', 'APPROVED', 'DECLINED', 'DELETED', 'EXPIRED']).optional(),
    locations: z.array(z.string()).min(1, 'Please select at least one location'),
    approvalReason: z.string().optional(),
    companyId: z.string().optional(),
  }).refine((data) => {
    // If status is APPROVED, DECLINED, DELETED, or EXPIRED, approvalReason should be provided
    if ((data.status === 'APPROVED' || data.status === 'DECLINED' || data.status === 'DELETED' || data.status === 'EXPIRED') && !data.approvalReason) {
      return false;
    }
    return true;
  }, {
    message: 'Approval reason is required when changing status',
    path: ['approvalReason'],
  });

  if (requireCompany) {
    return baseSchema.extend({
      companyId: z.string().min(1, 'Please select a company'),
    });
  }
  return baseSchema;
};

// Search schemas
export const escoopSearchSchema = z.object({
  search: z.string().optional(),
  market: z.string().optional(),
  status: z.string().optional(),
});

export const eventSearchSchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  status: z.string().optional(),
});

// Export types
export type EscoopEntryFormData = z.infer<typeof escoopEntryBaseSchema>;
export type UpdateEscoopEntryFormData = z.infer<typeof updateEscoopEntrySchema>;
export type UpdateEscoopEntryWithSelectorsFormData = z.infer<ReturnType<typeof updateEscoopEntryWithSelectorsSchema>>;
export type EscoopSearchFormData = z.infer<typeof escoopSearchSchema>;
export type EventSearchFormData = z.infer<typeof eventSearchSchema>;

// Default values
export const defaultEscoopEntryValues: Partial<EscoopEntryFormData> = {
  escoopId: '',
  eventId: '',
  locations: [],
};

export const defaultUpdateEscoopEntryValues: Partial<UpdateEscoopEntryFormData> = {
  id: '',
  status: undefined,
  locations: [],
  approvalReason: '',
};