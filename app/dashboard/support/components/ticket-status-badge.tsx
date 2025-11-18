import { Badge } from '@/components/ui/badge';
import { TicketStatus } from '@/types/ticket';
import { getStatusBadgeClassName } from '../utils/ticket-helpers';
import { getStatusLabel } from '../lib/validations';

interface TicketStatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

export function TicketStatusBadge({ status, className }: TicketStatusBadgeProps) {
  return (
    <Badge className={`${getStatusBadgeClassName(status)} ${className || ''}`}>
      {getStatusLabel(status)}
    </Badge>
  );
}
