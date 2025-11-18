import { useQuery } from '@apollo/client';
import { LIST_VENUES, GET_VENUE_STATS, GET_VENUE, GET_VENUE_FOR_EDIT, GET_ALL_COMPANIES_FOR_DROPDOWN } from '@/lib/graphql/venues';
import { 
  VenuesResponse,
  VenuesQueryVariables,
  VenueStats,
  VenueSortField,
  VenueSortDirection,
  VenueStatus,
  VenuePriority,
  Venue 
} from '@/types/venues';

interface UseVenuesDataProps {
  search?: string;
  status?: VenueStatus | 'ALL';
  priority?: VenuePriority | 'ALL';
  city?: string;
  sortField?: VenueSortField;
  sortDirection?: VenueSortDirection;
  first?: number;
  after?: string;
}

interface UseVenuesDataReturn {
  venues: Venue[];
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  fetchMore: (variables: { after?: string }) => Promise<unknown>;
}

export const useVenuesData = ({
  search = '',
  status = 'ALL',
  priority = 'ALL',
  city = '',
  sortField = 'createdAt',
  sortDirection = 'desc',
  first = 20,
  after
}: UseVenuesDataProps = {}): UseVenuesDataReturn => {
  // Build filter object according to API format
  const filter: VenuesQueryVariables['filter'] = {
    first,
    includeTotalCount: true
  };

  // Add sorting if provided
  if (sortField && sortDirection) {
    filter.sort = {
      field: sortField,
      direction: sortDirection
    };
  }

  // Add optional filters
  if (after) filter.after = after;
  if (search.trim()) filter.search = search.trim();
  if (city.trim()) filter.city = city.trim();
  
  // Map status values to what API expects
  if (status !== 'ALL') {
    // Map frontend status values to API status values
    const statusMapping: Record<string, VenueStatus> = {
      'PENDING': VenueStatus.PENDING,
      'PENDING_REVIEW': VenueStatus.PENDING,
      'APPROVED': VenueStatus.APPROVED,
      'REJECTED': VenueStatus.REJECTED,
      'SUSPENDED': VenueStatus.SUSPENDED
    };
    filter.status = statusMapping[status] || (status as VenueStatus);
  }
  
  if (priority !== 'ALL') filter.priority = priority as VenuePriority;

  const { data, loading, error, refetch, fetchMore } = useQuery<VenuesResponse>(LIST_VENUES, {
    variables: { filter },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache', // Redis cache on API handles this
    context: {
      errorPolicy: 'all'
    }
  });

  // Extract venues from edges
  const venues = data?.venuesPaginated?.edges?.map(edge => edge.node) || [];
  
  // Extract page info
  const pageInfo = data?.venuesPaginated?.pageInfo || {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: undefined,
    endCursor: undefined
  };

  const totalCount = pageInfo.totalCount || 0;

  // Enhanced fetchMore function
  const handleFetchMore = (variables: { after?: string }) => {
    return fetchMore({
      variables: {
        filter: {
          ...filter,
          after: variables.after
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        
        return {
          venuesPaginated: {
            ...fetchMoreResult.venuesPaginated,
            edges: [
              ...prev.venuesPaginated.edges,
              ...fetchMoreResult.venuesPaginated.edges
            ]
          }
        };
      }
    });
  };

  return {
    venues,
    totalCount,
    pageInfo,
    loading,
    error: error || null,
    refetch,
    fetchMore: handleFetchMore
  };
};

// Hook for venue stats
interface UseVenueStatsReturn {
  stats: VenueStats | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useVenueStats = (): UseVenueStatsReturn => {
  const { data, loading, error, refetch } = useQuery(GET_VENUE_STATS, {
    errorPolicy: 'all',
    fetchPolicy: 'no-cache' // Redis cache on API handles this
  });

  return {
    stats: data?.venueStats || null,
    loading,
    error: error || null,
    refetch
  };
};

// Hook for single venue data
interface UseVenueDataProps {
  identifier: string;
  skip?: boolean;
}

interface UseVenueDataReturn {
  venue: Venue | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useVenueData = ({
  identifier,
  skip = false
}: UseVenueDataProps): UseVenueDataReturn => {
  const { data, loading, error, refetch } = useQuery(GET_VENUE, {
    variables: { identifier },
    skip,
    errorPolicy: 'all',
    fetchPolicy: 'no-cache' // Redis cache on API handles this
  });

  return {
    venue: data?.venue || null,
    loading,
    error: error || null,
    refetch
  };
};

// Hook for single venue data for editing (simplified, no complex nested fields)
export const useVenueDataForEdit = ({
  identifier,
  skip = false
}: UseVenueDataProps): UseVenueDataReturn => {
  const { data, loading, error, refetch } = useQuery(GET_VENUE_FOR_EDIT, {
    variables: { identifier },
    skip,
    errorPolicy: 'all',
    fetchPolicy: 'no-cache' // Redis cache on API handles this
  });

  return {
    venue: data?.venue || null,
    loading,
    error: error || null,
    refetch
  };
};

// Helper hook for companies dropdown with role-based data
interface UseCompaniesDropdownProps {
  skip?: boolean;
}

interface UseCompaniesDropdownReturn {
  data: { 
    companies?: Array<{ id: string; name: string }>;
    getMyCompaniesForDropdown?: Array<{ id: string; name: string; email?: string }>;
  } | undefined;
  loading: boolean;
  error: Error | null;
}

export const useCompaniesDropdown = (props?: UseCompaniesDropdownProps): UseCompaniesDropdownReturn => {
  const { skip = false } = props || {};
  
  // Use the ALL companies query for admin users (this is for venue creation by admin)
  const { data, loading, error } = useQuery(GET_ALL_COMPANIES_FOR_DROPDOWN, {
    skip,
    errorPolicy: 'all',
    fetchPolicy: 'no-cache' // Redis cache on API handles this
  });

  return {
    data,
    loading,
    error: error || null
  };
};