/**
 * ArtsGroupDirectoryHeader Component
 * Header section for the arts groups directory page
 * Includes title, description, and global search with dropdown results
 */

'use client';

import { GlobalSearch } from '@/components/search';
import { useArtsGroupSearch } from '@/hooks/use-arts-group-search';
import { ARTS_GROUP_SEARCH_CONFIG } from '@/lib/search-configs';

export function ArtsGroupDirectoryHeader() {
  return (
    <div className="space-y-6">
      {/* Title section */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Arts Groups Directory
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover performing arts organizations, theater companies, and cultural groups
        </p>
      </div>

      {/* Global Search */}
      <GlobalSearch
        config={ARTS_GROUP_SEARCH_CONFIG}
        useSearch={useArtsGroupSearch}
        className="max-w-2xl"
      />
    </div>
  );
}
