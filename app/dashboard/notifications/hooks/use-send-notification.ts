import { useMutation } from '@apollo/client';
import { SEND_GLOBAL_NOTIFICATION, SEND_DIRECT_NOTIFICATION } from '@/lib/graphql/notifications';
import { NotificationType, SendNotificationInput } from '@/types/notification';
import { useToast } from '@/hooks/use-toast';

export function useSendNotification() {
  const { toast } = useToast();
  const [sendGlobalMutation, { loading: sendingGlobal }] = useMutation(SEND_GLOBAL_NOTIFICATION);
  const [sendDirectMutation, { loading: sendingDirect }] = useMutation(SEND_DIRECT_NOTIFICATION);

  const sendNotification = async (input: SendNotificationInput) => {
    try {
      let result;

      if (input.type === NotificationType.GLOBAL || input.type === NotificationType.SYSTEM) {
        // Send global notification
        result = await sendGlobalMutation({
          variables: {
            input: {
              title: input.title,
              message: input.message,
              type: input.type,
              metadata: input.metadata,
            },
          },
        });

        toast({
          title: 'Notification Sent',
          description: `Global notification "${input.title}" has been sent to all users.`,
        });

        return result.data.sendGlobalNotification;
      } else if (input.type === NotificationType.DIRECT) {
        // Send direct notification
        if (!input.userId) {
          throw new Error('User ID is required for direct notifications');
        }

        result = await sendDirectMutation({
          variables: {
            input: {
              title: input.title,
              message: input.message,
              type: input.type,
              userId: input.userId,
              metadata: input.metadata,
            },
          },
        });

        toast({
          title: 'Notification Sent',
          description: `Direct notification "${input.title}" has been sent.`,
        });

        return result.data.sendDirectNotification;
      }
    } catch (error) {
      console.error('Error sending notification:', error);

      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send notification',
        variant: 'destructive',
      });

      throw error;
    }
  };

  return {
    sendNotification,
    loading: sendingGlobal || sendingDirect,
  };
}
