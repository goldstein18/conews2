'use client';

import { useAuthStore } from '@/store/auth-store';
import { hasRole, hasAnyRole, hasMinimumRole, isSuperAdmin, isAdmin } from '@/lib/roles';
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions, 
  canAccessPage,
  canManageCompanies,
  canManageEmployees,
  canViewAuditLogs
} from '@/lib/permissions-dynamic';
import type { User } from '@/types/user';

interface UseRoleAccessOptions {
  requiredRoles?: string[];
  requiredPermissions?: string[]; // Changed from Permission[] to string[]
  minimumRole?: string;
  redirectPath?: string;
}

interface UseRoleAccessReturn {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Role checks
  hasAccess: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasMinimumRole: (minimumRole: string) => boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  
  // Permission checks
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  canAccessPage: (requiredPermissions: string[]) => boolean;
  
  // UI helpers
  showUnauthorized: boolean;
  accessDeniedReason: string | null;
}

/**
 * Hook for role-based access control
 * 
 * @param options Configuration object with access requirements
 * @returns Object with user state, access checks, and UI helpers
 */
export function useRoleAccess(options: UseRoleAccessOptions = {}): UseRoleAccessReturn {
  const { 
    requiredRoles = [], 
    requiredPermissions = [], 
    minimumRole,
    redirectPath = '/dashboard'
  } = options;
  
  const { user, isAuthenticated, isInitializing, isLoadingPermissions } = useAuthStore();
  
  // SUPER_ADMIN bypass - has access to everything
  const superAdminBypass = isSuperAdmin(user);
  
  // Basic access checks (skipped for SUPER_ADMIN)
  const roleAccess = superAdminBypass || (requiredRoles.length > 0
    ? hasAnyRole(user, requiredRoles)
    : false); // Changed from true to false - roles are optional

  const permissionAccess = superAdminBypass || (requiredPermissions.length > 0
    ? hasAnyPermission(user, requiredPermissions)
    : false); // Changed from true to false - permissions are optional

  const minimumRoleAccess = superAdminBypass || (minimumRole
    ? hasMinimumRole(user, minimumRole)
    : true);

  // Use OR logic: user needs EITHER required role OR required permissions (or both)
  // If both are specified, user needs at least one
  const hasRoleOrPermission = requiredRoles.length > 0 || requiredPermissions.length > 0
    ? (roleAccess || permissionAccess)
    : true; // No requirements means access granted

  const hasAccess = isAuthenticated && hasRoleOrPermission && minimumRoleAccess;
  
  // Determine why access was denied (skip for SUPER_ADMIN)
  let accessDeniedReason: string | null = null;
  if (!isInitializing && user && !superAdminBypass) {
    if (!hasRoleOrPermission) {
      // Build a helpful error message
      const rolePart = requiredRoles.length > 0
        ? `rol: ${requiredRoles.join(' o ')}`
        : '';
      const permissionPart = requiredPermissions.length > 0
        ? `permisos: ${requiredPermissions.join(', ')}`
        : '';
      const separator = rolePart && permissionPart ? ' o ' : '';

      accessDeniedReason = `Requiere ${rolePart}${separator}${permissionPart}`;
    } else if (!minimumRoleAccess && minimumRole) {
      accessDeniedReason = `Requiere rol ${minimumRole} o superior`;
    }
  }
  
  const showUnauthorized = !isInitializing && isAuthenticated && !hasAccess;
  
  return {
    // User state
    user,
    isAuthenticated,
    isLoading: isInitializing || isLoadingPermissions,
    
    // Access control
    hasAccess,
    hasRole: (role: string) => hasRole(user, role),
    hasAnyRole: (roles: string[]) => hasAnyRole(user, roles),
    hasMinimumRole: (role: string) => hasMinimumRole(user, role),
    isSuperAdmin: isSuperAdmin(user),
    isAdmin: isAdmin(user),
    
    // Permission checks
    hasPermission: (permission: string) => hasPermission(user, permission),
    hasAnyPermission: (permissions: string[]) => hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions: string[]) => hasAllPermissions(user, permissions),
    canAccessPage: (requiredPermissions: string[]) => canAccessPage(user, requiredPermissions),
    
    // UI helpers
    showUnauthorized,
    accessDeniedReason,
  };
}

/**
 * Simple hook to check if user has specific roles
 */
export function useHasRole(roles: string | string[]): boolean {
  const { user } = useAuthStore();
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return hasAnyRole(user, roleArray);
}

/**
 * Simple hook to check if user has specific permissions
 */
export function useHasPermission(permissions: string | string[]): boolean {
  const { user } = useAuthStore();
  const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
  return hasAnyPermission(user, permissionArray);
}

/**
 * Hook to check if user can access a page with required permissions
 */
export function useCanAccessPage(requiredPermissions: string[]): boolean {
  const { user } = useAuthStore();
  return canAccessPage(user, requiredPermissions);
}

/**
 * Hook for admin-only access
 */
export function useAdminAccess() {
  return useRoleAccess({
    requiredRoles: ['SUPER_ADMIN', 'ADMIN']
  });
}

/**
 * Hook for super admin-only access
 */
export function useSuperAdminAccess() {
  return useRoleAccess({
    requiredRoles: ['SUPER_ADMIN']
  });
}