/**
 * Restaurant Search Hook
 * Uses optimized globalRestaurantsSearch query for fast search results
 */

'use client';

import { useQuery } from '@apollo/client';
import { GLOBAL_RESTAURANTS_SEARCH } from '@/lib/graphql/public-restaurants';
import { useDebounce } from './use-debounce';
import type { SearchResults, SearchRestaurant } from '@/types/search';
import type { PriceRange } from '@/types/public-restaurants';

/**
 * GraphQL response type for global restaurant search
 */
interface GlobalRestaurantsSearchResponse {
  globalRestaurantsSearch: {
    locations: Array<{
      city: string;
      state: string;
      market?: string;
      restaurantCount: number;
    }>;
    restaurants: Array<{
      id: string;
      name: string;
      slug: string;
      city: string;
      state: string;
      cuisineType?: string;
      priceRange: PriceRange;
      imageUrl?: string;
      averageRating?: number | null;
      reviewCount?: number | null;
    }>;
    totalResults: number;
  };
}

/**
 * GraphQL variables for global restaurant search
 */
interface GlobalRestaurantsSearchVariables {
  input: {
    query: string;
    market?: string;
    maxRestaurants?: number;
    maxLocations?: number;
  };
}

/**
 * Hook for optimized restaurant search functionality
 *
 * Uses the `globalRestaurantsSearch` query which:
 * - Returns structured data (locations + restaurants)
 * - Backend processes location extraction
 * - Only essential fields for search results
 * - Includes rating and review count (placeholders for now)
 *
 * @param query - Search query string
 * @param market - Optional market filter (miami, orlando, etc.)
 * @returns Search results with locations, restaurants, and loading state
 */
export function useRestaurantSearch(query: string, market?: string) {
  // Debounce search query (300ms)
  const debouncedQuery = useDebounce(query, 300);

  // Query with optimized endpoint
  const { data, loading } = useQuery<GlobalRestaurantsSearchResponse, GlobalRestaurantsSearchVariables>(
    GLOBAL_RESTAURANTS_SEARCH,
    {
      variables: {
        input: {
          query: debouncedQuery,
          market,
          maxLocations: 5,
          maxRestaurants: 10
        }
      },
      skip: !debouncedQuery || debouncedQuery.length < 2,
      fetchPolicy: 'cache-and-network'
    }
  );

  // Map backend response to SearchResults format
  const results: SearchResults<SearchRestaurant> = data?.globalRestaurantsSearch
    ? {
        // Map locations (backend returns 'restaurantCount')
        locations: data.globalRestaurantsSearch.locations.map(loc => ({
          city: loc.city,
          state: loc.state,
          market: loc.market,
          venueCount: loc.restaurantCount // Map restaurantCount to venueCount for backward compatibility
        })),
        // Map restaurants to SearchRestaurant format
        entities: data.globalRestaurantsSearch.restaurants.map(restaurant => ({
          id: restaurant.id,
          name: restaurant.name,
          slug: restaurant.slug,
          city: restaurant.city,
          state: restaurant.state,
          imageUrl: restaurant.imageUrl,
          priceRange: restaurant.priceRange,
          cuisineType: restaurant.cuisineType,
          averageRating: restaurant.averageRating,
          reviewCount: restaurant.reviewCount
        })),
        totalResults: data.globalRestaurantsSearch.totalResults
      }
    : {
        locations: [],
        entities: [],
        totalResults: 0
      };

  return {
    results,
    loading,
    query: debouncedQuery
  };
}
