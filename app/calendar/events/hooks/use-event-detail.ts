/**
 * Hook for fetching single event detail by slug
 * Used on event detail pages
 */

'use client';

import { useQuery } from '@apollo/client';
import { PUBLIC_EVENT } from '@/lib/graphql/public-events';
import type { PublicEventResponse, PublicEventVariables, PublicEvent } from '@/types/public-events';

export interface UseEventDetailReturn {
  event: PublicEvent | null;
  loading: boolean;
  error: Error | undefined;
  notFound: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch a single event by slug or ID
 */
export const useEventDetail = (slug: string): UseEventDetailReturn => {
  const { data, loading, error, refetch } = useQuery<
    PublicEventResponse,
    PublicEventVariables
  >(PUBLIC_EVENT, {
    variables: { identifier: slug },
    skip: !slug,
    fetchPolicy: 'cache-and-network'
  });

  const event = data?.publicEvent || null;
  const notFound = !loading && !error && !event;

  return {
    event,
    loading,
    error: error as Error | undefined,
    notFound,
    refetch: async () => { await refetch(); }
  };
};
