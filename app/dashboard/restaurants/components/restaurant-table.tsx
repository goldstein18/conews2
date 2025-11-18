'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Utensils
} from 'lucide-react';
import { Restaurant, RestaurantSortField, SortDirection, RestaurantStatus } from '@/types/restaurants';
import { formatDistance } from 'date-fns';
import { cn } from '@/lib/utils';

interface RestaurantTableProps {
  restaurants: Restaurant[];
  loading?: boolean;
  sortField?: RestaurantSortField;
  sortDirection?: SortDirection;
  onSort?: (field: RestaurantSortField) => void;
  onEdit?: (restaurant: Restaurant) => void;
  onDelete?: (restaurant: Restaurant) => void;
  onView?: (restaurant: Restaurant) => void;
  onApprove?: (restaurant: Restaurant) => void;
  onDecline?: (restaurant: Restaurant) => void;
  totalCount?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  onLoadMore?: () => void;
  showActions?: boolean;
}

export function RestaurantTable({
  restaurants,
  loading = false,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  onView,
  onApprove,
  onDecline,
  totalCount,
  hasNextPage = false,
  hasPreviousPage = false,
  onNextPage,
  onPreviousPage,
  showActions = true
}: RestaurantTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState<Restaurant | null>(null);

  const handleSort = (field: RestaurantSortField) => {
    if (onSort) {
      onSort(field);
    }
  };

  const getSortIcon = (field: RestaurantSortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const getStatusBadge = (status: RestaurantStatus) => {
    const variants = {
      [RestaurantStatus.APPROVED]: 'bg-green-100 text-green-800 border-green-200',
      [RestaurantStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [RestaurantStatus.DECLINED]: 'bg-red-100 text-red-800 border-red-200',
      [RestaurantStatus.DELETED]: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const labels = {
      [RestaurantStatus.APPROVED]: 'Approved',
      [RestaurantStatus.PENDING]: 'Pending',
      [RestaurantStatus.DECLINED]: 'Declined',
      [RestaurantStatus.DELETED]: 'Deleted'
    };

    return (
      <Badge className={cn('border', variants[status])}>
        {labels[status]}
      </Badge>
    );
  };

  const getPriceRangeBadge = (priceRange: string) => {
    const symbols = {
      'BUDGET': '$',
      'MODERATE': '$$',
      'UPSCALE': '$$$',
      'FINE_DINING': '$$$$'
    };
    return symbols[priceRange as keyof typeof symbols] || priceRange;
  };

  const handleDeleteClick = (restaurant: Restaurant) => {
    setRestaurantToDelete(restaurant);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (restaurantToDelete && onDelete) {
      onDelete(restaurantToDelete);
    }
    setDeleteDialogOpen(false);
    setRestaurantToDelete(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Restaurants</CardTitle>
            {totalCount !== undefined && (
              <Badge variant="secondary">
                {totalCount} total
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('name')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Restaurant Name
                      {getSortIcon('name')}
                    </Button>
                  </TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('market')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Market
                      {getSortIcon('market')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('status')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Status
                      {getSortIcon('status')}
                    </Button>
                  </TableHead>
                  <TableHead>Cuisine</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('createdAt')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Date Added
                      {getSortIcon('createdAt')}
                    </Button>
                  </TableHead>
                  {showActions && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {restaurants.map((restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{restaurant.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {restaurant.address}, {restaurant.city}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{restaurant.company?.name || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">
                          {restaurant.company?.email || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{restaurant.market}</TableCell>
                    <TableCell>
                      {getStatusBadge(restaurant.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Utensils className="h-4 w-4 text-muted-foreground" />
                        <span>{restaurant.restaurantType?.displayName || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getPriceRangeBadge(restaurant.priceRange)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDistance(new Date(restaurant.createdAt), new Date(), { addSuffix: true })}
                    </TableCell>
                    {showActions && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onView && (
                              <DropdownMenuItem onClick={() => onView(restaurant)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                            )}
                            {onEdit && (
                              <DropdownMenuItem onClick={() => onEdit(restaurant)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {onApprove && restaurant.status === RestaurantStatus.PENDING && (
                              <DropdownMenuItem 
                                onClick={() => onApprove(restaurant)}
                                className="text-green-600"
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            {onDecline && restaurant.status === RestaurantStatus.PENDING && (
                              <DropdownMenuItem 
                                onClick={() => onDecline(restaurant)}
                                className="text-red-600"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Decline
                              </DropdownMenuItem>
                            )}
                            {onDelete && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteClick(restaurant)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {(hasNextPage || hasPreviousPage) && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                {totalCount !== undefined && (
                  <>Showing {restaurants.length} of {totalCount} restaurants</>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPreviousPage}
                  disabled={!hasPreviousPage || loading}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNextPage}
                  disabled={!hasNextPage || loading}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {restaurants.length === 0 && !loading && (
            <div className="text-center py-12">
              <Utensils className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No restaurants found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No restaurants match your current filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the restaurant &quot;{restaurantToDelete?.name}&quot;. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}