'use client';

import { useState, useCallback } from 'react';
import { RestaurantSortField, SortDirection } from '@/types/restaurants';

interface UseRestaurantsSortingReturn {
  sortField: RestaurantSortField;
  sortDirection: SortDirection;
  handleSort: (field: RestaurantSortField) => void;
  resetSort: () => void;
}

export function useRestaurantsSorting(
  initialSortField: RestaurantSortField = 'createdAt',
  initialSortDirection: SortDirection = 'desc'
): UseRestaurantsSortingReturn {
  const [sortField, setSortField] = useState<RestaurantSortField>(initialSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);

  const handleSort = useCallback((field: RestaurantSortField) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      // New field - default to asc for name, desc for dates
      setSortField(field);
      setSortDirection(field === 'name' ? 'asc' : 'desc');
    }
  }, [sortField]);

  const resetSort = useCallback(() => {
    setSortField(initialSortField);
    setSortDirection(initialSortDirection);
  }, [initialSortField, initialSortDirection]);

  return {
    sortField,
    sortDirection,
    handleSort,
    resetSort
  };
}