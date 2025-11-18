import { useState, useCallback } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import type { VenueFilters, MarketValue, VenueType } from '@/types/public-venues';
import { DEFAULT_VENUE_FILTERS } from '@/types/public-venues';

/**
 * Hook to manage venue directory filter state
 * Handles market selection, search input (debounced), and venue type filtering
 */
export const useVenueFilters = (initialFilters: Partial<VenueFilters> = {}) => {
  const [filters, setFilters] = useState<VenueFilters>({
    ...DEFAULT_VENUE_FILTERS,
    ...initialFilters
  });

  // Debounce search input (500ms)
  const debouncedSearch = useDebounce(filters.search, 500);

  /**
   * Update market filter
   */
  const setMarket = useCallback((market: MarketValue | '') => {
    setFilters(prev => ({
      ...prev,
      market,
      search: '' // Clear search when market changes
    }));
  }, []);

  /**
   * Update search filter
   */
  const setSearch = useCallback((search: string) => {
    setFilters(prev => ({
      ...prev,
      search
    }));
  }, []);

  /**
   * Update venue type filter
   */
  const setVenueType = useCallback((venueType: VenueType | 'ALL') => {
    setFilters(prev => ({
      ...prev,
      venueType
    }));
  }, []);

  /**
   * Clear all filters except market
   */
  const clearFilters = useCallback(() => {
    setFilters(prev => ({
      ...DEFAULT_VENUE_FILTERS,
      market: prev.market // Preserve market selection
    }));
  }, []);

  /**
   * Reset all filters to defaults
   */
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_VENUE_FILTERS);
  }, []);

  /**
   * Check if any filters are active (excluding default market)
   */
  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.venueType !== 'ALL';

  return {
    filters,
    debouncedSearch,
    setMarket,
    setSearch,
    setVenueType,
    clearFilters,
    resetFilters,
    hasActiveFilters
  };
};
