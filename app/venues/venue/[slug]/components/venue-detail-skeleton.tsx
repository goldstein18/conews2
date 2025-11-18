import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading skeleton for venue detail page
 * Matches the layout of VenueHero and VenueLocation
 */
export function VenueDetailSkeleton() {
  return (
    <div className="space-y-12">
      {/* Hero Section Skeleton */}
      <section className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-0">
          {/* Image Skeleton - Square aspect, 30% width */}
          <Skeleton className="aspect-square w-full" />

          {/* Info Skeleton - Black Background (70% width) */}
          <div className="bg-black p-6 lg:p-10 xl:p-12 space-y-4 flex flex-col justify-center">
            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-10 w-2/3 bg-gray-800" />
              <Skeleton className="h-6 w-24 bg-gray-800" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-gray-800" />
              <Skeleton className="h-4 w-full bg-gray-800" />
              <Skeleton className="h-4 w-3/4 bg-gray-800" />
            </div>

            {/* Contact Info */}
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-full bg-gray-800" />
              <Skeleton className="h-4 w-40 bg-gray-800" />
              <Skeleton className="h-4 w-48 bg-gray-800" />
            </div>
          </div>
        </div>
      </section>

      {/* Location Section Skeleton */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-6 w-64" />
          </div>

          {/* Map Skeleton */}
          <Skeleton className="w-full h-96 rounded-xl" />

          {/* Button Skeleton */}
          <div className="flex justify-center pt-2">
            <Skeleton className="h-11 w-48" />
          </div>
        </div>
      </section>
    </div>
  );
}
