import { useQuery } from '@apollo/client';
import { PUBLIC_RESTAURANT_TYPES } from '@/lib/graphql/public-restaurants';
import type { PublicRestaurantTypesResponse, RestaurantType } from '@/types/public-restaurants';

/**
 * Hook to fetch all active restaurant types (cuisine types)
 * Used to populate cuisine filter checkboxes
 * Data is cached by Apollo Client for subsequent uses
 */
export const useRestaurantTypes = () => {
  const { data, loading, error, refetch } = useQuery<PublicRestaurantTypesResponse>(
    PUBLIC_RESTAURANT_TYPES,
    {
      fetchPolicy: 'cache-first', // Cache results since types don't change often
      notifyOnNetworkStatusChange: true
    }
  );

  // Filter to only active types and sort alphabetically
  const restaurantTypes: RestaurantType[] = data?.publicRestaurantTypes
    ? data.publicRestaurantTypes
        .filter(type => type.isActive !== false)
        .sort((a, b) => {
          const nameA = a.displayName || a.name;
          const nameB = b.displayName || b.name;
          return nameA.localeCompare(nameB);
        })
    : [];

  return {
    restaurantTypes,
    loading,
    error,
    refetch
  };
};
