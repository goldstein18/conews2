"use client";

import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

export function useEmployeesFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<string | undefined>();
  const [selectedRole, setSelectedRole] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [selectedSummaryFilter, setSelectedSummaryFilter] = useState<string | undefined>();
  const [after, setAfter] = useState<string | undefined>();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Clear pagination when filters change
  useEffect(() => {
    setAfter(undefined);
  }, [debouncedSearchTerm, selectedMarket, selectedRole, selectedStatus, selectedSummaryFilter]);

  const handleRoleClick = (role: string) => {
    setSelectedRole(role);
    setSelectedSummaryFilter(undefined);
  };

  const handleSummaryClick = (filter: string) => {
    setSelectedSummaryFilter(filter);
    setSelectedRole(undefined);
    
    // Map summary filter to status filter
    if (filter === 'active') {
      setSelectedStatus('active');
    } else if (filter === 'inactive') {
      setSelectedStatus('inactive');
    } else {
      setSelectedStatus(undefined);
    }
  };

  const handleClearRoleFilter = () => {
    setSelectedRole(undefined);
  };

  const handleClearSummaryFilter = () => {
    setSelectedSummaryFilter(undefined);
    setSelectedStatus(undefined);
  };

  const handleNextPage = (endCursor?: string) => {
    if (endCursor) {
      setAfter(endCursor);
    }
  };

  const handlePreviousPage = () => {
    setAfter(undefined);
  };

  return {
    searchTerm,
    debouncedSearchTerm,
    selectedMarket,
    selectedRole,
    selectedStatus,
    selectedSummaryFilter,
    after,
    setSearchTerm,
    setSelectedMarket,
    setSelectedRole,
    setSelectedStatus,
    setAfter,
    handleRoleClick,
    handleSummaryClick,
    handleClearRoleFilter,
    handleClearSummaryFilter,
    handleNextPage,
    handlePreviousPage,
  };
}