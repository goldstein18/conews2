'use client';

import { PublicRestaurant } from '@/types/public-restaurants';
import { getSiteUrl } from '@/lib/seo-utils';
import { getPriceRangeSymbol } from '../../../utils';

interface RestaurantStructuredDataProps {
  restaurant: PublicRestaurant;
}

/**
 * JSON-LD structured data for restaurant pages
 * Implements Schema.org Restaurant and FoodEstablishment types
 * Enhances SEO with rich snippets for search engines
 */
export function RestaurantStructuredData({ restaurant }: RestaurantStructuredDataProps) {
  const siteUrl = getSiteUrl();

  // Generate Restaurant structured data
  const restaurantJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${siteUrl}/restaurants/restaurant/${restaurant.slug}#restaurant`,
    name: restaurant.name,
    description: restaurant.description,
    url: `${siteUrl}/restaurants/restaurant/${restaurant.slug}`,
    ...(restaurant.imageUrl && {
      image: restaurant.imageBigUrl || restaurant.imageUrl,
    }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.address,
      addressLocality: restaurant.city,
      addressRegion: restaurant.state,
      postalCode: restaurant.zipcode,
      addressCountry: 'US',
    },
    ...(restaurant.latitude && restaurant.longitude && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
      },
    }),
    ...(restaurant.phone && {
      telephone: restaurant.phone,
    }),
    ...(restaurant.email && {
      email: restaurant.email,
    }),
    ...(restaurant.priceRange && {
      priceRange: getPriceRangeSymbol(restaurant.priceRange),
    }),
    ...(restaurant.restaurantType && {
      servesCuisine: [restaurant.restaurantType.name],
    }),
    ...(restaurant.menuLink && {
      hasMenu: restaurant.menuLink,
    }),
    ...(restaurant.facebook || restaurant.instagram || restaurant.twitter) && {
      sameAs: [
        restaurant.facebook,
        restaurant.instagram,
        restaurant.twitter,
        restaurant.youtube,
        restaurant.tiktok,
      ].filter(Boolean),
    },
    ...(restaurant.operatingHours && restaurant.operatingHours.length > 0 && {
      openingHoursSpecification: restaurant.operatingHours
        .filter(hours => !hours.isClosed)
        .map(hours => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: hours.dayOfWeek.charAt(0) + hours.dayOfWeek.slice(1).toLowerCase(),
          opens: hours.startTime,
          closes: hours.endTime,
        })),
    }),
  };

  // FoodEstablishment schema (alternative/additional type)
  const foodEstablishmentJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    '@id': `${siteUrl}/restaurants/restaurant/${restaurant.slug}#foodestablishment`,
    name: restaurant.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.address,
      addressLocality: restaurant.city,
      addressRegion: restaurant.state,
      postalCode: restaurant.zipcode,
      addressCountry: 'US',
    },
    ...(restaurant.website && {
      url: restaurant.website,
    }),
  };

  return (
    <>
      {/* Restaurant structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
      />

      {/* FoodEstablishment structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(foodEstablishmentJsonLd) }}
      />
    </>
  );
}
