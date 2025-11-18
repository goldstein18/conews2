'use client';

import { UtensilsCrossed, DollarSign } from 'lucide-react';
import type { PublicRestaurant } from '@/types/public-restaurants';
import { getPriceRangeSymbol } from '../utils';
import { DirectoryCard } from '@/components/directory';
import { DEFAULT_IMAGE } from '@/lib/constants/images';

interface RestaurantCardProps {
  restaurant: PublicRestaurant;
}

/**
 * Individual restaurant card with image hover zoom effect
 * Displays restaurant image, name, location, cuisine type, and price range
 * Uses global DirectoryCard component for consistency
 */
export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { name, slug, city, imageUrl, priceRange, restaurantType } = restaurant;

  const priceSymbol = getPriceRangeSymbol(priceRange);
  const cuisineType = restaurantType?.name || 'Restaurant';

  // Fallback to default owl image if no image provided
  const displayImage = imageUrl || DEFAULT_IMAGE;

  return (
    <DirectoryCard
      href={`/restaurants/restaurant/${slug}`}
      imageUrl={displayImage}
      title={name}
      location={city}
      badge={{
        icon: UtensilsCrossed,
        label: cuisineType,
        variant: 'secondary',
      }}
      secondaryBadge={{
        icon: DollarSign,
        label: priceSymbol,
        variant: 'outline',
      }}
    />
  );
}
