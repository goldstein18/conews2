'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { RestaurantStatus, Restaurant, RestaurantSortField, PriceRange } from '@/types/restaurants';
import {
  RestaurantStats,
  RestaurantFilters,
  RestaurantTable,
  RestaurantPageSkeleton
} from './components';
import {
  useRestaurantsData,
  useRestaurantsSorting,
  useRestaurantActions,
  useRestaurantFilters
} from './hooks';
import React from 'react';

function RestaurantsPageContent() {
  const router = useRouter();
  
  // Custom hooks
  const filters = useRestaurantFilters();
  const sorting = useRestaurantsSorting();
  const { deleteRestaurant, approveRestaurant, declineRestaurant } = useRestaurantActions();
  
  // Reset pagination when sorting changes
  const resetPaginationOnSort = () => {
    filters.setAfter(undefined);
  };

  // Enhanced sort handler that also resets pagination
  const handleSort = (field: RestaurantSortField) => {
    sorting.handleSort(field);
    resetPaginationOnSort();
  };

  // Data hook with all dependencies
  const {
    restaurants,
    totalCount,
    pageInfo,
    loading,
    error,
    refetch,
    fetchMore
  } = useRestaurantsData({
    search: filters.search,
    status: filters.status !== 'ALL' ? filters.status : undefined,
    priceRange: filters.priceRange !== 'ALL' ? filters.priceRange : undefined,
    city: filters.city,
    market: filters.market,
    cuisineType: filters.cuisineType,
    first: 20,
    after: filters.after
  });

  // Handle filter changes
  const handleStatusFilter = (status: RestaurantStatus | 'ALL') => {
    filters.setStatus(status);
  };

  const handlePriceRangeFilter = (priceRange: PriceRange | 'ALL') => {
    filters.setPriceRange(priceRange);
  };

  // Handle actions
  const handleCreateRestaurant = () => {
    router.push('/dashboard/restaurants/create');
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    router.push(`/dashboard/restaurants/${restaurant.id}/edit`);
  };

  const handleDeleteRestaurant = async (restaurant: Restaurant) => {
    const success = await deleteRestaurant(restaurant.id);
    if (success) {
      refetch();
    }
  };

  const handleViewRestaurant = (restaurant: Restaurant) => {
    router.push(`/dashboard/restaurants/${restaurant.id}`);
  };

  const handleApproveRestaurant = async (restaurant: Restaurant) => {
    const success = await approveRestaurant(restaurant.id);
    if (success) {
      refetch();
    }
  };

  const handleDeclineRestaurant = async (restaurant: Restaurant) => {
    // In a real app, you'd show a dialog to get the reason
    const reason = 'Declined by admin'; // TODO: Replace with proper dialog
    const success = await declineRestaurant(restaurant.id, reason);
    if (success) {
      refetch();
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (pageInfo?.hasNextPage && pageInfo?.endCursor) {
      filters.setAfter(pageInfo.endCursor);
    }
  };

  const handlePreviousPage = () => {
    if (pageInfo?.hasPreviousPage) {
      filters.setAfter(undefined);
    }
  };

  const handleLoadMore = () => {
    if (pageInfo?.hasNextPage && pageInfo?.endCursor) {
      fetchMore({ after: pageInfo.endCursor });
    }
  };

  // Show initial loading state
  if (loading && restaurants.length === 0) {
    return <RestaurantPageSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Restaurants Status</h1>
          <p className="text-sm text-muted-foreground">
            Manage restaurant listings and approvals
          </p>
        </div>
        <Button onClick={handleCreateRestaurant}>
          <Plus className="h-4 w-4 mr-2" />
          Add Restaurant
        </Button>
      </div>

      {/* Stats Cards */}
      <RestaurantStats
        onStatusFilter={handleStatusFilter}
      />

      {/* Filters */}
      <RestaurantFilters
        search={filters.search}
        status={filters.status}
        priceRange={filters.priceRange}
        city={filters.city}
        market={filters.market}
        cuisineType={filters.cuisineType}
        onSearchChange={filters.setSearch}
        onStatusChange={handleStatusFilter}
        onPriceRangeChange={handlePriceRangeFilter}
        onCityChange={filters.setCity}
        onMarketChange={filters.setMarket}
        onCuisineTypeChange={filters.setCuisineType}
        onClearFilters={filters.clearFilters}
        showAdvanced={true}
      />

      {/* Table */}
      <RestaurantTable
        restaurants={restaurants}
        loading={loading}
        sortField={sorting.sortField}
        sortDirection={sorting.sortDirection}
        onSort={handleSort}
        onEdit={handleEditRestaurant}
        onDelete={handleDeleteRestaurant}
        onView={handleViewRestaurant}
        onApprove={handleApproveRestaurant}
        onDecline={handleDeclineRestaurant}
        totalCount={totalCount}
        hasNextPage={pageInfo?.hasNextPage}
        hasPreviousPage={pageInfo?.hasPreviousPage}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        onLoadMore={handleLoadMore}
        showActions={true}
      />

      {/* Error handling */}
      {error && (
        <div className="text-center py-4">
          <p className="text-sm text-destructive mb-2">
            Failed to load restaurants. Please try again.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}

export default function RestaurantsPage() {
  return <RestaurantsPageContent />;
}