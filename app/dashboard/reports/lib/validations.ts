import { z } from 'zod';
import { AssetType } from '@/store/reports-store';

// Client Report Form Schema
export const clientReportSchema = z.object({
  companyId: z.string().min(1, 'Please select a company'),
  startDate: z.date({
    message: 'Start date is required',
  }),
  endDate: z.date({
    message: 'End date is required',
  }),
  includeEvents: z.boolean(),
  includeBanners: z.boolean(),
}).refine(
  (data) => data.endDate >= data.startDate,
  {
    message: 'End date must be after or equal to start date',
    path: ['endDate'],
  }
).refine(
  (data) => data.includeEvents || data.includeBanners,
  {
    message: 'At least one asset type must be selected',
    path: ['includeEvents'],
  }
);

// Overall Analytics Form Schema
export const analyticsSchema = z.object({
  startDate: z.date({
    message: 'Start date is required',
  }),
  endDate: z.date({
    message: 'End date is required',
  }),
  assetType: z.enum(['ALL', 'EVENTS', 'BANNERS'], {
    message: 'Please select an asset type',
  }),
}).refine(
  (data) => data.endDate >= data.startDate,
  {
    message: 'End date must be after or equal to start date',
    path: ['endDate'],
  }
);

// Asset Type Options
export const ASSET_TYPE_OPTIONS = [
  { value: 'ALL', label: 'All asset types' },
  { value: 'EVENTS', label: 'Events only' },
  { value: 'BANNERS', label: 'Banners only' },
] as const;

// Export types
export type ClientReportFormData = z.infer<typeof clientReportSchema>;
export type AnalyticsFormData = z.infer<typeof analyticsSchema>;

// Default values
export const defaultClientReportValues: Partial<ClientReportFormData> = {
  includeEvents: true,
  includeBanners: true,
};

export const defaultAnalyticsValues: Partial<AnalyticsFormData> = {
  assetType: 'ALL' as AssetType,
};

// Date range validation helpers
export const isValidDateRange = (startDate: Date | null, endDate: Date | null): boolean => {
  if (!startDate || !endDate) return false;
  return endDate >= startDate;
};

export const getMaxDate = (): Date => new Date();

export const getDefaultStartDate = (): Date => {
  const date = new Date();
  date.setMonth(date.getMonth() - 12); // 12 months ago
  return date;
};

export const getDefaultEndDate = (): Date => new Date();