/**
 * Event grid layout component
 * Displays events in a responsive grid with empty state
 */

'use client';

import type { PublicEventEdge } from '@/types/public-events';
import { EventCard } from './event-card';

interface EventGridProps {
  events: PublicEventEdge[];
}

export function EventGrid({ events }: EventGridProps) {
  // Empty state
  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
          <span className="text-4xl">📅</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Events Found
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We couldn&apos;t find any events matching your criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {events.map(({ node: event, cursor }) => (
        <EventCard key={`${event.id}-${cursor}`} event={event} />
      ))}
    </div>
  );
}
