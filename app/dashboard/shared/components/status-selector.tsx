'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuthStore } from '@/store/auth-store';
import { isAdmin } from '@/lib/roles';

interface StatusSelectorProps {
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
  loading?: boolean;
  entityType?: string;
  disabled?: boolean;
}

// Status configurations with colors and labels
const STATUS_CONFIG: Record<string, { label: string; color: string; requiresConfirmation: boolean }> = {
  'DRAFT': {
    label: 'Draft',
    color: 'bg-gray-400',
    requiresConfirmation: false,
  },
  'PENDING': {
    label: 'Pending',
    color: 'bg-yellow-500',
    requiresConfirmation: false,
  },
  'PENDING_REVIEW': {
    label: 'Pending Review',
    color: 'bg-orange-500',
    requiresConfirmation: false,
  },
  'APPROVED': {
    label: 'Approved',
    color: 'bg-green-500',
    requiresConfirmation: false,
  },
  'REJECTED': {
    label: 'Rejected',
    color: 'bg-red-500',
    requiresConfirmation: true,
  },
  'SUSPENDED': {
    label: 'Suspended',
    color: 'bg-purple-500',
    requiresConfirmation: true,
  },
  'DELETED': {
    label: 'Deleted',
    color: 'bg-black',
    requiresConfirmation: true,
  },
};

export function StatusSelector({
  currentStatus,
  onStatusChange,
  loading = false,
  entityType = 'item',
  disabled = false
}: StatusSelectorProps) {
  const { user } = useAuthStore();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  // Only show for SUPER_ADMIN and ADMIN
  if (!isAdmin(user)) {
    return null;
  }

  const handleStatusChange = (newStatus: string) => {
    const statusConfig = STATUS_CONFIG[newStatus];

    // Show confirmation dialog for destructive actions
    if (statusConfig.requiresConfirmation) {
      setPendingStatus(newStatus);
      setShowConfirmDialog(true);
    } else {
      // Direct change for non-destructive statuses
      onStatusChange(newStatus);
    }
  };

  const handleConfirmStatusChange = () => {
    if (pendingStatus) {
      onStatusChange(pendingStatus);
    }
    setShowConfirmDialog(false);
    setPendingStatus(null);
  };

  const handleCancelStatusChange = () => {
    setShowConfirmDialog(false);
    setPendingStatus(null);
  };

  const getConfirmationMessage = (status: string) => {
    switch (status) {
      case 'REJECTED':
        return `Are you sure you want to REJECT this ${entityType}? This will make it inactive and may notify the creator.`;
      case 'SUSPENDED':
        return `Are you sure you want to SUSPEND this ${entityType}? This will temporarily hide it from public view.`;
      case 'DELETED':
        return `Are you sure you want to mark this ${entityType} as DELETED? This is a destructive action.`;
      default:
        return `Are you sure you want to change this ${entityType} status?`;
    }
  };

  // Get current status config or fallback to draft if unknown
  const currentStatusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG['DRAFT'];

  return (
    <>
      <div className="space-y-2 py-3 px-4 bg-gray-50 rounded-md border border-gray-200">
        <Label htmlFor="status-selector" className="text-sm font-medium text-gray-700">
          Event Status
        </Label>
        <Select
          value={currentStatus}
          onValueChange={handleStatusChange}
          disabled={loading || disabled}
        >
          <SelectTrigger id="status-selector" className="w-full">
            <SelectValue>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${currentStatusConfig.color} rounded-full`} />
                <span>{currentStatusConfig.label}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATUS_CONFIG).map(([status, config]) => (
              <SelectItem key={status} value={status}>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 ${config.color} rounded-full`} />
                  <span>{config.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Confirmation Dialog for Destructive Actions */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingStatus && getConfirmationMessage(pendingStatus)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelStatusChange}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStatusChange} className="bg-red-500 hover:bg-red-600">
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
