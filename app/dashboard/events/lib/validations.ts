import { z } from 'zod';

// Helper function for URL validation
const createOptionalUrlSchema = (fieldName: string) => 
  z.string()
    .optional()
    .or(z.literal(''))
    .refine((val) => {
      if (!val || val === '') return true;
      try {
        const url = new URL(val);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    }, `Please enter a valid ${fieldName} URL (must start with http:// or https://)`);

// Event types
export const EVENT_TYPES = [
  { value: 'SINGLE', label: 'Single Event' },
  { value: 'RECURRING', label: 'Recurring Events' }
] as const;

// Event status options
export const EVENT_STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING', label: 'Pending Review' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'CANCELLED', label: 'Cancelled' }
] as const;

// Market options
export const MARKET_OPTIONS = [
  { value: 'miami', label: 'Miami' },
  { value: 'palm-beach', label: 'Palm Beach' },
  { value: 'tampa', label: 'Tampa' },
  { value: 'atlanta', label: 'Atlanta' }
] as const;

// Video type options
export const VIDEO_TYPE_OPTIONS = [
  { value: 'YOUTUBE', label: 'YouTube' },
  { value: 'VIMEO', label: 'Vimeo' },
  { value: 'FACEBOOK', label: 'Facebook' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'TIKTOK', label: 'TikTok' },
  { value: 'DIRECT', label: 'Direct Video' },
  { value: 'OTHER', label: 'Other' }
] as const;

// Performer type options
export const PERFORMER_TYPE_OPTIONS = [
  { value: 'ARTIST', label: 'Artist' },
  { value: 'SPEAKER', label: 'Speaker' },
  { value: 'GUEST', label: 'Guest' }
] as const;

// Base event schema for all forms
export const eventBaseSchema = z.object({
  title: z.string()
    .min(5, 'Event title must be at least 5 characters')
    .max(75, 'Event title must be less than 75 characters')
    .trim(),
  
  summary: z.string()
    .max(140, 'Summary must be less than 140 characters')
    .optional()
    .or(z.literal('')),
  
  description: z.string()
    .optional()
    .or(z.literal('')),
  
  companyId: z.string()
    .min(1, 'Please select a client organization'),
  
  market: z.string()
    .min(1, 'Market is required'),
    
  free: z.boolean().default(false),
  virtual: z.boolean().default(false)
});

// Create dynamic schema based on user permissions
export const createEventBasicSchema = (canSelectCompany?: boolean) => {
  return z.object({
    title: z.string()
      .min(5, 'Event title must be at least 5 characters')
      .max(75, 'Event title must be less than 75 characters')
      .trim(),

    summary: z.string()
      .max(140, 'Summary must be less than 140 characters')
      .optional()
      .or(z.literal('')),

    description: z.string()
      .optional()
      .or(z.literal('')),

    // CompanyId only required for super admin/admin users
    companyId: canSelectCompany
      ? z.string().min(1, 'Please select a client organization')
      : z.string().optional(), // Optional for regular users (set automatically)

    // Tags (required)
    mainGenreId: z.string()
      .min(1, 'Main genre is required'),

    subgenreId: z.string()
      .min(1, 'Subgenre is required'),

    supportingTagIds: z.array(z.string())
      .default([]),

    audienceTagIds: z.array(z.string())
      .default([])
  });
};

// Default schema for backward compatibility
export const eventBasicSchema = createEventBasicSchema(true);

// Time slot schema for recurring events
export const timeSlotSchema = z.object({
  id: z.string(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  duration: z.string()
}).refine((data) => {
  // Validate that end time is after start time
  return data.endTime > data.startTime;
}, {
  message: 'End time must be after start time',
  path: ['endTime']
});

// Recurring date schema
export const recurringDateSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  repeats: z.enum(['once', 'daily', 'weekly', 'monthly']),
  timeSlots: z.array(timeSlotSchema).min(1, 'At least one time slot is required')
}).refine((data) => {
  // Validate that date is not in the past
  const selectedDate = new Date(data.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return selectedDate >= today;
}, {
  message: 'Cannot select past dates',
  path: ['date']
}).refine((data) => {
  // Check for time slot overlaps
  if (data.timeSlots.length < 2) return true;
  
  const sortedSlots = [...data.timeSlots].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );
  
  for (let i = 0; i < sortedSlots.length - 1; i++) {
    const current = sortedSlots[i];
    const next = sortedSlots[i + 1];
    
    if (current.endTime > next.startTime) {
      return false;
    }
  }
  
  return true;
}, {
  message: 'Time slots cannot overlap',
  path: ['timeSlots']
});

// Dynamic schema function for Step 2: Date & Location
export const createEventDetailsSchema = (eventType?: 'SINGLE' | 'RECURRING', virtual?: boolean) => {
  return z.object({
    eventType: z.enum(['SINGLE', 'RECURRING']),
    
    // Single event fields - required when eventType is SINGLE
    date: eventType === 'SINGLE' 
      ? z.string().min(1, 'Date is required for single events')
      : z.string().optional().or(z.literal('')),
    
    startTime: eventType === 'SINGLE'
      ? z.string().min(1, 'Start time is required for single events')
      : z.string().optional().or(z.literal('')),
    
    endTime: z.string().optional().or(z.literal('')),
    
    // Recurring event fields - for backward compatibility (optional since we use recurringDates now)
    recurringPattern: z.string().optional().or(z.literal('')),
    
    recurringStart: z.string().optional().or(z.literal('')),
    recurringEnd: z.string().optional().or(z.literal('')),
    rrule: z.string().optional().or(z.literal('')),
    
    // New recurring dates structure
    recurringDates: eventType === 'RECURRING'
      ? z.array(recurringDateSchema).min(1, 'At least one recurring date is required')
      : z.array(recurringDateSchema).optional(),
    
    // Location fields
    virtual: z.boolean().default(false),
    
    // Virtual event link - required when virtual is true
    virtualEventLink: virtual === true
      ? z.string()
          .min(1, 'Virtual event link is required for virtual events')
          .url('Please enter a valid URL')
      : z.string()
          .optional()
          .or(z.literal(''))
          .refine((val) => !val || z.string().url().safeParse(val).success, {
            message: 'Please enter a valid URL'
          }),
    
    // Venue selection - required when virtual is false
    venueId: virtual === false
      ? z.string().optional().or(z.literal(''))
      : z.string().optional().or(z.literal('')),
    
    // Manual venue entry - at least venue name required when no venueId and not virtual
    venueName: z.string().optional().or(z.literal('')),
    address: z.string().optional().or(z.literal('')),
    city: z.string().optional().or(z.literal('')),
    state: z.string().optional().or(z.literal('')),
    zipcode: z.string().optional().or(z.literal('')),

    // Market field - auto-detected from venue zipcode (required)
    market: z.string()
      .min(1, 'Market is required. Please ensure the venue has a valid ZIP code.')
  }).refine((data) => {
    // For physical events, either venueId or venueName must be provided
    // Skip venue validation for recurring events as they might have multiple venues
    if (!data.virtual && !data.venueId && !data.venueName && data.eventType === 'SINGLE') {
      return false;
    }
    return true;
  }, {
    message: 'Please select a venue or enter venue details manually',
    path: ['venueId']
  });
};

// Default schema for Step 2 (backward compatibility)
export const eventDetailsSchema = createEventDetailsSchema();

// Individual performer validation schema
export const performerSchema = z.object({
  name: z.string().min(1, 'Performer name is required').trim(),
  role: z.string().min(1, 'Role/Title is required').trim(),
  type: z.enum(['ARTIST', 'SPEAKER', 'GUEST']),
  description: z.string().optional().or(z.literal(''))
});

// Individual agenda item validation schema
export const agendaItemSchema = z.object({
  title: z.string().min(1, 'Session title is required').trim(),
  startTime: z.string().min(1, 'Start time is required'),
  duration: z.number().int().min(1, 'Duration must be at least 1 minute'),
  description: z.string().max(600, 'Description must be less than 600 characters').optional().or(z.literal(''))
});

// Step 3: Media & Publishing Schema  
export const eventMediaSchema = z.object({
  description: z.string()
    .optional()
    .or(z.literal('')),
  
  // Single image field (simplified from mainImage, bigImage, featuredImage)
  image: z.string().optional().or(z.literal('')),
  
  // Video
  video: createOptionalUrlSchema('video'),
  videoType: z.enum(['YOUTUBE', 'VIMEO', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'DIRECT', 'OTHER']).optional(),
  
  // Pricing & Ticketing
  free: z.boolean().default(false),
  pricingType: z.enum(['free', 'single', 'range']).default('single'),
  singlePrice: z.string().optional().or(z.literal('')),
  minPrice: z.string().optional().or(z.literal('')),
  maxPrice: z.string().optional().or(z.literal('')),
  ticketUrl: createOptionalUrlSchema('ticket link'),
  // Legacy pricing field for backend compatibility
  pricing: z.record(z.string(), z.any()).optional(),
  
  // Social media - strict URL validation only when field is not empty
  website: createOptionalUrlSchema('website'),
  facebook: createOptionalUrlSchema('Facebook'),
  instagram: createOptionalUrlSchema('Instagram'),
  twitter: createOptionalUrlSchema('Twitter'),
  youtube: createOptionalUrlSchema('YouTube'),
  tiktok: createOptionalUrlSchema('TikTok'),
  
  // Lineup & Agenda with full API structure
  lineup: z.object({
    performers: z.array(z.object({
      name: z.string().min(1, 'Performer name is required'),
      role: z.string().min(1, 'Role/Title is required'),
      type: z.enum(['ARTIST', 'SPEAKER', 'GUEST']),
      description: z.string().optional().or(z.literal('')),
      orderIndex: z.number().int().min(0)
    }))
  }).optional().default({ performers: [] }),
  
  agenda: z.object({
    items: z.array(z.object({
      title: z.string().min(1, 'Session title is required'),
      startTime: z.string().min(1, 'Start time is required'),
      duration: z.number().int().min(1, 'Duration must be at least 1 minute'),
      description: z.string().max(600, 'Description must be less than 600 characters').optional().or(z.literal('')),
      orderIndex: z.number().int().min(0)
    }))
  }).optional().default({ items: [] }),
  
  // Additional Information fields
  ageInfo: z.string().max(200, 'Age info must be less than 200 characters').optional().or(z.literal('')),
  doorTime: z.string().max(200, 'Door time must be less than 200 characters').optional().or(z.literal('')),
  parkingInfo: z.string().max(200, 'Parking info must be less than 200 characters').optional().or(z.literal('')),
  accessibilityInfo: z.string().max(200, 'Accessibility info must be less than 200 characters').optional().or(z.literal('')),
  
  // FAQs field
  faqs: z.array(z.object({
    question: z.string().min(1, 'Question is required').max(200, 'Question must be less than 200 characters'),
    answer: z.string().min(1, 'Answer is required').max(300, 'Answer must be less than 300 characters'),
    orderIndex: z.number().int().min(0)
  })).optional().default([]),

  // Admin fields (only for admins)
  status: z.enum(['DRAFT', 'PENDING', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED', 'DELETED']).optional(),
  adminNotes: z.string().max(1000, 'Admin notes must be less than 1000 characters').optional().or(z.literal(''))
}).refine((data) => {
  // Validate pricing fields based on pricing type and free admission
  if (data.free) {
    return true; // No pricing validation needed for free events
  }
  
  if (data.pricingType === 'single') {
    const singlePrice = data.singlePrice;
    if (!singlePrice || singlePrice.trim() === '') {
      return false;
    }
    // Validate that it's a valid number
    const numPrice = parseFloat(singlePrice);
    if (isNaN(numPrice) || numPrice < 0) {
      return false;
    }
  }
  
  if (data.pricingType === 'range') {
    const minPrice = data.minPrice;
    const maxPrice = data.maxPrice;
    
    if (!minPrice || minPrice.trim() === '' || !maxPrice || maxPrice.trim() === '') {
      return false;
    }
    
    const numMinPrice = parseFloat(minPrice);
    const numMaxPrice = parseFloat(maxPrice);
    
    if (isNaN(numMinPrice) || isNaN(numMaxPrice) || numMinPrice < 0 || numMaxPrice < 0) {
      return false;
    }
    
    if (numMinPrice >= numMaxPrice) {
      return false;
    }
  }
  
  return true;
}, {
  message: 'Invalid pricing configuration',
  path: ['pricingType']
}).refine((data) => {
  // Additional validation for single price
  if (!data.free && data.pricingType === 'single') {
    const singlePrice = data.singlePrice;
    if (!singlePrice || singlePrice.trim() === '') {
      return false;
    }
    const numPrice = parseFloat(singlePrice);
    if (isNaN(numPrice) || numPrice < 0) {
      return false;
    }
  }
  return true;
}, {
  message: 'Please enter a valid ticket price',
  path: ['singlePrice']
}).refine((data) => {
  // Additional validation for price range - minimum price
  if (!data.free && data.pricingType === 'range') {
    const minPrice = data.minPrice;
    if (!minPrice || minPrice.trim() === '') {
      return false;
    }
    const numMinPrice = parseFloat(minPrice);
    if (isNaN(numMinPrice) || numMinPrice < 0) {
      return false;
    }
  }
  return true;
}, {
  message: 'Please enter a valid minimum price',
  path: ['minPrice']
}).refine((data) => {
  // Additional validation for price range - maximum price
  if (!data.free && data.pricingType === 'range') {
    const maxPrice = data.maxPrice;
    if (!maxPrice || maxPrice.trim() === '') {
      return false;
    }
    const numMaxPrice = parseFloat(maxPrice);
    if (isNaN(numMaxPrice) || numMaxPrice < 0) {
      return false;
    }
  }
  return true;
}, {
  message: 'Please enter a valid maximum price',
  path: ['maxPrice']
}).refine((data) => {
  // Validate that max price is greater than min price
  if (!data.free && data.pricingType === 'range' && data.minPrice && data.maxPrice) {
    const numMinPrice = parseFloat(data.minPrice);
    const numMaxPrice = parseFloat(data.maxPrice);
    if (!isNaN(numMinPrice) && !isNaN(numMaxPrice) && numMinPrice >= numMaxPrice) {
      return false;
    }
  }
  return true;
}, {
  message: 'Maximum price must be greater than minimum price',
  path: ['maxPrice']
});

// Complete event schema (union of all steps)
export const completeEventSchema = eventBasicSchema
  .merge(eventDetailsSchema)
  .merge(eventMediaSchema);

// Auto-save schema (partial updates)
export const autoSaveEventSchema = z.object({
  title: z.string().optional(),
  summary: z.string().optional(), 
  description: z.string().optional(),
  companyId: z.string().optional(),
  market: z.string().optional(),
  mainGenreId: z.string().optional(),
  subgenreId: z.string().optional(),
  supportingTagIds: z.array(z.string()).optional(),
  audienceTagIds: z.array(z.string()).optional(),
  eventType: z.enum(['SINGLE', 'RECURRING']).optional(),
  
  // Single event fields
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  
  // Recurring event fields (backward compatibility)
  recurringPattern: z.string().optional(),
  recurringStart: z.string().optional(),
  recurringEnd: z.string().optional(),
  rrule: z.string().optional(),
  
  // New recurring dates structure
  recurringDates: z.array(recurringDateSchema).optional(),
  
  // Location fields
  virtual: z.boolean().optional(),
  virtualEventLink: z.string().optional(),
  venueId: z.string().optional(),
  venueName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  
  // Media fields
  video: z.string().optional(),
  videoType: z.enum(['YOUTUBE', 'VIMEO', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'DIRECT', 'OTHER']).optional(),
  free: z.boolean().optional(),
  pricingType: z.enum(['free', 'single', 'range']).optional(),
  singlePrice: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  ticketUrl: z.string().optional(),
  pricing: z.record(z.string(), z.any()).optional(),
  website: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  
  // Lineup & Agenda fields for autosave
  lineup: z.object({
    performers: z.array(z.object({
      name: z.string(),
      role: z.string(),
      type: z.enum(['ARTIST', 'SPEAKER', 'GUEST']),
      description: z.string().optional(),
      orderIndex: z.number().int().min(0)
    }))
  }).optional(),
  
  agenda: z.object({
    items: z.array(z.object({
      title: z.string(),
      startTime: z.string(),
      duration: z.number().int().min(1),
      description: z.string().max(600).optional(),
      orderIndex: z.number().int().min(0)
    }))
  }).optional(),

  // Additional Information fields for autosave
  ageInfo: z.string().max(200).optional(),
  doorTime: z.string().max(200).optional(),
  parkingInfo: z.string().max(200).optional(),
  accessibilityInfo: z.string().max(200).optional(),

  // FAQs field for autosave
  faqs: z.array(z.object({
    question: z.string().max(200),
    answer: z.string().max(300),
    orderIndex: z.number().int().min(0)
  })).optional()
});

// Type definitions
export type TimeSlotFormData = z.infer<typeof timeSlotSchema>;
export type RecurringDateFormData = z.infer<typeof recurringDateSchema>;
export type PerformerFormData = z.infer<typeof performerSchema>;
export type AgendaItemFormData = z.infer<typeof agendaItemSchema>;
export type FAQItemFormData = {
  question: string;
  answer: string;
  orderIndex: number;
};
export type EventBasicFormData = z.infer<typeof eventBasicSchema>;
export type EventDetailsFormData = z.infer<typeof eventDetailsSchema>;  
export type EventMediaFormData = z.infer<typeof eventMediaSchema>;
export type CompleteEventFormData = z.infer<typeof completeEventSchema>;
export type AutoSaveEventData = z.infer<typeof autoSaveEventSchema>;

// Default values
export const defaultEventValues: Partial<CompleteEventFormData> = {
  title: '',
  summary: '',
  description: '',
  free: false,
  pricingType: 'single',
  singlePrice: '',
  minPrice: '',
  maxPrice: '',
  ticketUrl: '',
  virtual: false,
  eventType: 'SINGLE',
  supportingTagIds: [],
  audienceTagIds: [],
  lineup: { performers: [] },
  agenda: { items: [] }
};