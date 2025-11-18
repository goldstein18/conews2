"use client";

import { useQuery } from '@apollo/client';
import { LIST_ESCOOPS } from '@/lib/graphql/escoops';
import {
  EscoopsPaginatedFilterInput,
  EscoopsPaginatedResponse
} from '@/types/escoops';

interface UseEscoopsDataProps {
  filter: EscoopsPaginatedFilterInput;
  enabled?: boolean;
}

export function useEscoopsData({ filter, enabled = true }: UseEscoopsDataProps) {
  const {
    data,
    loading,
    error,
    refetch,
    fetchMore,
    networkStatus
  } = useQuery<{ escoopsPaginated: EscoopsPaginatedResponse }>(LIST_ESCOOPS, {
    variables: { filter },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    skip: !enabled,
    fetchPolicy: 'cache-and-network'
  });

  const escoops = data?.escoopsPaginated?.edges?.map(edge => edge.node) || [];
  const pageInfo = data?.escoopsPaginated?.pageInfo;
  const totalCount = pageInfo?.totalCount || 0;

  // Load next page
  const loadNextPage = async () => {
    if (!pageInfo?.hasNextPage || !pageInfo?.endCursor) return;

    try {
      await fetchMore({
        variables: {
          filter: {
            ...filter,
            after: pageInfo.endCursor
          }
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult?.escoopsPaginated) return prev;

          return {
            escoopsPaginated: {
              ...fetchMoreResult.escoopsPaginated,
              edges: [
                ...prev.escoopsPaginated.edges,
                ...fetchMoreResult.escoopsPaginated.edges
              ]
            }
          };
        }
      });
    } catch (error) {
      console.error('Error loading more escoops:', error);
    }
  };

  // Load previous page
  const loadPreviousPage = async () => {
    if (!pageInfo?.hasPreviousPage || !pageInfo?.startCursor) return;

    try {
      await refetch({
        filter: {
          ...filter,
          after: undefined,
          before: pageInfo.startCursor
        }
      });
    } catch (error) {
      console.error('Error loading previous escoops:', error);
    }
  };

  // Navigate to next page (replace current results)
  const nextPage = async () => {
    if (!pageInfo?.hasNextPage || !pageInfo?.endCursor) return;

    try {
      await refetch({
        filter: {
          ...filter,
          after: pageInfo.endCursor
        }
      });
    } catch (error) {
      console.error('Error navigating to next page:', error);
    }
  };

  // Navigate to previous page (replace current results)
  const previousPage = async () => {
    if (!pageInfo?.hasPreviousPage || !pageInfo?.startCursor) return;

    try {
      await refetch({
        filter: {
          ...filter,
          after: undefined,
          before: pageInfo.startCursor
        }
      });
    } catch (error) {
      console.error('Error navigating to previous page:', error);
    }
  };

  return {
    escoops,
    pageInfo,
    totalCount,
    loading,
    error,
    refetch,
    loadNextPage,
    loadPreviousPage,
    nextPage,
    previousPage,
    networkStatus
  };
}