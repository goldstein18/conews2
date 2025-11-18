'use client';

import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { SearchLocation } from '@/types/search';

interface SearchLocationItemProps {
  location: SearchLocation;
  onClick: (location: SearchLocation) => void;
  isHighlighted?: boolean;
  entityLabel?: string; // "venues", "events", "restaurants", etc.
}

/**
 * Search result item for locations
 * Shows city/state with entity count badge
 * Dynamically shows the correct label based on module (venues, events, etc.)
 */
export function SearchLocationItem({
  location,
  onClick,
  isHighlighted = false,
  entityLabel = 'venues' // Default to venues for backward compatibility
}: SearchLocationItemProps) {
  // Determine the count and singular/plural form
  // Support both venueCount and eventCount for different modules
  const count = location.eventCount || location.venueCount || 0;
  const singularLabel = entityLabel.slice(0, -1); // Remove 's' for singular (venues -> venue, events -> event)
  const countLabel = count === 1 ? singularLabel : entityLabel;

  return (
    <button
      onClick={() => onClick(location)}
      className={`
        w-full flex items-center justify-between px-4 py-3
        text-left transition-colors
        hover:bg-accent hover:text-accent-foreground
        ${isHighlighted ? 'bg-accent text-accent-foreground' : ''}
      `}
      type="button"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-sm truncate">
            {location.city}, {location.state}
          </span>
        </div>
      </div>
      <Badge variant="secondary" className="ml-2 flex-shrink-0">
        {count} {countLabel}
      </Badge>
    </button>
  );
}
