/**
 * Layout for events directory with static SEO metadata
 * Provides default meta tags for /calendar/events pages
 */

import { Metadata } from 'next';
import { getSiteUrl } from '@/lib/seo-utils';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Events Directory | CultureOwl',
  description: 'Discover cultural events, performances, exhibitions, festivals, and more happening across Florida. Find events in Miami, Orlando, Tampa, Jacksonville, and Palm Beach.',
  keywords: [
    'Florida events',
    'cultural events',
    'Miami events',
    'Orlando events',
    'Tampa events',
    'Jacksonville events',
    'art exhibitions',
    'performances',
    'festivals',
    'concerts',
    'theater events',
    'museum events'
  ],
  openGraph: {
    title: 'Events Directory | CultureOwl',
    description: 'Discover cultural events, performances, exhibitions, and festivals happening across Florida',
    url: `${siteUrl}/calendar/events`,
    siteName: 'CultureOwl',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events Directory | CultureOwl',
    description: 'Discover cultural events, performances, exhibitions, and festivals happening across Florida',
  },
  alternates: {
    canonical: `${siteUrl}/calendar/events`,
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
