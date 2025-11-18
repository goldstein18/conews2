/**
 * Event hero section component
 * Displays large event image with title overlay
 */

'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Video } from 'lucide-react';
import type { PublicEvent } from '@/types/public-events';
import { formatDateRange, getEventStatusLabel } from '../../../utils';

interface EventHeroProps {
  event: PublicEvent;
}

export function EventHero({ event }: EventHeroProps) {
  const imageUrl = event.bigImageUrl || event.mainImageUrl || '/images/event-placeholder.jpg';
  const statusLabel = getEventStatusLabel(event.startDate, event.endDate);

  return (
    <div className="relative w-full h-[60vh] min-h-[500px] max-h-[700px]">
      {/* Hero image */}
      <Image
        src={imageUrl}
        alt={event.title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
        <div className="container mx-auto max-w-6xl">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {statusLabel && (
              <Badge variant="default" className="bg-primary text-white">
                {statusLabel}
              </Badge>
            )}
            {event.free && (
              <Badge variant="secondary" className="bg-green-500 text-white gap-1.5">
                <DollarSign className="h-3.5 w-3.5" />
                Free Event
              </Badge>
            )}
            {event.virtual && (
              <Badge variant="secondary" className="bg-blue-500 text-white gap-1.5">
                <Video className="h-3.5 w-3.5" />
                Virtual Event
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {event.title}
          </h1>

          {/* Date and venue */}
          <div className="flex flex-wrap items-center gap-4 text-white/90 text-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{formatDateRange(event.startDate, event.endDate)}</span>
            </div>
            {event.venueName && (
              <>
                <span>•</span>
                <span>{event.venueName}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
