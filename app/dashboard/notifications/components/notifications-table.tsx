import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, CheckCircle } from 'lucide-react';
import { Notification } from '@/types/notification';
import {
  getNotificationTypeColor,
  formatNotificationType,
  formatNotificationDate,
  formatUserDisplayName,
  truncateText,
  getRecipientText,
} from '../utils';
import { SortableTableHeader } from '@/components/ui/sortable-table-header';
import { SortField, SortDirection } from '../hooks/use-notifications-sorting';

interface NotificationsTableProps {
  notifications: Notification[];
  loading?: boolean;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onViewDetails: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string) => void;
}

export function NotificationsTable({
  notifications,
  loading,
  sortField,
  sortDirection,
  onSort,
  onViewDetails,
  onMarkAsRead,
}: NotificationsTableProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Eye className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Notifications Found</h3>
          <p className="text-muted-foreground">
            There are no notifications matching your filters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Status</TableHead>
                <SortableTableHeader<SortField>
                  sortField="title"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={onSort}
                >
                  Title
                </SortableTableHeader>
                <TableHead>Message</TableHead>
                <SortableTableHeader<SortField>
                  sortField="type"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={onSort}
                >
                  Type
                </SortableTableHeader>
                <TableHead>Recipient</TableHead>
                <TableHead>Sender</TableHead>
                <SortableTableHeader<SortField>
                  sortField="createdAt"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={onSort}
                >
                  Date
                </SortableTableHeader>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow
                  key={notification.id}
                  className={notification.isRead ? '' : 'bg-blue-50/50 dark:bg-blue-950/20'}
                >
                  <TableCell>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" title="Unread" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {notification.title}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <span className="text-sm text-muted-foreground">
                      {truncateText(notification.message, 60)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getNotificationTypeColor(notification.type)}
                    >
                      {formatNotificationType(notification.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {getRecipientText(notification.type, notification.user)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {notification.creator
                        ? formatUserDisplayName(
                            notification.creator.firstName,
                            notification.creator.lastName,
                            notification.creator.email
                          )
                        : 'System'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatNotificationDate(notification.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {!notification.isRead && onMarkAsRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMarkAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(notification)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
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
