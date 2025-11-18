import { Metadata } from 'next';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { PUBLIC_VENUE } from '@/lib/graphql/public-venues';
import { PublicVenueResponse, PublicVenueVariables } from '@/types/public-venues';
import { getSiteUrl } from '@/lib/seo-utils';
import VenueDetailContent from './venue-detail-content';

interface VenueDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Fetch venue data for metadata generation (server-side)
 */
async function getVenueData(slug: string) {
  const siteUrl = getSiteUrl();

  try {
    const client = new ApolloClient({
      uri: `${siteUrl}/api/graphql`,
      cache: new InMemoryCache(),
    });

    const { data } = await client.query<PublicVenueResponse, PublicVenueVariables>({
      query: PUBLIC_VENUE,
      variables: { identifier: slug },
    });

    return data.publicVenue;
  } catch (error) {
    console.error('Error fetching venue for metadata:', error);
    return null;
  }
}

/**
 * Generate dynamic metadata for venue detail pages
 */
export async function generateMetadata({ params }: VenueDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const venue = await getVenueData(slug);
  const siteUrl = getSiteUrl();

  // If venue not found, return minimal metadata
  if (!venue) {
    return {
      title: 'Venue Not Found | CultureOwl',
      description: 'The venue you are looking for could not be found.',
    };
  }

  const title = `${venue.name} | CultureOwl`;
  const description = venue.metadescription ||
    venue.description ||
    `Discover ${venue.name}, a ${venue.venueType.toLowerCase().replace(/_/g, ' ')} in ${venue.city}, ${venue.state}. Find information about events, facilities, and visiting details.`;

  const locationName = `${venue.city}, ${venue.state}`;
  const imageUrl = venue.imageBigUrl || venue.imageUrl || `${siteUrl}/images/default-venue.jpg`;

  return {
    title,
    description,
    keywords: [
      venue.name,
      `${venue.name} ${venue.city}`,
      `venues in ${venue.city}`,
      `${venue.venueType.toLowerCase().replace(/_/g, ' ')}`,
      `${venue.city} ${venue.venueType.toLowerCase().replace(/_/g, ' ')}`,
      locationName,
      venue.state,
      'cultural venue',
      'arts venue',
    ],
    openGraph: {
      title,
      description,
      url: `${siteUrl}/venues/venue/${venue.slug}`,
      siteName: 'CultureOwl',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: venue.name,
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
      canonical: `${siteUrl}/venues/venue/${venue.slug}`,
    },
  };
}

/**
 * Venue detail page
 * Server component that generates metadata and renders client content
 */
export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  return <VenueDetailContent params={params} />;
}
