"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProtectedPage } from '@/components/protected-page';

import {
  EscoopStats,
  EscoopFilters,
  EscoopTable,
  EscoopListSkeleton
} from './components';
import {
  useEscoopsData,
  useEscoopsFilters,
  useDeleteEscoop
} from './hooks';
import {
  Escoop,
  EscoopSortField,
  EscoopSortDirection,
  EscoopStatus
} from '@/types/escoops';

export default function EscoopsPage() {
  return (
    <ProtectedPage
      requiredRoles={['SUPER_ADMIN', 'ADMIN']}
    >
      <EscoopsPageContent />
    </ProtectedPage>
  );
}

function EscoopsPageContent() {
  const router = useRouter();
  const [sortField, setSortField] = useState<EscoopSortField>(EscoopSortField.CREATED_AT);
  const [sortDirection, setSortDirection] = useState<EscoopSortDirection>(EscoopSortDirection.DESC);

  // Filters hook
  const {
    filters,
    updateFilter,
    clearFilters,
    graphqlFilter
  } = useEscoopsFilters();

  // Data hook
  const {
    escoops,
    pageInfo,
    totalCount,
    loading,
    error,
    nextPage,
    previousPage
  } = useEscoopsData({
    filter: graphqlFilter
  });

  // Actions hook
  const { deleteEscoop } = useDeleteEscoop();

  // Handle sorting
  const handleSort = (field: EscoopSortField) => {
    if (sortField === field) {
      setSortDirection(
        sortDirection === EscoopSortDirection.ASC
          ? EscoopSortDirection.DESC
          : EscoopSortDirection.ASC
      );
    } else {
      setSortField(field);
      setSortDirection(EscoopSortDirection.ASC);
    }
  };

  // Handle filter changes from stats
  const handleStatsFilterChange = (filter: { status?: EscoopStatus; sent?: boolean }) => {
    if (filter.status) {
      updateFilter('status', filter.status);
    }
    if (typeof filter.sent === 'boolean') {
      updateFilter('sent', filter.sent);
    }
  };

  // Handle actions
  const handleCreate = () => {
    router.push('/dashboard/escoops/create');
  };

  const handleEdit = (escoop: Escoop) => {
    router.push(`/dashboard/escoops/${escoop.id}/edit`);
  };

  const handleView = (escoop: Escoop) => {
    // Navigate to escoop builder page
    router.push(`/dashboard/escoops/${escoop.id}/builder`);
  };

  const handleDelete = async (escoop: Escoop) => {
    await deleteEscoop(escoop.id);
  };

  // Loading state
  if (loading && escoops.length === 0) {
    return <EscoopListSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Something went wrong</h3>
          <p className="text-sm text-muted-foreground">
            Failed to load escoops. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">escoop Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage your escoop campaigns and entries
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create escoop
        </Button>
      </div>

      {/* Stats */}
      <EscoopStats
        escoops={escoops}
        loading={loading}
        onFilterChange={handleStatsFilterChange}
      />

      {/* Filters */}
      <EscoopFilters
        search={filters.search}
        status={filters.status}
        market={filters.market}
        sent={filters.sent}
        onSearchChange={(search) => updateFilter('search', search)}
        onStatusChange={(status) => updateFilter('status', status)}
        onMarketChange={(market) => updateFilter('market', market)}
        onSentChange={(sent) => updateFilter('sent', sent)}
        onClearFilters={clearFilters}
      />

      {/* Table */}
      <EscoopTable
        escoops={escoops}
        loading={loading}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        totalCount={totalCount}
        hasNextPage={pageInfo?.hasNextPage || false}
        hasPreviousPage={pageInfo?.hasPreviousPage || false}
        onNextPage={nextPage}
        onPreviousPage={previousPage}
      />
    </div>
  );
}