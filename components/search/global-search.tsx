'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { locationToSlug } from '@/app/venues/utils';
import { SearchInput } from './search-input';
import { SearchDropdown } from './search-dropdown';
import type { SearchLocation, SearchEntity, SearchResults, ModuleSearchConfig } from '@/types/search';

interface GlobalSearchProps<T extends SearchEntity = SearchEntity> {
  config: ModuleSearchConfig<T>;
  useSearch: (query: string, market?: string) => {
    results: SearchResults<T>;
    loading: boolean;
    query: string;
  };
  className?: string;
  /**
   * Optional market filter to scope search results
   */
  market?: string;
  /**
   * Optional callback when location is selected
   * If not provided, will navigate using config.baseRoute/config.locationRoute
   */
  onLocationSelect?: (location: SearchLocation) => void;
  /**
   * Optional callback when entity is selected
   * If not provided, will navigate using config.baseRoute/config.entityRoute
   */
  onEntitySelect?: (entity: T) => void;
}

/**
 * Generic global search component with Michelin Guide-style functionality
 * Searches for both locations and entities (venues, restaurants, arts groups, etc.)
 * Displays results in a dropdown with grouped sections
 * Works with any module configuration
 */
export function GlobalSearch<T extends SearchEntity>({
  config,
  useSearch,
  className = '',
  market,
  onLocationSelect,
  onEntitySelect
}: GlobalSearchProps<T>) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the module-specific search hook
  const { results, loading } = useSearch(query, market);

  const handleLocationClick = (location: SearchLocation) => {
    if (onLocationSelect) {
      onLocationSelect(location);
    } else if (config.locationRoute) {
      // Navigate to path-based location URL (SEO-friendly)
      // Example: /venues/location/miami-fl
      const slug = locationToSlug(location.city, location.state);
      router.push(`${config.baseRoute}${config.locationRoute}/${slug}`);
    }

    setIsOpen(false);
    setQuery('');
  };

  const handleEntityClick = (entity: T) => {
    if (onEntitySelect) {
      onEntitySelect(entity);
    } else {
      // Navigate to entity detail page
      // Example: /venues/venue/art-deco-museum
      router.push(`${config.baseRoute}${config.entityRoute}/${entity.slug}`);
    }

    setIsOpen(false);
    setQuery('');
  };

  const handleInputFocus = () => {
    // Only open if there's a query
    if (query.length >= 2) {
      setIsOpen(true);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    // Open dropdown if query is long enough
    if (value.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <SearchInput
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={config.placeholder}
      />

      <SearchDropdown
        config={config}
        results={results}
        loading={loading}
        query={query}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onLocationClick={handleLocationClick}
        onEntityClick={handleEntityClick}
        containerRef={containerRef}
      />
    </div>
  );
}
