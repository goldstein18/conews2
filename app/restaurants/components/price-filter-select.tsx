'use client';

import { DollarSign } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PriceRange, PRICE_RANGE_OPTIONS } from '@/types/public-restaurants';

interface PriceFilterSelectProps {
  selectedPriceRange: PriceRange | 'ALL';
  onPriceRangeChange: (priceRange: PriceRange | 'ALL') => void;
  className?: string;
}

/**
 * Price Range filter using single-select dropdown
 * Displays dollar signs ($ to $$$$) for each price range
 */
export function PriceFilterSelect({
  selectedPriceRange,
  onPriceRangeChange,
  className
}: PriceFilterSelectProps) {
  return (
    <Select
      value={selectedPriceRange}
      onValueChange={(value) => onPriceRangeChange(value as PriceRange | 'ALL')}
    >
      <SelectTrigger className={className}>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          <SelectValue placeholder="Price" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {PRICE_RANGE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              {option.icon && <span>{option.icon}</span>}
              <span className="font-medium">{option.label}</span>
              {option.name && (
                <span className="text-gray-500">({option.name})</span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
