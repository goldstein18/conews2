/**
 * Location-based events page
 * Server component with dynamic metadata for location-specific event listings
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiteUrl } from '@/lib/seo-utils';
import { slugToLocation, getLocationDisplayName } from '../../utils';
import LocationPageContent from './location-page-content';

interface LocationPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate dynamic metadata for location pages
 */
export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = slugToLocation(slug);

  if (!location) {
    return { title: 'Location Not Found' };
  }

  const { city, state } = location;
  const locationName = getLocationDisplayName(city, state);
  const siteUrl = getSiteUrl();

  return {
    title: `Events in ${locationName} | CultureOwl`,
    description: `Discover cultural events, performances, exhibitions, and festivals happening in ${city}, ${state}. Find free events, virtual events, and more.`,
    keywords: [
      `${city} events`,
      `events in ${city}`,
      `${city} ${state} events`,
      `cultural events ${city}`,
      `things to do ${city}`,
      'art events',
      'performances',
      'exhibitions'
    ],
    openGraph: {
      title: `Events in ${locationName} | CultureOwl`,
      description: `Discover cultural events happening in ${city}, ${state}`,
      url: `${siteUrl}/calendar/events/location/${slug}`,
      siteName: 'CultureOwl',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Events in ${locationName} | CultureOwl`,
      description: `Discover cultural events happening in ${city}, ${state}`,
    },
    alternates: {
      canonical: `${siteUrl}/calendar/events/location/${slug}`,
    },
  };
}

/**
 * Location-based events page
 */
export default async function LocationEventsPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const location = slugToLocation(slug);

  if (!location) {
    notFound();
  }

  return <LocationPageContent location={location} />;
}
