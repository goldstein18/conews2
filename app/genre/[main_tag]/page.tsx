/**
 * Genre-specific events page
 * Server component with dynamic metadata for genre-based event listings
 * Example: /genre/music
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiteUrl } from '@/lib/seo-utils';
import { slugToGenreName, getGenreDisplayName } from '@/app/calendar/events/utils';
import { getGenreConfig } from '../utils';
import GenrePageContent from './genre-page-content';

interface GenrePageProps {
  params: Promise<{ main_tag: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Generate dynamic metadata for genre pages
 */
export async function generateMetadata({ params }: GenrePageProps): Promise<Metadata> {
  const { main_tag } = await params;
  const genreName = slugToGenreName(main_tag);

  if (!genreName) {
    return { title: 'Genre Not Found' };
  }

  const displayName = getGenreDisplayName(genreName);
  const genreConfig = getGenreConfig(genreName);
  const siteUrl = getSiteUrl();

  return {
    title: `${displayName} Events in Florida | CultureOwl`,
    description: genreConfig.description,
    keywords: [
      `${displayName} events`,
      `${displayName} Florida`,
      `Florida ${displayName.toLowerCase()}`,
      `${displayName} events near me`,
      `${displayName} calendar`,
      ...genreConfig.keywords,
      'Florida events',
      'cultural events Florida'
    ],
    openGraph: {
      title: `${displayName} Events in Florida | CultureOwl`,
      description: genreConfig.description,
      url: `${siteUrl}/genre/${main_tag}`,
      siteName: 'CultureOwl',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: genreConfig.heroImage,
          width: 1200,
          height: 630,
          alt: `${displayName} Events`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayName} Events in Florida | CultureOwl`,
      description: genreConfig.description,
      images: [genreConfig.heroImage]
    },
    alternates: {
      canonical: `${siteUrl}/genre/${main_tag}`,
    },
  };
}

/**
 * Genre-based events page
 */
export default async function GenrePage({ params }: GenrePageProps) {
  const { main_tag } = await params;
  const genreName = slugToGenreName(main_tag);

  if (!genreName) {
    notFound();
  }

  return (
    <GenrePageContent
      genreName={genreName}
      genreSlug={main_tag}
    />
  );
}
