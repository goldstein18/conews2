import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

export function useEventsFilters() {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [after, setAfter] = useState<string | undefined>(undefined);

  // Debounced search term for API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Status filter handlers
  const handleStatusClick = (status: string) => {
    const newStatus = selectedStatus === status ? 'all' : status;
    setSelectedStatus(newStatus);
    setAfter(undefined); // Reset pagination
  };

  const handleClearStatusFilter = () => {
    setSelectedStatus('all');
    setAfter(undefined); // Reset pagination
  };

  // Market filter handlers  
  const handleMarketChange = (market: string) => {
    setSelectedMarket(market);
    setAfter(undefined); // Reset pagination
  };

  // Company filter handlers
  const handleCompanyChange = (company: string) => {
    setSelectedCompany(company);
    setAfter(undefined); // Reset pagination
  };

  // Search handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setAfter(undefined); // Reset pagination when search changes
  };

  // Pagination handlers
  const handleNextPage = (endCursor: string | undefined) => {
    if (endCursor) {
      setAfter(endCursor);
    }
  };

  const handlePreviousPage = () => {
    setAfter(undefined); // Go back to first page
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedMarket('all');
    setSelectedCompany('all');
    setAfter(undefined);
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' || 
           selectedStatus !== 'all' || 
           selectedMarket !== 'all' || 
           selectedCompany !== 'all';
  }, [searchTerm, selectedStatus, selectedMarket, selectedCompany]);

  return {
    // Filter values
    searchTerm,
    debouncedSearchTerm,
    selectedStatus,
    selectedMarket,
    selectedCompany,
    after,
    hasActiveFilters,

    // Filter setters
    setSearchTerm: handleSearchChange,
    setSelectedStatus,
    setSelectedMarket: handleMarketChange,
    setSelectedCompany: handleCompanyChange,
    setAfter,

    // Filter handlers
    handleStatusClick,
    handleClearStatusFilter,
    handleClearAllFilters,

    // Pagination handlers
    handleNextPage,
    handlePreviousPage,
  };
}