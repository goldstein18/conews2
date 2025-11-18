import { create } from 'zustand';
import { Notification } from '@/types/notification';

interface NotificationsState {
  // State
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  sseConnection: EventSource | null;
  isReconnecting: boolean;
  reconnectAttempts: number;

  // Actions
  addNotification: (notification: Notification) => void;
  setNotifications: (notifications: Notification[]) => void;
  prependNotifications: (notifications: Notification[]) => void;
  markAsRead: (notificationId: string) => void;
  markMultipleAsRead: (notificationIds: string[]) => void;
  markAllAsRead: () => void;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: () => void;
  setSSEConnection: (connection: EventSource | null) => void;
  setConnected: (connected: boolean) => void;
  setReconnecting: (reconnecting: boolean) => void;
  incrementReconnectAttempts: () => void;
  resetReconnectAttempts: () => void;
  clearNotifications: () => void;
  reset: () => void;
}

const initialState = {
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  sseConnection: null,
  isReconnecting: false,
  reconnectAttempts: 0,
};

export const useNotificationsStore = create<NotificationsState>()((set, get) => ({
  ...initialState,

  // Add a new notification (prepend to list, typically from SSE)
  addNotification: (notification) => {
    const { notifications } = get();

    // Avoid duplicates
    if (notifications.some(n => n.id === notification.id)) {
      return;
    }

    set({
      notifications: [notification, ...notifications],
    });

    // Increment unread count if notification is unread
    if (!notification.isRead) {
      get().incrementUnreadCount();
    }
  },

  // Set notifications (replace entire list, typically from initial fetch)
  setNotifications: (notifications) => {
    set({ notifications });
  },

  // Prepend notifications (add to beginning, for pagination)
  prependNotifications: (newNotifications) => {
    const { notifications } = get();
    const existingIds = new Set(notifications.map(n => n.id));
    const uniqueNew = newNotifications.filter(n => !existingIds.has(n.id));

    set({
      notifications: [...uniqueNew, ...notifications],
    });
  },

  // Mark single notification as read
  markAsRead: (notificationId) => {
    const { notifications, unreadCount } = get();

    set({
      notifications: notifications.map(n =>
        n.id === notificationId && !n.isRead
          ? { ...n, isRead: true, readAt: new Date().toISOString() }
          : n
      ),
    });

    // Decrement unread count if notification was previously unread
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead && unreadCount > 0) {
      set({ unreadCount: unreadCount - 1 });
    }
  },

  // Mark multiple notifications as read
  markMultipleAsRead: (notificationIds) => {
    const { notifications, unreadCount } = get();
    const idsSet = new Set(notificationIds);

    // Count how many unread notifications are being marked as read
    const unreadBeingMarked = notifications.filter(
      n => idsSet.has(n.id) && !n.isRead
    ).length;

    set({
      notifications: notifications.map(n =>
        idsSet.has(n.id) && !n.isRead
          ? { ...n, isRead: true, readAt: new Date().toISOString() }
          : n
      ),
      unreadCount: Math.max(0, unreadCount - unreadBeingMarked),
    });
  },

  // Mark all notifications as read
  markAllAsRead: () => {
    const { notifications } = get();

    set({
      notifications: notifications.map(n =>
        n.isRead ? n : { ...n, isRead: true, readAt: new Date().toISOString() }
      ),
      unreadCount: 0,
    });
  },

  // Set unread count
  setUnreadCount: (count) => {
    set({ unreadCount: Math.max(0, count) });
  },

  // Increment unread count
  incrementUnreadCount: () => {
    const { unreadCount } = get();
    set({ unreadCount: unreadCount + 1 });
  },

  // Decrement unread count
  decrementUnreadCount: () => {
    const { unreadCount } = get();
    set({ unreadCount: Math.max(0, unreadCount - 1) });
  },

  // Set SSE connection
  setSSEConnection: (connection) => {
    // Close previous connection if exists
    const { sseConnection } = get();
    if (sseConnection) {
      sseConnection.close();
    }

    set({ sseConnection: connection });
  },

  // Set connection status
  setConnected: (connected) => {
    set({ isConnected: connected });
  },

  // Set reconnecting status
  setReconnecting: (reconnecting) => {
    set({ isReconnecting: reconnecting });
  },

  // Increment reconnect attempts
  incrementReconnectAttempts: () => {
    const { reconnectAttempts } = get();
    set({ reconnectAttempts: reconnectAttempts + 1 });
  },

  // Reset reconnect attempts
  resetReconnectAttempts: () => {
    set({ reconnectAttempts: 0 });
  },

  // Clear all notifications
  clearNotifications: () => {
    set({
      notifications: [],
      unreadCount: 0,
    });
  },

  // Reset entire store
  reset: () => {
    const { sseConnection } = get();

    // Close SSE connection if exists
    if (sseConnection) {
      sseConnection.close();
    }

    set(initialState);
  },
}));
