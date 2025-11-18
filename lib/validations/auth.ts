import { z } from 'zod';

// Common validation patterns
const emailPattern = z
  .string()
  .trim()
  .toLowerCase()
  .email({ message: "Please enter a valid email" })
  .max(254, { message: "Email is too long" }); // RFC 5321 limit

const passwordPattern = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(128, { message: "Password is too long" });

const namePattern = z
  .string()
  .trim()
  .min(2, { message: "Must be at least 2 characters" })
  .max(50, { message: "Must be less than 50 characters" })
  .regex(/^[a-zA-Z\s\-']+$/, {
    message: "Only letters, spaces, hyphens, and apostrophes are allowed"
  });

export const loginSchema = z.object({
  email: emailPattern,
  password: z.string().min(1, { message: "Password is required" }), // Don't enforce complexity on login
});

export const registerSchema = z.object({
  firstName: namePattern,
  lastName: namePattern,
  email: emailPattern,
  password: passwordPattern,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Schema for password changes
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: passwordPattern,
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});

// Schema for profile updates
export const updateProfileSchema = z.object({
  firstName: namePattern,
  lastName: namePattern,
  email: emailPattern,
});

// Password reset request schema
export const resetPasswordRequestSchema = z.object({
  email: emailPattern,
});

// Password reset confirmation schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: "Reset token is required" }),
  newPassword: passwordPattern,
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

// US States for subscriber registration
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
] as const;

// Subscriber registration - Step 1: Basic account info
export const subscriberBasicSchema = z.object({
  email: emailPattern,
  confirmEmail: emailPattern,
  firstName: namePattern,
  lastName: z.string().trim().max(50).optional().or(z.literal('')), // Optional last name
  password: passwordPattern,
  turnstileToken: z.string().min(1, { message: "Bot verification is required" }),
}).refine((data) => data.email === data.confirmEmail, {
  message: "Email addresses don't match",
  path: ["confirmEmail"],
});

// Subscriber registration - Step 2: Location
export const subscriberLocationSchema = z.object({
  city: z.string().trim().min(2, { message: "City is required" }).max(100),
  state: z.string().min(2, { message: "State is required" }),
  sendNotifications: z.boolean().default(true),
});

// Combined subscriber schema for full registration
export const subscriberFullSchema = subscriberBasicSchema
  .omit({ confirmEmail: true })
  .merge(subscriberLocationSchema.omit({ sendNotifications: true }));

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ResetPasswordRequestFormData = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type SubscriberBasicFormData = z.infer<typeof subscriberBasicSchema>;
export type SubscriberLocationFormData = z.infer<typeof subscriberLocationSchema>;
export type SubscriberFullFormData = z.infer<typeof subscriberFullSchema>;
