'use client';

import { useState, useCallback, useMemo } from 'react';

export interface DedicatedFilters {
  searchTerm: string;
  status: string;
  market: string;
}

const defaultFilters: DedicatedFilters = {
  searchTerm: '',
  status: 'ALL',
  market: 'all'
};

export function useDedicatedFilters(initialFilters: DedicatedFilters = defaultFilters) {
  const [filters, setFilters] = useState<DedicatedFilters>(initialFilters);

  const setSearchTerm = useCallback((searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  }, []);

  const setStatus = useCallback((status: string) => {
    setFilters(prev => ({ ...prev, status }));
  }, []);

  const setMarket = useCallback((market: string) => {
    setFilters(prev => ({ ...prev, market }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // FIX: Memoize hasActiveFilters to prevent infinite re-renders
  const hasActiveFilters = useMemo(
    () =>
      filters.searchTerm !== '' ||
      filters.status !== 'ALL' ||
      filters.market !== 'all',
    [filters.searchTerm, filters.status, filters.market]
  );

  return {
    filters,
    setSearchTerm,
    setStatus,
    setMarket,
    resetFilters,
    hasActiveFilters
  };
}
