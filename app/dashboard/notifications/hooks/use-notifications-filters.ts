import { useState, useMemo } from 'react';
import { NotificationFilter, NotificationType } from '@/types/notification';

export function useNotificationsFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<NotificationType | 'all'>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Build filter object for GraphQL query
  const filter = useMemo<NotificationFilter>(() => {
    const f: NotificationFilter = {};

    if (searchTerm.trim()) {
      f.search = searchTerm.trim();
    }

    if (selectedType !== 'all') {
      f.type = selectedType;
    }

    if (readFilter === 'read') {
      f.isRead = true;
    } else if (readFilter === 'unread') {
      f.isRead = false;
    }

    if (dateFrom) {
      f.dateFrom = dateFrom;
    }

    if (dateTo) {
      f.dateTo = dateTo;
    }

    return f;
  }, [searchTerm, selectedType, readFilter, dateFrom, dateTo]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm.trim() !== '' ||
      selectedType !== 'all' ||
      readFilter !== 'all' ||
      dateFrom !== '' ||
      dateTo !== ''
    );
  }, [searchTerm, selectedType, readFilter, dateFrom, dateTo]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setReadFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  // Clear specific filters
  const clearTypeFilter = () => setSelectedType('all');
  const clearReadFilter = () => setReadFilter('all');
  const clearDateRange = () => {
    setDateFrom('');
    setDateTo('');
  };

  return {
    // Filter state
    searchTerm,
    selectedType,
    readFilter,
    dateFrom,
    dateTo,
    filter,

    // Filter actions
    setSearchTerm,
    setSelectedType,
    setReadFilter,
    setDateFrom,
    setDateTo,

    // Utilities
    hasActiveFilters,
    clearFilters,
    clearTypeFilter,
    clearReadFilter,
    clearDateRange,
  };
}
