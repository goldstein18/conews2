/**
 * Arts Group Search Hook
 * Uses optimized globalArtsGroupsSearch query for fast search results
 */

'use client';

import { useQuery } from '@apollo/client';
import { GLOBAL_ARTS_GROUPS_SEARCH } from '@/lib/graphql/public-arts-groups';
import { useDebounce } from './use-debounce';
import type { SearchResults, SearchArtsGroup, SearchLocation } from '@/types/search';

/**
 * GraphQL response type for global arts groups search
 */
interface GlobalArtsGroupsSearchResponse {
  globalArtsGroupsSearch: {
    locations: Array<{
      city: string;
      state: string;
      market?: string;
      count: number;
    }>;
    artsGroups: Array<{
      id: string;
      name: string;
      slug: string;
      artType?: string;
      imageUrl?: string;
      city: string;
      market?: string;
    }>;
    totalResults: number;
  };
}

/**
 * GraphQL variables for global arts groups search
 */
interface GlobalArtsGroupsSearchVariables {
  input: {
    query: string;
    market?: string;
    maxLocations?: number;
    maxArtsGroups?: number;
  };
}

/**
 * Hook for optimized arts group search functionality
 *
 * Uses the `globalArtsGroupsSearch` query which:
 * - Returns structured data (locations + arts groups)
 * - Backend processes location extraction
 * - Only essential fields for search results
 *
 * @param query - Search query string
 * @param market - Optional market filter (miami, orlando, etc.)
 * @returns Search results with locations, arts groups, and loading state
 */
export function useArtsGroupSearch(query: string, market?: string) {
  // Debounce search query (300ms)
  const debouncedQuery = useDebounce(query, 300);

  // Query with optimized endpoint
  const { data, loading } = useQuery<GlobalArtsGroupsSearchResponse, GlobalArtsGroupsSearchVariables>(
    GLOBAL_ARTS_GROUPS_SEARCH,
    {
      variables: {
        input: {
          query: debouncedQuery,
          market,
          maxLocations: 5,
          maxArtsGroups: 10
        }
      },
      skip: !debouncedQuery || debouncedQuery.length < 2,
      fetchPolicy: 'cache-and-network'
    }
  );

  // Map backend response to SearchResults format
  const results: SearchResults<SearchArtsGroup> = data?.globalArtsGroupsSearch
    ? {
        // Map locations (backend returns 'count' instead of 'venueCount')
        locations: data.globalArtsGroupsSearch.locations.map(loc => ({
          city: loc.city,
          state: loc.state,
          market: loc.market,
          venueCount: loc.count // Map count to venueCount for backward compatibility
        })),
        // Map arts groups to SearchArtsGroup format - backend now returns 'city' directly
        entities: data.globalArtsGroupsSearch.artsGroups.map(group => ({
          id: group.id,
          name: group.name,
          slug: group.slug,
          city: group.city, // Backend now provides city directly
          state: 'FL', // TODO: Backend should provide state field
          imageUrl: group.imageUrl,
          artType: group.artType,
          memberCount: undefined // Not needed for search results
        })),
        totalResults: data.globalArtsGroupsSearch.totalResults
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
