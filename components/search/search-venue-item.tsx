'use client';

import { Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { SearchVenue } from '@/types/search';

interface SearchVenueItemProps {
  venue: SearchVenue;
  onClick: (venue: SearchVenue) => void;
  isHighlighted?: boolean;
}

/**
 * Search result item for venues
 * Shows venue name, location, and optional type badge
 */
export function SearchVenueItem({
  venue,
  onClick,
  isHighlighted = false
}: SearchVenueItemProps) {
  return (
    <button
      onClick={() => onClick(venue)}
      className={`
        w-full flex items-start gap-3 px-4 py-3
        text-left transition-colors
        hover:bg-accent hover:text-accent-foreground
        ${isHighlighted ? 'bg-accent text-accent-foreground' : ''}
      `}
      type="button"
    >
      {/* Venue icon/image placeholder */}
      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-muted flex items-center justify-center">
        <Building2 className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Venue details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <h4 className="font-medium text-sm truncate flex-1">
            {venue.name}
          </h4>
          {venue.venueType && (
            <Badge variant="outline" className="flex-shrink-0 text-xs">
              {venue.venueType}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {venue.city}, {venue.state}
        </p>
      </div>
    </button>
  );
}
