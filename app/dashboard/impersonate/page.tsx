"use client";

import { useState } from 'react';
import { UserCog, AlertCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProtectedPage } from '@/components/protected-page';
import { ImpersonateUserSelector } from './components/impersonate-user-selector';
import { ImpersonationConfirmation } from './components/impersonation-confirmation';
import { useImpersonationActions } from './hooks/use-impersonation-actions';
import { UserToImpersonate } from './hooks/use-search-users';
import { useAuthStore } from '@/store/auth-store';

function ImpersonatePageContent() {
  const { user } = useAuthStore();
  const { startImpersonation, loading } = useImpersonationActions();
  const [selectedUser, setSelectedUser] = useState<UserToImpersonate | null>(null);
  const [reason, setReason] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleUserSelect = (user: UserToImpersonate) => {
    setSelectedUser(user);
  };

  const handleImpersonateClick = () => {
    if (!selectedUser) return;
    setConfirmDialogOpen(true);
  };

  const handleConfirmImpersonation = async () => {
    if (!selectedUser) return;

    await startImpersonation(selectedUser.id, reason || undefined);

    // Close dialog on success (component will redirect)
    setConfirmDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <UserCog className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">User Impersonation</h1>
        </div>
        <p className="text-muted-foreground">
          Temporarily access the application as another user for support and debugging purposes.
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Admin Tool:</strong> This feature is only available to SUPER_ADMIN and ADMIN
          roles. All impersonation sessions are logged and audited for security compliance.
        </AlertDescription>
      </Alert>

      {/* Current Admin Info */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Admin</CardTitle>
            <CardDescription>
              You are logged in as an administrator with impersonation privileges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCog className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Role: <span className="font-medium">{user.role?.name}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Selector */}
      <ImpersonateUserSelector
        onUserSelect={handleUserSelect}
        selectedUserId={selectedUser?.id}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedUser ? (
            <>
              Selected: <span className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</span>
            </>
          ) : (
            'No user selected'
          )}
        </div>
        <Button
          size="lg"
          onClick={handleImpersonateClick}
          disabled={!selectedUser || loading}
        >
          <UserCog className="h-4 w-4 mr-2" />
          Impersonate User
        </Button>
      </div>

      {/* Warning */}
      <Alert variant="destructive" className="border-amber-200 bg-amber-50 dark:bg-amber-950">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-900 dark:text-amber-100">
          <strong>Important:</strong> When impersonating a user, you will have full access to
          their account and data. Exercise caution and only use this feature for legitimate
          support and debugging purposes. All actions are logged.
        </AlertDescription>
      </Alert>

      {/* Confirmation Dialog */}
      <ImpersonationConfirmation
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        selectedUser={selectedUser}
        reason={reason}
        onReasonChange={setReason}
        onConfirm={handleConfirmImpersonation}
        loading={loading}
      />
    </div>
  );
}

export default function ImpersonatePage() {
  return (
    <ProtectedPage requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
      <ImpersonatePageContent />
    </ProtectedPage>
  );
}
