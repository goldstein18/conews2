'use client';

import React, { useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { bannerBasicSchema, BannerBasicFormData, MARKET_OPTIONS } from '../../../lib/validations';
import type { Banner, Company } from '@/types/banners';
import { useQuery } from '@apollo/client';
import { GET_ALL_COMPANIES_FOR_DROPDOWN } from '@/lib/graphql/restaurants';
import { useAuthStore } from '@/store/auth-store';
import { isSuperAdmin, isAdmin } from '@/lib/roles';

export interface BannerBasicEditFormRef {
  submitForm: () => void;
}

interface BannerBasicEditFormProps {
  banner: Banner;
  onSubmit: (data: unknown) => Promise<void>;
  onNext: () => void;
  loading?: boolean;
  onDataChange?: (data: Record<string, unknown>) => void;
  onFormChange?: () => void;
}

// Helper function to convert banner to form data
const bannerToBasicFormData = (banner: Banner): BannerBasicFormData => ({
  name: banner.name || '',
  market: banner.market || '',
  duration: 3, // Default duration
  link: banner.link || '',
  startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : '',
  endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : '',
  companyId: banner.company?.id || '',
  customEndDate: false,
  additionalMarkets: false,
  genrePage: ''
});

export const BannerBasicEditForm = React.forwardRef<BannerBasicEditFormRef, BannerBasicEditFormProps>(({ 
  banner, 
  onSubmit,
  onNext, 
  loading = false, 
  onDataChange, 
  onFormChange
}, ref) => {
  const { user } = useAuthStore();
  
  // Determine if user can select company (admin/super-admin only)
  const canSelectCompany = user && (isSuperAdmin(user) || isAdmin(user));

  // Form setup
  const form = useForm({
    resolver: zodResolver(bannerBasicSchema()),
    defaultValues: bannerToBasicFormData(banner),
    mode: 'onChange'
  });

  // Watch form values for change detection
  const watchedValues = useWatch({
    control: form.control
  });

  // Get original values for comparison
  const originalValues = React.useMemo(() => bannerToBasicFormData(banner), [banner]);

  // Detect form changes
  React.useEffect(() => {
    const hasChanges = JSON.stringify(watchedValues) !== JSON.stringify(originalValues);
    if (hasChanges && onFormChange) {
      onFormChange();
    }
  }, [watchedValues, originalValues, onFormChange]);

  // Update parent component with form data
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(watchedValues);
    }
  }, [watchedValues, onDataChange]);

  // Fetch companies for admin users
  const { data: companiesData } = useQuery(GET_ALL_COMPANIES_FOR_DROPDOWN, {
    skip: !canSelectCompany,
    errorPolicy: 'all'
  });
  const companies: Company[] = companiesData?.companies || [];

  const handleSubmit = useCallback(async (data: BannerBasicFormData) => {
    try {
      // In edit mode, just pass the data and go to next step without saving
      if (onDataChange) {
        onDataChange(data);
      }
      onNext();
    } catch (error) {
      console.error('Error in basic form submission:', error);
    }
  }, [onDataChange, onNext]);

  // Separate handler for update button (direct submit)
  const handleUpdateSubmit = useCallback(async (data: BannerBasicFormData) => {
    try {
      // Direct submit for update
      await onSubmit(data);
    } catch (error) {
      console.error('Update submit error:', error);
    }
  }, [onSubmit]);

  // Expose submitForm function to parent
  React.useImperativeHandle(ref, () => ({
    submitForm: () => {
      form.handleSubmit(handleUpdateSubmit)();
    }
  }), [form, handleUpdateSubmit]);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Campaign Information */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter campaign name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Landing Page URL *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-website.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="market"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Market *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target market" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MARKET_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Company Assignment - Only for admin users */}
          {canSelectCompany && (
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign to Organization *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select organization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companies?.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Continue to Banner Upload'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
});

BannerBasicEditForm.displayName = 'BannerBasicEditForm';