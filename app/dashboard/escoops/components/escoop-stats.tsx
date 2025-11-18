"use client";

import React from 'react';
import { Send, Clock, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Escoop, EscoopStatus } from '@/types/escoops';

interface EscoopStatsProps {
  escoops: Escoop[];
  loading?: boolean;
  onFilterChange?: (filter: { status?: EscoopStatus; sent?: boolean }) => void;
  className?: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  onClick?: () => void;
  loading?: boolean;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  onClick,
  loading
}: StatCardProps) {
  if (loading) {
    return (
      <Card className="cursor-pointer transition-all duration-200 hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-12" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        onClick && "hover:scale-105"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className={cn("text-3xl font-bold", color)}>
              {value.toLocaleString()}
            </p>
          </div>
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            bgColor
          )}>
            <Icon className={cn("h-6 w-6", color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EscoopStats({
  escoops,
  loading,
  onFilterChange,
  className
}: EscoopStatsProps) {
  // Calculate stats from escoops data
  const stats = React.useMemo(() => {
    const sent = escoops.filter(escoop => escoop.sent || escoop.status === EscoopStatus.SENT).length;
    const scheduled = escoops.filter(escoop =>
      !escoop.sent && escoop.status === EscoopStatus.SCHEDULED
    ).length;
    const draft = escoops.filter(escoop => escoop.status === EscoopStatus.DRAFT).length;
    const total = escoops.length;

    return { sent, scheduled, draft, total };
  }, [escoops]);

  const handleSentClick = () => {
    onFilterChange?.({ sent: true });
  };

  const handleScheduledClick = () => {
    onFilterChange?.({ status: EscoopStatus.SCHEDULED, sent: false });
  };

  const handleDraftClick = () => {
    onFilterChange?.({ status: EscoopStatus.DRAFT });
  };

  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      <StatCard
        title="Sent"
        value={stats.sent}
        icon={Send}
        color="text-green-600"
        bgColor="bg-green-100"
        onClick={handleSentClick}
        loading={loading}
      />

      <StatCard
        title="Scheduled"
        value={stats.scheduled}
        icon={Clock}
        color="text-blue-600"
        bgColor="bg-blue-100"
        onClick={handleScheduledClick}
        loading={loading}
      />

      <StatCard
        title="Draft"
        value={stats.draft}
        icon={FileText}
        color="text-gray-600"
        bgColor="bg-gray-100"
        onClick={handleDraftClick}
        loading={loading}
      />

      <StatCard
        title="Total"
        value={stats.total}
        icon={FileText}
        color="text-purple-600"
        bgColor="bg-purple-100"
        loading={loading}
      />
    </div>
  );
}