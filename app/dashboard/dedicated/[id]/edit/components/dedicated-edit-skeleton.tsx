import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function DedicatedEditSkeleton() {
  return (
    <div className="bg-gray-50 min-h-full flex flex-col">
      {/* Mobile Navigation Skeleton */}
      <div className="lg:hidden border-b bg-white p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-7 w-16" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex-1 flex">
        {/* Sidebar Skeleton - Hidden on mobile */}
        <div className="hidden lg:block w-80 border-r bg-white p-6">
          <div className="space-y-6">
            {/* Back button */}
            <Skeleton className="h-10 w-32" />

            {/* Preview card */}
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4 pt-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6 lg:p-8">
            {/* Page Header */}
            <div className="mb-8 space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>

            {/* Form Cards */}
            <div className="space-y-6">
              {/* Card 1 */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-between">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
