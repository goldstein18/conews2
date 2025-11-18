'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function EscoopBuilderSkeleton() {
  return (
    <div className="bg-gray-50 min-h-full flex flex-col">
      {/* Mobile Navigation Skeleton */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-12" />
        </div>
        <Skeleton className="h-1.5 w-full mb-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Split-screen layout */}
      <div className="flex flex-1">
        {/* Left Sidebar Skeleton - Fixed position, hidden on mobile */}
        <div className="w-80 h-screen bg-gray-50 border-r border-gray-200 hidden lg:flex lg:flex-col sticky top-0 flex-shrink-0">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center mb-4">
              <Skeleton className="h-4 w-4 mr-2" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Preview Card */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-4">
              <div className="h-20 bg-gradient-to-r from-white/20 to-white/10 rounded-md mb-3 flex items-center justify-center">
                <Skeleton className="h-6 w-6" />
              </div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Navigation Steps */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0">
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Area Skeleton */}
        <div className="flex-1 min-w-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              {/* Page Header - Only show on desktop */}
              <div className="hidden lg:block mb-6">
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>

              {/* Content Card */}
              <Card>
                <CardContent className="p-6">
                  <EscoopContentSkeleton />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Content skeleton that matches the Creator Panel structure
function EscoopContentSkeleton() {
  return (
    <div className="space-y-5">
      {/* Subject Line Card */}
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="pt-0">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-9 w-full mb-1" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>

      {/* Two Column Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="pt-0">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent className="pt-0">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Another Two Column Row */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Final Two Column Row */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent className="pt-0">
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Send Options Card */}
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}