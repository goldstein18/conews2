/**
 * Public events directory page
 * Displays events with filtering, search, and infinite scroll pagination
 * Uses cursor-based pagination for efficient data loading
 */

'use client';

import {
  EventDirectoryHeader,
  EventFilters,
  EventGrid,
  PaginationControls,
  EventDirectorySkeleton,
  EventBreadcrumb
} from './components';
import { useEventFilters, usePublicEvents } from './hooks';

export default function EventsDirectoryPage() {
  // Filter state management (no search state - GlobalSearch handles navigation)
  const {
    filters,
    setDateFilter,
    setVirtual,
    setTagNames,  // Changed from setTagIds
    clearFilters,
    hasActiveFilters
  } = useEventFilters();

  // Fetch events with current filters (no search parameter - handled by GlobalSearch)
  // Apollo Client automatically refetches when variables change
  const {
    events,
    pageInfo,
    totalCount,
    loading,
    error,
    loadNextPage,
    refetch
  } = usePublicEvents({
    dateFilter: filters.dateFilter,
    virtual: filters.virtual || undefined, // Only pass if true
    tagNames: filters.tagNames, // Changed from tagIds - Genre/subgenre names
    first: 20
  });

  // Show loading skeleton on initial load
  if (loading && events.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EventDirectorySkeleton />
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
            Failed to load events
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-4">
            {error.message || 'An error occurred while loading events. Please try again later.'}
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
        <EventBreadcrumb items={[]} />

        {/* Header with title and global search - GlobalSearch handles navigation */}
        <EventDirectoryHeader />

        {/* Genre, date, and virtual filters */}
        <EventFilters
          selectedDateFilter={filters.dateFilter}
          onDateFilterChange={setDateFilter}
          selectedTagNames={filters.tagNames}  // Changed from selectedTagIds
          onTagNamesChange={setTagNames}  // Changed from onTagIdsChange
          virtual={filters.virtual}
          onVirtualChange={setVirtual}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          enableRouting={true}
        />

        {/* Results count */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-semibold">
              {totalCount} {totalCount === 1 ? 'Event' : 'Events'} Found
            </h2>
          </div>
        )}

        {/* Event grid */}
        <EventGrid events={events} />

        {/* Pagination controls (infinite scroll) */}
        {pageInfo && events.length > 0 && (
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
