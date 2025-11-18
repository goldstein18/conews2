/**
 * Client component for genre + location events page
 * Filters events by both genre and geographic location
 */

'use client';

import {
  EventFilters,
  EventGrid,
  PaginationControls,
  EventDirectorySkeleton,
  EventBreadcrumb
} from '../../../components';
import { useEventFilters, usePublicEvents, useGenreFilters } from '../../../hooks';
import { getGenreDisplayName, getLocationDisplayName, parseSubgenresFromUrl } from '../../../utils';
import type { LocationInfo } from '../../../utils';
import { GlobalSearch } from '@/components/search';
import { useEventSearch } from '@/hooks/use-event-search';
import { EVENT_SEARCH_CONFIG } from '@/lib/search-configs';
import { useMemo, useEffect, useState } from 'react';

interface GenreLocationContentProps {
  genreName: string;  // "MUSIC", "ART", etc.
  genreSlug: string;  // "music", "art", etc.
  location: LocationInfo;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function GenreLocationContent({
  genreName,
  genreSlug,
  location,
  searchParams
}: GenreLocationContentProps) {
  const { city, state } = location;
  const genreDisplay = getGenreDisplayName(genreName);
  const locationDisplay = getLocationDisplayName(city, state);

  // Check if we just navigated from internal page (within last 100ms)
  const [shouldSkipInitialQuery, setShouldSkipInitialQuery] = useState(() => {
    if (typeof window === 'undefined') return false;
    const lastNavigation = sessionStorage.getItem('lastInternalNavigation');
    if (lastNavigation) {
      const navTime = parseInt(lastNavigation, 10);
      const now = Date.now();
      return (now - navTime) < 100;
    }
    return false;
  });

  // Parse subgenres from URL
  const urlParams = useMemo(
    () => new URLSearchParams(searchParams as Record<string, string>),
    [searchParams]
  );
  const subgenreSlugs = parseSubgenresFromUrl(urlParams);

  // Get genre filters for loading state
  const {
    mainGenresLoading
  } = useGenreFilters();

  // Filter state management with location pre-filled
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

  // Fetch events with genre + location filters
  // If subgenres are selected, use those; otherwise use main genre (by name)
  const tagNamesToUse = filters.tagNames.length > 0
    ? filters.tagNames
    : (genreName ? [genreName] : []);

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
    tagNames: tagNamesToUse,
    skip: shouldSkipInitialQuery,
    city,
    state,
    first: 20
  });

  // Clear skip flag after first render
  useEffect(() => {
    if (shouldSkipInitialQuery) {
      setShouldSkipInitialQuery(false);
      sessionStorage.removeItem('lastInternalNavigation');
    }
  }, [shouldSkipInitialQuery]);

  // Show loading skeleton on initial load
  if ((loading && events.length === 0) || mainGenresLoading) {
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
            { label: genreDisplay },
            { label: locationDisplay }
          ]}
        />

        {/* Header with genre + location specific title and search */}
        <div className="space-y-6">
          {/* Title section */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {genreDisplay} Events in {locationDisplay}
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover {genreDisplay.toLowerCase()} events, performances, and exhibitions in {city}
            </p>
          </div>

          {/* Global Search with Location Dropdown */}
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
          initialGenreName={genreName}
          initialSubgenreSlugs={subgenreSlugs}
          enableRouting={true}
          genreContext={genreSlug}
          locationContext={location}
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
