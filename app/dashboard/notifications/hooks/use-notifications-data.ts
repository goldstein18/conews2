import { useQuery } from '@apollo/client';
import { GET_NOTIFICATIONS, GET_UNREAD_COUNT, GET_CONNECTED_CLIENTS } from '@/lib/graphql/notifications';
import { NotificationConnection, NotificationFilter } from '@/types/notification';

interface UseNotificationsDataProps {
  filter?: NotificationFilter;
  first?: number;
  after?: string | null;
}

interface NotificationsResponse {
  notifications: NotificationConnection;
}

interface UnreadCountResponse {
  unreadNotificationsCount: number;
}

interface ConnectedClientsResponse {
  connectedClientsCount: number;
}

export function useNotificationsData({
  filter,
  first = 20,
  after = null,
}: UseNotificationsDataProps = {}) {
  // Notifications query
  const {
    data: notificationsData,
    loading: notificationsLoading,
    error: notificationsError,
    refetch: refetchNotifications,
    fetchMore,
  } = useQuery<NotificationsResponse>(GET_NOTIFICATIONS, {
    variables: {
      first,
      after,
      includeTotalCount: true,
      filter,
    },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  // Unread count query
  const {
    data: unreadCountData,
    loading: unreadCountLoading,
    refetch: refetchUnreadCount,
  } = useQuery<UnreadCountResponse>(GET_UNREAD_COUNT, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  // Connected clients query (admin only)
  const {
    data: connectedClientsData,
    loading: connectedClientsLoading,
    refetch: refetchConnectedClients,
  } = useQuery<ConnectedClientsResponse>(GET_CONNECTED_CLIENTS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  // Extract data
  const notifications = notificationsData?.notifications.edges.map(edge => edge.node) || [];
  const pageInfo = notificationsData?.notifications.pageInfo;
  const totalCount = notificationsData?.notifications.totalCount || 0;
  const unreadCount = unreadCountData?.unreadNotificationsCount || 0;
  const connectedClients = connectedClientsData?.connectedClientsCount || 0;

  // Calculate stats
  const stats = {
    totalNotifications: totalCount,
    unreadCount,
    connectedClients,
    todayNotifications: notifications.filter(n => {
      const today = new Date();
      const notifDate = new Date(n.createdAt);
      return notifDate.toDateString() === today.toDateString();
    }).length,
  };

  // Load more function for pagination
  const loadMore = async () => {
    if (!pageInfo?.hasNextPage || !pageInfo.endCursor) {
      return;
    }

    try {
      await fetchMore({
        variables: {
          after: pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;

          return {
            notifications: {
              ...fetchMoreResult.notifications,
              edges: [
                ...previousResult.notifications.edges,
                ...fetchMoreResult.notifications.edges,
              ],
            },
          };
        },
      });
    } catch (error) {
      console.error('Error loading more notifications:', error);
    }
  };

  // Refetch all data
  const refetchAll = async () => {
    await Promise.all([
      refetchNotifications(),
      refetchUnreadCount(),
      refetchConnectedClients(),
    ]);
  };

  return {
    // Data
    notifications,
    pageInfo,
    totalCount,
    stats,

    // Loading states
    loading: notificationsLoading,
    unreadCountLoading,
    connectedClientsLoading,

    // Errors
    error: notificationsError,

    // Actions
    refetch: refetchNotifications,
    refetchUnreadCount,
    refetchConnectedClients,
    refetchAll,
    loadMore,

    // Pagination
    hasNextPage: pageInfo?.hasNextPage || false,
    endCursor: pageInfo?.endCursor || null,
  };
}
