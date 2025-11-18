import { useQuery } from '@apollo/client';
import {
  LIST_MARQUEES_PAGINATED,
  GET_MARQUEE,
  GET_MARQUEE_STATS,
  GET_MY_MARQUEES,
} from '@/lib/graphql/marquee';
import type { Marquee, MarqueesFilter, MarqueeStats } from '@/types/marquee';

export function useMarquees(filter: MarqueesFilter = {}) {
  const { data, loading, error, fetchMore, refetch } = useQuery(LIST_MARQUEES_PAGINATED, {
    variables: {
      first: filter.first || 10,
      after: filter.after || null,
      includeTotalCount: filter.includeTotalCount ?? true,
      filter: {
        status: filter.status,
        market: filter.market,
        searchTerm: filter.searchTerm,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const marquees: Marquee[] = data?.marqueePaginated?.edges?.map((edge: { node: Marquee }) => edge.node) || [];
  const pageInfo = data?.marqueePaginated?.pageInfo || {};
  const totalCount = data?.marqueePaginated?.totalCount || 0;

  const loadMore = () => {
    if (pageInfo.hasNextPage && !loading) {
      fetchMore({
        variables: {
          after: pageInfo.endCursor,
        },
      });
    }
  };

  return {
    marquees,
    loading,
    error,
    pageInfo,
    totalCount,
    loadMore,
    refetch,
  };
}

export function useMarquee(id: string) {
  const { data, loading, error, refetch } = useQuery(GET_MARQUEE, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

  return {
    marquee: data?.marquee as Marquee | undefined,
    loading,
    error,
    refetch,
  };
}

export function useMarqueeStats(market?: string) {
  const { data, loading, error, refetch } = useQuery(GET_MARQUEE_STATS, {
    variables: market ? { market } : undefined,
    fetchPolicy: 'cache-and-network',
  });

  return {
    stats: data?.marqueeStats as MarqueeStats | undefined,
    loading,
    error,
    refetch,
  };
}

export function useMyMarquees() {
  const { data, loading, error, refetch } = useQuery(GET_MY_MARQUEES, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    marquees: (data?.myMarquees || []) as Marquee[],
    loading,
    error,
    refetch,
  };
}
