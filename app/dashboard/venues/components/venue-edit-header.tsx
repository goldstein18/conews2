"use client";

import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/store/auth-store';
import { isSuperAdmin, isAdmin } from '@/lib/roles';
import { Venue, VenueStatus } from '@/types/venues';

interface VenueEditHeaderProps {
  venue: Venue;
  onBack: () => void;
  currentStatus: VenueStatus;
  onStatusChange?: (status: VenueStatus) => void;
  loading?: boolean;
}

export function VenueEditHeader({
  venue,
  onBack,
  currentStatus,
  onStatusChange,
  loading = false
}: VenueEditHeaderProps) {
  const { user } = useAuthStore();
  
  // Check if user can toggle status (admin/super admin only)
  const canToggleStatus = user && (isSuperAdmin(user) || isAdmin(user));
  
  // Determine if current status is in "active" state (APPROVED)
  const isActive = currentStatus === VenueStatus.APPROVED;
  
  const handleStatusToggle = (checked: boolean) => {
    if (!onStatusChange || loading) return;
    
    const newStatus = checked ? VenueStatus.APPROVED : VenueStatus.PENDING;
    onStatusChange(newStatus);
  };

  const getStatusBadgeColor = (status: VenueStatus) => {
    switch (status) {
      case VenueStatus.APPROVED:
        return 'default';
      case VenueStatus.DRAFT:
        return 'outline';
      case VenueStatus.PENDING:
      case VenueStatus.PENDING_REVIEW:
        return 'secondary';
      case VenueStatus.REJECTED:
        return 'destructive';
      case VenueStatus.SUSPENDED:
        return 'outline';
      case VenueStatus.DELETED:
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: VenueStatus) => {
    switch (status) {
      case VenueStatus.DRAFT:
        return 'DRAFT';
      case VenueStatus.APPROVED:
        return 'APPROVED';
      case VenueStatus.PENDING:
        return 'PENDING';
      case VenueStatus.PENDING_REVIEW:
        return 'PENDING REVIEW';
      case VenueStatus.REJECTED:
        return 'REJECTED';
      case VenueStatus.SUSPENDED:
        return 'SUSPENDED';
      case VenueStatus.DELETED:
        return 'DELETED';
      default:
        return status;
    }
  };

  const formatLocation = () => {
    const parts = [];
    if (venue.city) parts.push(venue.city);
    if (venue.state) parts.push(venue.state);
    return parts.join(', ') || 'Location not specified';
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
            <span>Back to Venues</span>
          </Button>
        </div>

        {/* Main header content */}
        <div className="flex items-center justify-between">
          {/* Left side - Venue info */}
          <div className="flex items-center space-x-4">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold">Edit {venue.name}</h1>
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
                  {venue.venueType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>
              
              <div className="flex items-center space-x-6 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{formatLocation()}</span>
                </div>
                <span>
                  Company: {venue.company?.name || 'No company assigned'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}