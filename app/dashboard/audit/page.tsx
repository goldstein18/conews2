"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { AuditSortField } from "@/types/audit";
import { AuditEntry } from "@/types/audit";
import { ProtectedPage, ProtectionPresets } from "@/components/protected-page";

// Components
import { AuditStatsComponent, AuditFilters, AuditTable, AuditDetailSheet } from "./components";

// Hooks
import { useAuditFilters, useAuditSorting, useAuditData } from "./hooks";

export default function AuditPage() {
  return (
    <ProtectedPage {...ProtectionPresets.AuditLogs}>
      <AuditPageContent />
    </ProtectedPage>
  );
}

function AuditPageContent() {
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  
  // Custom hooks - safe to call here since access is confirmed
  const filters = useAuditFilters();
  const sorting = useAuditSorting();

  // Enhanced sort handler
  const handleSort = (field: AuditSortField) => {
    sorting.handleSort(field);
  };

  // Data hook with all dependencies
  const {
    auditEntries,
    totalCount,
    loading,
    error,
    stats,
    statsLoading,
    statsError,
  } = useAuditData({
    debouncedSearchTerm: filters.debouncedSearchTerm,
    selectedEntityTypes: filters.selectedEntityTypes,
    selectedActions: filters.selectedActions,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    sortField: sorting.sortField,
    sortDirection: sorting.sortDirection,
  });

  // Handle audit entry selection for detail view
  const handleEntryClick = (entry: AuditEntry) => {
    setSelectedEntry(entry);
    setIsDetailSheetOpen(true);
  };

  // Handle detail sheet close
  const handleDetailSheetClose = () => {
    setIsDetailSheetOpen(false);
    setSelectedEntry(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Audit Log</h1>
          <p className="text-sm text-gray-600 mt-1">Track system activity and user actions</p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Shield className="h-4 w-4 mr-1" />
          Security & Compliance
        </div>
      </div>

      {/* Stats Section */}
      <AuditStatsComponent
        stats={stats}
        statsLoading={statsLoading}
        statsError={statsError}
      />

      {/* Layout with filters on left, table on right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <AuditFilters
            searchTerm={filters.searchTerm}
            selectedEntityTypes={filters.selectedEntityTypes}
            selectedActions={filters.selectedActions}
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            hasActiveFilters={filters.hasActiveFilters}
            onSearchChange={filters.setSearchTerm}
            onEntityTypeChange={filters.handleEntityTypeChange}
            onActionChange={filters.handleActionChange}
            onDateFromChange={filters.handleDateFromChange}
            onDateToChange={filters.handleDateToChange}
            onClearFilters={filters.handleClearFilters}
            onClearEntityTypes={filters.handleClearEntityTypes}
            onClearActions={filters.handleClearActions}
            onClearDateRange={filters.handleClearDateRange}
          />
        </div>

        {/* Table Content */}
        <div className="lg:col-span-3">
          <AuditTable
            auditEntries={auditEntries}
            loading={loading}
            error={error}
            totalCount={totalCount}
            sortField={sorting.sortField}
            sortDirection={sorting.sortDirection}
            onSort={handleSort}
            onEntryClick={handleEntryClick}
          />
        </div>
      </div>

      {/* Detail Sheet */}
      <AuditDetailSheet
        entry={selectedEntry}
        isOpen={isDetailSheetOpen}
        onClose={handleDetailSheetClose}
      />
    </div>
  );
}