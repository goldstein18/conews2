import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiteUrl } from '@/lib/seo-utils';
import { slugToLocation, getLocationDisplayName } from '../../utils';
import VenuesByLocationContent from './location-page-content';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate dynamic metadata for location-specific venue pages
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = slugToLocation(slug);

  // If invalid slug, return minimal metadata (404 will be shown)
  if (!location) {
    return {
      title: 'Location Not Found',
    };
  }

  const { city, state } = location;
  const locationName = getLocationDisplayName(city, state);
  const siteUrl = getSiteUrl();

  return {
    title: `Venues in ${locationName} | CultureOwl`,
    description: `Discover cultural venues, theaters, museums, galleries, and event spaces in ${city}, ${state}. Find the perfect venue for your next cultural experience in ${locationName}.`,
    keywords: [
      `${city} venues`,
      `${city} theaters`,
      `${city} museums`,
      `${city} art galleries`,
      `${city} cultural venues`,
      `${state} venues`,
      `venues in ${locationName}`,
      'cultural events',
      'performing arts',
    ],
    openGraph: {
      title: `Venues in ${locationName} | CultureOwl`,
      description: `Discover cultural venues, theaters, museums, and galleries in ${city}, ${state}.`,
      url: `${siteUrl}/venues/location/${slug}`,
      siteName: 'CultureOwl',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Venues in ${locationName} | CultureOwl`,
      description: `Discover cultural venues, theaters, museums, and galleries in ${city}, ${state}.`,
    },
    alternates: {
      canonical: `${siteUrl}/venues/location/${slug}`,
    },
  };
}

/**
 * Location-filtered venues page (SEO-friendly path-based URLs)
 * Example: /venues/location/miami-fl
 */
export default async function VenuesByLocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = slugToLocation(slug);

  // If invalid slug format, show 404
  if (!location) {
    notFound();
  }

  return <VenuesByLocationContent location={location} />;
}
