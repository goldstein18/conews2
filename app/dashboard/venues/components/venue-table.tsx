"use client";

import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  MapPin, 
  Building2,
  ExternalLink,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  PauseCircle
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
import { 
  Venue, 
  VenueSortField, 
  VenueSortDirection 
} from '@/types/venues';

interface VenueTableProps {
  venues: Venue[];
  loading?: boolean;
  sortField: VenueSortField;
  sortDirection: VenueSortDirection;
  onSort: (field: VenueSortField) => void;
  onEdit: (venue: Venue) => void;
  onDelete: (venue: Venue) => void;
  onView?: (venue: Venue) => void;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onLoadMore?: () => void;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  className?: string;
  showActions?: boolean;
}

// Status badge configurations
const statusConfig = {
  APPROVED: { 
    label: 'Approved', 
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle
  },
  PENDING: { 
    label: 'Pending Review', 
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock
  },
  PENDING_REVIEW: { 
    label: 'Pending Review', 
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock
  },
  REJECTED: { 
    label: 'Rejected', 
    className: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle
  },
  SUSPENDED: { 
    label: 'Suspended', 
    className: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: PauseCircle
  },
  DELETED: { 
    label: 'Deleted', 
    className: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: XCircle
  }
};

// Priority badge configurations  
const priorityConfig = {
  HIGH: { 
    label: 'High', 
    className: 'bg-red-100 text-red-800 border-red-200'
  },
  MEDIUM: { 
    label: 'Medium', 
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  LOW: { 
    label: 'Low', 
    className: 'bg-green-100 text-green-800 border-green-200'
  }
};

// Table header configuration
const tableHeaders: Array<{
  key: VenueSortField;
  label: string;
  sortable: boolean;
  className?: string;
}> = [
  { key: 'name', label: 'Venue Name', sortable: true },
  { key: 'city', label: 'Location', sortable: true, className: 'hidden md:table-cell' },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'priority', label: 'Priority', sortable: true, className: 'hidden lg:table-cell' },
  { key: 'createdAt', label: 'Created', sortable: true, className: 'hidden xl:table-cell' }
];

export function VenueTable({
  venues,
  loading = false,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  onView,
  totalCount,
  hasNextPage,
  hasPreviousPage,
  onLoadMore,
  onNextPage,
  onPreviousPage,
  className,
  showActions = true
}: VenueTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState<Venue | null>(null);

  const handleDeleteClick = (venue: Venue) => {
    setVenueToDelete(venue);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (venueToDelete) {
      onDelete(venueToDelete);
      setDeleteDialogOpen(false);
      setVenueToDelete(null);
    }
  };

  const handleSort = (field: VenueSortField) => {
    onSort(field);
  };

  const getSortIcon = (field: VenueSortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  if (loading) {
    return <VenueTableSkeleton className={className} />;
  }

  if (venues.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No venues found</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            No venues match your current filters. Try adjusting your search criteria or clear the filters to see all venues.
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
                  {tableHeaders.map((header) => (
                    <TableHead 
                      key={header.key}
                      className={cn(
                        header.className,
                        header.sortable && "cursor-pointer hover:bg-muted/50 select-none"
                      )}
                      onClick={header.sortable ? () => handleSort(header.key) : undefined}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{header.label}</span>
                        {header.sortable && getSortIcon(header.key)}
                      </div>
                    </TableHead>
                  ))}
                  {showActions && (
                    <TableHead className="w-12">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {venues.map((venue) => (
                  <VenueTableRow
                    key={venue.id}
                    venue={venue}
                    onEdit={() => onEdit(venue)}
                    onDelete={() => handleDeleteClick(venue)}
                    onView={onView ? () => onView(venue) : undefined}
                    showActions={showActions}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {(hasNextPage || hasPreviousPage || onLoadMore) && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {venues.length} of {totalCount} venues
          </p>
          
          <div className="flex items-center space-x-2">
            {hasPreviousPage && onPreviousPage && (
              <Button variant="outline" size="sm" onClick={onPreviousPage}>
                Previous
              </Button>
            )}
            
            {hasNextPage && onNextPage && (
              <Button variant="outline" size="sm" onClick={onNextPage}>
                Next
              </Button>
            )}
            
            {onLoadMore && hasNextPage && (
              <Button variant="ghost" size="sm" onClick={onLoadMore}>
                Load More
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Venue</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{venueToDelete?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Individual table row component
function VenueTableRow({
  venue,
  onEdit,
  onDelete,
  onView,
  showActions
}: {
  venue: Venue;
  onEdit: () => void;
  onDelete: () => void;
  onView?: () => void;
  showActions: boolean;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <TableRow className="hover:bg-muted/50">
      {/* Venue Name */}
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium">{venue.name}</div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Building2 className="h-3 w-3 mr-1" />
            {venue.company?.name || 'No company'}
          </div>
          {venue.website && (
            <div className="flex items-center text-sm text-muted-foreground">
              <ExternalLink className="h-3 w-3 mr-1" />
              <a 
                href={venue.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Website
              </a>
            </div>
          )}
        </div>
      </TableCell>

      {/* Location */}
      <TableCell className="hidden md:table-cell">
        <div className="space-y-1">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
            <span className="text-sm">{venue.city}, {venue.state}</span>
          </div>
          <div className="text-xs text-muted-foreground">{venue.address}</div>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        {(() => {
          const config = statusConfig[venue.status as keyof typeof statusConfig];
          const IconComponent = config?.icon;
          
          return (
            <Badge 
              variant="outline" 
              className={config?.className}
            >
              {IconComponent && (
                <IconComponent className="h-3 w-3 mr-1" />
              )}
              {config?.label}
            </Badge>
          );
        })()}
      </TableCell>

      {/* Priority */}
      <TableCell className="hidden lg:table-cell">
        <Badge 
          variant="outline" 
          className={priorityConfig[venue.priority as keyof typeof priorityConfig]?.className}
        >
          {priorityConfig[venue.priority as keyof typeof priorityConfig]?.label}
        </Badge>
      </TableCell>

      {/* Created Date */}
      <TableCell className="hidden xl:table-cell">
        <div className="text-sm text-muted-foreground">
          {formatDate(venue.createdAt)}
        </div>
      </TableCell>

      {/* Actions */}
      {showActions && (
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {onView && (
                <>
                  <DropdownMenuItem onClick={onView}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Venue
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Venue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      )}
    </TableRow>
  );
}

// Skeleton version for loading state
export function VenueTableSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableHead key={header.key} className={header.className}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
                <TableHead className="w-12">
                  <Skeleton className="h-4 w-8" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}