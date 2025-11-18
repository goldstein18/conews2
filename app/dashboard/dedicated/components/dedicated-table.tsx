'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Edit, Trash, ArrowUpDown, ExternalLink, Calendar, Wand2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Dedicated, DedicatedStatus } from '@/types/dedicated';
import type { DedicatedSortField, SortDirection } from '../hooks/use-dedicated-sorting';
import {
  getStatusBadgeColor,
  formatSendDate,
  formatMarketLabel,
  isSendDateSoon
} from '../utils';

interface DedicatedTableProps {
  dedicated: Dedicated[];
  loading: boolean;
  sortField: DedicatedSortField;
  sortDirection: SortDirection;
  onSort: (field: DedicatedSortField) => void;
  onEdit: (dedicated: Dedicated) => void;
  onDelete: (dedicated: Dedicated) => void;
  onStatusChange?: (dedicated: Dedicated, newStatus: DedicatedStatus) => void;
}

export function DedicatedTable({
  dedicated,
  loading,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  onStatusChange
}: DedicatedTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDedicated, setSelectedDedicated] = useState<Dedicated | null>(null);

  const handleDeleteClick = (item: Dedicated) => {
    setSelectedDedicated(item);
    setDeleteDialogOpen(true);
  };

  const handleOpenBuilder = (item: Dedicated) => {
    router.push(`/dashboard/dedicated/${item.id}/builder`);
  };

  const handleDeleteConfirm = () => {
    if (selectedDedicated) {
      onDelete(selectedDedicated);
    }
    setDeleteDialogOpen(false);
    setSelectedDedicated(null);
  };

  const renderSortIcon = (field: DedicatedSortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return (
      <ArrowUpDown
        className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`}
      />
    );
  };

  if (dedicated.length === 0 && !loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No dedicated campaigns found</p>
          <p className="text-sm text-muted-foreground">
            Create your first dedicated campaign to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Dedicated Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Image</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => onSort('subject')}
                      className="h-8 p-0 hover:bg-transparent"
                    >
                      Subject
                      {renderSortIcon('subject')}
                    </Button>
                  </TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => onSort('market')}
                      className="h-8 p-0 hover:bg-transparent"
                    >
                      Market
                      {renderSortIcon('market')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => onSort('sendDate')}
                      className="h-8 p-0 hover:bg-transparent"
                    >
                      Send Date
                      {renderSortIcon('sendDate')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => onSort('status')}
                      className="h-8 p-0 hover:bg-transparent"
                    >
                      Status
                      {renderSortIcon('status')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dedicated.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="relative w-28 h-16 rounded border overflow-hidden bg-muted">
                        {item.imageUrl && item.imageUrl !== 'placeholder' ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.alternateText}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{item.subject}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {item.alternateText}
                        </div>
                        {item.company && (
                          <div className="text-xs text-muted-foreground">
                            {item.company.name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <span className="max-w-[200px] truncate">{item.link}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{formatMarketLabel(item.market)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                          <div className="text-sm">{formatSendDate(item.sendDate)}</div>
                          {isSendDateSoon(item.sendDate) && item.status === DedicatedStatus.SCHEDULED && (
                            <Badge variant="secondary" className="text-xs">
                              Sending soon
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenBuilder(item)}>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Open Builder
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {onStatusChange && item.status !== DedicatedStatus.SENT && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                              {item.status !== DedicatedStatus.PENDING && (
                                <DropdownMenuItem
                                  onClick={() => onStatusChange(item, DedicatedStatus.PENDING)}
                                >
                                  Set as Pending
                                </DropdownMenuItem>
                              )}
                              {item.status !== DedicatedStatus.SCHEDULED && (
                                <DropdownMenuItem
                                  onClick={() => onStatusChange(item, DedicatedStatus.SCHEDULED)}
                                >
                                  Set as Scheduled
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(item)}
                            className="text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the dedicated campaign &quot;{selectedDedicated?.subject}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
