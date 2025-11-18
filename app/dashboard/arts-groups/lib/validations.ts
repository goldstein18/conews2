import { z } from 'zod';
import { ArtsGroupSortField, ArtsGroupSortDirection } from '@/types/arts-groups';

// Art Type Options
export const ART_TYPE_OPTIONS = [
  { value: 'Dance', label: 'Dance' },
  { value: 'Folk Arts', label: 'Folk Arts' },
  { value: 'Music', label: 'Music' },
  { value: 'Visual Arts', label: 'Visual Arts' },
  { value: 'Theater', label: 'Theater' },
  { value: 'Other', label: 'Other' }
] as const;

// Market Options
export const MARKET_OPTIONS = [
  { value: 'miami', label: 'Miami' },
  { value: 'palm-beach', label: 'Palm Beach' },
  { value: 'tampa', label: 'Tampa' },
  { value: 'atlanta', label: 'Atlanta' }
] as const;

// Base Schema (shared fields)
export const artsGroupBaseSchema = z.object({
  name: z.string()
    .min(2, 'Arts group name must be at least 2 characters')
    .max(100, 'Arts group name must be less than 100 characters')
    .trim(),

  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),

  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters')
    .trim(),

  market: z.string()
    .min(1, 'Market is required')
    .trim(),

  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),

  email: z.string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),

  website: z.string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),

  artType: z.string()
    .optional()
    .or(z.literal('')),

  memberCount: z.number()
    .int('Member count must be a whole number')
    .positive('Member count must be positive')
    .optional()
    .or(z.literal(0)),

  foundedYear: z.number()
    .int('Founded year must be a whole number')
    .min(1800, 'Founded year must be after 1800')
    .max(new Date().getFullYear(), 'Founded year cannot be in the future')
    .optional()
    .or(z.literal(0)),

  companyId: z.string()
    .min(1, 'Please select a client organization')
});

// Step 1: Basic Form Schema (Create)
export const artsGroupBasicSchema = z.object({
  name: z.string()
    .min(2, 'Arts group name must be at least 2 characters')
    .max(100, 'Arts group name must be less than 100 characters')
    .trim(),

  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters')
    .trim(),

  market: z.string()
    .min(1, 'Market is required')
    .trim(),

  artType: z.string()
    .optional()
    .or(z.literal('')),

  companyId: z.string()
    .min(1, 'Please select a client organization'),

  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),

  email: z.string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),

  website: z.string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal(''))
});

// Step 2: Advanced Form Schema (Create)
export const artsGroupAdvancedSchema = z.object({
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),

  image: z.string().optional(),

  memberCount: z.number()
    .int('Member count must be a whole number')
    .positive('Member count must be positive')
    .optional(),

  foundedYear: z.number()
    .int('Founded year must be a whole number')
    .min(1800, 'Founded year must be after 1800')
    .max(new Date().getFullYear(), 'Founded year cannot be in the future')
    .optional()
});

// Complete Create Schema
export const createArtsGroupSchema = artsGroupBaseSchema.extend({
  image: z.string().optional()
});

// Update Schema (all fields optional except id)
export const updateArtsGroupSchema = z.object({
  id: z.string().min(1, 'Arts group ID is required'),
  name: z.string()
    .min(2, 'Arts group name must be at least 2 characters')
    .max(100, 'Arts group name must be less than 100 characters')
    .trim()
    .optional(),

  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),

  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters')
    .trim()
    .optional(),

  market: z.string()
    .min(1, 'Market is required')
    .trim()
    .optional(),

  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),

  email: z.string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),

  website: z.string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),

  image: z.string().optional(),

  artType: z.string()
    .optional()
    .or(z.literal('')),

  memberCount: z.number()
    .int('Member count must be a whole number')
    .positive('Member count must be positive')
    .optional(),

  foundedYear: z.number()
    .int('Founded year must be a whole number')
    .min(1800, 'Founded year must be after 1800')
    .max(new Date().getFullYear(), 'Founded year cannot be in the future')
    .optional(),

  status: z.enum(['PENDING', 'APPROVED', 'DECLINED'])
    .optional()
});

// Filter Schema
export const artsGroupFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  status: z.string().optional(),
  market: z.string().optional(),
  artType: z.string().optional()
});

// Sort Schema
export const artsGroupSortSchema = z.object({
  field: z.enum(['name', 'createdAt', 'updatedAt', 'market', 'artType']),
  direction: z.enum(['asc', 'desc'])
});

// Type Exports
export type ArtsGroupBasicFormData = z.infer<typeof artsGroupBasicSchema>;
export type ArtsGroupAdvancedFormData = z.infer<typeof artsGroupAdvancedSchema>;
export type CreateArtsGroupFormData = z.infer<typeof createArtsGroupSchema>;
export type UpdateArtsGroupFormData = z.infer<typeof updateArtsGroupSchema>;
export type ArtsGroupFiltersFormData = z.infer<typeof artsGroupFiltersSchema>;
export type ArtsGroupSortFormData = z.infer<typeof artsGroupSortSchema>;

// Default Values
export const defaultArtsGroupFormValues: Partial<CreateArtsGroupFormData> = {
  name: '',
  description: '',
  address: '',
  market: 'miami',
  phone: '',
  email: '',
  website: '',
  artType: '',
  memberCount: undefined,
  foundedYear: undefined,
  companyId: '',
  image: ''
};

export const defaultArtsGroupFilters = {
  searchTerm: '',
  status: 'ALL' as const,
  market: '',
  artType: ''
};

export const defaultArtsGroupSort = {
  field: ArtsGroupSortField.CREATED_AT,
  direction: ArtsGroupSortDirection.DESC
};
