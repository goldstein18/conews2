"use client";

import React from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

import { VenueType, type Venue } from '@/types/venues';
import { useCompaniesDropdown } from '../../hooks/use-venues-data';
import { useVenueActions } from '../../hooks/use-venue-actions';
import { useAuthStore } from '@/store/auth-store';
import { useQuery } from '@apollo/client';
import { MY_COMPANY_PROFILE } from '@/lib/graphql/settings';
import { isSuperAdmin, isAdmin } from '@/lib/roles';
import { useZipcodeMarket } from '@/hooks/use-zipcode-market';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Venue type options
const venueTypeOptions = [
  { value: VenueType.THEATER, label: 'Theater' },
  { value: VenueType.PERFORMING_ARTS_CENTER, label: 'Performing Arts Center' },
  { value: VenueType.ART_CENTER, label: 'Art Center' },
  { value: VenueType.GALLERY, label: 'Gallery' },
  { value: VenueType.MUSEUM, label: 'Museum' },
  { value: VenueType.EVENT_SPACE, label: 'Event Space' },
  { value: VenueType.AMPHITHEATRE, label: 'Amphitheatre' },
  { value: VenueType.STUDIO, label: 'Studio' },
  { value: VenueType.ARTIST_COMPLEX, label: 'Artist Complex' },
  { value: VenueType.COMMUNITY_CENTER, label: 'Community Center' },
  { value: VenueType.HISTORIC_HOMES, label: 'Historic Homes' },
  { value: VenueType.ATTRACTION, label: 'Tourist Attraction' },
  { value: VenueType.Z_OTHER, label: 'Other' }
];

// Validation schema for Step 1 (basic fields only)
const venueBasicSchema = z.object({
  name: z.string()
    .min(2, 'Venue name must be at least 2 characters')
    .max(100, 'Venue name must be less than 100 characters')
    .trim(),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
  
  address: z.string()
    .min(5, 'Street address must be at least 5 characters')
    .max(200, 'Street address must be less than 200 characters')
    .trim(),
  
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .trim(),
  
  state: z.string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be less than 50 characters')
    .trim(),
  
  zipcode: z.string()
    .min(5, 'ZIP code must be at least 5 characters')
    .max(10, 'ZIP code must be less than 10 characters')
    .regex(/^[0-9]{5}(?:-[0-9]{4})?$/, 'Invalid ZIP code format')
    .trim(),
  
  market: z.string()
    .min(1, 'Market is required')
    .trim(),
  
  venueType: z.nativeEnum(VenueType),

  companyId: z.string()
    .min(1, 'Please select a client organization'),

  hostsPrivateEvents: z.boolean().default(false)
});

type VenueBasicFormData = z.infer<typeof venueBasicSchema>;

interface VenueBasicFormProps {
  onSubmit: (venue: Venue) => void;
  onCancel: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;
}

export function VenueBasicForm({ onSubmit, onCancel, loading = false, onLoadingStart }: VenueBasicFormProps) {
  const { user } = useAuthStore();
  const { createVenue } = useVenueActions();
  
  // Determine if user can see company selector
  const canSelectCompany = user && (isSuperAdmin(user) || isAdmin(user));
  
  // Get user's company profile (for members)
  const { data: companyData } = useQuery(MY_COMPANY_PROFILE, {
    skip: !!canSelectCompany, // Skip if user is admin (they can select any company)
    errorPolicy: 'all'
  });
  
  const userCompanyId = companyData?.myCompanyProfile?.id;
  const userCompany = companyData?.myCompanyProfile;

  // Companies dropdown data (for super admin/admin)
  const { data: companiesData, loading: companiesLoading, error: companiesError } = useCompaniesDropdown({
    skip: !canSelectCompany
  });

  // Debug logs
  console.log('🔍 Company selection debug:', {
    user: user?.id,
    canSelectCompany,
    skipQuery: !canSelectCompany,
    companiesLoading,
    companiesData,
    companiesError: companiesError?.message,
    companiesArray: companiesData?.companies,
    userCompanyId,
    userCompany: userCompany?.name
  });

  const form = useForm<VenueBasicFormData>({
    resolver: zodResolver(venueBasicSchema) as unknown as Resolver<VenueBasicFormData>,
    defaultValues: {
      name: '',
      description: '',
      address: '',
      city: '',
      state: '',
      zipcode: '',
      market: '',
      venueType: VenueType.THEATER,
      companyId: userCompanyId || '',
      hostsPrivateEvents: false
    }
  });

  // Initialize zipcode market hook
  const { isLoading: isLoadingMarket, error: marketError, validateZipCode } = useZipcodeMarket({
    form,
    zipcodeField: 'zipcode',
    marketField: 'market',
    cityField: 'city',
    stateField: 'state'
  });

  const handleSubmit = async (data: VenueBasicFormData) => {
    try {
      // Start loading state
      if (onLoadingStart) {
        onLoadingStart();
      }
      
      console.log('🏗️ Creating basic venue with data:', data);

      // For members, ensure companyId is set to their company
      if (!canSelectCompany && userCompanyId) {
        data.companyId = userCompanyId;
      }



      const venueInput = {
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        zipcode: data.zipcode,
        market: data.market,
        venueType: data.venueType,
        companyId: data.companyId,
        image: 'placeholder', // Step 1 always uses placeholder
        hostsPrivateEvents: data.hostsPrivateEvents
      };

      const venue = await createVenue(venueInput);

      if (!venue) {
        throw new Error('Failed to create venue');
      }

      console.log('✅ Basic venue created successfully:', venue);
      onSubmit(venue);
      
    } catch (error) {
      console.error('❌ Error creating basic venue:', error);
      // Error handling is done by the form via react-hook-form
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Client Assignment - Conditional rendering based on user role */}
        {canSelectCompany ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Client Assignment</span>
              </CardTitle>
              <CardDescription>
                Select which client organization this venue belongs to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Organization *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading || companiesLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            companiesLoading 
                              ? "Loading companies..." 
                              : "Select a client organization"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companiesLoading ? (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            Loading companies...
                          </div>
                        ) : companiesData?.companies?.length ? (
                          companiesData.companies.map((company) => (
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
                  This venue will be created for your organization
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Venue Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Venue Information</span>
            </CardTitle>
            <CardDescription>
              Basic information about the venue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Brooklyn Music Hall" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the venue, its features, and what makes it special..."
                      className="min-h-[100px]"
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
                name="venueType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select venue type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {venueTypeOptions.map((type) => (
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
            </div>
          </CardContent>
        </Card>

        {/* Private Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Private Events</span>
            </CardTitle>
            <CardDescription>
              Does this venue host private events?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="hostsPrivateEvents"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Private Events</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Does this venue host private events?
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Location Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Location Details</span>
            </CardTitle>
            <CardDescription>
              Physical address and location information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address *</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main Street" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder="Brooklyn" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *</FormLabel>
                    <FormControl>
                      <Input placeholder="NY" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code *</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="33139"
                          {...field}
                          disabled={loading}
                          onBlur={(e) => {
                            field.onBlur();
                            validateZipCode(e.target.value);
                          }}
                        />
                      </FormControl>
                      {isLoadingMarket && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    {marketError && (
                      <p className="text-sm font-medium text-destructive mt-1.5">
                        {marketError}
                      </p>
                    )}
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
                  <FormLabel>Market (Auto-detected) *</FormLabel>
                  <div className="flex items-center gap-2">
                    {field.value ? (
                      <Badge variant="secondary" className="text-sm font-normal">
                        {field.value.toUpperCase()}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Enter ZIP code to auto-detect market
                      </span>
                    )}
                  </div>
                  <FormControl>
                    <Input type="hidden" {...field} />
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
                Creating Venue...
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