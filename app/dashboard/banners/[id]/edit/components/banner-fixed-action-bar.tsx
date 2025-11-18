"use client";

import { Tag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Banner, BannerStatus } from '@/types/banners';

interface BannerFixedActionBarProps {
  banner?: Banner;
  currentStatus?: BannerStatus;
  onCancel: () => void;
  onSubmit: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function BannerFixedActionBar({
  banner,
  currentStatus,
  onCancel,
  onSubmit,
  loading = false,
  disabled = false
}: BannerFixedActionBarProps) {
  
  const getStatusDotColor = (status?: BannerStatus) => {
    switch (status) {
      case BannerStatus.APPROVED:
        return 'bg-green-500';
      case BannerStatus.RUNNING:
        return 'bg-green-500';
      case BannerStatus.PENDING:
        return 'bg-yellow-500';
      case BannerStatus.DECLINED:
        return 'bg-red-500';
      case BannerStatus.PAUSED:
        return 'bg-purple-500';
      case BannerStatus.EXPIRED:
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getBannerTypeDisplay = (bannerType?: string) => {
    switch (bannerType) {
      case 'ROS':
        return 'ROS Banner';
      case 'PREMIUM':
        return 'Premium Banner';
      case 'BLUE':
        return 'Blue Banner';
      case 'GREEN':
        return 'Green Banner';
      case 'RED':
        return 'Red Banner';
      case 'ESCOOP':
        return 'Escoop Banner';
      default:
        return 'Banner';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Banner info */}
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            {banner ? (
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className={`w-2 h-2 rounded-full ${getStatusDotColor(currentStatus || banner.status)}`}></span>
                <span className="font-medium">{banner.name}</span>
                <span className="text-gray-400">•</span>
                <span>{getBannerTypeDisplay(banner.bannerType)}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Updating banner</span>
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
              {loading ? "Updating..." : "Update Banner"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}