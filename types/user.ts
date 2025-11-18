export interface Role {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  isActive?: boolean;
  isSystemRole?: boolean;
  companyId?: string;
  permissionNames?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  avatar?: string | null;
  bio?: string | null;
  phone?: string | null;
  isActive: boolean;
  role?: Role;
  roleId?: string;
  permissions?: string[]; // Dynamic permissions from API
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string | null;
  emailVerified?: string | null;
  profilePhotoUrl?: string | null;

  // Impersonation fields
  impersonatedBy?: string; // Admin ID who is impersonating this user
  impersonationSessionId?: string; // Session ID for tracking
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface MeResponse {
  me: User;
}

// Roles allowed to access the dashboard
export const DASHBOARD_ROLES = [
  'SUPER_ADMIN',
  'CALENDAR_MEMBER',
  'ADMIN',
  'DINNING_MEMBER',
  'SALES',
  'AGENCY',
  'EDITORIAL_WRITER'
] as const;

export type DashboardRole = typeof DASHBOARD_ROLES[number];

// Enhanced role type with hierarchy info
export interface RoleWithHierarchy extends Role {
  level: number;
  permissions: string[];
  canManageRoles: boolean;
}

// Permission-related types
export type PermissionAction = 
  | 'VIEW' 
  | 'CREATE' 
  | 'EDIT' 
  | 'DELETE' 
  | 'MANAGE';

export type PermissionResource = 
  | 'COMPANIES' 
  | 'EMPLOYEES' 
  | 'AUDIT' 
  | 'CALENDAR' 
  | 'DINING' 
  | 'SALES' 
  | 'AGENCY' 
  | 'EDITORIAL'
  | 'USERS'
  | 'ROLES'
  | 'SETTINGS';

export type Permission = `${PermissionAction}_${PermissionResource}`;

// Enhanced user interface for role-based operations
export interface UserWithPermissions extends User {
  permissions?: Permission[];
  roleLevel?: number;
  canAccess?: (resource: PermissionResource, action?: PermissionAction) => boolean;
}

// Access control helper types
export interface AccessControlContext {
  user: User | null;
  requiredRoles?: string[];
  requiredPermissions?: Permission[];
  minimumRoleLevel?: number;
}

export interface AccessControlResult {
  hasAccess: boolean;
  reason?: string;
  missingPermissions?: Permission[];
  missingRoles?: string[];
}

export function canAccessDashboard(roleName?: string): boolean {
  if (!roleName) return false;
  return DASHBOARD_ROLES.includes(roleName as DashboardRole);
}

/**
 * Type guard to check if a role is valid dashboard role
 */
export function isDashboardRole(role: string): role is DashboardRole {
  return DASHBOARD_ROLES.includes(role as DashboardRole);
}

/**
 * Get role display information
 */
export function getRoleInfo(roleName?: string) {
  const roleInfo: Record<DashboardRole, { displayName: string; description: string; level: number }> = {
    SUPER_ADMIN: { 
      displayName: 'Super Administrador', 
      description: 'Acceso completo al sistema',
      level: 100
    },
    ADMIN: { 
      displayName: 'Administrador', 
      description: 'Gestión de empresas y empleados',
      level: 80
    },
    SALES: { 
      displayName: 'Ventas', 
      description: 'Gestión de ventas y cotizaciones',
      level: 60
    },
    AGENCY: { 
      displayName: 'Agencia', 
      description: 'Gestión de agencias',
      level: 50
    },
    EDITORIAL_WRITER: { 
      displayName: 'Editor', 
      description: 'Creación y edición de contenido',
      level: 40
    },
    CALENDAR_MEMBER: { 
      displayName: 'Miembro Calendario', 
      description: 'Gestión de calendario y eventos',
      level: 30
    },
    DINNING_MEMBER: { 
      displayName: 'Miembro Comedor', 
      description: 'Gestión de menús y comedor',
      level: 20
    },
  };

  if (!roleName || !isDashboardRole(roleName)) {
    return {
      displayName: 'Sin rol',
      description: 'Usuario sin rol asignado',
      level: 0
    };
  }

  return roleInfo[roleName];
}
