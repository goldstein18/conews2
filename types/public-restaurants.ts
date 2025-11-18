/**
 * Public-facing restaurant types for the restaurants directory
 * This is a subset of the full Restaurant type used in the dashboard
 */

// Price range enum (matches backend)
export enum PriceRange {
  BUDGET = 'BUDGET',
  MODERATE = 'MODERATE',
  UPSCALE = 'UPSCALE',
  FINE_DINING = 'FINE_DINING'
}

export enum RestaurantStatus {
  APPROVED = 'APPROVED'
  // Only approved restaurants are shown publicly
}

// Market constants (shared with venues)
export const MARKETS = [
  { value: 'miami', label: 'Miami' },
  { value: 'orlando', label: 'Orlando' },
  { value: 'tampa', label: 'Tampa' },
  { value: 'jacksonville', label: 'Jacksonville' },
  { value: 'palm-beach', label: 'Palm Beach' }
] as const;

export type MarketValue = typeof MARKETS[number]['value'];

// Restaurant type interface (cuisine type)
export interface RestaurantType {
  id: string;
  name: string;
  slug?: string;
  displayName?: string;
  description?: string;
  isActive?: boolean;
}

// Dietary option interface (for amenities/dietary filters)
export interface DietaryOption {
  id: string;
  name: string;
  slug: string;
  displayName: string;
  description?: string;
  category?: 'dietary' | 'lifestyle' | 'religious';
  isActive: boolean;
}

// Operating hours interface
export interface OperatingHours {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isClosed: boolean;
}

// Public restaurant interface (subset of full Restaurant type)
export interface PublicRestaurant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  phone?: string;
  website?: string;
  email?: string;
  imageUrl?: string;
  imageBigUrl?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  market?: string;
  priceRange: PriceRange;
  restaurantType?: RestaurantType;
  status?: RestaurantStatus;
  menuLink?: string;
  dietaryOptions?: string[];
  amenities?: string[];
  operatingHours?: OperatingHours[];
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

// Pagination types
export interface PublicRestaurantEdge {
  node: PublicRestaurant;
  cursor: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
  totalCount?: number;
}

export interface PublicRestaurantsPaginated {
  edges: PublicRestaurantEdge[];
  pageInfo: PageInfo;
}

// GraphQL response type
export interface PublicRestaurantsResponse {
  publicRestaurantsPaginated: PublicRestaurantsPaginated;
}

// Query variables
export interface PublicRestaurantsQueryVariables {
  first: number;
  after?: string;
  market?: string;
  search?: string;
  city?: string;
  state?: string;
  restaurantTypeSlug?: string;
  restaurantTypeIds?: string[];
  priceRange?: PriceRange; // Changed from string to PriceRange enum
  dietaryOptions?: string[];
}

// Filter state
export interface RestaurantFilters {
  market: MarketValue | '';
  search: string;
  priceRange: PriceRange | 'ALL';
  cuisineTypes: string[]; // Array of restaurant type IDs
  amenities: string[]; // Array of dietary option IDs or amenity strings
}

// Default filter values
export const DEFAULT_RESTAURANT_FILTERS: RestaurantFilters = {
  market: 'miami',
  search: '',
  priceRange: 'ALL',
  cuisineTypes: [],
  amenities: []
};

// Single restaurant query types
export interface PublicRestaurantResponse {
  publicRestaurant: PublicRestaurant | null;
}

export interface PublicRestaurantVariables {
  identifier: string;
}

// Restaurant types query response
export interface PublicRestaurantTypesResponse {
  publicRestaurantTypes: RestaurantType[];
}

// Dietary options query response
export interface PublicDietaryOptionsResponse {
  publicDietaryOptions: DietaryOption[];
}

// Price range display helpers
export const PRICE_RANGE_LABELS: Record<PriceRange, string> = {
  [PriceRange.BUDGET]: '$',
  [PriceRange.MODERATE]: '$$',
  [PriceRange.UPSCALE]: '$$$',
  [PriceRange.FINE_DINING]: '$$$$'
};

export const PRICE_RANGE_NAMES: Record<PriceRange, string> = {
  [PriceRange.BUDGET]: 'Budget',
  [PriceRange.MODERATE]: 'Moderate',
  [PriceRange.UPSCALE]: 'Upscale',
  [PriceRange.FINE_DINING]: 'Fine Dining'
};

// Price range filter options
export const PRICE_RANGE_OPTIONS = [
  { value: 'ALL', label: 'All Prices', icon: '💰', name: '' },
  { value: PriceRange.BUDGET, label: PRICE_RANGE_LABELS[PriceRange.BUDGET], name: 'Budget', icon: '' },
  { value: PriceRange.MODERATE, label: PRICE_RANGE_LABELS[PriceRange.MODERATE], name: 'Moderate', icon: '' },
  { value: PriceRange.UPSCALE, label: PRICE_RANGE_LABELS[PriceRange.UPSCALE], name: 'Upscale', icon: '' },
  { value: PriceRange.FINE_DINING, label: PRICE_RANGE_LABELS[PriceRange.FINE_DINING], name: 'Fine Dining', icon: '' }
] as const;

// Common amenities for restaurants
// These match common values in the amenities JSON field
export const COMMON_AMENITIES = [
  { value: 'BAR_SCENE', label: 'Bar Scene', icon: '🍸' },
  { value: 'BRUNCH', label: 'Brunch', icon: '🥞' },
  { value: 'DINNER', label: 'Dinner', icon: '🍽️' },
  { value: 'KID_FRIENDLY', label: 'Kid Friendly', icon: '👨‍👩‍👧' },
  { value: 'OUTDOOR_SEATING', label: 'Outdoor Seating', icon: '🌳' },
  { value: 'PARKING', label: 'Parking Available', icon: '🅿️' },
  { value: 'LIVE_MUSIC', label: 'Live Music', icon: '🎵' },
  { value: 'VEGAN_OPTIONS', label: 'Vegan Options', icon: '🌱' },
  { value: 'GLUTEN_FREE', label: 'Gluten-Free Options', icon: '🌾' },
  { value: 'RESERVATIONS', label: 'Accepts Reservations', icon: '📅' },
  { value: 'TAKEOUT', label: 'Takeout Available', icon: '🥡' },
  { value: 'DELIVERY', label: 'Delivery', icon: '🚗' }
] as const;
