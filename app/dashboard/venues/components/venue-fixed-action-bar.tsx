"use client";

import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Venue, VenueStatus } from '@/types/venues';

interface VenueFixedActionBarProps {
  venue?: Venue;
  currentStatus?: VenueStatus;
  onCancel: () => void;
  onSubmit: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function VenueFixedActionBar({
  venue,
  currentStatus,
  onCancel,
  onSubmit,
  loading = false,
  disabled = false
}: VenueFixedActionBarProps) {
  
  const getStatusDotColor = (status?: VenueStatus) => {
    switch (status) {
      case VenueStatus.APPROVED:
        return 'bg-green-500';
      case VenueStatus.DRAFT:
        return 'bg-gray-400';
      case VenueStatus.PENDING:
      case VenueStatus.PENDING_REVIEW:
        return 'bg-yellow-500';
      case VenueStatus.REJECTED:
        return 'bg-red-500';
      case VenueStatus.SUSPENDED:
        return 'bg-purple-500';
      case VenueStatus.DELETED:
        return 'bg-black';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Venue info */}
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            {venue ? (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className={`w-2 h-2 rounded-full ${getStatusDotColor(currentStatus || venue.status)}`}></span>
                <span className="font-medium">{venue.name}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Updating venue</span>
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
              {loading ? "Updating..." : "Update Venue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}