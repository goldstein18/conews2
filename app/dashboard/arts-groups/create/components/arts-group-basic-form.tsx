"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  FormMessage
} from '@/components/ui/form';
import { ArtsGroup } from '@/types/arts-groups';
import { useArtsGroupActions } from '../../hooks/use-arts-group-actions';
import { useAuthStore } from '@/store/auth-store';
import { useQuery } from '@apollo/client';
import { MY_COMPANY_PROFILE } from '@/lib/graphql/settings';
import { GET_ALL_COMPANIES_FOR_DROPDOWN } from '@/lib/graphql/venues';
import { isSuperAdmin, isAdmin } from '@/lib/roles';
import {
  artsGroupBasicSchema,
  ArtsGroupBasicFormData,
  ART_TYPE_OPTIONS,
  MARKET_OPTIONS
} from '../../lib/validations';

interface ArtsGroupBasicFormProps {
  onSubmit: (artsGroup: ArtsGroup) => void;
  onCancel: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;
}

export function ArtsGroupBasicForm({
  onSubmit,
  onCancel,
  loading = false,
  onLoadingStart
}: ArtsGroupBasicFormProps) {
  const { user } = useAuthStore();
  const { createArtsGroup } = useArtsGroupActions();

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

  const form = useForm<ArtsGroupBasicFormData>({
    resolver: zodResolver(artsGroupBasicSchema),
    defaultValues: {
      name: '',
      address: '',
      market: 'miami',
      artType: '',
      companyId: userCompanyId || '',
      phone: '',
      email: '',
      website: ''
    }
  });

  const handleSubmit = async (data: ArtsGroupBasicFormData) => {
    try {
      if (onLoadingStart) {
        onLoadingStart();
      }

      // For members, ensure companyId is set to their company
      if (!canSelectCompany && userCompanyId) {
        data.companyId = userCompanyId;
      }

      const artsGroupInput = {
        name: data.name,
        address: data.address,
        market: data.market,
        artType: data.artType || undefined,
        companyId: data.companyId,
        phone: data.phone || undefined,
        email: data.email || undefined,
        website: data.website || undefined,
        image: 'placeholder' // Step 1 always uses placeholder
      };

      const artsGroup = await createArtsGroup(artsGroupInput);

      if (!artsGroup) {
        throw new Error('Failed to create arts group');
      }

      console.log('✅ Basic arts group created successfully:', artsGroup);
      onSubmit(artsGroup);
    } catch (error) {
      console.error('❌ Error creating basic arts group:', error);
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
                Select which client organization this arts group belongs to
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
                  This arts group will be created for your organization
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Arts Group Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Arts Group Information</span>
            </CardTitle>
            <CardDescription>Basic information about the arts group</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arts Group Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Miami Arts Orchestra"
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
                name="artType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Art Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select art type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ART_TYPE_OPTIONS.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
            </div>
          </CardContent>
        </Card>

        {/* Location Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Location & Contact</span>
            </CardTitle>
            <CardDescription>Physical address and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="456 Music Ave, Miami, FL"
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1234567890"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contact@artsgroup.org"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://artsgroup.org"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                Creating Arts Group...
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
