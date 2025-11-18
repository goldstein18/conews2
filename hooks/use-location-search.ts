'use client';

import { useQuery } from '@apollo/client';
import {
  GLOBAL_EVENTS_SEARCH,
  type GlobalEventsSearchResponse,
  type GlobalEventsSearchVariables
} from '@/lib/graphql/global-search';
import { useDebounce } from './use-debounce';
import type { SearchLocation } from '@/types/search';

/**
 * Hook for location-only search functionality
 *
 * Uses the `globalEventsSearch` query but only extracts locations
 * Ignores event results - focused on city/state search
 *
 * @param query - Search query string
 * @param market - Optional market filter (miami, orlando, etc.)
 * @returns Search results with locations only and loading state
 */
export function useLocationSearch(query: string, market?: string) {
  // Debounce search query (300ms)
  const debouncedQuery = useDebounce(query, 300);

  // Query with optimized endpoint
  const { data, loading } = useQuery<GlobalEventsSearchResponse, GlobalEventsSearchVariables>(
    GLOBAL_EVENTS_SEARCH,
    {
      variables: {
        query: debouncedQuery,
        market,
        maxLocations: 8, // Show more locations since we're not showing events
        maxEvents: 0 // Don't fetch events at all
      },
      skip: !debouncedQuery || debouncedQuery.length < 2,
      fetchPolicy: 'cache-and-network'
    }
  );

  // Return only locations
  const locations: SearchLocation[] = data?.globalEventsSearch
    ? data.globalEventsSearch.locations.map(loc => ({
        ...loc,
        venueCount: loc.eventCount || 0
      }))
    : [];

  return {
    locations,
    loading,
    query: debouncedQuery
  };
}
