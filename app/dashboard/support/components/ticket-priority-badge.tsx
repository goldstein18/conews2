import { Badge } from '@/components/ui/badge';
import { TicketPriority } from '@/types/ticket';
import { getPriorityBadgeClassName, getPriorityIcon } from '../utils/ticket-helpers';
import { getPriorityLabel } from '../lib/validations';

interface TicketPriorityBadgeProps {
  priority: TicketPriority;
  showIcon?: boolean;
  className?: string;
}

export function TicketPriorityBadge({ priority, showIcon = true, className }: TicketPriorityBadgeProps) {
  return (
    <Badge className={`${getPriorityBadgeClassName(priority)} ${className || ''}`}>
      {showIcon && <span className="mr-1">{getPriorityIcon(priority)}</span>}
      {getPriorityLabel(priority)}
    </Badge>
  );
}
