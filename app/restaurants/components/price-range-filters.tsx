'use client';

import { Button } from '@/components/ui/button';
import { PriceRange, PRICE_RANGE_OPTIONS } from '@/types/public-restaurants';

interface PriceRangeFiltersProps {
  selectedPriceRange: PriceRange | 'ALL';
  onPriceRangeChange: (priceRange: PriceRange | 'ALL') => void;
}

/**
 * Price range filter buttons
 * Allows filtering restaurants by price range
 */
export function PriceRangeFilters({
  selectedPriceRange,
  onPriceRangeChange
}: PriceRangeFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-sm font-medium text-gray-700 flex items-center mr-2">
        Price Range:
      </span>
      {PRICE_RANGE_OPTIONS.map(option => {
        const isSelected = selectedPriceRange === option.value;

        return (
          <Button
            key={option.value}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPriceRangeChange(option.value as PriceRange | 'ALL')}
            className={`
              transition-all duration-200
              ${isSelected ? 'ring-2 ring-primary ring-offset-2' : 'hover:bg-gray-50'}
            `}
          >
            {option.icon && <span className="mr-1.5">{option.icon}</span>}
            {option.label}
            {option.name && (
              <span className="ml-1.5 text-xs opacity-75">
                {option.name}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
