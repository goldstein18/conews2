"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CompanyDetail } from "@/types/members";
import { getRoleDisplayName, getRoleColor } from "@/app/dashboard/settings/utils/settings-helpers";

interface CompanyMembersProps {
  company: CompanyDetail;
  loading?: boolean;
}

export function CompanyMembers({ company, loading }: CompanyMembersProps) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-3">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'inactive':
        return 'outline';
      default:
        return 'secondary';
    }
  };


  // Get all users from company.users array, which should include everyone
  const allMembers = (company.users || []).map(companyUser => {
    // Debug: log the actual role data
    console.log('Company User Role Data:', {
      userId: companyUser.user.id,
      displayRole: companyUser.displayRole,
      userName: `${companyUser.user.firstName} ${companyUser.user.lastName}`
    });
    
    return {
      id: companyUser.user.id,
      name: `${companyUser.user.firstName} ${companyUser.user.lastName}`,
      email: companyUser.user.email,
      role: companyUser.displayRole, // Use the displayRole directly from backend
      roleFormatted: getRoleDisplayName(companyUser.displayRole), // Formatted role name
      status: 'active', // Assume active for now
      isOwner: companyUser.displayRole?.toLowerCase().includes('owner'),
      avatar: null // No avatar info available yet
    };
  });

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600">
            Members
          </button>
          <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
            Events
          </button>
          <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
            Recent Activity
          </button>
        </nav>
      </div>

      {/* Organization Members */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Members</CardTitle>
          <p className="text-sm text-gray-600">All members associated with this organization</p>
        </CardHeader>
        <CardContent>
          {allMembers.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No members found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell className="font-medium">Email</TableCell>
                  <TableCell className="font-medium">Role</TableCell>
                  <TableCell className="font-medium">Status</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar || undefined} />
                          <AvatarFallback className="text-sm">
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {member.email}
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(member.role)}>
                        {member.roleFormatted || member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}