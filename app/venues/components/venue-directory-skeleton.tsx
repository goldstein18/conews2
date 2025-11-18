import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Skeleton loading state for venue directory
 * Matches the actual content layout and dimensions
 */
export function VenueDirectorySkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Filters skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-11 w-full sm:w-64" />
          <Skeleton className="h-11 flex-1" />
        </div>
      </div>

      {/* Type filters skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <div className="flex gap-2 overflow-x-hidden">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-32 rounded-full" />
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => (
          <VenueCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Individual venue card skeleton
 */
function VenueCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="aspect-[4/5] w-full" />

      {/* Content skeleton */}
      <CardContent className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>

        {/* Badge skeleton */}
        <Skeleton className="h-6 w-32" />

        {/* Optional text skeleton */}
        <Skeleton className="h-4 w-48" />
      </CardContent>
    </Card>
  );
}
