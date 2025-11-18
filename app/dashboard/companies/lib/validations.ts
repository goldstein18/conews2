import { z } from 'zod';
import { MARKET_OPTIONS } from '@/types/members';

const emailPattern = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .email({ message: "Invalid email format" });

const namePattern = z
  .string()
  .trim()
  .min(2, { message: "Name must be at least 2 characters" })
  .max(100, { message: "Name must be less than 100 characters" });

const phonePattern = z
  .string()
  .trim()
  .min(1, { message: "Phone is required" })
  .regex(/^[\+]?[1-9][\d]{3,14}$/, { message: "Invalid phone format" });

const addressPattern = z
  .string()
  .trim()
  .min(5, { message: "Address must be at least 5 characters" })
  .max(200, { message: "Address must be less than 200 characters" });

const cityPattern = z
  .string()
  .trim()
  .min(2, { message: "City must be at least 2 characters" })
  .max(50, { message: "City must be less than 50 characters" });

const statePattern = z
  .string()
  .trim()
  .min(2, { message: "State must be at least 2 characters" })
  .max(50, { message: "State must be less than 50 characters" });

const zipCodePattern = z
  .string()
  .trim()
  .min(5, { message: "Zip code must be at least 5 characters" })
  .max(10, { message: "Zip code must be less than 10 characters" })
  .regex(/^[\d\-\s]+$/, { message: "Invalid zip code format" });

const companyUserSchema = z.object({
  id: z.string().optional(), // For editing existing users
  name: namePattern,
  email: emailPattern,
  role: z.enum(['owner', 'admin'], { message: "Role must be either 'owner' or 'admin'" }),
  isOwner: z.boolean(),
});

const companyDetailsSchema = z.object({
  companyName: namePattern,
  companyEmail: emailPattern,
  companyPhone: phonePattern,
  companyAddress: addressPattern,
  companyCity: cityPattern,
  companyState: statePattern,
  companyZipcode: zipCodePattern,
  hubspotId: z.string().trim().optional(),
  companyNotes: z.string().optional(),
});

const planSelectionSchema = z.object({
  planSlug: z.string().min(1, { message: "Please select a plan" }),
});

const paymentMethodSchema = z.object({
  checkPayment: z.boolean(),
});

const marketSelectionSchema = z.object({
  market: z.enum(MARKET_OPTIONS, { message: "Please select a valid market" }),
});

export const createCompanySchema = z.object({
  users: z
    .array(companyUserSchema)
    .min(1, { message: "At least one user is required" })
    .refine(
      (users) => users.some(user => user.isOwner === true),
      { message: "One user must be designated as Owner" }
    )
    .refine(
      (users) => {
        const emails = users.map(user => user.email.toLowerCase());
        return new Set(emails).size === emails.length;
      },
      { message: "All user emails must be unique" }
    ),
  ...companyDetailsSchema.shape,
  ...planSelectionSchema.shape,
  ...paymentMethodSchema.shape,
  ...marketSelectionSchema.shape,
});

export type CreateCompanyFormData = z.infer<typeof createCompanySchema>;
export type CompanyUser = z.infer<typeof companyUserSchema>;

// Default values for form
export const defaultCompanyFormData = {
  users: [
    {
      name: '',
      email: '',
      role: 'owner' as const,
      isOwner: true,
    }
  ],
  companyName: '',
  companyEmail: '',
  companyPhone: '',
  companyAddress: '',
  companyCity: '',
  companyState: '',
  companyZipcode: '',
  hubspotId: undefined,
  companyNotes: '',
  market: 'miami' as const,
  planSlug: '',
  checkPayment: true,
};