/**
 * Individual event card component
 * Uses global DirectoryCard component for consistency
 * Displays event image, title, date badge, and venue information
 * Shows "+" symbol for events with multiple dates
 */

'use client';

import { Calendar, DollarSign, Video } from 'lucide-react';
import type { PublicEvent } from '@/types/public-events';
import { DirectoryCard } from '@/components/directory';
import { getEventDatesBadgeText } from '../utils';
import { DEFAULT_IMAGE } from '@/lib/constants/images';

interface EventCardProps {
  event: PublicEvent;
}

export function EventCard({ event }: EventCardProps) {
  // Use bigImageUrl or mainImageUrl with fallback to default owl image
  const imageUrl = event.bigImageUrl || event.mainImageUrl || DEFAULT_IMAGE;

  // Location for overlay - prioritize venue location, then fallback to inline location
  // Logic matches backend's globalEventsSearch location prioritization
  const getLocationText = () => {
    // 1. Priorizar venue location si existe (consistente con backend)
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
  // Shows "+" symbol if event has multiple dates (e.g., "Dec 12 +" or "Today +")
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
