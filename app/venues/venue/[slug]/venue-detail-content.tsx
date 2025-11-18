'use client';

import { use } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VenueBreadcrumb } from '../../components';
import { locationToSlug } from '../../utils';
import { VenueHero, VenueLocation, VenueDetailSkeleton, VenueStructuredData } from './components';
import { useVenueDetail } from './hooks';

interface VenueDetailContentProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Client component for venue detail page
 * Displays full venue information with hero section and location map
 */
export default function VenueDetailContent({ params }: VenueDetailContentProps) {
  const { slug } = use(params);
  const { venue, loading, error, notFound, refetch } = useVenueDetail(slug);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <VenueDetailSkeleton />
      </div>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
            <span className="text-4xl">🏛️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Venue Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            The venue you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button asChild size="lg">
            <Link href="/venues" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Venue Directory
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Failed to Load Venue
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {error.message || 'An error occurred while loading the venue. Please try again.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => refetch()} size="lg">
              Try Again
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/venues">
                Back to Directory
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success state - venue loaded
  if (!venue) return null;

  // Generate location slug for breadcrumb
  const locationSlug = locationToSlug(venue.city, venue.state);

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data for SEO */}
      <VenueStructuredData venue={venue} />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <VenueBreadcrumb
            items={[
              { label: 'Venues', href: '/venues' },
              { label: `${venue.city}, ${venue.state}`, href: `/venues/location/${locationSlug}` },
              { label: venue.name }
            ]}
          />
        </div>
      </div>

      {/* Hero Section */}
      <VenueHero venue={venue} />

      {/* Location Section */}
      <VenueLocation venue={venue} />
    </div>
  );
}
