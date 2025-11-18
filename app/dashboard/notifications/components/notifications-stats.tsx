import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Users, Mail, Globe } from 'lucide-react';

interface NotificationsStatsProps {
  stats: {
    totalNotifications: number;
    unreadCount: number;
    connectedClients: number;
    todayNotifications: number;
  };
  loading?: boolean;
}

export function NotificationsStats({ stats, loading }: NotificationsStatsProps) {
  const statCards = [
    {
      title: 'Total Notifications',
      value: stats.totalNotifications,
      icon: Mail,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Today\'s Notifications',
      value: stats.todayNotifications,
      icon: Bell,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Unread Messages',
      value: stats.unreadCount,
      icon: Globe,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      title: 'Connected Clients',
      value: stats.connectedClients,
      icon: Users,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
