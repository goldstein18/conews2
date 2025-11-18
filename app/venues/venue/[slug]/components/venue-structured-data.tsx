'use client';

import { PublicVenue } from '@/types/public-venues';
import { getSiteUrl } from '@/lib/seo-utils';

interface VenueStructuredDataProps {
  venue: PublicVenue;
}

/**
 * JSON-LD structured data for venue pages
 * Implements Schema.org Place and Organization types
 * Enhances SEO with rich snippets for search engines
 */
export function VenueStructuredData({ venue }: VenueStructuredDataProps) {
  const siteUrl = getSiteUrl();

  // Generate Place structured data
  const placeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `${siteUrl}/venues/venue/${venue.slug}#place`,
    name: venue.name,
    description: venue.description || venue.metadescription,
    url: `${siteUrl}/venues/venue/${venue.slug}`,
    ...(venue.imageUrl && {
      image: venue.imageBigUrl || venue.imageUrl,
    }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.address,
      addressLocality: venue.city,
      addressRegion: venue.state,
      postalCode: venue.zipcode,
      addressCountry: 'US',
    },
    geo: venue.address && {
      '@type': 'GeoCoordinates',
      // Note: If you have lat/lng in your venue data, add them here
      address: `${venue.address}, ${venue.city}, ${venue.state} ${venue.zipcode}`,
    },
    ...(venue.phone && {
      telephone: venue.phone,
    }),
    ...(venue.website && {
      url: venue.website,
    }),
    ...(venue.parkingInformation && {
      amenityFeature: {
        '@type': 'LocationFeatureSpecification',
        name: 'Parking',
        value: venue.parkingInformation,
      },
    }),
    ...(venue.accessibilityFeatures && {
      isAccessibleForFree: true,
      accessibilityAPI: venue.accessibilityFeatures,
    }),
    ...(venue.facebook || venue.twitter || venue.instagram) && {
      sameAs: [
        venue.facebook,
        venue.twitter,
        venue.instagram,
        venue.youtube,
        venue.tiktok,
      ].filter(Boolean),
    },
  };

  // If venue hosts events, add EventVenue type
  const eventVenueJsonLd = venue.hostsPrivateEvents ? {
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    '@id': `${siteUrl}/venues/venue/${venue.slug}#eventvenue`,
    name: venue.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.address,
      addressLocality: venue.city,
      addressRegion: venue.state,
      postalCode: venue.zipcode,
      addressCountry: 'US',
    },
    ...(venue.website && {
      url: venue.website,
    }),
  } : null;

  // If venue is a cultural organization (museums, theaters, etc.)
  const culturalOrgTypes: Record<string, string> = {
    MUSEUM: 'Museum',
    THEATER: 'TheaterEvent',
    PERFORMING_ARTS_CENTER: 'PerformingArtsTheater',
    GALLERY: 'ArtGallery',
    ART_CENTER: 'ArtGallery',
  };

  const orgType = culturalOrgTypes[venue.venueType as keyof typeof culturalOrgTypes];

  const organizationJsonLd = orgType ? {
    '@context': 'https://schema.org',
    '@type': orgType,
    '@id': `${siteUrl}/venues/venue/${venue.slug}#organization`,
    name: venue.name,
    description: venue.description || venue.metadescription,
    ...(venue.imageUrl && {
      image: venue.imageBigUrl || venue.imageUrl,
    }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.address,
      addressLocality: venue.city,
      addressRegion: venue.state,
      postalCode: venue.zipcode,
      addressCountry: 'US',
    },
    ...(venue.phone && {
      telephone: venue.phone,
    }),
    ...(venue.website && {
      url: venue.website,
    }),
    ...(venue.facebook || venue.twitter || venue.instagram) && {
      sameAs: [
        venue.facebook,
        venue.twitter,
        venue.instagram,
        venue.youtube,
        venue.tiktok,
      ].filter(Boolean),
    },
  } : null;

  // FAQs structured data
  const faqJsonLd = venue.faqs && venue.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: venue.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <>
      {/* Place structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd) }}
      />

      {/* Event Venue structured data (if applicable) */}
      {eventVenueJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventVenueJsonLd) }}
        />
      )}

      {/* Organization structured data (if applicable) */}
      {organizationJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      )}

      {/* FAQ structured data (if applicable) */}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </>
  );
}
