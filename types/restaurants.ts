// Restaurant status enum
export enum RestaurantStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  DELETED = 'DELETED'
}

// Price range enum
export enum PriceRange {
  BUDGET = 'BUDGET',
  MODERATE = 'MODERATE',
  UPSCALE = 'UPSCALE',
  FINE_DINING = 'FINE_DINING'
}

// Day of week enum for operating hours
export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

// Restaurant type interface
export interface RestaurantType {
  id: string;
  name: string;
  slug: string;
  displayName: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Dietary options interface
export interface DietaryOption {
  id: string;
  name: string;
  slug: string;
  displayName: string;
  description: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Operating hours interface
export interface OperatingHours {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Company interface (simplified)
export interface RestaurantCompany {
  id: string;
  name: string;
  email: string;
}

// Owner interface (simplified)
export interface RestaurantOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Main Restaurant interface
export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  phone?: string;
  website?: string;
  email?: string;
  image?: string;
  imageUrl?: string;
  imageBig?: string;
  imageBigUrl?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  menuLink?: string;
  priceRange: PriceRange;
  dietaryOptions: string[];
  amenities: string[];
  status: RestaurantStatus;
  declinedReason?: string;
  adminNotes?: string;
  latitude?: number;
  longitude?: number;
  market: string;
  restaurantType?: RestaurantType;
  company?: RestaurantCompany;
  owner?: RestaurantOwner;
  operatingHours: OperatingHours[];
  createdAt: string;
  updatedAt: string;
}

// Restaurant stats interface
export interface RestaurantStats {
  totalRestaurants: number;
  approvedRestaurants: number;
  pendingReviewRestaurants: number;
  rejectedRestaurants: number;
  activeClients: number;
}

// Pagination interfaces
export interface RestaurantEdge {
  cursor: string;
  node: Restaurant;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
  totalCount?: number;
}

export interface RestaurantsPaginated {
  edges: RestaurantEdge[];
  pageInfo: PageInfo;
}

// Filter interfaces
export interface RestaurantsFilterInput {
  first?: number;
  after?: string;
  search?: string;
  status?: RestaurantStatus;
  priceRange?: PriceRange;
  city?: string;
  market?: string;
  cuisineType?: string;
  companyId?: string;
  includeTotalCount?: boolean;
}

// Keep the old name for compatibility
export interface RestaurantFilterInput extends RestaurantsFilterInput {}

// Sort types
export type RestaurantSortField = 
  | 'name'
  | 'createdAt'
  | 'updatedAt'
  | 'status'
  | 'priceRange'
  | 'city'
  | 'market';

import type { SortDirection } from '@/components/ui/sortable-table-header';
export type { SortDirection };

export interface RestaurantSortInput {
  field: RestaurantSortField;
  direction: SortDirection;
}

// GraphQL response interfaces
export interface RestaurantsResponse {
  restaurantsPaginated: RestaurantsPaginated;
}

export interface RestaurantResponse {
  restaurant: Restaurant;
}

export interface RestaurantStatsResponse {
  restaurantStats: RestaurantStats;
}

export interface RestaurantTypesResponse {
  restaurantTypes: RestaurantType[];
}

export interface DietaryOptionsResponse {
  restaurantDietaryOptions: DietaryOption[];
}

// Form data interfaces
export interface RestaurantBasicFormData {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  market: string;
  phone?: string;
  email?: string;
  website?: string;
  restaurantTypeId: string;
  priceRange: PriceRange;
  companyId: string;
  latitude?: number;
  longitude?: number;
}

export interface RestaurantAdvancedFormData {
  image?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  menuLink?: string;
  dietaryOptions: string[];
  amenities: string[];
  operatingHours?: OperatingHours[];
}

export interface RestaurantEditFormData extends RestaurantBasicFormData, RestaurantAdvancedFormData {
  id: string;
  status?: RestaurantStatus;
  adminNotes?: string;
  declinedReason?: string;
}

// Input interfaces for mutations
export interface CreateRestaurantInput extends RestaurantBasicFormData {
  image?: string;
}

export interface UpdateRestaurantInput {
  id: string;
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  phone?: string;
  website?: string;
  email?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  menuLink?: string;
  priceRange?: PriceRange;
  dietaryOptions?: string[];
  amenities?: string[];
  latitude?: number;
  longitude?: number;
  market?: string;
  restaurantTypeId?: string;
  companyId?: string;
  adminNotes?: string;
}

export interface UpdateRestaurantImagesInput {
  restaurantId: string;
  imageKey?: string;
  imageBigKey?: string;
}

export interface GenerateRestaurantImageUploadUrlInput {
  restaurantId: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  imageType: 'MAIN' | 'BIG';
}

export interface RestaurantImageUploadResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
  maxFileSize: number;
  allowedTypes: string[];
}

// Market stats interface for filter cards
export interface MarketStats {
  market: string;
  count: number;
}

// Constants for select options
export const PRICE_RANGE_OPTIONS = [
  { value: PriceRange.BUDGET, label: 'Budget ($)' },
  { value: PriceRange.MODERATE, label: 'Moderate ($$)' },
  { value: PriceRange.UPSCALE, label: 'Upscale ($$$)' },
  { value: PriceRange.FINE_DINING, label: 'Fine Dining ($$$$)' }
] as const;

export const RESTAURANT_STATUS_OPTIONS = [
  { value: RestaurantStatus.PENDING, label: 'Pending' },
  { value: RestaurantStatus.APPROVED, label: 'Approved' },
  { value: RestaurantStatus.DECLINED, label: 'Declined' },
  { value: RestaurantStatus.DELETED, label: 'Deleted' }
] as const;

export const AMENITIES_OPTIONS = [
  'parking',
  'wifi',
  'outdoor_seating',
  'live_music',
  'private_dining',
  'takeout',
  'delivery',
  'catering',
  'bar',
  'happy_hour',
  'brunch',
  'kid_friendly',
  'pet_friendly',
  'wheelchair_accessible'
] as const;