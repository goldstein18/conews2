'use client';

import { Button } from '@/components/ui/button';
import { X, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CuisineTypeFilter } from './cuisine-type-filter';
import { PriceRangeFilterCheckboxes } from './price-range-filter-checkboxes';
import { AmenitiesFilter } from './amenities-filter';
import type { PriceRange } from '@/types/public-restaurants';

interface FiltersSidebarProps {
  // Filter states
  selectedPriceRange: PriceRange | 'ALL';
  selectedCuisineTypeIds: string[];
  selectedAmenities: string[];

  // Filter handlers
  onPriceRangeChange: (priceRange: PriceRange | 'ALL') => void;
  onToggleCuisineType: (cuisineTypeId: string) => void;
  onClearCuisineTypes: () => void;
  onToggleAmenity: (amenityId: string) => void;
  onClearAmenities: () => void;
  onClearAllFilters: () => void;

  // Active filter count
  activeFilterCount?: number;
  hasActiveFilters?: boolean;
}

/**
 * Filters sidebar container component
 * Contains all filter sections: Cuisine Type, Price Range, and Amenities
 * Desktop: Fixed left sidebar
 * Mobile: Hidden, controlled by mobile filter button/drawer
 */
export function FiltersSidebar({
  selectedPriceRange,
  selectedCuisineTypeIds,
  selectedAmenities,
  onPriceRangeChange,
  onToggleCuisineType,
  onClearCuisineTypes,
  onToggleAmenity,
  onClearAmenities,
  onClearAllFilters,
  activeFilterCount = 0,
  hasActiveFilters = false
}: FiltersSidebarProps) {
  return (
    <aside className="w-full lg:w-64 bg-white rounded-lg border border-gray-200 p-4 h-fit lg:sticky lg:top-4">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-gray-700" />
          <h2 className="text-base font-semibold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <Badge variant="default" className="text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </div>

        {/* Clear all filters button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAllFilters}
            className="text-xs text-gray-600 hover:text-gray-900 h-7 px-2"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="space-y-4">
        {/* Cuisine Type Filter */}
        <CuisineTypeFilter
          selectedCuisineTypeIds={selectedCuisineTypeIds}
          onToggleCuisineType={onToggleCuisineType}
          onClearCuisineTypes={onClearCuisineTypes}
        />

        {/* Price Range Filter */}
        <PriceRangeFilterCheckboxes
          selectedPriceRange={selectedPriceRange}
          onPriceRangeChange={onPriceRangeChange}
        />

        {/* Amenities Filter */}
        <AmenitiesFilter
          selectedAmenities={selectedAmenities}
          onToggleAmenity={onToggleAmenity}
          onClearAmenities={onClearAmenities}
        />
      </div>

      {/* Active filters summary (optional) */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
          </p>
        </div>
      )}
    </aside>
  );
}
