"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ArtsGroupsStats,
  ArtsGroupsFilters,
  ArtsGroupsTable,
  ArtsGroupsSkeleton
} from './components';
import {
  useArtsGroupsData,
  useArtsGroupsFilters,
  useArtsGroupsSorting,
  useArtsGroupActions
} from './hooks';
import { ArtsGroup, ArtsGroupStatus } from '@/types/arts-groups';
import { sortArtsGroups, filterArtsGroupsBySearch } from './utils/arts-group-helpers';

export default function ArtsGroupsPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <ArtsGroupsPageContent />
    </div>
  );
}

function ArtsGroupsPageContent() {
  const router = useRouter();
  const { updateArtsGroupStatus, deleteArtsGroup } = useArtsGroupActions();

  // Filters and sorting
  const {
    filters,
    setSearchTerm,
    setStatus,
    setMarket,
    setArtType,
    resetFilters,
    hasActiveFilters
  } = useArtsGroupsFilters();

  const { sortField, sortDirection, handleSort } = useArtsGroupsSorting();

  // Build GraphQL filter - memoized to prevent infinite re-renders
  const graphqlFilter = useMemo(
    () => ({
      ...(filters.status !== 'ALL' && { status: filters.status }),
      ...(filters.market && { market: filters.market }),
      ...(filters.artType && { artType: filters.artType }),
      ...(filters.searchTerm && { searchTerm: filters.searchTerm })
    }),
    [filters.status, filters.market, filters.artType, filters.searchTerm]
  );

  // Fetch data
  const { artsGroups, loading, error, refetch } = useArtsGroupsData({
    first: 100,
    filter: graphqlFilter,
    skip: false // Backend ready - fetch arts groups
  });

  // Client-side filtering and sorting
  const [filteredAndSortedGroups, setFilteredAndSortedGroups] = useState<ArtsGroup[]>([]);

  useEffect(() => {
    if (!artsGroups || artsGroups.length === 0) {
      setFilteredAndSortedGroups([]);
      return;
    }

    let processed = [...artsGroups];

    // Client-side search filter
    if (filters.searchTerm) {
      processed = filterArtsGroupsBySearch(processed, filters.searchTerm);
    }

    // Client-side sorting
    processed = sortArtsGroups(processed, sortField, sortDirection);

    setFilteredAndSortedGroups(processed);
  }, [artsGroups, filters.searchTerm, sortField, sortDirection]);

  // Handlers
  const handleEdit = (artsGroup: ArtsGroup) => {
    router.push(`/dashboard/arts-groups/${artsGroup.id}/edit`);
  };

  const handleDelete = async (artsGroup: ArtsGroup) => {
    const success = await deleteArtsGroup(artsGroup.id);
    if (success) {
      refetch();
    }
  };

  const handleStatusChange = async (artsGroup: ArtsGroup, newStatus: ArtsGroupStatus) => {
    const result = await updateArtsGroupStatus(artsGroup.id, newStatus);
    if (result) {
      refetch();
    }
  };

  const handleCreateNew = () => {
    router.push('/dashboard/arts-groups/create');
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Arts Groups Status</h1>
          <p className="text-muted-foreground mt-2">
            Manage arts group listings and approvals
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Arts Group
        </Button>
      </div>

      {/* Stats */}
      <ArtsGroupsStats onStatusFilter={setStatus} />

      {/* Filters */}
      <ArtsGroupsFilters
        searchTerm={filters.searchTerm}
        status={filters.status}
        market={filters.market}
        artType={filters.artType}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatus}
        onMarketChange={setMarket}
        onArtTypeChange={setArtType}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Table */}
      {loading ? (
        <ArtsGroupsSkeleton />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load arts groups</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      ) : (
        <ArtsGroupsTable
          artsGroups={filteredAndSortedGroups}
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
          Showing {filteredAndSortedGroups.length} of {artsGroups.length} arts groups
        </div>
      )}
    </>
  );
}
