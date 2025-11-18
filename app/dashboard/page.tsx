"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useDashboardData } from "./hooks";
import {
  DashboardSkeleton,
  DashboardStatsOverview,
  DashboardRevenueCard,
  DashboardMembersByCity,
  DashboardEventsByCity,
  DashboardGrowthMetrics,
  DashboardRecentActivity,
} from "./components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Calendar, Users, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { user, isInitializing: authInitializing } = useAuthStore();
  const [selectedMarket, setSelectedMarket] = useState<string>("all");

  // Fetch dashboard data
  const { data, loading, error, canAccessAdminDashboard, isInitializing } = useDashboardData({
    selectedMarket: selectedMarket !== "all" ? selectedMarket : undefined,
  });

  // ✅ Debug logging
  console.log('📊 Dashboard Page State:', {
    authInitializing,
    isInitializing,
    loading,
    userEmail: user?.email,
    userRole: user?.role?.name,
    canAccessAdminDashboard,
  });

  // ✅ Show loading skeleton while auth is initializing OR queries are loading
  if (authInitializing || isInitializing || loading) {
    console.log('⏳ Dashboard showing loading skeleton because:', {
      authInitializing,
      isInitializing,
      loading,
    });
    return (
      <div className="p-6">
        <DashboardSkeleton />
      </div>
    );
  }

  // Show error state (only for admin users)
  if (error && canAccessAdminDashboard) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-600 font-medium">Error loading dashboard data</p>
          <p className="text-sm text-gray-600 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  // ✅ Show company dashboard for non-admin users
  if (!canAccessAdminDashboard) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const companyDashboard = data as any; // Company dashboard data (dynamic type from GraphQL)

    return (
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome, {user?.firstName}!
          </h2>
          <p className="text-muted-foreground">
            {companyDashboard?.company?.name || user?.role?.name}
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companyDashboard?.events?.totalEvents || 0}</div>
              <p className="text-xs text-muted-foreground">
                {companyDashboard?.events?.liveEvents || 0} live, {companyDashboard?.events?.pendingEvents || 0} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companyDashboard?.team?.totalMembers || 0}</div>
              <p className="text-xs text-muted-foreground">
                {companyDashboard?.team?.activeMembers || 0} active members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Banners</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companyDashboard?.banners?.totalBanners || 0}</div>
              <p className="text-xs text-muted-foreground">
                {companyDashboard?.banners?.activeBanners || 0} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assets</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companyDashboard?.assets?.totalRemaining || 0}</div>
              <p className="text-xs text-muted-foreground">
                {companyDashboard?.assets?.usagePercentage || 0}% used
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Company Info Card */}
        {companyDashboard?.company && (
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                {companyDashboard.company.plan?.plan || 'No Plan'} - {companyDashboard.company.status}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm"><strong>Email:</strong> {companyDashboard.company.email}</p>
                <p className="text-sm"><strong>Phone:</strong> {companyDashboard.company.phone || 'N/A'}</p>
                <p className="text-sm"><strong>Location:</strong> {companyDashboard.company.city}, {companyDashboard.company.state}</p>
                <p className="text-sm"><strong>Users:</strong> {companyDashboard.company.userCount || 0} total, {companyDashboard.company.managerCount || 0} managers</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Getting Started Card */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Use the sidebar menu to navigate through your available features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Welcome to CultureOwl! Your dashboard provides access to all the tools you need to manage your company&apos;s presence on the platform.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ Show full admin dashboard for SUPER_ADMIN and ADMIN users
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome, {user?.firstName}!
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your events platform
          </p>
        </div>

        {/* Market Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select market" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Markets</SelectItem>
              <SelectItem value="miami">Miami</SelectItem>
              <SelectItem value="orlando">Orlando</SelectItem>
              <SelectItem value="tampa">Tampa</SelectItem>
              <SelectItem value="fortlauderdale">Fort Lauderdale</SelectItem>
              <SelectItem value="jacksonville">Jacksonville</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Top Stats Cards */}
      <DashboardStatsOverview overall={data.overall} revenue={data.revenue} />

      {/* Members by City */}
      <DashboardMembersByCity users={data.users} />

      {/* Running Events by City */}
      <DashboardEventsByCity eventsByCity={data.eventsByCity} />

      {/* Revenue & Growth Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardRevenueCard revenue={data.revenue} />
        <DashboardGrowthMetrics growth={data.growth} />
      </div>

      {/* Recent Activity */}
      <DashboardRecentActivity companies={data.companies} />
    </div>
  );
}
