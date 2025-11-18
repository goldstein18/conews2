import type { User, DashboardRole } from '@/types/user';

// Role hierarchy - higher roles inherit permissions from lower roles
const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 80,
  SALES: 60,
  AGENCY: 50,
  EDITORIAL_WRITER: 40,
  CALENDAR_MEMBER: 30,
  DINNING_MEMBER: 20,
} as const;

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null | undefined, role: string): boolean {
  if (!user?.role?.name) return false;
  return user.role.name === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: User | null | undefined, roles: string[]): boolean {
  if (!user?.role?.name) return false;
  return roles.includes(user.role.name);
}

/**
 * Check if user has all of the specified roles (useful for complex permissions)
 */
export function hasAllRoles(user: User | null | undefined, roles: string[]): boolean {
  if (!user?.role?.name) return false;
  // For single role system, this checks if user's role is in all required roles
  return roles.length === 1 && roles.includes(user.role.name);
}

/**
 * Check if user's role is at or above a minimum role level
 */
export function hasMinimumRole(user: User | null | undefined, minimumRole: string): boolean {
  if (!user?.role?.name) return false;
  
  const userRoleLevel = ROLE_HIERARCHY[user.role.name];
  const minimumRoleLevel = ROLE_HIERARCHY[minimumRole];
  
  if (userRoleLevel === undefined || minimumRoleLevel === undefined) {
    return false;
  }
  
  return userRoleLevel >= minimumRoleLevel;
}

/**
 * Get user's role hierarchy level
 */
export function getRoleLevel(user: User | null | undefined): number {
  if (!user?.role?.name) return 0;
  return ROLE_HIERARCHY[user.role.name] || 0;
}

/**
 * Check if user is Super Admin (highest privilege)
 */
export function isSuperAdmin(user: User | null | undefined): boolean {
  return hasRole(user, 'SUPER_ADMIN');
}

/**
 * Check if user is Admin or above
 */
export function isAdmin(user: User | null | undefined): boolean {
  return hasAnyRole(user, ['SUPER_ADMIN', 'ADMIN']);
}

/**
 * Check if user can manage companies (Admin+)
 */
export function canManageCompanies(user: User | null | undefined): boolean {
  return hasAnyRole(user, ['SUPER_ADMIN', 'ADMIN']);
}

/**
 * Check if user can manage employees (Admin+)
 */
export function canManageEmployees(user: User | null | undefined): boolean {
  return hasAnyRole(user, ['SUPER_ADMIN', 'ADMIN']);
}

/**
 * Check if user can view audit logs (Super Admin only)
 */
export function canViewAuditLogs(user: User | null | undefined): boolean {
  return hasRole(user, 'SUPER_ADMIN');
}

/**
 * Get human-readable role display name
 */
export function getRoleDisplayName(roleName?: string): string {
  const roleNames: Record<string, string> = {
    SUPER_ADMIN: 'Super Administrador',
    ADMIN: 'Administrador',
    SALES: 'Ventas',
    AGENCY: 'Agencia',
    EDITORIAL_WRITER: 'Editor',
    CALENDAR_MEMBER: 'Miembro Calendario',
    DINNING_MEMBER: 'Miembro Comedor',
  };

  return roleNames[roleName || ''] || roleName || 'Sin rol';
}

/**
 * Get role badge color for UI
 */
export function getRoleBadgeColor(roleName?: string): string {
  const roleColors: Record<string, string> = {
    SUPER_ADMIN: 'bg-red-100 text-red-800',
    ADMIN: 'bg-blue-100 text-blue-800',
    SALES: 'bg-green-100 text-green-800',
    AGENCY: 'bg-purple-100 text-purple-800',
    EDITORIAL_WRITER: 'bg-yellow-100 text-yellow-800',
    CALENDAR_MEMBER: 'bg-indigo-100 text-indigo-800',
    DINNING_MEMBER: 'bg-pink-100 text-pink-800',
  };

  return roleColors[roleName || ''] || 'bg-gray-100 text-gray-800';
}

/**
 * Type guard to check if role name is valid
 */
export function isValidRole(role: string): role is DashboardRole {
  return Object.keys(ROLE_HIERARCHY).includes(role);
}