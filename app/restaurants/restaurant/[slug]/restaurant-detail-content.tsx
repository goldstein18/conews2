'use client';

import { use } from 'react';
import Link from 'next/link';
import { ChevronLeft, Clock, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RestaurantBreadcrumb } from '../../components';
import { locationToSlug } from '../../utils';
import { RestaurantHero, RestaurantLocation, RestaurantDetailSkeleton, RestaurantStructuredData } from './components';
import { useRestaurantDetail } from './hooks';

interface RestaurantDetailContentProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Client component for restaurant detail page
 * Displays full restaurant information with hero section and location details
 */
export default function RestaurantDetailContent({ params }: RestaurantDetailContentProps) {
  const { slug } = use(params);
  const { restaurant, loading, error, notFound, refetch } = useRestaurantDetail(slug);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <RestaurantDetailSkeleton />
      </div>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
            <span className="text-4xl">🍽️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Restaurant Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            The restaurant you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button asChild size="lg">
            <Link href="/restaurants" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Restaurant Directory
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
            Failed to Load Restaurant
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {error.message || 'An error occurred while loading the restaurant. Please try again.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => refetch()} size="lg">
              Try Again
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/restaurants">
                Back to Directory
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success state - restaurant loaded
  if (!restaurant) return null;

  // Generate location slug for breadcrumb
  const locationSlug = locationToSlug(restaurant.city, restaurant.state);

  // Helper functions for operating hours
  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const hasOperatingHours = restaurant.operatingHours && restaurant.operatingHours.length > 0;
  const hasSocialMedia = restaurant.facebook || restaurant.instagram || restaurant.twitter || restaurant.youtube;

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data for SEO */}
      <RestaurantStructuredData restaurant={restaurant} />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <RestaurantBreadcrumb
            items={[
              { label: 'Restaurants', href: '/restaurants' },
              { label: `${restaurant.city}, ${restaurant.state}`, href: `/restaurants/location/${locationSlug}` },
              { label: restaurant.name }
            ]}
          />
        </div>
      </div>

      {/* Hero Section */}
      <RestaurantHero restaurant={restaurant} />

      {/* Location Section */}
      <RestaurantLocation restaurant={restaurant} />

      {/* Additional Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Operating Hours */}
        {hasOperatingHours && (
          <section>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">Operating Hours</h2>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dayOrder.map(day => {
                      const hours = restaurant.operatingHours?.find(h => h.dayOfWeek === day);
                      if (!hours) return null;

                      return (
                        <div key={day} className="flex justify-between items-center py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                          <span className="font-medium text-gray-700 capitalize">
                            {day.toLowerCase()}
                          </span>
                          <span className="text-gray-900">
                            {hours.isClosed
                              ? <span className="text-red-600 font-medium">Closed</span>
                              : <span className="font-mono text-sm">{formatTime(hours.startTime)} - {formatTime(hours.endTime)}</span>
                            }
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Dietary Options & Amenities */}
        {((restaurant.dietaryOptions && restaurant.dietaryOptions.length > 0) ||
          (restaurant.amenities && restaurant.amenities.length > 0)) && (
          <section>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Features & Amenities</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {restaurant.dietaryOptions && restaurant.dietaryOptions.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Dietary Options</h3>
                        <div className="flex flex-wrap gap-2">
                          {restaurant.dietaryOptions.map((option, index) => (
                            <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {restaurant.amenities && restaurant.amenities.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {restaurant.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Social Media */}
        {hasSocialMedia && (
          <section>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Follow Us</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-3">
                    {restaurant.facebook && (
                      <a
                        href={restaurant.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <Facebook className="h-5 w-5 text-[#1877F2]" />
                        <span className="text-sm font-medium">Facebook</span>
                      </a>
                    )}
                    {restaurant.instagram && (
                      <a
                        href={restaurant.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <Instagram className="h-5 w-5 text-[#E4405F]" />
                        <span className="text-sm font-medium">Instagram</span>
                      </a>
                    )}
                    {restaurant.twitter && (
                      <a
                        href={restaurant.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                        <span className="text-sm font-medium">Twitter</span>
                      </a>
                    )}
                    {restaurant.youtube && (
                      <a
                        href={restaurant.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <Youtube className="h-5 w-5 text-[#FF0000]" />
                        <span className="text-sm font-medium">YouTube</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
