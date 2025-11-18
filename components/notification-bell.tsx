'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { Bell, Check, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useNotificationsStore } from '@/store/notifications-store';
import { useAuthStore } from '@/store/auth-store';
import { MARK_NOTIFICATION_AS_READ, MARK_ALL_NOTIFICATIONS_AS_READ } from '@/lib/graphql/notifications';
import {
  formatNotificationDate,
  truncateText,
  getNotificationTypeColor,
  formatNotificationType,
} from '@/app/dashboard/notifications/utils';

export function NotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationsStore();

  const [markAsReadMutation] = useMutation(MARK_NOTIFICATION_AS_READ);
  const [markAllAsReadMutation, { loading: markingAllAsRead }] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ);

  // Get last 5 notifications for the bell dropdown
  const recentNotifications = notifications.slice(0, 5);

  const handleNotificationClick = async (notificationId: string, isRead: boolean) => {
    // Mark as read if unread
    if (!isRead) {
      try {
        await markAsReadMutation({
          variables: {
            input: { id: notificationId },
          },
        });
        markAsRead(notificationId);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Close popover
    setIsOpen(false);

    // Navigate to notifications page (we'll create this next)
    router.push('/dashboard/notifications/my-notifications');
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation();
      markAllAsRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    router.push('/dashboard/notifications/my-notifications');
  };

  // Don't show if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markingAllAsRead}
              className="h-auto p-1 text-xs"
            >
              {markingAllAsRead ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Mark all read
                </>
              )}
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {recentNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No notifications yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                We&apos;ll notify you when something arrives
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {recentNotifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                  className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Unread indicator */}
                    <div className="flex-shrink-0 mt-1">
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title and type badge */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-medium line-clamp-1">
                          {notification.title}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 ${getNotificationTypeColor(notification.type)}`}
                        >
                          {formatNotificationType(notification.type)}
                        </Badge>
                      </div>

                      {/* Message */}
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                        {truncateText(notification.message, 80)}
                      </p>

                      {/* Time */}
                      <p className="text-xs text-muted-foreground">
                        {formatNotificationDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        {recentNotifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-center text-sm"
                onClick={handleViewAll}
              >
                <Eye className="h-4 w-4 mr-2" />
                View All Notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
