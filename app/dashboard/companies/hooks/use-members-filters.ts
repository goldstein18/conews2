import { useState, useEffect } from "react";

export function useMembersFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedMarket, setSelectedMarket] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPlan, setSelectedPlan] = useState<string>("all");
  const [selectedSummaryFilter, setSelectedSummaryFilter] = useState<string>("all");
  const [showDeleted, setShowDeleted] = useState(false);
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
  }, [selectedMarket, selectedStatus, selectedPlan, selectedSummaryFilter, showDeleted]);

  // Handle plan card clicks
  const handlePlanClick = (planSlug: string) => {
    setSelectedPlan(planSlug);
    setSelectedSummaryFilter("all"); // Reset summary filter
    // Clear other conflicting filters
    setSelectedStatus("all");
  };

  // Handle summary card clicks
  const handleSummaryClick = (filterType: string) => {
    setSelectedSummaryFilter(filterType);
    setSelectedPlan("all"); // Reset plan filter
    // Clear other conflicting filters based on filter type
    if (filterType === "active" || filterType === "pending") {
      setSelectedStatus("all");
    }
  };

  // Handle clearing filters
  const handleClearPlanFilter = () => {
    setSelectedPlan("all");
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
    selectedMarket,
    selectedStatus,
    selectedPlan,
    selectedSummaryFilter,
    showDeleted,
    after,

    // Filter setters
    setSearchTerm,
    setSelectedMarket,
    setSelectedStatus,
    setSelectedPlan,
    setSelectedSummaryFilter,
    setShowDeleted,
    setAfter,

    // Filter handlers
    handlePlanClick,
    handleSummaryClick,
    handleClearPlanFilter,
    handleClearSummaryFilter,

    // Pagination handlers
    handlePreviousPage,
    handleNextPage,
  };
}