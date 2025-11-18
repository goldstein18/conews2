"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Main arts groups list skeleton
export function ArtsGroupsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Split-screen form skeleton for create/edit pages with sidebar
export function ArtsGroupFormSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen flex">
      {/* Sidebar Skeleton */}
      <div className="w-80 h-screen bg-gray-50 border-r border-gray-200 hidden lg:flex lg:flex-col sticky top-0 flex-shrink-0">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
          <Skeleton className="h-4 w-32 mb-4" />

          {/* Preview Card */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-4">
            <Skeleton className="h-20 w-full rounded-md mb-3" />
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-24 mb-3" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="flex-1 p-6">
          <Skeleton className="h-3 w-12 mb-6" />
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  {i === 0 && <div className="w-px h-8 bg-gray-200 ml-4 mt-2" />}
                </div>
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header - Desktop only */}
            <div className="hidden lg:block mb-6">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-5 w-80" />
            </div>

            {/* Form Content */}
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Section 1 */}
                <div>
                  <CardHeader className="px-0 pt-0">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-56" />
                  </CardHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="pt-6 border-t">
                  <CardHeader className="px-0 pt-0">
                    <Skeleton className="h-6 w-40 mb-2" />
                  </CardHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>

                {/* Navigation Button */}
                <div className="flex justify-end pt-6 border-t">
                  <Skeleton className="h-10 w-40" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
