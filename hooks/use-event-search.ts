'use client';

import { useQuery } from '@apollo/client';
import {
  GLOBAL_EVENTS_SEARCH,
  type GlobalEventsSearchResponse,
  type GlobalEventsSearchVariables
} from '@/lib/graphql/global-search';
import { useDebounce } from './use-debounce';
import type { SearchResults, SearchEvent } from '@/types/search';

/**
 * Hook for optimized event search functionality
 *
 * Uses the `globalEventsSearch` query which:
 * - Returns structured data (locations + events)
 * - Only essential fields per event
 * - Backend processes location extraction
 *
 * @param query - Search query string
 * @param market - Optional market filter (miami, orlando, etc.)
 * @returns Search results with locations, events, and loading state
 */
export function useEventSearch(query: string, market?: string) {
  // Debounce search query (300ms)
  const debouncedQuery = useDebounce(query, 300);

  // Query with optimized endpoint
  const { data, loading } = useQuery<GlobalEventsSearchResponse, GlobalEventsSearchVariables>(
    GLOBAL_EVENTS_SEARCH,
    {
      variables: {
        query: debouncedQuery,
        market,
        maxLocations: 5,
        maxEvents: 10
      },
      skip: !debouncedQuery || debouncedQuery.length < 2,
      fetchPolicy: 'cache-and-network'
    }
  );

  // Return structured results (map events to entities for generic interface)
  const results: SearchResults<SearchEvent> = data?.globalEventsSearch
    ? {
        locations: data.globalEventsSearch.locations.map(loc => ({
          ...loc,
          venueCount: loc.eventCount || 0 // Map eventCount to venueCount for backward compatibility
        })),
        entities: data.globalEventsSearch.events, // Map to entities
        totalResults: data.globalEventsSearch.totalResults
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
