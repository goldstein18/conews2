import { useQuery } from "@apollo/client";
import { LIST_COMPANY_OWNERS, MEMBERS_DASHBOARD_STATS } from "@/lib/graphql/members";
import { 
  MembersResponse, 
  MembersVariables,
  CompaniesDashboardStatsResponse,
  CompaniesDashboardStatsVariables,
  SortField,
  SortDirection
} from "@/types/members";

interface UseMembersDataProps {
  debouncedSearchTerm: string;
  selectedMarket: string;
  selectedStatus: string;
  selectedPlan: string;
  selectedSummaryFilter: string;
  sortField: SortField;
  sortDirection: SortDirection;
  after?: string;
}

export function useMembersData({
  debouncedSearchTerm,
  selectedMarket,
  selectedStatus,
  selectedPlan,
  selectedSummaryFilter,
  sortField,
  sortDirection,
  after,
}: UseMembersDataProps) {
  // Members query variables
  const variables: MembersVariables = {
    first: 20,
    ...(after && { after }),
    filter: {
      ...(debouncedSearchTerm && { email: debouncedSearchTerm }),
      ...(selectedMarket !== "all" && { market: selectedMarket }),
      ...(selectedStatus === "active" && { activeOnly: true }),
      ...(selectedStatus === "inactive" && { activeOnly: false }),
      ...(selectedPlan !== "all" && { planSlug: selectedPlan }),
      ...(selectedSummaryFilter === "active" && { activeOnly: true }),
      ...(selectedSummaryFilter === "pending" && { pendingOnly: true }),
      ...(selectedSummaryFilter === "expiring" && { expiringThisMonth: true }),
    },
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  // Dashboard stats variables
  const statsVariables: CompaniesDashboardStatsVariables = {
    ...(selectedMarket !== "all" && { market: selectedMarket }),
  };

  // Parallel queries for company owners list and dashboard stats
  const { data, loading, error, fetchMore } = useQuery<MembersResponse>(LIST_COMPANY_OWNERS, {
    variables,
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
    // Add retry configuration to handle aborted requests
    context: {
      errorPolicy: 'all'
    }
  });

  const { data: statsData, loading: statsLoading, error: statsError } = useQuery<CompaniesDashboardStatsResponse>(MEMBERS_DASHBOARD_STATS, {
    variables: statsVariables,
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    // Add retry configuration to handle aborted requests
    context: {
      errorPolicy: 'all'
    }
  });

  // Pagination handlers
  const handleLoadMore = () => {
    if (data?.membersPaginated.pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          ...variables,
          after: data.membersPaginated.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            membersPaginated: {
              ...fetchMoreResult.membersPaginated,
              edges: [...prev.membersPaginated.edges, ...fetchMoreResult.membersPaginated.edges],
            },
          };
        },
      });
    }
  };

  // Process data
  const members = data?.membersPaginated.edges.map(edge => edge.node) || [];
  const totalCount = data?.membersPaginated.pageInfo.totalCount || 0;
  const pageInfo = data?.membersPaginated.pageInfo;

  const planStats = statsData?.membersDashboardStats.planStats || [];
  const summary = statsData?.membersDashboardStats.summary || {
    totalCompanies: 0,
    activeCompanies: 0,
    pendingCompanies: 0,
    expiringThisMonth: 0,
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
    // Members data
    members,
    totalCount,
    pageInfo,
    loading,
    error: displayError,
    handleLoadMore,
    
    // Stats data
    planStats,
    summary,
    statsLoading,
    statsError: displayStatsError,
    
    // Raw data for advanced usage
    data,
    statsData,
  };
}