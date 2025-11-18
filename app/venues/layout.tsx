import { Metadata } from 'next';
import { getSiteUrl } from '@/lib/seo-utils';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Cultural Venues Directory | CultureOwl',
  description: 'Discover museums, theaters, galleries, performing arts centers, and cultural venues across Florida. Find the perfect venue for your next cultural experience.',
  keywords: [
    'cultural venues',
    'museums',
    'theaters',
    'art galleries',
    'performing arts centers',
    'Florida culture',
    'Miami venues',
    'Orlando venues',
    'Tampa venues',
    'Jacksonville venues',
  ],
  openGraph: {
    title: 'Cultural Venues Directory | CultureOwl',
    description: 'Discover museums, theaters, galleries, and cultural venues across Florida.',
    url: `${siteUrl}/venues`,
    siteName: 'CultureOwl',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cultural Venues Directory | CultureOwl',
    description: 'Discover museums, theaters, galleries, and cultural venues across Florida.',
  },
  alternates: {
    canonical: `${siteUrl}/venues`,
  },
};

export default function VenuesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
