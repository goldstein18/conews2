import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Ticket,
  AlertCircle,
  Clock,
  CheckCircle,
  MessageSquare,
  AlertTriangle,
  UserX
} from 'lucide-react';
import { TicketStats as TicketStatsType } from '@/types/ticket';

interface TicketStatsProps {
  stats: TicketStatsType;
  loading?: boolean;
  onStatClick?: (filterType: string) => void;
}

export function TicketStats({ stats, loading, onStatClick }: TicketStatsProps) {
  if (loading) {
    return <TicketStatsSkeleton />;
  }

  const statCards = [
    {
      title: 'Open Tickets',
      value: stats.open,
      icon: Ticket,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      filterType: 'OPEN',
      clickable: true,
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      filterType: 'IN_PROGRESS',
      clickable: true,
    },
    {
      title: 'Waiting for Customer',
      value: stats.waitingForCustomer,
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      filterType: 'WAITING_FOR_CUSTOMER',
      clickable: true,
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      filterType: 'RESOLVED',
      clickable: true,
    },
    {
      title: 'Urgent',
      value: stats.urgent,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      filterType: 'URGENT',
      clickable: true,
    },
    {
      title: 'High Priority',
      value: stats.high,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      filterType: 'HIGH',
      clickable: true,
    },
    {
      title: 'Unassigned',
      value: stats.unassigned,
      icon: UserX,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      filterType: 'UNASSIGNED',
      clickable: true,
    },
    {
      title: 'Total Tickets',
      value: stats.total,
      icon: Ticket,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      filterType: 'ALL',
      clickable: false,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        const isClickable = stat.clickable && onStatClick;

        return (
          <Card
            key={stat.title}
            className={`${
              isClickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
            }`}
            onClick={() => isClickable && onStatClick(stat.filterType)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {isClickable && (
                <p className="text-xs text-gray-500 mt-1">Click to filter</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function TicketStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
