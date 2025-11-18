"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function EventsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
            <div>
              <Skeleton className="h-8 w-12 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          </Card>
        ))}
      </div>

      {/* Filters skeleton */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="space-y-4">
        {/* Results summary skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Table header skeleton */}
        <div className="border rounded-lg">
          <div className="border-b p-4">
            <div className="grid grid-cols-6 gap-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <div className="text-right">
                <Skeleton className="h-4 w-16 ml-auto" />
              </div>
            </div>
          </div>

          {/* Table rows skeleton */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b last:border-b-0 p-4">
              <div className="grid grid-cols-6 gap-4 items-center">
                {/* Event column with image and details */}
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>

                {/* Status column */}
                <Skeleton className="h-6 w-16 rounded-full" />

                {/* Client column */}
                <Skeleton className="h-4 w-24" />

                {/* Market column */}
                <Skeleton className="h-4 w-16" />

                {/* Created column */}
                <Skeleton className="h-4 w-20" />

                {/* Actions column */}
                <div className="text-right">
                  <Skeleton className="h-8 w-8 rounded ml-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}