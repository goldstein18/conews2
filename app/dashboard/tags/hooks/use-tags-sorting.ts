"use client";

import { useState } from 'react';

export type TagSortField = 'name' | 'display' | 'type' | 'order' | 'createdAt';
export type TagSortDirection = 'asc' | 'desc';

export function useTagsSorting() {
  const [sortField, setSortField] = useState<TagSortField>('order');
  const [sortDirection, setSortDirection] = useState<TagSortDirection>('asc');

  const handleSort = (field: TagSortField) => {
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