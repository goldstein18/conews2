'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { PRICE_RANGE_OPTIONS, PriceRange } from '@/types/public-restaurants';

interface PriceRangeFilterCheckboxesProps {
  selectedPriceRange: PriceRange | 'ALL';
  onPriceRangeChange: (priceRange: PriceRange | 'ALL') => void;
}

/**
 * Price Range filter component with checkbox UI
 * Displays price range options in a collapsible section
 */
export function PriceRangeFilterCheckboxes({
  selectedPriceRange,
  onPriceRangeChange
}: PriceRangeFilterCheckboxesProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const hasSelection = selectedPriceRange !== 'ALL';

  // Filter out the 'ALL' option since we're using individual checkboxes
  const priceRangeOptions = PRICE_RANGE_OPTIONS.filter(option => option.value !== 'ALL');

  return (
    <div className="border-b border-gray-200 pb-4">
      {/* Header with expand/collapse */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-3 group"
        aria-expanded={isExpanded}
        aria-controls="price-range-filter-content"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
            Price Range
          </span>
          {hasSelection && (
            <Badge variant="secondary" className="text-xs">
              1
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
        <div id="price-range-filter-content" className="space-y-2">
          {/* Clear button */}
          {hasSelection && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPriceRangeChange('ALL')}
              className="w-full justify-start text-xs text-gray-600 hover:text-gray-900 h-8"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}

          {/* Price range checkboxes */}
          <div className="space-y-2">
            {priceRangeOptions.map((option) => {
              const isSelected = selectedPriceRange === option.value;

              return (
                <label
                  key={option.value}
                  htmlFor={`price-${option.value}`}
                  className="flex items-center space-x-2 cursor-pointer group"
                >
                  <Checkbox
                    id={`price-${option.value}`}
                    checked={isSelected}
                    onCheckedChange={() => {
                      onPriceRangeChange(
                        isSelected ? 'ALL' : (option.value as PriceRange)
                      );
                    }}
                    className="flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors select-none flex items-center gap-1.5">
                    <span className="font-medium">{option.label}</span>
                    {option.name && (
                      <span className="text-gray-500">({option.name})</span>
                    )}
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
