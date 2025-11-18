"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CompanyEditSkeleton() {
  return (
    <div className="h-full bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-4">
          {/* Back button row */}
          <div className="flex items-center mb-4">
            <Skeleton className="h-9 w-32" />
          </div>

          {/* Main header content */}
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
                <Skeleton className="h-6 w-32 mb-2" />
                <div className="flex items-center space-x-6">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>

            {/* Right side - Action buttons */}
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

      {/* Company Users Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-48" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-48" />
          </div>
        </CardContent>
      </Card>

      {/* Company Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-16" />
          </CardTitle>
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current note input */}
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <div className="flex justify-end">
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          
          {/* Previous Notes */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 bg-gray-50 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Selection Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-48" />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4">
        <Skeleton className="h-10 w-20" /> {/* Cancel button */}
        <Skeleton className="h-10 w-32" /> {/* Submit button */}
      </div>
      </div>
    </div>
  );
}