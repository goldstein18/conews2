'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DedicatedBuilderSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen flex">
      {/* Sidebar Skeleton - Desktop only */}
      <div className="hidden lg:block w-80 bg-white border-r p-6 space-y-6">
        {/* Back button */}
        <Skeleton className="h-10 w-32" />

        {/* Preview card */}
        <Card>
          <CardHeader className="space-y-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
        </Card>

        {/* Steps */}
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 p-6 space-y-6">
        {/* Mobile header */}
        <div className="lg:hidden space-y-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Content cards */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
