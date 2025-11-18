/**
 * Genre + Location events page
 * Server component with dynamic metadata for combined genre and location filtering
 * Example: /calendar/events/music/location/miami-fl
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiteUrl } from '@/lib/seo-utils';
import { slugToGenreName, getGenreDisplayName, slugToLocation, getLocationDisplayName } from '../../../utils';
import GenreLocationContent from './genre-location-content';

interface GenreLocationPageProps {
  params: Promise<{ genre: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Generate dynamic metadata for genre + location pages
 */
export async function generateMetadata({ params }: GenreLocationPageProps): Promise<Metadata> {
  const { genre, slug } = await params;
  const genreName = slugToGenreName(genre);
  const location = slugToLocation(slug);

  if (!genreName || !location) {
    return { title: 'Not Found' };
  }

  const { city, state } = location;
  const genreDisplay = getGenreDisplayName(genreName);
  const locationDisplay = getLocationDisplayName(city, state);
  const siteUrl = getSiteUrl();

  return {
    title: `${genreDisplay} Events in ${locationDisplay} | CultureOwl`,
    description: `Discover ${genreDisplay.toLowerCase()} events, performances, and cultural experiences in ${city}, ${state}. Find concerts, shows, exhibitions, and more happening near you.`,
    keywords: [
      `${genreDisplay} events ${city}`,
      `${genreDisplay} ${city} ${state}`,
      `${city} ${genreDisplay.toLowerCase()}`,
      `events in ${city}`,
      `${genreDisplay} near me`,
      `cultural events ${city}`,
      `${genreDisplay} calendar ${city}`,
      `things to do ${city}`
    ],
    openGraph: {
      title: `${genreDisplay} Events in ${locationDisplay} | CultureOwl`,
      description: `Discover ${genreDisplay.toLowerCase()} events and cultural experiences in ${city}, ${state}`,
      url: `${siteUrl}/calendar/events/${genre}/location/${slug}`,
      siteName: 'CultureOwl',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${genreDisplay} Events in ${locationDisplay}`,
      description: `Discover ${genreDisplay.toLowerCase()} events in ${city}, ${state}`,
    },
    alternates: {
      canonical: `${siteUrl}/calendar/events/${genre}/location/${slug}`,
    },
  };
}

/**
 * Genre + Location events page
 */
export default async function GenreLocationEventsPage({ params, searchParams }: GenreLocationPageProps) {
  const { genre, slug } = await params;
  const genreName = slugToGenreName(genre);
  const location = slugToLocation(slug);

  if (!genreName || !location) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;

  return (
    <GenreLocationContent
      genreName={genreName}
      genreSlug={genre}
      location={location}
      searchParams={resolvedSearchParams}
    />
  );
}
