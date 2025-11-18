"use client";

import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import {
  EscoopStatus,
  EscoopsPaginatedFilterInput
} from '@/types/escoops';

export interface EscoopFiltersState {
  search: string;
  status: EscoopStatus | 'ALL';
  market: string;
  sent: boolean | 'ALL';
  locations: string[];
}

const initialFiltersState: EscoopFiltersState = {
  search: '',
  status: 'ALL',
  market: '',
  sent: 'ALL',
  locations: []
};

export function useEscoopsFilters() {
  const [filters, setFilters] = useState<EscoopFiltersState>(initialFiltersState);

  // Debounce search input
  const debouncedSearch = useDebounce(filters.search, 300);

  // Update individual filter
  const updateFilter = useCallback(<K extends keyof EscoopFiltersState>(
    key: K,
    value: EscoopFiltersState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(initialFiltersState);
  }, []);

  // Set multiple filters at once
  const setMultipleFilters = useCallback((newFilters: Partial<EscoopFiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Convert to GraphQL filter input
  const graphqlFilter = useMemo((): EscoopsPaginatedFilterInput => {
    const filter: EscoopsPaginatedFilterInput = {
      first: 20,
      includeTotalCount: true
    };

    // Add search if provided
    if (debouncedSearch.trim()) {
      filter.search = debouncedSearch.trim();
    }

    // Add status filter
    if (filters.status !== 'ALL') {
      filter.status = filters.status;
    }

    // Add market filter
    if (filters.market) {
      filter.market = filters.market;
    }

    // Add sent filter
    if (filters.sent !== 'ALL') {
      filter.sent = filters.sent;
    }

    return filter;
  }, [debouncedSearch, filters.status, filters.market, filters.sent]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (debouncedSearch.trim()) count++;
    if (filters.status !== 'ALL') count++;
    if (filters.market) count++;
    if (filters.sent !== 'ALL') count++;
    if (filters.locations.length > 0) count++;
    return count;
  }, [debouncedSearch, filters.status, filters.market, filters.sent, filters.locations]);

  const hasActiveFilters = activeFilterCount > 0;

  return {
    filters,
    debouncedSearch,
    updateFilter,
    clearFilters,
    setMultipleFilters,
    graphqlFilter,
    activeFilterCount,
    hasActiveFilters
  };
}

// Custom hook for debounced search
export function useDebouncedSearch(initialValue: string, delay: number) {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, delay);

  return [debouncedValue, setValue] as const;
}