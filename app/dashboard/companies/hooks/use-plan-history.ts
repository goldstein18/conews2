import { useQuery } from "@apollo/client";
import { GET_COMPANY_PLAN_HISTORY } from "@/lib/graphql/company-plans";

interface PlanHistoryEntry {
  id: string;
  eventType: string;
  date: string;
  title: string;
  description: string;
  addedBy: {
    firstName: string;
    lastName: string;
  };
  fromPlan: string | null;
  toPlan: string | null;
  assetType: string | null;
  assetQuantity: number | null;
  assetDuration: string | null;
  fromStatus: string | null;
  toStatus: string | null;
}

interface UsePlanHistoryProps {
  companyId: string;
}

export function usePlanHistory({ companyId }: UsePlanHistoryProps) {
  const { data, loading, error, refetch } = useQuery(GET_COMPANY_PLAN_HISTORY, {
    variables: { 
      companyId,
      limit: 10
    },
    skip: !companyId,
    errorPolicy: "all",
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format event type for display
  const formatActionType = (eventType: string) => {
    if (!eventType) return 'Unknown Action';
    
    switch (eventType.toUpperCase()) {
      case 'ASSET_ADDITION':
        return 'Asset Addition';
      case 'ASSET_REMOVAL':
        return 'Asset Removal';
      case 'PLAN_CHANGE':
        return 'Plan Change';
      case 'STATUS_CHANGE':
        return 'Status Change';
      case 'RENEWAL':
        return 'Plan Renewal';
      case 'CANCELLATION':
        return 'Plan Cancellation';
      default:
        return eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  // Get full name from addedBy
  const getFullName = (entry: PlanHistoryEntry) => {
    if (!entry.addedBy) return 'System';
    return `${entry.addedBy.firstName} ${entry.addedBy.lastName}`.trim() || 'System';
  };

  // Extract history entries from the items array
  const planHistoryEntries = data?.getCompanyPlanHistory?.items || [];
  const totalCount = data?.getCompanyPlanHistory?.totalCount || 0;
  const hasNextPage = data?.getCompanyPlanHistory?.hasNextPage || false;
  const hasPreviousPage = data?.getCompanyPlanHistory?.hasPreviousPage || false;

  // Sort by date (most recent first)
  const sortedHistory = [...planHistoryEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter out AbortError from displaying to user
  const displayError = error && !error.message.includes('AbortError') && !error.message.includes('signal is aborted') ? error : null;

  return {
    planHistory: sortedHistory,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    loading,
    error: displayError,
    refetch,
    formatDate,
    formatActionType,
    getFullName,
  };
}