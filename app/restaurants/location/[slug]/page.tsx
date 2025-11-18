import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiteUrl } from '@/lib/seo-utils';
import { slugToLocation, getLocationDisplayName } from '../../utils';
import RestaurantsByLocationContent from './location-page-content';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate dynamic metadata for location-specific restaurant pages
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
    title: `Restaurants in ${locationName} | CultureOwl`,
    description: `Discover the best restaurants, dining experiences, and culinary options in ${city}, ${state}. From casual eateries to fine dining, find your perfect meal in ${locationName}.`,
    keywords: [
      `${city} restaurants`,
      `${city} dining`,
      `${city} food`,
      `${city} cuisine`,
      `restaurants in ${locationName}`,
      `where to eat ${city}`,
      `${state} restaurants`,
      `${city} fine dining`,
      `${city} casual dining`,
      'restaurant directory',
    ],
    openGraph: {
      title: `Restaurants in ${locationName} | CultureOwl`,
      description: `Discover the best restaurants and dining experiences in ${city}, ${state}.`,
      url: `${siteUrl}/restaurants/location/${slug}`,
      siteName: 'CultureOwl',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Restaurants in ${locationName} | CultureOwl`,
      description: `Discover the best restaurants and dining experiences in ${city}, ${state}.`,
    },
    alternates: {
      canonical: `${siteUrl}/restaurants/location/${slug}`,
    },
  };
}

/**
 * Location-filtered restaurants page (SEO-friendly path-based URLs)
 * Example: /restaurants/location/miami-fl
 */
export default async function RestaurantsByLocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = slugToLocation(slug);

  // If invalid slug format, show 404
  if (!location) {
    notFound();
  }

  return <RestaurantsByLocationContent location={location} />;
}
