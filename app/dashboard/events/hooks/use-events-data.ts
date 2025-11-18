import { useQuery } from "@apollo/client";
import { LIST_EVENTS, EVENTS_DASHBOARD_STATS } from "@/lib/graphql/events";
import { 
  EventsResponse, 
  EventsVariables,
  EventsDashboardStatsResponse,
  EventsDashboardStatsVariables,
  EventsSortField,
  EventsSortDirection,
  EventsFilterInput
} from "@/types/events";

interface UseEventsDataProps {
  debouncedSearchTerm: string;
  selectedStatus: string;
  selectedMarket: string;
  selectedCompany: string;
  sortField: EventsSortField;
  sortDirection: EventsSortDirection;
  after?: string;
}

export function useEventsData({
  debouncedSearchTerm,
  selectedStatus,
  selectedMarket,
  selectedCompany,
  sortField,
  sortDirection,
  after,
}: UseEventsDataProps) {
  // Events list query variables - now filter contains everything
  const filter: EventsFilterInput = {
    first: 20,
    ...(after && { after }),
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    ...(selectedStatus !== "all" && { status: selectedStatus }),
    ...(selectedMarket !== "all" && { market: selectedMarket }),
    ...(selectedCompany !== "all" && { companyId: selectedCompany }),
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  const variables: EventsVariables = {
    filter,
  };

  // Dashboard stats variables
  const statsVariables: EventsDashboardStatsVariables = {
    ...(selectedMarket !== "all" && { market: selectedMarket }),
    ...(selectedCompany !== "all" && { companyId: selectedCompany }),
  };

  // Parallel queries for events list and dashboard stats
  const { data, loading, error, fetchMore } = useQuery<EventsResponse>(LIST_EVENTS, {
    variables,
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
    context: {
      errorPolicy: 'all'
    }
  });

  const { data: statsData, loading: statsLoading, error: statsError } = useQuery<EventsDashboardStatsResponse>(EVENTS_DASHBOARD_STATS, {
    variables: statsVariables,
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    context: {
      errorPolicy: 'all'
    }
  });

  // Pagination handlers
  const handleLoadMore = () => {
    if (data?.eventsPaginated.pageInfo.hasNextPage) {
      const newFilter: EventsFilterInput = {
        ...filter,
        after: data.eventsPaginated.pageInfo.endCursor,
      };
      
      fetchMore({
        variables: {
          filter: newFilter,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            eventsPaginated: {
              ...fetchMoreResult.eventsPaginated,
              edges: [...prev.eventsPaginated.edges, ...fetchMoreResult.eventsPaginated.edges],
            },
          };
        },
      });
    }
  };

  // Process data
  const events = data?.eventsPaginated.edges.map(edge => edge.node) || [];
  const totalCount = data?.eventsPaginated.pageInfo.totalCount || 0;
  const pageInfo = data?.eventsPaginated.pageInfo;

  const summary = statsData?.eventsDashboardStats.summary || {
    totalEvents: 0,
    pendingEvents: 0,
    liveEvents: 0,
    draftEvents: 0,
    pastEvents: 0,
  };

  // Filter out AbortError and similar navigation-related errors from displaying to user
  const isAbortError = (err: Error | null | undefined) => {
    if (!err) return false;
    const message = err.message || '';
    return message.includes('AbortError') || 
           message.includes('signal is aborted') || 
           message.includes('operation was aborted') ||
           message.includes('Request aborted') ||
           err.name === 'AbortError';
  };

  const displayError = error && !isAbortError(error) ? error : null;
  const displayStatsError = statsError && !isAbortError(statsError) ? statsError : null;

  return {
    // Events data
    events,
    totalCount,
    pageInfo,
    loading,
    error: displayError,
    handleLoadMore,
    
    // Stats data
    summary,
    statsLoading,
    statsError: displayStatsError,
    
    // Raw data for advanced usage
    data,
    statsData,
  };
}