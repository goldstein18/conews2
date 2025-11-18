'use client';

import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import {
  LIST_DEDICATED,
  DEDICATED_PAGINATED,
  GET_DEDICATED,
  DEDICATED_STATS
} from '@/lib/graphql/dedicated';
import { Dedicated, DedicatedStats, DedicatedFilterInput } from '@/types/dedicated';

interface UseDedicatedDataOptions {
  first?: number;
  after?: string;
  filter?: DedicatedFilterInput;
  skip?: boolean;
}

export function useDedicatedData(options: UseDedicatedDataOptions = {}) {
  const { first = 50, after, filter, skip = false } = options;

  const { data, loading, error, refetch, fetchMore } = useQuery(DEDICATED_PAGINATED, {
    variables: {
      first,
      after: after || null,
      includeTotalCount: true,
      filter
    },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  // Memoize arrays and objects to prevent infinite re-renders
  const dedicated = useMemo(
    () => data?.dedicatedPaginated?.edges?.map((edge: { node: Dedicated }) => edge.node) || [],
    [data?.dedicatedPaginated?.edges]
  );

  const pageInfo = useMemo(
    () => data?.dedicatedPaginated?.pageInfo || { hasNextPage: false, endCursor: null },
    [data?.dedicatedPaginated?.pageInfo]
  );

  const totalCount = useMemo(
    () => data?.dedicatedPaginated?.totalCount || 0,
    [data?.dedicatedPaginated?.totalCount]
  );

  const loadMore = () => {
    if (pageInfo.hasNextPage && !loading) {
      return fetchMore({
        variables: {
          after: pageInfo.endCursor
        }
      });
    }
    return Promise.resolve();
  };

  return {
    dedicated,
    pageInfo,
    totalCount,
    loading,
    error,
    refetch,
    loadMore
  };
}

export function useDedicatedList(filter?: DedicatedFilterInput) {
  const { data, loading, error, refetch } = useQuery(LIST_DEDICATED, {
    variables: { filter },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  // Memoize to prevent infinite re-renders
  const dedicated = useMemo(
    () => data?.dedicatedList || [],
    [data?.dedicatedList]
  );

  return {
    dedicated,
    loading,
    error,
    refetch
  };
}

export function useGetDedicated(id: string, skip = false) {
  const { data, loading, error, refetch } = useQuery(GET_DEDICATED, {
    variables: { id },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  // Memoize to prevent infinite re-renders
  const dedicated = useMemo(
    () => data?.dedicated || null,
    [data?.dedicated]
  );

  return {
    dedicated,
    loading,
    error,
    refetch
  };
}

export function useDedicatedStats(market?: string) {
  const { data, loading, error, refetch } = useQuery(DEDICATED_STATS, {
    variables: { market: market || null },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  // Memoize to prevent infinite re-renders
  const stats: DedicatedStats = useMemo(
    () => data?.dedicatedStats || {
      total: 0,
      pending: 0,
      scheduled: 0,
      sent: 0,
      deleted: 0,
      byMarket: undefined
    },
    [data?.dedicatedStats]
  );

  return {
    stats,
    loading,
    error,
    refetch
  };
}
