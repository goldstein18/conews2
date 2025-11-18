"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function NewsEditSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Form fields skeleton */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
            
            {/* Content area skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-40 bg-gray-200 rounded w-full"></div>
            </div>

            {/* Action buttons skeleton */}
            <div className="flex justify-end space-x-4 pt-4">
              <div className="h-10 bg-gray-200 rounded w-20"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}