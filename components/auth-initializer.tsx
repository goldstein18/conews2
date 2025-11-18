"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const loadUserPermissions = useAuthStore((state) => state.loadUserPermissions);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const permissionsLoadedRef = useRef(false);

  useEffect(() => {
    // Initialize auth first
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Load permissions after user is authenticated (Apollo Client is now available)
    // Only load once per session using ref
    if (isAuthenticated && user && !user.permissions && !permissionsLoadedRef.current) {
      console.log('🔑 Scheduling permission load from AuthInitializer...');
      permissionsLoadedRef.current = true;

      // Small delay to ensure Apollo Provider is fully mounted
      setTimeout(() => {
        loadUserPermissions().catch((error) => {
          console.warn('Permissions load failed, app will work without them:', error);
          // Don't reset ref - we tried once, that's enough
          // App should work fine without permissions
        });
      }, 100);
    }

    // Reset ref when user logs out
    if (!isAuthenticated) {
      permissionsLoadedRef.current = false;
    }
  }, [isAuthenticated, user, loadUserPermissions]);

  return <>{children}</>;
}