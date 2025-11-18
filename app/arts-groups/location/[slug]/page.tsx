/**
 * Arts Groups by Location Page (Server Component)
 * Dynamic page for viewing arts groups filtered by location
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiteUrl } from '@/lib/seo-utils';
import { slugToLocation, getLocationDisplayName } from '../../utils';
import ArtsGroupsByLocationContent from './location-page-content';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = slugToLocation(slug);

  if (!location) {
    return {
      title: 'Location Not Found | CultureOwl',
    };
  }

  const { city, state } = location;
  const locationName = getLocationDisplayName(city, state);
  const siteUrl = getSiteUrl();

  return {
    title: `Arts Groups in ${locationName} | CultureOwl`,
    description: `Discover performing arts groups in ${city}, ${state}. Find theater companies, dance troupes, orchestras, opera companies, and more cultural organizations near you.`,
    keywords: [
      `${city} arts groups`,
      `${city} performing arts`,
      `${city} theater`,
      `${city} dance`,
      `${city} orchestra`,
      `${state} arts organizations`,
      `performing arts ${locationName}`,
    ],
    openGraph: {
      title: `Arts Groups in ${locationName} | CultureOwl`,
      description: `Discover performing arts groups in ${city}, ${state}. Find theater companies, dance troupes, orchestras, and more.`,
      url: `${siteUrl}/arts-groups/location/${slug}`,
      siteName: 'CultureOwl',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Arts Groups in ${locationName} | CultureOwl`,
      description: `Discover performing arts groups in ${city}, ${state}.`,
    },
    alternates: {
      canonical: `${siteUrl}/arts-groups/location/${slug}`,
    },
  };
}

export default async function ArtsGroupsByLocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = slugToLocation(slug);

  if (!location) {
    notFound();
  }

  return <ArtsGroupsByLocationContent location={location} />;
}
