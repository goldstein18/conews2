"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProtectedPage } from '@/components/protected-page';

// Components
import { VenueStats } from './components/venue-stats';
import { VenueFilters } from './components/venue-filters';
import { VenueTable } from './components/venue-table';
import { VenuePageSkeleton } from './components/venue-skeleton';

// Hooks
import { useVenuesFilters } from './hooks/use-venues-filters';
import { useVenuesSorting } from './hooks/use-venues-sorting';
import { useVenuesData } from './hooks/use-venues-data';
import { useVenueActions } from './hooks/use-venue-actions';

import type { Venue, VenueStatus, VenuePriority, VenueSortField } from '@/types/venues';

export default function VenuesPage() {
  return (
    <ProtectedPage 
      requiredRoles={['SUPER_ADMIN', 'ADMIN', 'CALENDAR_MEMBER', 'DINNING_MEMBER']}
    >
      <VenuesPageContent />
    </ProtectedPage>
  );
}

function VenuesPageContent() {
  const router = useRouter();
  
  // Custom hooks - safe to call here since access is confirmed
  const filters = useVenuesFilters();
  const sorting = useVenuesSorting();
  const { deleteVenue } = useVenueActions();
  
  // Reset pagination when sorting changes
  const resetPaginationOnSort = () => {
    filters.setAfter(undefined);
  };

  // Enhanced sort handler that also resets pagination
  const handleSort = (field: VenueSortField) => {
    sorting.handleSort(field);
    resetPaginationOnSort();
  };

  // Data hook with all dependencies
  const {
    venues,
    totalCount,
    pageInfo,
    loading,
    error,
    refetch,
    fetchMore
  } = useVenuesData({
    search: filters.search,
    status: filters.status,
    priority: filters.priority,
    city: filters.city,
    sortField: sorting.sortField,
    sortDirection: sorting.sortDirection,
    first: 20,
    after: filters.after
  });

  // URL updates are handled automatically within the hooks themselves

  // Handle filter changes
  const handleStatusFilter = (status: VenueStatus | 'ALL') => {
    filters.setStatus(status);
  };

  const handlePriorityFilter = (priority: VenuePriority | 'ALL') => {
    filters.setPriority(priority);
  };

  // Handle actions
  const handleCreateVenue = () => {
    router.push('/dashboard/venues/create');
  };

  const handleEditVenue = (venue: Venue) => {
    router.push(`/dashboard/venues/${venue.id}/edit`);
  };

  const handleDeleteVenue = async (venue: Venue) => {
    const success = await deleteVenue(venue.id);
    if (success) {
      refetch();
    }
  };

  const handleViewVenue = (venue: Venue) => {
    router.push(`/dashboard/venues/${venue.id}`);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      filters.setAfter(pageInfo.endCursor);
    }
  };

  const handlePreviousPage = () => {
    if (pageInfo.hasPreviousPage) {
      filters.setAfter(undefined);
    }
  };

  const handleLoadMore = () => {
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      fetchMore({ after: pageInfo.endCursor });
    }
  };

  // Show initial loading state
  if (loading && venues.length === 0) {
    return <VenuePageSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Venue Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage all venue submissions and approvals
          </p>
        </div>
        <Button onClick={handleCreateVenue}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Venue
        </Button>
      </div>

      {/* Stats Cards */}
      <VenueStats
        onStatusFilter={handleStatusFilter}
      />

      {/* Filters */}
      <VenueFilters
        search={filters.search}
        status={filters.status}
        priority={filters.priority}
        city={filters.city}
        onSearchChange={filters.setSearch}
        onStatusChange={handleStatusFilter}
        onPriorityChange={handlePriorityFilter}
        onCityChange={filters.setCity}
        onClearFilters={filters.clearFilters}
        showAdvanced={true}
      />

      {/* Table */}
      <VenueTable
        venues={venues}
        loading={loading}
        sortField={sorting.sortField}
        sortDirection={sorting.sortDirection}
        onSort={handleSort}
        onEdit={handleEditVenue}
        onDelete={handleDeleteVenue}
        onView={handleViewVenue}
        totalCount={totalCount}
        hasNextPage={pageInfo.hasNextPage}
        hasPreviousPage={pageInfo.hasPreviousPage}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        onLoadMore={handleLoadMore}
        showActions={true}
      />

      {/* Error handling */}
      {error && (
        <div className="text-center py-4">
          <p className="text-sm text-destructive mb-2">
            Failed to load venues. Please try again.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}