import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function RestaurantPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-5 w-5 rounded" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market filter cards skeleton */}
      <div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Skeleton className="h-8 w-8 mx-auto mb-2" />
                <Skeleton className="h-5 w-16 mx-auto mb-1" />
                <Skeleton className="h-4 w-12 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Filters skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          {/* Table header */}
          <div className="grid grid-cols-7 gap-4 pb-3 mb-3 border-b">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>

          {/* Table rows */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-7 gap-4 py-3 border-b last:border-b-0">
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-16" />
              <div className="flex items-center">
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex items-center space-x-1">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-20" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          ))}

          {/* Pagination skeleton */}
          <div className="flex items-center justify-between pt-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function RestaurantStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function RestaurantTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Table header */}
        <div className="grid grid-cols-7 gap-4 pb-3 mb-3 border-b">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>

        {/* Table rows */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className="grid grid-cols-7 gap-4 py-3 border-b last:border-b-0">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-4 w-16" />
            <div className="flex items-center">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex items-center space-x-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-20" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Creation wizard skeleton (for 2-step creation process)
export function RestaurantCreationSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Step 1 */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            {/* Connector line */}
            <Skeleton className="h-0.5 w-16" />
            {/* Step 2 */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Restaurant Name */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-24 w-full" />
          </div>

          {/* Address Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>

          {/* Market */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Cuisine Type */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Company Assignment */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Edit wizard skeleton (for restaurant edit page with sidebar layout)
export function RestaurantEditSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-gray-50 min-h-full flex flex-col", className)}>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
      
      {/* Split-screen layout */}
      <div className="flex flex-1">
        {/* Left Sidebar - Hidden on mobile */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-5 lg:pb-4">
          <div className="flex items-center flex-shrink-0 px-6">
            <Skeleton className="h-8 w-8 mr-3" />
            <div className="space-y-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          
          {/* Restaurant Info */}
          <div className="mt-6 px-6">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>

          {/* Steps Navigation */}
          <div className="mt-6 flex-1 px-3">
            <Skeleton className="h-5 w-16 mb-4 ml-3" />
            <div className="space-y-1">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="group relative">
                  <div className="bg-blue-50 border-blue-200 text-blue-700 border-l-4 pl-3 pr-3 py-2 text-sm font-medium">
                    <div className="flex items-center">
                      <Skeleton className="h-6 w-6 mr-3 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Update Button */}
          <div className="px-6 py-4 border-t border-gray-200">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        
        {/* Right Content Area */}
        <div className="flex-1 lg:pl-80">
          {/* Main Content Container */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Page Header - Only show on desktop */}
              <div className="hidden lg:block mb-6">
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-80" />
              </div>
              
              {/* Form Content */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Form fields skeleton */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-24 w-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
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
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ))}
                    </div>

                    {/* Form actions */}
                    <div className="flex justify-between pt-6">
                      <Skeleton className="h-10 w-24" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}