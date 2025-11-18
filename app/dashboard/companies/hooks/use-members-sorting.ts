import { useState } from "react";
import { SortField, SortDirection } from "@/types/members";

export function useMembersSorting() {
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Handle column sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with default direction
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    sortField,
    sortDirection,
    handleSort,
    setSortField,
    setSortDirection,
  };
}