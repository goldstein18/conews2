'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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

interface StatusToggleProps {
  currentStatus: string;
  onStatusChange: (newStatus: 'ACTIVE' | 'PENDING') => void;
  loading?: boolean;
  entityType?: string;
  disabled?: boolean;
}

export function StatusToggle({
  currentStatus,
  onStatusChange,
  loading = false,
  entityType = 'item',
  disabled = false
}: StatusToggleProps) {
  const { user } = useAuthStore();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<'ACTIVE' | 'PENDING' | null>(null);

  // Only show for SUPER_ADMIN and ADMIN
  if (!isAdmin(user)) {
    return null;
  }

  // Normalize status to check if it's active
  const normalizedStatus = currentStatus?.toUpperCase();
  const isCurrentlyActive = normalizedStatus === 'ACTIVE' || normalizedStatus === 'APPROVED';

  const handleToggleChange = (checked: boolean) => {
    const newStatus = checked ? 'ACTIVE' : 'PENDING';

    // Show confirmation dialog when changing from ACTIVE to PENDING
    if (isCurrentlyActive && !checked) {
      setPendingStatus(newStatus);
      setShowConfirmDialog(true);
    } else {
      // Direct change for PENDING → ACTIVE or other transitions
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

  return (
    <>
      <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-md border border-gray-200">
        <div className="flex flex-col">
          <Label htmlFor="status-toggle" className="text-sm font-medium text-gray-700 cursor-pointer">
            Quick Status
          </Label>
          <span className="text-xs text-gray-500 mt-0.5">
            {isCurrentlyActive ? 'Active' : 'Pending'}
          </span>
        </div>
        <Switch
          id="status-toggle"
          checked={isCurrentlyActive}
          onCheckedChange={handleToggleChange}
          disabled={loading || disabled}
        />
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this {entityType} to PENDING status?
              This will make it inactive and may require re-approval.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelStatusChange}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStatusChange}>
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
