'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Link as LinkIcon, Calendar, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Marquee } from '@/types/marquee';
import { useMarqueeActions } from '../../hooks/use-marquee-actions';
import { useAuthStore } from '@/store/auth-store';
import { useQuery } from '@apollo/client';
import { MY_COMPANY_PROFILE } from '@/lib/graphql/settings';
import { GET_ALL_COMPANIES_FOR_DROPDOWN } from '@/lib/graphql/marquee';
import { isSuperAdmin, isAdmin } from '@/lib/roles';
import {
  marqueeBasicSchema,
  MarqueeBasicFormData,
  MARKET_OPTIONS,
  BUTTON_FONT_WEIGHT_OPTIONS,
  defaultMarqueeBasicValues,
} from '../../lib/validations';

interface MarqueeBasicFormProps {
  onSubmit: (marquee: Marquee) => void;
  onCancel: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;
}

export function MarqueeBasicForm({
  onSubmit,
  onCancel,
  loading = false,
  onLoadingStart,
}: MarqueeBasicFormProps) {
  const { user } = useAuthStore();
  const { createMarquee } = useMarqueeActions();

  const canSelectCompany = user && (isSuperAdmin(user) || isAdmin(user));

  // Get user's company profile (for members)
  const { data: companyData } = useQuery(MY_COMPANY_PROFILE, {
    skip: !!canSelectCompany,
    errorPolicy: 'all',
  });

  const userCompanyId = companyData?.myCompanyProfile?.id;
  const userCompany = companyData?.myCompanyProfile;

  // Companies dropdown data (for super admin/admin)
  const { data: companiesData, loading: companiesLoading } = useQuery(
    GET_ALL_COMPANIES_FOR_DROPDOWN,
    {
      skip: !canSelectCompany,
    }
  );

  const form = useForm<MarqueeBasicFormData>({
    resolver: zodResolver(marqueeBasicSchema),
    defaultValues: {
      ...defaultMarqueeBasicValues,
      companyId: userCompanyId || '',
    },
  });

  const handleSubmit = async (data: MarqueeBasicFormData) => {
    try {
      if (onLoadingStart) {
        onLoadingStart();
      }

      // For members, ensure companyId is set to their company
      if (!canSelectCompany && userCompanyId) {
        data.companyId = userCompanyId;
      }

      const marqueeInput = {
        name: data.name,
        link: data.link,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        market: data.market,
        companyId: data.companyId,
        buttonText: data.buttonText || undefined,
        buttonColor: data.buttonColor || undefined,
        buttonFontWeight: data.buttonFontWeight || undefined,
      };

      const marquee = await createMarquee(marqueeInput);

      if (!marquee) {
        throw new Error('Failed to create marquee');
      }

      console.log('✅ Basic marquee created successfully:', marquee);
      onSubmit(marquee);
    } catch (error) {
      console.error('❌ Error creating basic marquee:', error);
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Client Assignment */}
        {canSelectCompany ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Client Assignment</span>
              </CardTitle>
              <CardDescription>
                Select which client organization this marquee belongs to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Organization *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading || companiesLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              companiesLoading
                                ? 'Loading companies...'
                                : 'Select a client organization'
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
            </CardContent>
          </Card>
        ) : userCompany ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Your Organization</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Organization:</span> {userCompany.name}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  This marquee will be created for your organization
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Marquee Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LinkIcon className="h-5 w-5" />
              <span>Marquee Information</span>
            </CardTitle>
            <CardDescription>Basic information about the marquee</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marquee Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Summer Festival 2025"
                      {...field}
                      disabled={loading}
                    />
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
                  <FormLabel>Link URL *</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/event"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    URL where users will be directed when clicking the marquee
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Display Period */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Display Period</span>
            </CardTitle>
            <CardDescription>When should this marquee be displayed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={loading} />
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
                      <Input type="date" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Button Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Button Configuration</span>
            </CardTitle>
            <CardDescription>Optional button customization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="buttonText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Button Text</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Get Tickets Now"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="buttonColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Color</FormLabel>
                    <FormControl>
                      <Input
                        type="color"
                        {...field}
                        disabled={loading}
                        className="h-10"
                      />
                    </FormControl>
                    <FormDescription>
                      Hex color code (e.g., #FF5733)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buttonFontWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Font Weight</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select font weight" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BUTTON_FONT_WEIGHT_OPTIONS.map((option) => (
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
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating Marquee...
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
