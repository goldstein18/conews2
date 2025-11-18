import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Notification } from '@/types/notification';
import {
  getNotificationTypeColor,
  formatNotificationType,
  formatNotificationDate,
  formatUserDisplayName,
  getRecipientText,
  formatMetadata,
} from '../utils';
import { CheckCircle2, XCircle } from 'lucide-react';

interface NotificationDetailSheetProps {
  notification: Notification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationDetailSheet({
  notification,
  open,
  onOpenChange,
}: NotificationDetailSheetProps) {
  if (!notification) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>{notification.title}</span>
            <Badge
              variant="outline"
              className={getNotificationTypeColor(notification.type)}
            >
              {formatNotificationType(notification.type)}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            {formatNotificationDate(notification.createdAt)}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Read Status */}
          <div className="flex items-center space-x-2">
            {notification.isRead ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-600 font-medium">Read</span>
                {notification.readAt && (
                  <span className="text-sm text-muted-foreground">
                    ({formatNotificationDate(notification.readAt)})
                  </span>
                )}
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-600 font-medium">Unread</span>
              </>
            )}
          </div>

          <Separator />

          {/* Message */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Message</h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {notification.message}
            </p>
          </div>

          <Separator />

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                Recipient
              </h4>
              <p className="text-sm">
                {getRecipientText(notification.type, notification.user)}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                Sender
              </h4>
              <p className="text-sm">
                {notification.creator
                  ? formatUserDisplayName(
                      notification.creator.firstName,
                      notification.creator.lastName,
                      notification.creator.email
                    )
                  : 'System'}
              </p>
            </div>
          </div>

          {/* Target Role */}
          {notification.targetRole && (
            <>
              <Separator />
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Target Role
                </h4>
                <Badge variant="outline">{notification.targetRole}</Badge>
              </div>
            </>
          )}

          {/* Metadata */}
          {notification.metadata && Object.keys(notification.metadata).length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Metadata
                </h4>
                <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                  {formatMetadata(notification.metadata)}
                </pre>
              </div>
            </>
          )}

          {/* Timestamps */}
          <Separator />
          <div className="text-xs text-muted-foreground space-y-1">
            <div>
              <span className="font-semibold">Created:</span>{' '}
              {new Date(notification.createdAt).toLocaleString()}
            </div>
            {notification.readAt && (
              <div>
                <span className="font-semibold">Read:</span>{' '}
                {new Date(notification.readAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
