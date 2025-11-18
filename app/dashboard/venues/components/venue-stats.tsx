"use client";

import { MapPin, CheckCircle, Clock, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useVenueStats } from '../hooks/use-venues-data';
import { VenueStatus } from '@/types/venues';

interface VenueStatsProps {
  onStatusFilter?: (status: VenueStatus | 'ALL') => void;
  className?: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
  loading?: boolean;
  className?: string;
  iconClassName?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  onClick,
  loading,
  className,
  iconClassName
}: StatCardProps) => {
  if (loading) {
    return (
      <Card className={cn("p-6", className)}>
        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        onClick && "cursor-pointer hover:shadow-lg",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold">{value.toLocaleString()}</p>
              {trend && (
                <span 
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={cn("p-3 rounded-full bg-primary/10", iconClassName)}>
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function VenueStats({ onStatusFilter, className }: VenueStatsProps) {
  const { stats, loading, error } = useVenueStats();

  if (error) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
        <Card className="p-6 border-destructive/50">
          <CardContent className="p-0 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Failed to load stats</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleTotalVenuesClick = () => {
    onStatusFilter?.('ALL');
  };

  const handleApprovedClick = () => {
    onStatusFilter?.(VenueStatus.APPROVED);
  };

  const handlePendingClick = () => {
    onStatusFilter?.(VenueStatus.PENDING);
  };


  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {/* Total Venues */}
      <StatCard
        title="Total Venues"
        value={stats?.totalVenues || 0}
        icon={MapPin}
        description="All venues in the system"
        onClick={handleTotalVenuesClick}
        loading={loading}
        iconClassName="bg-blue-100"
      />

      {/* Approved Venues */}
      <StatCard
        title="Approved"
        value={stats?.approvedVenues || 0}
        icon={CheckCircle}
        description="Ready for events"
        onClick={handleApprovedClick}
        loading={loading}
        className="hover:border-green-200"
        iconClassName="bg-green-100"
      />

      {/* Pending Review */}
      <StatCard
        title="Pending Review"
        value={stats?.pendingReviewVenues || 0}
        icon={Clock}
        description="Awaiting approval"
        onClick={handlePendingClick}
        loading={loading}
        className="hover:border-yellow-200"
        iconClassName="bg-yellow-100"
      />

      {/* Active Clients */}
      <StatCard
        title="Active Clients"
        value={stats?.activeClients || 0}
        icon={Users}
        description="Companies with venues"
        loading={loading}
        className="hover:border-purple-200"
        iconClassName="bg-purple-100"
      />
    </div>
  );
}

// Skeleton version for initial loading
export function VenueStatsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {[...Array(4)].map((_, i) => (
        <StatCard
          key={i}
          title=""
          value={0}
          icon={MapPin}
          description=""
          loading={true}
        />
      ))}
    </div>
  );
}

// Summary stats for use in other components
export interface VenueStatsSummaryProps {
  stats: {
    totalVenues: number;
    approvedVenues: number;
    pendingReviewVenues: number;
    rejectedVenues: number;
    activeClients: number;
  } | null;
  loading?: boolean;
  compact?: boolean;
}

export function VenueStatsSummary({ stats, loading, compact = false }: VenueStatsSummaryProps) {
  if (loading || !stats) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-18" />
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        <span>{stats.totalVenues} Total</span>
        <span className="text-green-600">{stats.approvedVenues} Approved</span>
        <span className="text-yellow-600">{stats.pendingReviewVenues} Pending</span>
      </div>
    );
  }

  const approvalRate = stats.totalVenues > 0 
    ? Math.round((stats.approvedVenues / stats.totalVenues) * 100)
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
      <div>
        <p className="text-2xl font-bold">{stats.totalVenues}</p>
        <p className="text-xs text-muted-foreground">Total</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-green-600">{stats.approvedVenues}</p>
        <p className="text-xs text-muted-foreground">Approved</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-yellow-600">{stats.pendingReviewVenues}</p>
        <p className="text-xs text-muted-foreground">Pending</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-red-600">{stats.rejectedVenues}</p>
        <p className="text-xs text-muted-foreground">Rejected</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-purple-600">{approvalRate}%</p>
        <p className="text-xs text-muted-foreground">Approval Rate</p>
      </div>
    </div>
  );
}