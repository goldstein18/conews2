import { useState, useCallback } from 'react';
import { ArtsGroupSortField, ArtsGroupSortDirection } from '@/types/arts-groups';
import { defaultArtsGroupSort } from '../lib/validations';

export interface ArtsGroupSort {
  field: ArtsGroupSortField;
  direction: ArtsGroupSortDirection;
}

export interface UseArtsGroupsSortingReturn {
  sortField: ArtsGroupSortField;
  sortDirection: ArtsGroupSortDirection;
  handleSort: (field: ArtsGroupSortField) => void;
  resetSort: () => void;
}

export const useArtsGroupsSorting = (): UseArtsGroupsSortingReturn => {
  const [sort, setSort] = useState<ArtsGroupSort>(defaultArtsGroupSort);

  const handleSort = useCallback((field: ArtsGroupSortField) => {
    setSort(prev => ({
      field,
      direction:
        prev.field === field && prev.direction === ArtsGroupSortDirection.ASC
          ? ArtsGroupSortDirection.DESC
          : ArtsGroupSortDirection.ASC
    }));
  }, []);

  const resetSort = useCallback(() => {
    setSort(defaultArtsGroupSort);
  }, []);

  return {
    sortField: sort.field,
    sortDirection: sort.direction,
    handleSort,
    resetSort
  };
};
