"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/lib/toast-utils";
import { useAuthStore } from "@/store/auth-store";
import { canAccessDashboard } from "@/types/user";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Extract token and provider from URL query params
        const token = searchParams.get('token');
        const provider = searchParams.get('provider');

        if (!token) {
          setError('No authentication token received');
          showErrorToast('Authentication failed. Please try again.');
          setTimeout(() => router.push('/auth/login'), 2000);
          return;
        }

        console.log(`🔐 Processing ${provider || 'OAuth'} callback...`);

        // Store token in httpOnly cookie via BFF endpoint
        const response = await fetch('/api/auth/set-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('Failed to store authentication token');
        }

        const { user } = await response.json();

        // Save user data to store
        login(user);

        const providerName = provider === 'google' ? 'Google' :
                           provider === 'facebook' ? 'Facebook' :
                           'OAuth';

        showSuccessToast(`Welcome ${user.firstName}! Signed in with ${providerName}`);

        // Determine redirect path based on user role
        const redirectPath = user.role && canAccessDashboard(user.role.name)
          ? "/dashboard"
          : "/subscriber";

        // Redirect to appropriate page
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 500);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setError('Failed to complete authentication');
        showErrorToast('Authentication failed. Please try again.');

        // Redirect to login after error
        setTimeout(() => router.push('/auth/login'), 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    processOAuthCallback();
  }, [searchParams, router, login]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="text-center space-y-4">
        {isProcessing && !error && (
          <>
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <h2 className="text-xl font-semibold">Completing sign in...</h2>
            <p className="text-muted-foreground">Please wait while we authenticate your account</p>
          </>
        )}

        {error && (
          <>
            <div className="text-destructive text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-destructive">Authentication Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground">Redirecting to login page...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <h2 className="text-xl font-semibold">Loading...</h2>
          </div>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
