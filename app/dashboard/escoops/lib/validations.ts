import { z } from 'zod';
import { EscoopStatus, LOCATION_OPTIONS } from '@/types/escoops';

// Location options for validation
export const LOCATION_VALUES = LOCATION_OPTIONS.map(option => option.value);

// Market options
export const MARKET_OPTIONS = [
  { value: 'miami', label: 'Miami' },
  { value: 'palm-beach', label: 'Palm Beach' },
  { value: 'tampa', label: 'Tampa' },
  { value: 'atlanta', label: 'Atlanta' }
] as const;

// Status options for filters
export const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Status', color: 'bg-gray-100 text-gray-800' },
  { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'SCHEDULED', label: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
  { value: 'SENT', label: 'Sent', color: 'bg-green-100 text-green-800' }
] as const;

// Base escoop validation schema
export const escoopBaseSchema = z.object({
  name: z.string()
    .min(1, 'Escoop name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),

  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),

  sendDate: z.date({
    message: 'Send date is required'
  }),

  locations: z.array(z.string())
    .min(1, 'Please select at least one location')
    .refine(
      (locations) => locations.every(loc => LOCATION_VALUES.includes(loc)),
      'Invalid location selected'
    ),

  remaining: z.number()
    .min(0, 'Remaining count cannot be negative')
    .max(1000, 'Remaining count seems too high'),

  bannersRemaining: z.number()
    .min(0, 'Banner remaining count cannot be negative')
    .max(100, 'Banner remaining count seems too high')
});

// Create escoop schema
export const createEscoopSchema = escoopBaseSchema;

// Update escoop schema (all fields optional except ID)
export const updateEscoopSchema = z.object({
  id: z.string().min(1, 'Escoop ID is required'),
  name: z.string()
    .min(1, 'Escoop name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .optional(),

  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim()
    .optional(),

  sendDate: z.date({
    message: 'Send date is required'
  }).optional(),

  locations: z.array(z.string())
    .min(1, 'Please select at least one location')
    .refine(
      (locations) => locations.every(loc => LOCATION_VALUES.includes(loc)),
      'Invalid location selected'
    )
    .optional(),

  remaining: z.number()
    .min(0, 'Remaining count cannot be negative')
    .max(1000, 'Remaining count seems too high')
    .optional(),

  bannersRemaining: z.number()
    .min(0, 'Banner remaining count cannot be negative')
    .max(100, 'Banner remaining count seems too high')
    .optional(),

  status: z.nativeEnum(EscoopStatus).optional()
});

// Filter schema for list page
export const escoopFiltersSchema = z.object({
  first: z.number().optional(),
  after: z.string().optional(),
  before: z.string().optional(),
  search: z.string().optional(),
  status: z.nativeEnum(EscoopStatus).optional(),
  market: z.string().optional(),
  sent: z.boolean().optional(),
  includeTotalCount: z.boolean().optional(),
  locations: z.array(z.string()).optional()
});

// Export types
export type EscoopFormData = z.infer<typeof escoopBaseSchema>;
export type CreateEscoopFormData = z.infer<typeof createEscoopSchema>;
export type UpdateEscoopFormData = z.infer<typeof updateEscoopSchema>;
export type EscoopFiltersData = z.infer<typeof escoopFiltersSchema>;

// Additional edit form type for better type safety
export interface EscoopEditFormData extends Omit<UpdateEscoopFormData, 'sendDate'> {
  sendDate?: Date;
}

// Default form values
export const defaultEscoopValues: EscoopFormData = {
  name: '',
  title: 'Your Guide to Upcoming Culture',
  sendDate: new Date(),
  remaining: 16,
  bannersRemaining: 5,
  locations: []
};

// Helper function to get market from locations
export const getMarketFromLocations = (locations: string[]): string => {
  if (locations.length === 0) return '';

  // Get unique markets from selected locations
  const markets = locations
    .map(location => LOCATION_OPTIONS.find(opt => opt.value === location)?.market)
    .filter((market, index, array) => market && array.indexOf(market) === index);

  // If all locations are from the same market, return that market
  if (markets.length === 1) {
    return markets[0]!;
  }

  // If multiple markets, return the first one (or you could return 'mixed')
  return markets[0] || 'miami';
};