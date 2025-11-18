import type { MarqueeStatus } from '@/types/marquee';

export function getStatusColor(status: MarqueeStatus): string {
  const colors: Record<MarqueeStatus, string> = {
    PENDING: 'yellow',
    APPROVED: 'green',
    DECLINED: 'red',
    DELETED: 'gray',
  };
  return colors[status] || 'gray';
}

export function getStatusLabel(status: MarqueeStatus): string {
  const labels: Record<MarqueeStatus, string> = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    DECLINED: 'Declined',
    DELETED: 'Deleted',
  };
  return labels[status] || status;
}

export function formatMarketName(market: string): string {
  return market
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
