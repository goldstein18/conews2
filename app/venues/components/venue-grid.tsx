'use client';

import type { PublicVenueEdge } from '@/types/public-venues';
import { VenueCard } from './venue-card';

interface VenueGridProps {
  venues: PublicVenueEdge[];
}

/**
 * Responsive grid layout for venue cards
 * - Mobile: 1 column
 * - Small tablets: 2 columns
 * - Tablets/iPad: 3 columns
 * - Laptops: 4 columns
 * - Desktop: 5 columns
 */
export function VenueGrid({ venues }: VenueGridProps) {
  if (venues.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <span className="text-3xl">🏛️</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No venues found
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Try adjusting your filters or search term to find more venues.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {venues.map(edge => (
        <VenueCard key={edge.node.id} venue={edge.node} />
      ))}
    </div>
  );
}
