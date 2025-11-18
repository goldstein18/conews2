import { NotificationType } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';

/**
 * Get color class for notification type badge
 */
export function getNotificationTypeColor(type: NotificationType): string {
  switch (type) {
    case NotificationType.GLOBAL:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case NotificationType.DIRECT:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case NotificationType.SYSTEM:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
}

/**
 * Get icon color for notification type
 */
export function getNotificationIconColor(type: NotificationType): string {
  switch (type) {
    case NotificationType.GLOBAL:
      return 'text-purple-600 dark:text-purple-400';
    case NotificationType.DIRECT:
      return 'text-green-600 dark:text-green-400';
    case NotificationType.SYSTEM:
      return 'text-blue-600 dark:text-blue-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

/**
 * Format notification type for display
 */
export function formatNotificationType(type: NotificationType): string {
  switch (type) {
    case NotificationType.GLOBAL:
      return 'Global';
    case NotificationType.DIRECT:
      return 'Direct';
    case NotificationType.SYSTEM:
      return 'System';
    default:
      return type;
  }
}

/**
 * Format user display name
 */
export function formatUserDisplayName(
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null
): string {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  if (email) {
    return email;
  }
  return 'Unknown User';
}

/**
 * Format notification date relative to now
 */
export function formatNotificationDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Unknown date';
  }
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

/**
 * Get notification priority from metadata
 */
export function getNotificationPriority(metadata: Record<string, unknown> | null): string {
  if (!metadata || !metadata.priority) {
    return 'normal';
  }
  return metadata.priority as string;
}

/**
 * Check if notification is high priority
 */
export function isHighPriority(metadata: Record<string, unknown> | null): boolean {
  const priority = getNotificationPriority(metadata);
  return priority === 'high' || priority === 'urgent';
}

/**
 * Format metadata for display
 */
export function formatMetadata(metadata: Record<string, unknown> | null): string {
  if (!metadata) {
    return 'No metadata';
  }

  try {
    return JSON.stringify(metadata, null, 2);
  } catch {
    return 'Invalid metadata';
  }
}

/**
 * Get recipient display text
 */
export function getRecipientText(
  type: NotificationType,
  user?: { firstName?: string; lastName?: string; email?: string } | null
): string {
  switch (type) {
    case NotificationType.GLOBAL:
      return 'All Users';
    case NotificationType.DIRECT:
      return user ? formatUserDisplayName(user.firstName, user.lastName, user.email) : 'Unknown User';
    case NotificationType.SYSTEM:
      return 'System';
    default:
      return 'Unknown';
  }
}
