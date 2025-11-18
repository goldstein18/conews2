"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortField } from "@/types/members";
import { ProtectedPage, ProtectionPresets } from "@/components/protected-page";

// Components
import { MembersStats, MembersFilters, MembersTable } from "./components";

// Hooks
import { useMembersFilters, useMembersSorting, useMembersData } from "./hooks";

export default function MembersPage() {
  return (
    <ProtectedPage {...ProtectionPresets.CompanyManagement}>
      <MembersPageContent />
    </ProtectedPage>
  );
}

function MembersPageContent() {
  const router = useRouter();
  
  // Custom hooks - safe to call here since access is confirmed
  const filters = useMembersFilters();
  const sorting = useMembersSorting();
  
  // Reset pagination when sorting changes
  const resetPaginationOnSort = () => {
    filters.setAfter(undefined);
  };

  // Enhanced sort handler that also resets pagination
  const handleSort = (field: SortField) => {
    sorting.handleSort(field);
    resetPaginationOnSort();
  };

  // Data hook with all dependencies
  const {
    members,
    totalCount,
    pageInfo,
    loading,
    error,
    handleLoadMore,
    planStats,
    summary,
    statsLoading,
    statsError,
  } = useMembersData({
    debouncedSearchTerm: filters.debouncedSearchTerm,
    selectedMarket: filters.selectedMarket,
    selectedStatus: filters.selectedStatus,
    selectedPlan: filters.selectedPlan,
    selectedSummaryFilter: filters.selectedSummaryFilter,
    sortField: sorting.sortField,
    sortDirection: sorting.sortDirection,
    after: filters.after,
  });

  // Enhanced pagination handlers
  const handleNextPage = () => {
    filters.handleNextPage(pageInfo?.endCursor);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Companies Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and monitor all platform companies</p>
        </div>
        <Button onClick={() => router.push('/dashboard/companies/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Company
        </Button>
      </div>

      {/* Stats Section */}
      <MembersStats
        planStats={planStats}
        summary={summary}
        statsLoading={statsLoading}
        statsError={statsError}
        selectedPlan={filters.selectedPlan}
        selectedSummaryFilter={filters.selectedSummaryFilter}
        onPlanClick={filters.handlePlanClick}
        onSummaryClick={filters.handleSummaryClick}
        onClearPlanFilter={filters.handleClearPlanFilter}
        onClearSummaryFilter={filters.handleClearSummaryFilter}
      />

      {/* Filters Section */}
      <MembersFilters
        searchTerm={filters.searchTerm}
        selectedMarket={filters.selectedMarket}
        selectedStatus={filters.selectedStatus}
        showDeleted={filters.showDeleted}
        onSearchChange={filters.setSearchTerm}
        onMarketChange={filters.setSelectedMarket}
        onStatusChange={filters.setSelectedStatus}
        onShowDeletedChange={filters.setShowDeleted}
      />

      {/* Table Section */}
      <MembersTable
        members={members}
        loading={loading}
        error={error}
        totalCount={totalCount}
        sortField={sorting.sortField}
        sortDirection={sorting.sortDirection}
        pageInfo={pageInfo}
        onSort={handleSort}
        onPreviousPage={filters.handlePreviousPage}
        onNextPage={handleNextPage}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}