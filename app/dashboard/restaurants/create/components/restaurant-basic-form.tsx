'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@apollo/client';
import { Restaurant } from '@/types/restaurants';
import {
  restaurantBasicSchema,
  RestaurantBasicFormData,
  defaultRestaurantBasicValues,
  PRICE_RANGE_OPTIONS
} from '../../lib/validations';
import { GET_RESTAURANT_TYPES, GET_ALL_COMPANIES_FOR_DROPDOWN } from '@/lib/graphql/restaurants';
import { MY_COMPANY_PROFILE } from '@/lib/graphql/settings';
import { useRestaurantActions } from '../../hooks/use-restaurant-actions';
import { useAuthStore } from '@/store/auth-store';
import { isSuperAdmin, isAdmin } from '@/lib/roles';
import { useZipcodeMarket } from '@/hooks/use-zipcode-market';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RestaurantBasicFormProps {
  onSubmit: (restaurant: Restaurant) => void;
  onCancel: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;
}

export function RestaurantBasicForm({
  onSubmit,
  onCancel,
  loading = false,
  onLoadingStart
}: RestaurantBasicFormProps) {
  const { createRestaurant } = useRestaurantActions();
  const { user } = useAuthStore();
  
  // Determine if user can select company
  const canSelectCompany = user && (isSuperAdmin(user) || isAdmin(user));
  
  const form = useForm<RestaurantBasicFormData>({
    resolver: zodResolver(restaurantBasicSchema),
    defaultValues: defaultRestaurantBasicValues
  });

  // Initialize zipcode market hook
  const { isLoading: isLoadingMarket, error: marketError, validateZipCode } = useZipcodeMarket({
    form,
    zipcodeField: 'zipcode',
    marketField: 'market',
    cityField: 'city',
    stateField: 'state'
  });

  // Get user's company profile (for regular members)
  const { data: companyData } = useQuery(MY_COMPANY_PROFILE, {
    skip: !!canSelectCompany, // Skip if user is admin (they can select any company)
    errorPolicy: 'all'
  });

  const userCompanyId = companyData?.myCompanyProfile?.id;

  // Fetch restaurant types
  const { data: restaurantTypesData, loading: restaurantTypesLoading, error: restaurantTypesError } = useQuery(GET_RESTAURANT_TYPES);
  
  // Companies dropdown data (for super admin/admin)
  const { data: companiesData, loading: companiesLoading, error: companiesError } = useQuery(GET_ALL_COMPANIES_FOR_DROPDOWN, {
    skip: !canSelectCompany,
    errorPolicy: 'all'
  });

  const restaurantTypes = (restaurantTypesData?.restaurantTypes || [])
    .slice()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .sort((a: any, b: any) => a.displayName.localeCompare(b.displayName));
  const companies = (companiesData?.companies || [])
    .slice()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .sort((a: any, b: any) => a.name.localeCompare(b.name));


  const handleSubmit = async (data: RestaurantBasicFormData) => {
    try {
      // Start loading state
      if (onLoadingStart) {
        onLoadingStart();
      }
      
      console.log('🏗️ Creating basic restaurant with data:', data);
      
      // For members, ensure companyId is set to their company
      if (!canSelectCompany && userCompanyId) {
        data.companyId = userCompanyId;
      }
      
      const restaurantInput = {
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        zipcode: data.zipcode,
        market: data.market,
        restaurantTypeId: data.restaurantTypeId,
        priceRange: data.priceRange,
        companyId: data.companyId,
        image: 'placeholder', // Step 1 always uses placeholder
        // Optional fields - only include if they have values
        ...(data.phone && data.phone.trim() && { phone: data.phone.trim() }),
        ...(data.email && data.email.trim() && { email: data.email.trim() }),
        ...(data.website && data.website.trim() && { website: data.website.trim() }),
        ...(data.latitude && { latitude: data.latitude }),
        ...(data.longitude && { longitude: data.longitude })
      };

      const restaurant = await createRestaurant(restaurantInput);
      if (!restaurant) {
        throw new Error('Failed to create restaurant');
      }
      
      console.log('✅ Basic restaurant created successfully:', restaurant);
      onSubmit(restaurant);
      
    } catch (error) {
      console.error('❌ Error creating basic restaurant:', error);
      // Error handling is done by the form via react-hook-form
      throw error;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Restaurant Name */}
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

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the restaurant..."
                      className="h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder="Miami" {...field} />
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
                      <Input placeholder="FL" {...field} />
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

            {/* Market */}
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

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (305) 123-4567" {...field} />
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
                      <Input placeholder="info@restaurant.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Website */}
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://restaurant.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Restaurant Type */}
            <FormField
              control={form.control}
              name="restaurantTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuisine Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cuisine type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {restaurantTypesLoading ? (
                        <SelectItem value="loading">Loading...</SelectItem>
                      ) : restaurantTypesError ? (
                        <SelectItem value="error">Error loading cuisine types</SelectItem>
                      ) : restaurantTypes.length === 0 ? (
                        <SelectItem value="no-data">No cuisine types available</SelectItem>
                      ) : (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        restaurantTypes.map((type: any) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.displayName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Range */}
            <FormField
              control={form.control}
              name="priceRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Range *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            {/* Client Assignment - Conditional rendering based on user role */}
            {canSelectCompany ? (
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Organization *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client organization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companiesLoading ? (
                          <SelectItem value="loading">Loading...</SelectItem>
                        ) : companiesError ? (
                          <SelectItem value="error">Error loading companies</SelectItem>
                        ) : companies.length === 0 ? (
                          <SelectItem value="no-data">No companies available</SelectItem>
                        ) : (
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          companies.map((company: any) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              userCompanyId && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client Organization</label>
                  <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
                    {companyData?.myCompanyProfile?.name || 'Your Company'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Restaurant will be assigned to your company automatically.
                  </p>
                </div>
              )
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating Restaurant...
                  </>
                ) : (
                  'Continue to Step 2'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}