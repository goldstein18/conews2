import { useQuery } from "@apollo/client";
import { LIST_TAGS } from "@/lib/graphql/tags";
import { TagsPaginatedResponse, TagType } from "@/types/tags";

interface UseTagsDataProps {
  debouncedSearchTerm: string;
  selectedType?: TagType;
  selectedMainGenre?: string;
  selectedStatus?: string;
  sortField: 'name' | 'display' | 'type' | 'order' | 'createdAt';
  sortDirection: 'asc' | 'desc';
  after?: string;
}

export function useTagsData({
  debouncedSearchTerm,
  selectedType,
  selectedMainGenre,
  selectedStatus,
  sortField,
  sortDirection,
  after,
}: UseTagsDataProps) {
  // Basic tags query variables
  const variables = {
    first: 20,
    ...(after && { after }),
    filter: {
      // Buscar en display (lo que ve el usuario) principalmente
      ...(debouncedSearchTerm && { display: debouncedSearchTerm }),
      ...(selectedType && { type: selectedType }),
      ...(selectedMainGenre && selectedMainGenre !== "all" && { mainGenre: selectedMainGenre }),
      ...(selectedStatus === "active" && { isActive: true }),
      ...(selectedStatus === "inactive" && { isActive: false }),
    },
    sort: {
      field: sortField,
      direction: sortDirection,
    },
    includeTotalCount: true,
  };

  // Tags query
  const { data, loading, error, refetch } = useQuery<{ tagsPaginated: TagsPaginatedResponse }>(LIST_TAGS, {
    variables,
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  // Process data - NO concatenation to avoid duplicate keys
  const tags = data?.tagsPaginated.edges.map(edge => edge.node) || [];
  const pageInfo = data?.tagsPaginated.pageInfo;
  const totalCount = pageInfo?.totalCount || 0;

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

  return {
    // Tags data
    tags,
    totalCount,
    pageInfo,
    loading,
    error: displayError,
    refetch,
    
    // Raw data for advanced usage
    data,
  };
}