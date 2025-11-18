'use client';

import React, { forwardRef, useImperativeHandle, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

import { 
  venueBasicSchema, 
  VenueBasicFormData 
} from '../../../lib/validations';
import {
  VenueType,
  Venue,
} from '@/types/venues';
import { useCompaniesDropdown } from '../../../hooks/use-venues-data';
import { useAuthStore } from '@/store/auth-store';
import { useQuery } from '@apollo/client';
import { MY_COMPANY_PROFILE } from '@/lib/graphql/settings';
import { isSuperAdmin, isAdmin } from '@/lib/roles';
import { useZipcodeMarket } from '@/hooks/use-zipcode-market';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VenueBasicEditFormProps {
  venue: Venue;
  onSubmit: (data: unknown) => Promise<void>;
  onNext?: () => void;
  loading?: boolean;
  onDataChange?: (data: unknown) => void;
  onFormChange?: () => void;
}

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

export interface VenueBasicEditFormRef {
  submitForm: () => void;
}

export const VenueBasicEditForm = forwardRef<VenueBasicEditFormRef, VenueBasicEditFormProps>(({ 
  venue, 
  onSubmit,
  onNext, 
  loading = false,
  onDataChange,
  onFormChange
}, ref) => {
  const { user } = useAuthStore();
  
  // Determine if user can see company selector
  const canSelectCompany = user && (isSuperAdmin(user) || isAdmin(user));
  
  // Get user's company profile (for members)
  const { data: companyData } = useQuery(MY_COMPANY_PROFILE, {
    skip: !!canSelectCompany,
    errorPolicy: 'all'
  });
  
  const userCompanyId = companyData?.myCompanyProfile?.id;
  const userCompany = companyData?.myCompanyProfile;
  
  // Get companies based on user role
  const { data: companiesData, loading: companiesLoading } = useCompaniesDropdown({ 
    skip: !canSelectCompany 
  });
  const companies = companiesData?.companies || [];

  // Convert venue to form data
  const venueToBasicFormData = (venue: Venue): VenueBasicFormData => {
    const extendedVenue = venue as Venue & Record<string, unknown>;
    return {
      name: venue.name,
      description: venue.description || '',
      address: venue.address,
      city: venue.city,
      state: venue.state,
      zipcode: venue.zipcode,
      market: (extendedVenue.market as string) || '',
      phone: venue.phone || '',
      website: venue.website || '',
      venueType: venue.venueType,
      companyId: venue.companyId || venue.company?.id || '',
      hostsPrivateEvents: venue.hostsPrivateEvents || false
    };
  };

  // Form setup
  const form = useForm<VenueBasicFormData>({
    resolver: zodResolver(venueBasicSchema),
    defaultValues: venueToBasicFormData(venue)
  });

  // Initialize zipcode market hook
  const { isLoading: isLoadingMarket, error: marketError, validateZipCode } = useZipcodeMarket({
    form,
    zipcodeField: 'zipcode',
    marketField: 'market',
    cityField: 'city',
    stateField: 'state'
  });

  // Track form changes
  const watchedValues = form.watch();
  const originalValues = React.useMemo(() => venueToBasicFormData(venue), [venue]);
  
  React.useEffect(() => {
    // Compare current form values with original values
    const hasChanges = JSON.stringify(watchedValues) !== JSON.stringify(originalValues);
    if (hasChanges && onFormChange) {
      onFormChange();
    }
  }, [watchedValues, originalValues, onFormChange]);

  const handleSubmit = useCallback(async (data: VenueBasicFormData) => {
    try {
      // For members, ensure companyId is set to their company
      if (!canSelectCompany && userCompanyId) {
        data.companyId = userCompanyId;
      }
      
      // Pass data to parent for combining with advanced form
      if (onDataChange) {
        onDataChange(data);
      }
      
      // For now, just go to next step - actual submit happens in advanced form
      if (onNext) {
        onNext();
      }
    } catch (error) {
      console.error('Basic form error:', error);
    }
  }, [canSelectCompany, userCompanyId, onDataChange, onNext]);

  // Separate handler for update button (direct submit)
  const handleUpdateSubmit = useCallback(async (data: VenueBasicFormData) => {
    try {
      // For members, ensure companyId is set to their company
      if (!canSelectCompany && userCompanyId) {
        data.companyId = userCompanyId;
      }
      
      // Direct submit for update
      await onSubmit(data);
    } catch (error) {
      console.error('Update submit error:', error);
    }
  }, [canSelectCompany, userCompanyId, onSubmit]);

  // Expose submitForm function to parent
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      form.handleSubmit(handleUpdateSubmit)();
    }
  }), [form, handleUpdateSubmit]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Client Assignment - Conditional rendering based on user role */}
        {canSelectCompany ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Company Assignment</span>
              </CardTitle>
              <CardDescription>
                Assign this venue to a company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Company *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={companiesLoading || loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={companiesLoading ? "Loading companies..." : "Choose a company"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companiesLoading ? (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            Loading companies...
                          </div>
                        ) : companies.length > 0 ? (
                          companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              <div className="font-medium">{company.name}</div>
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
        ) : (
          // For members, show their company info (read-only)
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Company Assignment</span>
              </CardTitle>
              <CardDescription>
                This venue will be assigned to your company
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userCompany ? (
                <>
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{userCompany.name}</div>
                      {userCompany.email && (
                        <div className="text-sm text-muted-foreground">{userCompany.email}</div>
                      )}
                    </div>
                  </div>
                  {/* Hidden field to store the company ID */}
                  <FormField
                    control={form.control}
                    name="companyId"
                    render={({ field }) => (
                      <input type="hidden" {...field} value={userCompany.id} />
                    )}
                  />
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No company assigned to your account. Please contact an administrator.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Venue Information */}
        <Card>
          <CardHeader>
            <CardTitle>Venue Information</CardTitle>
            <CardDescription>
              Provide the essential details about the venue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter venue name" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="venueType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Type *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={loading}
                    >
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the venue, its unique features, and what makes it special..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of the venue (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Private Events */}
        <Card>
          <CardHeader>
            <CardTitle>Private Events</CardTitle>
            <CardDescription>
              Configure private event hosting capabilities
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
                    <FormDescription>
                      Does this venue host private events?
                    </FormDescription>
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
              Provide the address and location information
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} disabled={loading} />
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
                  <FormDescription>
                    Market is automatically detected from ZIP code
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button
            type="submit"
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              'Continue to Step 2'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
});

VenueBasicEditForm.displayName = 'VenueBasicEditForm';