import { useState } from 'react';
import { TicketSortField, SortDirection } from '@/types/ticket';

export function useTicketSorting() {
  const [sortField, setSortField] = useState<TicketSortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: TicketSortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const resetSort = () => {
    setSortField('createdAt');
    setSortDirection('desc');
  };

  return {
    sortField,
    sortDirection,
    handleSort,
    resetSort,
    setSortField,
    setSortDirection,
  };
}
