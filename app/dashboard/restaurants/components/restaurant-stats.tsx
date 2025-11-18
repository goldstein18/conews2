'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Users, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RestaurantStatus } from '@/types/restaurants';
import { useQuery } from '@apollo/client';
import { GET_RESTAURANT_STATS } from '@/lib/graphql/restaurants';
import { RestaurantStatsSkeleton } from './restaurant-skeleton';

interface RestaurantStatsProps {
  onStatusFilter?: (status: RestaurantStatus | 'ALL') => void;
}

interface RestaurantStatsContentProps {
  stats: {
    totalRestaurants: number;
    approvedRestaurants: number;
    pendingReviewRestaurants: number;
    rejectedRestaurants: number;
    activeClients: number;
  };
  onStatusFilter?: (status: RestaurantStatus | 'ALL') => void;
  isDemoData?: boolean;
}

interface RestaurantStatsData {
  restaurantStats: {
    totalRestaurants: number;
    approvedRestaurants: number;
    pendingReviewRestaurants: number;
    rejectedRestaurants: number;
    activeClients: number;
  };
}

function RestaurantStatsContent({ stats, onStatusFilter, isDemoData = false }: RestaurantStatsContentProps) {
  const handleTotalClick = () => {
    if (onStatusFilter) onStatusFilter('ALL' as RestaurantStatus | 'ALL');
  };

  const handleApprovedClick = () => {
    if (onStatusFilter) onStatusFilter(RestaurantStatus.APPROVED);
  };

  const handlePendingClick = () => {
    if (onStatusFilter) onStatusFilter(RestaurantStatus.PENDING);
  };

  return (
    <>
      {/* Demo Data Banner */}
      {isDemoData && (
        <div className="col-span-full mb-2">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              📊 Displaying sample data - GraphQL endpoint pending
            </p>
          </div>
        </div>
      )}

      {/* Total Restaurants */}
      <Card 
        className={cn(
          "cursor-pointer hover:shadow-md transition-shadow",
          onStatusFilter && "hover:shadow-lg"
        )}
        onClick={handleTotalClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Restaurants</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold">{stats?.totalRestaurants || 0}</p>
              </div>
              <p className="text-xs text-muted-foreground">All restaurants in the system</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <UtensilsCrossed className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approved Restaurants */}
      <Card 
        className={cn(
          "cursor-pointer hover:shadow-md transition-shadow hover:border-green-200",
          onStatusFilter && "hover:shadow-lg"
        )}
        onClick={handleApprovedClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Approved</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold">{stats?.approvedRestaurants || 0}</p>
              </div>
              <p className="text-xs text-muted-foreground">Ready for events</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Review */}
      <Card 
        className={cn(
          "cursor-pointer hover:shadow-md transition-shadow hover:border-yellow-200",
          onStatusFilter && "hover:shadow-lg"
        )}
        onClick={handlePendingClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold">{stats?.pendingReviewRestaurants || 0}</p>
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Clients */}
      <Card className="hover:shadow-md transition-shadow hover:border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold">{stats?.activeClients || 0}</p>
              </div>
              <p className="text-xs text-muted-foreground">Companies with restaurants</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export function RestaurantStats({ onStatusFilter }: RestaurantStatsProps) {
  const { data, loading, error } = useQuery<RestaurantStatsData>(GET_RESTAURANT_STATS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  if (loading) {
    return <RestaurantStatsSkeleton />;
  }

  if (error || !data?.restaurantStats) {
    // Show mock data while the endpoint is being developed
    const mockStats = {
      totalRestaurants: 5,
      approvedRestaurants: 2,
      pendingReviewRestaurants: 1,
      rejectedRestaurants: 1,
      activeClients: 3
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RestaurantStatsContent stats={mockStats} onStatusFilter={onStatusFilter} isDemoData={true} />
      </div>
    );
  }

  const stats = data.restaurantStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <RestaurantStatsContent stats={stats} onStatusFilter={onStatusFilter} />
    </div>
  );
}