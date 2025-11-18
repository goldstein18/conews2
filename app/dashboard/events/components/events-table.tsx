"use client";

import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronUp, 
  ChevronDown, 
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Repeat,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Plus
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Event, 
  PageInfo, 
  EventsSortField, 
  EventsSortDirection 
} from "@/types/events";
import {
  formatEventDate,
  formatNextEventDate,
  formatDateForSidebar,
  getEventStatus,
  getEventStatusLabel,
  getEventCompanyName,
  getEventLocationDisplay,
  getEventMarket,
  getAdditionalDatesCount,
  isRecurringEvent,
  getEventImageUrl,
  getEventMainGenre
} from "../utils/events-helpers";
import { cn } from "@/lib/utils";

interface EventsTableProps {
  events: Event[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  sortField: EventsSortField;
  sortDirection: EventsSortDirection;
  pageInfo: PageInfo | undefined;
  onSort: (field: EventsSortField) => void;
  onPreviousPage: () => void;
  onNextPage: (endCursor: string | undefined) => void;
}

interface SortableHeaderProps {
  field: EventsSortField;
  label: string;
  sortField: EventsSortField;
  sortDirection: EventsSortDirection;
  onSort: (field: EventsSortField) => void;
  align?: 'left' | 'right' | 'center';
}

function SortableHeader({ 
  field, 
  label, 
  sortField, 
  sortDirection, 
  onSort, 
  align = 'left' 
}: SortableHeaderProps) {
  const isActive = sortField === field;
  const Icon = sortDirection === 'ASC' ? ChevronUp : ChevronDown;

  return (
    <TableHead className={`cursor-pointer hover:bg-gray-50 select-none ${
      align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : ''
    }`}>
      <div 
        className="flex items-center gap-1"
        onClick={() => onSort(field)}
      >
        {label}
        {isActive && <Icon className="h-4 w-4" />}
      </div>
    </TableHead>
  );
}

function EventsTableSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          <div className="flex-shrink-0 space-y-1">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-6 w-8" />
          </div>
          <Skeleton className="h-16 w-16 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      ))}
    </div>
  );
}

export function EventsTable({
  events,
  loading,
  error,
  totalCount,
  sortField,
  sortDirection,
  pageInfo,
  onSort,
  onPreviousPage,
  onNextPage,
}: EventsTableProps) {

  if (loading && events.length === 0) {
    return <EventsTableSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">Error loading events: {error.message}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
        <p className="text-gray-600 mb-6">Get started by creating your first event.</p>
        <Button asChild>
          <Link href="/dashboard/events/create">Create Event</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {events.length} of {totalCount} events
        </span>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader
                field="TITLE"
                label="Event"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <TableHead>Genre</TableHead>
              <SortableHeader
                field="STATUS"
                label="Status"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <TableHead>Client</TableHead>
              <TableHead>Market</TableHead>
              <SortableHeader
                field="CREATED_AT"
                label="Created"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <TableHead align="right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => {
              const status = getEventStatus(event);
              const statusLabel = getEventStatusLabel(status);
              const companyName = getEventCompanyName(event);
              const imageUrl = getEventImageUrl(event);
              const isRecurring = isRecurringEvent(event);
              const location = getEventLocationDisplay(event);
              const market = getEventMarket(event);
              const mainGenre = getEventMainGenre(event);
              const additionalDatesCount = getAdditionalDatesCount(event);

              // Get badge variant based on status
              const getBadgeVariant = () => {
                const normalized = status.toUpperCase();
                if (normalized === 'APPROVED') return 'default';
                if (normalized === 'PENDING' || normalized === 'PENDING_REVIEW') return 'outline';
                if (normalized === 'REJECTED') return 'destructive';
                return 'secondary';
              };

              // Get custom classes for pending status (yellow)
              const getBadgeClasses = () => {
                const normalized = status.toUpperCase();
                if (normalized === 'PENDING' || normalized === 'PENDING_REVIEW') {
                  return 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-100';
                }
                return '';
              };

              // Use nextEventDate for display
              const eventDate = formatNextEventDate(event.nextEventDate);
              const sidebarDate = formatDateForSidebar(event.nextEventDate);

              return (
                <TableRow key={event.id}>
                  {/* Event Column */}
                  <TableCell className="max-w-xs">
                    <div className="flex items-center space-x-3">
                      {/* Left Date Element */}
                      {sidebarDate && (
                        <div className="flex-shrink-0 text-center">
                          <div className="text-sm font-medium text-blue-600 uppercase">
                            {sidebarDate.month}
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {sidebarDate.day}
                          </div>
                        </div>
                      )}
                      
                      {/* Event Image */}
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={event.title}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Event Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/events/${event.id}`}
                            className="font-medium text-gray-900 hover:text-blue-600 truncate"
                          >
                            {event.title}
                          </Link>
                          {isRecurring && (
                            <Repeat className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{location}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                          <span>{eventDate}</span>
                          {additionalDatesCount > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                              <Plus className="h-3 w-3" />
                              {additionalDatesCount} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Genre Column */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="capitalize"
                      style={{
                        backgroundColor: mainGenre.color ? `${mainGenre.color}20` : '#f3f4f6',
                        borderColor: mainGenre.color || '#d1d5db',
                        color: mainGenre.color || '#6b7280'
                      }}
                    >
                      {mainGenre.name}
                    </Badge>
                  </TableCell>

                  {/* Status Column */}
                  <TableCell>
                    <Badge
                      variant={getBadgeVariant()}
                      className={cn(getBadgeClasses())}
                    >
                      {statusLabel}
                    </Badge>
                  </TableCell>

                  {/* Client Column */}
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {companyName}
                    </div>
                  </TableCell>

                  {/* Market Column */}
                  <TableCell>
                    <span className="text-gray-600">{market}</span>
                  </TableCell>

                  {/* Created Column */}
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {formatEventDate(event.createdAt)}
                    </div>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/events/${event.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem 
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
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pageInfo && (totalCount > 20 || pageInfo.hasNextPage || pageInfo.hasPreviousPage) && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {events.length > 0 ? '1' : '0'} of {Math.ceil(totalCount / 20)}
          </div>
          
          <div className="flex items-center space-x-2">
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
              onClick={() => onNextPage(pageInfo.endCursor)}
              disabled={!pageInfo.hasNextPage}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}