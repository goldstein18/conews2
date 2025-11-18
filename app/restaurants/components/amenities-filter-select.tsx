'use client';

import { MapPin } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';
import { COMMON_AMENITIES } from '@/types/public-restaurants';

interface AmenitiesFilterSelectProps {
  selectedAmenities: string[];
  onAmenitiesChange: (amenities: string[]) => void;
  className?: string;
}

/**
 * Amenities filter using multi-select dropdown
 * Renamed as "Great Spot For" for better UX
 * Allows multiple amenity selection with badges
 */
export function AmenitiesFilterSelect({
  selectedAmenities,
  onAmenitiesChange,
  className
}: AmenitiesFilterSelectProps) {
  // Transform amenities to multi-select options
  const amenitiesOptions = COMMON_AMENITIES.map(amenity => ({
    label: amenity.label,
    value: amenity.value,
    icon: MapPin // Using MapPin as generic icon, can customize per amenity
  }));

  return (
    <MultiSelect
      options={amenitiesOptions}
      onValueChange={onAmenitiesChange}
      defaultValue={selectedAmenities}
      placeholder="Great Spot For"
      variant="default"
      maxCount={2}
      animation={0.2}
      modalPopover={false}
      className={className}
    />
  );
}
