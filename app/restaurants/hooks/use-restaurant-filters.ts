import { useState, useCallback } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import type { RestaurantFilters, MarketValue, PriceRange } from '@/types/public-restaurants';
import { DEFAULT_RESTAURANT_FILTERS } from '@/types/public-restaurants';

/**
 * Hook to manage restaurant directory filter state
 * Handles market selection, search input (debounced), price range, cuisine types, and amenities filtering
 */
export const useRestaurantFilters = (initialFilters: Partial<RestaurantFilters> = {}) => {
  const [filters, setFilters] = useState<RestaurantFilters>({
    ...DEFAULT_RESTAURANT_FILTERS,
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
   * Update price range filter
   */
  const setPriceRange = useCallback((priceRange: PriceRange | 'ALL') => {
    setFilters(prev => ({
      ...prev,
      priceRange
    }));
  }, []);

  /**
   * Toggle cuisine type in filter
   * Adds if not present, removes if present
   */
  const toggleCuisineType = useCallback((cuisineTypeId: string) => {
    setFilters(prev => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.includes(cuisineTypeId)
        ? prev.cuisineTypes.filter(id => id !== cuisineTypeId)
        : [...prev.cuisineTypes, cuisineTypeId]
    }));
  }, []);

  /**
   * Set multiple cuisine types at once
   */
  const setCuisineTypes = useCallback((cuisineTypeIds: string[]) => {
    setFilters(prev => ({
      ...prev,
      cuisineTypes: cuisineTypeIds
    }));
  }, []);

  /**
   * Clear all cuisine type filters
   */
  const clearCuisineTypes = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      cuisineTypes: []
    }));
  }, []);

  /**
   * Toggle amenity in filter
   * Adds if not present, removes if present
   */
  const toggleAmenity = useCallback((amenityId: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  }, []);

  /**
   * Set multiple amenities at once
   */
  const setAmenities = useCallback((amenityIds: string[]) => {
    setFilters(prev => ({
      ...prev,
      amenities: amenityIds
    }));
  }, []);

  /**
   * Clear all amenity filters
   */
  const clearAmenities = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      amenities: []
    }));
  }, []);

  /**
   * Clear all filters except market
   */
  const clearFilters = useCallback(() => {
    setFilters(prev => ({
      ...DEFAULT_RESTAURANT_FILTERS,
      market: prev.market // Preserve market selection
    }));
  }, []);

  /**
   * Reset all filters to defaults
   */
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_RESTAURANT_FILTERS);
  }, []);

  /**
   * Check if any filters are active (excluding default market)
   */
  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.priceRange !== 'ALL' ||
    filters.cuisineTypes.length > 0 ||
    filters.amenities.length > 0;

  /**
   * Count of active filters (for badge display)
   */
  const activeFilterCount =
    (filters.search.trim() !== '' ? 1 : 0) +
    (filters.priceRange !== 'ALL' ? 1 : 0) +
    filters.cuisineTypes.length +
    filters.amenities.length;

  return {
    filters,
    debouncedSearch,
    setMarket,
    setSearch,
    setPriceRange,
    toggleCuisineType,
    setCuisineTypes,
    clearCuisineTypes,
    toggleAmenity,
    setAmenities,
    clearAmenities,
    clearFilters,
    resetFilters,
    hasActiveFilters,
    activeFilterCount
  };
};
