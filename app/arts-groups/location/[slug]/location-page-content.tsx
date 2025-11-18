/**
 * Arts Groups by Location Content (Client Component)
 * Client-side content for location-filtered arts groups
 */

'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import {
  ArtsGroupGrid,
  ArtTypeFilters,
  ArtsGroupBreadcrumb,
  PaginationControls,
  ArtsGroupDirectorySkeleton,
} from '../../components';
import { usePublicArtsGroups, useArtsGroupFilters } from '../../hooks';
import { getLocationDisplayName } from '../../utils';

interface ArtsGroupsByLocationContentProps {
  location: {
    city: string;
    state: string;
  };
}

export default function ArtsGroupsByLocationContent({ location }: ArtsGroupsByLocationContentProps) {
  const { city, state } = location;
  const locationName = getLocationDisplayName(city, state);

  const { filters, setSearch, setArtType, setLocation, clearFilters, hasActiveFilters } = useArtsGroupFilters();
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Set location filter on mount
  useEffect(() => {
    setLocation(city, state);
  }, [city, state, setLocation]);

  const { artsGroups, loading, totalCount, hasNextPage, loadNextPage } = usePublicArtsGroups({
    filters,
    pageSize: 12,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
  };

  const handleClearFilters = () => {
    setSearchInput('');
    clearFilters();
    setLocation(city, state); // Keep location filter
  };

  if (loading && artsGroups.length === 0) {
    return <ArtsGroupDirectorySkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ArtsGroupBreadcrumb
        items={[
          { label: 'Arts Groups', href: '/arts-groups' },
          { label: locationName },
        ]}
      />

      {/* Location Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <MapPin className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Arts Groups in {locationName}
            </h1>
            {totalCount !== undefined && (
              <p className="text-muted-foreground mt-1">
                {totalCount.toLocaleString()} {totalCount === 1 ? 'organization' : 'organizations'} found
              </p>
            )}
          </div>
        </div>

        <p className="text-lg text-muted-foreground max-w-3xl">
          Explore theater companies, dance troupes, orchestras, opera companies, and more
          cultural organizations in {city}.
        </p>
      </div>

      {/* Filters Section */}
      <div className="space-y-4 mb-8">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search arts groups..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="submit">Search</Button>
        </form>

        {/* Art Type Filters */}
        <div>
          <h3 className="text-sm font-medium mb-2">Filter by Type</h3>
          <ArtTypeFilters
            selectedArtType={filters.artType}
            onArtTypeChange={setArtType}
          />
        </div>

        {/* Clear Filters */}
        {(hasActiveFilters() && (filters.search || filters.artType)) && (
          <div>
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear Search & Filters
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
