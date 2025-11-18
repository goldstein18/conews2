import { Metadata } from 'next';
import { getSiteUrl } from '@/lib/seo-utils';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Restaurant Directory | CultureOwl',
  description: 'Discover the best dining experiences across Florida. From budget-friendly gems to fine dining establishments, explore our curated collection of restaurants featuring diverse cuisines and atmospheres.',
  keywords: [
    'restaurants',
    'Florida restaurants',
    'Miami restaurants',
    'Orlando restaurants',
    'Tampa restaurants',
    'Jacksonville restaurants',
    'dining',
    'food',
    'cuisine',
    'fine dining',
    'casual dining',
    'restaurant directory',
    'where to eat Florida',
    'best restaurants Florida'
  ],
  openGraph: {
    title: 'Restaurant Directory | CultureOwl',
    description: 'Discover the best dining experiences across Florida. From budget-friendly gems to fine dining establishments, explore our curated collection of restaurants.',
    url: `${siteUrl}/restaurants`,
    siteName: 'CultureOwl',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Restaurant Directory | CultureOwl',
    description: 'Discover the best dining experiences across Florida.',
  },
  alternates: {
    canonical: `${siteUrl}/restaurants`,
  },
};

export default function RestaurantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
