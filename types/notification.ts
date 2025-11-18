// Notification types and interfaces

export enum NotificationType {
  GLOBAL = 'GLOBAL',
  DIRECT = 'DIRECT',
  SYSTEM = 'SYSTEM'
}

export interface NotificationUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  userId: string | null;
  targetRole: string | null;
  isRead: boolean;
  readAt: string | null;
  metadata: Record<string, any> | null;
  createdBy: string;
  creator: NotificationUser | null;
  user: NotificationUser | null;
  createdAt: string;
}

export interface NotificationEdge {
  node: Notification;
  cursor: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface NotificationConnection {
  edges: NotificationEdge[];
  pageInfo: PageInfo;
  totalCount?: number;
}

export interface NotificationFilter {
  type?: NotificationType;
  isRead?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface NotificationStats {
  todayNotifications: number;
  totalNotifications: number;
  unreadCount: number;
  connectedClients: number;
  notificationsByType: {
    type: NotificationType;
    count: number;
  }[];
}

export interface SendNotificationInput {
  title: string;
  message: string;
  type: NotificationType;
  userId?: string;
  metadata?: Record<string, any>;
}

// SSE Message types
export interface SSEConnectedMessage {
  type: 'connected';
  message: string;
  timestamp: string;
}

export interface SSENotificationMessage extends Notification {
  type: NotificationType;
}

export type SSEMessage = SSEConnectedMessage | SSENotificationMessage;

// Helper type guards
export function isConnectedMessage(msg: SSEMessage): msg is SSEConnectedMessage {
  return 'type' in msg && msg.type === 'connected';
}

export function isNotificationMessage(msg: SSEMessage): msg is SSENotificationMessage {
  return 'id' in msg && 'title' in msg && 'message' in msg;
}
