/**
 * Genre-specific filters component
 * Includes date filter and subgenre selector (NO virtual toggle)
 */

'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { DateFilterDropdown } from '@/app/calendar/events/components/date-filter-dropdown';
import { SubgenreSelector } from '@/app/calendar/events/components/subgenre-selector';
import { useQuery } from '@apollo/client';
import { GET_SUBGENRES } from '@/lib/graphql/tags';
import type { DateFilterType } from '@/types/public-events';
import type { SubgenresResponse, SubgenresVariables } from '@/types/genres';
import { useMemo } from 'react';

interface GenreFiltersProps {
  // Date filter
  selectedDateFilter: DateFilterType;
  onDateFilterChange: (filter: DateFilterType) => void;

  // Subgenre filter
  selectedTagNames: string[];
  onTagNamesChange: (tagNames: string[]) => void;

  // Main genre context
  mainGenreName: string;

  // Clear filters
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function GenreFilters({
  selectedDateFilter,
  onDateFilterChange,
  selectedTagNames,
  onTagNamesChange,
  mainGenreName,
  hasActiveFilters,
  onClearFilters
}: GenreFiltersProps) {
  // Query for subgenres (filtered by main genre name)
  const {
    data: subgenresData,
    loading: subgenresLoading
  } = useQuery<SubgenresResponse, SubgenresVariables>(GET_SUBGENRES, {
    variables: {
      mainGenre: mainGenreName.toUpperCase()
    },
    fetchPolicy: 'cache-first'
  });

  const subgenres = useMemo(() => {
    return subgenresData?.subgenres || [];
  }, [subgenresData]);

  const handleToggleSubgenre = (subgenreId: string) => {
    const isSelected = selectedTagNames.includes(subgenreId);
    if (isSelected) {
      onTagNamesChange(selectedTagNames.filter(id => id !== subgenreId));
    } else {
      onTagNamesChange([...selectedTagNames, subgenreId]);
    }
  };

  const handleClearSubgenres = () => {
    onTagNamesChange([]);
  };

  return (
    <div className="space-y-4">
      {/* Date filter */}
      <div className="flex items-center gap-4">
        <DateFilterDropdown
          selectedDateFilter={selectedDateFilter}
          onDateFilterChange={onDateFilterChange}
        />
      </div>

      {/* Subgenre selector */}
      <SubgenreSelector
        subgenres={subgenres}
        selectedSubgenres={selectedTagNames}
        onToggleSubgenre={handleToggleSubgenre}
        onClearSubgenres={handleClearSubgenres}
        loading={subgenresLoading}
      />

      {/* Clear filters button */}
      {hasActiveFilters && (
        <div className="flex items-center justify-end pb-4 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
