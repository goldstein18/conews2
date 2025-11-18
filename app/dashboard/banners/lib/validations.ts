import { z } from 'zod';
import { BannerType } from '@/types/banners';

// Market options constants
export const MARKET_OPTIONS = [
  { value: 'miami', label: 'Miami' },
  { value: 'atlanta', label: 'Atlanta' },
  { value: 'tampa', label: 'Tampa' },
  { value: 'orlando', label: 'Orlando' }
] as const;

export const DURATION_OPTIONS = [
  { value: 3, label: '3 Months' },
  { value: 6, label: '6 Months' },
  { value: 12, label: '12 Months' }
] as const;

// Premium banner size options - these are specific size variants for Premium banners
// Independent of MODULE_CONFIGS which defines default dimensions for each banner type
export const PREMIUM_SIZE_OPTIONS = [
  { value: '728x90', label: 'Leaderboard (728×90px)', dimensions: { width: 728, height: 90 } },
  { value: '300x250', label: 'Medium Rectangle (300×250px)', dimensions: { width: 300, height: 250 } },
  { value: '320x50', label: 'Mobile Banner (320×50px)', dimensions: { width: 320, height: 50 } },
  { value: '160x600', label: 'Wide Skyscraper (160×600px)', dimensions: { width: 160, height: 600 } },
  { value: '970x250', label: 'Billboard (970×250px)', dimensions: { width: 970, height: 250 } }
] as const;

// Base banner validation schema
export const bannerBaseSchema = z.object({
  name: z.string()
    .min(1, 'Banner name is required')
    .max(100, 'Banner name must be less than 100 characters')
    .trim(),
  
  market: z.string()
    .min(1, 'Market selection is required')
    .trim(),
  
  link: z.string()
    .url('Please enter a valid URL')
    .trim(),
  
  startDate: z.string()
    .min(1, 'Start date is required'),
  
  endDate: z.string()
    .min(1, 'End date is required'),
  
  companyId: z.string()
    .min(1, 'Company selection is required'),
  
  zoneId: z.string()
    .optional(),
  
  image: z.string()
    .optional()
});

// Dynamic schema creation function for banner type-specific validation
export const createBannerSchema = () => {
  return bannerBaseSchema;
};

// Banner basic form schema (used in step 1 of creation wizard)
export const bannerBasicSchema = () => {
  return z.object({
    name: z.string()
      .min(1, 'Banner name is required')
      .max(100, 'Banner name must be less than 100 characters')
      .trim(),
    
    market: z.string()
      .min(1, 'Market selection is required')
      .trim(),
    
    duration: z.number()
      .min(1, 'Duration is required')
      .int('Duration must be a whole number'),
    
    link: z.string()
      .url('Please enter a valid URL')
      .trim(),
    
    startDate: z.string()
      .min(1, 'Start date is required'),
    
    endDate: z.string()
      .min(1, 'End date is required'),
    
    companyId: z.string()
      .min(1, 'Company selection is required'),
    
    customEndDate: z.boolean(),
    
    additionalMarkets: z.boolean(),
    
    genrePage: z.string()
      .trim()
      .optional()
  });
};

// Banner edit schema (for editing existing banners)
export const bannerEditSchema = () => {
  return bannerBaseSchema;
};

// Banner image form schema (used in step 2 of creation wizard)
export const bannerImageSchema = z.object({
  image: z.string()
    .min(1, 'Banner image is required'),
  
  // Additional fields that might be included in the advanced form
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .trim()
    .optional()
});

// Create banner mutation schema (for GraphQL mutations)
export const createBannerMutationSchema = z.object({
  name: z.string()
    .min(1, 'Banner name is required')
    .trim(),
  
  bannerType: z.nativeEnum(BannerType),
  
  startDate: z.string()
    .min(1, 'Start date is required'),
  
  endDate: z.string()
    .min(1, 'End date is required'),
  
  link: z.string()
    .url('Please enter a valid URL')
    .trim(),
  
  market: z.string()
    .min(1, 'Market is required')
    .trim(),
  
  companyId: z.string()
    .min(1, 'Company ID is required'),
  
  zoneId: z.string().optional(),
  
  image: z.string().optional()
});

// Update banner schema
export const updateBannerSchema = z.object({
  id: z.string().min(1, 'Banner ID is required')
}).merge(bannerBaseSchema.partial());

// Banner filters schema
export const bannerFiltersSchema = z.object({
  search: z.string().trim().optional().default(''),
  status: z.enum(['ALL', 'ACTIVE', 'EXPIRED', 'PENDING']).default('ALL'),
  bannerType: z.enum(['ALL', 'ROS', 'PREMIUM', 'BLUE', 'GREEN', 'RED', 'ESCOOP']).default('ALL'),
  market: z.enum(['ALL', 'miami', 'atlanta', 'tampa', 'orlando']).default('ALL'),
  companyId: z.string().optional().default('')
});

// Banner sort schema
export const bannerSortSchema = z.object({
  field: z.enum(['name', 'createdAt', 'updatedAt', 'startDate', 'endDate', 'market', 'bannerType']).default('createdAt'),
  direction: z.enum(['asc', 'desc']).default('desc')
});

// Export form data types
export type BannerFormData = z.infer<typeof createBannerMutationSchema>;
export type BannerBasicFormData = z.infer<ReturnType<typeof bannerBasicSchema>>;
export type BannerEditFormData = z.infer<ReturnType<typeof bannerEditSchema>>;
export type BannerImageFormData = z.infer<typeof bannerImageSchema>;
export type CreateBannerFormData = z.infer<typeof createBannerMutationSchema>;
export type UpdateBannerFormData = z.infer<typeof updateBannerSchema>;
export type BannerFiltersFormData = z.infer<typeof bannerFiltersSchema>;
export type BannerSortFormData = z.infer<typeof bannerSortSchema>;

// Default values
export const defaultBannerFormValues: Partial<BannerFormData> = {
  name: '',
  link: '',
  market: '',
  companyId: '',
  image: '',
  zoneId: ''
};

export const defaultBannerBasicValues = (): Partial<BannerBasicFormData> => ({
  name: '',
  market: '',
  duration: 3,
  link: '',
  startDate: '',
  endDate: '',
  companyId: '',
  customEndDate: false,
  additionalMarkets: false,
  genrePage: ''
});

export const defaultBannerEditValues = () => ({
  name: '',
  market: '',
  link: '',
  startDate: '',
  endDate: '',
  companyId: '',
  zoneId: '',
  image: ''
});

export const defaultBannerFilters: BannerFiltersFormData = {
  search: '',
  status: 'ALL',
  bannerType: 'ALL',
  market: 'ALL',
  companyId: ''
};

export const defaultBannerSort: BannerSortFormData = {
  field: 'createdAt',
  direction: 'desc'
};