/**
 * Search Module Configurations
 * Centralized configuration for each module's search behavior
 */

import { Building2, Utensils, Theater, Calendar } from 'lucide-react';
import type { ModuleSearchConfig } from '@/types/search';
import type { SearchVenue, SearchRestaurant, SearchArtsGroup, SearchEvent } from '@/types/search';

/**
 * Venue Search Configuration
 * Used in venues directory for global search
 */
export const VENUE_SEARCH_CONFIG: ModuleSearchConfig<SearchVenue> = {
  module: 'venues',
  entityLabel: 'Venues',
  entityLabelSingular: 'Venue',
  baseRoute: '/venues',
  entityRoute: '/venue',
  locationRoute: '/location',
  placeholder: 'Search for venues or locations...',
  icon: Building2,
};

/**
 * Restaurant Search Configuration
 * Used in restaurants directory for global search
 */
export const RESTAURANT_SEARCH_CONFIG: ModuleSearchConfig<SearchRestaurant> = {
  module: 'restaurants',
  entityLabel: 'Restaurants',
  entityLabelSingular: 'Restaurant',
  baseRoute: '/restaurants',
  entityRoute: '/restaurant',
  locationRoute: '/location',
  placeholder: 'Search for restaurants or locations...',
  icon: Utensils,
};

/**
 * Arts Group Search Configuration
 * Used in arts-groups directory for global search
 */
export const ARTS_GROUP_SEARCH_CONFIG: ModuleSearchConfig<SearchArtsGroup> = {
  module: 'arts-groups',
  entityLabel: 'Arts Groups',
  entityLabelSingular: 'Arts Group',
  baseRoute: '/arts-groups',
  entityRoute: '/arts-group',
  locationRoute: '/location',
  placeholder: 'Search for arts groups or locations...',
  icon: Theater,
};

/**
 * Event Search Configuration
 * Used in events directory for global search
 */
export const EVENT_SEARCH_CONFIG: ModuleSearchConfig<SearchEvent> = {
  module: 'events',
  entityLabel: 'Events',
  entityLabelSingular: 'Event',
  baseRoute: '/calendar/events',
  entityRoute: '/event',
  locationRoute: '/location',
  placeholder: 'Search for events or locations...',
  icon: Calendar,
};
