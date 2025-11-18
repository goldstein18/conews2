import { useQuery } from '@apollo/client';
import { PUBLIC_RESTAURANTS_PAGINATED } from '@/lib/graphql/public-restaurants';
import type {
  PublicRestaurantsResponse,
  PublicRestaurantsQueryVariables,
  PriceRange
} from '@/types/public-restaurants';

interface UsePublicRestaurantsOptions {
  market?: string;
  search?: string;
  city?: string;
  state?: string;
  priceRange?: PriceRange | 'ALL';
  cuisineTypeIds?: string[];
  amenityIds?: string[];
  first?: number;
  after?: string;
}

/**
 * Hook to fetch public restaurants with cursor-based pagination
 * Handles filtering by market, search term, city, state, price range, cuisine types, and amenities
 * All filtering is done server-side for optimal performance
 */
export const usePublicRestaurants = ({
  market = 'miami',
  search = '',
  city,
  state,
  priceRange = 'ALL',
  cuisineTypeIds = [],
  amenityIds = [],
  first = 20,
  after
}: UsePublicRestaurantsOptions = {}) => {
  // Build GraphQL variables
  const variables: PublicRestaurantsQueryVariables = {
    first,
    ...(after && { after }),
    ...(market && { market }),
    ...(search.trim() && { search: search.trim() }),
    ...(city && { city }),
    ...(state && { state }),
    // Server-side filtering for price range (moved from client-side)
    ...(priceRange !== 'ALL' && { priceRange }),
    // Server-side filtering for cuisine types (multiple selection)
    ...(cuisineTypeIds.length > 0 && { restaurantTypeIds: cuisineTypeIds }),
    // Server-side filtering for amenities/dietary options
    ...(amenityIds.length > 0 && { dietaryOptions: amenityIds })
  };

  const { data, loading, error, fetchMore, refetch } = useQuery<
    PublicRestaurantsResponse,
    PublicRestaurantsQueryVariables
  >(PUBLIC_RESTAURANTS_PAGINATED, {
    variables,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network'
  });

  // No more client-side filtering - all filtering now done server-side
  const restaurants = data?.publicRestaurantsPaginated.edges || [];

  const pageInfo = data?.publicRestaurantsPaginated.pageInfo;
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
    restaurants,
    pageInfo,
    totalCount,
    loading,
    error,
    loadNextPage,
    resetPagination,
    refetch
  };
};
