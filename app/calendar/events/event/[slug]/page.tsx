/**
 * Event detail page
 * Server component that generates dynamic metadata for SEO
 */

import { Metadata } from 'next';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { PUBLIC_EVENT } from '@/lib/graphql/public-events';
import { PublicEventResponse, PublicEventVariables } from '@/types/public-events';
import { getSiteUrl } from '@/lib/seo-utils';
import EventDetailContent from './event-detail-content';

interface EventDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Fetch event data for metadata generation (server-side)
 */
async function getEventData(slug: string) {
  const siteUrl = getSiteUrl();

  try {
    const client = new ApolloClient({
      uri: `${siteUrl}/api/graphql`,
      cache: new InMemoryCache(),
    });

    const { data } = await client.query<PublicEventResponse, PublicEventVariables>({
      query: PUBLIC_EVENT,
      variables: { identifier: slug },
    });

    return data.publicEvent;
  } catch (error) {
    console.error('Error fetching event for metadata:', error);
    return null;
  }
}

/**
 * Generate dynamic metadata for event detail pages
 */
export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventData(slug);
  const siteUrl = getSiteUrl();

  // If event not found, return minimal metadata
  if (!event) {
    return {
      title: 'Event Not Found | CultureOwl',
      description: 'The event you are looking for could not be found.',
    };
  }

  const title = `${event.title} | CultureOwl`;
  const description =
    event.summary ||
    event.description ||
    `Join us for ${event.title} in ${event.city}, ${event.state}. ${event.free ? 'Free event.' : ''} ${event.virtual ? 'Virtual event.' : ''}`;

  const imageUrl = event.bigImageUrl || event.mainImageUrl || `${siteUrl}/images/default-event.jpg`;

  return {
    title,
    description,
    keywords: [
      event.title,
      `${event.title} ${event.city}`,
      `events in ${event.city}`,
      event.venueName || '',
      event.city,
      event.state,
      'cultural event',
      event.free ? 'free event' : '',
      event.virtual ? 'virtual event' : '',
      ...event.eventTags.map(({ tag }) => tag.display || tag.name)
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      url: `${siteUrl}/calendar/events/event/${event.slug}`,
      siteName: 'CultureOwl',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${siteUrl}/calendar/events/event/${event.slug}`,
    },
  };
}

/**
 * Event detail page
 * Server component that generates metadata and renders client content
 */
export default async function EventDetailPage({ params }: EventDetailPageProps) {
  return <EventDetailContent params={params} />;
}
