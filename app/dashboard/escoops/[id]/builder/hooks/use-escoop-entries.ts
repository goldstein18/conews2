import { useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { GET_ESCOOP_ENTRIES } from '@/lib/graphql/escoop-entries';
import type { EscoopBuilderEntry } from '@/store/escoop-builder-store';
import type { ApolloError } from '@apollo/client';

interface UseEscoopEntriesProps {
  escoopId: string;
  enabled?: boolean;
}

interface UseEscoopEntriesReturn {
  entries: EscoopBuilderEntry[];
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => void;
  hasNextPage: boolean;
  loadMore: () => void;
}

export function useEscoopEntries({
  escoopId,
  enabled = true
}: UseEscoopEntriesProps): UseEscoopEntriesReturn {
  console.log('🔍 useEscoopEntries called with:', { escoopId, enabled });

  const { data, loading, error, refetch, fetchMore } = useQuery(GET_ESCOOP_ENTRIES, {
    variables: {
      paginatedFilter: {
        filter: {
          escoopId
        },
        first: 50, // Load more entries initially for builder
        includeTotalCount: true
      }
    },
    skip: !enabled || !escoopId,
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });

  console.log('useEscoopEntries query state:', {
    loading,
    error,
    dataExists: !!data,
    skip: !enabled || !escoopId,
    escoopId,
    enabled
  });

  // Transform API data to store format
  const entries = useMemo(() => {
    if (!data?.escoopEntriesPaginated?.edges) return [];

    return data.escoopEntriesPaginated.edges.map((edge: {
      node: {
        id: string;
        escoopId: string;
        eventId: string;
        status: string;
        locations: string[];
        event: {
          id: string;
          title: string;
          startDate?: string;
          imageUrl?: string;
          slug: string;
        };
        approvalReason?: string;
        createdAt: string;
        updatedAt: string;
      };
    }) => ({
      id: edge.node.id,
      eventId: edge.node.eventId,
      event: {
        id: edge.node.event.id,
        title: edge.node.event.title,
        startDate: edge.node.event.startDate,
        mainImageUrl: edge.node.event.imageUrl,
        status: edge.node.status
      },
      status: edge.node.status,
      locations: edge.node.locations || [],
      isSelected: true // Auto-select all entries for preview
    })) as EscoopBuilderEntry[];
  }, [data]);

  console.log('📊 useEscoopEntries processed entries:', {
    entriesCount: entries.length,
    loading,
    hasError: !!error
  });

  const hasNextPage = data?.escoopEntriesPaginated?.pageInfo?.hasNextPage || false;

  const loadMore = useCallback(() => {
    if (!hasNextPage || loading) return;

    fetchMore({
      variables: {
        paginatedFilter: {
          filter: {
            escoopId
          },
          first: 20,
          after: data?.escoopEntriesPaginated?.pageInfo?.endCursor
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.escoopEntriesPaginated) return prev;

        return {
          escoopEntriesPaginated: {
            ...fetchMoreResult.escoopEntriesPaginated,
            edges: [
              ...prev.escoopEntriesPaginated.edges,
              ...fetchMoreResult.escoopEntriesPaginated.edges
            ]
          }
        };
      }
    });
  }, [hasNextPage, loading, fetchMore, escoopId, data?.escoopEntriesPaginated?.pageInfo?.endCursor]);

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    entries,
    loading,
    error,
    refetch: handleRefetch,
    hasNextPage,
    loadMore
  };
}