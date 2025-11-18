"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Main venue page skeleton
export function VenuePageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Skeleton className="h-10 flex-1 max-w-md" />
          <Skeleton className="h-10 w-full sm:w-[180px]" />
          <Skeleton className="h-10 w-full sm:w-[180px]" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Skeleton className="h-10 flex-1 max-w-md" />
          <Skeleton className="h-10 w-full sm:w-auto" />
        </div>
      </div>

      {/* Table */}
      <VenueTableSkeleton />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </div>
  );
}

// Table skeleton (can be used independently)
export function VenueTableSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Table Header */}
            <div className="border-b border-border">
              <div className="flex items-center px-4 py-3">
                <div className="flex-1">
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="hidden md:block flex-1">
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="hidden lg:block flex-1">
                  <Skeleton className="h-4 w-18" />
                </div>
                <div className="hidden xl:block flex-1">
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="w-12">
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center px-4 py-4">
                  {/* Name & Company */}
                  <div className="flex-1">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="hidden md:block flex-1">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex-1">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>

                  {/* Priority */}
                  <div className="hidden lg:block flex-1">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>

                  {/* Created Date */}
                  <div className="hidden xl:block flex-1">
                    <Skeleton className="h-4 w-20" />
                  </div>

                  {/* Actions */}
                  <div className="w-12">
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Form skeleton for create/edit pages
export function VenueFormSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Client Assignment */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Venue Information */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Location Details */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-6" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Operating Hours */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-48" />
          </div>

          {/* Other fields */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-48" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-6" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8">
            <div className="text-center space-y-4">
              <Skeleton className="h-12 w-12 mx-auto" />
              <Skeleton className="h-4 w-32 mx-auto" />
              <Skeleton className="h-3 w-48 mx-auto" />
              <Skeleton className="h-10 w-32 mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Notes */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

// Compact skeleton for smaller components
export function VenueCompactSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// Stats skeleton (can be used independently)
export function VenueStatsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="p-6">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}