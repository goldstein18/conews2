import { ApolloClient, NormalizedCacheObject, FetchPolicy } from '@apollo/client';
import {
  GET_MY_PERMISSIONS,
  GET_USER_PERMISSIONS,
  GET_PERMISSIONS,
  GET_ROLES,
  GET_ROLE,
  GET_GLOBAL_ROLES,
  GET_COMPANY_ROLES,
  CREATE_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
  ASSIGN_PERMISSIONS,
  ASSIGN_ROLE,
  CREATE_PERMISSION,
  type Permission,
  type Role,
  type CreateRoleInput,
  type UpdateRoleInput,
  type AssignPermissionsInput,
  type AssignRoleInput,
  type CreatePermissionInput,
  type GetMyPermissionsResponse,
  type GetUserPermissionsResponse,
  type GetPermissionsResponse,
  type GetRolesResponse,
  type GetRoleResponse,
  type CreateRoleResponse,
  type UpdateRoleResponse,
  type DeleteRoleResponse,
  type AssignPermissionsResponse,
  type AssignRoleResponse,
  type CreatePermissionResponse,
} from '@/lib/graphql/roles-permissions';

/**
 * API service for managing roles and permissions
 */
export class PermissionsAPI {
  private static client: ApolloClient<NormalizedCacheObject> | null = null;

  static initialize(client: ApolloClient<NormalizedCacheObject>) {
    this.client = client;
  }

  private static getClient() {
    if (!this.client) {
      throw new Error('PermissionsAPI not initialized. Call PermissionsAPI.initialize() first.');
    }
    return this.client;
  }

  // ==================== PERMISSIONS ====================

  /**
   * Get current user's permissions
   */
  static async getMyPermissions(companyId?: string): Promise<string[]> {
    const client = this.getClient();
    
    try {
      const { data } = await client.query<GetMyPermissionsResponse>({
        query: GET_MY_PERMISSIONS,
        variables: { companyId },
        fetchPolicy: 'cache-and-network' as FetchPolicy, // Always fetch fresh permissions
      });
      
      return data.myPermissions || [];
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      return [];
    }
  }

  /**
   * Get permissions for specific user
   */
  static async getUserPermissions(userId: string, companyId?: string): Promise<string[]> {
    const client = this.getClient();
    
    try {
      const { data } = await client.query<GetUserPermissionsResponse>({
        query: GET_USER_PERMISSIONS,
        variables: { userId, companyId },
        fetchPolicy: 'cache-and-network' as FetchPolicy,
      });
      
      return data.userPermissions || [];
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      return [];
    }
  }

  /**
   * Get all available permissions
   */
  static async getPermissions(): Promise<Permission[]> {
    const client = this.getClient();
    
    try {
      const { data } = await client.query<GetPermissionsResponse>({
        query: GET_PERMISSIONS,
        fetchPolicy: 'cache-first' as FetchPolicy, // Permissions don't change often
      });
      
      return data.permissions || [];
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return [];
    }
  }

  /**
   * Create new permission (system admin only)
   */
  static async createPermission(input: CreatePermissionInput): Promise<Permission | null> {
    const client = this.getClient();
    
    try {
      const { data } = await client.mutate<CreatePermissionResponse>({
        mutation: CREATE_PERMISSION,
        variables: { input },
        refetchQueries: [{ query: GET_PERMISSIONS }],
      });
      
      return data?.createPermission || null;
    } catch (error) {
      console.error('Error creating permission:', error);
      throw error;
    }
  }

  // ==================== ROLES ====================

  /**
   * Get roles with filtering options
   */
  static async getRoles(options: {
    companyId?: string;
    includeGlobal?: boolean;
  } = {}): Promise<Role[]> {
    const client = this.getClient();
    
    try {
      const { data } = await client.query<GetRolesResponse>({
        query: GET_ROLES,
        variables: {
          companyId: options.companyId,
          includeGlobal: options.includeGlobal,
        },
        fetchPolicy: 'cache-and-network' as FetchPolicy,
      });
      
      return data.roles || [];
    } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
  }

  /**
   * Get global roles only
   */
  static async getGlobalRoles(): Promise<Role[]> {
    const client = this.getClient();
    
    try {
      const { data } = await client.query<GetRolesResponse>({
        query: GET_GLOBAL_ROLES,
        fetchPolicy: 'cache-first' as FetchPolicy,
      });
      
      return data.roles || [];
    } catch (error) {
      console.error('Error fetching global roles:', error);
      return [];
    }
  }

  /**
   * Get company-specific roles
   */
  static async getCompanyRoles(companyId: string): Promise<Role[]> {
    const client = this.getClient();
    
    try {
      const { data } = await client.query<GetRolesResponse>({
        query: GET_COMPANY_ROLES,
        variables: { companyId },
        fetchPolicy: 'cache-and-network' as FetchPolicy,
      });
      
      return data.roles || [];
    } catch (error) {
      console.error('Error fetching company roles:', error);
      return [];
    }
  }

  /**
   * Get specific role with detailed permissions
   */
  static async getRole(id: string): Promise<Role | null> {
    const client = this.getClient();
    
    try {
      const { data } = await client.query<GetRoleResponse>({
        query: GET_ROLE,
        variables: { id },
        fetchPolicy: 'cache-and-network' as FetchPolicy,
      });
      
      return data.role || null;
    } catch (error) {
      console.error('Error fetching role:', error);
      return null;
    }
  }

  /**
   * Create new role
   */
  static async createRole(input: CreateRoleInput): Promise<Role | null> {
    const client = this.getClient();
    
    try {
      const { data } = await client.mutate<CreateRoleResponse>({
        mutation: CREATE_ROLE,
        variables: { input },
        refetchQueries: [
          { query: GET_ROLES },
          { query: GET_GLOBAL_ROLES },
          ...(input.companyId ? [{ query: GET_COMPANY_ROLES, variables: { companyId: input.companyId } }] : []),
        ],
      });
      
      return data?.createRole || null;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  /**
   * Update existing role
   */
  static async updateRole(input: UpdateRoleInput): Promise<Role | null> {
    const client = this.getClient();
    
    try {
      const { data } = await client.mutate<UpdateRoleResponse>({
        mutation: UPDATE_ROLE,
        variables: { input },
        refetchQueries: [
          { query: GET_ROLE, variables: { id: input.id } },
          { query: GET_ROLES },
        ],
      });
      
      return data?.updateRole || null;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  }

  /**
   * Delete role
   */
  static async deleteRole(id: string): Promise<boolean> {
    const client = this.getClient();
    
    try {
      const { data } = await client.mutate<DeleteRoleResponse>({
        mutation: DELETE_ROLE,
        variables: { id },
        refetchQueries: [
          { query: GET_ROLES },
          { query: GET_GLOBAL_ROLES },
        ],
      });
      
      return data?.deleteRole || false;
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  }

  /**
   * Assign permissions to role
   */
  static async assignPermissions(input: AssignPermissionsInput): Promise<Role | null> {
    const client = this.getClient();
    
    try {
      const { data } = await client.mutate<AssignPermissionsResponse>({
        mutation: ASSIGN_PERMISSIONS,
        variables: { input },
        refetchQueries: [
          { query: GET_ROLE, variables: { id: input.roleId } },
          { query: GET_ROLES },
        ],
      });
      
      return data?.assignPermissions || null;
    } catch (error) {
      console.error('Error assigning permissions:', error);
      throw error;
    }
  }

  /**
   * Assign role to user
   */
  static async assignRole(input: AssignRoleInput): Promise<boolean> {
    const client = this.getClient();
    
    try {
      const { data } = await client.mutate<AssignRoleResponse>({
        mutation: ASSIGN_ROLE,
        variables: { input },
        // Refetch user permissions after role assignment
        refetchQueries: [
          { query: GET_MY_PERMISSIONS, variables: { companyId: input.companyId } },
          { query: GET_USER_PERMISSIONS, variables: { userId: input.userId, companyId: input.companyId } },
        ],
      });
      
      return data?.assignRole || false;
    } catch (error) {
      console.error('Error assigning role:', error);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Check if user has specific permission
   */
  static async userHasPermission(
    userId: string, 
    permission: string, 
    companyId?: string
  ): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(userId, companyId);
      return permissions.includes(permission);
    } catch (error) {
      console.error('Error checking user permission:', error);
      return false;
    }
  }

  /**
   * Check if current user has specific permission
   */
  static async currentUserHasPermission(
    permission: string, 
    companyId?: string
  ): Promise<boolean> {
    try {
      const permissions = await this.getMyPermissions(companyId);
      return permissions.includes(permission);
    } catch (error) {
      console.error('Error checking current user permission:', error);
      return false;
    }
  }

  /**
   * Check if current user has any of the specified permissions
   */
  static async currentUserHasAnyPermission(
    permissions: string[], 
    companyId?: string
  ): Promise<boolean> {
    try {
      const userPermissions = await this.getMyPermissions(companyId);
      return permissions.some(permission => userPermissions.includes(permission));
    } catch (error) {
      console.error('Error checking user permissions:', error);
      return false;
    }
  }

  /**
   * Clear Apollo cache for permissions (useful after role changes)
   */
  static clearPermissionsCache(): void {
    const client = this.getClient();
    
    try {
      // Clear specific permission-related queries from cache
      client.cache.evict({ fieldName: 'myPermissions' });
      client.cache.evict({ fieldName: 'userPermissions' });
      client.cache.evict({ fieldName: 'roles' });
      client.cache.gc(); // Garbage collect to remove evicted entries
    } catch (error) {
      console.error('Error clearing permissions cache:', error);
    }
  }

  /**
   * Refresh current user's permissions
   */
  static async refreshUserPermissions(companyId?: string): Promise<string[]> {
    const client = this.getClient();
    
    try {
      // Force fresh fetch of permissions
      const { data } = await client.query<GetMyPermissionsResponse>({
        query: GET_MY_PERMISSIONS,
        variables: { companyId },
        fetchPolicy: 'network-only' as FetchPolicy, // Skip cache entirely
      });
      
      return data.myPermissions || [];
    } catch (error) {
      console.error('Error refreshing user permissions:', error);
      return [];
    }
  }
}