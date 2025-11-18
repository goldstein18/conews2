/**
 * Genre Event Card Component
 * Displays a single event card within a genre carousel
 * Reuses DirectoryCard component for consistent styling
 */

'use client';

import { Calendar, DollarSign, Video } from 'lucide-react';
import { DirectoryCard } from '@/components/directory/directory-card';
import { getEventDatesBadgeText } from '@/app/calendar/events/utils/date-helpers';
import type { PublicEvent } from '@/types/public-events';
import { DEFAULT_IMAGE } from '@/lib/constants/images';

interface GenreEventCardProps {
  event: PublicEvent;
}

export function GenreEventCard({ event }: GenreEventCardProps) {
  // Use bigImageUrl or mainImageUrl with fallback to default owl image
  const imageUrl = event.bigImageUrl || event.mainImageUrl || DEFAULT_IMAGE;

  // Location for overlay - prioritize venue location, then fallback to inline location
  const getLocationText = () => {
    // 1. Prioritize venue location if exists
    if (event.venue?.city && event.venue?.state) {
      return `${event.venue.city}, ${event.venue.state}`;
    }

    // 2. Fallback to inline location
    if (event.city && event.state) {
      return `${event.city}, ${event.state}`;
    }

    // 3. Partial fallback (only city if no state)
    if (event.city) {
      return event.city;
    }

    // 4. Last resort
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
