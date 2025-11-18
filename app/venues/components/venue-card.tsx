'use client';

import type { PublicVenue } from '@/types/public-venues';
import { getVenueTypeDisplayName, getVenueTypeIcon } from '@/app/venues/utils';
import { DirectoryCard } from '@/components/directory';
import { DEFAULT_IMAGE } from '@/lib/constants/images';

interface VenueCardProps {
  venue: PublicVenue;
}

/**
 * Individual venue card with image hover zoom effect
 * Displays venue image, name, location, and type
 * Uses global DirectoryCard component for consistency
 */
export function VenueCard({ venue }: VenueCardProps) {
  const VenueTypeIcon = getVenueTypeIcon(venue.venueType);
  const venueTypeName = getVenueTypeDisplayName(venue.venueType);

  // Fallback to default owl image if no image provided
  const imageUrl = venue.imageUrl || DEFAULT_IMAGE;

  return (
    <DirectoryCard
      href={`/venues/venue/${venue.slug}`}
      imageUrl={imageUrl}
      title={venue.name}
      location={venue.city}
      badge={{
        icon: VenueTypeIcon,
        label: venueTypeName,
        variant: 'secondary',
      }}
      footer={
        venue.hostsPrivateEvents && (
          <p className="text-xs text-muted-foreground pt-1">
            Available for private events
          </p>
        )
      }
    />
  );
}
