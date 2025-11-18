"use client";

import { ArrowLeft, Tag, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/store/auth-store';
import { isSuperAdmin, isAdmin } from '@/lib/roles';
import { Banner, BannerStatus } from '@/types/banners';

interface BannerEditHeaderProps {
  banner: Banner;
  onBack: () => void;
  currentStatus: BannerStatus;
  onStatusChange?: (status: BannerStatus) => void;
  loading?: boolean;
}

export function BannerEditHeader({
  banner,
  onBack,
  currentStatus,
  onStatusChange,
  loading = false
}: BannerEditHeaderProps) {
  const { user } = useAuthStore();
  
  // Check if user can toggle status (admin/super admin only)
  const canToggleStatus = user && (isSuperAdmin(user) || isAdmin(user));
  
  // Determine if current status is in "active" state (APPROVED or RUNNING)
  const isActive = currentStatus === BannerStatus.APPROVED || currentStatus === BannerStatus.RUNNING;
  
  const handleStatusToggle = (checked: boolean) => {
    if (!onStatusChange || loading) return;
    
    const newStatus = checked ? BannerStatus.APPROVED : BannerStatus.PENDING;
    onStatusChange(newStatus);
  };

  const getStatusBadgeColor = (status: BannerStatus) => {
    switch (status) {
      case BannerStatus.APPROVED:
        return 'default';
      case BannerStatus.RUNNING:
        return 'default';
      case BannerStatus.PENDING:
        return 'secondary';
      case BannerStatus.DECLINED:
        return 'destructive';
      case BannerStatus.PAUSED:
        return 'outline';
      case BannerStatus.EXPIRED:
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: BannerStatus) => {
    switch (status) {
      case BannerStatus.PENDING:
        return 'PENDING';
      case BannerStatus.APPROVED:
        return 'APPROVED';
      case BannerStatus.RUNNING:
        return 'RUNNING';
      case BannerStatus.DECLINED:
        return 'DECLINED';
      case BannerStatus.PAUSED:
        return 'PAUSED';
      case BannerStatus.EXPIRED:
        return 'EXPIRED';
      default:
        return status;
    }
  };

  const getBannerTypeDisplay = () => {
    switch (banner.bannerType) {
      case 'ROS':
        return { label: 'ROS Banner', description: 'Run of Site' };
      case 'PREMIUM':
        return { label: 'Premium Banner', description: 'Premium placement' };
      case 'BLUE':
        return { label: 'Blue Banner', description: 'Blue pages' };
      case 'GREEN':
        return { label: 'Green Banner', description: 'Green pages' };
      case 'RED':
        return { label: 'Red Banner', description: 'Red pages' };
      case 'ESCOOP':
        return { label: 'Escoop Banner', description: 'Escoop network' };
      default:
        return { label: 'Banner', description: 'Standard banner' };
    }
  };

  const bannerTypeInfo = getBannerTypeDisplay();

  const formatDates = () => {
    const startDate = new Date(banner.startDate).toLocaleDateString();
    const endDate = new Date(banner.endDate).toLocaleDateString();
    return `${startDate} - ${endDate}`;
  };

  return (
    <div className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-6 py-4">
        {/* Back button row */}
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2"
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Banners</span>
          </Button>
        </div>

        {/* Main header content */}
        <div className="flex items-center justify-between">
          {/* Left side - Banner info */}
          <div className="flex items-center space-x-4">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold">Edit {banner.name}</h1>
                <Badge variant={getStatusBadgeColor(currentStatus)}>
                  {getStatusLabel(currentStatus)}
                </Badge>
                {canToggleStatus && (
                  <Switch
                    checked={isActive}
                    onCheckedChange={handleStatusToggle}
                    disabled={loading}
                    className="data-[state=checked]:bg-blue-600"
                  />
                )}
              </div>
              
              <div className="mt-1">
                <p className="text-lg text-gray-600">
                  {bannerTypeInfo.label} - {bannerTypeInfo.description}
                </p>
              </div>
              
              <div className="flex items-center space-x-6 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Tag className="h-3 w-3" />
                  <span>{banner.market.charAt(0).toUpperCase() + banner.market.slice(1)}</span>
                </div>
                <span>
                  {formatDates()}
                </span>
                {banner.company && (
                  <div className="flex items-center space-x-1">
                    <Building2 className="h-3 w-3" />
                    <span>Company: {banner.company.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}