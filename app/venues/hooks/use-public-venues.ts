import { useQuery } from '@apollo/client';
import { PUBLIC_VENUES_PAGINATED } from '@/lib/graphql/public-venues';
import type {
  PublicVenuesResponse,
  PublicVenuesQueryVariables,
  VenueType
} from '@/types/public-venues';

interface UsePublicVenuesOptions {
  market?: string;
  search?: string;
  city?: string;
  state?: string;
  venueType?: VenueType | 'ALL';
  first?: number;
  after?: string;
}

/**
 * Hook to fetch public venues with cursor-based pagination
 * Handles filtering by market, search term, city, state, and venue type
 */
export const usePublicVenues = ({
  market = 'miami',
  search = '',
  city,
  state,
  venueType = 'ALL',
  first = 20,
  after
}: UsePublicVenuesOptions = {}) => {
  // Build GraphQL variables
  const variables: PublicVenuesQueryVariables = {
    first,
    ...(after && { after }),
    ...(market && { market }),
    ...(search.trim() && { search: search.trim() }),
    ...(city && { city }),
    ...(state && { state })
  };

  const { data, loading, error, fetchMore, refetch } = useQuery<
    PublicVenuesResponse,
    PublicVenuesQueryVariables
  >(PUBLIC_VENUES_PAGINATED, {
    variables,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network'
  });

  // Filter by venue type client-side if not 'ALL'
  // (API doesn't support venueType filter, so we filter after fetching)
  const filteredVenues =
    venueType === 'ALL' || !data
      ? data?.publicVenuesPaginated.edges || []
      : data.publicVenuesPaginated.edges.filter(
          edge => edge.node.venueType === venueType
        );

  const pageInfo = data?.publicVenuesPaginated.pageInfo;
  const totalCount = pageInfo?.totalCount || 0;

  /**
   * Load next page of results
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
    venues: filteredVenues,
    pageInfo,
    totalCount,
    loading,
    error,
    loadNextPage,
    resetPagination,
    refetch
  };
};
