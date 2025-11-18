import { z } from 'zod';

const planNamePattern = z
  .string()
  .trim()
  .min(3, { message: "Plan name must be at least 3 characters" })
  .max(100, { message: "Plan name must be less than 100 characters" })
  .regex(/^[a-zA-Z0-9\s\-_]+$/, {
    message: "Plan name can only contain letters, numbers, spaces, hyphens, and underscores"
  });

const planSlugPattern = z
  .string()
  .trim()
  .min(3, { message: "Plan slug must be at least 3 characters" })
  .max(100, { message: "Plan slug must be less than 100 characters" })
  .regex(/^[a-z0-9\-]+$/, {
    message: "Plan slug can only contain lowercase letters, numbers, and hyphens"
  });

const pricePattern = z
  .number()
  .min(1, { message: "Price must be at least $1.00" })
  .max(99999.99, { message: "Price must be less than $100,000" });

const allowancePattern = z
  .number()
  .int()
  .min(-1, { message: "Allowance must be -1 (unlimited) or 0 or greater" })
  .max(99999, { message: "Allowance must be less than 100,000" });

const allowancesSchema = z.object({
  appBanners: allowancePattern,
  banners: allowancePattern,
  dedicated: allowancePattern,
  eMags: allowancePattern,
  editorials: allowancePattern,
  escoopBanners: allowancePattern,
  escoopFeature: allowancePattern,
  escoops: allowancePattern,
  eventFeaturedHp: allowancePattern,
  events: allowancePattern,
  fbCarousels: allowancePattern,
  fbCovers: allowancePattern,
  fbSocialAd: allowancePattern,
  fbSocialBoost: allowancePattern,
  genreBlue: allowancePattern,
  genreBlue6: allowancePattern,
  genreBlue12: allowancePattern,
  genreGreen: allowancePattern,
  genreGreen6: allowancePattern,
  genreGreen12: allowancePattern,
  genreRed: allowancePattern,
  lbhBanners: allowancePattern,
  lbvBanners: allowancePattern,
  mainFeatures: allowancePattern,
  marquee: allowancePattern,
  pageAd: allowancePattern,
  restaurants: allowancePattern,
  venues: allowancePattern,
});

export const createPlanSchema = z.object({
  plan: planNamePattern,
  planSlug: planSlugPattern,
  price: pricePattern,
  priceLong: z.string().optional(),
  allowances: allowancesSchema,
});

export const updatePlanSchema = z.object({
  description: z.string().trim().max(500, { message: "Description must be less than 500 characters" }).optional(),
  active: z.boolean(),
});

export type CreatePlanFormData = z.infer<typeof createPlanSchema>;
export type UpdatePlanFormData = z.infer<typeof updatePlanSchema>;

export const defaultAllowances = {
  appBanners: 0,
  banners: 0,
  dedicated: 0,
  eMags: 0,
  editorials: 0,
  escoopBanners: 0,
  escoopFeature: 0,
  escoops: 0,
  eventFeaturedHp: 0,
  events: 0,
  fbCarousels: 0,
  fbCovers: 0,
  fbSocialAd: 0,
  fbSocialBoost: 0,
  genreBlue: 0,
  genreBlue6: 0,
  genreBlue12: 0,
  genreGreen: 0,
  genreGreen6: 0,
  genreGreen12: 0,
  genreRed: 0,
  lbhBanners: 0,
  lbvBanners: 0,
  mainFeatures: 0,
  marquee: 0,
  pageAd: 0,
  restaurants: 0,
  venues: 0,
};