'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { COMMON_AMENITIES } from '@/types/public-restaurants';

interface AmenitiesFilterProps {
  selectedAmenities: string[];
  onToggleAmenity: (amenityId: string) => void;
  onClearAmenities: () => void;
}

/**
 * Amenities filter component with checkboxes
 * Displays common restaurant amenities in a collapsible section
 */
export function AmenitiesFilter({
  selectedAmenities,
  onToggleAmenity,
  onClearAmenities
}: AmenitiesFilterProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const selectedCount = selectedAmenities.length;

  return (
    <div className="border-b border-gray-200 pb-4">
      {/* Header with expand/collapse */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-3 group"
        aria-expanded={isExpanded}
        aria-controls="amenities-filter-content"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
            Amenities
          </span>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedCount}
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {/* Filter content */}
      {isExpanded && (
        <div id="amenities-filter-content" className="space-y-2">
          {/* Clear all button */}
          {selectedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAmenities}
              className="w-full justify-start text-xs text-gray-600 hover:text-gray-900 h-8"
            >
              <X className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          )}

          {/* Amenity checkboxes */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {COMMON_AMENITIES.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity.value);

              return (
                <label
                  key={amenity.value}
                  htmlFor={`amenity-${amenity.value}`}
                  className="flex items-center space-x-2 cursor-pointer group"
                >
                  <Checkbox
                    id={`amenity-${amenity.value}`}
                    checked={isSelected}
                    onCheckedChange={() => onToggleAmenity(amenity.value)}
                    className="flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors select-none flex items-center gap-1.5">
                    {amenity.icon && <span className="text-base">{amenity.icon}</span>}
                    {amenity.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
