'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Loading skeleton for restaurant detail page
 * Matches the new layout: breadcrumb, 2-column hero, map, and content sections
 */
export function RestaurantDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Skeleton */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
      </div>

      {/* Hero Skeleton - 2 column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-0">
        {/* Square image skeleton */}
        <Skeleton className="aspect-square w-full" />

        {/* Info section skeleton with black background */}
        <div className="bg-black p-6 lg:p-10 xl:p-12 space-y-4 flex flex-col justify-center">
          <Skeleton className="h-10 w-3/4 bg-gray-700" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 bg-gray-700" />
            <Skeleton className="h-6 w-20 bg-gray-700" />
          </div>
          <Skeleton className="h-16 w-full bg-gray-700" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-gray-700" />
            <Skeleton className="h-4 w-32 bg-gray-700" />
            <Skeleton className="h-4 w-40 bg-gray-700" />
          </div>
        </div>
      </div>

      {/* Location Section Skeleton */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-9 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-5" />
              <Skeleton className="h-6 w-64" />
            </div>
          </div>
          <Skeleton className="w-full h-96 rounded-xl" />
          <div className="flex justify-center pt-2">
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </section>

      {/* Additional Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Operating Hours Skeleton */}
        <section>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="flex justify-between py-2 px-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Skeleton */}
        <section>
          <div className="space-y-4">
            <Skeleton className="h-8 w-56" />
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <Skeleton className="h-6 w-40 mb-3" />
                    <div className="flex flex-wrap gap-2">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-24" />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-6 w-32 mb-3" />
                    <div className="flex flex-wrap gap-2">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-20" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Social Media Skeleton */}
        <section>
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-36" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
