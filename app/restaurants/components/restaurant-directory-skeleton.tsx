'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Loading skeleton for restaurant directory
 * Matches the layout of actual restaurant cards
 */
export function RestaurantDirectorySkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-12 w-96 mb-4" />
        <Skeleton className="h-6 w-full max-w-3xl" />
        <div className="mt-6 flex gap-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            {/* Image Skeleton */}
            <Skeleton className="h-56 w-full" />

            <CardContent className="p-5 space-y-3">
              {/* Title */}
              <Skeleton className="h-6 w-3/4" />

              {/* Badge */}
              <Skeleton className="h-5 w-24" />

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              {/* Location */}
              <Skeleton className="h-4 w-40" />

              {/* Contact Info */}
              <div className="flex gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
