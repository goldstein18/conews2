import { Dedicated, DedicatedStatus } from '@/types/dedicated';
import type { DedicatedSortField, SortDirection } from '../hooks/use-dedicated-sorting';

/**
 * Sort dedicated campaigns by a given field and direction
 */
export function sortDedicated(
  dedicated: Dedicated[],
  sortField: DedicatedSortField,
  sortDirection: SortDirection
): Dedicated[] {
  const sorted = [...dedicated].sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sortField) {
      case 'subject':
        aValue = a.subject.toLowerCase();
        bValue = b.subject.toLowerCase();
        break;
      case 'sendDate':
        aValue = new Date(a.sendDate).getTime();
        bValue = new Date(b.sendDate).getTime();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'market':
        aValue = a.market;
        bValue = b.market;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return sorted;
}

/**
 * Filter dedicated campaigns by search term
 */
export function filterDedicatedBySearch(
  dedicated: Dedicated[],
  searchTerm: string
): Dedicated[] {
  if (!searchTerm || searchTerm.trim() === '') {
    return dedicated;
  }

  const term = searchTerm.toLowerCase().trim();

  return dedicated.filter(item => {
    return (
      item.subject.toLowerCase().includes(term) ||
      item.alternateText.toLowerCase().includes(term) ||
      item.link.toLowerCase().includes(term) ||
      item.market.toLowerCase().includes(term) ||
      item.company?.name.toLowerCase().includes(term) ||
      item.owner?.email.toLowerCase().includes(term)
    );
  });
}

/**
 * Get status badge color
 */
export function getStatusBadgeColor(status: DedicatedStatus): string {
  switch (status) {
    case DedicatedStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case DedicatedStatus.SCHEDULED:
      return 'bg-blue-100 text-blue-800';
    case DedicatedStatus.SENT:
      return 'bg-green-100 text-green-800';
    case DedicatedStatus.DELETED:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Format send date for display
 */
export function formatSendDate(sendDate: string): string {
  const date = new Date(sendDate);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

/**
 * Check if send date is in the past
 */
export function isSendDatePast(sendDate: string): boolean {
  return new Date(sendDate) < new Date();
}

/**
 * Check if send date is within the next 24 hours
 */
export function isSendDateSoon(sendDate: string): boolean {
  const date = new Date(sendDate);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const hours = diff / (1000 * 60 * 60);
  return hours > 0 && hours <= 24;
}

/**
 * Format market label
 */
export function formatMarketLabel(market: string): string {
  const marketMap: Record<string, string> = {
    'miami': 'Miami',
    'palm-beach': 'Palm Beach',
    'tampa': 'Tampa',
    'atlanta': 'Atlanta'
  };
  return marketMap[market] || market;
}

/**
 * Generate HTML content for dedicated campaign email
 */
export function generateDedicatedHtmlContent(dedicated: Dedicated): string {
  const { subject, alternateText, link, imageUrl } = dedicated;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table width="700" border="0" cellspacing="0" cellpadding="0" style="max-width: 700px;">
          <tr>
            <td>
              <a href="${link}" target="_blank" style="display: block; text-decoration: none;">
                <img src="${imageUrl || ''}" alt="${alternateText}" style="width: 100%; height: auto; display: block; border: 0;" />
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
