"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Shield, Building, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { 
  GET_ROLES, 
  GET_PERMISSIONS, 
  CREATE_ROLE, 
  UPDATE_ROLE, 
  DELETE_ROLE, 
  ASSIGN_PERMISSIONS,
  type Role,
  type Permission,
  type CreateRoleInput,
  type UpdateRoleInput,
  type AssignPermissionsInput
} from "@/lib/graphql/roles-permissions";

export function RolesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Queries
  const {
    data: rolesData,
    loading: rolesLoading,
    error: rolesError,
    refetch: refetchRoles
  } = useQuery(GET_ROLES, {
    variables: { includeGlobal: true },
    fetchPolicy: 'no-cache' // Redis cache on API handles this
  });

  const {
    data: permissionsData
  } = useQuery(GET_PERMISSIONS, {
    fetchPolicy: 'no-cache' // Redis cache on API handles this
  });

  // Mutations
  const [createRole, { loading: createLoading }] = useMutation(CREATE_ROLE, {
    onCompleted: () => {
      toast.success("Role created successfully");
      setIsCreateDialogOpen(false);
      refetchRoles();
    },
    onError: (error) => {
      toast.error(`Error creating role: ${error.message}`);
    }
  });

  const [updateRole, { loading: updateLoading }] = useMutation(UPDATE_ROLE, {
    onCompleted: () => {
      toast.success("Role updated successfully");
      setIsEditDialogOpen(false);
      setEditingRole(null);
      refetchRoles();
    },
    onError: (error) => {
      toast.error(`Error updating role: ${error.message}`);
    }
  });

  const [deleteRole, { loading: deleteLoading }] = useMutation(DELETE_ROLE, {
    onCompleted: () => {
      toast.success("Role deleted successfully");
      refetchRoles();
    },
    onError: (error) => {
      toast.error(`Error deleting role: ${error.message}`);
    }
  });

  const [assignPermissions] = useMutation(ASSIGN_PERMISSIONS, {
    onCompleted: () => {
      toast.success("Permissions assigned successfully");
      refetchRoles();
    },
    onError: (error) => {
      toast.error(`Error assigning permissions: ${error.message}`);
    }
  });

  // Filter roles
  const filteredRoles = rolesData?.roles?.filter((role: Role) => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCompany === "all") return matchesSearch;
    if (selectedCompany === "global") return matchesSearch && !role.companyId;
    if (selectedCompany === "company") return matchesSearch && !!role.companyId;
    
    return matchesSearch;
  }) || [];

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (roleId: string) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      await deleteRole({ variables: { id: roleId } });
    }
  };

  const getRoleTypeIcon = (role: Role) => {
    if (role.isSystemRole) return <Shield className="h-4 w-4" />;
    if (role.companyId) return <Building className="h-4 w-4" />;
    return <Globe className="h-4 w-4" />;
  };

  const getRoleTypeBadge = (role: Role) => {
    if (role.isSystemRole) return <Badge variant="destructive">System</Badge>;
    if (role.companyId) return <Badge variant="secondary">Company</Badge>;
    return <Badge variant="default">Global</Badge>;
  };

  if (rolesLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading roles...</span>
      </div>
    );
  }

  if (rolesError) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading roles: {rolesError.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="global">Global roles</SelectItem>
              <SelectItem value="company">Company roles</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <CreateRoleDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateRole={createRole}
          permissions={permissionsData?.permissions || []}
          loading={createLoading}
        />
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Roles ({filteredRoles.length})</CardTitle>
          <CardDescription>
            Manage all available roles in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role: Role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getRoleTypeIcon(role)}
                      <div>
                        <div className="font-medium">{role.displayName}</div>
                        <div className="text-sm text-muted-foreground">
                          {role.name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleTypeBadge(role)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissionNames?.slice(0, 3).map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                      {(role.permissionNames?.length || 0) > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{(role.permissionNames?.length || 0) - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.isActive ? "default" : "secondary"}>
                      {role.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(role.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(role)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!role.isSystemRole && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(role.id)}
                          disabled={deleteLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRoles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No roles found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      {editingRole && (
        <EditRoleDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          role={editingRole}
          onUpdateRole={updateRole}
          onAssignPermissions={assignPermissions}
          permissions={permissionsData?.permissions || []}
          loading={updateLoading}
        />
      )}
    </div>
  );
}

// Create Role Dialog Component
interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateRole: (variables: { variables: { input: CreateRoleInput } }) => void;
  permissions: Permission[];
  loading: boolean;
}

function CreateRoleDialog({
  open,
  onOpenChange,
  onCreateRole,
  permissions,
  loading
}: CreateRoleDialogProps) {
  const [formData, setFormData] = useState<CreateRoleInput>({
    name: "",
    displayName: "",
    description: "",
    permissionIds: [],
    isActive: true
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRole({
      variables: {
        input: {
          ...formData,
          permissionIds: selectedPermissions
        }
      }
    });
  };

  const handlePermissionToggle = (permissionName: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionName]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permissionName));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>
            Define a new role with its corresponding permissions
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value.toUpperCase()})}
                placeholder="CUSTOM_ROLE"
                required
              />
              <p className="text-sm text-muted-foreground">
                Technical name (automatically uppercase)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                placeholder="Custom Role"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the responsibilities of this role..."
            />
          </div>

          <div className="space-y-4">
            <Label>Role Permissions</Label>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-md p-4">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission.name}
                    checked={selectedPermissions.includes(permission.name)}
                    onCheckedChange={(checked) => 
                      handlePermissionToggle(permission.name, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={permission.name} 
                    className="text-sm cursor-pointer"
                    title={permission.description}
                  >
                    {permission.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Role
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Edit Role Dialog Component
interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
  onUpdateRole: (variables: { variables: { input: UpdateRoleInput } }) => void;
  onAssignPermissions: (variables: { variables: { input: AssignPermissionsInput } }) => void;
  permissions: Permission[];
  loading: boolean;
}

function EditRoleDialog({
  open,
  onOpenChange,
  role,
  onUpdateRole,
  onAssignPermissions,
  permissions,
  loading
}: EditRoleDialogProps) {
  const [formData, setFormData] = useState<UpdateRoleInput>({
    id: role.id,
    name: role.name,
    displayName: role.displayName,
    description: role.description || "",
    isActive: role.isActive
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role.permissionNames || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update role basic info
    await onUpdateRole({ variables: { input: formData } });
    
    // Update permissions
    await onAssignPermissions({
      variables: {
        input: {
          roleId: role.id,
          permissionIds: selectedPermissions
        }
      }
    });
  };

  const handlePermissionToggle = (permissionName: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionName]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permissionName));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Role: {role.displayName}</DialogTitle>
          <DialogDescription>
            Modify the role information and permissions
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                value={formData.displayName || ""}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.isActive ? "active" : "inactive"}
                onValueChange={(value) => setFormData({...formData, isActive: value === "active"})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-4">
            <Label>Role Permissions ({selectedPermissions.length})</Label>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-md p-4">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-${permission.name}`}
                    checked={selectedPermissions.includes(permission.name)}
                    onCheckedChange={(checked) => 
                      handlePermissionToggle(permission.name, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`edit-${permission.name}`} 
                    className="text-sm cursor-pointer"
                    title={permission.description}
                  >
                    {permission.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}