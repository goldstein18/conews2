"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, MoreHorizontal, Crown, Shield, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useTeamManagement, type TeamMember } from '../hooks';
import {
  formatMemberDate,
  getMemberStatusColor,
  getMemberStatusText,
  getRoleDisplayName,
  getRoleColor,
  getInitials
} from '../utils';

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required'),
});

type InviteFormData = z.infer<typeof inviteSchema>;

const roles = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'MEMBER', label: 'Member' },
];

const rolePermissions = {
  OWNER: {
    icon: Crown,
    permissions: [
      'Full access to all features',
      'Manage billing and subscription',
      'Add/remove team members',
      'Change organization settings'
    ]
  },
  ADMIN: {
    icon: Shield,
    permissions: [
      'Create and manage events',
      'View analytics and reports',
      'Manage team members',
      'Cannot access billing'
    ]
  },
  MEMBER: {
    icon: User,
    permissions: [
      'Create and manage own events',
      'View basic analytics',
      'Access shared resources',
      'Cannot manage team'
    ]
  }
};

interface TeamManagementProps {
  teamMembers?: TeamMember[];
}

export function TeamManagement({ teamMembers }: TeamManagementProps) {
  const { inviteTeamMember, updateTeamMemberRole, deactivateTeamMember, loading: actionLoading } = useTeamManagement();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const inviteForm = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: 'MEMBER',
    },
  });

  const onInviteSubmit = async (data: InviteFormData) => {
    await inviteTeamMember(data.email, data.role);
    inviteForm.reset();
    setInviteDialogOpen(false);
  };

  const handleRoleUpdate = async (memberId: string, newRole: string) => {
    await updateTeamMemberRole(memberId, newRole);
  };

  const handleDeactivate = async (memberId: string) => {
    await deactivateTeamMember(memberId);
  };

  const getRoleIcon = (role: string) => {
    const roleData = rolePermissions[role as keyof typeof rolePermissions];
    if (!roleData) return User;
    return roleData.icon;
  };

  // Use teamMembers from props, fallback to empty array
  const members = teamMembers || [];

  return (
    <div className="space-y-6">
      {/* Team Members Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Team Members ({members.length})</h3>
          <p className="text-sm text-muted-foreground">
            Manage your team members and their roles.
          </p>
        </div>
        
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <Form {...inviteForm}>
              <form onSubmit={inviteForm.handleSubmit(onInviteSubmit)} className="space-y-4">
                <FormField
                  control={inviteForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="member@example.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={inviteForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setInviteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={actionLoading}>
                    {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Invitation
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Members List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {members.map((member: TeamMember) => {
              const RoleIcon = getRoleIcon(member.displayRole);
              const statusColor = getMemberStatusColor(member.isActive);
              const statusText = getMemberStatusText(member.isActive);
              
              return (
                <div key={member.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.user.avatarUrl} />
                        <AvatarFallback>
                          {getInitials(member.user.firstName, member.user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">
                            {member.user.firstName} {member.user.lastName}
                          </h4>
                          {member.displayRole === 'OWNER' && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {member.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge className={getRoleColor(member.displayRole)}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {getRoleDisplayName(member.displayRole)}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatMemberDate(member.createdAt)}
                        </p>
                      </div>

                      <Badge className={statusColor}>
                        {statusText}
                      </Badge>

                      {member.displayRole !== 'OWNER' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleRoleUpdate(member.id, 'ADMIN')}
                              disabled={actionLoading}
                            >
                              Change to Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRoleUpdate(member.id, 'MEMBER')}
                              disabled={actionLoading}
                            >
                              Change to Member
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeactivate(member.id)}
                              disabled={actionLoading}
                              className="text-red-600"
                            >
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(rolePermissions).map(([role, { icon: Icon, permissions }]) => (
              <div key={role} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-medium">{getRoleDisplayName(role)}</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {permissions.map((permission, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}