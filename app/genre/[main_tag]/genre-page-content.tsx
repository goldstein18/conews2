/**
 * Client component for genre-specific events page
 * Displays hero, filters, and events grid
 */

'use client';

import { useState, useEffect } from 'react';
import { GenreHero, GenreFilters, GenreNavigation } from './components';
import {
  EventGrid,
  PaginationControls,
  EventDirectorySkeleton
} from '@/app/calendar/events/components';
import { useEventFilters, usePublicEvents } from '@/app/calendar/events/hooks';
import { getGenreConfig, getGenreHeroTitle } from '../utils';

interface GenrePageContentProps {
  genreName: string;     // "MUSIC", "ART", etc. (backend name)
  genreSlug: string;     // "music", "art", etc. (URL slug) - reserved for future use
}

export default function GenrePageContent({
  genreName
}: GenrePageContentProps) {
  const genreConfig = getGenreConfig(genreName);
  const heroTitle = getGenreHeroTitle(genreName);

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

  // Filter state management (no location, no virtual)
  const {
    filters,
    setDateFilter,
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
  if (loading && events.length === 0) {
    return (
      <>
        {/* Hero always visible */}
        <GenreHero
          title={heroTitle}
          description={genreConfig.description}
          backgroundImage={genreConfig.heroImage}
        />

        {/* Genre navigation circles */}
        <GenreNavigation currentGenreName={genreName} />

        <div className="container mx-auto px-4 py-8">
          <EventDirectorySkeleton />
        </div>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <GenreHero
          title={heroTitle}
          description={genreConfig.description}
          backgroundImage={genreConfig.heroImage}
        />

        {/* Genre navigation circles */}
        <GenreNavigation currentGenreName={genreName} />

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
      </>
    );
  }

  return (
    <>
      {/* Hero section */}
      <GenreHero
        title={heroTitle}
        description={genreConfig.description}
        backgroundImage={genreConfig.heroImage}
      />

      {/* Genre navigation circles */}
      <GenreNavigation currentGenreName={genreName} />

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Filters section */}
          <GenreFilters
            selectedDateFilter={filters.dateFilter}
            onDateFilterChange={setDateFilter}
            selectedTagNames={filters.tagNames}
            onTagNamesChange={setTagNames}
            mainGenreName={genreName}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
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

          {/* No results message */}
          {!loading && events.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                Try adjusting your filters to find more events.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-primary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
