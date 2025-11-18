'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Link as LinkIcon, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Dedicated } from '@/types/dedicated';
import { useDedicatedActions } from '../../hooks';
import { useAuthStore } from '@/store/auth-store';
import { useQuery } from '@apollo/client';
import { MY_COMPANY_PROFILE } from '@/lib/graphql/settings';
import { GET_ALL_COMPANIES_FOR_DROPDOWN } from '@/lib/graphql/venues';
import { isSuperAdmin, isAdmin } from '@/lib/roles';
import {
  dedicatedBasicSchema,
  DedicatedBasicFormData,
  MARKET_OPTIONS,
  defaultDedicatedBasicValues
} from '../../lib/validations';

interface DedicatedBasicFormProps {
  onSubmit: (dedicated: Dedicated) => void;
  onCancel: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;
}

export function DedicatedBasicForm({
  onSubmit,
  onCancel,
  loading = false,
  onLoadingStart
}: DedicatedBasicFormProps) {
  const { user } = useAuthStore();
  const { createDedicated } = useDedicatedActions();

  const canSelectCompany = user && (isSuperAdmin(user) || isAdmin(user));

  // Get user's company profile (for members)
  const { data: companyData } = useQuery(MY_COMPANY_PROFILE, {
    skip: !!canSelectCompany,
    errorPolicy: 'all'
  });

  const userCompanyId = companyData?.myCompanyProfile?.id;
  const userCompany = companyData?.myCompanyProfile;

  // Companies dropdown data (for super admin/admin)
  const { data: companiesData, loading: companiesLoading } = useQuery(
    GET_ALL_COMPANIES_FOR_DROPDOWN,
    {
      skip: !canSelectCompany
    }
  );

  const form = useForm<DedicatedBasicFormData>({
    resolver: zodResolver(dedicatedBasicSchema),
    defaultValues: {
      ...defaultDedicatedBasicValues,
      companyId: userCompanyId || ''
    }
  });

  // Update companyId when user's company is loaded
  React.useEffect(() => {
    if (!canSelectCompany && userCompanyId && !form.getValues('companyId')) {
      form.setValue('companyId', userCompanyId);
    }
  }, [canSelectCompany, userCompanyId, form]);

  const handleSubmit = async (data: DedicatedBasicFormData) => {
    try {
      if (onLoadingStart) {
        onLoadingStart();
      }

      // For members, ensure companyId is set to their company
      const finalCompanyId = canSelectCompany ? data.companyId : userCompanyId;

      if (!finalCompanyId) {
        form.setError('companyId', {
          message: 'Company information not available. Please try again.'
        });
        return;
      }

      // Create dedicated with placeholder image
      const dedicated = await createDedicated({
        ...data,
        companyId: finalCompanyId,
        image: 'placeholder'
      });

      if (dedicated) {
        onSubmit(dedicated);
      }
    } catch (error) {
      console.error('Error creating dedicated campaign:', error);
      form.setError('root', {
        message: 'Failed to create campaign. Please try again.'
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Campaign Details
            </CardTitle>
            <CardDescription>
              Configure the basic details for your dedicated email campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email Subject */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Subject *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email subject line"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    The subject line that will appear in the recipient&apos;s inbox
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Alternate Text */}
            <FormField
              control={form.control}
              name="alternateText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Text *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter alternate text for the image"
                      rows={3}
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    Descriptive text shown when images can&apos;t be displayed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Link */}
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link URL *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        className="pl-9"
                        {...field}
                        disabled={loading}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    URL where users will be directed when clicking the image
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Send Date */}
            <FormField
              control={form.control}
              name="sendDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Date *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="datetime-local"
                        className="pl-9"
                        {...field}
                        disabled={loading}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Schedule when this campaign should be sent
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Market */}
            <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select market" />
                        </div>
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

            {/* Company Selection (Admin/Super Admin only) */}
            {canSelectCompany ? (
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Organization *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loading || companiesLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              companiesLoading
                                ? 'Loading companies...'
                                : 'Select client organization'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companiesLoading ? (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            Loading companies...
                          </div>
                        ) : companiesData?.companies?.length ? (
                          companiesData.companies.map((company: { id: string; name: string }) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No companies available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              userCompany && (
                <div className="rounded-lg border p-4 bg-muted">
                  <p className="text-sm font-medium">Client Organization</p>
                  <p className="text-sm text-muted-foreground">{userCompany.name}</p>
                </div>
              )
            )}

            {form.formState.errors.root && (
              <div className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating Campaign...
              </>
            ) : (
              'Continue to Step 2'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
