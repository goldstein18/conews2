import { useState } from 'react';
import { EventsSortField, EventsSortDirection } from '@/types/events';

export function useEventsSorting() {
  const [sortField, setSortField] = useState<EventsSortField>('CREATED_AT');
  const [sortDirection, setSortDirection] = useState<EventsSortDirection>('DESC');

  const handleSort = (field: EventsSortField) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'ASC' ? 'DESC' : 'ASC');
    } else {
      // New field, default to DESC for dates and ASC for text fields
      setSortField(field);
      const defaultDirection: EventsSortDirection = 
        field === 'CREATED_AT' || field === 'UPDATED_AT' || field === 'START_DATE' 
          ? 'DESC' 
          : 'ASC';
      setSortDirection(defaultDirection);
    }
  };

  const resetSort = () => {
    setSortField('CREATED_AT');
    setSortDirection('DESC');
  };

  return {
    sortField,
    sortDirection,
    handleSort,
    resetSort,
  };
}