import { z } from 'zod';
import { DedicatedStatus } from '@/types/dedicated';

// Market options (standardized across all modules)
export const MARKET_OPTIONS = [
  { value: 'miami', label: 'Miami' },
  { value: 'palm-beach', label: 'Palm Beach' },
  { value: 'tampa', label: 'Tampa' },
  { value: 'atlanta', label: 'Atlanta' }
] as const;

// Status options
export const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Status' },
  { value: DedicatedStatus.PENDING, label: 'Pending' },
  { value: DedicatedStatus.SCHEDULED, label: 'Scheduled' },
  { value: DedicatedStatus.SENT, label: 'Sent' }
] as const;

// Base schema for dedicated campaigns
export const dedicatedBaseSchema = z.object({
  subject: z.string()
    .min(1, 'Email subject is required')
    .max(200, 'Subject must be less than 200 characters')
    .trim(),

  alternateText: z.string()
    .min(1, 'Alternate text is required')
    .max(500, 'Alternate text must be less than 500 characters')
    .trim(),

  link: z.string()
    .url('Please enter a valid URL')
    .trim(),

  sendDate: z.string()
    .min(1, 'Send date is required'),

  market: z.string()
    .min(1, 'Market is required')
    .trim(),

  companyId: z.string()
    .min(1, 'Please select a client organization')
});

// Step 1: Basic form schema (creates dedicated with placeholder)
export const dedicatedBasicSchema = dedicatedBaseSchema;

export type DedicatedBasicFormData = z.infer<typeof dedicatedBasicSchema>;

// Step 2: Campaign form schema (image + Brevo settings)
export const dedicatedCampaignSchema = z.object({
  image: z.string()
    .min(1, 'Campaign image is required'),

  selectedBrevoLists: z.array(z.string())
    .min(1, 'Please select at least one Brevo list'),

  selectedBrevoSegments: z.array(z.string())
    .optional(),

  exclusionListIds: z.array(z.string())
    .optional()
});

export type DedicatedCampaignFormData = z.infer<typeof dedicatedCampaignSchema>;

// Edit schemas
export const dedicatedEditBasicSchema = z.object({
  subject: z.string()
    .min(1, 'Email subject is required')
    .max(200, 'Subject must be less than 200 characters')
    .trim(),

  alternateText: z.string()
    .min(1, 'Alternate text is required')
    .max(500, 'Alternate text must be less than 500 characters')
    .trim(),

  link: z.string()
    .url('Please enter a valid URL')
    .trim(),

  sendDate: z.string()
    .min(1, 'Send date is required'),

  market: z.string()
    .min(1, 'Market is required')
    .trim(),

  image: z.string().optional()
});

export type DedicatedEditBasicFormData = z.infer<typeof dedicatedEditBasicSchema>;

export const dedicatedEditCampaignSchema = dedicatedCampaignSchema;

export type DedicatedEditCampaignFormData = z.infer<typeof dedicatedEditCampaignSchema>;

// Filter schema
export const dedicatedFilterSchema = z.object({
  searchTerm: z.string().optional(),
  status: z.string().optional(),
  market: z.string().optional()
});

export type DedicatedFilterFormData = z.infer<typeof dedicatedFilterSchema>;

// Sort schema
export const dedicatedSortSchema = z.object({
  field: z.enum(['subject', 'sendDate', 'status', 'market']),
  direction: z.enum(['asc', 'desc'])
});

export type DedicatedSortFormData = z.infer<typeof dedicatedSortSchema>;

// Default values
export const defaultDedicatedBasicValues: DedicatedBasicFormData = {
  subject: '',
  alternateText: '',
  link: '',
  sendDate: '',
  market: 'miami',
  companyId: ''
};

export const defaultDedicatedCampaignValues: DedicatedCampaignFormData = {
  image: '',
  selectedBrevoLists: [],
  selectedBrevoSegments: [],
  exclusionListIds: []
};

export const defaultDedicatedFilterValues: DedicatedFilterFormData = {
  searchTerm: '',
  status: 'ALL',
  market: 'all'
};

export const defaultDedicatedSort: DedicatedSortFormData = {
  field: 'sendDate',
  direction: 'desc'
};
