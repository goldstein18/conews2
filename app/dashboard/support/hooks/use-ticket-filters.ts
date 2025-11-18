import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { TicketStatus, TicketPriority, TicketCategory } from '@/types/ticket';

export function useTicketFilters() {
  // Search
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Status filter
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | 'ALL'>('ALL');

  // Priority filter
  const [selectedPriority, setSelectedPriority] = useState<TicketPriority | 'ALL'>('ALL');

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | 'ALL'>('ALL');

  // Assigned to filter (for admin view)
  const [selectedAssignedTo, setSelectedAssignedTo] = useState<string | 'ALL' | 'UNASSIGNED'>('ALL');

  // Company filter (for super admin view)
  const [selectedCompany, setSelectedCompany] = useState<string | 'ALL'>('ALL');

  // Pagination cursor
  const [after, setAfter] = useState<string | undefined>(undefined);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('ALL');
    setSelectedPriority('ALL');
    setSelectedCategory('ALL');
    setSelectedAssignedTo('ALL');
    setSelectedCompany('ALL');
    setAfter(undefined);
  };

  // Reset pagination when filters change
  const resetPagination = () => {
    setAfter(undefined);
  };

  // Build filter input for GraphQL query
  const filterInput = useMemo(() => {
    const filter: {
      searchTerm?: string;
      status?: TicketStatus;
      priority?: TicketPriority;
      category?: TicketCategory;
      assignedToId?: string;
      companyId?: string;
    } = {};

    if (debouncedSearchTerm) {
      filter.searchTerm = debouncedSearchTerm;
    }

    if (selectedStatus !== 'ALL') {
      filter.status = selectedStatus;
    }

    if (selectedPriority !== 'ALL') {
      filter.priority = selectedPriority;
    }

    if (selectedCategory !== 'ALL') {
      filter.category = selectedCategory;
    }

    if (selectedAssignedTo !== 'ALL' && selectedAssignedTo !== 'UNASSIGNED') {
      filter.assignedToId = selectedAssignedTo;
    } else if (selectedAssignedTo === 'UNASSIGNED') {
      filter.assignedToId = 'null'; // Special value to filter unassigned tickets
    }

    if (selectedCompany !== 'ALL') {
      filter.companyId = selectedCompany;
    }

    return Object.keys(filter).length > 0 ? filter : undefined;
  }, [
    debouncedSearchTerm,
    selectedStatus,
    selectedPriority,
    selectedCategory,
    selectedAssignedTo,
    selectedCompany,
  ]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm !== '' ||
      selectedStatus !== 'ALL' ||
      selectedPriority !== 'ALL' ||
      selectedCategory !== 'ALL' ||
      selectedAssignedTo !== 'ALL' ||
      selectedCompany !== 'ALL'
    );
  }, [searchTerm, selectedStatus, selectedPriority, selectedCategory, selectedAssignedTo, selectedCompany]);

  return {
    // Search
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,

    // Status
    selectedStatus,
    setSelectedStatus,

    // Priority
    selectedPriority,
    setSelectedPriority,

    // Category
    selectedCategory,
    setSelectedCategory,

    // Assigned to
    selectedAssignedTo,
    setSelectedAssignedTo,

    // Company
    selectedCompany,
    setSelectedCompany,

    // Pagination
    after,
    setAfter,

    // Helpers
    resetFilters,
    resetPagination,
    filterInput,
    hasActiveFilters,
  };
}
