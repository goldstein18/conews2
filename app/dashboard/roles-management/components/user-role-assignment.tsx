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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  UserCog, 
  Search, 
  Filter, 
  Loader2, 
  Mail,
  Calendar,
  Shield,
  Building2
} from "lucide-react";
import { toast } from "sonner";

import { LIST_EMPLOYEES } from "@/lib/graphql/employees";
import { LIST_COMPANY_OWNERS } from "@/lib/graphql/members";
import { 
  GET_ROLES, 
  ASSIGN_ROLE,
  type Role,
  type AssignRoleInput
} from "@/lib/graphql/roles-permissions";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role?: {
    id: string;
    name: string;
  };
  employee?: boolean;
  market?: string;
  createdAt: string;
  lastLogin?: string;
  ownedCompany?: {
    id: string;
    name: string;
  };
}

export function UserRoleAssignment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserType, setSelectedUserType] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  // Queries
  const { 
    data: employeesData, 
    loading: employeesLoading,
    refetch: refetchEmployees 
  } = useQuery(LIST_EMPLOYEES, {
    variables: { first: 100 },
    fetchPolicy: 'cache-and-network'
  });

  const { 
    data: companiesData, 
    loading: companiesLoading,
    refetch: refetchCompanies 
  } = useQuery(LIST_COMPANY_OWNERS, {
    variables: { first: 100 },
    fetchPolicy: 'cache-and-network'
  });

  const {
    data: rolesData
  } = useQuery(GET_ROLES, {
    variables: { includeGlobal: true },
    fetchPolicy: 'no-cache' // Redis cache on API handles this
  });

  // Mutations
  const [assignRole, { loading: assignLoading }] = useMutation(ASSIGN_ROLE, {
    onCompleted: () => {
      toast.success("Role assigned successfully");
      setIsAssignDialogOpen(false);
      setSelectedUser(null);
      refetchEmployees();
      refetchCompanies();
    },
    onError: (error) => {
      toast.error(`Error assigning role: ${error.message}`);
    }
  });

  // Combine and process all users
  const employees = employeesData?.employeesPaginated?.edges?.map((edge: { node: User }) => ({
    ...edge.node,
    userType: 'employee'
  })) || [];

  const companyOwners = companiesData?.membersPaginated?.edges?.map((edge: { node: User }) => ({
    ...edge.node,
    userType: 'company_owner'
  })) || [];

  const allUsers = [...employees, ...companyOwners];

  // Filter users
  const filteredUsers = allUsers.filter((user: User & { userType: string }) => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedUserType === "all") return matchesSearch;
    return matchesSearch && user.userType === selectedUserType;
  });

  const handleAssignRole = (user: User) => {
    setSelectedUser(user);
    setIsAssignDialogOpen(true);
  };

  const getUserDisplayName = (user: User) => {
    return `${user.firstName} ${user.lastName}`;
  };

  const getUserInitials = (user: User) => {
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case 'employee':
        return <Badge variant="default">Employee</Badge>;
      case 'company_owner':
        return <Badge variant="secondary">Owner</Badge>;
      default:
        return <Badge variant="outline">User</Badge>;
    }
  };

  const isLoading = employeesLoading || companiesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              {employees.length} employees, {companyOwners.length} owners
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">With Assigned Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allUsers.filter(user => user.role).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Users with active roles
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Without Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allUsers.filter(user => !user.role).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Users pending assignment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-1 max-w-sm relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedUserType} onValueChange={setSelectedUserType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="User type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All users</SelectItem>
              <SelectItem value="employee">Employees</SelectItem>
              <SelectItem value="company_owner">Owners</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>{filteredUsers.length} users found</span>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Role Management</CardTitle>
          <CardDescription>
            Assign and manage roles for employees and company owners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Company/Market</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Access</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user: User & { userType: string }) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={undefined} />
                        <AvatarFallback className="text-xs">
                          {getUserInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {getUserDisplayName(user)}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getUserTypeBadge(user.userType)}
                  </TableCell>
                  <TableCell>
                    {user.role ? (
                      <Badge variant="default" className="flex items-center space-x-1">
                        <Shield className="h-3 w-3" />
                        <span>{user.role.name}</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        No role
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.ownedCompany ? (
                        <div className="flex items-center space-x-1">
                          <Building2 className="h-3 w-3" />
                          <span>{user.ownedCompany.name}</span>
                        </div>
                      ) : user.market ? (
                        <span>{user.market}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.lastLogin ? (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(user.lastLogin).toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <span>Never</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAssignRole(user)}
                    >
                      <UserCog className="h-4 w-4 mr-1" />
                      {user.role ? 'Change' : 'Assign'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assign Role Dialog */}
      {selectedUser && (
        <AssignRoleDialog
          open={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          user={selectedUser}
          roles={rolesData?.roles || []}
          onAssignRole={assignRole}
          loading={assignLoading}
        />
      )}
    </div>
  );
}

// Assign Role Dialog Component
interface AssignRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  roles: Role[];
  onAssignRole: (variables: { variables: { input: AssignRoleInput } }) => void;
  loading: boolean;
}

function AssignRoleDialog({
  open,
  onOpenChange,
  user,
  roles,
  onAssignRole,
  loading
}: AssignRoleDialogProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(user.role?.id || "");
  const [companyId, setCompanyId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRoleId) {
      toast.error("You must select a role");
      return;
    }

    onAssignRole({
      variables: {
        input: {
          userId: user.id,
          roleId: selectedRoleId,
          ...(companyId && { companyId })
        }
      }
    });
  };

  const selectedRole = roles.find(role => role.id === selectedRoleId);
  const requiresCompany = selectedRole?.companyId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {user.role ? 'Change Role' : 'Assign Role'}
          </DialogTitle>
          <DialogDescription>
            User: {user.firstName} {user.lastName} ({user.email})
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Role Info */}
          {user.role && (
            <div className="p-3 bg-muted rounded-md">
              <Label className="text-sm font-medium">Current Role:</Label>
              <p className="text-sm mt-1">{user.role.name}</p>
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-3">
            <Label>New Role *</Label>
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles
                  .filter(role => role.isActive)
                  .map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{role.displayName}</span>
                      <div className="flex items-center space-x-1 ml-2">
                        {role.isSystemRole && (
                          <Shield className="h-3 w-3 text-red-500" />
                        )}
                        {role.companyId && (
                          <Building2 className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedRole && (
              <div className="text-sm text-muted-foreground">
                <p>{selectedRole.description}</p>
                {selectedRole.permissionNames && (
                  <div className="mt-2">
                    <span className="font-medium">Permisos: </span>
                    <span>{selectedRole.permissionNames.slice(0, 3).join(', ')}</span>
                    {selectedRole.permissionNames.length > 3 && (
                      <span> y {selectedRole.permissionNames.length - 3} más...</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Company Selection (if required) */}
          {requiresCompany && (
            <div className="space-y-3">
              <Label>Company (Required for this role) *</Label>
              <Input
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                placeholder="Company ID"
                required
              />
              <p className="text-sm text-muted-foreground">
                This role requires specifying a specific company
              </p>
            </div>
          )}

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
              {user.role ? 'Change Role' : 'Assign Role'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}