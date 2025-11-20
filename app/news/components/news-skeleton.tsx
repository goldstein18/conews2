/**
 * News skeleton loading component
 * Shows loading placeholders while news articles are being fetched
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function NewsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero skeleton */}
      <div className="relative w-full aspect-[1200/628] overflow-hidden rounded-lg bg-gray-200">
        <Skeleton className="h-full w-full" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 space-y-4">
          <Skeleton className="h-6 w-24 bg-white/20" />
          <Skeleton className="h-12 w-3/4 bg-white/20" />
          <Skeleton className="h-6 w-48 bg-white/20" />
        </div>
      </div>

      {/* Grid skeleton - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative aspect-[1200/628] bg-gray-200">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

