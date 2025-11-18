/**
 * Event filters component
 * Genre filters, date filters, virtual toggle, and clear filters button
 */

'use client';

import { X, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { EventGenreFilters } from './event-genre-filters';
import type { DateFilterType } from '@/types/public-events';

interface EventFiltersProps {
  selectedDateFilter: DateFilterType;
  onDateFilterChange: (filter: DateFilterType) => void;
  selectedTagNames: string[];  // Changed from selectedTagIds (kept for prop validation)
  onTagNamesChange: (tagNames: string[]) => void;  // Changed from onTagIdsChange
  virtual: boolean;
  onVirtualChange: (virtual: boolean) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;

  // New props for routing context
  initialGenreName?: string;
  initialSubgenreSlugs?: string[];
  enableRouting?: boolean;
  genreContext?: string;
  locationContext?: { city: string; state: string };
}

export function EventFilters({
  selectedDateFilter,
  onDateFilterChange,
  onTagNamesChange,
  virtual,
  onVirtualChange,
  hasActiveFilters,
  onClearFilters,
  initialGenreName,
  enableRouting,
  locationContext
}: EventFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Genre filters (date + main genres + subgenres) */}
      <EventGenreFilters
        selectedDateFilter={selectedDateFilter}
        onDateFilterChange={onDateFilterChange}
        onTagNamesChange={onTagNamesChange}
        initialGenreName={initialGenreName}
        enableRouting={enableRouting}
        locationContext={locationContext}
      />

      {/* Virtual toggle and clear filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b">
        {/* Virtual events toggle */}
        <div className="flex items-center space-x-3">
          <Switch
            id="virtual-toggle"
            checked={virtual}
            onCheckedChange={onVirtualChange}
          />
          <Label
            htmlFor="virtual-toggle"
            className="flex items-center gap-2 text-sm font-medium cursor-pointer"
          >
            <Video className="h-4 w-4" />
            Virtual Events Only
          </Label>
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
