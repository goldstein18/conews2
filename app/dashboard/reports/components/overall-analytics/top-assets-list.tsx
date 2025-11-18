"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { useReportsStore } from "@/store/reports-store";

// Color mapping for different asset types (unused for now)
/* const getAssetTypeColor = (type: string) => {
  const colors = {
    'Premium Banner': 'bg-blue-100 text-blue-800 border-blue-200',
    'eScoop': 'bg-green-100 text-green-800 border-green-200',
    'Calendar Featured Event': 'bg-purple-100 text-purple-800 border-purple-200',
    'ROS Banner': 'bg-orange-100 text-orange-800 border-orange-200',
    'Blue Banner': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'Red Banner': 'bg-red-100 text-red-800 border-red-200',
    'Green Banner': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };
  
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
}; */

// Get color indicator dot
const getIndicatorColor = (type: string) => {
  const colors = {
    'Premium Banner': 'bg-blue-500',
    'eScoop': 'bg-green-500',
    'Calendar Featured Event': 'bg-purple-500',
    'ROS Banner': 'bg-orange-500',
    'Blue Banner': 'bg-cyan-500',
    'Red Banner': 'bg-red-500',
    'Green Banner': 'bg-emerald-500',
  };
  
  return colors[type as keyof typeof colors] || 'bg-gray-500';
};

export function TopAssetsList() {
  const { analytics } = useReportsStore();

  if (!analytics.statsData) {
    return null;
  }

  const { topAssetTypes } = analytics.statsData;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Asset Types</CardTitle>
        <CardDescription>
          Best performing asset types by click-through rate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topAssetTypes.map((asset, index) => (
            <div 
              key={asset.type} 
              className="flex items-center justify-between py-3 border-b last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                {/* Ranking indicator */}
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getIndicatorColor(asset.type)}`} />
                  <span className="text-sm font-medium text-muted-foreground w-4">
                    #{index + 1}
                  </span>
                </div>

                {/* Asset type info */}
                <div className="space-y-1">
                  <div className="font-semibold text-sm">{asset.type}</div>
                  <div className="text-xs text-muted-foreground">
                    {asset.activeAssets} active assets
                  </div>
                </div>
              </div>

              {/* Performance metrics */}
              <div className="text-right space-y-1">
                <div className="font-semibold text-sm">
                  {asset.ctr.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div>{formatNumber(asset.clicks)} clicks</div>
                  <div>{formatNumber(asset.impressions)} impressions</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary footer */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              Total asset types analyzed
            </div>
            <div className="font-semibold">
              {topAssetTypes.length} types
            </div>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <div className="text-muted-foreground">
              Combined active assets
            </div>
            <div className="font-semibold">
              {topAssetTypes.reduce((sum, asset) => sum + asset.activeAssets, 0)} assets
            </div>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <div className="text-muted-foreground">
              Average CTR across all types
            </div>
            <div className="font-semibold">
              {(topAssetTypes.reduce((sum, asset) => sum + asset.ctr, 0) / topAssetTypes.length).toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}