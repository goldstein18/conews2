import { useState } from 'react';
import { Notification } from '@/types/notification';
import type { SortDirection } from '@/components/ui/sortable-table-header';

export type SortField = 'createdAt' | 'type' | 'isRead' | 'title';
export type { SortDirection };

export function useNotificationsSorting(initialField: SortField = 'createdAt', initialDirection: SortDirection = 'desc') {
  const [sortField, setSortField] = useState<SortField>(initialField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialDirection);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with default direction
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Sort function for client-side sorting (if needed)
  const sortNotifications = (notifications: Notification[]): Notification[] => {
    return [...notifications].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'isRead':
          comparison = (a.isRead ? 1 : 0) - (b.isRead ? 1 : 0);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  return {
    sortField,
    sortDirection,
    handleSort,
    sortNotifications,
  };
}
