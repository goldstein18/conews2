/**
 * Layout for genre pages
 * Provides base metadata and structure for all genre routes
 */

import { Metadata } from 'next';
import { getSiteUrl } from '@/lib/seo-utils';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Genre Events | CultureOwl',
  description: 'Discover cultural events by genre across Florida',
  openGraph: {
    title: 'Genre Events | CultureOwl',
    description: 'Discover cultural events by genre across Florida',
    url: `${siteUrl}/genre`,
    siteName: 'CultureOwl',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function GenreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
