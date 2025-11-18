/**
 * Event details component
 * Displays event information, description, venue, and tags
 */

'use client';

import Link from 'next/link';
import { MapPin, Calendar, Tag, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PublicEvent } from '@/types/public-events';
import { formatEventDateTime } from '../../../utils';

interface EventDetailsProps {
  event: PublicEvent;
}

export function EventDetails({ event }: EventDetailsProps) {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          {event.summary && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {event.summary}
              </p>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Event Description</h2>
              <div className="prose max-w-none text-gray-700">
                {event.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Event tags */}
          {event.eventTags && event.eventTags.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                {event.eventTags.map(({ tag }) => (
                  <Badge key={tag.id} variant="secondary" className="text-sm">
                    {tag.display || tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Date & Time Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Start</p>
                <p className="font-medium">{formatEventDateTime(event.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End</p>
                <p className="font-medium">{formatEventDateTime(event.endDate)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          {(event.venue || event.venueName) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {event.venue ? (
                  <>
                    <Link
                      href={`/venues/venue/${event.venue.id}`}
                      className="font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      {event.venue.name}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                    <p className="text-sm text-gray-600">
                      {event.venue.city}, {event.venue.state}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">{event.venueName}</p>
                    <p className="text-sm text-gray-600">
                      {event.city}, {event.state}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle>Admission</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={event.free ? 'default' : 'secondary'}
                className={event.free ? 'bg-green-500 text-white' : ''}
              >
                {event.free ? 'Free Event' : 'Paid Event'}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
