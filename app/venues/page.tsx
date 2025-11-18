'use client';

import {
  VenueDirectoryHeader,
  VenueTypeFilters,
  VenueGrid,
  PaginationControls,
  VenueDirectorySkeleton,
  VenueBreadcrumb
} from './components';
import { useVenueFilters, usePublicVenues } from './hooks';

/**
 * Public venues directory page
 * Displays venues with filtering and global search
 * Uses cursor-based pagination for efficient data loading
 */
export default function VenuesDirectoryPage() {
  // Filter state management
  const {
    filters,
    debouncedSearch,
    setVenueType,
    clearFilters,
    hasActiveFilters
  } = useVenueFilters({
    market: '' // No default market, show all venues
  });

  // Fetch venues with current filters
  // Apollo Client automatically refetches when variables change
  const {
    venues,
    pageInfo,
    totalCount,
    loading,
    error,
    loadNextPage,
    refetch
  } = usePublicVenues({
    search: debouncedSearch,
    venueType: filters.venueType,
    first: 20
  });

  // Show loading skeleton on initial load
  if (loading && venues.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <VenueDirectorySkeleton />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load venues
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-4">
            {error.message || 'An error occurred while loading venues. Please try again later.'}
          </p>
          <button
            onClick={() => refetch()}
            className="text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Breadcrumb navigation */}
        <VenueBreadcrumb
          items={[
            { label: 'Venues' }
          ]}
        />

        {/* Header with title and global search */}
        <VenueDirectoryHeader />

        {/* Venue type filter chips */}
        <VenueTypeFilters
          selectedType={filters.venueType}
          onTypeChange={setVenueType}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        {/* Results count */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-semibold">
              {totalCount} {totalCount === 1 ? 'Venue' : 'Venues'} Found
            </h2>
          </div>
        )}

        {/* Venue grid */}
        <VenueGrid venues={venues} />

        {/* Pagination controls */}
        {pageInfo && venues.length > 0 && (
          <PaginationControls
            pageInfo={pageInfo}
            onNextPage={loadNextPage}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
