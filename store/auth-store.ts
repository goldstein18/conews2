import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';
import { setUserContext } from '@/lib/sentry';
import { PermissionsAPI } from '@/lib/services/permissions-api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoadingPermissions: boolean;
  isLoggingOut: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  setUser: (user: User | null) => void;
  initializeAuth: (force?: boolean) => Promise<void>;
  loadUserPermissions: (companyId?: string) => Promise<void>;
  refreshPermissions: (companyId?: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isInitializing: true,
      isLoadingPermissions: false,
      isLoggingOut: false,
      login: async (user) => {
        set({
          user,
          isAuthenticated: true,
          isInitializing: false,
        });
        
        // Set Sentry user context
        setUserContext({
          id: user.id,
          email: user.email,
          role: user.role?.name || 'unknown',
        });

        // Load user permissions after login
        await get().loadUserPermissions();
      },
      logout: async () => {
        try {
          console.log('🚪 Starting logout process...');

          // Set logging out state FIRST (prevents UI flashing)
          set({ isLoggingOut: true });

          // Clear localStorage and cookies
          if (typeof window !== 'undefined') {
            try {
              // Set logout flag BEFORE clearing (synchronous write to prevent race condition)
              localStorage.setItem('auth-logout-flag', 'true');
              console.log('🚩 Logout flag set');

              // Clear cookies from client side
              document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              document.cookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              console.log('🗑️ Client-side cookies cleared');

              // Small delay to ensure localStorage write completes before reload
              await new Promise(resolve => setTimeout(resolve, 50));

              // Clear auth storage
              localStorage.removeItem('auth-storage');
              console.log('🗑️ localStorage cleared');

            } catch (storageError) {
              console.error('🗑️ Error clearing storage:', storageError);
            }
          }

          // Clear the local state
          try {
            set({
              user: null,
              isAuthenticated: false,
              isInitializing: false,
              isLoggingOut: true, // Keep this true during redirect
            });

            // Clear Sentry user context
            setUserContext({ id: '', email: '', role: '' });
            console.log('🗑️ Auth state cleared');
          } catch (stateError) {
            console.error('🗑️ Error clearing state:', stateError);
          }

          // Call logout endpoint in background (don't await)
          fetch('/api/auth/force-logout', {
            method: 'POST',
            credentials: 'include',
          }).catch((error) => {
            console.error('🚪 Logout endpoint error:', error);
          });

          // Redirect to home
          console.log('🔀 Redirecting to home...');
          window.location.replace('/');

        } catch (overallError) {
          console.error('🚪 Overall logout error:', overallError);
          // Emergency redirect
          window.location.replace('/');
        }
      },
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
      setUser: (user) => set({
        user,
        isInitializing: false,
        isAuthenticated: user !== null
      }),
      initializeAuth: async (force = false) => {
        // Prevent multiple simultaneous initialization calls, but allow if we have no user OR force is true
        const currentState = get();
        if (!force && !currentState.isInitializing && currentState.user) {
          console.log('Auth already initialized with user, skipping (use force=true to re-initialize)');
          return;
        }

        console.log('🔐 Initializing auth...', force ? '(FORCED)' : '');
        set({ isInitializing: true });

        try {
          // ✅ IMPORTANT: We can't check httpOnly cookies from JavaScript
          // Always try to fetch user data - the backend will check the cookie
          console.log('🔑 Fetching user data from /api/auth/me...');

          // Check authentication status via BFF endpoint
          const response = await fetch('/api/auth/me', {
            credentials: 'include',
          });

          if (response.ok) {
            const { user } = await response.json();
            console.log('✅ Auth initialized successfully:', {
              email: user.email,
              role: user.role?.name,
              firstName: user.firstName,
              lastName: user.lastName,
            });
            set({
              user,
              isAuthenticated: true,
              isInitializing: false,
            });
            
            // Set Sentry user context on auth initialization
            setUserContext({
              id: user.id,
              email: user.email,
              role: user.role?.name || 'unknown',
            });

            // Don't load permissions here - AuthInitializer will handle it when Apollo is ready
            // This prevents "Invariant Violation" errors from Apollo Client being called too early
          } else {
            // Only log error if we're not in a public route
            const isPublicRoute = typeof window !== 'undefined' && 
              ['/auth/login', '/auth/register', '/'].some(path => 
                window.location.pathname === path || window.location.pathname.startsWith(path + '/')
              );
            
            if (!isPublicRoute) {
              console.log('Auth initialization failed, user not authenticated');
            }
            
            set({
              user: null,
              isAuthenticated: false,
              isInitializing: false,
            });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({
            user: null,
            isAuthenticated: false,
            isInitializing: false,
          });
        }
      },

      // Permission management
      loadUserPermissions: async (companyId?: string) => {
        const { user, isAuthenticated } = get();

        // Don't try to load permissions if not authenticated
        if (!isAuthenticated || !user) {
          console.log('⏭️ Skipping permission load: user not authenticated');
          return;
        }

        set({ isLoadingPermissions: true });

        try {
          const permissions = await PermissionsAPI.getMyPermissions(companyId);

          set({
            user: { ...user, permissions },
            isLoadingPermissions: false,
          });

          console.log('✅ Permissions loaded successfully');
        } catch (error) {
          // Check if error is due to Apollo Client not being initialized
          const errorMessage = error instanceof Error ? error.message : String(error);

          if (errorMessage.includes('PermissionsAPI not initialized') ||
              errorMessage.includes('Invariant Violation')) {
            console.warn('⚠️ Apollo Client not ready, skipping permissions for now');
            set({ isLoadingPermissions: false });
            // Don't throw - return gracefully so app doesn't crash
            return;
          }

          console.error('Error loading user permissions:', error);
          set({ isLoadingPermissions: false });
          // Don't throw - return gracefully so app continues to work
          return;
        }
      },

      refreshPermissions: async (companyId?: string) => {
        const { user } = get();
        if (!user) return;

        try {
          const permissions = await PermissionsAPI.refreshUserPermissions(companyId);
          
          set({
            user: { ...user, permissions }
          });
        } catch (error) {
          console.error('Error refreshing permissions:', error);
        }
      },

      hasPermission: (permission: string) => {
        const { user } = get();
        return user?.permissions?.includes(permission) || false;
      },

      hasAnyPermission: (permissions: string[]) => {
        const { user } = get();
        if (!user?.permissions) return false;
        return permissions.some(permission => user.permissions!.includes(permission));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
        // Don't persist isLoggingOut or isInitializing - always reset on reload
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, sync state with server cookies (single source of truth)
        if (state && typeof window !== 'undefined') {
          // ALWAYS reset isInitializing and isLoggingOut on rehydration (they should never persist)
          state.isInitializing = true; // Start as true, AuthInitializer will set to false
          state.isLoggingOut = false;

          console.log('💾 Rehydrating auth state...');

          // Safety check: if we're on home page and isLoggingOut is true, it's a bug
          const isHomePage = window.location.pathname === '/';

          if (isHomePage && state.isLoggingOut) {
            console.error('🐛 BUG DETECTED: isLoggingOut is true on home page, forcing complete reset');
            state.user = null;
            state.isAuthenticated = false;
            state.isInitializing = false;
            state.isLoggingOut = false;
            localStorage.removeItem('auth-storage');
            localStorage.removeItem('auth-logout-flag');
            return;
          }

          // Check logout flag FIRST (before anything else)
          const logoutFlag = localStorage.getItem('auth-logout-flag');

          if (logoutFlag === 'true') {
            console.log('🚩 Logout flag detected, forcing empty state');

            // Clear the flag
            localStorage.removeItem('auth-logout-flag');

            // Force empty state immediately (before any renders)
            state.user = null;
            state.isAuthenticated = false;
            state.isInitializing = false;
            state.isLoggingOut = false; // Explicitly set to false

            // Clear auth storage (cleanup)
            localStorage.removeItem('auth-storage');

            return; // Exit early
          }

          // We can't check httpOnly cookies from JavaScript
          // Instead, we let AuthInitializer verify authentication with the server
          // If localStorage has user data but no valid token, /api/auth/me will return 401
          // and AuthInitializer will clear the state automatically
          console.log('💾 State rehydrated, AuthInitializer will verify with server');

          // Keep isInitializing as true so AuthInitializer can verify
          // It will be set to false after /api/auth/me responds
        }
      },
    }
  )
);
