'use client';

import React, { useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { restaurantBasicSchema, RestaurantBasicFormData, PRICE_RANGE_OPTIONS } from '../../../lib/validations';
import type { Restaurant } from '@/types/restaurants';
import { useQuery } from '@apollo/client';
import { GET_RESTAURANT_TYPES, GET_ALL_COMPANIES_FOR_DROPDOWN } from '@/lib/graphql/restaurants';
import { useAuthStore } from '@/store/auth-store';
import { isSuperAdmin, isAdmin } from '@/lib/roles';
import { useZipcodeMarket } from '@/hooks/use-zipcode-market';

interface RestaurantType {
  id: string;
  name: string;
}

interface Company {
  id: string;
  name: string;
}

export interface RestaurantBasicEditFormRef {
  submitForm: () => Promise<void>;
}

interface RestaurantBasicEditFormProps {
  restaurant: Restaurant;
  onSubmit: (data: unknown) => Promise<void>;
  onNext: () => void;
  loading?: boolean;
  onDataChange?: (data: Record<string, unknown>) => void;
  onFormChange?: () => void;
}

// Helper function to convert restaurant to form data
const restaurantToBasicFormData = (restaurant: Restaurant): RestaurantBasicFormData => ({
  id: restaurant.id, // ✅ Include restaurant ID for updates
  name: restaurant.name || '',
  description: restaurant.description || '',
  address: restaurant.address || '',
  city: restaurant.city || '',
  state: restaurant.state || '',
  zipcode: restaurant.zipcode || '',
  market: restaurant.market || '',
  phone: restaurant.phone || '',
  email: restaurant.email || '',
  website: restaurant.website || '',
  restaurantTypeId: restaurant.restaurantType?.id || '',
  priceRange: restaurant.priceRange,
  companyId: restaurant.company?.id || ''
});

export const RestaurantBasicEditForm = React.forwardRef<RestaurantBasicEditFormRef, RestaurantBasicEditFormProps>(({ 
  restaurant, 
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
    resolver: zodResolver(restaurantBasicSchema),
    defaultValues: restaurantToBasicFormData(restaurant),
    mode: 'onChange'
  });

  // Watch form values for change detection
  const watchedValues = useWatch({
    control: form.control
  });

  // Get original values for comparison
  const originalValues = React.useMemo(() => restaurantToBasicFormData(restaurant), [restaurant]);

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

  // Fetch restaurant types
  const { data: restaurantTypesData } = useQuery(GET_RESTAURANT_TYPES, {
    errorPolicy: 'all'
  });
  const restaurantTypes: RestaurantType[] = restaurantTypesData?.restaurantTypes || [];

  // Fetch companies for admin users
  const { data: companiesData } = useQuery(GET_ALL_COMPANIES_FOR_DROPDOWN, {
    skip: !canSelectCompany,
    errorPolicy: 'all'
  });
  const companies: Company[] = companiesData?.companies || [];

  // Initialize zipcode market hook for auto-detection
  const { isLoading: isLoadingMarket, error: marketError, validateZipCode } = useZipcodeMarket({
    form,
    zipcodeField: 'zipcode',
    marketField: 'market',
    cityField: 'city',
    stateField: 'state'
  });

  const handleSubmit = useCallback(async () => {
    try {
      // In edit mode, "Continue to Advanced Details" should just navigate to Step 2
      // without triggering an update. Updates only happen via "Update Changes" button.
      onNext();
    } catch (error) {
      console.error('Error in basic form submission:', error);
      // Re-throw to let parent handle the error
      throw error;
    }
  }, [onNext]);

  // Separate handler for update button (direct submit)
  const handleUpdateSubmit = useCallback(async (data: RestaurantBasicFormData) => {
    console.log('🟡 handleUpdateSubmit called in basic form with data:', data);
    try {
      // Direct submit for update
      console.log('📤 Calling onSubmit from basic form');
      await onSubmit(data);
      console.log('✅ onSubmit completed in basic form');
    } catch (error) {
      console.error('❌ Update submit error in basic form:', error);
      // Re-throw to let parent handle the error
      throw error;
    }
  }, [onSubmit]);

  // Expose submitForm function to parent
  React.useImperativeHandle(ref, () => ({
    submitForm: async () => {
      console.log('🟠 submitForm called in basic form');
      return new Promise<void>((resolve, reject) => {
        form.handleSubmit(
          // Success callback
          async (data) => {
            try {
              await handleUpdateSubmit(data);
              console.log('✅ submitForm resolved in basic form');
              resolve();
            } catch (error) {
              console.log('❌ submitForm rejected in basic form:', error);
              reject(error);
            }
          },
          // Error callback (validation errors)
          (errors) => {
            console.error('❌ Form validation errors in basic form:', errors);
            reject(new Error('Form validation failed'));
          }
        )();
      });
    }
  }), [form, handleUpdateSubmit]);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter restaurant name" {...field} />
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
                        placeholder="Describe the restaurant, its cuisine, and atmosphere"
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="restaurantTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuisine Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cuisine type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {restaurantTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
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
                  name="priceRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Range *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PRICE_RANGE_OPTIONS.map((option) => (
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

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter street address" {...field} />
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
                        <Input placeholder="Enter city" {...field} />
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
                        <Input placeholder="Enter state" {...field} />
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

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
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
                        <Input placeholder="restaurant@example.com" type="email" {...field} />
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
                      <Input placeholder="https://restaurant-website.com" {...field} />
                    </FormControl>
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
                'Continue to Advanced Details'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
});

RestaurantBasicEditForm.displayName = 'RestaurantBasicEditForm';