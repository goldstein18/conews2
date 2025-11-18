'use client';

import { useQuery } from '@apollo/client';
import { Restaurant, RestaurantsResponse, RestaurantStatsResponse, RestaurantsFilterInput, RestaurantStatus, PriceRange } from '@/types/restaurants';
import { LIST_RESTAURANTS, GET_RESTAURANT_STATS, GET_RESTAURANT, GET_RESTAURANT_FOR_EDIT } from '@/lib/graphql/restaurants';

interface UseRestaurantsDataProps {
  search?: string;
  status?: string;
  priceRange?: string;
  city?: string;
  market?: string;
  cuisineType?: string;
  first?: number;
  after?: string;
}

export function useRestaurantsData({
  search,
  status,
  priceRange,
  city,
  market,
  cuisineType,
  first = 20,
  after
}: UseRestaurantsDataProps) {
  // Build filter object
  const filter: RestaurantsFilterInput = {
    first,
    includeTotalCount: true
  };

  if (search?.trim()) filter.search = search.trim();
  if (status && status !== 'ALL') filter.status = status as RestaurantStatus;
  if (priceRange && priceRange !== 'ALL') filter.priceRange = priceRange as PriceRange;
  if (city?.trim()) filter.city = city.trim();
  if (market?.trim()) filter.market = market.trim();
  if (cuisineType?.trim()) filter.cuisineType = cuisineType.trim();
  if (after) filter.after = after;

  const { data, loading, error, refetch, fetchMore } = useQuery<RestaurantsResponse>(LIST_RESTAURANTS, {
    variables: { filter },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });

  // Handle fetchMore for pagination
  const handleFetchMore = ({ after: newAfter }: { after: string }) => {
    return fetchMore({
      variables: {
        filter: {
          ...filter,
          after: newAfter
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        
        return {
          restaurantsPaginated: {
            ...fetchMoreResult.restaurantsPaginated,
            edges: [
              ...prev.restaurantsPaginated.edges,
              ...fetchMoreResult.restaurantsPaginated.edges
            ]
          }
        };
      }
    });
  };

  const restaurants: Restaurant[] = data?.restaurantsPaginated?.edges?.map(edge => edge.node) || [];
  const pageInfo = data?.restaurantsPaginated?.pageInfo;
  const totalCount = pageInfo?.totalCount;

  return {
    restaurants,
    totalCount,
    pageInfo,
    loading,
    error,
    refetch,
    fetchMore: handleFetchMore
  };
}

// Hook for restaurant stats
export function useRestaurantStats() {
  const { data, loading, error, refetch } = useQuery<RestaurantStatsResponse>(GET_RESTAURANT_STATS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  return {
    stats: data?.restaurantStats,
    loading,
    error,
    refetch
  };
}

// Interfaces for individual restaurant hooks
interface UseRestaurantDataProps {
  identifier: string;
  skip?: boolean;
}

interface UseRestaurantDataReturn {
  restaurant: Restaurant | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Hook for single restaurant data
export function useRestaurantData({ 
  identifier, 
  skip = false 
}: UseRestaurantDataProps): UseRestaurantDataReturn {
  const { data, loading, error, refetch } = useQuery(GET_RESTAURANT, {
    variables: { id: identifier },
    skip,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  });

  return {
    restaurant: data?.restaurant || null,
    loading,
    error: error || null,
    refetch
  };
}

// Hook for single restaurant data for editing
export function useRestaurantDataForEdit({ 
  identifier, 
  skip = false 
}: UseRestaurantDataProps): UseRestaurantDataReturn {
  const { data, loading, error, refetch } = useQuery(GET_RESTAURANT_FOR_EDIT, {
    variables: { id: identifier },
    skip,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  });

  return {
    restaurant: data?.restaurant || null,
    loading,
    error: error || null,
    refetch
  };
}