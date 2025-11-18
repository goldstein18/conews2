"use client";

import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { TagType } from '@/types/tags';

interface UseTagsFiltersProps {
  onFiltersChange?: () => void;
}

export function useTagsFilters({ onFiltersChange }: UseTagsFiltersProps = {}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<TagType | undefined>();
  const [selectedMainGenre, setSelectedMainGenre] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Call onFiltersChange when debounced search or other filters change
  useEffect(() => {
    onFiltersChange?.();
  }, [debouncedSearchTerm, selectedType, selectedMainGenre, selectedStatus, onFiltersChange]);

  const handleTypeClick = (type: TagType | undefined) => {
    setSelectedType(type);
    // Clear main genre filter if not selecting SUBGENRE
    if (type !== TagType.SUBGENRE) {
      setSelectedMainGenre(undefined);
    }
  };

  const handleMainGenreClick = (mainGenre: string | undefined) => {
    setSelectedMainGenre(mainGenre);
    // Ensure SUBGENRE is selected when filtering by main genre
    if (mainGenre && mainGenre !== "all") {
      setSelectedType(TagType.SUBGENRE);
    }
  };

  const handleStatusClick = (status: string | undefined) => {
    setSelectedStatus(status);
  };

  const handleClearTypeFilter = () => {
    setSelectedType(undefined);
  };

  const handleClearMainGenreFilter = () => {
    setSelectedMainGenre(undefined);
  };

  const handleClearStatusFilter = () => {
    setSelectedStatus(undefined);
  };

  const handleClearAllFilters = () => {
    setSearchTerm('');
    setSelectedType(undefined);
    setSelectedMainGenre(undefined);
    setSelectedStatus(undefined);
  };

  const hasActiveFilters = Boolean(
    debouncedSearchTerm ||
    selectedType ||
    selectedMainGenre ||
    selectedStatus
  );

  return {
    searchTerm,
    debouncedSearchTerm,
    selectedType,
    selectedMainGenre,
    selectedStatus,
    hasActiveFilters,
    setSearchTerm,
    setSelectedType,
    setSelectedMainGenre,
    setSelectedStatus,
    handleTypeClick,
    handleMainGenreClick,
    handleStatusClick,
    handleClearTypeFilter,
    handleClearMainGenreFilter,
    handleClearStatusFilter,
    handleClearAllFilters,
  };
}