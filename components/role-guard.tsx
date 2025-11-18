'use client';

import { useRoleAccess, useHasRole, useHasPermission } from '@/hooks/use-role-access';

interface RoleGuardProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
  minimumRole?: string;
  fallback?: React.ReactNode;
  requireAll?: boolean; // If true, user must have ALL roles/permissions. If false, ANY will do.
  inverse?: boolean; // If true, show content when user DOESN'T have access
}

/**
 * Component that conditionally renders children based on user roles/permissions
 * 
 * @param props Configuration for role-based rendering
 */
export function RoleGuard({
  children,
  roles = [],
  permissions = [],
  minimumRole,
  fallback = null,
  requireAll = false,
  inverse = false,
}: RoleGuardProps) {
  const {
    hasAnyRole,
    hasMinimumRole: checkMinimumRole,
    hasAnyPermission,
    hasAllPermissions,
    isLoading,
  } = useRoleAccess({
    requiredRoles: roles,
    requiredPermissions: permissions,
    minimumRole,
  });

  // Don't render anything while loading
  if (isLoading) {
    return null;
  }

  let shouldRender = false;

  // Check roles
  if (roles.length > 0) {
    if (requireAll) {
      // For single role system, requireAll means user must have the exact role
      shouldRender = roles.length === 1 ? hasAnyRole(roles) : false;
    } else {
      shouldRender = hasAnyRole(roles);
    }
  }

  // Check permissions (if roles passed, this adds to the check)
  if (permissions.length > 0) {
    const permissionCheck = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
    
    if (roles.length > 0) {
      shouldRender = shouldRender && permissionCheck;
    } else {
      shouldRender = permissionCheck;
    }
  }

  // Check minimum role
  if (minimumRole) {
    const minimumRoleCheck = checkMinimumRole(minimumRole);
    
    if (roles.length > 0 || permissions.length > 0) {
      shouldRender = shouldRender && minimumRoleCheck;
    } else {
      shouldRender = minimumRoleCheck;
    }
  }

  // If no criteria specified, default to showing content
  if (roles.length === 0 && permissions.length === 0 && !minimumRole) {
    shouldRender = true;
  }

  // Apply inverse logic if specified
  if (inverse) {
    shouldRender = !shouldRender;
  }

  return shouldRender ? <>{children}</> : <>{fallback}</>;
}

/**
 * Simple role-based guard that shows/hides content based on roles
 */
export function ShowForRoles({ 
  roles, 
  children, 
  fallback = null 
}: { 
  roles: string | string[]; 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return (
    <RoleGuard roles={roleArray} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

/**
 * Simple permission-based guard
 */
export function ShowForPermissions({ 
  permissions, 
  children, 
  fallback = null 
}: { 
  permissions: string | string[]; 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
  return (
    <RoleGuard permissions={permissionArray} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

/**
 * Guard that shows content only for Super Admins
 */
export function SuperAdminOnly({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  return (
    <RoleGuard roles={['SUPER_ADMIN']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

/**
 * Guard that shows content for Admins and above
 */
export function AdminAndAbove({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  return (
    <RoleGuard roles={['SUPER_ADMIN', 'ADMIN']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

/**
 * Guard that hides content from certain roles (inverse guard)
 */
export function HideFromRoles({ 
  roles, 
  children, 
  fallback = null 
}: { 
  roles: string | string[]; 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return (
    <RoleGuard roles={roleArray} inverse fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

/**
 * Conditional rendering based on user authentication status
 */
export function AuthGuard({ 
  children, 
  fallback = null,
  requireAuth = true
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}) {
  const { isAuthenticated, isLoading } = useRoleAccess();

  if (isLoading) {
    return null;
  }

  const shouldShow = requireAuth ? isAuthenticated : !isAuthenticated;
  
  return shouldShow ? <>{children}</> : <>{fallback}</>;
}

/**
 * Show content only for authenticated users
 */
export function AuthenticatedOnly({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={true} fallback={fallback}>
      {children}
    </AuthGuard>
  );
}

/**
 * Show content only for unauthenticated users
 */
export function UnauthenticatedOnly({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={false} fallback={fallback}>
      {children}
    </AuthGuard>
  );
}

/**
 * Preset guards for common role combinations
 */
export const RoleGuards = {
  SuperAdminOnly,
  AdminAndAbove,
  AuthenticatedOnly,
  UnauthenticatedOnly,
} as const;

/**
 * Hook-based guards for use in components that need the values
 */
export function useRoleGuard(roles: string | string[]) {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return useHasRole(roleArray);
}

export function usePermissionGuard(permissions: string | string[]) {
  const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
  return useHasPermission(permissionArray);
}