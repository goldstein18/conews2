import { z } from 'zod';
import { NEWS_TYPES } from '@/types/news';

const titlePattern = z
  .string()
  .trim()
  .min(5, { message: "Title must be at least 5 characters" })
  .max(200, { message: "Title must be less than 200 characters" });

// Helper function to strip HTML tags for validation
const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
};

const bodyPattern = z
  .string()
  .min(1, { message: "Article content is required" })
  .max(100000, { message: "Body must be less than 100,000 characters" })
  .refine(
    (val) => {
      const textContent = stripHtmlTags(val);
      return textContent.length >= 20;
    },
    { message: "Article content must be at least 20 characters (excluding HTML tags)" }
  );

const heroImagePattern = z
  .string()
  .optional();

const tagIdsPattern = z
  .array(z.string().trim().min(1))
  .max(2, { message: "Maximum 2 tags allowed" })
  .optional();

const articleTypePattern = z
  .enum(NEWS_TYPES, { message: "Please select a valid article type" });

const publishedMarketsPattern = z
  .array(z.string())
  .min(1, { message: "At least one market must be selected" });

const categoryIdsPattern = z
  .array(z.string())
  .min(1, { message: "At least one category is required" })
  .max(2, { message: "Maximum 2 categories allowed" });

const heroImageAltPattern = z
  .string()
  .trim()
  .optional();

const authorNamePattern = z
  .string()
  .trim()
  .optional();

const videoUrlPattern = z
  .string()
  .url({ message: "Valid video URL is required" })
  .optional()
  .or(z.literal(''));

const metaTitlePattern = z
  .string()
  .trim()
  .max(70, { message: "Meta title must be less than 70 characters" })
  .optional();

const metaDescriptionPattern = z
  .string()
  .trim()
  .max(160, { message: "Meta description must be less than 160 characters" })
  .optional();

const publishedAtPattern = z
  .string()
  .datetime({ message: "Invalid date format" })
  .optional();

const featuredUntilPattern = z
  .string()
  .datetime({ message: "Invalid date format" })
  .optional();

export const createNewsSchema = z.object({
  title: titlePattern,
  body: bodyPattern,
  heroImage: heroImagePattern,
  heroImageAlt: heroImageAltPattern,
  authorName: authorNamePattern,
  articleType: articleTypePattern,
  publishedMarkets: publishedMarketsPattern,
  categoryIds: categoryIdsPattern,
  tagIds: tagIdsPattern,
  publishedAt: publishedAtPattern,
  featuredUntil: featuredUntilPattern,
  videoUrl: videoUrlPattern,
  metaTitle: metaTitlePattern,
  metaDescription: metaDescriptionPattern,
});

export const updateNewsSchema = createNewsSchema.partial();

// Step 1 Schema - Basic required fields only
export const newsBasicSchema = z.object({
  title: titlePattern,
  body: bodyPattern,
  articleType: articleTypePattern,
  categoryIds: categoryIdsPattern,
  publishedMarkets: publishedMarketsPattern,
});

// Step 2 Schema - Advanced optional fields + image
export const newsAdvancedSchema = z.object({
  heroImage: heroImagePattern,
  heroImageAlt: heroImageAltPattern,
  authorName: authorNamePattern,
  tagIds: tagIdsPattern,
  publishedAt: publishedAtPattern,
  featuredUntil: featuredUntilPattern,
  videoUrl: videoUrlPattern,
  metaTitle: metaTitlePattern,
  metaDescription: metaDescriptionPattern,
});

export type CreateNewsFormData = z.infer<typeof createNewsSchema>;
export type UpdateNewsFormData = z.infer<typeof updateNewsSchema>;
export type NewsBasicFormData = z.infer<typeof newsBasicSchema>;
export type NewsAdvancedFormData = z.infer<typeof newsAdvancedSchema>;

// Default values for form
export const defaultNewsFormData: Partial<CreateNewsFormData> = {
  title: '',
  body: '',
  heroImage: undefined,
  heroImageAlt: '',
  authorName: '',
  articleType: 'EDITORIAL',
  publishedMarkets: ['miami'],
  categoryIds: [],
  tagIds: [],
  publishedAt: undefined,
  featuredUntil: undefined,
  videoUrl: '',
  metaTitle: '',
  metaDescription: '',
};

// Default values for Step 1 (Basic Form)
export const defaultNewsBasicValues: NewsBasicFormData = {
  title: '',
  body: '',
  articleType: 'EDITORIAL',
  categoryIds: [],
  publishedMarkets: [],
};

// Default values for Step 2 (Advanced Form)
export const defaultNewsAdvancedValues: Partial<NewsAdvancedFormData> = {
  heroImage: '',
  heroImageAlt: '',
  authorName: '',
  tagIds: [],
  publishedAt: undefined,
  featuredUntil: undefined,
  videoUrl: '',
  metaTitle: '',
  metaDescription: '',
};

// Article type options for select components
export const ARTICLE_TYPE_OPTIONS = [
  { value: 'EDITORIAL', label: 'Editorial' },
  { value: 'INDUSTRY', label: 'Industry' },
] as const;

// Alias for backward compatibility
export const TYPE_OPTIONS = ARTICLE_TYPE_OPTIONS;

// Status options for select components
export const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING', label: 'Pending Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'DELETED', label: 'Deleted' },
] as const;

// Market options (should match backend markets)
export const MARKET_OPTIONS = [
  { value: 'miami', label: 'Miami' },
  { value: 'orlando', label: 'Orlando' },
  { value: 'tampa', label: 'Tampa' },
  { value: 'jacksonville', label: 'Jacksonville' },
] as const;