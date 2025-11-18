/**
 * Client component for location-based events page
 * Filters events by location (city and state)
 */

'use client';

import {
  EventFilters,
  EventGrid,
  PaginationControls,
  EventDirectorySkeleton,
  EventBreadcrumb
} from '../../components';
import { useEventFilters, usePublicEvents } from '../../hooks';
import { getLocationDisplayName } from '../../utils';
import type { LocationInfo } from '../../utils';
import { GlobalSearch } from '@/components/search';
import { useEventSearch } from '@/hooks/use-event-search';
import { EVENT_SEARCH_CONFIG } from '@/lib/search-configs';

interface LocationPageContentProps {
  location: LocationInfo;
}

export default function LocationPageContent({ location }: LocationPageContentProps) {
  const { city, state } = location;
  const locationName = getLocationDisplayName(city, state);

  // Filter state management with location pre-filled (no search - GlobalSearch handles it)
  const {
    filters,
    setDateFilter,
    setVirtual,
    setTagNames,
    clearFilters,
    hasActiveFilters
  } = useEventFilters({
    defaultCity: city,
    defaultState: state
  });

  // Fetch events with current filters including location (no search parameter)
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
    virtual: filters.virtual || undefined,
    tagNames: filters.tagNames, // Genre/subgenre filters
    city,
    state,
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
        <EventBreadcrumb
          items={[
            { label: locationName }
          ]}
        />

        {/* Header with location-specific title and search */}
        <div className="space-y-6">
          {/* Title section - same style as main page */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Events in {locationName}
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover cultural events, performances, and exhibitions happening in {city}
            </p>
          </div>

          {/* Global Search with Location Dropdown - same as main page */}
          <GlobalSearch
            config={EVENT_SEARCH_CONFIG}
            useSearch={useEventSearch}
            className="max-w-2xl"
          />
        </div>

        {/* Genre, date, and virtual filters */}
        <EventFilters
          selectedDateFilter={filters.dateFilter}
          onDateFilterChange={setDateFilter}
          selectedTagNames={filters.tagNames}
          onTagNamesChange={setTagNames}
          virtual={filters.virtual}
          onVirtualChange={setVirtual}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          enableRouting={true}
          locationContext={location}
        />

        {/* Results count */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-semibold">
              {totalCount} {totalCount === 1 ? 'Event' : 'Events'} Found in {locationName}
            </h2>
          </div>
        )}

        {/* Event grid */}
        <EventGrid events={events} />

        {/* Pagination controls */}
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
