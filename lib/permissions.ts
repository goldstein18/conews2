import type { User } from '@/types/user';

// Define all available permissions in the system
export const PERMISSIONS = {
  // Company management
  VIEW_COMPANIES: 'view_companies',
  MANAGE_COMPANIES: 'manage_companies',
  CREATE_COMPANIES: 'create_companies',
  EDIT_COMPANIES: 'edit_companies',
  DELETE_COMPANIES: 'delete_companies',
  
  // Employee management
  VIEW_EMPLOYEES: 'view_employees',
  MANAGE_EMPLOYEES: 'manage_employees',
  CREATE_EMPLOYEES: 'create_employees',
  EDIT_EMPLOYEES: 'edit_employees',
  DELETE_EMPLOYEES: 'delete_employees',
  
  // Audit logs
  VIEW_AUDIT: 'view_audit',
  MANAGE_AUDIT: 'manage_audit',
  
  // Calendar management
  VIEW_CALENDAR: 'view_calendar',
  MANAGE_CALENDAR: 'manage_calendar',
  CREATE_EVENTS: 'create_events',
  EDIT_EVENTS: 'edit_events',
  DELETE_EVENTS: 'delete_events',
  
  // Dining management
  VIEW_DINING: 'view_dining',
  MANAGE_DINING: 'manage_dining',
  CREATE_MENU: 'create_menu',
  EDIT_MENU: 'edit_menu',
  
  // Sales management
  VIEW_SALES: 'view_sales',
  MANAGE_SALES: 'manage_sales',
  CREATE_QUOTES: 'create_quotes',
  EDIT_QUOTES: 'edit_quotes',
  
  // Agency management
  VIEW_AGENCY: 'view_agency',
  MANAGE_AGENCY: 'manage_agency',
  
  // Editorial management
  VIEW_EDITORIAL: 'view_editorial',
  MANAGE_EDITORIAL: 'manage_editorial',
  CREATE_CONTENT: 'create_content',
  EDIT_CONTENT: 'edit_content',
  PUBLISH_CONTENT: 'publish_content',
  
  // System administration
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_SETTINGS: 'manage_settings',
  SYSTEM_CONFIG: 'system_config',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Map roles to their permissions
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  SUPER_ADMIN: [
    // All permissions for super admin
    PERMISSIONS.VIEW_COMPANIES,
    PERMISSIONS.MANAGE_COMPANIES,
    PERMISSIONS.CREATE_COMPANIES,
    PERMISSIONS.EDIT_COMPANIES,
    PERMISSIONS.DELETE_COMPANIES,
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.MANAGE_EMPLOYEES,
    PERMISSIONS.CREATE_EMPLOYEES,
    PERMISSIONS.EDIT_EMPLOYEES,
    PERMISSIONS.DELETE_EMPLOYEES,
    PERMISSIONS.VIEW_AUDIT,
    PERMISSIONS.MANAGE_AUDIT,
    PERMISSIONS.VIEW_CALENDAR,
    PERMISSIONS.MANAGE_CALENDAR,
    PERMISSIONS.CREATE_EVENTS,
    PERMISSIONS.EDIT_EVENTS,
    PERMISSIONS.DELETE_EVENTS,
    PERMISSIONS.VIEW_DINING,
    PERMISSIONS.MANAGE_DINING,
    PERMISSIONS.CREATE_MENU,
    PERMISSIONS.EDIT_MENU,
    PERMISSIONS.VIEW_SALES,
    PERMISSIONS.MANAGE_SALES,
    PERMISSIONS.CREATE_QUOTES,
    PERMISSIONS.EDIT_QUOTES,
    PERMISSIONS.VIEW_AGENCY,
    PERMISSIONS.MANAGE_AGENCY,
    PERMISSIONS.VIEW_EDITORIAL,
    PERMISSIONS.MANAGE_EDITORIAL,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.PUBLISH_CONTENT,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.SYSTEM_CONFIG,
  ],
  
  ADMIN: [
    PERMISSIONS.VIEW_COMPANIES,
    PERMISSIONS.MANAGE_COMPANIES,
    PERMISSIONS.CREATE_COMPANIES,
    PERMISSIONS.EDIT_COMPANIES,
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.MANAGE_EMPLOYEES,
    PERMISSIONS.CREATE_EMPLOYEES,
    PERMISSIONS.EDIT_EMPLOYEES,
    PERMISSIONS.VIEW_CALENDAR,
    PERMISSIONS.MANAGE_CALENDAR,
    PERMISSIONS.CREATE_EVENTS,
    PERMISSIONS.EDIT_EVENTS,
    PERMISSIONS.VIEW_DINING,
    PERMISSIONS.VIEW_SALES,
    PERMISSIONS.VIEW_AGENCY,
    PERMISSIONS.VIEW_EDITORIAL,
    PERMISSIONS.MANAGE_USERS,
  ],
  
  CALENDAR_MEMBER: [
    PERMISSIONS.VIEW_CALENDAR,
    PERMISSIONS.MANAGE_CALENDAR,
    PERMISSIONS.CREATE_EVENTS,
    PERMISSIONS.EDIT_EVENTS,
    PERMISSIONS.DELETE_EVENTS,
  ],
  
  DINNING_MEMBER: [
    PERMISSIONS.VIEW_DINING,
    PERMISSIONS.MANAGE_DINING,
    PERMISSIONS.CREATE_MENU,
    PERMISSIONS.EDIT_MENU,
  ],
  
  SALES: [
    PERMISSIONS.VIEW_SALES,
    PERMISSIONS.MANAGE_SALES,
    PERMISSIONS.CREATE_QUOTES,
    PERMISSIONS.EDIT_QUOTES,
    PERMISSIONS.VIEW_COMPANIES,
  ],
  
  AGENCY: [
    PERMISSIONS.VIEW_AGENCY,
    PERMISSIONS.MANAGE_AGENCY,
    PERMISSIONS.VIEW_COMPANIES,
  ],
  
  EDITORIAL_WRITER: [
    PERMISSIONS.VIEW_EDITORIAL,
    PERMISSIONS.MANAGE_EDITORIAL,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.PUBLISH_CONTENT,
  ],
};

// Page-based permission mapping for route protection
export const PAGE_PERMISSIONS: Record<string, Permission[]> = {
  '/dashboard/companies': [PERMISSIONS.VIEW_COMPANIES],
  '/dashboard/employees': [PERMISSIONS.VIEW_EMPLOYEES],
  '/dashboard/audit': [PERMISSIONS.VIEW_AUDIT],
  '/dashboard/calendar': [PERMISSIONS.VIEW_CALENDAR],
  '/dashboard/dining': [PERMISSIONS.VIEW_DINING],
  '/dashboard/sales': [PERMISSIONS.VIEW_SALES],
  '/dashboard/agency': [PERMISSIONS.VIEW_AGENCY],
  '/dashboard/editorial': [PERMISSIONS.VIEW_EDITORIAL],
};

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: User | null | undefined, permission: Permission): boolean {
  if (!user?.role?.name) return false;
  
  const userPermissions = ROLE_PERMISSIONS[user.role.name] || [];
  return userPermissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(user: User | null | undefined, permissions: Permission[]): boolean {
  if (!user?.role?.name || permissions.length === 0) return false;
  
  const userPermissions = ROLE_PERMISSIONS[user.role.name] || [];
  return permissions.some(permission => userPermissions.includes(permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(user: User | null | undefined, permissions: Permission[]): boolean {
  if (!user?.role?.name || permissions.length === 0) return false;
  
  const userPermissions = ROLE_PERMISSIONS[user.role.name] || [];
  return permissions.every(permission => userPermissions.includes(permission));
}

/**
 * Get all permissions for a user
 */
export function getUserPermissions(user: User | null | undefined): Permission[] {
  if (!user?.role?.name) return [];
  return ROLE_PERMISSIONS[user.role.name] || [];
}

/**
 * Check if user can access a specific page/route
 */
export function canAccessPage(user: User | null | undefined, page: string): boolean {
  const requiredPermissions = PAGE_PERMISSIONS[page];
  if (!requiredPermissions) return true; // Page doesn't require specific permissions
  
  return hasAnyPermission(user, requiredPermissions);
}

/**
 * Get permissions required for a specific page
 */
export function getPagePermissions(page: string): Permission[] {
  return PAGE_PERMISSIONS[page] || [];
}

/**
 * Check if user has management permissions for a specific module
 */
export function canManageModule(user: User | null | undefined, module: 'companies' | 'employees' | 'calendar' | 'dining' | 'sales' | 'agency' | 'editorial'): boolean {
  if (!user?.role?.name) return false;
  
  const managePermissions: Record<string, Permission> = {
    companies: PERMISSIONS.MANAGE_COMPANIES,
    employees: PERMISSIONS.MANAGE_EMPLOYEES,
    calendar: PERMISSIONS.MANAGE_CALENDAR,
    dining: PERMISSIONS.MANAGE_DINING,
    sales: PERMISSIONS.MANAGE_SALES,
    agency: PERMISSIONS.MANAGE_AGENCY,
    editorial: PERMISSIONS.MANAGE_EDITORIAL,
  };
  
  return hasPermission(user, managePermissions[module]);
}

/**
 * Get human-readable permission name
 */
export function getPermissionDisplayName(permission: Permission): string {
  const permissionNames: Record<Permission, string> = {
    [PERMISSIONS.VIEW_COMPANIES]: 'Ver Empresas',
    [PERMISSIONS.MANAGE_COMPANIES]: 'Gestionar Empresas',
    [PERMISSIONS.CREATE_COMPANIES]: 'Crear Empresas',
    [PERMISSIONS.EDIT_COMPANIES]: 'Editar Empresas',
    [PERMISSIONS.DELETE_COMPANIES]: 'Eliminar Empresas',
    [PERMISSIONS.VIEW_EMPLOYEES]: 'Ver Empleados',
    [PERMISSIONS.MANAGE_EMPLOYEES]: 'Gestionar Empleados',
    [PERMISSIONS.CREATE_EMPLOYEES]: 'Crear Empleados',
    [PERMISSIONS.EDIT_EMPLOYEES]: 'Editar Empleados',
    [PERMISSIONS.DELETE_EMPLOYEES]: 'Eliminar Empleados',
    [PERMISSIONS.VIEW_AUDIT]: 'Ver Auditoría',
    [PERMISSIONS.MANAGE_AUDIT]: 'Gestionar Auditoría',
    [PERMISSIONS.VIEW_CALENDAR]: 'Ver Calendario',
    [PERMISSIONS.MANAGE_CALENDAR]: 'Gestionar Calendario',
    [PERMISSIONS.CREATE_EVENTS]: 'Crear Eventos',
    [PERMISSIONS.EDIT_EVENTS]: 'Editar Eventos',
    [PERMISSIONS.DELETE_EVENTS]: 'Eliminar Eventos',
    [PERMISSIONS.VIEW_DINING]: 'Ver Comedor',
    [PERMISSIONS.MANAGE_DINING]: 'Gestionar Comedor',
    [PERMISSIONS.CREATE_MENU]: 'Crear Menú',
    [PERMISSIONS.EDIT_MENU]: 'Editar Menú',
    [PERMISSIONS.VIEW_SALES]: 'Ver Ventas',
    [PERMISSIONS.MANAGE_SALES]: 'Gestionar Ventas',
    [PERMISSIONS.CREATE_QUOTES]: 'Crear Cotizaciones',
    [PERMISSIONS.EDIT_QUOTES]: 'Editar Cotizaciones',
    [PERMISSIONS.VIEW_AGENCY]: 'Ver Agencia',
    [PERMISSIONS.MANAGE_AGENCY]: 'Gestionar Agencia',
    [PERMISSIONS.VIEW_EDITORIAL]: 'Ver Editorial',
    [PERMISSIONS.MANAGE_EDITORIAL]: 'Gestionar Editorial',
    [PERMISSIONS.CREATE_CONTENT]: 'Crear Contenido',
    [PERMISSIONS.EDIT_CONTENT]: 'Editar Contenido',
    [PERMISSIONS.PUBLISH_CONTENT]: 'Publicar Contenido',
    [PERMISSIONS.MANAGE_USERS]: 'Gestionar Usuarios',
    [PERMISSIONS.MANAGE_ROLES]: 'Gestionar Roles',
    [PERMISSIONS.MANAGE_SETTINGS]: 'Gestionar Configuración',
    [PERMISSIONS.SYSTEM_CONFIG]: 'Configuración del Sistema',
  };
  
  return permissionNames[permission] || permission;
}