import type { VenueType } from './public-venues';
import type { PriceRange } from './public-restaurants';
import type { ComponentType } from 'react';

/**
 * Location result from search
 * Represents a unique city/state combination with entity count
 */
export interface SearchLocation {
  city: string;
  state: string;
  market?: string;
  venueCount: number; // Keep this name for backward compatibility, represents entity count
  eventCount?: number; // Event count for events search
}

/**
 * Base search entity interface
 * All module-specific search entities extend from this
 */
export interface SearchEntity {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  imageUrl?: string;
}

/**
 * Venue result from search
 * Minimal venue info for search results
 */
export interface SearchVenue extends SearchEntity {
  venueType: VenueType;
}

/**
 * Restaurant result from search
 * Minimal restaurant info for search results
 */
export interface SearchRestaurant extends SearchEntity {
  priceRange: PriceRange;
  cuisineType?: string;        // Cuisine type (Cuban, Italian, etc.)
  restaurantType?: string;     // Legacy field for backward compatibility
  averageRating?: number | null;  // Average rating 1-5
  reviewCount?: number | null;    // Total review count
}

/**
 * Arts Group result from search
 * Minimal arts group info for search results
 */
export interface SearchArtsGroup extends SearchEntity {
  artType?: string;
  memberCount?: number;
}

/**
 * Event result from search
 * Minimal event info for search results
 */
export interface SearchEvent extends SearchEntity {
  title: string; // Event title (used instead of name)
  startDate: string;
  mainImageUrl?: string;
  venue?: {
    name: string;
    city: string;
    state: string;
  };
}

/**
 * Combined search results (generic)
 * Can be used with any entity type
 */
export interface SearchResults<T = SearchEntity> {
  locations: SearchLocation[];
  entities: T[]; // Generic array of entities
  totalResults?: number;
}

/**
 * Backward compatibility: Specific venue search results
 */
export interface VenueSearchResults extends SearchResults<SearchVenue> {
  venues: SearchVenue[]; // Alias for entities
}

/**
 * Search state (generic)
 */
export interface SearchState<T = SearchEntity> {
  query: string;
  results: SearchResults<T>;
  loading: boolean;
  isOpen: boolean;
}

/**
 * Module type for search configurations
 */
export type SearchModule = 'venues' | 'restaurants' | 'arts-groups' | 'events';

/**
 * Module search configuration
 * Defines how each module's search behaves and renders
 */
export interface ModuleSearchConfig<T = SearchEntity> {
  module: SearchModule;
  entityLabel: string;         // "Venues", "Restaurants", "Arts Groups"
  entityLabelSingular: string; // "Venue", "Restaurant", "Arts Group"
  baseRoute: string;           // "/venues", "/restaurants", "/arts-groups"
  entityRoute: string;         // "/venue", "/restaurant", "/arts-group"
  locationRoute?: string;      // "/location", optional
  placeholder: string;         // Search input placeholder
  icon: ComponentType<{ className?: string }>; // Icon component
}
