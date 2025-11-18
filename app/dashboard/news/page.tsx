"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProtectedPage, ProtectionPresets } from "@/components/protected-page";
import { NewsSortField } from "@/types/news";

// Components
import { NewsStats, NewsFilters, NewsTable } from "./components";

// Hooks
import { useNewsFilters, useNewsSorting, useNewsData } from "./hooks";

export default function NewsPage() {
  return (
    <ProtectedPage {...ProtectionPresets.CompanyManagement}>
      <NewsPageContent />
    </ProtectedPage>
  );
}

function NewsPageContent() {
  const router = useRouter();
  
  // Custom hooks - safe to call here since access is confirmed
  const filters = useNewsFilters();
  const sorting = useNewsSorting();
  
  // Reset pagination when sorting changes
  const resetPaginationOnSort = () => {
    filters.setAfter(undefined);
  };

  // Enhanced sort handler that also resets pagination
  const handleSort = (field: NewsSortField) => {
    sorting.handleSort(field);
    resetPaginationOnSort();
  };

  // Data hook with all dependencies
  const {
    news,
    totalCount,
    loading,
    error,
  } = useNewsData({
    debouncedSearchTerm: filters.debouncedSearchTerm,
    selectedCategory: filters.selectedCategory,
    selectedStatus: filters.selectedStatus,
    selectedTag: filters.selectedTag,
    selectedSummaryFilter: filters.selectedSummaryFilter,
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">News Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and monitor all news articles</p>
        </div>
        <Button onClick={() => router.push('/dashboard/news/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create News
        </Button>
      </div>

      {/* Stats Section */}
      <NewsStats
        selectedSummaryFilter={filters.selectedSummaryFilter}
        onSummaryClick={filters.handleSummaryClick}
        onClearSummaryFilter={filters.handleClearSummaryFilter}
      />

      {/* Filters Section */}
      <NewsFilters
        searchTerm={filters.searchTerm}
        selectedCategory={filters.selectedCategory}
        selectedStatus={filters.selectedStatus}
        selectedTag={filters.selectedTag}
        showArchived={filters.showArchived}
        onSearchChange={filters.setSearchTerm}
        onCategoryChange={filters.setSelectedCategory}
        onStatusChange={filters.setSelectedStatus}
        onTagChange={filters.setSelectedTag}
        onShowArchivedChange={filters.setShowArchived}
      />

      {/* Table Section */}
      <NewsTable
        news={news}
        loading={loading}
        error={error}
        totalCount={totalCount}
        sortField={sorting.sortField}
        sortDirection={sorting.sortDirection}
        onSort={handleSort}
      />
    </div>
  );
}