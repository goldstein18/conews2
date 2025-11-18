/**
 * ArtsGroupStructuredData Component
 * JSON-LD structured data for arts group (Schema.org)
 */

'use client';

import { getSiteUrl } from '@/lib/seo-utils';
import type { PublicArtsGroup } from '@/types/public-arts-groups';

interface ArtsGroupStructuredDataProps {
  artsGroup: PublicArtsGroup;
}

export function ArtsGroupStructuredData({ artsGroup }: ArtsGroupStructuredDataProps) {
  const siteUrl = getSiteUrl();

  // PerformingGroup/Organization Schema
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PerformingGroup',
    '@id': `${siteUrl}/arts-groups/arts-group/${artsGroup.slug}#organization`,
    name: artsGroup.name,
    description: artsGroup.description,
    url: `${siteUrl}/arts-groups/arts-group/${artsGroup.slug}`,
    image: artsGroup.imageBigUrl || artsGroup.imageUrl,
    ...(artsGroup.foundedYear && { foundingDate: `${artsGroup.foundedYear}-01-01` }),
    ...(artsGroup.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: artsGroup.address,
      },
    }),
    ...(artsGroup.phone && { telephone: artsGroup.phone }),
    ...(artsGroup.email && { email: artsGroup.email }),
    ...(artsGroup.website && { url: artsGroup.website }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
    />
  );
}
