'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { MarqueeStats } from '@/types/marquee';

interface MarqueeStatsProps {
  stats?: MarqueeStats;
  loading?: boolean;
  onStatClick?: (status?: string) => void;
}

export function MarqueeStatsComponent({ stats, loading, onStatClick }: MarqueeStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Marquees',
      value: stats.total,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      onClick: () => onStatClick?.(),
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      onClick: () => onStatClick?.('PENDING'),
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      onClick: () => onStatClick?.('APPROVED'),
    },
    {
      title: 'Declined',
      value: stats.declined,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      onClick: () => onStatClick?.('DECLINED'),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card
          key={stat.title}
          className="cursor-pointer transition-all hover:shadow-md"
          onClick={stat.onClick}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
