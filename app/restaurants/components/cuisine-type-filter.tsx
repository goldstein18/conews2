'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useRestaurantTypes } from '../hooks';
import type { RestaurantType } from '@/types/public-restaurants';

interface CuisineTypeFilterProps {
  selectedCuisineTypeIds: string[];
  onToggleCuisineType: (cuisineTypeId: string) => void;
  onClearCuisineTypes: () => void;
}

/**
 * Cuisine Type filter component with checkboxes
 * Displays all available restaurant types in a collapsible section
 */
export function CuisineTypeFilter({
  selectedCuisineTypeIds,
  onToggleCuisineType,
  onClearCuisineTypes
}: CuisineTypeFilterProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { restaurantTypes, loading } = useRestaurantTypes();

  const selectedCount = selectedCuisineTypeIds.length;

  // Loading skeleton
  if (loading) {
    return (
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-4" />
        </div>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200 pb-4">
      {/* Header with expand/collapse */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-3 group"
        aria-expanded={isExpanded}
        aria-controls="cuisine-type-filter-content"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
            Cuisine
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
        <div id="cuisine-type-filter-content" className="space-y-2">
          {/* Clear all button */}
          {selectedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearCuisineTypes}
              className="w-full justify-start text-xs text-gray-600 hover:text-gray-900 h-8"
            >
              <X className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          )}

          {/* Cuisine type checkboxes */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {restaurantTypes.length === 0 ? (
              <p className="text-sm text-gray-500 py-2">No cuisine types available</p>
            ) : (
              restaurantTypes.map((type: RestaurantType) => {
                const isSelected = selectedCuisineTypeIds.includes(type.id);
                const displayName = type.displayName || type.name;

                return (
                  <label
                    key={type.id}
                    htmlFor={`cuisine-${type.id}`}
                    className="flex items-center space-x-2 cursor-pointer group"
                  >
                    <Checkbox
                      id={`cuisine-${type.id}`}
                      checked={isSelected}
                      onCheckedChange={() => onToggleCuisineType(type.id)}
                      className="flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors select-none">
                      {displayName}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
