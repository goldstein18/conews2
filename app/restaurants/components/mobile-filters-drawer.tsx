'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { CuisineTypeFilter } from './cuisine-type-filter';
import { PriceRangeFilterCheckboxes } from './price-range-filter-checkboxes';
import { AmenitiesFilter } from './amenities-filter';
import type { PriceRange } from '@/types/public-restaurants';

interface MobileFiltersDrawerProps {
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
 * Mobile filters drawer component
 * Displays filters in a bottom sheet/drawer on mobile devices
 * Includes apply/cancel buttons for better mobile UX
 */
export function MobileFiltersDrawer({
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
}: MobileFiltersDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-white text-primary hover:bg-white"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Filter Restaurants
            </SheetTitle>
            <SheetDescription>
              Select your preferences to find the perfect restaurant
            </SheetDescription>
          </SheetHeader>

          {/* Filter Sections */}
          <div className="py-6 space-y-4">
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

          {/* Footer with action buttons */}
          <SheetFooter className="flex-col sm:flex-col gap-2 pt-4 border-t">
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={() => {
                  onClearAllFilters();
                  setIsOpen(false);
                }}
                className="w-full"
              >
                Clear all filters
              </Button>
            )}

            <SheetClose asChild>
              <Button className="w-full">
                Show results
                {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''})`}
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
