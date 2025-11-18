"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function EscoopListSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-12" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters skeleton */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-10 w-[140px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>
      </div>

      {/* Table skeleton */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {/* Table header skeleton */}
            <div className="border-b">
              <div className="flex items-center px-6 py-4">
                <div className="flex-1">
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-4 w-14" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-4 w-18" />
                </div>
                <div className="w-[50px]">
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            </div>

            {/* Table rows skeleton */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="border-b">
                <div className="flex items-center px-6 py-4">
                  {/* Title column */}
                  <div className="flex-1">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>

                  {/* Client column */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </div>

                  {/* Name column */}
                  <div className="flex-1">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>

                  {/* Location column */}
                  <div className="flex-1">
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>

                  {/* Status column */}
                  <div className="flex-1">
                    <Skeleton className="h-6 w-20" />
                  </div>

                  {/* Remaining column */}
                  <div className="flex-1">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="w-[50px]">
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination skeleton */}
          <div className="flex items-center justify-between border-t px-6 py-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function EscoopFormSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Form skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form fields skeleton */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <div className="grid gap-3 md:grid-cols-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Submit button skeleton */}
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}