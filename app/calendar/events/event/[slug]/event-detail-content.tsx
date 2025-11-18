/**
 * Client component for event detail page
 * Displays full event information with hero section and details
 */

'use client';

import { use } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventBreadcrumb } from '../../components';
import { EventHero, EventDetails, EventDetailSkeleton, EventStructuredData } from './components';
import { useEventDetail } from './hooks';

interface EventDetailContentProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function EventDetailContent({ params }: EventDetailContentProps) {
  const { slug } = use(params);
  const { event, loading, error, notFound, refetch } = useEventDetail(slug);

  // Loading state
  if (loading) {
    return <EventDetailSkeleton />;
  }

  // Not found state
  if (notFound) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
            <span className="text-4xl">📅</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            The event you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button asChild size="lg">
            <Link href="/calendar/events" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Events Directory
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
            Failed to Load Event
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {error.message || 'An error occurred while loading the event. Please try again.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => refetch()} size="lg">
              Try Again
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/calendar/events">
                Back to Directory
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success state - event loaded
  if (!event) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data for SEO */}
      <EventStructuredData event={event} />

      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-4">
        <EventBreadcrumb
          items={[
            { label: event.title }
          ]}
        />
      </div>

      {/* Hero Section */}
      <EventHero event={event} />

      {/* Event Details */}
      <EventDetails event={event} />

      {/* Back to Directory Button */}
      <div className="container mx-auto max-w-6xl px-4 pb-12">
        <Button asChild variant="outline" size="lg">
          <Link href="/calendar/events" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Events Directory
          </Link>
        </Button>
      </div>
    </div>
  );
}
