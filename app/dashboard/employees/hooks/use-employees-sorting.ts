"use client";

import { useState } from 'react';
import { SortField, SortDirection } from '@/types/members';

export function useEmployeesSorting() {
  const [sortField, setSortField] = useState<SortField>('CREATED_AT');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    sortField,
    sortDirection,
    handleSort,
  };
}