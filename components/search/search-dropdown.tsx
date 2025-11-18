'use client';

import { useEffect, useRef } from 'react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchLocationItem } from './search-location-item';
import { SearchEntityItem } from './search-entity-item';
import type { SearchResults, SearchLocation, SearchEntity, ModuleSearchConfig } from '@/types/search';

interface SearchDropdownProps<T extends SearchEntity = SearchEntity> {
  config: ModuleSearchConfig<T>;
  results: SearchResults<T>;
  loading: boolean;
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onLocationClick: (location: SearchLocation) => void;
  onEntityClick: (entity: T) => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

/**
 * Generic dropdown component that displays search results
 * Works with any entity type (venues, restaurants, arts groups, etc.)
 * Includes click-outside and ESC key handling
 */
export function SearchDropdown<T extends SearchEntity>({
  config,
  results,
  loading,
  query,
  isOpen,
  onClose,
  onLocationClick,
  onEntityClick,
  containerRef
}: SearchDropdownProps<T>) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both dropdown and container (input)
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        containerRef?.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Add event listener after a short delay to avoid immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, containerRef]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Don't show dropdown if query is too short
  if (query.length < 2) return null;

  const hasLocations = results.locations.length > 0;
  const hasEntities = results.entities.length > 0;
  const hasResults = hasLocations || hasEntities;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 overflow-hidden"
    >
      <ScrollArea className="max-h-[400px]">
        {/* Loading state */}
        {loading && (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && hasResults && (
          <div className="py-2">
            {/* Locations section */}
            {hasLocations && (
              <div>
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Locations
                  </h3>
                </div>
                <div>
                  {results.locations.map((location, index) => (
                    <SearchLocationItem
                      key={`${location.city}-${location.state}-${index}`}
                      location={location}
                      entityLabel={config.entityLabel.toLowerCase()}
                      onClick={(loc) => {
                        onLocationClick(loc);
                        onClose();
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Separator between sections */}
            {hasLocations && hasEntities && (
              <Separator className="my-2" />
            )}

            {/* Entities section (generic) */}
            {hasEntities && (
              <div>
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {config.entityLabel}
                  </h3>
                </div>
                <div>
                  {results.entities.map((entity) => (
                    <SearchEntityItem
                      key={entity.slug}
                      entity={entity}
                      config={config}
                      onClick={(e) => {
                        onEntityClick(e);
                        onClose();
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!loading && !hasResults && (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No {config.entityLabel.toLowerCase()} or locations found for &quot;{query}&quot;
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Try a different search term
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
