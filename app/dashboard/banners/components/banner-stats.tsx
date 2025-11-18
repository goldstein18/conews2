'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useBannerStats } from '../hooks';
import { useBannerStore } from '@/store/banner-store';
import { BannerStatus } from '@/types/banners';
import { AlertTriangle, BarChart3, MousePointerClick, Play, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  loading?: boolean;
}

function StatCard({ title, value, icon, onClick, className, loading }: StatCardProps) {
  const isClickable = !!onClick;
  
  if (loading) {
    return (
      <Card className={cn("transition-all duration-200", className)}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-muted animate-pulse">
              <div className="h-6 w-6 bg-muted-foreground/20 rounded" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted animate-pulse rounded w-24" />
              <div className="h-8 bg-muted animate-pulse rounded w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "transition-all duration-200",
        isClickable && "cursor-pointer hover:shadow-lg hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={cn(
            "p-3 rounded-lg",
            isClickable ? "bg-primary/10 text-primary" : "bg-muted"
          )}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BannerStatsProps {
  companyId?: string;
  onStatusFilter?: (status: BannerStatus | 'ALL') => void;
  className?: string;
}

export function BannerStats({ companyId, onStatusFilter, className }: BannerStatsProps) {
  const { stats, loading, error } = useBannerStats(companyId);
  const { setStatusFilter, clearFilters } = useBannerStore();

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

  const handleTotalImpressionsClick = () => {
    clearFilters();
    onStatusFilter?.('ALL');
  };

  const handleTotalClicksClick = () => {
    clearFilters();
    onStatusFilter?.('ALL');
  };

  const handleRunningBannersClick = () => {
    setStatusFilter(BannerStatus.RUNNING);
    onStatusFilter?.(BannerStatus.RUNNING);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatCTR = (ctr: number): string => {
    return `${ctr.toFixed(2)}%`;
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {/* Total Impressions */}
      <StatCard
        title="Total Impressions"
        value={formatNumber(stats?.totalImpressions || 0)}
        icon={<Eye className="h-6 w-6" />}
        onClick={handleTotalImpressionsClick}
        loading={loading}
        className="hover:border-blue-200"
      />

      {/* Total Clicks */}
      <StatCard
        title="Total Clicks"
        value={formatNumber(stats?.totalClicks || 0)}
        icon={<MousePointerClick className="h-6 w-6" />}
        onClick={handleTotalClicksClick}
        loading={loading}
        className="hover:border-green-200"
      />

      {/* Average CTR */}
      <StatCard
        title="Average CTR"
        value={formatCTR(stats?.averageCTR || 0)}
        icon={<BarChart3 className="h-6 w-6" />}
        loading={loading}
        className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100"
      />

      {/* Running Banners */}
      <StatCard
        title="Running Banners"
        value={stats?.runningBanners || 0}
        icon={<Play className="h-6 w-6" />}
        onClick={handleRunningBannersClick}
        loading={loading}
        className="hover:border-orange-200"
      />
    </div>
  );
}