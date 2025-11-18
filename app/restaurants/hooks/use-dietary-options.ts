import { useQuery } from '@apollo/client';
import { PUBLIC_DIETARY_OPTIONS } from '@/lib/graphql/public-restaurants';
import type { PublicDietaryOptionsResponse, DietaryOption } from '@/types/public-restaurants';

/**
 * Hook to fetch all active dietary options
 * Used to populate amenities/dietary filter checkboxes
 * Data is cached by Apollo Client for subsequent uses
 */
export const useDietaryOptions = () => {
  const { data, loading, error, refetch } = useQuery<PublicDietaryOptionsResponse>(
    PUBLIC_DIETARY_OPTIONS,
    {
      fetchPolicy: 'cache-first', // Cache results since options don't change often
      notifyOnNetworkStatusChange: true
    }
  );

  // Filter to only active options and sort by category, then name
  const dietaryOptions: DietaryOption[] = data?.publicDietaryOptions
    ? data.publicDietaryOptions
        .filter(option => option.isActive)
        .sort((a, b) => {
          // Sort by category first, then by display name
          if (a.category !== b.category) {
            return (a.category || '').localeCompare(b.category || '');
          }
          return a.displayName.localeCompare(b.displayName);
        })
    : [];

  // Group by category for easier rendering
  const dietaryOptionsByCategory = dietaryOptions.reduce((acc, option) => {
    const category = option.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(option);
    return acc;
  }, {} as Record<string, DietaryOption[]>);

  return {
    dietaryOptions,
    dietaryOptionsByCategory,
    loading,
    error,
    refetch
  };
};
