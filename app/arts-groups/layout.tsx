import { Metadata } from 'next';
import { getSiteUrl } from '@/lib/seo-utils';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Arts Groups Directory | CultureOwl',
  description: 'Discover performing arts groups across Florida. Find theater companies, dance troupes, orchestras, opera companies, and more cultural organizations in Miami, Orlando, Tampa, and Jacksonville.',
  keywords: [
    'arts groups',
    'performing arts',
    'theater companies',
    'dance troupes',
    'orchestras',
    'opera companies',
    'Florida arts',
    'Miami arts groups',
    'Orlando performing arts',
    'Tampa theater',
    'Jacksonville arts',
    'cultural organizations',
    'arts directory',
    'performing arts organizations',
  ],
  openGraph: {
    title: 'Arts Groups Directory | CultureOwl',
    description: 'Discover performing arts groups across Florida. Find theater companies, dance troupes, orchestras, opera companies, and more cultural organizations.',
    url: `${siteUrl}/arts-groups`,
    siteName: 'CultureOwl',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arts Groups Directory | CultureOwl',
    description: 'Discover performing arts groups across Florida. Find theater companies, dance troupes, orchestras, and more.',
  },
  alternates: {
    canonical: `${siteUrl}/arts-groups`,
  },
};

export default function ArtsGroupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
