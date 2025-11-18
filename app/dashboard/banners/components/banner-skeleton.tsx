'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function BannerPageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Banner Type Tabs */}
      <div className="border-b">
        <div className="flex space-x-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="py-4">
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Current Banner Type Performance */}
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Banner Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-8" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1 max-w-sm" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {/* Table Header */}
            <div className="grid grid-cols-8 gap-4 p-4 border-b bg-muted/50">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            
            {/* Table Rows */}
            {[...Array(5)].map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-8 gap-4 p-4 border-b">
                {/* Banner Name */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                
                {/* Type */}
                <Skeleton className="h-6 w-16 rounded-full" />
                
                {/* Status */}
                <Skeleton className="h-6 w-20 rounded-full" />
                
                {/* Start Date */}
                <Skeleton className="h-4 w-20" />
                
                {/* End Date */}
                <Skeleton className="h-4 w-20" />
                
                {/* Impressions */}
                <Skeleton className="h-4 w-16" />
                
                {/* CTR */}
                <Skeleton className="h-4 w-12" />
                
                {/* Actions */}
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
}

export function BannerTableSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-8 gap-4 p-4 border-b bg-muted/50">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          
          {/* Table Rows */}
          {[...Array(8)].map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-8 gap-4 p-4 border-b">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}