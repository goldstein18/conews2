'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DedicatedStats,
  DedicatedFilters,
  DedicatedTable,
  DedicatedSkeleton
} from './components';
import {
  useDedicatedData,
  useDedicatedFilters,
  useDedicatedSorting,
  useDedicatedActions
} from './hooks';
import { Dedicated, DedicatedStatus } from '@/types/dedicated';
import { sortDedicated, filterDedicatedBySearch } from './utils';

export default function DedicatedPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <DedicatedPageContent />
    </div>
  );
}

function DedicatedPageContent() {
  const router = useRouter();
  const { updateDedicatedStatus, deleteDedicated } = useDedicatedActions();

  // Filters and sorting
  const {
    filters,
    setSearchTerm,
    setStatus,
    setMarket,
    resetFilters,
    hasActiveFilters
  } = useDedicatedFilters();

  const { sortField, sortDirection, handleSort } = useDedicatedSorting();

  // Build GraphQL filter
  const graphqlFilter = useMemo(
    () => ({
      ...(filters.status !== 'ALL' && { status: filters.status as DedicatedStatus }),
      ...(filters.market && filters.market !== 'all' && { market: filters.market }),
      ...(filters.searchTerm && { searchTerm: filters.searchTerm })
    }),
    [filters.status, filters.market, filters.searchTerm]
  );

  // Fetch data
  const { dedicated, loading, error, refetch } = useDedicatedData({
    first: 100,
    filter: graphqlFilter,
    skip: false
  });

  // Client-side filtering and sorting
  const [filteredAndSortedDedicated, setFilteredAndSortedDedicated] = useState<Dedicated[]>([]);

  useEffect(() => {
    if (!dedicated || dedicated.length === 0) {
      setFilteredAndSortedDedicated([]);
      return;
    }

    let processed = [...dedicated];

    // Client-side search filter
    if (filters.searchTerm) {
      processed = filterDedicatedBySearch(processed, filters.searchTerm);
    }

    // Client-side sorting
    processed = sortDedicated(processed, sortField, sortDirection);

    setFilteredAndSortedDedicated(processed);
  }, [dedicated, filters.searchTerm, sortField, sortDirection]);

  // Handlers
  const handleEdit = (item: Dedicated) => {
    router.push(`/dashboard/dedicated/${item.id}/edit`);
  };

  const handleDelete = async (item: Dedicated) => {
    const success = await deleteDedicated(item.id);
    if (success) {
      refetch();
    }
  };

  const handleStatusChange = async (item: Dedicated, newStatus: DedicatedStatus) => {
    const result = await updateDedicatedStatus(item.id, newStatus);
    if (result) {
      refetch();
    }
  };

  const handleCreateNew = () => {
    router.push('/dashboard/dedicated/create');
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dedicated Campaigns</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage dedicated email campaigns with custom images
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Dedicated
        </Button>
      </div>

      {/* Stats */}
      <DedicatedStats onStatusFilter={setStatus} />

      {/* Filters */}
      <DedicatedFilters
        searchTerm={filters.searchTerm}
        status={filters.status}
        market={filters.market}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatus}
        onMarketChange={setMarket}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Table */}
      {loading ? (
        <DedicatedSkeleton />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load dedicated campaigns</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      ) : (
        <DedicatedTable
          dedicated={filteredAndSortedDedicated}
          loading={loading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Results Count */}
      {!loading && !error && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {filteredAndSortedDedicated.length} of {dedicated.length} campaigns
        </div>
      )}
    </>
  );
}
