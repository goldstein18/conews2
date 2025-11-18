'use client';

import { Utensils } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';
import { useRestaurantTypes } from '../hooks';

interface CuisineFilterSelectProps {
  selectedCuisineTypeIds: string[];
  onCuisineTypesChange: (ids: string[]) => void;
  className?: string;
}

/**
 * Cuisine Type filter using multi-select dropdown
 * Allows multiple cuisine selection with badges
 */
export function CuisineFilterSelect({
  selectedCuisineTypeIds,
  onCuisineTypesChange,
  className
}: CuisineFilterSelectProps) {
  const { restaurantTypes, loading } = useRestaurantTypes();

  // Transform restaurant types to multi-select options
  const cuisineOptions = restaurantTypes.map(type => ({
    label: type.displayName || type.name,
    value: type.id,
    icon: Utensils
  }));

  if (loading) {
    return (
      <div className="h-10 w-full sm:w-[240px] animate-pulse bg-gray-200 rounded-md" />
    );
  }

  return (
    <MultiSelect
      options={cuisineOptions}
      onValueChange={onCuisineTypesChange}
      defaultValue={selectedCuisineTypeIds}
      placeholder="Cuisine"
      variant="default"
      maxCount={3}
      animation={0.2}
      modalPopover={false}
      className={className}
    />
  );
}
