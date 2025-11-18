/**
 * Generic Search Entity Item Component
 * Renders a single search result item for any entity type
 * Used in SearchDropdown component
 */

'use client';

import { Badge } from '@/components/ui/badge';
import type { SearchEntity, ModuleSearchConfig, SearchVenue, SearchRestaurant, SearchArtsGroup, SearchEvent } from '@/types/search';
import { PRICE_RANGE_LABELS } from '@/types/public-restaurants';

interface SearchEntityItemProps<T extends SearchEntity = SearchEntity> {
  entity: T;
  config: ModuleSearchConfig<T>;
  onClick: (entity: T) => void;
  isHighlighted?: boolean;
}

/**
 * Render badge based on entity type
 * Uses type guards to determine correct badge content
 */
function renderEntityBadge(entity: SearchEntity, module: string): React.ReactNode {
  // Venue badge
  if (module === 'venues' && 'venueType' in entity) {
    const venue = entity as SearchVenue;
    return (
      <Badge variant="outline" className="text-xs">
        {venue.venueType}
      </Badge>
    );
  }

  // Restaurant badge
  if (module === 'restaurants' && 'priceRange' in entity) {
    const restaurant = entity as SearchRestaurant;
    return (
      <Badge variant="outline" className="text-xs">
        {PRICE_RANGE_LABELS[restaurant.priceRange]}
      </Badge>
    );
  }

  // Arts Group badge
  if (module === 'arts-groups' && 'artType' in entity) {
    const artsGroup = entity as SearchArtsGroup;
    if (artsGroup.artType) {
      return (
        <Badge variant="outline" className="text-xs">
          {artsGroup.artType}
        </Badge>
      );
    }
  }

  // Event badge - Show event date
  if (module === 'events' && 'startDate' in entity) {
    const event = entity as SearchEvent;
    const date = new Date(event.startDate);
    return (
      <Badge variant="outline" className="text-xs">
        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </Badge>
    );
  }

  return null;
}

/**
 * Generic search result item for any entity
 * Displays entity name, location, icon, and module-specific badge
 */
export function SearchEntityItem<T extends SearchEntity>({
  entity,
  config,
  onClick,
  isHighlighted = false
}: SearchEntityItemProps<T>) {
  const IconComponent = config.icon;

  return (
    <button
      onClick={() => onClick(entity)}
      className={`
        w-full flex items-start gap-3 px-4 py-3
        text-left transition-colors
        hover:bg-accent hover:text-accent-foreground
        ${isHighlighted ? 'bg-accent text-accent-foreground' : ''}
      `}
      type="button"
    >
      {/* Entity icon/image placeholder */}
      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-muted flex items-center justify-center">
        <IconComponent className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Entity details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <h4 className="font-medium text-sm truncate flex-1">
            {'title' in entity ? (entity as unknown as SearchEvent).title : entity.name}
          </h4>
          {renderEntityBadge(entity, config.module)}
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {config.module === 'events' && 'venue' in entity && (entity as unknown as SearchEvent).venue?.city && (entity as unknown as SearchEvent).venue?.state
            ? `${(entity as unknown as SearchEvent).venue!.city}, ${(entity as unknown as SearchEvent).venue!.state}`
            : `${entity.city}, ${entity.state}`
          }
        </p>
      </div>
    </button>
  );
}
