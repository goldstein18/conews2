'use client';

import { useState, useRef, useEffect } from 'react';
import { SearchInput } from './search-input';
import { SearchLocationItem } from './search-location-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import type { SearchLocation } from '@/types/search';

interface LocationSearchProps {
  /**
   * Hook that returns location search results
   */
  useSearch: (query: string, market?: string) => {
    locations: SearchLocation[];
    loading: boolean;
    query: string;
  };
  /**
   * Callback when a location is selected
   */
  onLocationSelect: (location: SearchLocation) => void;
  /**
   * Optional market filter to scope search results
   */
  market?: string;
  /**
   * Search input placeholder text
   */
  placeholder?: string;
  /**
   * Optional className for container
   */
  className?: string;
}

/**
 * Location-only search component
 * Searches for cities/states with events
 * Displays results in a dropdown
 * No entity results - focused on location search only
 */
export function LocationSearch({
  useSearch,
  onLocationSelect,
  market,
  placeholder = 'Search locations...',
  className = ''
}: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use the location search hook
  const { locations, loading } = useSearch(query, market);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleLocationClick = (location: SearchLocation) => {
    onLocationSelect(location);
    setIsOpen(false);
    setQuery('');
  };

  const handleInputFocus = () => {
    if (query.length >= 2) {
      setIsOpen(true);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const hasLocations = locations.length > 0;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <SearchInput
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
      />

      {/* Dropdown with locations only */}
      {isOpen && query.length >= 2 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 overflow-hidden"
        >
          <ScrollArea className="max-h-[300px]">
            {/* Loading state */}
            {loading && (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Locations */}
            {!loading && hasLocations && (
              <div className="py-2">
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Locations with Events
                  </h3>
                </div>
                <div>
                  {locations.map((location, index) => (
                    <SearchLocationItem
                      key={`${location.city}-${location.state}-${index}`}
                      location={location}
                      entityLabel="events"
                      onClick={handleLocationClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && !hasLocations && (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No locations found for &quot;{query}&quot;
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Try searching for a city name
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
