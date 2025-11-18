import { z } from 'zod';
import { PriceRange, RestaurantStatus, DayOfWeek } from '@/types/restaurants';

// Price range options
export const PRICE_RANGE_OPTIONS = [
  { value: PriceRange.BUDGET, label: 'Budget ($)' },
  { value: PriceRange.MODERATE, label: 'Moderate ($$)' },
  { value: PriceRange.UPSCALE, label: 'Upscale ($$$)' },
  { value: PriceRange.FINE_DINING, label: 'Fine Dining ($$$$)' }
] as const;

// Status options
export const RESTAURANT_STATUS_OPTIONS = [
  { value: RestaurantStatus.PENDING, label: 'Pending' },
  { value: RestaurantStatus.APPROVED, label: 'Approved' },
  { value: RestaurantStatus.DECLINED, label: 'Declined' },
  { value: RestaurantStatus.DELETED, label: 'Deleted' }
] as const;

// Amenities options
export const AMENITIES_OPTIONS = [
  { value: 'parking', label: 'Parking' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'outdoor_seating', label: 'Outdoor Seating' },
  { value: 'live_music', label: 'Live Music' },
  { value: 'private_dining', label: 'Private Dining' },
  { value: 'takeout', label: 'Takeout' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'catering', label: 'Catering' },
  { value: 'bar', label: 'Full Bar' },
  { value: 'happy_hour', label: 'Happy Hour' },
  { value: 'brunch', label: 'Brunch' },
  { value: 'kid_friendly', label: 'Kid Friendly' },
  { value: 'pet_friendly', label: 'Pet Friendly' },
  { value: 'wheelchair_accessible', label: 'Wheelchair Accessible' }
] as const;

// Markets options - these should match your actual markets
export const MARKET_OPTIONS = [
  { value: 'miami', label: 'Miami' },
  { value: 'orlando', label: 'Orlando' },
  { value: 'tampa', label: 'Tampa' },
  { value: 'jacksonville', label: 'Jacksonville' },
  { value: 'fort_lauderdale', label: 'Fort Lauderdale' }
] as const;

// Day of week options for operating hours
export const DAY_OF_WEEK_OPTIONS = [
  { value: DayOfWeek.MONDAY, label: 'Monday' },
  { value: DayOfWeek.TUESDAY, label: 'Tuesday' },
  { value: DayOfWeek.WEDNESDAY, label: 'Wednesday' },
  { value: DayOfWeek.THURSDAY, label: 'Thursday' },
  { value: DayOfWeek.FRIDAY, label: 'Friday' },
  { value: DayOfWeek.SATURDAY, label: 'Saturday' },
  { value: DayOfWeek.SUNDAY, label: 'Sunday' }
] as const;

// Base restaurant validation schema
export const restaurantBaseSchema = z.object({
  name: z.string()
    .min(2, 'Restaurant name must be at least 2 characters')
    .max(100, 'Restaurant name must be less than 100 characters')
    .trim(),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .trim(),
  
  address: z.string()
    .min(5, 'Street address must be at least 5 characters')
    .max(200, 'Street address must be less than 200 characters')
    .trim(),
  
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .trim(),
  
  state: z.string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be less than 50 characters')
    .trim(),
  
  zipcode: z.string()
    .min(5, 'ZIP code must be at least 5 characters')
    .max(10, 'ZIP code must be less than 10 characters')
    .regex(/^[0-9]{5}(?:-[0-9]{4})?$/, 'Invalid ZIP code format')
    .trim(),
  
  market: z.string()
    .min(1, 'Market is required')
    .trim(),
  
  phone: z.string()
    .regex(/^(\+1-?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  
  email: z.string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  
  website: z.string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),
  
  restaurantTypeId: z.string()
    .min(1, 'Please select a cuisine type'),
  
  priceRange: z.nativeEnum(PriceRange),
  
  companyId: z.string()
    .min(1, 'Please select a client organization'),
  
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

// Basic form schema for Step 1
export const restaurantBasicSchema = z.object({
  // ID field (optional, only present when editing)
  id: z.string().optional(),

  name: z.string()
    .min(2, 'Restaurant name must be at least 2 characters')
    .max(100, 'Restaurant name must be less than 100 characters')
    .trim(),

  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .trim(),

  address: z.string()
    .min(5, 'Street address must be at least 5 characters')
    .max(200, 'Street address must be less than 200 characters')
    .trim(),

  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .trim(),

  state: z.string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be less than 50 characters')
    .trim(),

  zipcode: z.string()
    .min(5, 'ZIP code must be at least 5 characters')
    .max(10, 'ZIP code must be less than 10 characters')
    .regex(/^[0-9]{5}(?:-[0-9]{4})?$/, 'Invalid ZIP code format')
    .trim(),

  market: z.string()
    .min(1, 'Market is required')
    .trim(),

  phone: z.string()
    .regex(/^(\+1-?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),

  email: z.string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),

  website: z.string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),

  restaurantTypeId: z.string()
    .min(1, 'Please select a cuisine type'),

  priceRange: z.nativeEnum(PriceRange),

  companyId: z.string()
    .min(1, 'Please select a client organization'),
  
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

// Advanced form schema for Step 2
export const restaurantAdvancedSchema = z.object({
  image: z.string()
    .min(1, 'Restaurant image is required')
    .or(z.literal('REMOVE')), // Special value for staged image removal
  
  facebook: z.string()
    .url('Invalid Facebook URL')
    .optional()
    .or(z.literal('')),
  
  twitter: z.string()
    .url('Invalid Twitter URL')
    .optional()
    .or(z.literal('')),
  
  instagram: z.string()
    .url('Invalid Instagram URL')
    .optional()
    .or(z.literal('')),
  
  youtube: z.string()
    .url('Invalid YouTube URL')
    .optional()
    .or(z.literal('')),

  tiktok: z.string()
    .url('Invalid TikTok URL')
    .optional()
    .or(z.literal('')),

  menuLink: z.string()
    .url('Invalid menu link URL')
    .optional()
    .or(z.literal('')),
  
  dietaryOptions: z.array(z.string()),
  
  amenities: z.array(z.string())
});

// Operating hours schema
export const operatingHoursSchema = z.object({
  dayOfWeek: z.nativeEnum(DayOfWeek),
  startTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
    .optional(),
  endTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
    .optional(),
  isClosed: z.boolean()
}).refine((data) => {
  // If not closed, both start and end time are required
  if (!data.isClosed) {
    return data.startTime && data.endTime;
  }
  return true;
}, {
  message: 'Start time and end time are required when restaurant is open',
  path: ['startTime']
});

// Complete restaurant creation schema (combining both steps)
export const restaurantCreateSchema = restaurantBaseSchema.extend({
  image: z.string()
    .min(1, 'Restaurant image is required')
    .or(z.literal('REMOVE')),
  
  facebook: z.string()
    .url('Invalid Facebook URL')
    .optional()
    .or(z.literal('')),
  
  twitter: z.string()
    .url('Invalid Twitter URL')
    .optional()
    .or(z.literal('')),
  
  instagram: z.string()
    .url('Invalid Instagram URL')
    .optional()
    .or(z.literal('')),
  
  youtube: z.string()
    .url('Invalid YouTube URL')
    .optional()
    .or(z.literal('')),

  tiktok: z.string()
    .url('Invalid TikTok URL')
    .optional()
    .or(z.literal('')),

  menuLink: z.string()
    .url('Invalid menu link URL')
    .optional()
    .or(z.literal('')),
  
  dietaryOptions: z.array(z.string()),
  
  amenities: z.array(z.string()),
  
  operatingHours: z.array(operatingHoursSchema).optional()
});

// Edit form schema (includes all fields plus admin fields)
export const restaurantEditSchema = z.object({
  // Required fields from base schema
  id: z.string().min(1, 'Restaurant ID is required'),
  name: z.string().min(1, 'Restaurant name is required').trim(),
  description: z.string().min(10, 'Description must be at least 10 characters').trim(),
  address: z.string().min(1, 'Address is required').trim(),
  city: z.string().min(1, 'City is required').trim(),
  state: z.string().min(1, 'State is required').trim(),
  zipcode: z.string().min(1, 'Zip code is required').trim(),
  market: z.string().min(1, 'Market is required'),
  restaurantTypeId: z.string().min(1, 'Restaurant type is required'),
  priceRange: z.nativeEnum(PriceRange),
  companyId: z.string().min(1, 'Company is required'),
  
  // Optional fields
  phone: z.string().trim().optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  
  // Image field
  image: z.string().min(1, 'Restaurant image is required').or(z.literal('REMOVE')),
  
  // Social media links
  facebook: z.string().url('Invalid Facebook URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
  instagram: z.string().url('Invalid Instagram URL').optional().or(z.literal('')),
  youtube: z.string().url('Invalid YouTube URL').optional().or(z.literal('')),
  tiktok: z.string().url('Invalid TikTok URL').optional().or(z.literal('')),
  menuLink: z.string().url('Invalid menu link URL').optional().or(z.literal('')),
  
  // Array fields
  dietaryOptions: z.array(z.string()),
  amenities: z.array(z.string()),
  
  // Operating hours
  operatingHours: z.array(operatingHoursSchema).optional(),
  
  // Admin fields
  status: z.nativeEnum(RestaurantStatus).optional(),
  adminNotes: z.string()
    .max(500, 'Admin notes must be less than 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  declinedReason: z.string()
    .max(500, 'Declined reason must be less than 500 characters')
    .trim()
    .optional()
    .or(z.literal(''))
});

// Image upload schema
export const restaurantImageSchema = z.object({
  image: z.string().min(1, 'Image is required')
});

// Filter schema for search and filtering
export const restaurantFilterSchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(RestaurantStatus).optional(),
  priceRange: z.nativeEnum(PriceRange).optional(),
  city: z.string().optional(),
  market: z.string().optional(),
  cuisineType: z.string().optional()
});

// Export TypeScript types
export type RestaurantBasicFormData = z.infer<typeof restaurantBasicSchema>;
export type RestaurantAdvancedFormData = z.infer<typeof restaurantAdvancedSchema>;
export type RestaurantCreateFormData = z.infer<typeof restaurantCreateSchema>;
export type RestaurantEditFormData = z.infer<typeof restaurantEditSchema>;
export type OperatingHoursFormData = z.infer<typeof operatingHoursSchema>;
export type RestaurantFilterFormData = z.infer<typeof restaurantFilterSchema>;

// Default values for forms
export const defaultRestaurantBasicValues: Partial<RestaurantBasicFormData> = {
  name: '',
  description: '',
  address: '',
  city: '',
  state: '',
  zipcode: '',
  market: '',
  phone: '',
  email: '',
  website: '',
  restaurantTypeId: '',
  priceRange: PriceRange.MODERATE,
  companyId: ''
};

export const defaultRestaurantAdvancedValues: RestaurantAdvancedFormData = {
  image: '',
  facebook: '',
  twitter: '',
  instagram: '',
  youtube: '',
  tiktok: '',
  menuLink: '',
  dietaryOptions: [],
  amenities: []
};

export const defaultOperatingHoursValues: OperatingHoursFormData[] = [
  { dayOfWeek: DayOfWeek.MONDAY, startTime: '09:00', endTime: '21:00', isClosed: false },
  { dayOfWeek: DayOfWeek.TUESDAY, startTime: '09:00', endTime: '21:00', isClosed: false },
  { dayOfWeek: DayOfWeek.WEDNESDAY, startTime: '09:00', endTime: '21:00', isClosed: false },
  { dayOfWeek: DayOfWeek.THURSDAY, startTime: '09:00', endTime: '21:00', isClosed: false },
  { dayOfWeek: DayOfWeek.FRIDAY, startTime: '09:00', endTime: '22:00', isClosed: false },
  { dayOfWeek: DayOfWeek.SATURDAY, startTime: '09:00', endTime: '22:00', isClosed: false },
  { dayOfWeek: DayOfWeek.SUNDAY, startTime: '10:00', endTime: '20:00', isClosed: false }
];

export const defaultRestaurantFilterValues: RestaurantFilterFormData = {
  search: '',
  status: undefined,
  priceRange: undefined,
  city: '',
  market: '',
  cuisineType: ''
};