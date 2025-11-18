"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Palette
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  ArtsGroup,
  ArtsGroupSortField,
  ArtsGroupSortDirection,
  ArtsGroupStatus
} from '@/types/arts-groups';
import { useAuthStore } from '@/store/auth-store';
import { isSuperAdmin } from '@/lib/roles';
import { format } from 'date-fns';

interface ArtsGroupsTableProps {
  artsGroups: ArtsGroup[];
  loading?: boolean;
  sortField: ArtsGroupSortField;
  sortDirection: ArtsGroupSortDirection;
  onSort: (field: ArtsGroupSortField) => void;
  onEdit: (artsGroup: ArtsGroup) => void;
  onDelete: (artsGroup: ArtsGroup) => void;
  onStatusChange?: (artsGroup: ArtsGroup, status: ArtsGroupStatus) => void;
  className?: string;
}

const statusConfig = {
  [ArtsGroupStatus.APPROVED]: {
    label: 'Approved',
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle
  },
  [ArtsGroupStatus.PENDING]: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock
  },
  [ArtsGroupStatus.DECLINED]: {
    label: 'Declined',
    className: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle
  },
  [ArtsGroupStatus.DELETED]: {
    label: 'Deleted',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: XCircle
  }
};

export function ArtsGroupsTable({
  artsGroups,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  onStatusChange,
  className
}: ArtsGroupsTableProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArtsGroup, setSelectedArtsGroup] = useState<ArtsGroup | null>(null);

  const canChangeStatus = user && isSuperAdmin(user);

  const handleDeleteClick = (artsGroup: ArtsGroup) => {
    setSelectedArtsGroup(artsGroup);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedArtsGroup) {
      onDelete(selectedArtsGroup);
    }
    setDeleteDialogOpen(false);
    setSelectedArtsGroup(null);
  };

  const renderSortIcon = (field: ArtsGroupSortField) => {
    if (sortField !== field) return null;
    return sortDirection === ArtsGroupSortDirection.ASC ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    );
  };

  return (
    <>
      <div className={cn("rounded-md border", className)}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort(ArtsGroupSortField.NAME)}
              >
                Arts Group Name
                {renderSortIcon(ArtsGroupSortField.NAME)}
              </TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Client</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort(ArtsGroupSortField.MARKET)}
              >
                Market
                {renderSortIcon(ArtsGroupSortField.MARKET)}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort(ArtsGroupSortField.STATUS)}
              >
                Status
                {renderSortIcon(ArtsGroupSortField.STATUS)}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort(ArtsGroupSortField.ART_TYPE)}
              >
                Art Type
                {renderSortIcon(ArtsGroupSortField.ART_TYPE)}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort(ArtsGroupSortField.CREATED_AT)}
              >
                Date Added
                {renderSortIcon(ArtsGroupSortField.CREATED_AT)}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artsGroups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No arts groups found
                </TableCell>
              </TableRow>
            ) : (
              artsGroups.map((artsGroup) => {
                const StatusIcon = statusConfig[artsGroup.status].icon;
                return (
                  <TableRow key={artsGroup.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <button
                        onClick={() => router.push(`/dashboard/arts-groups/${artsGroup.id}/edit`)}
                        className="hover:underline text-left"
                      >
                        {artsGroup.name}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {artsGroup.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{artsGroup.company.name}</div>
                        {artsGroup.company.email && (
                          <div className="text-xs text-muted-foreground">
                            {artsGroup.company.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {artsGroup.market}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {canChangeStatus && onStatusChange ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center space-x-1">
                              <Badge
                                variant="outline"
                                className={statusConfig[artsGroup.status].className}
                              >
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusConfig[artsGroup.status].label}
                              </Badge>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onStatusChange(artsGroup, ArtsGroupStatus.APPROVED)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onStatusChange(artsGroup, ArtsGroupStatus.PENDING)}
                            >
                              <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                              Set Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onStatusChange(artsGroup, ArtsGroupStatus.DECLINED)}
                            >
                              <XCircle className="h-4 w-4 mr-2 text-red-600" />
                              Decline
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Badge
                          variant="outline"
                          className={statusConfig[artsGroup.status].className}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[artsGroup.status].label}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Palette className="h-3 w-3 mr-1 text-muted-foreground" />
                        {artsGroup.artType || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(artsGroup.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onEdit(artsGroup)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(artsGroup)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Arts Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedArtsGroup?.name}&quot;? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
