'use client';

import { RestaurantBreadcrumb } from '../../components';
import {
  RestaurantDirectoryHeader,
  RestaurantGrid,
  PaginationControls,
  RestaurantDirectorySkeleton,
  FiltersBar
} from '../../components';
import { usePublicRestaurants, useRestaurantFilters } from '../../hooks';
import { getLocationDisplayName } from '../../utils';

interface LocationData {
  city: string;
  state: string;
}

interface RestaurantsByLocationContentProps {
  location: LocationData;
}

/**
 * Client component for location-filtered restaurant directory
 * Displays restaurants in a specific city/state
 */
export default function RestaurantsByLocationContent({ location }: RestaurantsByLocationContentProps) {
  const { city, state } = location;
  const locationName = getLocationDisplayName(city, state);

  // Filter state management
  const {
    filters,
    debouncedSearch,
    setPriceRange,
    setCuisineTypes,
    setAmenities,
    clearFilters,
    hasActiveFilters,
    activeFilterCount
  } = useRestaurantFilters({
    market: '' // No default market
  });

  // Fetch restaurants filtered by location
  const {
    restaurants,
    pageInfo,
    totalCount,
    loading,
    error,
    loadNextPage,
    refetch
  } = usePublicRestaurants({
    city,
    state,
    search: debouncedSearch,
    priceRange: filters.priceRange,
    cuisineTypeIds: filters.cuisineTypes,
    amenityIds: filters.amenities,
    first: 20
  });

  // Show loading skeleton on initial load
  if (loading && restaurants.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <RestaurantDirectorySkeleton />
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
            Failed to load restaurants
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-4">
            {error.message || 'An error occurred while loading restaurants. Please try again later.'}
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <RestaurantBreadcrumb
          items={[
            { label: 'Restaurants', href: '/restaurants' },
            { label: locationName }
          ]}
        />

        {/* Header with global search */}
        <RestaurantDirectoryHeader
          title={`Restaurants in ${locationName}`}
          description={`Explore ${totalCount} dining ${totalCount === 1 ? 'option' : 'options'} in ${city}, ${state}. From casual eateries to upscale dining, find your perfect meal.`}
        />

        {/* Horizontal Filters Bar */}
        <FiltersBar
          selectedPriceRange={filters.priceRange}
          selectedCuisineTypeIds={filters.cuisineTypes}
          selectedAmenities={filters.amenities}
          onPriceRangeChange={setPriceRange}
          onCuisineTypesChange={setCuisineTypes}
          onAmenitiesChange={setAmenities}
          onClearAllFilters={clearFilters}
          activeFilterCount={activeFilterCount}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {totalCount > 0 ? (
              <>
                Showing <span className="font-medium">{restaurants.length}</span> of{' '}
                <span className="font-medium">{totalCount}</span> restaurants in {locationName}
              </>
            ) : (
              'No restaurants found in this location'
            )}
          </p>
        </div>

        {/* Restaurant Grid */}
        <RestaurantGrid restaurants={restaurants} />

        {/* Pagination Controls */}
        {pageInfo && (
          <div className="mt-12">
            <PaginationControls
              hasNextPage={pageInfo.hasNextPage}
              hasPreviousPage={false}
              onNext={loadNextPage}
              onPrevious={() => {}}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
