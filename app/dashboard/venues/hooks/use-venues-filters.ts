import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { VenueStatus, VenuePriority, VenueFilters } from '@/types/venues';

interface UseVenuesFiltersReturn {
  // Filter values
  search: string;
  status: VenueStatus | 'ALL';
  priority: VenuePriority | 'ALL';
  city: string;
  
  // Filter setters
  setSearch: (search: string) => void;
  setStatus: (status: VenueStatus | 'ALL') => void;
  setPriority: (priority: VenuePriority | 'ALL') => void;
  setCity: (city: string) => void;
  
  // Pagination
  after: string | undefined;
  setAfter: (after: string | undefined) => void;
  
  // Utility functions
  clearFilters: () => void;
  resetPagination: () => void;
  hasActiveFilters: boolean;
  
  // URL sync
  updateURL: () => void;
}

export const useVenuesFilters = (): UseVenuesFiltersReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize filters from URL params
  const [search, setSearchState] = useState(() => 
    searchParams.get('search') || ''
  );
  
  const [status, setStatusState] = useState<VenueStatus | 'ALL'>(() => {
    const statusParam = searchParams.get('status');
    if (statusParam && Object.values(VenueStatus).includes(statusParam as VenueStatus)) {
      return statusParam as VenueStatus;
    }
    return 'ALL';
  });
  
  const [priority, setPriorityState] = useState<VenuePriority | 'ALL'>(() => {
    const priorityParam = searchParams.get('priority');
    if (priorityParam && Object.values(VenuePriority).includes(priorityParam as VenuePriority)) {
      return priorityParam as VenuePriority;
    }
    return 'ALL';
  });
  
  const [city, setCityState] = useState(() => 
    searchParams.get('city') || ''
  );
  
  const [after, setAfterState] = useState<string | undefined>(() => 
    searchParams.get('after') || undefined
  );

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    
    if (search.trim()) params.set('search', search.trim());
    if (status !== 'ALL') params.set('status', status);
    if (priority !== 'ALL') params.set('priority', priority);
    if (city.trim()) params.set('city', city.trim());
    if (after) params.set('after', after);
    
    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : '';
    const currentUrl = window.location.search;
    
    // Only update URL if it actually changed
    if (currentUrl !== url) {
      router.replace(`/dashboard/venues${url}`, { scroll: false });
    }
  }, [search, status, priority, city, after, router]);

  // Filter setters with URL sync
  const setSearch = useCallback((newSearch: string) => {
    setSearchState(newSearch);
    setAfterState(undefined); // Reset pagination when search changes
    // URL will be updated via useEffect when state changes
  }, []);

  const setStatus = useCallback((newStatus: VenueStatus | 'ALL') => {
    setStatusState(newStatus);
    setAfterState(undefined); // Reset pagination when filter changes
    // URL will be updated via useEffect when state changes
  }, []);

  const setPriority = useCallback((newPriority: VenuePriority | 'ALL') => {
    setPriorityState(newPriority);
    setAfterState(undefined); // Reset pagination when filter changes
    // URL will be updated via useEffect when state changes
  }, []);

  const setCity = useCallback((newCity: string) => {
    setCityState(newCity);
    setAfterState(undefined); // Reset pagination when filter changes
    // URL will be updated via useEffect when state changes
  }, []);

  const setAfter = useCallback((newAfter: string | undefined) => {
    setAfterState(newAfter);
    // URL will be updated via useEffect when state changes
  }, []);

  // Auto-update URL when filter state changes
  useEffect(() => {
    updateURL();
  }, [search, status, priority, city, after, updateURL]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchState('');
    setStatusState('ALL');
    setPriorityState('ALL');
    setCityState('');
    setAfterState(undefined);
  }, []);

  // Reset pagination only
  const resetPagination = useCallback(() => {
    setAfterState(undefined);
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      search.trim() ||
      status !== 'ALL' ||
      priority !== 'ALL' ||
      city.trim()
    );
  }, [search, status, priority, city]);

  return {
    // Filter values
    search,
    status,
    priority,
    city,
    
    // Filter setters
    setSearch,
    setStatus,
    setPriority,
    setCity,
    
    // Pagination
    after,
    setAfter,
    
    // Utility functions
    clearFilters,
    resetPagination,
    hasActiveFilters,
    
    // URL sync
    updateURL
  };
};

// Helper hook for debounced search
export const useDebouncedSearch = (
  value: string,
  delay: number = 500
): [string, (value: string) => void] => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [inputValue, setInputValue] = useState(value);

  // Update debounced value after delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);

  // Update input value immediately
  const setValue = useCallback((newValue: string) => {
    setInputValue(newValue);
  }, []);

  return [debouncedValue, setValue];
};

// Helper hook for filter statistics
interface UseFilterStatsReturn {
  totalWithFilters: number;
  filteredPercentage: number;
  activeFilterCount: number;
  filterSummary: string;
}

export const useFilterStats = (
  totalCount: number,
  hasActiveFilters: boolean,
  filters: Pick<VenueFilters, 'search' | 'status' | 'priority' | 'city'>
): UseFilterStatsReturn => {
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search.trim()) count++;
    if (filters.status !== 'ALL') count++;
    if (filters.priority !== 'ALL') count++;
    if (filters.city.trim()) count++;
    return count;
  }, [filters]);

  const filteredPercentage = useMemo(() => {
    if (!hasActiveFilters || totalCount === 0) return 100;
    // This would need to be calculated based on total unfiltered count
    // For now, we'll return the current count as percentage of itself
    return 100;
  }, [hasActiveFilters, totalCount]);

  const filterSummary = useMemo(() => {
    const activeParts: string[] = [];
    
    if (filters.search.trim()) {
      activeParts.push(`"${filters.search}"`);
    }
    
    if (filters.status !== 'ALL') {
      activeParts.push(`Status: ${filters.status}`);
    }
    
    if (filters.priority !== 'ALL') {
      activeParts.push(`Priority: ${filters.priority}`);
    }
    
    if (filters.city.trim()) {
      activeParts.push(`City: ${filters.city}`);
    }

    if (activeParts.length === 0) return 'No filters applied';
    if (activeParts.length === 1) return `Filtered by ${activeParts[0]}`;
    
    const lastPart = activeParts.pop();
    return `Filtered by ${activeParts.join(', ')} and ${lastPart}`;
  }, [filters]);

  return {
    totalWithFilters: totalCount,
    filteredPercentage,
    activeFilterCount,
    filterSummary
  };
};