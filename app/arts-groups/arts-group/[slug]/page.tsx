/**
 * Arts Group Detail Page (Server Component)
 * Dynamic page for individual arts group profile
 */

import { Metadata } from 'next';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { getSiteUrl } from '@/lib/seo-utils';
import { PUBLIC_ARTS_GROUP } from '@/lib/graphql/public-arts-groups';
import type { PublicArtsGroupResponse } from '@/types/public-arts-groups';
import ArtsGroupDetailContent from './arts-group-detail-content';

interface ArtsGroupDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getArtsGroupData(slug: string) {
  const siteUrl = getSiteUrl();

  try {
    const client = new ApolloClient({
      uri: `${siteUrl}/api/graphql`,
      cache: new InMemoryCache(),
    });

    const { data } = await client.query<PublicArtsGroupResponse>({
      query: PUBLIC_ARTS_GROUP,
      variables: { identifier: slug },
    });

    return data.publicArtsGroup;
  } catch (error) {
    console.error('Error fetching arts group for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: ArtsGroupDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artsGroup = await getArtsGroupData(slug);
  const siteUrl = getSiteUrl();

  // If arts group not found, return minimal metadata
  if (!artsGroup) {
    return {
      title: 'Arts Group Not Found | CultureOwl',
      description: 'The arts group you are looking for could not be found.',
    };
  }

  const title = `${artsGroup.name} | CultureOwl`;
  const description =
    artsGroup.description ||
    `Discover ${artsGroup.name}, a performing arts organization. Find information about performances, membership, and contact details.`;

  const imageUrl = artsGroup.imageBigUrl || artsGroup.imageUrl || `${siteUrl}/images/default-arts-group.jpg`;

  return {
    title,
    description,
    keywords: [
      artsGroup.name,
      `${artsGroup.name} ${artsGroup.market}`,
      'performing arts',
      artsGroup.artType || 'arts organization',
      `${artsGroup.market} arts`,
      'theater',
      'dance',
      'music',
      'cultural organization',
    ],
    openGraph: {
      title,
      description,
      url: `${siteUrl}/arts-groups/arts-group/${artsGroup.slug}`,
      siteName: 'CultureOwl',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: artsGroup.name,
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
      canonical: `${siteUrl}/arts-groups/arts-group/${artsGroup.slug}`,
    },
  };
}

export default async function ArtsGroupDetailPage({ params }: ArtsGroupDetailPageProps) {
  return <ArtsGroupDetailContent params={params} />;
}
