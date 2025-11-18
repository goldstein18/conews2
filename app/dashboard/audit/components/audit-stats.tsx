"use client";

import { Activity, Users, Calendar, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AuditStats } from "@/types/audit";

interface AuditStatsProps {
  stats: AuditStats;
  statsLoading: boolean;
  statsError: Error | null;
}

export function AuditStatsComponent({
  stats,
  statsLoading,
  statsError,
}: AuditStatsProps) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Today&apos;s Actions</p>
              {statsLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  {stats.todayActions.toLocaleString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mr-4">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Actions</p>
              {statsLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalActions.toLocaleString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mr-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              {statsLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeUsers.toLocaleString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mr-4">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Entity Types</p>
              {statsLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  {stats.topEntityTypes.length}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entity Types Breakdown */}
      {stats.topEntityTypes.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Top Entity Types</h2>
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="text-center">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : statsError ? (
            <div className="text-center py-4">
              <p className="text-destructive">Error loading entity statistics: {statsError.message}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {stats.topEntityTypes.map((entityStat, index) => {
                const colors = [
                  'text-blue-600',
                  'text-green-600', 
                  'text-purple-600',
                  'text-orange-600',
                  'text-red-600'
                ];
                const colorClass = colors[index % colors.length];
                
                return (
                  <Card key={entityStat.entityType} className="p-4 hover:bg-gray-50 transition-all">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">{entityStat.entityType}</div>
                      <div className={`text-2xl font-bold ${colorClass}`}>
                        {entityStat.count}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* No data message */}
      {stats.topEntityTypes.length === 0 && !statsLoading && !statsError && (
        <div className="text-center py-8 text-muted-foreground">
          <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No activity data available yet.</p>
          <p className="text-sm">Audit entries will appear here as actions are performed.</p>
        </div>
      )}
    </div>
  );
}