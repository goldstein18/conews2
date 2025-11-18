"use client";

import { useRouter } from "next/navigation";
import { Plus, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProtectedPage, ProtectionPresets } from "@/components/protected-page";
import { TicketSortField, TicketStatus, TicketPriority } from "@/types/ticket";

// Components
import { TicketStats, TicketFilters, TicketTable } from "./components";

// Hooks
import {
  useTicketFilters,
  useTicketSorting,
  useTicketData,
  useTicketStats,
} from "./hooks";

export default function SupportPage() {
  return (
    <ProtectedPage {...ProtectionPresets.AuditLogs}>
      <SupportPageContent />
    </ProtectedPage>
  );
}

function SupportPageContent() {
  const router = useRouter();

  // Hooks
  const filters = useTicketFilters();
  const sorting = useTicketSorting();

  // Reset pagination when sorting changes
  const handleSort = (field: TicketSortField) => {
    sorting.handleSort(field);
    filters.resetPagination();
  };

  // Data hooks
  const {
    tickets,
    totalCount,
    pageInfo,
    loading,
    error,
  } = useTicketData({
    filter: filters.filterInput,
    after: filters.after,
  });

  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useTicketStats();

  // Handle stat card click for filtering
  const handleStatClick = (filterType: string) => {
    filters.resetFilters();

    switch (filterType) {
      case 'OPEN':
      case 'IN_PROGRESS':
      case 'WAITING_FOR_CUSTOMER':
      case 'RESOLVED':
        filters.setSelectedStatus(filterType as TicketStatus);
        break;
      case 'URGENT':
      case 'HIGH':
        filters.setSelectedPriority(filterType as TicketPriority);
        break;
      case 'UNASSIGNED':
        filters.setSelectedAssignedTo('UNASSIGNED');
        break;
      case 'ALL':
        // Already reset
        break;
    }
  };

  // Handle pagination
  const handleNextPage = () => {
    if (pageInfo.hasNextPage) {
      filters.setAfter(pageInfo.endCursor);
    }
  };

  const handlePreviousPage = () => {
    if (pageInfo.hasPreviousPage) {
      filters.setAfter(undefined);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Support Tickets</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and track customer support requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center text-sm text-gray-500">
            <Headphones className="h-4 w-4 mr-1" />
            Customer Support
          </div>
          <Button onClick={() => router.push("/dashboard/support/create")}>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Stats */}
      <TicketStats
        stats={stats}
        loading={statsLoading}
        onStatClick={handleStatClick}
      />

      {/* Filters */}
      <TicketFilters
        searchTerm={filters.searchTerm}
        setSearchTerm={filters.setSearchTerm}
        selectedStatus={filters.selectedStatus}
        setSelectedStatus={filters.setSelectedStatus}
        selectedPriority={filters.selectedPriority}
        setSelectedPriority={filters.setSelectedPriority}
        selectedCategory={filters.selectedCategory}
        setSelectedCategory={filters.setSelectedCategory}
        hasActiveFilters={filters.hasActiveFilters}
        resetFilters={filters.resetFilters}
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-medium">Error loading tickets</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {statsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-medium">Error loading statistics</p>
          <p className="text-sm">{statsError.message}</p>
        </div>
      )}

      {/* Tickets Table */}
      <TicketTable
        tickets={tickets}
        loading={loading}
        sortField={sorting.sortField}
        sortDirection={sorting.sortDirection}
        onSort={handleSort}
        pageInfo={pageInfo}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        totalCount={totalCount}
      />
    </div>
  );
}
