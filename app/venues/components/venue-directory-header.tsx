'use client';

import { GlobalSearch } from '@/components/search';
import { useVenueSearch } from '@/hooks/use-venue-search';
import { VENUE_SEARCH_CONFIG } from '@/lib/search-configs';

/**
 * Header section with title and global search
 * Uses Michelin Guide-style search for venues and locations
 */
export function VenueDirectoryHeader() {
  return (
    <div className="space-y-6">
      {/* Title section */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Venue Directory
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover cultural venues, theaters, museums, and event spaces
        </p>
      </div>

      {/* Global Search */}
      <GlobalSearch
        config={VENUE_SEARCH_CONFIG}
        useSearch={useVenueSearch}
        className="max-w-2xl"
      />
    </div>
  );
}
