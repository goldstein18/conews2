import { useQuery, ApolloError } from '@apollo/client';
import { useMemo } from 'react';
import {
  LIST_ARTS_GROUPS,
  GET_ARTS_GROUP,
  GET_ARTS_GROUP_STATS
} from '@/lib/graphql/arts-groups';
import {
  ArtsGroup,
  ArtsGroupStats,
  ArtsGroupsFilterInput,
  ArtsGroupsResponse,
  ArtsGroupResponse,
  ArtsGroupStatsResponse
} from '@/types/arts-groups';

// Hook for paginated arts groups list
export interface UseArtsGroupsDataProps {
  first?: number;
  filter?: ArtsGroupsFilterInput;
  skip?: boolean;
}

export interface UseArtsGroupsDataReturn {
  artsGroups: ArtsGroup[];
  loading: boolean;
  error: ApolloError | undefined;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string | null;
  startCursor: string | null;
  totalCount: number;
  refetch: () => void;
  fetchMore: (cursor: string) => void;
}

export const useArtsGroupsData = ({
  first = 20,
  filter,
  skip = false
}: UseArtsGroupsDataProps = {}): UseArtsGroupsDataReturn => {
  const { data, loading, error, refetch, fetchMore: apolloFetchMore } = useQuery<ArtsGroupsResponse>(
    LIST_ARTS_GROUPS,
    {
      variables: {
        first,
        includeTotalCount: true,
        filter
      },
      skip,
      fetchPolicy: 'cache-and-network'
    }
  );

  // Memoize arrays and objects to prevent infinite re-renders
  const artsGroups = useMemo(
    () => data?.artsGroupsPaginated.edges.map(edge => edge.node) || [],
    [data?.artsGroupsPaginated.edges]
  );

  const pageInfo = useMemo(
    () => data?.artsGroupsPaginated.pageInfo,
    [data?.artsGroupsPaginated.pageInfo]
  );

  const totalCount = useMemo(
    () => data?.artsGroupsPaginated.totalCount || 0,
    [data?.artsGroupsPaginated.totalCount]
  );

  const handleFetchMore = (cursor: string) => {
    apolloFetchMore({
      variables: {
        after: cursor,
        first,
        filter
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return {
          artsGroupsPaginated: {
            ...fetchMoreResult.artsGroupsPaginated,
            edges: [
              ...prev.artsGroupsPaginated.edges,
              ...fetchMoreResult.artsGroupsPaginated.edges
            ]
          }
        };
      }
    });
  };

  return {
    artsGroups,
    loading,
    error,
    hasNextPage: pageInfo?.hasNextPage || false,
    hasPreviousPage: false, // Arts groups pagination is forward-only
    endCursor: pageInfo?.endCursor || null,
    startCursor: null, // Not supported in arts groups pagination
    totalCount,
    refetch,
    fetchMore: handleFetchMore
  };
};

// Hook for single arts group
export interface UseArtsGroupDataProps {
  id: string;
  skip?: boolean;
}

export interface UseArtsGroupDataReturn {
  artsGroup: ArtsGroup | null;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => void;
}

export const useArtsGroupData = ({
  id,
  skip = false
}: UseArtsGroupDataProps): UseArtsGroupDataReturn => {
  const { data, loading, error, refetch } = useQuery<ArtsGroupResponse>(
    GET_ARTS_GROUP,
    {
      variables: { id },
      skip: !id || skip,
      fetchPolicy: 'cache-and-network'
    }
  );

  return {
    artsGroup: data?.artsGroup || null,
    loading,
    error,
    refetch
  };
};

// Hook for arts group stats
export interface UseArtsGroupStatsReturn {
  stats: ArtsGroupStats | null;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => void;
}

export const useArtsGroupStats = (): UseArtsGroupStatsReturn => {
  const { data, loading, error, refetch } = useQuery<ArtsGroupStatsResponse>(
    GET_ARTS_GROUP_STATS,
    {
      skip: false, // Backend ready - fetch stats
      fetchPolicy: 'cache-and-network'
    }
  );

  return {
    stats: data?.artsGroupStats || null,
    loading,
    error,
    refetch
  };
};
