import { useQuery } from '@apollo/client';
import { PUBLIC_VENUE } from '@/lib/graphql/public-venues';
import type {
  PublicVenueResponse,
  PublicVenueVariables
} from '@/types/public-venues';

/**
 * Hook to fetch a single venue by identifier (slug)
 * Used for venue detail page
 */
export const useVenueDetail = (identifier: string) => {
  const { data, loading, error, refetch } = useQuery<
    PublicVenueResponse,
    PublicVenueVariables
  >(PUBLIC_VENUE, {
    variables: { identifier },
    skip: !identifier, // Don't run query if identifier is empty
    fetchPolicy: 'cache-and-network'
  });

  const venue = data?.publicVenue;

  return {
    venue,
    loading,
    error,
    refetch,
    notFound: !loading && !error && !venue
  };
};
