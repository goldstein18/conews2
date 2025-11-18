"use client";

import { AlertTriangle, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserToImpersonate } from '../hooks/use-search-users';

interface ImpersonationConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: UserToImpersonate | null;
  reason: string;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
  loading: boolean;
}

export function ImpersonationConfirmation({
  open,
  onOpenChange,
  selectedUser,
  reason,
  onReasonChange,
  onConfirm,
  loading,
}: ImpersonationConfirmationProps) {
  if (!selectedUser) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Confirm Impersonation</DialogTitle>
          <DialogDescription>
            You are about to impersonate the following user. This action will be logged for
            audit purposes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* User Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
              <div>
                <span className="text-muted-foreground">Company:</span>
                <p className="font-medium">{selectedUser.companyName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Role:</span>
                <p className="font-medium">{selectedUser.role?.name || 'No role'}</p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Security Notice:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>This session will expire in 1 hour</li>
                <li>All actions will be logged and audited</li>
                <li>You will see the application as this user</li>
                <li>A banner will indicate you are impersonating</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Reason (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for Impersonation <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="e.g., Debugging payment issue, assisting with event creation..."
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              rows={3}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Providing a reason helps with audit tracking and compliance.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Starting Impersonation...
              </>
            ) : (
              'Start Impersonation'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
