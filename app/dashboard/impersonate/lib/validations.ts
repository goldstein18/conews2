import { z } from 'zod';

export const impersonationSchema = z.object({
  targetUserId: z.string().min(1, 'Please select a user to impersonate'),
  reason: z.string().optional(),
});

export type ImpersonationFormData = z.infer<typeof impersonationSchema>;

export const defaultImpersonationValues: ImpersonationFormData = {
  targetUserId: '',
  reason: '',
};
