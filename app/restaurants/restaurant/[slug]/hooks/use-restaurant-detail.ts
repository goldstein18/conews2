import { useQuery } from '@apollo/client';
import { PUBLIC_RESTAURANT } from '@/lib/graphql/public-restaurants';
import type {
  PublicRestaurantResponse,
  PublicRestaurantVariables
} from '@/types/public-restaurants';

/**
 * Hook to fetch a single restaurant by slug
 * Returns null if restaurant doesn't exist or isn't approved
 */
export const useRestaurantDetail = (identifier: string) => {
  const { data, loading, error, refetch } = useQuery<
    PublicRestaurantResponse,
    PublicRestaurantVariables
  >(PUBLIC_RESTAURANT, {
    variables: { identifier },
    fetchPolicy: 'cache-first', // Use cache for better performance
    skip: !identifier // Don't run query if no identifier
  });

  const restaurant = data?.publicRestaurant;

  // Determine if restaurant was not found (null response but no error)
  const notFound = !loading && !error && !restaurant;

  return {
    restaurant,
    loading,
    error,
    notFound,
    refetch
  };
};
