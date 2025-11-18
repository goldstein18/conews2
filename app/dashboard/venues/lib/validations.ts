import { z } from 'zod';
import { VenueType, VenueStatus, DayOfWeek } from '@/types/venues';

// Base venue validation schema
export const venueBaseSchema = z.object({
  name: z.string()
    .min(2, 'Venue name must be at least 2 characters')
    .max(100, 'Venue name must be less than 100 characters')
    .trim(),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
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
  
  website: z.string()
    .refine((url) => {
      if (!url || url.trim() === '') return true; // Allow empty
      // Allow both http:// and https://
      return /^https?:\/\/.+/.test(url);
    }, 'Invalid website URL. Must start with http:// or https://')
    .optional()
    .or(z.literal('')),
  
  venueType: z.nativeEnum(VenueType),
  
  companyId: z.string()
    .min(1, 'Please select a client organization'),

  hostsPrivateEvents: z.boolean().default(false).optional(),
  
  parkingInformation: z.string()
    .max(300, 'Parking information must be less than 300 characters')
    .trim()
    .optional(),
  
  accessibilityFeatures: z.string()
    .max(300, 'Accessibility information must be less than 300 characters')
    .trim()
    .optional(),
  
  adminNotes: z.string()
    .max(500, 'Admin notes must be less than 500 characters')
    .trim()
    .optional(),
  
  image: z.string()
    .min(1, 'Image is required')
    .or(z.literal('REMOVE')), // Special value for staged image removal
  
  imageBig: z.string().optional(),
  
  video: z.string().optional(),
  
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

  metadescription: z.string()
    .max(160, 'Meta description must be less than 160 characters')
    .trim()
    .optional(),
  
  cityId: z.string().optional(),
  
  status: z.nativeEnum(VenueStatus).optional()
});

// Operating hours validation schema
export const operatingHoursSchema = z.object({
  dayOfWeek: z.nativeEnum(DayOfWeek),
  
  startTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
    .refine((time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
    }, 'Invalid time'),
  
  endTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
    .refine((time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
    }, 'Invalid time'),
  
  isClosed: z.boolean().default(false)
}).refine((data) => {
  if (data.isClosed) return true;
  
  const startTime = new Date(`1970-01-01T${data.startTime}:00`);
  const endTime = new Date(`1970-01-01T${data.endTime}:00`);
  
  return startTime < endTime;
}, {
  message: 'End time must be after start time',
  path: ['endTime']
});

// Create operating hours schema
export const createOperatingHoursSchema = z.object({
  venueId: z.string().min(1, 'Venue ID is required')
}).merge(operatingHoursSchema);

// Update operating hours schema
export const updateOperatingHoursSchema = z.object({
  id: z.string().min(1, 'Operating hours ID is required')
}).merge(operatingHoursSchema.partial().omit({ dayOfWeek: true }));

// FAQ validation schema
export const faqSchema = z.object({
  question: z.string()
    .min(10, 'Question must be at least 10 characters')
    .max(200, 'Question must be less than 200 characters')
    .trim(),
  
  answer: z.string()
    .min(20, 'Answer must be at least 20 characters')
    .max(1000, 'Answer must be less than 1000 characters')
    .trim(),
  
  order: z.number()
    .int('Order must be a whole number')
    .min(1, 'Order must be at least 1')
    .default(1),
  
  isActive: z.boolean().default(true)
});

// Create FAQ schema
export const createFAQSchema = z.object({
  venueId: z.string().min(1, 'Venue ID is required')
}).merge(faqSchema);

// Update FAQ schema
export const updateFAQSchema = z.object({
  id: z.string().min(1, 'FAQ ID is required')
}).merge(faqSchema.partial());

// Basic venue schema for step 1 (core fields only)
export const venueBasicSchema = z.object({
  name: venueBaseSchema.shape.name,
  description: venueBaseSchema.shape.description,
  address: venueBaseSchema.shape.address,
  city: venueBaseSchema.shape.city,
  state: venueBaseSchema.shape.state,
  zipcode: venueBaseSchema.shape.zipcode,
  market: venueBaseSchema.shape.market,
  phone: venueBaseSchema.shape.phone,
  website: venueBaseSchema.shape.website,
  venueType: venueBaseSchema.shape.venueType,
  companyId: venueBaseSchema.shape.companyId,
  hostsPrivateEvents: venueBaseSchema.shape.hostsPrivateEvents
});

// Advanced venue schema for step 2 (optional and advanced fields)
export const venueAdvancedSchema = z.object({
  image: venueBaseSchema.shape.image.optional(),
  imageBig: venueBaseSchema.shape.imageBig,
  video: venueBaseSchema.shape.video,
  phone: venueBaseSchema.shape.phone,
  website: venueBaseSchema.shape.website,
  facebook: venueBaseSchema.shape.facebook,
  twitter: venueBaseSchema.shape.twitter,
  instagram: venueBaseSchema.shape.instagram,
  youtube: venueBaseSchema.shape.youtube,
  tiktok: venueBaseSchema.shape.tiktok,
  metadescription: venueBaseSchema.shape.metadescription,
  cityId: venueBaseSchema.shape.cityId,
  parkingInformation: venueBaseSchema.shape.parkingInformation,
  accessibilityFeatures: venueBaseSchema.shape.accessibilityFeatures,
  adminNotes: venueBaseSchema.shape.adminNotes,
  status: venueBaseSchema.shape.status,
  operatingHours: z.array(operatingHoursSchema.omit({ dayOfWeek: true }).extend({
    dayOfWeek: z.nativeEnum(DayOfWeek)
  })).optional().default([]),
  faqs: z.array(faqSchema.omit({ order: true })).optional().default([])
});

// Create venue schema
export const createVenueSchema = venueBaseSchema;

// Update venue schema (all fields optional except id)
export const updateVenueSchema = z.object({
  id: z.string().min(1, 'Venue ID is required')
}).merge(venueBaseSchema.partial());

// Combined venue form schema (includes operating hours and FAQs)
export const venueFormSchema = createVenueSchema.extend({
  operatingHours: z.array(operatingHoursSchema.omit({ dayOfWeek: true }).extend({
    dayOfWeek: z.nativeEnum(DayOfWeek)
  })).optional().default([]),
  
  faqs: z.array(faqSchema.omit({ order: true })).optional().default([])
});

// Filter validation schema
export const venueFiltersSchema = z.object({
  search: z.string().trim().optional().default(''),
  status: z.enum(['ALL', 'PENDING', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED']).default('ALL'),
  priority: z.enum(['ALL', 'LOW', 'MEDIUM', 'HIGH']).default('ALL'),
  city: z.string().trim().optional().default('')
});

// Sort validation schema
export const venueSortSchema = z.object({
  field: z.enum(['name', 'createdAt', 'updatedAt', 'priority', 'status', 'city']).default('createdAt'),
  direction: z.enum(['asc', 'desc']).default('desc')
});

// Image upload validation schema
export const venueImageSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed'
    ),
  
  type: z.enum(['main', 'gallery']).default('main')
});

// Multiple images validation
export const venueImagesSchema = z.object({
  images: z.array(venueImageSchema)
    .min(3, 'At least 3 images are required')
    .max(10, 'Maximum 10 images allowed')
});

// Export form data types
export type CreateVenueFormData = z.infer<typeof createVenueSchema>;
export type UpdateVenueFormData = z.infer<typeof updateVenueSchema>;
export type VenueFormData = z.infer<typeof venueFormSchema>;
export type VenueBasicFormData = z.infer<typeof venueBasicSchema>;
export type VenueAdvancedFormData = z.infer<typeof venueAdvancedSchema>;
export type OperatingHoursFormData = z.infer<typeof operatingHoursSchema> & { id?: string };
export type CreateOperatingHoursFormData = z.infer<typeof createOperatingHoursSchema>;
export type UpdateOperatingHoursFormData = z.infer<typeof updateOperatingHoursSchema>;
export type FAQFormData = z.infer<typeof faqSchema> & { id?: string };
export type CreateFAQFormData = z.infer<typeof createFAQSchema>;
export type UpdateFAQFormData = z.infer<typeof updateFAQSchema>;
export type VenueFiltersFormData = z.infer<typeof venueFiltersSchema>;
export type VenueSortFormData = z.infer<typeof venueSortSchema>;
export type VenueImageFormData = z.infer<typeof venueImageSchema>;
export type VenueImagesFormData = z.infer<typeof venueImagesSchema>;

// Default values
export const defaultVenueFormValues: Partial<VenueFormData> = {
  name: '',
  description: '',
  address: '',
  city: '',
  state: '',
  zipcode: '',
  market: '',
  phone: '',
  website: '',
  venueType: VenueType.THEATER,
  companyId: '',
  image: '',
  imageBig: '',
  video: '',
  facebook: '',
  twitter: '',
  instagram: '',
  youtube: '',
  tiktok: '',
  metadescription: '',
  cityId: '',
  hostsPrivateEvents: false,
  parkingInformation: '',
  accessibilityFeatures: '',
  adminNotes: '',
  operatingHours: [],
  faqs: []
};

export const defaultOperatingHoursValues: OperatingHoursFormData = {
  dayOfWeek: DayOfWeek.MONDAY,
  startTime: '09:00',
  endTime: '17:00',
  isClosed: false
};

export const defaultFAQValues: FAQFormData = {
  question: '',
  answer: '',
  order: 1,
  isActive: true
};

export const defaultVenueFilters: VenueFiltersFormData = {
  search: '',
  status: 'ALL',
  priority: 'ALL',
  city: ''
};

export const defaultVenueSort: VenueSortFormData = {
  field: 'createdAt',
  direction: 'desc'
};