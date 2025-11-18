/**
 * ArtTypeFilters Component
 * Filter buttons for filtering arts groups by art type
 */

'use client';

import { Button } from '@/components/ui/button';
import { getAllArtTypes } from '../utils';

interface ArtTypeFiltersProps {
  selectedArtType?: string;
  onArtTypeChange: (artType: string | undefined) => void;
}

export function ArtTypeFilters({ selectedArtType, onArtTypeChange }: ArtTypeFiltersProps) {
  const artTypes = getAllArtTypes();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={!selectedArtType ? 'default' : 'outline'}
        size="sm"
        onClick={() => onArtTypeChange(undefined)}
      >
        All Types
      </Button>

      {artTypes.map((artType) => {
        const Icon = artType.icon;
        const isSelected = selectedArtType === artType.value;

        return (
          <Button
            key={artType.value}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onArtTypeChange(artType.value)}
          >
            <Icon className="h-4 w-4 mr-1.5" />
            {artType.label}
          </Button>
        );
      })}
    </div>
  );
}
