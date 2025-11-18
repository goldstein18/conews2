import { useState, useCallback, useMemo } from 'react';
import { ArtsGroupStatus } from '@/types/arts-groups';
import { defaultArtsGroupFilters } from '../lib/validations';

export interface ArtsGroupFilters {
  searchTerm: string;
  status: ArtsGroupStatus | 'ALL';
  market: string;
  artType: string;
}

export interface UseArtsGroupsFiltersReturn {
  filters: ArtsGroupFilters;
  setSearchTerm: (searchTerm: string) => void;
  setStatus: (status: ArtsGroupStatus | 'ALL') => void;
  setMarket: (market: string) => void;
  setArtType: (artType: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export const useArtsGroupsFilters = (): UseArtsGroupsFiltersReturn => {
  const [filters, setFilters] = useState<ArtsGroupFilters>(defaultArtsGroupFilters);

  const setSearchTerm = useCallback((searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  }, []);

  const setStatus = useCallback((status: ArtsGroupStatus | 'ALL') => {
    setFilters(prev => ({ ...prev, status }));
  }, []);

  const setMarket = useCallback((market: string) => {
    // Convert 'all' value back to empty string for filtering
    const normalizedMarket = market === 'all' ? '' : market;
    setFilters(prev => ({ ...prev, market: normalizedMarket }));
  }, []);

  const setArtType = useCallback((artType: string) => {
    // Convert 'all' value back to empty string for filtering
    const normalizedArtType = artType === 'all' ? '' : artType;
    setFilters(prev => ({ ...prev, artType: normalizedArtType }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultArtsGroupFilters);
  }, []);

  // FIX: Memoize hasActiveFilters to prevent infinite re-renders
  const hasActiveFilters = useMemo(
    () =>
      filters.searchTerm !== '' ||
      filters.status !== 'ALL' ||
      filters.market !== '' ||
      filters.artType !== '',
    [filters.searchTerm, filters.status, filters.market, filters.artType]
  );

  return {
    filters,
    setSearchTerm,
    setStatus,
    setMarket,
    setArtType,
    resetFilters,
    hasActiveFilters
  };
};
