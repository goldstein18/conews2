// News Entity Types
export enum NewsType {
  EDITORIAL = 'EDITORIAL',
  INDUSTRY = 'INDUSTRY',
}

export enum NewsStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  DELETED = 'DELETED',
}

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  display?: string;
  color?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  body: string;
  heroImage?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  authorName?: string;
  articleType: NewsType;
  status: NewsStatus;
  publishedMarkets: string[];
  publishedAt?: string;
  featuredUntil?: string;
  videoUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  categories: PostCategory[];
  tags: Tag[];
  declinedReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsDetail extends NewsArticle {}

// GraphQL Response Types
export interface NewsResponse {
  news: NewsArticle[];
}

export interface NewsDetailResponse {
  newsById: NewsDetail;
}

export interface NewsBySlugResponse {
  newsBySlug: NewsDetail;
}

export interface NewsCategoriesResponse {
  postCategories: PostCategory[];
}

export interface ActiveNewsCategoriesResponse {
  activePostCategories: PostCategory[];
}

// Note: Dashboard stats and engagement metrics not yet implemented in API

// Filter Types (API uses simple filters, not pagination)
export interface NewsFilterInput {
  status?: NewsStatus;
  articleType?: NewsType;
  market?: string;
  markets?: string[];
  searchTerm?: string;
  categoryId?: string;
  tagId?: string;
  userId?: string;
  featured?: boolean;
}

// GraphQL Variables Types
export interface NewsVariables {
  filter?: NewsFilterInput;
}

export interface NewsDetailVariables {
  id: string;
}

export interface NewsBySlugVariables {
  slug: string;
}

// Input Types for Mutations
export interface CreateNewsInput {
  title: string;
  body: string;
  heroImage?: string;
  heroImageAlt?: string;
  authorName?: string;
  articleType: NewsType;
  publishedMarkets: string[];
  categoryIds: string[];
  tagIds?: string[];
  publishedAt?: string;
  featuredUntil?: string;
  videoUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateNewsInput {
  id: string;
  title?: string;
  body?: string;
  heroImage?: string;
  heroImageAlt?: string;
  authorName?: string;
  articleType?: NewsType;
  publishedMarkets?: string[];
  categoryIds?: string[];
  tagIds?: string[];
  publishedAt?: string;
  featuredUntil?: string;
  videoUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateNewsStatusInput {
  id: string;
  status: NewsStatus;
  declinedReason?: string;
}

// Note: Post categories are managed separately, not in news module

// Image Upload Types
export interface GenerateHeroImageUploadUrlInput {
  newsId: string;
  fileName: string;
  contentType: string;
  fileSize: number;
}

export interface HeroImageUploadResponse {
  generateHeroImageUploadUrl: {
    uploadUrl: string;
    key: string;
    expiresIn: number;
    maxFileSize: number;
    recommendedDimensions: string;
  };
}

// Sort field enum (for backward compatibility with components)
export enum NewsSortField {
  TITLE = 'title',
  STATUS = 'status',
  ARTICLE_TYPE = 'articleType',
  PUBLISHED_AT = 'publishedAt',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

// Constants for frontend use
export const NEWS_STATUSES = [
  'DRAFT',
  'PENDING',
  'APPROVED',
  'DECLINED',
  'DELETED'
] as const;

export const NEWS_TYPES = [
  'EDITORIAL',
  'INDUSTRY'
] as const;