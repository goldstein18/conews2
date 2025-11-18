import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { VenueSortField, VenueSortDirection } from '@/types/venues';

interface UseVenuesSortingReturn {
  // Current sort state
  sortField: VenueSortField;
  sortDirection: VenueSortDirection;
  
  // Sort handlers
  handleSort: (field: VenueSortField) => void;
  setSortField: (field: VenueSortField) => void;
  setSortDirection: (direction: VenueSortDirection) => void;
  toggleSortDirection: () => void;
  
  // Utility functions
  isSortedBy: (field: VenueSortField) => boolean;
  getSortIcon: (field: VenueSortField) => 'asc' | 'desc' | null;
  resetSort: () => void;
  
  // URL sync
  updateURL: () => void;
}

export const useVenuesSorting = (): UseVenuesSortingReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize sort from URL params
  const [sortField, setSortFieldState] = useState<VenueSortField>(() => {
    const fieldParam = searchParams.get('sortField');
    const validFields: VenueSortField[] = ['name', 'createdAt', 'updatedAt', 'priority', 'status', 'city'];
    
    if (fieldParam && validFields.includes(fieldParam as VenueSortField)) {
      return fieldParam as VenueSortField;
    }
    return 'createdAt'; // Default sort field
  });

  const [sortDirection, setSortDirectionState] = useState<VenueSortDirection>(() => {
    const directionParam = searchParams.get('sortDirection');
    if (directionParam && ['asc', 'desc'].includes(directionParam)) {
      return directionParam as VenueSortDirection;
    }
    return 'desc'; // Default sort direction
  });

  // Update URL when sort changes
  const updateURL = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    
    params.set('sortField', sortField);
    params.set('sortDirection', sortDirection);
    
    // Remove pagination cursor when sorting changes
    params.delete('after');
    
    router.replace(`/dashboard/venues?${params.toString()}`, { scroll: false });
  }, [sortField, sortDirection, searchParams, router]);

  // Handle sort field change
  const handleSort = useCallback((field: VenueSortField) => {
    if (field === sortField) {
      // If clicking the same field, toggle direction
      const newDirection: VenueSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirectionState(newDirection);
    } else {
      // If clicking a different field, set new field and default direction
      setSortFieldState(field);
      
      // Set default direction based on field type
      const defaultDirection: VenueSortDirection = getDefaultSortDirection(field);
      setSortDirectionState(defaultDirection);
    }
  }, [sortField, sortDirection]);

  // Individual setters
  const setSortField = useCallback((field: VenueSortField) => {
    setSortFieldState(field);
    // Don't change direction when explicitly setting field
  }, []);

  const setSortDirection = useCallback((direction: VenueSortDirection) => {
    setSortDirectionState(direction);
  }, []);

  const toggleSortDirection = useCallback(() => {
    setSortDirectionState(current => current === 'asc' ? 'desc' : 'asc');
  }, []);

  // Auto-update URL when sort state changes
  useEffect(() => {
    updateURL();
  }, [sortField, sortDirection, updateURL]);

  // Utility functions
  const isSortedBy = useCallback((field: VenueSortField) => {
    return sortField === field;
  }, [sortField]);

  const getSortIcon = useCallback((field: VenueSortField): 'asc' | 'desc' | null => {
    if (sortField === field) {
      return sortDirection;
    }
    return null;
  }, [sortField, sortDirection]);

  const resetSort = useCallback(() => {
    setSortFieldState('createdAt');
    setSortDirectionState('desc');
  }, []);

  return {
    // Current sort state
    sortField,
    sortDirection,
    
    // Sort handlers
    handleSort,
    setSortField,
    setSortDirection,
    toggleSortDirection,
    
    // Utility functions
    isSortedBy,
    getSortIcon,
    resetSort,
    
    // URL sync
    updateURL
  };
};

// Helper function to get default sort direction for a field
const getDefaultSortDirection = (field: VenueSortField): VenueSortDirection => {
  switch (field) {
    case 'name':
    case 'city':
      return 'asc'; // Alphabetical fields default to ascending
    case 'createdAt':
    case 'updatedAt':
      return 'desc'; // Date fields default to descending (newest first)
    case 'priority':
      return 'desc'; // Priority defaults to descending (high priority first)
    case 'status':
      return 'asc'; // Status defaults to ascending
    default:
      return 'desc';
  }
};

// Helper hook for sort display labels
export const useSortLabels = () => {
  const sortLabels: Record<VenueSortField, string> = useMemo(() => ({
    name: 'Name',
    createdAt: 'Created Date',
    updatedAt: 'Updated Date',
    priority: 'Priority',
    status: 'Status',
    city: 'City'
  }), []);

  const getSortLabel = useCallback((field: VenueSortField): string => {
    return sortLabels[field];
  }, [sortLabels]);

  const getDirectionLabel = useCallback((direction: VenueSortDirection): string => {
    return direction === 'asc' ? 'Ascending' : 'Descending';
  }, []);

  const getFullSortLabel = useCallback((field: VenueSortField, direction: VenueSortDirection): string => {
    return `${getSortLabel(field)} (${getDirectionLabel(direction)})`;
  }, [getSortLabel, getDirectionLabel]);

  return {
    sortLabels,
    getSortLabel,
    getDirectionLabel,
    getFullSortLabel
  };
};

// Helper hook for sort options in dropdowns
export const useSortOptions = () => {
  const options = useMemo(() => [
    { value: 'name-asc', label: 'Name (A-Z)', field: 'name' as VenueSortField, direction: 'asc' as VenueSortDirection },
    { value: 'name-desc', label: 'Name (Z-A)', field: 'name' as VenueSortField, direction: 'desc' as VenueSortDirection },
    { value: 'createdAt-desc', label: 'Newest First', field: 'createdAt' as VenueSortField, direction: 'desc' as VenueSortDirection },
    { value: 'createdAt-asc', label: 'Oldest First', field: 'createdAt' as VenueSortField, direction: 'asc' as VenueSortDirection },
    { value: 'updatedAt-desc', label: 'Recently Updated', field: 'updatedAt' as VenueSortField, direction: 'desc' as VenueSortDirection },
    { value: 'priority-desc', label: 'High Priority First', field: 'priority' as VenueSortField, direction: 'desc' as VenueSortDirection },
    { value: 'priority-asc', label: 'Low Priority First', field: 'priority' as VenueSortField, direction: 'asc' as VenueSortDirection },
    { value: 'city-asc', label: 'City (A-Z)', field: 'city' as VenueSortField, direction: 'asc' as VenueSortDirection },
    { value: 'city-desc', label: 'City (Z-A)', field: 'city' as VenueSortField, direction: 'desc' as VenueSortDirection },
    { value: 'status-asc', label: 'Status (A-Z)', field: 'status' as VenueSortField, direction: 'asc' as VenueSortDirection }
  ], []);

  const getCurrentOption = useCallback((field: VenueSortField, direction: VenueSortDirection) => {
    return options.find(opt => opt.field === field && opt.direction === direction);
  }, [options]);

  const parseOptionValue = useCallback((value: string): { field: VenueSortField; direction: VenueSortDirection } | null => {
    const option = options.find(opt => opt.value === value);
    return option ? { field: option.field, direction: option.direction } : null;
  }, [options]);

  return {
    options,
    getCurrentOption,
    parseOptionValue
  };
};