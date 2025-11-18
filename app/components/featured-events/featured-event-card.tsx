/**
 * Featured Event Card Component
 * Reuses DirectoryCard for consistency with EventCard design
 * Displays event in carousel with image, title, date badge, and venue
 */

'use client';

import { Calendar, DollarSign, Video } from 'lucide-react';
import type { PublicEvent } from '@/types/public-events';
import { DirectoryCard } from '@/components/directory';
import { getEventDatesBadgeText } from '@/app/calendar/events/utils';
import { DEFAULT_IMAGE } from '@/lib/constants/images';

interface FeaturedEventCardProps {
  event: PublicEvent;
}

export function FeaturedEventCard({ event }: FeaturedEventCardProps) {
  // Use bigImageUrl or mainImageUrl with fallback to default owl image
  const imageUrl = event.bigImageUrl || event.mainImageUrl || DEFAULT_IMAGE;

  // Location for overlay - prioritize venue location, then fallback to inline location
  const getLocationText = () => {
    // 1. Priorizar venue location si existe
    if (event.venue?.city && event.venue?.state) {
      return `${event.venue.city}, ${event.venue.state}`;
    }

    // 2. Fallback a inline location completa
    if (event.city && event.state) {
      return `${event.city}, ${event.state}`;
    }

    // 3. Fallback parcial (solo ciudad si no hay estado)
    if (event.city) {
      return event.city;
    }

    // 4. Último recurso
    return 'Location TBA';
  };

  const location = getLocationText();

  // Primary badge: Date
  const dateLabel = getEventDatesBadgeText(event.eventDates, event.startDate);
  const dateBadge = {
    icon: Calendar,
    label: dateLabel,
    variant: 'secondary' as const
  };

  // Secondary badge: Free or Virtual
  const secondaryBadge = event.free
    ? {
        icon: DollarSign,
        label: 'Free',
        variant: 'outline' as const,
        className: 'bg-green-50 text-green-700 border-green-200'
      }
    : event.virtual
    ? {
        icon: Video,
        label: 'Virtual',
        variant: 'outline' as const,
        className: 'bg-blue-50 text-blue-700 border-blue-200'
      }
    : undefined;

  // Optional description (summary or truncated description)
  const description = event.summary || event.description;

  return (
    <DirectoryCard
      href={`/calendar/events/event/${event.slug}`}
      imageUrl={imageUrl}
      title={event.title}
      location={location}
      badge={dateBadge}
      secondaryBadge={secondaryBadge}
      description={description}
    />
  );
}
