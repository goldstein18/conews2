import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Send } from 'lucide-react';
import { NotificationType } from '@/types/notification';
import {
  sendNotificationSchema,
  SendNotificationFormData,
  defaultSendNotificationValues,
  NOTIFICATION_TYPE_OPTIONS,
} from '../lib/validations';
import { useSendNotification } from '../hooks';

interface SendNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SendNotificationDialog({
  open,
  onOpenChange,
  onSuccess,
}: SendNotificationDialogProps) {
  const { sendNotification, loading } = useSendNotification();
  const [showUserInput, setShowUserInput] = useState(false);

  const form = useForm<SendNotificationFormData>({
    resolver: zodResolver(sendNotificationSchema),
    defaultValues: defaultSendNotificationValues,
  });

  const selectedType = form.watch('type');

  // Show user input field for DIRECT type
  const handleTypeChange = (type: NotificationType) => {
    form.setValue('type', type);
    setShowUserInput(type === NotificationType.DIRECT);

    // Clear userId when switching away from DIRECT
    if (type !== NotificationType.DIRECT) {
      form.setValue('userId', undefined);
    }
  };

  const onSubmit = async (data: SendNotificationFormData) => {
    try {
      await sendNotification({
        title: data.title,
        message: data.message,
        type: data.type,
        userId: data.userId,
        metadata: data.metadata,
      });

      // Reset form and close dialog
      form.reset(defaultSendNotificationValues);
      setShowUserInput(false);
      onOpenChange(false);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled in the hook
      console.error('Failed to send notification:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
          <DialogDescription>
            Send a notification to users. Choose the type and fill in the details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Notification Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={handleTypeChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select notification type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {NOTIFICATION_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {option.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Warning for GLOBAL type */}
            {selectedType === NotificationType.GLOBAL && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This notification will be sent to <strong>all users</strong> in the system.
                </AlertDescription>
              </Alert>
            )}

            {/* User ID field for DIRECT type */}
            {showUserInput && (
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter user ID"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      The ID of the user who will receive this notification
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Notification title"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A short, descriptive title for the notification
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your notification message..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The main content of the notification (max 500 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Notification
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
