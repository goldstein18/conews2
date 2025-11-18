"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Building, Users, Calendar } from "lucide-react";
import { GrowthMetrics } from "@/types/dashboard";

interface DashboardGrowthMetricsProps {
  growth: GrowthMetrics;
}

export function DashboardGrowthMetrics({ growth }: DashboardGrowthMetricsProps) {
  const metrics = [
    {
      title: "Companies Growth",
      icon: Building,
      current: growth.newCompaniesThisMonth,
      previous: growth.newCompaniesLastMonth,
      rate: growth.companiesGrowthRate,
      color: "text-purple-600",
    },
    {
      title: "Users Growth",
      icon: Users,
      current: growth.newUsersThisMonth,
      previous: growth.newUsersLastMonth,
      rate: growth.usersGrowthRate,
      color: "text-green-600",
    },
    {
      title: "Events Growth",
      icon: Calendar,
      current: growth.newEventsThisMonth,
      previous: growth.newEventsLastMonth,
      rate: growth.eventsGrowthRate,
      color: "text-blue-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Growth Rate</span>
        </CardTitle>
        <CardDescription>Month-over-month growth metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const isPositive = metric.rate >= 0;
            const GrowthIcon = isPositive ? TrendingUp : TrendingDown;

            return (
              <div key={metric.title} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                    <h4 className="text-sm font-medium text-gray-700">{metric.title}</h4>
                  </div>
                  <div className={`flex items-center space-x-1 ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <GrowthIcon className="h-4 w-4" />
                    <span className="text-sm font-bold">
                      {isPositive ? '+' : ''}{metric.rate.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-gray-600">This Month:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {metric.current.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-gray-600">Last Month:</span>
                    <span className="text-lg font-semibold text-gray-600">
                      {metric.previous.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Growth Bar Visualization */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{
                      width: `${Math.min(Math.abs(metric.rate), 100)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
