/**
 * Client component for genre-specific events page
 * Displays events filtered by main genre with optional subgenre filters
 */

'use client';

import {
  EventFilters,
  EventGrid,
  PaginationControls,
  EventDirectorySkeleton,
  EventBreadcrumb
} from '../components';
import { useEventFilters, usePublicEvents, useGenreFilters } from '../hooks';
import { getGenreDisplayName, parseSubgenresFromUrl } from '../utils';
import { GlobalSearch } from '@/components/search';
import { useEventSearch } from '@/hooks/use-event-search';
import { EVENT_SEARCH_CONFIG } from '@/lib/search-configs';
import { useMemo, useEffect, useState } from 'react';

interface GenrePageContentProps {
  genreName: string;  // "MUSIC", "ART", etc.
  genreSlug: string;  // "music", "art", etc.
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function GenrePageContent({
  genreName,
  genreSlug,
  searchParams
}: GenrePageContentProps) {
  const displayName = getGenreDisplayName(genreName);

  // Check if we just navigated from internal page (within last 100ms)
  const [shouldSkipInitialQuery, setShouldSkipInitialQuery] = useState(() => {
    if (typeof window === 'undefined') return false;
    const lastNavigation = sessionStorage.getItem('lastInternalNavigation');
    if (lastNavigation) {
      const navTime = parseInt(lastNavigation, 10);
      const now = Date.now();
      // If navigation happened within last 100ms, skip query
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

  // Filter state management (no location)
  const {
    filters,
    setDateFilter,
    setVirtual,
    setTagNames,
    clearFilters,
    hasActiveFilters
  } = useEventFilters();

  // Fetch events with genre filter
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
    first: 20
  });

  // Clear skip flag after first render
  useEffect(() => {
    if (shouldSkipInitialQuery) {
      setShouldSkipInitialQuery(false);
      // Clear the session storage flag
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
            { label: displayName }
          ]}
        />

        {/* Header with genre-specific title and search */}
        <div className="space-y-6">
          {/* Title section */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {displayName} Events in Florida
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover {displayName.toLowerCase()} events, performances, and exhibitions across Florida
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
