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
import { Plus, Key, Shield, Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import { 
  GET_PERMISSIONS, 
  CREATE_PERMISSION, 
  type Permission,
  type CreatePermissionInput
} from "@/lib/graphql/roles-permissions";

export function PermissionsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResource, setSelectedResource] = useState<string>("all");
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Query
  const { 
    data: permissionsData, 
    loading: permissionsLoading, 
    error: permissionsError,
    refetch: refetchPermissions 
  } = useQuery(GET_PERMISSIONS, {
    fetchPolicy: 'cache-and-network'
  });

  // Mutations
  const [createPermission, { loading: createLoading }] = useMutation(CREATE_PERMISSION, {
    onCompleted: () => {
      toast.success("Permission created successfully");
      setIsCreateDialogOpen(false);
      refetchPermissions();
    },
    onError: (error) => {
      toast.error(`Error creating permission: ${error.message}`);
    }
  });

  // Get unique resources and actions for filtering
  const resources = [...new Set(permissionsData?.permissions?.map((p: Permission) => p.resource) || [])] as string[];
  const actions = [...new Set(permissionsData?.permissions?.map((p: Permission) => p.action) || [])] as string[];

  // Filter permissions
  const filteredPermissions = permissionsData?.permissions?.filter((permission: Permission) => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesResource = selectedResource === "all" || permission.resource === selectedResource;
    const matchesAction = selectedAction === "all" || permission.action === selectedAction;
    
    return matchesSearch && matchesResource && matchesAction;
  }) || [];

  // Group permissions by resource for better visualization
  const permissionsByResource = filteredPermissions.reduce((acc: Record<string, Permission[]>, permission: Permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {});

  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading permissions...</span>
      </div>
    );
  }

  if (permissionsError) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading permissions: {permissionsError.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissionsData?.permissions?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resources.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {permissionsData?.permissions?.filter((p: Permission) => p.isSystemPermission).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-1 max-w-sm relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedResource} onValueChange={setSelectedResource}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Resource" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All resources</SelectItem>
              {resources.map((resource) => (
                <SelectItem key={resource} value={resource}>
                  {resource}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedAction} onValueChange={setSelectedAction}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {actions.map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <CreatePermissionDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreatePermission={createPermission}
          loading={createLoading}
          existingResources={resources}
          existingActions={actions}
        />
      </div>

      {/* Permissions by Resource */}
      <div className="space-y-6">
        {Object.entries(permissionsByResource).map(([resource, permissions]) => (
          <Card key={resource}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Resource: {resource}</span>
                <Badge variant="outline">{(permissions as Permission[]).length} permissions</Badge>
              </CardTitle>
              <CardDescription>
                Available permissions for {resource} resource
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Permission</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(permissions as Permission[]).map((permission: Permission) => (
                    <TableRow key={permission.id}>
                      <TableCell>
                        <div className="font-mono text-sm font-medium">
                          {permission.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {permission.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-muted-foreground truncate">
                          {permission.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        {permission.isSystemPermission ? (
                          <Badge variant="destructive">
                            <Shield className="h-3 w-3 mr-1" />
                            System
                          </Badge>
                        ) : (
                          <Badge variant="default">Custom</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={permission.isActive ? "default" : "secondary"}>
                          {permission.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(permission.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}

        {Object.keys(permissionsByResource).length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No permissions found</h3>
              <p className="text-muted-foreground mb-4">
                No permissions match the selected filters
              </p>
              <Button onClick={() => {
                setSearchTerm("");
                setSelectedResource("all");
                setSelectedAction("all");
              }}>
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Create Permission Dialog Component
interface CreatePermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePermission: (variables: { variables: { input: CreatePermissionInput } }) => void;
  loading: boolean;
  existingResources: string[];
  existingActions: string[];
}

function CreatePermissionDialog({
  open,
  onOpenChange,
  onCreatePermission,
  loading,
  existingResources,
  existingActions
}: CreatePermissionDialogProps) {
  const [formData, setFormData] = useState<CreatePermissionInput>({
    name: "",
    description: "",
    resource: "",
    action: "",
    isActive: true
  });
  const [useCustomResource, setUseCustomResource] = useState(false);
  const [useCustomAction, setUseCustomAction] = useState(false);

  // Auto-generate permission name when resource and action change
  const generatePermissionName = (resource: string, action: string) => {
    if (resource && action) {
      return `${resource.toLowerCase()}:${action.toLowerCase()}`;
    }
    return "";
  };

  const handleResourceChange = (resource: string) => {
    setFormData({
      ...formData,
      resource,
      name: generatePermissionName(resource, formData.action)
    });
  };

  const handleActionChange = (action: string) => {
    setFormData({
      ...formData,
      action,
      name: generatePermissionName(formData.resource, action)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePermission({ variables: { input: formData } });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      resource: "",
      action: "",
      isActive: true
    });
    setUseCustomResource(false);
    setUseCustomAction(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Permission
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Permission</DialogTitle>
          <DialogDescription>
            Define a new permission for the system
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resource */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Resource *</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setUseCustomResource(!useCustomResource)}
              >
                {useCustomResource ? "Use existing" : "Create new"}
              </Button>
            </div>
            
            {useCustomResource ? (
              <Input
                value={formData.resource}
                onChange={(e) => handleResourceChange(e.target.value)}
                placeholder="company, user, event..."
                required
              />
            ) : (
              <Select value={formData.resource} onValueChange={handleResourceChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a resource" />
                </SelectTrigger>
                <SelectContent>
                  {existingResources.map((resource) => (
                    <SelectItem key={resource} value={resource}>
                      {resource}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Action */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Action *</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setUseCustomAction(!useCustomAction)}
              >
                {useCustomAction ? "Use existing" : "Create new"}
              </Button>
            </div>
            
            {useCustomAction ? (
              <Input
                value={formData.action}
                onChange={(e) => handleActionChange(e.target.value)}
                placeholder="read, create, update, delete, manage..."
                required
              />
            ) : (
              <Select value={formData.action} onValueChange={handleActionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent>
                  {existingActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Auto-generated name preview */}
          {formData.name && (
            <div className="p-3 bg-muted rounded-md">
              <Label className="text-sm font-medium">Generated name:</Label>
              <p className="font-mono text-sm mt-1">{formData.name}</p>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe what this permission is used for..."
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.resource || !formData.action}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Permission
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}