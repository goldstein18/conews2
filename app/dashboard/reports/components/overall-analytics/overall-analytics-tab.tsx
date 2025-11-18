"use client";

// Main analytics tab component
import { useReportsStore } from "@/store/reports-store";
import { AnalyticsFilters } from "./analytics-filters";
import { AnalyticsStats } from "./analytics-stats";
import { PerformanceChart } from "./performance-chart";
import { TopAssetsList } from "./top-assets-list";
import { AnalyticsStatsSkeleton, AnalyticsChartSkeleton, AnalyticsListSkeleton } from "../common";

export function OverallAnalyticsTab() {
  const { analytics } = useReportsStore();
  
  // Show loading state initially or when no dates are set
  const showData = analytics.startDate && analytics.endDate;
  const isLoading = analytics.loading;

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <AnalyticsFilters />

      {/* Only show content if date range is selected */}
      {showData ? (
        <>
          {/* Stats Cards */}
          {isLoading ? (
            <AnalyticsStatsSkeleton />
          ) : (
            <AnalyticsStats />
          )}

          {/* Charts and Lists Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            {isLoading ? (
              <AnalyticsChartSkeleton />
            ) : (
              <PerformanceChart />
            )}

            {/* Top Assets List */}
            {isLoading ? (
              <AnalyticsListSkeleton />
            ) : (
              <TopAssetsList />
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 text-muted-foreground">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <svg 
              className="h-8 w-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
              />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Select Date Range</h3>
            <p className="text-sm">
              Choose a date range and asset type above to view<br />
              comprehensive analytics across your platform.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}