'use client';

import { useState } from 'react';
import type { SortDirection } from '@/components/ui/sortable-table-header';

export type DedicatedSortField = 'subject' | 'sendDate' | 'status' | 'market';
export type { SortDirection };

export function useDedicatedSorting(
  initialField: DedicatedSortField = 'sendDate',
  initialDirection: SortDirection = 'desc'
) {
  const [sortField, setSortField] = useState<DedicatedSortField>(initialField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialDirection);

  const handleSort = (field: DedicatedSortField) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    sortField,
    sortDirection,
    handleSort
  };
}
