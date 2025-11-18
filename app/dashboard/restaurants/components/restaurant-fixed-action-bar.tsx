"use client";

import { UtensilsCrossed, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Restaurant, RestaurantStatus } from '@/types/restaurants';

interface RestaurantFixedActionBarProps {
  restaurant?: Restaurant;
  currentStatus?: RestaurantStatus;
  onCancel: () => void;
  onSubmit: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function RestaurantFixedActionBar({
  restaurant,
  currentStatus,
  onCancel,
  onSubmit,
  loading = false,
  disabled = false
}: RestaurantFixedActionBarProps) {
  
  const getStatusDotColor = (status?: RestaurantStatus) => {
    switch (status) {
      case RestaurantStatus.APPROVED:
        return 'bg-green-500';
      case RestaurantStatus.PENDING:
        return 'bg-yellow-500';
      case RestaurantStatus.DECLINED:
        return 'bg-red-500';
      case RestaurantStatus.DELETED:
        return 'bg-black';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Restaurant info */}
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            {restaurant ? (
              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="h-4 w-4 text-gray-500" />
                <span className={`w-2 h-2 rounded-full ${getStatusDotColor(currentStatus || restaurant.status)}`}></span>
                <span className="font-medium">{restaurant.name}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="h-4 w-4 text-gray-500" />
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Updating restaurant</span>
              </div>
            )}
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading || disabled}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={onSubmit}
              disabled={loading || disabled}
              className="min-w-[140px] bg-blue-600 hover:bg-blue-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Updating..." : "Update Restaurant"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}