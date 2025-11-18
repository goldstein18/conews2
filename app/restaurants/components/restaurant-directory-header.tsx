'use client';

import { GlobalSearch } from '@/components/search';
import { useRestaurantSearch } from '@/hooks/use-restaurant-search';
import { RESTAURANT_SEARCH_CONFIG } from '@/lib/search-configs';

interface RestaurantDirectoryHeaderProps {
  title: string;
  description: string;
}

/**
 * Header component for restaurant directory pages
 * Includes title, description, and global search with dropdown results
 */
export function RestaurantDirectoryHeader({
  title,
  description
}: RestaurantDirectoryHeaderProps) {
  return (
    <div className="mb-8">
      {/* Title and Description */}
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          {description}
        </p>
      </div>

      {/* Global Search with dropdown */}
      <GlobalSearch
        config={RESTAURANT_SEARCH_CONFIG}
        useSearch={useRestaurantSearch}
        className="max-w-2xl"
      />
    </div>
  );
}
