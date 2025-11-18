/**
 * Event structured data component
 * Generates JSON-LD schemas for SEO (Event schema)
 */

'use client';

import { getSiteUrl } from '@/lib/seo-utils';
import type { PublicEvent } from '@/types/public-events';

interface EventStructuredDataProps {
  event: PublicEvent;
}

export function EventStructuredData({ event }: EventStructuredDataProps) {
  const siteUrl = getSiteUrl();

  // Event Schema
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${siteUrl}/calendar/events/event/${event.slug}#event`,
    name: event.title,
    description: event.summary || event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.virtual
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    image: event.bigImageUrl || event.mainImageUrl,
    url: `${siteUrl}/calendar/events/event/${event.slug}`,
    ...(event.venue && {
      location: {
        '@type': 'Place',
        name: event.venue.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: event.venue.city,
          addressRegion: event.venue.state,
          addressCountry: 'US'
        }
      }
    }),
    ...(event.venueName && !event.venue && {
      location: {
        '@type': 'Place',
        name: event.venueName,
        address: {
          '@type': 'PostalAddress',
          addressLocality: event.city,
          addressRegion: event.state,
          addressCountry: 'US'
        }
      }
    }),
    offers: {
      '@type': 'Offer',
      price: event.free ? '0' : undefined,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/calendar/events/event/${event.slug}`
    },
    organizer: {
      '@type': 'Organization',
      name: 'CultureOwl',
      url: siteUrl
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
    />
  );
}
