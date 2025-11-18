"use client";

import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Send,
  Clock,
  FileText,
  Calendar,
  User
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import {
  Escoop,
  EscoopSortField,
  EscoopSortDirection
} from '@/types/escoops';

interface EscoopTableProps {
  escoops: Escoop[];
  loading?: boolean;
  sortField?: EscoopSortField;
  sortDirection?: EscoopSortDirection;
  onSort?: (field: EscoopSortField) => void;
  onEdit?: (escoop: Escoop) => void;
  onDelete?: (escoop: Escoop) => void;
  onView?: (escoop: Escoop) => void;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  className?: string;
  showActions?: boolean;
}

// Status badge configurations
const statusConfig = {
  DRAFT: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: FileText
  },
  SCHEDULED: {
    label: 'Scheduled',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Clock
  },
  SENT: {
    label: 'Sent',
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: Send
  }
};

export function EscoopTable({
  escoops,
  loading,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  onView,
  totalCount,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
  className,
  showActions = true
}: EscoopTableProps) {
  const [deleteEscoop, setDeleteEscoop] = useState<Escoop | null>(null);

  const handleSort = (field: EscoopSortField) => {
    if (onSort) {
      onSort(field);
    }
  };

  const handleDeleteClick = (escoop: Escoop) => {
    setDeleteEscoop(escoop);
  };

  const handleDeleteConfirm = () => {
    if (deleteEscoop && onDelete) {
      onDelete(deleteEscoop);
    }
    setDeleteEscoop(null);
  };

  const SortableHeader = ({
    field,
    children,
    className: headerClassName
  }: {
    field: EscoopSortField;
    children: React.ReactNode;
    className?: string;
  }) => (
    <TableHead
      className={cn(
        "cursor-pointer select-none hover:bg-muted/50",
        headerClassName
      )}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortField === field && (
          sortDirection === EscoopSortDirection.ASC ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )
        )}
      </div>
    </TableHead>
  );

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          <div className="space-y-4 p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (escoops.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-12 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No escoops found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No escoops match your current filters. Try adjusting your search criteria.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader field={EscoopSortField.TITLE}>
                    Title
                  </SortableHeader>
                  <SortableHeader field={EscoopSortField.OWNER}>
                    Client
                  </SortableHeader>
                  <SortableHeader field={EscoopSortField.NAME}>
                    Name (Send Date)
                  </SortableHeader>
                  <TableHead>Location</TableHead>
                  <SortableHeader field={EscoopSortField.STATUS}>
                    Status
                  </SortableHeader>
                  <TableHead>Remaining</TableHead>
                  {showActions && <TableHead className="w-[50px]">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {escoops.map((escoop) => {
                  const statusInfo = statusConfig[escoop.status];
                  const StatusIcon = statusInfo?.icon || FileText;

                  return (
                    <TableRow key={escoop.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="space-y-1">
                          <div className="font-medium">{escoop.title}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {escoop.id.slice(0, 8)}...
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {escoop.owner.firstName} {escoop.owner.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {escoop.owner.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{escoop.name}</div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {format(parseISO(escoop.sendDate), 'MMM dd, yyyy')}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          {escoop.locations.map((location, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {location}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("gap-1", statusInfo?.className)}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo?.label || escoop.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">{escoop.remaining}</span>
                            <span className="text-muted-foreground"> entries</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {escoop.bannersRemaining} banners
                          </div>
                        </div>
                      </TableCell>

                      {showActions && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {onView && (
                                <DropdownMenuItem onClick={() => onView(escoop)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Escoop
                                </DropdownMenuItem>
                              )}
                              {onEdit && (
                                <DropdownMenuItem onClick={() => onEdit(escoop)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {onDelete && (
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(escoop)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {escoops.length} of {totalCount.toLocaleString()} escoops
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onPreviousPage}
                disabled={!hasPreviousPage}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onNextPage}
                disabled={!hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteEscoop} onOpenChange={() => setDeleteEscoop(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Escoop</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deleteEscoop?.title}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}