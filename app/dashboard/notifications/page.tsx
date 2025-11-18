'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { Notification } from '@/types/notification';
import { MARK_NOTIFICATION_AS_READ } from '@/lib/graphql/notifications';
import { useToast } from '@/hooks/use-toast';
import {
  NotificationsStats,
  NotificationsFilters,
  NotificationsTable,
  NotificationDetailSheet,
  SendNotificationDialog,
} from './components';
import {
  useNotificationsData,
  useNotificationsFilters,
  useNotificationsSorting,
} from './hooks';

export default function NotificationsPage() {
  const { toast } = useToast();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);

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

  // Mark as read mutation
  const [markAsReadMutation] = useMutation(MARK_NOTIFICATION_AS_READ);

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

  const handleSendSuccess = () => {
    // Refetch all data after sending
    refetchAll();
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
          <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">
            Manage and send notifications to users
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
          <Button onClick={() => setIsSendDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Send Notification
          </Button>
        </div>
      </div>

      {/* Stats */}
      <NotificationsStats stats={stats} loading={loading} />

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

      {/* Send Dialog */}
      <SendNotificationDialog
        open={isSendDialogOpen}
        onOpenChange={setIsSendDialogOpen}
        onSuccess={handleSendSuccess}
      />
    </div>
  );
}
