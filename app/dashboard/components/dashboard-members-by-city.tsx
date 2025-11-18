"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { UsersStats } from "@/types/dashboard";

interface DashboardMembersByCityProps {
  users: UsersStats;
}

// City color mapping (matching the design mockup colors)
const cityColors: Record<string, string> = {
  miami: "bg-blue-500",
  orlando: "bg-green-500",
  tampa: "bg-purple-500",
  fortlauderdale: "bg-orange-500",
  jacksonville: "bg-pink-500",
};

const cityLabels: Record<string, string> = {
  miami: "Miami",
  orlando: "Orlando",
  tampa: "Tampa",
  fortlauderdale: "Fort Lauderdale",
  jacksonville: "Jacksonville",
};

export function DashboardMembersByCity({ users }: DashboardMembersByCityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Total Members</span>
        </CardTitle>
        <CardDescription>Members distribution across markets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {users.byMarket.map((marketData) => {
            const colorClass = cityColors[marketData.market.toLowerCase()] || "bg-gray-500";
            const cityLabel = cityLabels[marketData.market.toLowerCase()] || marketData.market.toUpperCase();

            return (
              <div key={marketData.market} className="text-center space-y-3">
                <div className={`w-16 h-16 rounded-full ${colorClass} mx-auto flex items-center justify-center`}>
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {marketData.count.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">{cityLabel}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {users.totalSubscribers.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Total Subscribers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {users.totalCalendarMembers.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Calendar Members</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {users.activeUsers.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">
              {users.inactiveUsers.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Inactive Users</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
