/**
 * Genre-specific events page
 * Server component with dynamic metadata for genre-based event listings
 * Example: /calendar/events/music
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiteUrl } from '@/lib/seo-utils';
import { slugToGenreName, getGenreDisplayName } from '../utils';
import GenrePageContent from './genre-page-content';

interface GenrePageProps {
  params: Promise<{ genre: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Generate dynamic metadata for genre pages
 */
export async function generateMetadata({ params }: GenrePageProps): Promise<Metadata> {
  const { genre } = await params;
  const genreName = slugToGenreName(genre);

  if (!genreName) {
    return { title: 'Genre Not Found' };
  }

  const displayName = getGenreDisplayName(genreName);
  const siteUrl = getSiteUrl();

  return {
    title: `${displayName} Events in Florida | CultureOwl`,
    description: `Discover ${displayName.toLowerCase()} events, performances, exhibitions, and activities happening across Florida. Find concerts, shows, and cultural experiences in Miami, Orlando, Tampa, and more.`,
    keywords: [
      `${displayName} events`,
      `${displayName} Florida`,
      `Florida ${displayName.toLowerCase()}`,
      `${displayName} events near me`,
      `${displayName} calendar`,
      `cultural ${displayName.toLowerCase()}`,
      'Florida events',
      'cultural events Florida'
    ],
    openGraph: {
      title: `${displayName} Events in Florida | CultureOwl`,
      description: `Discover ${displayName.toLowerCase()} events and cultural experiences across Florida`,
      url: `${siteUrl}/calendar/events/${genre}`,
      siteName: 'CultureOwl',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayName} Events in Florida | CultureOwl`,
      description: `Discover ${displayName.toLowerCase()} events across Florida`,
    },
    alternates: {
      canonical: `${siteUrl}/calendar/events/${genre}`,
    },
  };
}

/**
 * Genre-based events page
 */
export default async function GenreEventsPage({ params, searchParams }: GenrePageProps) {
  const { genre } = await params;
  const genreName = slugToGenreName(genre);

  if (!genreName) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;

  return (
    <GenrePageContent
      genreName={genreName}
      genreSlug={genre}
      searchParams={resolvedSearchParams}
    />
  );
}
