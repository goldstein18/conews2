"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

/**
 * Full-screen overlay shown during logout process
 * Includes auto-reset safety mechanism to prevent stuck overlay
 */
export function LogoutOverlay() {
  const { isLoggingOut } = useAuthStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoggingOut) {
      console.log('🚨 LogoutOverlay: isLoggingOut is TRUE');

      // Auto-reset after 3 seconds (safety fallback to prevent stuck overlay)
      timeoutRef.current = setTimeout(() => {
        console.error('⚠️ LogoutOverlay: Still visible after 3 seconds, forcing reset');

        // Force reset state
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('auth-logout-flag');

          // Hard reload to clean state
          window.location.replace('/');
        }
      }, 3000);
    } else {
      console.log('✅ LogoutOverlay: isLoggingOut is FALSE (hidden)');
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoggingOut]);

  if (!isLoggingOut) return null;

  const handleEmergencyReset = () => {
    console.log('🆘 Emergency reset triggered by user');

    if (typeof window !== 'undefined') {
      // Nuclear option: clear everything
      localStorage.clear();

      // Hard reload
      window.location.replace('/');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
        <h2 className="text-2xl font-semibold">Logging out...</h2>
        <p className="text-muted-foreground">Please wait</p>

        {/* Emergency reset button */}
        <div className="pt-8">
          <Button
            onClick={handleEmergencyReset}
            variant="outline"
            size="sm"
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            Force Reset (If Stuck)
          </Button>
        </div>
      </div>
    </div>
  );
}
