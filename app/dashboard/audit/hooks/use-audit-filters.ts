import { useState, useEffect } from "react";
import { EntityTypeOption, ActionTypeOption } from "@/types/audit";

export function useAuditFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedEntityTypes, setSelectedEntityTypes] = useState<EntityTypeOption[]>([]);
  const [selectedActions, setSelectedActions] = useState<ActionTypeOption[]>([]);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 800); // Increased debounce time to reduce requests

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle entity type filter changes
  const handleEntityTypeChange = (entityType: EntityTypeOption, checked: boolean) => {
    if (checked) {
      setSelectedEntityTypes(prev => [...prev, entityType]);
    } else {
      setSelectedEntityTypes(prev => prev.filter(type => type !== entityType));
    }
  };

  // Handle action type filter changes
  const handleActionChange = (action: ActionTypeOption, checked: boolean) => {
    if (checked) {
      setSelectedActions(prev => [...prev, action]);
    } else {
      setSelectedActions(prev => prev.filter(a => a !== action));
    }
  };

  // Handle date range changes
  const handleDateFromChange = (date: string) => {
    setDateFrom(date);
  };

  const handleDateToChange = (date: string) => {
    setDateTo(date);
  };

  // Handle clearing all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSelectedEntityTypes([]);
    setSelectedActions([]);
    setDateFrom("");
    setDateTo("");
  };

  // Handle clearing specific filter types
  const handleClearEntityTypes = () => {
    setSelectedEntityTypes([]);
  };

  const handleClearActions = () => {
    setSelectedActions([]);
  };

  const handleClearDateRange = () => {
    setDateFrom("");
    setDateTo("");
  };

  // Check if any filters are active
  const hasActiveFilters = 
    debouncedSearchTerm !== "" ||
    selectedEntityTypes.length > 0 ||
    selectedActions.length > 0 ||
    dateFrom !== "" ||
    dateTo !== "";

  return {
    // Filter states
    searchTerm,
    debouncedSearchTerm,
    selectedEntityTypes,
    selectedActions,
    dateFrom,
    dateTo,
    hasActiveFilters,

    // Filter setters
    setSearchTerm,
    setSelectedEntityTypes,
    setSelectedActions,
    setDateFrom,
    setDateTo,

    // Filter handlers
    handleEntityTypeChange,
    handleActionChange,
    handleDateFromChange,
    handleDateToChange,
    handleClearFilters,
    handleClearEntityTypes,
    handleClearActions,
    handleClearDateRange,
  };
}