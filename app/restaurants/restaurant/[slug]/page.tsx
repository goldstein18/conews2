import { Metadata } from 'next';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { PUBLIC_RESTAURANT } from '@/lib/graphql/public-restaurants';
import { PublicRestaurantResponse, PublicRestaurantVariables } from '@/types/public-restaurants';
import { getSiteUrl } from '@/lib/seo-utils';
import RestaurantDetailContent from './restaurant-detail-content';

interface RestaurantDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Fetch restaurant data for metadata generation (server-side)
 */
async function getRestaurantData(slug: string) {
  const siteUrl = getSiteUrl();

  try {
    const client = new ApolloClient({
      uri: `${siteUrl}/api/graphql`,
      cache: new InMemoryCache(),
    });

    const { data } = await client.query<PublicRestaurantResponse, PublicRestaurantVariables>({
      query: PUBLIC_RESTAURANT,
      variables: { identifier: slug },
    });

    return data.publicRestaurant;
  } catch (error) {
    console.error('Error fetching restaurant for metadata:', error);
    return null;
  }
}

/**
 * Generate dynamic metadata for restaurant detail pages
 */
export async function generateMetadata({ params }: RestaurantDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getRestaurantData(slug);
  const siteUrl = getSiteUrl();

  // If restaurant not found, return minimal metadata
  if (!restaurant) {
    return {
      title: 'Restaurant Not Found | CultureOwl',
      description: 'The restaurant you are looking for could not be found.',
    };
  }

  const title = `${restaurant.name} | CultureOwl`;
  const description = restaurant.description ||
    `Discover ${restaurant.name}, ${restaurant.restaurantType?.name ? `a ${restaurant.restaurantType.name} restaurant` : 'a dining experience'} in ${restaurant.city}, ${restaurant.state}. Find menu information, hours, and contact details.`;

  const locationName = `${restaurant.city}, ${restaurant.state}`;
  const imageUrl = restaurant.imageBigUrl || restaurant.imageUrl || `${siteUrl}/images/default-restaurant.jpg`;

  return {
    title,
    description,
    keywords: [
      restaurant.name,
      `${restaurant.name} ${restaurant.city}`,
      `restaurants in ${restaurant.city}`,
      restaurant.restaurantType?.name || 'restaurant',
      `${restaurant.city} ${restaurant.restaurantType?.name || 'dining'}`,
      locationName,
      restaurant.state,
      'restaurant',
      'dining',
      'food',
    ],
    openGraph: {
      title,
      description,
      url: `${siteUrl}/restaurants/restaurant/${restaurant.slug}`,
      siteName: 'CultureOwl',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: restaurant.name,
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
      canonical: `${siteUrl}/restaurants/restaurant/${restaurant.slug}`,
    },
  };
}

/**
 * Restaurant detail page
 * Server component that generates metadata and renders client content
 */
export default async function RestaurantDetailPage({ params }: RestaurantDetailPageProps) {
  return <RestaurantDetailContent params={params} />;
}
