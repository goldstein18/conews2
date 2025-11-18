'use client';

import { RestaurantBreadcrumb } from './components';
import {
  RestaurantDirectoryHeader,
  RestaurantGrid,
  PaginationControls,
  RestaurantDirectorySkeleton,
  FiltersBar
} from './components';
import { usePublicRestaurants, useRestaurantFilters } from './hooks';

/**
 * Main restaurant directory page
 * Displays paginated list of all restaurants with horizontal dropdown filters
 * Filters: Cuisine Type (multi-select), Great Spot For (multi-select), Price (single-select)
 */
export default function RestaurantsDirectoryPage() {
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
    market: '' // No default market, show all restaurants
  });

  // Fetch restaurants with current filters
  // Apollo Client automatically refetches when variables change
  const {
    restaurants,
    pageInfo,
    totalCount,
    loading,
    error,
    loadNextPage,
    refetch
  } = usePublicRestaurants({
    search: debouncedSearch,
    priceRange: filters.priceRange,
    cuisineTypeIds: filters.cuisineTypes,
    amenityIds: filters.amenities,
    first: 20
  });

  // Show loading skeleton when loading with no data (matches venues behavior)
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
            { label: 'Restaurants' }
          ]}
        />

        {/* Header with global search */}
        <RestaurantDirectoryHeader
          title="Restaurant Directory"
          description="Discover the best dining experiences across Florida. From budget-friendly gems to fine dining establishments, explore our curated collection of restaurants."
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
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {totalCount > 0 ? (
              <>
                Showing <span className="font-medium">{restaurants.length}</span> of{' '}
                <span className="font-medium">{totalCount}</span> restaurants
              </>
            ) : (
              'No restaurants found'
            )}
          </p>
          {/* Loading indicator when filtering */}
          {loading && restaurants.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-primary" />
              <span>Updating...</span>
            </div>
          )}
        </div>

        {/* Restaurant Grid */}
        <RestaurantGrid restaurants={restaurants} />

        {/* Pagination Controls */}
        {pageInfo && restaurants.length > 0 && (
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
