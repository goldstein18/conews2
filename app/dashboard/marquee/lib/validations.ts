import { z } from 'zod';
import { MarqueeButtonFontWeight } from '@/types/marquee';

// Market options
export const MARKET_OPTIONS = [
  { value: 'miami', label: 'Miami' },
  { value: 'new_york', label: 'New York' },
  { value: 'los_angeles', label: 'Los Angeles' },
  { value: 'chicago', label: 'Chicago' },
  { value: 'houston', label: 'Houston' },
] as const;

// Button font weight options
export const BUTTON_FONT_WEIGHT_OPTIONS = [
  { value: MarqueeButtonFontWeight.REGULAR, label: 'Regular' },
  { value: MarqueeButtonFontWeight.BOLD, label: 'Bold' },
] as const;

// Basic schema for Step 1
export const marqueeBasicSchema = z.object({
  name: z.string().min(1, 'Marquee name is required').trim(),
  link: z.string().url('Must be a valid URL').trim(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  market: z.string().min(1, 'Market is required'),
  companyId: z.string().min(1, 'Company is required'),
  buttonText: z.string().optional(),
  buttonColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g., #FF5733)')
    .optional()
    .or(z.literal('')),
  buttonFontWeight: z.nativeEnum(MarqueeButtonFontWeight).optional(),
});

// Advanced schema for Step 2 (media uploads)
export const marqueeAdvancedSchema = z.object({
  desktopImage: z.string().optional(),
  desktopVideo: z.string().optional(),
  mobileImage: z.string().optional(),
  mobileVideo: z.string().optional(),
});

// Edit schema (combination of basic + advanced)
export const marqueeEditSchema = z.object({
  name: z.string().min(1, 'Marquee name is required').trim(),
  link: z.string().url('Must be a valid URL').trim(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  market: z.string().min(1, 'Market is required'),
  companyId: z.string().min(1, 'Company is required'),
  buttonText: z.string().optional(),
  buttonColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g., #FF5733)')
    .optional()
    .or(z.literal('')),
  buttonFontWeight: z.nativeEnum(MarqueeButtonFontWeight).optional(),
  desktopImage: z.string().optional(),
  desktopVideo: z.string().optional(),
  mobileImage: z.string().optional(),
  mobileVideo: z.string().optional(),
});

// Type exports
export type MarqueeBasicFormData = z.infer<typeof marqueeBasicSchema>;
export type MarqueeAdvancedFormData = z.infer<typeof marqueeAdvancedSchema>;
export type MarqueeEditFormData = z.infer<typeof marqueeEditSchema>;

// Default values
export const defaultMarqueeBasicValues: Partial<MarqueeBasicFormData> = {
  name: '',
  link: '',
  market: 'miami',
  companyId: '',
  buttonText: '',
  buttonColor: '',
  buttonFontWeight: MarqueeButtonFontWeight.REGULAR,
};

export const defaultMarqueeAdvancedValues: Partial<MarqueeAdvancedFormData> = {
  desktopImage: '',
  desktopVideo: '',
  mobileImage: '',
  mobileVideo: '',
};
