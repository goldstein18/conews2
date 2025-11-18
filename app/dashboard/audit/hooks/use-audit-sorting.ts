import { useState } from "react";
import { AuditSortField, SortDirection } from "@/types/audit";

export function useAuditSorting() {
  const [sortField, setSortField] = useState<AuditSortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Handle column sorting
  const handleSort = (field: AuditSortField) => {
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