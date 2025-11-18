'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useNotificationsStore } from '@/store/notifications-store';
import { useNotificationSSE } from '@/hooks/use-notification-sse';
import { useQuery } from '@apollo/client';
import { GET_UNREAD_COUNT, GET_NOTIFICATIONS } from '@/lib/graphql/notifications';

/**
 * SSE Manager Component
 * Manages the lifecycle of SSE connection for notifications
 * Handles initial data fetching and real-time updates
 */
export function NotificationSSEManager() {
  const { user, isAuthenticated } = useAuthStore();
  const { setNotifications, setUnreadCount } = useNotificationsStore();
  const [hasInitialized, setHasInitialized] = useState(false);

  // Get JWT token from cookies for SSE connection
  const getToken = () => {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  const token = getToken();

  // Fetch initial notifications data
  const { data: notificationsData } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      first: 20,
      includeTotalCount: false,
    },
    skip: !isAuthenticated || !user,
    fetchPolicy: 'network-only',
  });

  // Fetch unread count
  const { data: unreadData, refetch: refetchUnread } = useQuery(GET_UNREAD_COUNT, {
    skip: !isAuthenticated || !user,
    fetchPolicy: 'network-only',
  });

  // Initialize notifications store with fetched data
  useEffect(() => {
    if (notificationsData?.notifications && !hasInitialized) {
      const notifications = notificationsData.notifications.edges.map((edge: { node: unknown }) => edge.node);
      setNotifications(notifications);
      setHasInitialized(true);
    }
  }, [notificationsData, hasInitialized, setNotifications]);

  // Update unread count
  useEffect(() => {
    if (unreadData?.unreadNotificationsCount !== undefined) {
      setUnreadCount(unreadData.unreadNotificationsCount);
    }
  }, [unreadData, setUnreadCount]);

  // Initialize SSE connection
  useNotificationSSE({
    enabled: isAuthenticated && !!user && !!token,
    token,
    onNotificationReceived: () => {
      // Refetch unread count when new notification arrives
      refetchUnread();
    },
  });

  // Reset on logout
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setHasInitialized(false);
    }
  }, [isAuthenticated, user]);

  // This component doesn't render anything
  return null;
}
