/**
 * Event directory header component
 * Displays title, description, and global search with location dropdown
 * Uses Michelin Guide-style search for events and locations
 */

'use client';

import { GlobalSearch } from '@/components/search';
import { useEventSearch } from '@/hooks/use-event-search';
import { EVENT_SEARCH_CONFIG } from '@/lib/search-configs';

export function EventDirectoryHeader() {
  return (
    <div className="space-y-6">
      {/* Title section */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Event Directory
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover cultural events, performances, exhibitions, and festivals
        </p>
      </div>

      {/* Global Search with Location Dropdown */}
      <GlobalSearch
        config={EVENT_SEARCH_CONFIG}
        useSearch={useEventSearch}
        className="max-w-2xl"
      />
    </div>
  );
}
