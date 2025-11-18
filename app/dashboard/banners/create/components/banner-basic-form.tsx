'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as LinkIcon, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQuery } from '@apollo/client';
import { useBannerActions } from '@/app/dashboard/banners/hooks/use-banner-actions';
import { useBannerStore } from '@/store/banner-store';
import { useAuthStore } from '@/store/auth-store';
import { isSuperAdmin, isAdmin } from '@/lib/roles';
import { GET_ALL_COMPANIES_FOR_DROPDOWN } from '@/lib/graphql/banners';
import { MY_COMPANY_PROFILE } from '@/lib/graphql/settings';
import { BannerType } from '@/types/banners';
import type { Banner } from '@/types/banners';
import { 
  bannerBasicSchema, 
  BannerBasicFormData, 
  MARKET_OPTIONS, 
  DURATION_OPTIONS, 
  defaultBannerBasicValues 
} from '../../lib/validations';
import { getBannerDimensions } from '../../utils';


// Helper function to add months to a date
const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

// Helper function to format date for input
const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};



export interface BannerBasicFormProps {
  bannerType?: BannerType | null;
  onSubmit: (banner: Banner) => void;
  onCancel: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;
}

export function BannerBasicForm({ 
  bannerType,
  onSubmit, 
  onCancel, 
  loading = false,
  onLoadingStart 
}: BannerBasicFormProps) {
  const { createBanner } = useBannerActions();
  const { updateFormData, creationFlow } = useBannerStore();
  const { user } = useAuthStore();
  const [customEndDate, setCustomEndDate] = useState(false);

  // Determine if user can select company
  const canSelectCompany = user && (isSuperAdmin(user) || isAdmin(user));

  // Get user's company profile (for regular members)
  const { data: companyData } = useQuery(MY_COMPANY_PROFILE, {
    skip: !!canSelectCompany, // Skip if user is admin (they can select any company)
    errorPolicy: 'all'
  });

  const userCompanyId = companyData?.myCompanyProfile?.id;

  // Companies dropdown data (for super admin/admin)
  const { data: companiesData, loading: companiesLoading } = useQuery(GET_ALL_COMPANIES_FOR_DROPDOWN, {
    skip: !canSelectCompany,
    errorPolicy: 'all'
  });

  const today = new Date();
  const threeMonthsLater = addMonths(today, 3);

  const basicSchema = bannerBasicSchema();
  
  const form = useForm<BannerBasicFormData>({
    resolver: zodResolver(basicSchema),
    defaultValues: {
      ...defaultBannerBasicValues(),
      name: creationFlow.formData.name || '',
      market: creationFlow.formData.market || '',
      link: creationFlow.formData.link || '',
      startDate: formatDateForInput(today),
      endDate: formatDateForInput(threeMonthsLater),
      companyId: canSelectCompany ? '' : (userCompanyId || '')
    }
  });

  const watchedDuration = form.watch('duration');
  const watchedStartDate = form.watch('startDate');

  // Auto-calculate end date when duration or start date changes
  const handleDurationChange = (duration: number) => {
    form.setValue('duration', duration);
    if (!customEndDate && watchedStartDate) {
      const startDate = new Date(watchedStartDate);
      const newEndDate = addMonths(startDate, duration);
      form.setValue('endDate', formatDateForInput(newEndDate));
    }
  };

  const handleStartDateChange = (dateString: string) => {
    form.setValue('startDate', dateString);
    if (!customEndDate) {
      const startDate = new Date(dateString);
      const newEndDate = addMonths(startDate, watchedDuration);
      form.setValue('endDate', formatDateForInput(newEndDate));
    }
  };

  const handleCustomEndDateChange = (checked: boolean) => {
    setCustomEndDate(checked);
    form.setValue('customEndDate', checked);
    
    if (!checked && watchedStartDate) {
      // Reset to auto-calculated date
      const startDate = new Date(watchedStartDate);
      const newEndDate = addMonths(startDate, watchedDuration);
      form.setValue('endDate', formatDateForInput(newEndDate));
    }
  };

  const handleSubmit = async (data: BannerBasicFormData) => {
    try {
      if (onLoadingStart) onLoadingStart();

      // Save form data to Zustand store
      updateFormData(data);

      // Create banner with placeholder image
      const bannerInput = {
        name: data.name,
        bannerType: bannerType || BannerType.ROS, // Use passed banner type or default to ROS
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        link: data.link,
        market: data.market,
        companyId: data.companyId,
        zoneId: data.genrePage || undefined
      };

      const createdBanner = await createBanner(bannerInput);
      
      if (createdBanner) {
        onSubmit(createdBanner);
      }
    } catch (error) {
      console.error('Error creating banner:', error);
    }
  };

  // Get banner type display info from MODULE_CONFIGS
  const bannerTypeInfo = bannerType ? getBannerDimensions(bannerType) : { 
    label: 'Banner', 
    dimensions: 'Various', 
    description: 'Standard banner' 
  };

  return (
    <div className="space-y-6">
      {/* Banner Type Display */}
      {bannerType && (
        <div className="rounded-lg border bg-green-50 border-green-200 p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-md">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">{bannerTypeInfo.label}</h3>
              <p className="text-sm text-green-700">
                {bannerTypeInfo.dimensions} - {bannerTypeInfo.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Credits Notice */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>You have 5 credits available</strong>
          <br />
          Each market selection uses 2 credits.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Company Assignment Section (only for super admin/admin) */}
          {canSelectCompany && (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-blue-50 rounded-md">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m0-18H7.5m-5.25 0v3.375c0 .621.504 1.125 1.125 1.125M3.375 6.75h16.5M3.375 9.75h16.5m0 0V21M7.5 3.375H21M7.5 3.375c0-.621.504-1.125 1.125-1.125h13.5c.621 0 1.125.504 1.125 1.125v17.25c-.621 0-1.125-.504-1.125-1.125V3.375z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Company Assignment</h3>
                  <p className="text-sm text-muted-foreground">
                    Select which company this banner belongs to
                  </p>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companiesLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading companies...
                          </SelectItem>
                        ) : (
                          companiesData?.companies?.map((company: { id: string; name: string }) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This banner will be created and managed under the selected company
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Banner Configuration Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Banner Configuration</h3>
            
            <div className="space-y-6">
              {/* First Row: Banner Name */}
              <div className="grid grid-cols-1 gap-6">
                {/* Banner Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter banner name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Choose a clear name to identify this banner
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Second Row: Market and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Select Market */}
                <FormField
                  control={form.control}
                  name="market"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select a Market</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a market" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MARKET_OPTIONS.map((market) => (
                            <SelectItem key={market.value} value={market.value}>
                              {market.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the market where this banner will run
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Duration */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <Select onValueChange={(value) => handleDurationChange(Number(value))} defaultValue={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DURATION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the duration for your banner campaign
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              {/* Third Row: Banner Link URL */}
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Link URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="https://example.com"
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter the URL where users will be directed when clicking the banner
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Banner Display Period Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Banner Display Period</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleStartDateChange(e.target.value);
                        }}
                        min={formatDateForInput(new Date())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      End Date{' '}
                      <span className="text-sm text-gray-500">
                        (Auto-calculated {watchedDuration} months)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        disabled={!customEndDate}
                        min={formatDateForInput(new Date())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="customEndDate"
              render={() => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={customEndDate}
                      onCheckedChange={handleCustomEndDateChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Set earlier end date?</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <p className="text-sm text-gray-600">
              End date is automatically calculated based on start date and selected duration
            </p>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="additionalMarkets"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Add to additional market(s)</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {form.watch('additionalMarkets') && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <Info className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Note:</strong> If credits used or dates are different, please upload the banner separately.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-32"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-48"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Banner...
                </>
              ) : (
                'Continue to Step 2'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}