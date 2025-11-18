/**
 * Hook for managing event filter state
 * Handles search, date filters, tags, virtual toggle, and location filters
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import type { EventFilters, DateFilterType, MarketValue } from '@/types/public-events';

export interface UseEventFiltersOptions {
  defaultSearch?: string;
  defaultDateFilter?: DateFilterType;
  defaultVirtual?: boolean;
  defaultTagNames?: string[];  // Changed from defaultTagIds
  defaultCity?: string;
  defaultState?: string;
  defaultMarket?: MarketValue | '';
}

export interface UseEventFiltersReturn {
  filters: EventFilters;
  debouncedSearch: string;
  setSearch: (search: string) => void;
  setDateFilter: (dateFilter: DateFilterType) => void;
  setVirtual: (virtual: boolean) => void;
  setTagNames: (tagNames: string[]) => void;  // Changed from setTagIds
  toggleTag: (tagName: string) => void;  // Changed parameter name for clarity
  setCity: (city: string) => void;
  setState: (state: string) => void;
  setMarket: (market: MarketValue | '') => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * Hook to manage event filter state with debounced search
 * Now uses tagNames (genre/subgenre names) instead of tagIds
 */
export const useEventFilters = ({
  defaultSearch = '',
  defaultDateFilter = '',
  defaultVirtual = false,
  defaultTagNames = [],  // Changed from defaultTagIds
  defaultCity = '',
  defaultState = '',
  defaultMarket = ''
}: UseEventFiltersOptions = {}): UseEventFiltersReturn => {
  const [search, setSearch] = useState(defaultSearch);
  const [dateFilter, setDateFilter] = useState<DateFilterType>(defaultDateFilter);
  const [virtual, setVirtual] = useState(defaultVirtual);
  const [tagNames, setTagNames] = useState<string[]>(defaultTagNames);  // Changed from tagIds
  const [city, setCity] = useState(defaultCity);
  const [state, setState] = useState(defaultState);
  const [market, setMarket] = useState<MarketValue | ''>(defaultMarket);

  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebounce(search, 500);

  // Toggle individual tag by name
  const toggleTag = useCallback((tagName: string) => {
    setTagNames(prev =>
      prev.includes(tagName)
        ? prev.filter(name => name !== tagName)
        : [...prev, tagName]
    );
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearch('');
    setDateFilter('');
    setVirtual(false);
    setTagNames([]);  // Changed from setTagIds
    setCity('');
    setState('');
    setMarket('');
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      search.trim() !== '' ||
      dateFilter !== '' ||
      virtual ||
      tagNames.length > 0 ||  // Changed from tagIds
      city !== '' ||
      state !== '' ||
      market !== ''
    );
  }, [search, dateFilter, virtual, tagNames, city, state, market]);

  // Current filter state
  const filters: EventFilters = useMemo(
    () => ({
      search,
      dateFilter,
      virtual,
      tagNames,  // Changed from tagIds
      city,
      state,
      market
    }),
    [search, dateFilter, virtual, tagNames, city, state, market]
  );

  return {
    filters,
    debouncedSearch,
    setSearch,
    setDateFilter,
    setVirtual,
    setTagNames,  // Changed from setTagIds
    toggleTag,
    setCity,
    setState,
    setMarket,
    clearFilters,
    hasActiveFilters
  };
};
