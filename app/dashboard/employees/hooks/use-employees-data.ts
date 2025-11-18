import { useQuery } from "@apollo/client";
import { LIST_EMPLOYEES } from "@/lib/graphql/employees";
import { EmployeesResponse } from "@/types/employees";
import { SortField, SortDirection } from "@/types/members";

interface UseEmployeesDataProps {
  debouncedSearchTerm: string;
  selectedMarket?: string;
  selectedRole?: string;
  selectedStatus?: string;
  selectedSummaryFilter?: string;
  sortField: SortField;
  sortDirection: SortDirection;
  after?: string;
}

export function useEmployeesData({
  debouncedSearchTerm,
  selectedMarket,
  selectedRole,
  selectedStatus,
  selectedSummaryFilter,
  sortField,
  sortDirection,
  after,
}: UseEmployeesDataProps) {
  console.log('Filtering with:', {
    debouncedSearchTerm,
    selectedMarket,
    selectedRole,
    selectedStatus,
    selectedSummaryFilter,
    sortField,
    sortDirection
  });
  // Basic employees query variables (no filtering for now)
  const variables = {
    first: 20,
    ...(after && { after }),
  };

  // Employees query
  const { data, loading, error, fetchMore } = useQuery<EmployeesResponse>(LIST_EMPLOYEES, {
    variables,
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  // Pagination handlers
  const handleLoadMore = () => {
    if (data?.employeesPaginated.pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          ...variables,
          after: data.employeesPaginated.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            employeesPaginated: {
              ...fetchMoreResult.employeesPaginated,
              edges: [...prev.employeesPaginated.edges, ...fetchMoreResult.employeesPaginated.edges],
            },
          };
        },
      });
    }
  };

  // Process data and apply client-side filtering
  const allEmployees = data?.employeesPaginated.edges.map(edge => edge.node) || [];
  
  // Apply filters
  const filteredEmployees = allEmployees.filter(employee => {
    // Search filter (name and email)
    if (debouncedSearchTerm) {
      const searchTerm = debouncedSearchTerm.toLowerCase();
      const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      const email = employee.email.toLowerCase();
      
      if (!fullName.includes(searchTerm) && !email.includes(searchTerm)) {
        return false;
      }
    }
    
    // Market filter
    if (selectedMarket && selectedMarket !== "all") {
      const hasMarket = employee.employeeMarkets?.some(market => market.market === selectedMarket);
      if (!hasMarket) {
        return false;
      }
    }
    
    // Role filter
    if (selectedRole && selectedRole !== "all") {
      if (employee.role?.name !== selectedRole) {
        return false;
      }
    }
    
    // Status filter
    if (selectedStatus === "active" && !employee.isActive) {
      return false;
    }
    if (selectedStatus === "inactive" && employee.isActive) {
      return false;
    }
    
    // Summary filter (same as status filter)
    if (selectedSummaryFilter === "active" && !employee.isActive) {
      return false;
    }
    if (selectedSummaryFilter === "inactive" && employee.isActive) {
      return false;
    }
    
    return true;
  });
  
  // Apply sorting
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let aValue: string | number = '';
    let bValue: string | number = '';
    
    switch (sortField) {
      case 'FIRST_NAME':
        aValue = a.firstName.toLowerCase();
        bValue = b.firstName.toLowerCase();
        break;
      case 'LAST_NAME':
        aValue = a.lastName.toLowerCase();
        bValue = b.lastName.toLowerCase();
        break;
      case 'EMAIL':
        aValue = a.email.toLowerCase();
        bValue = b.email.toLowerCase();
        break;
      case 'ROLE':
        aValue = a.role?.name?.toLowerCase() || '';
        bValue = b.role?.name?.toLowerCase() || '';
        break;
      case 'CREATED_AT':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        aValue = a.firstName.toLowerCase();
        bValue = b.firstName.toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  const employees = sortedEmployees;
  const pageInfo = data?.employeesPaginated.pageInfo;
  const totalCount = employees.length;

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
    // Employees data
    employees,
    totalCount,
    pageInfo,
    loading,
    error: displayError,
    handleLoadMore,
    
    // Raw data for advanced usage
    data,
  };
}