import { useQuery } from '@apollo/client';
import { GET_TICKETS_PAGINATED } from '@/lib/graphql/tickets';
import { TicketsPaginatedResponse, TicketFilterInput } from '@/types/ticket';

interface UseTicketDataProps {
  filter?: TicketFilterInput;
  after?: string;
  first?: number;
}

export function useTicketData({
  filter,
  after,
  first = 20,
}: UseTicketDataProps = {}) {
  const { data, loading, error, refetch, fetchMore } = useQuery<TicketsPaginatedResponse>(
    GET_TICKETS_PAGINATED,
    {
      variables: {
        first,
        after,
        includeTotalCount: true,
        filter,
      },
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    }
  );

  const tickets = data?.ticketsPaginated?.edges?.map(edge => edge.node) || [];
  const pageInfo = data?.ticketsPaginated?.pageInfo || {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: '',
    endCursor: '',
  };
  const totalCount = data?.ticketsPaginated?.totalCount || 0;

  // Handle load more (next page)
  const handleLoadMore = async () => {
    if (!pageInfo.hasNextPage) return;

    await fetchMore({
      variables: {
        after: pageInfo.endCursor,
      },
    });
  };

  // Filter out AbortError from displaying to user
  const isAbortError = (err: Error | null | undefined) => {
    if (!err) return false;
    const message = err.message || '';
    return (
      message.includes('AbortError') ||
      message.includes('signal is aborted') ||
      message.includes('operation was aborted') ||
      message.includes('Request aborted') ||
      err.name === 'AbortError'
    );
  };

  const displayError = error && !isAbortError(error) ? error : null;

  return {
    tickets,
    totalCount,
    pageInfo,
    loading,
    error: displayError,
    refetch,
    handleLoadMore,
  };
}
