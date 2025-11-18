'use client';

import type { PublicRestaurantEdge } from '@/types/public-restaurants';
import { RestaurantCard } from './restaurant-card';

interface RestaurantGridProps {
  restaurants: PublicRestaurantEdge[];
}

/**
 * Responsive grid layout for restaurant cards
 * Matches venue grid layout with 5 columns on XL screens
 */
export function RestaurantGrid({ restaurants }: RestaurantGridProps) {
  if (restaurants.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <span className="text-3xl">🍽️</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No restaurants found
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Try adjusting your filters or search term to find more restaurants.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {restaurants.map(({ node: restaurant }) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
