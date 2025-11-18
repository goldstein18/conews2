"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProtectedPage, ProtectionPresets } from "@/components/protected-page";

// Components
import { TagsFilters, TagsTable } from "./components";

// Hooks
import { useTagsFilters, useTagsSorting, useTagsData, useTagsPagination, TagSortField } from "./hooks";

export default function TagsPage() {
  return (
    <ProtectedPage {...ProtectionPresets.SuperAdminOnly}>
      <TagsPageContent />
    </ProtectedPage>
  );
}

function TagsPageContent() {
  const router = useRouter();
  
  // Custom hooks - safe to call here since access is confirmed
  const pagination = useTagsPagination();
  const filters = useTagsFilters({ 
    onFiltersChange: pagination.resetPagination 
  });
  const sorting = useTagsSorting();

  // Enhanced sort handler that also resets pagination
  const handleSort = (field: TagSortField) => {
    sorting.handleSort(field);
    pagination.resetPagination();
  };

  // Data hook with all dependencies
  const {
    tags,
    totalCount,
    pageInfo,
    loading,
    error,
    refetch,
  } = useTagsData({
    debouncedSearchTerm: filters.debouncedSearchTerm,
    selectedType: filters.selectedType,
    selectedMainGenre: filters.selectedMainGenre,
    selectedStatus: filters.selectedStatus,
    sortField: sorting.sortField,
    sortDirection: sorting.sortDirection,
    after: pagination.after,
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tags Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage music tags across all 4 levels: Main Genre, Sub Genre, Supporting, and Audience
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/tags/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Tag
        </Button>
      </div>

      {/* Filters Section */}
      <TagsFilters
        searchTerm={filters.searchTerm}
        selectedType={filters.selectedType}
        selectedMainGenre={filters.selectedMainGenre}
        selectedStatus={filters.selectedStatus}
        hasActiveFilters={filters.hasActiveFilters}
        onSearchChange={filters.setSearchTerm}
        onTypeChange={filters.handleTypeClick}
        onMainGenreChange={filters.handleMainGenreClick}
        onStatusChange={filters.handleStatusClick}
        onClearAllFilters={filters.handleClearAllFilters}
      />

      {/* Table Section */}
      <TagsTable
        tags={tags}
        loading={loading}
        error={error}
        totalCount={totalCount}
        sortField={sorting.sortField}
        sortDirection={sorting.sortDirection}
        pageInfo={pageInfo}
        onSort={handleSort}
        onPreviousPage={pagination.handlePreviousPage}
        onNextPage={pagination.handleNextPage}
        onRefetch={refetch}
      />
    </div>
  );
}