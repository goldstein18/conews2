'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProtectedPage } from '@/components/protected-page';
import {
  MarqueeStatsComponent,
  MarqueeFilters,
  MarqueeTable,
  MarqueeSkeleton,
} from './components';
import { useMarquees, useMarqueeStats, useMarqueeFilters } from './hooks';
import type { MarqueeStatus } from '@/types/marquee';

export default function MarqueePage() {
  return (
    <ProtectedPage requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
      <MarqueePageContent />
    </ProtectedPage>
  );
}

function MarqueePageContent() {
  const router = useRouter();
  const { filters, setSearch, setStatus, setMarket } = useMarqueeFilters();
  const [currentPage, setCurrentPage] = useState<string | null>(null);

  // Fetch marquees
  const {
    marquees,
    loading: marqueesLoading,
    pageInfo,
    totalCount,
    refetch: refetchMarquees,
  } = useMarquees({
    searchTerm: filters.search,
    status: filters.status,
    market: filters.market,
    first: 10,
    after: currentPage,
    includeTotalCount: true,
  });

  // Fetch stats
  const { stats, loading: statsLoading, refetch: refetchStats } = useMarqueeStats();

  const handleStatClick = (status?: string) => {
    if (status) {
      setStatus(status as MarqueeStatus);
    } else {
      setStatus(undefined);
    }
    setCurrentPage(null); // Reset pagination when filtering
  };

  const handleRefetch = () => {
    refetchMarquees();
    refetchStats();
  };

  const handleNextPage = () => {
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      setCurrentPage(pageInfo.endCursor);
    }
  };

  const handlePreviousPage = () => {
    // For cursor-based pagination, we need to implement a history of cursors
    // For now, we'll just reset to first page
    setCurrentPage(null);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(null);
  }, [filters.search, filters.status, filters.market]);

  const isLoading = marqueesLoading || statsLoading;

  if (isLoading && marquees.length === 0) {
    return <MarqueeSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Marquees</h1>
          <p className="text-sm text-muted-foreground">
            Manage marquee banners for your site
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/marquee/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Marquee
        </Button>
      </div>

      {/* Stats */}
      <MarqueeStatsComponent
        stats={stats}
        loading={statsLoading}
        onStatClick={handleStatClick}
      />

      {/* Filters */}
      <MarqueeFilters
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onMarketChange={setMarket}
        initialStatus={filters.status}
      />

      {/* Table */}
      <MarqueeTable
        marquees={marquees}
        loading={marqueesLoading}
        onRefetch={handleRefetch}
      />

      {/* Pagination */}
      {(pageInfo.hasNextPage || currentPage) && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {totalCount > 0 && `Showing ${marquees.length} of ${totalCount} marquees`}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!currentPage || marqueesLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!pageInfo.hasNextPage || marqueesLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
