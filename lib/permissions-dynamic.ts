import type { User } from '@/types/user';
import { isSuperAdmin } from '@/lib/roles';

/**
 * Dynamic permission system that uses API data
 * This replaces the hard-coded permissions in /lib/permissions.ts
 */

/**
 * Check if user has a specific permission (dynamic version)
 */
export function hasPermission(user: User | null | undefined, permission: string): boolean {
  // SUPER_ADMIN has access to everything without permission validation
  if (isSuperAdmin(user)) return true;
  
  if (!user?.permissions) return false;
  return user.permissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions (dynamic version)
 */
export function hasAnyPermission(user: User | null | undefined, permissions: string[]): boolean {
  // SUPER_ADMIN has access to everything without permission validation
  if (isSuperAdmin(user)) return true;
  
  if (!user || permissions.length === 0) return permissions.length === 0; // If no permissions required, allow access
  if (!user.permissions) return false; // If user has no permissions loaded, deny access
  return permissions.some(permission => user.permissions!.includes(permission));
}

/**
 * Check if user has all of the specified permissions (dynamic version)
 */
export function hasAllPermissions(user: User | null | undefined, permissions: string[]): boolean {
  // SUPER_ADMIN has access to everything without permission validation
  if (isSuperAdmin(user)) return true;
  
  if (!user?.permissions || permissions.length === 0) return false;
  return permissions.every(permission => user.permissions!.includes(permission));
}

/**
 * Get all permissions for a user (dynamic version)
 */
export function getUserPermissions(user: User | null | undefined): string[] {
  return user?.permissions || [];
}

/**
 * Check if user can access a specific page/route based on required permissions
 */
export function canAccessPage(
  user: User | null | undefined, 
  requiredPermissions: string[]
): boolean {
  // SUPER_ADMIN has access to everything without permission validation
  if (isSuperAdmin(user)) return true;
  
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  return hasAnyPermission(user, requiredPermissions);
}

/**
 * Check if user has management permissions for a specific module (dynamic version)
 */
export function canManageModule(
  user: User | null | undefined, 
  module: 'companies' | 'employees' | 'calendar' | 'dining' | 'sales' | 'agency' | 'editorial'
): boolean {
  // SUPER_ADMIN has access to everything without permission validation
  if (isSuperAdmin(user)) return true;
  
  if (!user?.permissions) return false;
  
  // Map modules to their management permissions
  const managePermissions: Record<string, string[]> = {
    companies: ['company:manage', 'company:create', 'company:update', 'company:delete'],
    employees: ['user:manage', 'user:create', 'user:update', 'user:delete'],
    calendar: ['event:manage', 'event:create', 'event:update', 'event:delete'],
    dining: ['restaurant:manage', 'menu:manage'],
    sales: ['sale:manage', 'quote:manage'],
    agency: ['agency:manage'],
    editorial: ['article:manage', 'content:manage'],
  };
  
  const permissions = managePermissions[module] || [];
  return hasAnyPermission(user, permissions);
}

/**
 * Check if user can view a specific module
 */
export function canViewModule(
  user: User | null | undefined,
  module: 'companies' | 'employees' | 'audit' | 'calendar' | 'dining' | 'sales' | 'agency' | 'editorial'
): boolean {
  // SUPER_ADMIN has access to everything without permission validation
  if (isSuperAdmin(user)) return true;
  
  if (!user?.permissions) return false;
  
  // Map modules to their view permissions
  const viewPermissions: Record<string, string[]> = {
    companies: ['company:read', 'company:manage'],
    employees: ['user:read', 'user:manage'],
    audit: ['audit:read'],
    calendar: ['event:read', 'event:manage'],
    dining: ['restaurant:read', 'restaurant:manage'],
    sales: ['sale:read', 'sale:manage'],
    agency: ['agency:read', 'agency:manage'],
    editorial: ['article:read', 'article:manage'],
  };
  
  const permissions = viewPermissions[module] || [];
  return hasAnyPermission(user, permissions);
}

/**
 * Common permission checks for backward compatibility
 */
export function canManageCompanies(user: User | null | undefined): boolean {
  // SUPER_ADMIN has access to everything without permission validation
  if (isSuperAdmin(user)) return true;
  
  return hasAnyPermission(user, ['company:manage', 'company:create', 'company:update']);
}

export function canManageEmployees(user: User | null | undefined): boolean {
  // SUPER_ADMIN has access to everything without permission validation
  if (isSuperAdmin(user)) return true;
  
  return hasAnyPermission(user, ['user:manage', 'user:create', 'user:update']);
}

export function canViewAuditLogs(user: User | null | undefined): boolean {
  // SUPER_ADMIN has access to everything without permission validation
  if (isSuperAdmin(user)) return true;
  
  return hasPermission(user, 'audit:read');
}

export function canCreateEvents(user: User | null | undefined): boolean {
  // SUPER_ADMIN has access to everything without permission validation
  if (isSuperAdmin(user)) return true;
  
  return hasAnyPermission(user, ['event:create', 'event:manage']);
}

export function canManageEvents(user: User | null | undefined): boolean {
  // SUPER_ADMIN has access to everything without permission validation
  if (isSuperAdmin(user)) return true;
  
  return hasAnyPermission(user, ['event:manage', 'event:update', 'event:delete']);
}

export function canViewEvents(user: User | null | undefined): boolean {
  // SUPER_ADMIN has access to everything without permission validation
  if (isSuperAdmin(user)) return true;
  
  return hasAnyPermission(user, ['event:read', 'event:manage']);
}

/**
 * Advanced permission patterns
 */

/**
 * Check if user has permission with wildcard support
 * Examples: "user:*", "company:read", "event:*"
 */
export function hasWildcardPermission(
  user: User | null | undefined, 
  pattern: string
): boolean {
  // SUPER_ADMIN has access to everything without permission validation
  if (isSuperAdmin(user)) return true;
  
  if (!user?.permissions) return false;
  
  if (pattern.endsWith(':*')) {
    // Wildcard permission: check if user has any permission starting with the prefix
    const prefix = pattern.slice(0, -1); // Remove the '*'
    return user.permissions.some(permission => permission.startsWith(prefix));
  }
  
  // Exact match
  return user.permissions.includes(pattern);
}

/**
 * Check if user has elevated permissions (admin-level)
 */
export function hasElevatedPermissions(user: User | null | undefined): boolean {
  // SUPER_ADMIN has access to everything without permission validation
  if (isSuperAdmin(user)) return true;
  
  if (!user?.permissions) return false;
  
  const adminPermissions = [
    'user:manage',
    'company:manage', 
    'audit:read',
    'system:admin'
  ];
  
  return hasAnyPermission(user, adminPermissions);
}

/**
 * Check if user is super admin based on permissions
 */
export function isSuperAdminByPermissions(user: User | null | undefined): boolean {
  // SUPER_ADMIN has access to everything without permission validation
  if (isSuperAdmin(user)) return true;
  
  if (!user?.permissions) return false;
  
  return hasAnyPermission(user, ['system:admin', 'audit:read']) &&
         hasAllPermissions(user, ['user:manage', 'company:manage']);
}

/**
 * Get user's permission level (0-100)
 */
export function getUserPermissionLevel(user: User | null | undefined): number {
  if (!user?.permissions) return 0;
  
  const permissions = user.permissions;
  let level = 0;
  
  // Base permissions
  if (permissions.some(p => p.includes(':read'))) level += 10;
  if (permissions.some(p => p.includes(':create'))) level += 20;
  if (permissions.some(p => p.includes(':update'))) level += 20;
  if (permissions.some(p => p.includes(':delete'))) level += 20;
  if (permissions.some(p => p.includes(':manage'))) level += 30;
  
  // Admin permissions
  if (permissions.includes('user:manage')) level += 20;
  if (permissions.includes('company:manage')) level += 15;
  if (permissions.includes('audit:read')) level += 25;
  if (permissions.includes('system:admin')) level += 50;
  
  return Math.min(level, 100); // Cap at 100
}

/**
 * Filter permissions by resource
 */
export function getPermissionsByResource(
  user: User | null | undefined, 
  resource: string
): string[] {
  if (!user?.permissions) return [];
  
  return user.permissions.filter(permission => 
    permission.startsWith(`${resource}:`)
  );
}

/**
 * Get available actions for a resource
 */
export function getAvailableActions(
  user: User | null | undefined, 
  resource: string
): string[] {
  const permissions = getPermissionsByResource(user, resource);
  return permissions.map(permission => permission.split(':')[1]).filter(Boolean);
}

/**
 * Check if user can perform action on resource
 */
export function canPerformAction(
  user: User | null | undefined,
  resource: string,
  action: string
): boolean {
  // SUPER_ADMIN has access to everything without permission validation
  if (isSuperAdmin(user)) return true;
  
  return hasPermission(user, `${resource}:${action}`);
}

/**
 * Permission validation utilities
 */
export function validatePermissionFormat(permission: string): boolean {
  // Basic validation: should be in format "resource:action"
  const parts = permission.split(':');
  return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
}

export function normalizePermission(permission: string): string {
  return permission.toLowerCase().trim();
}

export function parsePermission(permission: string): { resource: string; action: string } | null {
  if (!validatePermissionFormat(permission)) return null;
  
  const [resource, action] = permission.split(':');
  return { resource, action };
}

/**
 * Debug utilities
 */
export function debugUserPermissions(user: User | null | undefined): void {
  if (!user) {
    console.log('🔒 No user provided');
    return;
  }
  
  console.log(`👤 User: ${user.email}`);
  console.log(`🎭 Role: ${user.role?.name || 'No role'}`);
  console.log(`📊 Permission Level: ${getUserPermissionLevel(user)}`);
  console.log(`🔑 Permissions (${user.permissions?.length || 0}):`, user.permissions || []);
  
  if (user.permissions) {
    const resourceMap = user.permissions.reduce((acc, permission) => {
      const parsed = parsePermission(permission);
      if (parsed) {
        if (!acc[parsed.resource]) acc[parsed.resource] = [];
        acc[parsed.resource].push(parsed.action);
      }
      return acc;
    }, {} as Record<string, string[]>);
    
    console.log('📋 Permissions by resource:', resourceMap);
  }
}