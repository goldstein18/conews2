/**
 * usePublicArtsGroups Hook
 * Hook for fetching paginated public arts groups data
 */

'use client';

import { useQuery } from '@apollo/client';
import { PUBLIC_ARTS_GROUPS_PAGINATED } from '@/lib/graphql/public-arts-groups';
import type {
  PublicArtsGroupsPaginatedResponse,
  PublicArtsGroupsQueryVariables,
  ArtsGroupFilters,
} from '@/types/public-arts-groups';

export interface UsePublicArtsGroupsOptions {
  filters?: ArtsGroupFilters;
  pageSize?: number;
}

export const usePublicArtsGroups = (options: UsePublicArtsGroupsOptions = {}) => {
  const { filters = {}, pageSize = 12 } = options;

  const variables: PublicArtsGroupsQueryVariables = {
    first: pageSize,
    filter: {
      ...(filters.market && { market: filters.market }),
      ...(filters.search && { searchTerm: filters.search }),
      ...(filters.city && { city: filters.city }),
      ...(filters.state && { state: filters.state }),
    },
  };

  const { data, loading, error, fetchMore } = useQuery<
    PublicArtsGroupsPaginatedResponse,
    PublicArtsGroupsQueryVariables
  >(PUBLIC_ARTS_GROUPS_PAGINATED, {
    variables,
    notifyOnNetworkStatusChange: true,
  });

  const artsGroups = data?.publicArtsGroupsPaginated?.edges.map((edge) => edge.node) || [];
  const pageInfo = data?.publicArtsGroupsPaginated?.pageInfo;
  const totalCount = data?.publicArtsGroupsPaginated?.totalCount || pageInfo?.totalCount || 0;
  const hasNextPage = pageInfo?.hasNextPage || false;

  const loadNextPage = async () => {
    if (!hasNextPage || !pageInfo?.endCursor) return;

    try {
      await fetchMore({
        variables: {
          ...variables,
          after: pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;

          return {
            publicArtsGroupsPaginated: {
              ...fetchMoreResult.publicArtsGroupsPaginated,
              edges: [
                ...(previousResult.publicArtsGroupsPaginated?.edges || []),
                ...fetchMoreResult.publicArtsGroupsPaginated.edges,
              ],
            },
          };
        },
      });
    } catch (err) {
      console.error('Error loading more arts groups:', err);
    }
  };

  return {
    artsGroups,
    loading,
    error,
    totalCount,
    hasNextPage,
    loadNextPage,
  };
};
