"use client";

import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/store/auth-store';
import { isSuperAdmin, isAdmin } from '@/lib/roles';
import { Restaurant, RestaurantStatus } from '@/types/restaurants';

interface RestaurantEditHeaderProps {
  restaurant: Restaurant;
  onBack: () => void;
  currentStatus: RestaurantStatus;
  onStatusChange?: (status: RestaurantStatus) => void;
  loading?: boolean;
}

export function RestaurantEditHeader({
  restaurant,
  onBack,
  currentStatus,
  onStatusChange,
  loading = false
}: RestaurantEditHeaderProps) {
  const { user } = useAuthStore();
  
  // Check if user can toggle status (admin/super admin only)
  const canToggleStatus = user && (isSuperAdmin(user) || isAdmin(user));
  
  // Determine if current status is in "active" state (APPROVED)
  const isActive = currentStatus === RestaurantStatus.APPROVED;
  
  const handleStatusToggle = (checked: boolean) => {
    if (!onStatusChange || loading) return;
    
    const newStatus = checked ? RestaurantStatus.APPROVED : RestaurantStatus.PENDING;
    onStatusChange(newStatus);
  };

  const getStatusBadgeColor = (status: RestaurantStatus) => {
    switch (status) {
      case RestaurantStatus.APPROVED:
        return 'default';
      case RestaurantStatus.PENDING:
        return 'secondary';
      case RestaurantStatus.DECLINED:
        return 'destructive';
      case RestaurantStatus.DELETED:
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: RestaurantStatus) => {
    switch (status) {
      case RestaurantStatus.APPROVED:
        return 'APPROVED';
      case RestaurantStatus.PENDING:
        return 'PENDING';
      case RestaurantStatus.DECLINED:
        return 'DECLINED';
      case RestaurantStatus.DELETED:
        return 'DELETED';
      default:
        return status;
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Restaurants</span>
          </Button>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-foreground truncate">
                Edit {restaurant.name}
              </h1>
              <Badge variant={getStatusBadgeColor(currentStatus)}>
                {getStatusLabel(currentStatus)}
              </Badge>
              {canToggleStatus && (
                <div className="flex items-center space-x-2 ml-4">
                  <Switch
                    checked={isActive}
                    onCheckedChange={handleStatusToggle}
                    disabled={loading}
                    aria-label="Toggle restaurant status"
                  />
                  <span className="text-sm text-muted-foreground">
                    {isActive ? 'Approved' : 'Set as Approved'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <span>{restaurant.restaurantType?.displayName || 'Unknown Cuisine'}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{restaurant.city}, {restaurant.state}</span>
              </div>
              
              <div>
                Company: {restaurant.company?.name || 'Unknown Company'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}