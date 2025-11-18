/**
 * Skeleton loading state for event directory
 * Matches the actual content layout
 */

'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function EventDirectorySkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
        <Skeleton className="h-12 w-full max-w-2xl mx-auto mt-6" />
      </div>

      {/* Filters skeleton */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-24" />
          ))}
        </div>
        <div className="flex justify-between items-center pb-4 border-b">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Results count skeleton */}
      <Skeleton className="h-8 w-40" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            {/* Image skeleton */}
            <Skeleton className="aspect-[4/5] w-full" />

            {/* Card content skeleton */}
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
