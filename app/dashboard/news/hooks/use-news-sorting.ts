import { useState } from "react";
import { NewsSortField as SortField, SortDirection } from "@/types/news";

export function useNewsSorting() {
  const [sortField, setSortField] = useState<SortField>(SortField.CREATED_AT);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);

  // Handle column sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC);
    } else {
      // Set new field with default direction
      setSortField(field);
      setSortDirection(SortDirection.ASC);
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