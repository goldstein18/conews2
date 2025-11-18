"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventsSortField } from "@/types/events";
import { ProtectedPage, ProtectionPresets } from "@/components/protected-page";
import { INITIALIZE_DRAFT } from "@/lib/graphql/events";
import { toast } from "sonner";

// Components
import { EventsStats, EventsFilters, EventsTable, EventsSkeleton } from "./components";

// Hooks
import { useEventsFilters, useEventsSorting, useEventsData } from "./hooks";

export default function EventsPage() {
  return (
    <ProtectedPage {...ProtectionPresets.CalendarAccess}>
      <EventsPageContent />
    </ProtectedPage>
  );
}

function EventsPageContent() {
  const router = useRouter();
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  
  // Initialize draft mutation
  const [initializeDraftMutation] = useMutation(INITIALIZE_DRAFT);
  
  // Custom hooks - safe to call here since access is confirmed
  const filters = useEventsFilters();
  const sorting = useEventsSorting();
  
  // Reset pagination when sorting changes
  const resetPaginationOnSort = () => {
    filters.setAfter(undefined);
  };

  // Enhanced sort handler that also resets pagination
  const handleSort = (field: EventsSortField) => {
    sorting.handleSort(field);
    resetPaginationOnSort();
  };

  // Data hook with all dependencies
  const {
    events,
    totalCount,
    pageInfo,
    loading,
    error,
    summary,
    statsLoading,
    statsError,
  } = useEventsData({
    debouncedSearchTerm: filters.debouncedSearchTerm,
    selectedStatus: filters.selectedStatus,
    selectedMarket: filters.selectedMarket,
    selectedCompany: filters.selectedCompany,
    sortField: sorting.sortField,
    sortDirection: sorting.sortDirection,
    after: filters.after,
  });

  // Handle creating new event draft
  const handleCreateEvent = async () => {
    if (isCreatingDraft) return; // Prevent double clicks
    
    setIsCreatingDraft(true);
    
    try {
      const { data } = await initializeDraftMutation();
      const draftId = data?.initializeDraft?.id;
      
      if (draftId) {
        // Navigate directly to edit page with the new draft
        router.push(`/dashboard/events/${draftId}/edit?draft=true`);
      } else {
        toast.error('Failed to create event draft');
        setIsCreatingDraft(false);
      }
    } catch (error) {
      console.error('Failed to initialize draft:', error);
      toast.error('Failed to create event draft');
      setIsCreatingDraft(false);
    }
  };

  // Enhanced pagination handlers
  const handleNextPage = () => {
    filters.handleNextPage(pageInfo?.endCursor);
  };

  // If initial loading, show skeleton
  if (loading && events.length === 0 && !error) {
    return <EventsSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and monitor all platform events</p>
        </div>
        <Button onClick={handleCreateEvent} disabled={isCreatingDraft}>
          {isCreatingDraft ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {isCreatingDraft ? 'Creating...' : 'Create Event'}
        </Button>
      </div>

      {/* Stats Section */}
      <EventsStats
        summary={summary}
        statsLoading={statsLoading}
        statsError={statsError}
        selectedStatus={filters.selectedStatus}
        onStatusClick={filters.handleStatusClick}
        onClearStatusFilter={filters.handleClearStatusFilter}
      />

      {/* Filters Section */}
      <EventsFilters
        searchTerm={filters.searchTerm}
        selectedStatus={filters.selectedStatus}
        selectedMarket={filters.selectedMarket}
        hasActiveFilters={filters.hasActiveFilters}
        onSearchChange={filters.setSearchTerm}
        onStatusChange={filters.setSelectedStatus}
        onMarketChange={filters.setSelectedMarket}
        onClearAllFilters={filters.handleClearAllFilters}
      />

      {/* Table Section */}
      <EventsTable
        events={events}
        loading={loading}
        error={error}
        totalCount={totalCount}
        sortField={sorting.sortField}
        sortDirection={sorting.sortDirection}
        pageInfo={pageInfo}
        onSort={handleSort}
        onPreviousPage={filters.handlePreviousPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
}