'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { VenueType } from '@/types/public-venues';
import {
  ALL_VENUE_TYPES,
  getVenueTypeDisplayName,
  getVenueTypeIcon
} from '@/app/venues/utils';

interface VenueTypeFiltersProps {
  selectedType: VenueType | 'ALL';
  onTypeChange: (type: VenueType | 'ALL') => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

/**
 * Horizontal scrollable venue type filter chips
 * Displays all venue types with icons, allows single selection
 */
export function VenueTypeFilters({
  selectedType,
  onTypeChange,
  hasActiveFilters = false,
  onClearFilters
}: VenueTypeFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Filter by Type</h2>
        {hasActiveFilters && onClearFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Scrollable chips container */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* All venues chip */}
          <Badge
            variant={selectedType === 'ALL' ? 'default' : 'outline'}
            className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm transition-all hover:scale-105"
            onClick={() => onTypeChange('ALL')}
          >
            All Venues
          </Badge>

          {/* Individual venue type chips */}
          {ALL_VENUE_TYPES.map(type => {
            const Icon = getVenueTypeIcon(type);
            const displayName = getVenueTypeDisplayName(type);
            const isSelected = selectedType === type;

            return (
              <Badge
                key={type}
                variant={isSelected ? 'default' : 'outline'}
                className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm transition-all hover:scale-105 flex items-center gap-1.5"
                onClick={() => onTypeChange(type)}
              >
                <Icon className="h-3.5 w-3.5" />
                {displayName}
              </Badge>
            );
          })}
        </div>

        {/* Fade effect on right edge for scroll indication */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
