import { useQuery } from "@apollo/client";
import { RECENT_AUDIT_ACTIVITY } from "@/lib/graphql/audit";
import { 
  RecentAuditActivityResponse,
  AuditVariables,
  AuditSortField,
  SortDirection,
  EntityTypeOption,
  ActionTypeOption
} from "@/types/audit";

interface UseAuditDataProps {
  debouncedSearchTerm: string;
  selectedEntityTypes: EntityTypeOption[];
  selectedActions: ActionTypeOption[];
  dateFrom?: string;
  dateTo?: string;
  sortField: AuditSortField;
  sortDirection: SortDirection;
}

export function useAuditData({
  debouncedSearchTerm,
  selectedEntityTypes,
  selectedActions,
  dateFrom,
  dateTo,
  sortField,
  sortDirection,
}: UseAuditDataProps) {
  // Audit query variables
  const variables: AuditVariables = {
    entityTypes: selectedEntityTypes.length > 0 ? selectedEntityTypes : undefined,
    limit: 100,
    filter: {
      ...(selectedActions.length > 0 && { actions: selectedActions }),
      ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
    },
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  // Recent audit activity query
  const { data, loading, error, refetch } = useQuery<RecentAuditActivityResponse>(RECENT_AUDIT_ACTIVITY, {
    variables,
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
    // Add retry configuration to handle aborted requests
    context: {
      errorPolicy: 'all'
    }
  });

  // Mock stats data since auditStats query doesn't exist in backend
  const statsLoading = false;
  const statsError = null;

  // Process data
  const auditEntries = data?.recentAuditActivity || [];
  const totalCount = auditEntries.length;

  // Calculate stats from current data
  const stats = {
    todayActions: auditEntries.filter(entry => {
      const today = new Date();
      const entryDate = new Date(entry.createdAt);
      return entryDate.toDateString() === today.toDateString();
    }).length,
    totalActions: totalCount,
    activeUsers: new Set(auditEntries.map(entry => entry.userId).filter(Boolean)).size,
    topEntityTypes: []
  };

  // Calculate top entity types from current data
  const entityTypeCounts = auditEntries.reduce((acc, entry) => {
    acc[entry.entityType] = (acc[entry.entityType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topEntityTypes = Object.entries(entityTypeCounts)
    .map(([entityType, count]) => ({ entityType, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const enhancedStats = {
    ...stats,
    topEntityTypes
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
    // Audit data
    auditEntries,
    totalCount,
    loading,
    error: displayError,
    refetch,
    
    // Stats data
    stats: enhancedStats,
    statsLoading,
    statsError: displayStatsError,
    
    // Raw data for advanced usage
    data,
  };
}