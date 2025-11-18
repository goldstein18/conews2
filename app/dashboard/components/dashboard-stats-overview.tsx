"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Building, TrendingUp } from "lucide-react";
import { OverallStats, RevenueStats } from "@/types/dashboard";

interface DashboardStatsOverviewProps {
  overall: OverallStats;
  revenue: RevenueStats;
}

export function DashboardStatsOverview({ overall, revenue }: DashboardStatsOverviewProps) {
  const stats = [
    {
      title: "Active Events",
      value: overall.totalActiveEvents.toLocaleString(),
      description: `${overall.totalFeaturedEvents} featured`,
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Registered Users",
      value: overall.totalSubscribers.toLocaleString(),
      description: `${overall.totalCalendarMembers} calendar members`,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Companies",
      value: overall.totalCompanies.toLocaleString(),
      description: `${overall.activeCompanies} active`,
      icon: Building,
      color: "text-purple-600",
    },
    {
      title: "Monthly Revenue",
      value: `$${revenue.currentMonthRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      description: `${revenue.growthRate > 0 ? '+' : ''}${revenue.growthRate.toFixed(1)}% vs previous month`,
      icon: TrendingUp,
      color: revenue.growthRate >= 0 ? "text-orange-600" : "text-red-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
