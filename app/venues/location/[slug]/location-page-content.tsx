'use client';

import {
  VenueTypeFilters,
  VenueGrid,
  PaginationControls,
  VenueDirectorySkeleton,
  VenueBreadcrumb
} from '../../components';
import { useVenueFilters, usePublicVenues } from '../../hooks';
import { getLocationDisplayName } from '../../utils';
import { GlobalSearch } from '@/components/search';
import { useVenueSearch } from '@/hooks/use-venue-search';
import { VENUE_SEARCH_CONFIG } from '@/lib/search-configs';
import type { VenueType } from '@/types/public-venues';

interface VenuesByLocationContentProps {
  location: {
    city: string;
    state: string;
  };
}

/**
 * Client component for location-filtered venues
 * Displays all venues in a specific city/state
 */
export default function VenuesByLocationContent({ location }: VenuesByLocationContentProps) {
  const { city, state } = location;
  const locationName = getLocationDisplayName(city, state);

  // Filter state management (without market/search, using city/state)
  const {
    filters,
    setVenueType,
    clearFilters,
    hasActiveFilters
  } = useVenueFilters({
    market: '' // No default market when filtering by specific city
  });

  // Fetch venues filtered by city and state
  const {
    venues,
    pageInfo,
    totalCount,
    loading,
    error,
    loadNextPage,
    refetch
  } = usePublicVenues({
    city,
    state,
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
            { label: 'Venues', href: '/venues' },
            { label: locationName }
          ]}
        />

        {/* Location-specific header with search */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Venues in {locationName}
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover cultural venues, theaters, museums, and event spaces in {city}, {state}
            </p>
          </div>

          {/* Global search to find other locations or venues */}
          <GlobalSearch
            config={VENUE_SEARCH_CONFIG}
            useSearch={useVenueSearch}
            className="max-w-2xl"
          />
        </div>

        {/* Venue type filter chips */}
        <VenueTypeFilters
          selectedType={filters.venueType}
          onTypeChange={(type: VenueType | 'ALL') => setVenueType(type)}
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

        {/* Empty state */}
        {totalCount === 0 && !loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <span className="text-3xl">🏛️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No venues found in {locationName}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              There are no venues in this location yet. Try exploring other cities.
            </p>
          </div>
        )}

        {/* Venue grid */}
        {totalCount > 0 && <VenueGrid venues={venues} />}

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
