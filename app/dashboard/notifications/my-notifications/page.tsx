'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCheck } from 'lucide-react';
import { Notification } from '@/types/notification';
import { MARK_NOTIFICATION_AS_READ, MARK_ALL_NOTIFICATIONS_AS_READ } from '@/lib/graphql/notifications';
import { useToast } from '@/hooks/use-toast';
import {
  NotificationsFilters,
  NotificationsTable,
  NotificationDetailSheet,
} from '../components';
import {
  useNotificationsData,
  useNotificationsFilters,
  useNotificationsSorting,
} from '../hooks';

export default function MyNotificationsPage() {
  const { toast } = useToast();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  // Filters
  const {
    searchTerm,
    selectedType,
    readFilter,
    filter,
    hasActiveFilters,
    setSearchTerm,
    setSelectedType,
    setReadFilter,
    clearFilters,
  } = useNotificationsFilters();

  // Sorting
  const { sortField, sortDirection, handleSort, sortNotifications } = useNotificationsSorting();

  // Data
  const {
    notifications: rawNotifications,
    stats,
    loading,
    error,
    refetchAll,
    loadMore,
    hasNextPage,
  } = useNotificationsData({ filter });

  // Mutations
  const [markAsReadMutation] = useMutation(MARK_NOTIFICATION_AS_READ);
  const [markAllAsReadMutation, { loading: markingAllAsRead }] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ);

  // Sort notifications client-side
  const notifications = sortNotifications(rawNotifications);

  // Handlers
  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDetailSheetOpen(true);

    // Mark as read when viewing
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsReadMutation({
        variables: {
          input: { id: notificationId },
        },
      });

      // Refetch data
      await refetchAll();

      toast({
        title: 'Notification marked as read',
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation();

      // Refetch data
      await refetchAll();

      toast({
        title: 'All notifications marked as read',
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    }
  };

  const handleRefresh = () => {
    refetchAll();
    toast({
      title: 'Refreshed',
      description: 'Notification data has been refreshed',
    });
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
          <p className="font-bold">Error loading notifications</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Notifications</h2>
          <p className="text-muted-foreground">
            {stats.unreadCount > 0
              ? `You have ${stats.unreadCount} unread notification${stats.unreadCount === 1 ? '' : 's'}`
              : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          {stats.unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              disabled={markingAllAsRead}
            >
              {markingAllAsRead ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                  Marking...
                </>
              ) : (
                <>
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark All Read
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <NotificationsFilters
            searchTerm={searchTerm}
            selectedType={selectedType}
            readFilter={readFilter}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={setSearchTerm}
            onTypeChange={setSelectedType}
            onReadFilterChange={setReadFilter}
            onClearFilters={clearFilters}
          />
        </div>

        <div className="lg:col-span-3 space-y-4">
          <NotificationsTable
            notifications={notifications}
            loading={loading}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onViewDetails={handleViewDetails}
            onMarkAsRead={handleMarkAsRead}
          />

          {/* Load More */}
          {hasNextPage && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loading}
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Sheet */}
      <NotificationDetailSheet
        notification={selectedNotification}
        open={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
      />
    </div>
  );
}
