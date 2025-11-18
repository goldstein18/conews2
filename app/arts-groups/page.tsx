/**
 * Arts Groups Directory Page
 * Main public directory for browsing arts groups
 */

'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  ArtsGroupDirectoryHeader,
  ArtsGroupGrid,
  ArtTypeFilters,
  ArtsGroupBreadcrumb,
  PaginationControls,
  ArtsGroupDirectorySkeleton,
} from './components';
import { usePublicArtsGroups, useArtsGroupFilters } from './hooks';

export default function ArtsGroupsDirectoryPage() {
  const { filters, setArtType, clearFilters, hasActiveFilters } = useArtsGroupFilters();

  const { artsGroups, loading, totalCount, hasNextPage, loadNextPage } = usePublicArtsGroups({
    filters,
    pageSize: 12,
  });

  if (loading && artsGroups.length === 0) {
    return <ArtsGroupDirectorySkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ArtsGroupBreadcrumb
        items={[
          { label: 'Arts Groups' }
        ]}
      />

      <ArtsGroupDirectoryHeader />

      {/* Filters Section */}
      <div className="space-y-4 mb-8 mt-8">
        {/* Art Type Filters */}
        <div>
          <h3 className="text-sm font-medium mb-2">Filter by Type</h3>
          <ArtTypeFilters
            selectedArtType={filters.artType}
            onArtTypeChange={setArtType}
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters() && (
          <div>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Results Grid */}
      <ArtsGroupGrid artsGroups={artsGroups} />

      {/* Pagination */}
      <PaginationControls
        hasNextPage={hasNextPage}
        onLoadMore={loadNextPage}
        loading={loading}
        currentCount={artsGroups.length}
        totalCount={totalCount}
      />
    </div>
  );
}
