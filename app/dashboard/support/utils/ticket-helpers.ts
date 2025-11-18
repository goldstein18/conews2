import { TicketStatus, TicketPriority, TicketCategory } from '@/types/ticket';

// ============================================================================
// Status Badge Styling
// ============================================================================

export function getStatusBadgeVariant(status: TicketStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'OPEN':
      return 'default'; // Blue
    case 'IN_PROGRESS':
      return 'secondary'; // Purple
    case 'WAITING_FOR_CUSTOMER':
      return 'outline'; // Orange outline
    case 'RESOLVED':
      return 'outline'; // Green outline
    case 'CLOSED':
      return 'secondary'; // Gray
    case 'CANCELLED':
      return 'destructive'; // Red
    case 'REOPENED':
      return 'outline'; // Yellow outline
    default:
      return 'default';
  }
}

export function getStatusBadgeClassName(status: TicketStatus): string {
  const baseClasses = 'font-medium';

  switch (status) {
    case 'OPEN':
      return `${baseClasses} bg-blue-100 text-blue-800 hover:bg-blue-100`;
    case 'IN_PROGRESS':
      return `${baseClasses} bg-purple-100 text-purple-800 hover:bg-purple-100`;
    case 'WAITING_FOR_CUSTOMER':
      return `${baseClasses} bg-orange-100 text-orange-800 hover:bg-orange-100`;
    case 'RESOLVED':
      return `${baseClasses} bg-green-100 text-green-800 hover:bg-green-100`;
    case 'CLOSED':
      return `${baseClasses} bg-gray-100 text-gray-800 hover:bg-gray-100`;
    case 'CANCELLED':
      return `${baseClasses} bg-red-100 text-red-800 hover:bg-red-100`;
    case 'REOPENED':
      return `${baseClasses} bg-yellow-100 text-yellow-800 hover:bg-yellow-100`;
    default:
      return baseClasses;
  }
}

// ============================================================================
// Priority Badge Styling
// ============================================================================

export function getPriorityBadgeClassName(priority: TicketPriority): string {
  const baseClasses = 'font-medium';

  switch (priority) {
    case 'LOW':
      return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-100`;
    case 'MEDIUM':
      return `${baseClasses} bg-blue-100 text-blue-700 hover:bg-blue-100`;
    case 'HIGH':
      return `${baseClasses} bg-orange-100 text-orange-700 hover:bg-orange-100`;
    case 'URGENT':
      return `${baseClasses} bg-red-100 text-red-700 hover:bg-red-100 animate-pulse`;
    default:
      return baseClasses;
  }
}

export function getPriorityIcon(priority: TicketPriority): string {
  switch (priority) {
    case 'LOW':
      return '▼'; // Down arrow
    case 'MEDIUM':
      return '■'; // Square
    case 'HIGH':
      return '▲'; // Up arrow
    case 'URGENT':
      return '🔴'; // Red circle
    default:
      return '■';
  }
}

// ============================================================================
// Category Badge Styling
// ============================================================================

export function getCategoryBadgeClassName(category: TicketCategory): string {
  const baseClasses = 'font-medium';

  switch (category) {
    case 'TECHNICAL':
      return `${baseClasses} bg-indigo-100 text-indigo-700 hover:bg-indigo-100`;
    case 'BILLING':
      return `${baseClasses} bg-green-100 text-green-700 hover:bg-green-100`;
    case 'FEATURE_REQUEST':
      return `${baseClasses} bg-purple-100 text-purple-700 hover:bg-purple-100`;
    case 'BUG_REPORT':
      return `${baseClasses} bg-red-100 text-red-700 hover:bg-red-100`;
    case 'GENERAL':
      return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-100`;
    default:
      return baseClasses;
  }
}

// ============================================================================
// Status Transitions
// ============================================================================

export type StatusTransition = {
  value: TicketStatus;
  label: string;
  description: string;
  confirmRequired: boolean;
};

/**
 * Get available status transitions based on current status
 */
export function getAvailableStatusTransitions(currentStatus: TicketStatus): StatusTransition[] {
  const transitions: Record<TicketStatus, StatusTransition[]> = {
    OPEN: [
      {
        value: 'IN_PROGRESS',
        label: 'Start Working',
        description: 'Mark as in progress',
        confirmRequired: false,
      },
      {
        value: 'RESOLVED',
        label: 'Resolve',
        description: 'Mark as resolved',
        confirmRequired: false,
      },
      {
        value: 'CANCELLED',
        label: 'Cancel',
        description: 'Cancel this ticket',
        confirmRequired: true,
      },
    ],
    IN_PROGRESS: [
      {
        value: 'WAITING_FOR_CUSTOMER',
        label: 'Wait for Customer',
        description: 'Waiting for customer response',
        confirmRequired: false,
      },
      {
        value: 'RESOLVED',
        label: 'Resolve',
        description: 'Mark as resolved',
        confirmRequired: false,
      },
      {
        value: 'CANCELLED',
        label: 'Cancel',
        description: 'Cancel this ticket',
        confirmRequired: true,
      },
    ],
    WAITING_FOR_CUSTOMER: [
      {
        value: 'IN_PROGRESS',
        label: 'Resume Work',
        description: 'Continue working on ticket',
        confirmRequired: false,
      },
      {
        value: 'RESOLVED',
        label: 'Resolve',
        description: 'Mark as resolved',
        confirmRequired: false,
      },
      {
        value: 'CANCELLED',
        label: 'Cancel',
        description: 'Cancel this ticket',
        confirmRequired: true,
      },
    ],
    RESOLVED: [
      {
        value: 'CLOSED',
        label: 'Close',
        description: 'Close this ticket permanently',
        confirmRequired: true,
      },
      {
        value: 'REOPENED',
        label: 'Reopen',
        description: 'Reopen this ticket',
        confirmRequired: false,
      },
    ],
    CLOSED: [
      {
        value: 'REOPENED',
        label: 'Reopen',
        description: 'Reopen this closed ticket',
        confirmRequired: true,
      },
    ],
    REOPENED: [
      {
        value: 'IN_PROGRESS',
        label: 'Resume Work',
        description: 'Continue working on ticket',
        confirmRequired: false,
      },
      {
        value: 'RESOLVED',
        label: 'Resolve',
        description: 'Mark as resolved',
        confirmRequired: false,
      },
      {
        value: 'CANCELLED',
        label: 'Cancel',
        description: 'Cancel this ticket',
        confirmRequired: true,
      },
    ],
    CANCELLED: [],
  };

  return transitions[currentStatus] || [];
}

/**
 * Check if a status transition is valid
 */
export function isValidStatusTransition(from: TicketStatus, to: TicketStatus): boolean {
  const availableTransitions = getAvailableStatusTransitions(from);
  return availableTransitions.some(t => t.value === to);
}

// ============================================================================
// File Size Formatting
// ============================================================================

/**
 * Format file size in bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTimeString(date: string | Date): string {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  if (diffDay < 30) {
    const weeks = Math.floor(diffDay / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  if (diffDay < 365) {
    const months = Math.floor(diffDay / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(diffDay / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

/**
 * Format date to locale string
 */
export function formatTicketDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ============================================================================
// File Type Detection
// ============================================================================

/**
 * Check if file is an image based on content type
 */
export function isImageFile(contentType: string): boolean {
  return contentType.startsWith('image/');
}

/**
 * Check if file is a PDF
 */
export function isPdfFile(contentType: string): boolean {
  return contentType === 'application/pdf';
}

/**
 * Get file icon based on content type
 */
export function getFileIcon(contentType: string): string {
  if (contentType.startsWith('image/')) return '🖼️';
  if (contentType === 'application/pdf') return '📄';
  if (contentType.includes('word') || contentType.includes('document')) return '📝';
  if (contentType.includes('sheet') || contentType.includes('excel')) return '📊';
  if (contentType.includes('presentation') || contentType.includes('powerpoint')) return '📽️';
  if (contentType.includes('text')) return '📃';
  if (contentType.includes('zip') || contentType.includes('archive')) return '📦';
  return '📎';
}

// ============================================================================
// Ticket Number Formatting
// ============================================================================

/**
 * Format ticket ID for display (e.g., "TKT-12345")
 */
export function formatTicketNumber(id: string): string {
  // Take last 8 characters of ID for readability
  const shortId = id.slice(-8).toUpperCase();
  return `#${shortId}`;
}

// ============================================================================
// User Display Names
// ============================================================================

/**
 * Get full name from user object
 */
export function getUserFullName(user: { firstName: string; lastName: string }): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

/**
 * Get user initials
 */
export function getUserInitials(user: { firstName: string; lastName: string }): string {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}
