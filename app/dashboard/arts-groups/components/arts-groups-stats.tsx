"use client";

import { Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useArtsGroupStats } from '../hooks/use-arts-groups-data';
import { ArtsGroupStatus } from '@/types/arts-groups';

interface ArtsGroupsStatsProps {
  onStatusFilter?: (status: ArtsGroupStatus | 'ALL') => void;
  className?: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
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

export function ArtsGroupsStats({ onStatusFilter, className }: ArtsGroupsStatsProps) {
  const { stats, loading, error } = useArtsGroupStats();

  if (error) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
        <Card className="p-6 border-destructive/50">
          <CardContent className="p-0 text-center">
            <p className="text-sm text-muted-foreground">Failed to load stats</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {/* Approved */}
      <StatCard
        title="Approved"
        value={stats?.approved || 0}
        icon={CheckCircle}
        description="Active arts groups"
        onClick={() => onStatusFilter?.(ArtsGroupStatus.APPROVED)}
        loading={loading}
        className="hover:border-green-200"
        iconClassName="bg-green-100"
      />

      {/* Pending */}
      <StatCard
        title="Pending"
        value={stats?.pending || 0}
        icon={Clock}
        description="Awaiting approval"
        onClick={() => onStatusFilter?.(ArtsGroupStatus.PENDING)}
        loading={loading}
        className="hover:border-yellow-200"
        iconClassName="bg-yellow-100"
      />

      {/* Declined */}
      <StatCard
        title="Declined"
        value={stats?.declined || 0}
        icon={XCircle}
        description="Declined arts groups"
        onClick={() => onStatusFilter?.(ArtsGroupStatus.DECLINED)}
        loading={loading}
        className="hover:border-red-200"
        iconClassName="bg-red-100"
      />

      {/* Total */}
      <StatCard
        title="Total"
        value={stats?.total || 0}
        icon={Users}
        description="All arts groups"
        onClick={() => onStatusFilter?.('ALL')}
        loading={loading}
        className="hover:border-blue-200"
        iconClassName="bg-blue-100"
      />
    </div>
  );
}
