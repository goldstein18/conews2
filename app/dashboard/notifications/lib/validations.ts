import { z } from 'zod';
import { NotificationType } from '@/types/notification';

// Notification type options for forms
export const NOTIFICATION_TYPE_OPTIONS = [
  { value: NotificationType.GLOBAL, label: 'Global Broadcast', description: 'Send to all users' },
  { value: NotificationType.DIRECT, label: 'Direct Message', description: 'Send to specific user' },
  { value: NotificationType.SYSTEM, label: 'System Alert', description: 'Automated system notification' },
] as const;

// Base notification schema
export const sendNotificationBaseSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .trim(),

  message: z.string()
    .min(1, 'Message is required')
    .max(500, 'Message must be less than 500 characters')
    .trim(),

  type: z.nativeEnum(NotificationType, {
    message: 'Please select a valid notification type',
  }),

  userId: z.string().optional(),

  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Schema with conditional validation based on type
export const sendNotificationSchema = sendNotificationBaseSchema.refine(
  (data) => {
    // If type is DIRECT, userId is required
    if (data.type === NotificationType.DIRECT) {
      return !!data.userId && data.userId.trim().length > 0;
    }
    return true;
  },
  {
    message: 'User selection is required for direct notifications',
    path: ['userId'],
  }
);

// Export types
export type SendNotificationFormData = z.infer<typeof sendNotificationSchema>;

// Default form values
export const defaultSendNotificationValues: Partial<SendNotificationFormData> = {
  title: '',
  message: '',
  type: NotificationType.GLOBAL,
  userId: undefined,
  metadata: undefined,
};
