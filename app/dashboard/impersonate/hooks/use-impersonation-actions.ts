import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { useAuthStore } from '@/store/auth-store';
import { useImpersonationStore } from '@/store/impersonation-store';
import {
  START_IMPERSONATION,
  END_IMPERSONATION,
  type StartImpersonationInput,
  type StartImpersonationResponse,
  type EndImpersonationResponse
} from '@/lib/graphql/impersonation';
import { toast } from 'sonner';

interface StartImpersonationData {
  startImpersonation: StartImpersonationResponse;
}

interface EndImpersonationData {
  endImpersonation: EndImpersonationResponse;
}

export function useImpersonationActions() {
  const router = useRouter();
  const { user, initializeAuth, logout } = useAuthStore();
  const { startImpersonation: setImpersonationState, endImpersonation: clearImpersonationState } = useImpersonationStore();

  const [startImpersonationMutation, { loading: startLoading }] = useMutation<
    StartImpersonationData,
    { input: StartImpersonationInput }
  >(START_IMPERSONATION);

  const [endImpersonationMutation, { loading: endLoading }] = useMutation<EndImpersonationData>(
    END_IMPERSONATION
  );

  // ✅ Emergency logout handler
  const handleEmergencyLogout = async () => {
    console.error('🚨 Emergency logout triggered - no valid admin token available');
    toast.error('Session recovery failed. Please log in again.');
    await logout();
    router.push('/login');
  };

  const startImpersonation = async (targetUserId: string, reason?: string) => {
    if (!user) {
      toast.error('You must be logged in to impersonate users');
      return;
    }

    try {
      // ✅ STEP 1: Backup current admin token from httpOnly cookie
      console.log('🔒 Backing up admin token before impersonation...');
      const backupResponse = await fetch('/api/auth/backup-token', {
        method: 'GET',
        credentials: 'include',
      });

      let originalAdminToken: string | undefined;
      if (backupResponse.ok) {
        const backupData = await backupResponse.json();
        originalAdminToken = backupData.token;
        console.log('✅ Admin token backed up successfully');
      } else {
        console.warn('⚠️ Failed to backup admin token - continuing without backup');
      }

      // ✅ STEP 2: Start impersonation via GraphQL
      const { data } = await startImpersonationMutation({
        variables: {
          input: {
            targetUserId,
            reason,
          },
        },
      });

      if (!data?.startImpersonation) {
        throw new Error('No data returned from impersonation');
      }

      const { access_token, impersonatedUser, sessionId, expiresIn, message } = data.startImpersonation;

      console.log('🎭 Impersonation GraphQL response:', data.startImpersonation);

      // ✅ STEP 3: Save new impersonation token in httpOnly cookie via BFF
      const tokenResponse = await fetch('/api/auth/set-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: access_token }),
        credentials: 'include',
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to update authentication token');
      }

      console.log('✅ Impersonation token saved in cookie');

      // ✅ STEP 4: Update impersonation store with backup token
      setImpersonationState({
        originalAdminId: user.id,
        originalAdminEmail: user.email,
        originalAdminName: `${user.firstName} ${user.lastName}`,
        originalAdminToken, // ✅ Store backup token
        targetUserId: impersonatedUser.id,
        targetUserEmail: impersonatedUser.email,
        targetUserName: `${impersonatedUser.firstName} ${impersonatedUser.lastName}`,
        sessionId,
        expiresIn,
        reason,
      });

      toast.success(
        message || `Now impersonating ${impersonatedUser.firstName} ${impersonatedUser.lastName}`
      );

      // ✅ FORCE re-initialize auth to load impersonated user data with permissions
      console.log('🔄 Force re-initializing auth after impersonation...');
      await initializeAuth(true);

      // ✅ Wait a tick for Zustand store to propagate the state change
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('✅ Auth re-initialized, redirecting to dashboard...');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error starting impersonation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start impersonation';
      toast.error(errorMessage);
    }
  };

  const endImpersonation = async () => {
    const impersonationStore = useImpersonationStore.getState();
    const backupToken = impersonationStore.originalAdminToken;

    try {
      // ✅ LEVEL 1: Try GraphQL endImpersonation mutation
      console.log('🎭 Attempting to end impersonation via GraphQL...');
      const { data } = await endImpersonationMutation();

      if (!data?.endImpersonation) {
        throw new Error('No data returned from ending impersonation');
      }

      const { access_token } = data.endImpersonation;

      console.log('🎭 End impersonation response:', data.endImpersonation);

      // ✅ Restore admin token in httpOnly cookie via BFF
      const tokenResponse = await fetch('/api/auth/set-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: access_token }),
        credentials: 'include',
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to restore authentication token');
      }

      console.log('✅ Admin token restored in cookie (GraphQL)');

      toast.success('Impersonation ended successfully');

      // ✅ FORCE re-initialize auth to load original user data with permissions
      console.log('🔄 Force re-initializing auth after ending impersonation...');
      await initializeAuth(true);

      // Redirect to companies list
      router.push('/dashboard/companies');
    } catch (error) {
      console.error('❌ GraphQL endImpersonation failed:', error);

      // ✅ LEVEL 2: Try using backup token from localStorage
      if (backupToken) {
        try {
          console.log('🔄 Attempting recovery with backup token...');

          const backupTokenResponse = await fetch('/api/auth/set-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: backupToken }),
            credentials: 'include',
          });

          if (!backupTokenResponse.ok) {
            throw new Error('Backup token restoration failed');
          }

          console.log('✅ Admin token restored from backup');
          toast.warning('Session recovered using backup token');

          // ✅ FORCE re-initialize auth with backup token
          console.log('🔄 Force re-initializing auth after backup token recovery...');
          await initializeAuth(true);
          router.push('/dashboard/companies');
        } catch (backupError) {
          console.error('❌ Backup token recovery failed:', backupError);

          // ✅ LEVEL 3: Emergency logout
          await handleEmergencyLogout();
        }
      } else {
        // No backup token available
        console.error('❌ No backup token available');

        // ✅ LEVEL 3: Emergency logout
        await handleEmergencyLogout();
      }
    } finally {
      // ALWAYS clear impersonation store, even if there's an error
      // This ensures the UI is cleaned up even if the backend call fails
      clearImpersonationState();
    }
  };

  return {
    startImpersonation,
    endImpersonation,
    loading: startLoading || endLoading,
  };
}
