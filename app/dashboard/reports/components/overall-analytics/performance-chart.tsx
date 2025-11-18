"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useReportsStore } from "@/store/reports-store";

export function PerformanceChart() {
  const { analytics } = useReportsStore();

  if (!analytics.statsData) {
    return null;
  }

  const { monthlyPerformance } = analytics.statsData;

  // Since we don't have a chart library yet, we'll show a placeholder
  // In a real implementation, you would use recharts, chart.js, or another charting library
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Performance Trends</CardTitle>
        <CardDescription>
          Clicks and impressions over the past 12 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-200">
          <div className="text-center space-y-2">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">Performance chart will be displayed here</p>
              <p className="text-xs text-gray-500">Chart library integration pending</p>
            </div>
          </div>
        </div>
        
        {/* Sample data preview */}
        <div className="mt-4 space-y-2">
          <div className="text-xs text-muted-foreground">Sample monthly data:</div>
          <div className="grid grid-cols-6 gap-2 text-xs">
            {monthlyPerformance.slice(0, 6).map((month, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded">
                <div className="font-semibold">{month.month}</div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>{(month.impressions / 1000).toFixed(0)}K imp</div>
                  <div>{(month.clicks / 1000).toFixed(1)}K clicks</div>
                  <div>{month.ctr.toFixed(1)}% CTR</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}