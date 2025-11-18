import { gql } from '@apollo/client';

// ==================== QUERIES ====================

/**
 * Get user's permissions (current user)
 */
export const GET_MY_PERMISSIONS = gql`
  query GetMyPermissions($companyId: String) {
    myPermissions(companyId: $companyId)
  }
`;

/**
 * Get permissions for specific user
 */
export const GET_USER_PERMISSIONS = gql`
  query GetUserPermissions($userId: ID!, $companyId: String) {
    userPermissions(userId: $userId, companyId: $companyId)
  }
`;

/**
 * Get all permissions
 */
export const GET_PERMISSIONS = gql`
  query GetPermissions {
    permissions {
      id
      name
      description
      resource
      action
      isActive
      isSystemPermission
      createdAt
    }
  }
`;

/**
 * Get all roles (with filtering options)
 */
export const GET_ROLES = gql`
  query GetRoles($companyId: String, $includeGlobal: Boolean) {
    roles(companyId: $companyId, includeGlobal: $includeGlobal) {
      id
      name
      displayName
      description
      isActive
      isSystemRole
      companyId
      permissionNames
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get specific role with detailed permissions
 */
export const GET_ROLE = gql`
  query GetRole($id: ID!) {
    role(id: $id) {
      id
      name
      displayName
      description
      isActive
      isSystemRole
      companyId
      permissions {
        permission {
          id
          name
          description
          resource
          action
        }
      }
      permissionNames
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get global roles only
 */
export const GET_GLOBAL_ROLES = gql`
  query GetGlobalRoles {
    roles(includeGlobal: true) {
      id
      name
      displayName
      description
      isSystemRole
      permissionNames
      createdAt
    }
  }
`;

/**
 * Get company-specific roles
 */
export const GET_COMPANY_ROLES = gql`
  query GetCompanyRoles($companyId: String!) {
    roles(companyId: $companyId, includeGlobal: false) {
      id
      name
      displayName
      description
      companyId
      permissionNames
      createdAt
    }
  }
`;

// ==================== MUTATIONS ====================

/**
 * Create new role
 */
export const CREATE_ROLE = gql`
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      id
      name
      displayName
      description
      isActive
      isSystemRole
      companyId
      permissionNames
      createdAt
    }
  }
`;

/**
 * Update existing role
 */
export const UPDATE_ROLE = gql`
  mutation UpdateRole($input: UpdateRoleInput!) {
    updateRole(input: $input) {
      id
      name
      displayName
      description
      isActive
      isSystemRole
      companyId
      permissionNames
      updatedAt
    }
  }
`;

/**
 * Delete role
 */
export const DELETE_ROLE = gql`
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id)
  }
`;

/**
 * Assign permissions to role
 */
export const ASSIGN_PERMISSIONS = gql`
  mutation AssignPermissions($input: AssignPermissionsInput!) {
    assignPermissions(input: $input) {
      id
      name
      displayName
      permissionNames
      updatedAt
    }
  }
`;

/**
 * Assign role to user
 */
export const ASSIGN_ROLE = gql`
  mutation AssignRole($input: AssignRoleInput!) {
    assignRole(input: $input)
  }
`;

/**
 * Create new permission
 */
export const CREATE_PERMISSION = gql`
  mutation CreatePermission($input: CreatePermissionInput!) {
    createPermission(input: $input) {
      id
      name
      description
      resource
      action
      isActive
      isSystemPermission
      createdAt
    }
  }
`;

// ==================== FRAGMENTS ====================

export const ROLE_FRAGMENT = gql`
  fragment RoleFragment on Role {
    id
    name
    displayName
    description
    isActive
    isSystemRole
    companyId
    permissionNames
    createdAt
    updatedAt
  }
`;

export const PERMISSION_FRAGMENT = gql`
  fragment PermissionFragment on Permission {
    id
    name
    description
    resource
    action
    isActive
    isSystemPermission
    createdAt
  }
`;

export const ROLE_WITH_PERMISSIONS_FRAGMENT = gql`
  fragment RoleWithPermissionsFragment on Role {
    id
    name
    displayName
    description
    isActive
    isSystemRole
    companyId
    permissions {
      permission {
        ...PermissionFragment
      }
    }
    permissionNames
    createdAt
    updatedAt
  }
  ${PERMISSION_FRAGMENT}
`;

// ==================== INPUT TYPES ====================

export interface CreateRoleInput {
  name: string;
  displayName: string;
  description?: string;
  companyId?: string;
  permissionIds?: string[];
  isActive?: boolean;
}

export interface UpdateRoleInput {
  id: string;
  name?: string;
  displayName?: string;
  description?: string;
  isActive?: boolean;
}

export interface AssignPermissionsInput {
  roleId: string;
  permissionIds: string[];
}

export interface AssignRoleInput {
  userId: string;
  roleId: string;
  companyId?: string;
}

export interface CreatePermissionInput {
  name: string;
  description: string;
  resource: string;
  action: string;
  isActive?: boolean;
}

// ==================== RESPONSE TYPES ====================

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  isActive: boolean;
  isSystemPermission: boolean;
  createdAt: string;
}

export interface RolePermission {
  permission: Permission;
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isActive: boolean;
  isSystemRole: boolean;
  companyId?: string;
  permissions?: RolePermission[];
  permissionNames: string[];
  createdAt: string;
  updatedAt: string;
}

// Query response types
export interface GetMyPermissionsResponse {
  myPermissions: string[];
}

export interface GetUserPermissionsResponse {
  userPermissions: string[];
}

export interface GetPermissionsResponse {
  permissions: Permission[];
}

export interface GetRolesResponse {
  roles: Role[];
}

export interface GetRoleResponse {
  role: Role;
}

// Mutation response types
export interface CreateRoleResponse {
  createRole: Role;
}

export interface UpdateRoleResponse {
  updateRole: Role;
}

export interface DeleteRoleResponse {
  deleteRole: boolean;
}

export interface AssignPermissionsResponse {
  assignPermissions: Role;
}

export interface AssignRoleResponse {
  assignRole: boolean;
}

export interface CreatePermissionResponse {
  createPermission: Permission;
}