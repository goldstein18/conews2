'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CuisineFilterSelect } from './cuisine-filter-select';
import { AmenitiesFilterSelect } from './amenities-filter-select';
import { PriceFilterSelect } from './price-filter-select';
import type { PriceRange } from '@/types/public-restaurants';

interface FiltersBarProps {
  // Filter states
  selectedPriceRange: PriceRange | 'ALL';
  selectedCuisineTypeIds: string[];
  selectedAmenities: string[];

  // Filter handlers
  onPriceRangeChange: (priceRange: PriceRange | 'ALL') => void;
  onCuisineTypesChange: (ids: string[]) => void;
  onAmenitiesChange: (amenities: string[]) => void;
  onClearAllFilters: () => void;

  // Active filter count
  activeFilterCount?: number;
  hasActiveFilters?: boolean;
}

/**
 * Horizontal filters bar component
 * Contains Cuisine, Great Spot For (Amenities), and Price filters
 * Displayed as inline dropdowns instead of sidebar
 */
export function FiltersBar({
  selectedPriceRange,
  selectedCuisineTypeIds,
  selectedAmenities,
  onPriceRangeChange,
  onCuisineTypesChange,
  onAmenitiesChange,
  onClearAllFilters,
  activeFilterCount = 0,
  hasActiveFilters = false
}: FiltersBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mb-6">
      {/* Cuisine Multi-Select */}
      <CuisineFilterSelect
        selectedCuisineTypeIds={selectedCuisineTypeIds}
        onCuisineTypesChange={onCuisineTypesChange}
        className="w-full sm:w-[280px]"
      />

      {/* Amenities Multi-Select */}
      <AmenitiesFilterSelect
        selectedAmenities={selectedAmenities}
        onAmenitiesChange={onAmenitiesChange}
        className="w-full sm:w-[280px]"
      />

      {/* Price Single-Select */}
      <PriceFilterSelect
        selectedPriceRange={selectedPriceRange}
        onPriceRangeChange={onPriceRangeChange}
        className="w-full sm:w-[200px]"
      />

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="default"
          onClick={onClearAllFilters}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear all
          {activeFilterCount > 0 && (
            <span className="ml-1 text-xs text-muted-foreground">
              ({activeFilterCount})
            </span>
          )}
        </Button>
      )}
    </div>
  );
}
