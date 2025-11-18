/**
 * Hook for fetching public events with pagination and filtering
 * Uses Apollo Client for GraphQL queries with cache management
 */

'use client';

import { useQuery } from '@apollo/client';
import { PUBLIC_EVENTS_PAGINATED } from '@/lib/graphql/public-events';
import type {
  PublicEventsResponse,
  PublicEventsQueryVariables,
  PublicEventEdge,
  PageInfo,
  DateFilterType
} from '@/types/public-events';

export interface UsePublicEventsOptions {
  first?: number;
  after?: string;
  dateFilter?: DateFilterType;
  virtual?: boolean;
  tagNames?: string[];  // Changed from tagIds to tagNames
  city?: string;
  state?: string;
  market?: string;
  search?: string;
  skip?: boolean;  // Skip query execution (useful for preventing duplicate queries)
}

export interface UsePublicEventsReturn {
  events: PublicEventEdge[];
  pageInfo: PageInfo | undefined;
  totalCount: number;
  loading: boolean;
  error: Error | undefined;
  loadNextPage: () => Promise<void>;
  resetPagination: () => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch public events with filters and pagination
 * Now uses tagNames (genre/subgenre names) instead of tagIds for simpler filtering
 */
export const usePublicEvents = ({
  first = 20,
  after,
  dateFilter,
  virtual,
  tagNames,  // Changed from tagIds
  city,
  state,
  market,
  search,
  skip = false  // Default to false (execute query)
}: UsePublicEventsOptions = {}): UsePublicEventsReturn => {
  // Build GraphQL variables (only include defined values)
  const variables: PublicEventsQueryVariables = {
    first,
    ...(after && { after }),
    ...(dateFilter && { dateFilter }),
    ...(virtual !== undefined && { virtual }),
    ...(tagNames && tagNames.length > 0 && { tagNames }),  // Changed from tagIds
    ...(city && { city }),
    ...(state && { state }),
    ...(market && { market }),
    ...(search?.trim() && { search: search.trim() })
  };

  const { data, loading, error, fetchMore, refetch } = useQuery<
    PublicEventsResponse,
    PublicEventsQueryVariables
  >(PUBLIC_EVENTS_PAGINATED, {
    variables,
    skip,  // Skip query execution if true
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network'
  });

  const events = data?.publicEventsPaginated.edges || [];
  const pageInfo = data?.publicEventsPaginated.pageInfo;
  const totalCount = pageInfo?.totalCount || 0;

  /**
   * Load next page of results (infinite scroll)
   */
  const loadNextPage = async () => {
    if (!pageInfo?.hasNextPage || !pageInfo.endCursor) return;

    await fetchMore({
      variables: {
        ...variables,
        after: pageInfo.endCursor
      }
    });
  };

  /**
   * Reset to first page (useful when filters change)
   */
  const resetPagination = async () => {
    await refetch({
      ...variables,
      after: undefined
    });
  };

  return {
    events,
    pageInfo,
    totalCount,
    loading,
    error: error as Error | undefined,
    loadNextPage,
    resetPagination,
    refetch: async () => { await refetch(); }
  };
};
