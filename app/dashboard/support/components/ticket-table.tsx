import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpDown, MessageSquare, Paperclip, ChevronRight, ChevronLeft } from 'lucide-react';
import { Ticket, TicketSortField, TicketPageInfo } from '@/types/ticket';
import { TicketStatusBadge } from './ticket-status-badge';
import { TicketPriorityBadge } from './ticket-priority-badge';
import { formatTicketNumber, getRelativeTimeString, getUserFullName } from '../utils/ticket-helpers';
import { getCategoryLabel } from '../lib/validations';

interface TicketTableProps {
  tickets: Ticket[];
  loading?: boolean;
  sortField: TicketSortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: TicketSortField) => void;
  pageInfo: TicketPageInfo;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  totalCount?: number;
  showCompanyColumn?: boolean;
}

export function TicketTable({
  tickets,
  loading,
  onSort,
  pageInfo,
  onNextPage,
  onPreviousPage,
  totalCount,
  showCompanyColumn = false,
}: TicketTableProps) {
  const router = useRouter();

  if (loading) {
    return <TicketTableSkeleton />;
  }

  const handleRowClick = (ticketId: string) => {
    router.push(`/dashboard/support/${ticketId}`);
  };

  const SortButton = ({ field, children }: { field: TicketSortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => onSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-3 w-3" />
    </Button>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Support Tickets</CardTitle>
        {totalCount !== undefined && (
          <div className="text-sm text-gray-500">
            {totalCount} {totalCount === 1 ? 'ticket' : 'tickets'}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No tickets found</p>
            <p className="text-sm">Try adjusting your filters or create a new ticket</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">
                      <SortButton field="createdAt">Ticket</SortButton>
                    </TableHead>
                    <TableHead>
                      <SortButton field="title">Title</SortButton>
                    </TableHead>
                    <TableHead>
                      <SortButton field="status">Status</SortButton>
                    </TableHead>
                    <TableHead>
                      <SortButton field="priority">Priority</SortButton>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    {showCompanyColumn && (
                      <TableHead>Company</TableHead>
                    )}
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-center">
                      <MessageSquare className="h-4 w-4 inline" />
                    </TableHead>
                    <TableHead className="text-center">
                      <Paperclip className="h-4 w-4 inline" />
                    </TableHead>
                    <TableHead>
                      <SortButton field="lastCommentAt">Last Activity</SortButton>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleRowClick(ticket.id)}
                    >
                      <TableCell className="font-mono text-sm text-gray-600">
                        {formatTicketNumber(ticket.id)}
                      </TableCell>
                      <TableCell className="font-medium max-w-md truncate">
                        {ticket.title}
                      </TableCell>
                      <TableCell>
                        <TicketStatusBadge status={ticket.status} />
                      </TableCell>
                      <TableCell>
                        <TicketPriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {getCategoryLabel(ticket.category)}
                      </TableCell>
                      {showCompanyColumn && (
                        <TableCell className="text-sm text-gray-600">
                          {ticket.company.name}
                        </TableCell>
                      )}
                      <TableCell className="text-sm text-gray-600">
                        {ticket.assignedTo ? getUserFullName(ticket.assignedTo) : (
                          <span className="text-gray-400 italic">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-600">
                        {ticket._count?.comments || 0}
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-600">
                        {ticket._count?.attachments || 0}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {ticket.lastCommentAt
                          ? getRelativeTimeString(ticket.lastCommentAt)
                          : getRelativeTimeString(ticket.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {(pageInfo.hasNextPage || pageInfo.hasPreviousPage) && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing {tickets.length} tickets
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onPreviousPage}
                    disabled={!pageInfo.hasPreviousPage}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onNextPage}
                    disabled={!pageInfo.hasNextPage}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function TicketTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
