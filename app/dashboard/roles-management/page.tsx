"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SuperAdminPage } from "@/components/protected-page";
import { Shield, Users, Key, UserCog } from "lucide-react";

// Components (we'll create these)
import { RolesManagement } from "./components/roles-management";
import { PermissionsManagement } from "./components/permissions-management";
import { UserRoleAssignment } from "./components/user-role-assignment";

export default function RolesManagementPage() {
  const [activeTab, setActiveTab] = useState("roles");

  return (
    <SuperAdminPage>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Roles & Permissions Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage roles, permissions and assign access to system users
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>Super Admin Only</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Global and company roles
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Permissions</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                System permissions
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users with Roles</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Active users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="roles" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Roles</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>Permissions</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center space-x-2">
              <UserCog className="h-4 w-4" />
              <span>Assignments</span>
            </TabsTrigger>
          </TabsList>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Role Management</CardTitle>
                <CardDescription>
                  Create, edit and delete system roles. Roles can be global 
                  or company-specific.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RolesManagement />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Permission Management</CardTitle>
                <CardDescription>
                  Define available permissions in the system and assign them to roles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PermissionsManagement />
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Role Assignment Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Role Assignment</CardTitle>
                <CardDescription>
                  Assign roles to specific users and manage their permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserRoleAssignment />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminPage>
  );
}