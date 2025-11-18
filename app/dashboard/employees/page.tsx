"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortField } from "@/types/members";
import { ProtectedPage, ProtectionPresets } from "@/components/protected-page";

// Components
import { EmployeesFilters, EmployeesTable } from "./components";

// Hooks
import { useEmployeesFilters, useEmployeesSorting, useEmployeesData } from "./hooks";

export default function EmployeesPage() {
  return (
    <ProtectedPage {...ProtectionPresets.EmployeeManagement}>
      <EmployeesPageContent />
    </ProtectedPage>
  );
}

function EmployeesPageContent() {
  const router = useRouter();
  
  // Custom hooks - safe to call here since access is confirmed
  const filters = useEmployeesFilters();
  const sorting = useEmployeesSorting();
  
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
    employees,
    totalCount,
    pageInfo,
    loading,
    error,
    handleLoadMore,
  } = useEmployeesData({
    debouncedSearchTerm: filters.debouncedSearchTerm,
    selectedMarket: filters.selectedMarket,
    selectedRole: filters.selectedRole,
    selectedStatus: filters.selectedStatus,
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
          <h1 className="text-2xl font-semibold text-gray-900">Employees</h1>
          <p className="text-sm text-gray-600 mt-1">Manage company employees and their permissions</p>
        </div>
        <Button onClick={() => router.push('/dashboard/employees/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Employee
        </Button>
      </div>

      {/* Filters Section */}
      <EmployeesFilters
        searchTerm={filters.searchTerm}
        selectedMarket={filters.selectedMarket}
        selectedRole={filters.selectedRole}
        selectedStatus={filters.selectedStatus}
        onSearchChange={filters.setSearchTerm}
        onMarketChange={filters.setSelectedMarket}
        onRoleChange={filters.setSelectedRole}
        onStatusChange={filters.setSelectedStatus}
      />

      {/* Table Section */}
      <EmployeesTable
        employees={employees}
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