import { useState, useEffect } from "react";

export function useNewsFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedSummaryFilter, setSelectedSummaryFilter] = useState<string>("all");
  const [showArchived, setShowArchived] = useState(false);
  const [after, setAfter] = useState<string | undefined>(undefined);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setAfter(undefined); // Reset pagination when search changes
    }, 800); // Increased debounce time to reduce requests

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset pagination when filters change
  useEffect(() => {
    setAfter(undefined);
  }, [selectedCategory, selectedStatus, selectedTag, selectedSummaryFilter, showArchived]);

  // Handle status card clicks
  const handleStatusClick = (status: string) => {
    setSelectedStatus(status);
    setSelectedSummaryFilter("all"); // Reset summary filter
    // Clear other conflicting filters
    setSelectedTag("all");
  };

  // Handle summary card clicks
  const handleSummaryClick = (filterType: string) => {
    setSelectedSummaryFilter(filterType);
    setSelectedStatus("all"); // Reset status filter
    // Clear other conflicting filters based on filter type
    if (filterType === "published" || filterType === "draft") {
      setSelectedStatus("all");
    }
  };

  // Handle clearing filters
  const handleClearStatusFilter = () => {
    setSelectedStatus("all");
  };

  const handleClearSummaryFilter = () => {
    setSelectedSummaryFilter("all");
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    setAfter(undefined);
  };

  const handleNextPage = (endCursor?: string) => {
    if (endCursor) {
      setAfter(endCursor);
    }
  };

  return {
    // Filter states
    searchTerm,
    debouncedSearchTerm,
    selectedCategory,
    selectedStatus,
    selectedTag,
    selectedSummaryFilter,
    showArchived,
    after,

    // Filter setters
    setSearchTerm,
    setSelectedCategory,
    setSelectedStatus,
    setSelectedTag,
    setSelectedSummaryFilter,
    setShowArchived,
    setAfter,

    // Filter handlers
    handleStatusClick,
    handleSummaryClick,
    handleClearStatusFilter,
    handleClearSummaryFilter,

    // Pagination handlers
    handlePreviousPage,
    handleNextPage,
  };
}