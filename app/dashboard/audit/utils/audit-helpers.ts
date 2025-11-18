import { AuditEntry } from "@/types/audit";

/**
 * Format date for display in audit table
 */
export function formatAuditDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Less than a minute ago
  if (diffInSeconds < 60) {
    return "just now";
  }

  // Less than an hour ago
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  }

  // Less than a day ago
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  }

  // Less than a week ago
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }

  // Format as full date
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Format action name for display
 */
export function formatActionName(action: string): string {
  return action
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get user display name from audit entry
 */
export function getUserDisplayName(entry: AuditEntry): string {
  if (!entry.user) return "System";
  
  const { firstName, lastName } = entry.user;
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  
  return firstName || lastName || "Unknown User";
}

/**
 * Get entity display name
 */
export function getEntityDisplayName(entityType: string): string {
  const entityNames: Record<string, string> = {
    'Employee': 'Employee',
    'User': 'User',
    'Company': 'Company',
    'Event': 'Event',
    'Restaurant': 'Restaurant',
    'Venue': 'Venue',
  };
  
  return entityNames[entityType] || entityType;
}

/**
 * Get action color for badges
 */
export function getActionColor(action: string): string {
  const actionColors: Record<string, string> = {
    'CREATED': 'bg-green-100 text-green-800',
    'UPDATED': 'bg-blue-100 text-blue-800',
    'DELETED': 'bg-red-100 text-red-800',
    'EMPLOYEE_HIRED': 'bg-emerald-100 text-emerald-800',
    'EMPLOYEE_TERMINATED': 'bg-red-100 text-red-800',
    'STATUS_CHANGED': 'bg-yellow-100 text-yellow-800',
    'LOGIN': 'bg-gray-100 text-gray-800',
    'LOGOUT': 'bg-gray-100 text-gray-800',
  };
  
  return actionColors[action] || 'bg-gray-100 text-gray-800';
}

/**
 * Get entity type color for badges
 */
export function getEntityTypeColor(entityType: string): string {
  const entityColors: Record<string, string> = {
    'Employee': 'bg-purple-100 text-purple-800',
    'User': 'bg-indigo-100 text-indigo-800',
    'Company': 'bg-orange-100 text-orange-800',
    'Event': 'bg-pink-100 text-pink-800',
    'Restaurant': 'bg-green-100 text-green-800',
    'Venue': 'bg-blue-100 text-blue-800',
  };
  
  return entityColors[entityType] || 'bg-gray-100 text-gray-800';
}

/**
 * Format changes object for display
 */
export function formatChanges(changes: Record<string, unknown> | null | undefined): string {
  if (!changes || typeof changes !== 'object') return '';
  
  const changeEntries = Object.entries(changes);
  if (changeEntries.length === 0) return '';
  
  // Show just the field names that changed
  const fieldNames = changeEntries.map(([key]) => key);
  
  if (fieldNames.length === 1) {
    return `Changed ${fieldNames[0]}`;
  }
  
  if (fieldNames.length <= 3) {
    return `Changed ${fieldNames.join(', ')}`;
  }
  
  return `Changed ${fieldNames.length} fields`;
}

/**
 * Check if audit entry has details to show
 */
export function hasAuditDetails(entry: AuditEntry): boolean {
  return !!(entry.changes || entry.metadata || entry.entityId);
}

/**
 * Generate a short description of the audit action
 */
export function getAuditDescription(entry: AuditEntry): string {
  const userName = getUserDisplayName(entry);
  const actionName = formatActionName(entry.action);
  const entityName = getEntityDisplayName(entry.entityType);
  
  let description = `${userName} ${actionName.toLowerCase()} ${entityName.toLowerCase()}`;
  
  // Add changes info if available
  const changesText = formatChanges(entry.changes);
  if (changesText) {
    description += ` - ${changesText}`;
  }
  
  return description;
}