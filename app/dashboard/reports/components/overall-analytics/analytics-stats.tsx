"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, MousePointerClick, TrendingUp, BarChart3 } from "lucide-react";
import { useReportsStore } from "@/store/reports-store";

export function AnalyticsStats() {
  const { analytics } = useReportsStore();

  if (!analytics.statsData) {
    return null;
  }

  const { totalAssets, totalReach, totalClicks, topPerformingAsset } = analytics.statsData;
  
  // Calculate overall CTR
  // const overallCtr = totalReach > 0 ? (totalClicks / totalReach * 100) : 0;
  
  // Calculate percentage changes (mock data)
  const assetGrowth = 12; // Mock +12% from last period
  const reachGrowth = 8;  // Mock +8% from last period
  const clickGrowth = 15; // Mock +15% from last period

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0;
    return (
      <div className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <TrendingUp className={`h-3 w-3 mr-1 ${isPositive ? '' : 'rotate-180'}`} />
        {isPositive ? '+' : ''}{growth}% from last month
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Assets */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium text-muted-foreground">Total Assets</div>
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{totalAssets}</div>
            {formatGrowth(assetGrowth)}
          </div>
        </CardContent>
      </Card>

      {/* Total Reach */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium text-muted-foreground">Total Reach</div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{formatNumber(totalReach)}</div>
            {formatGrowth(reachGrowth)}
          </div>
        </CardContent>
      </Card>

      {/* Total Clicks */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium text-muted-foreground">Total Clicks</div>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{formatNumber(totalClicks)}</div>
            {formatGrowth(clickGrowth)}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Asset */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium text-muted-foreground">Top Performing</div>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="font-semibold text-sm">{topPerformingAsset.name}</div>
              <Badge variant="secondary" className="text-xs">
                {topPerformingAsset.type}
              </Badge>
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {topPerformingAsset.ctr.toFixed(1)}% CTR
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}