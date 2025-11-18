import { useQuery } from '@apollo/client';
import { GET_TICKET_STATS } from '@/lib/graphql/tickets';
import { TicketStatsResponse } from '@/types/ticket';

interface UseTicketStatsProps {
  companyId?: string;
}

export function useTicketStats({ companyId }: UseTicketStatsProps = {}) {
  const { data, loading, error, refetch } = useQuery<TicketStatsResponse>(GET_TICKET_STATS, {
    variables: companyId ? { companyId } : {},
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const stats = data?.ticketStats || {
    total: 0,
    open: 0,
    inProgress: 0,
    waitingForCustomer: 0,
    resolved: 0,
    closed: 0,
    cancelled: 0,
    reopened: 0,
    urgent: 0,
    high: 0,
    unassigned: 0,
  };

  return {
    stats,
    loading,
    error,
    refetch,
  };
}
