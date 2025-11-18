'use client';

import { UseFormReturn } from 'react-hook-form';
import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUploadAdvanced } from '@/components/ui/image-upload-advanced';
import { 
  GET_RESTAURANT_TYPES,
  GET_DIETARY_OPTIONS,
  GET_ALL_COMPANIES_FOR_DROPDOWN
} from '@/lib/graphql/restaurants';
import { 
  restaurantEditSchema,
  PRICE_RANGE_OPTIONS,
  MARKET_OPTIONS,
  AMENITIES_OPTIONS
} from '../lib/validations';
import { z } from 'zod';
import { useRestaurantImageUpload } from '../hooks/use-restaurant-image-upload';
import { Restaurant } from '@/types/restaurants';

interface RestaurantEditFormProps {
  form: UseFormReturn<z.infer<typeof restaurantEditSchema>>;
  restaurant: Restaurant;
  loading?: boolean;
}

export function RestaurantEditForm({
  form,
  restaurant
}: RestaurantEditFormProps) {
  // Fetch restaurant types
  const { data: restaurantTypesData } = useQuery(GET_RESTAURANT_TYPES);
  
  // Fetch dietary options
  const { data: dietaryOptionsData } = useQuery(GET_DIETARY_OPTIONS);
  
  // Fetch companies
  const { data: companiesData } = useQuery(GET_ALL_COMPANIES_FOR_DROPDOWN);

  const restaurantTypes = (restaurantTypesData?.restaurantTypes || [])
    .slice()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .sort((a: any, b: any) => a.displayName.localeCompare(b.displayName));
  const dietaryOptions = dietaryOptionsData?.restaurantDietaryOptions || [];
  const companies = (companiesData?.companies || [])
    .slice()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .sort((a: any, b: any) => a.name.localeCompare(b.name));

  // Image upload hook
  const {
    config,
    generatePresignedUrl,
    onUploadError
  } = useRestaurantImageUpload({
    restaurantId: restaurant.id,
    onUploadComplete: (imageKey) => {
      form.setValue('image', imageKey);
    }
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
      <Form {...form}>
        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Restaurant Name & Description */}
              <div className="grid grid-cols-1 gap-4">
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
                          placeholder="Describe the restaurant..."
                          className="h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                      <FormControl>
                        <Input placeholder="33101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Market & Cuisine Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="market"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select market" />
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
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {restaurantTypes.map((type: any) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Price Range & Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select company" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {companies.map((company: any) => (
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
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
          </Card>

          {/* Restaurant Image */}
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Image</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant Image</FormLabel>
                    <FormControl>
                      <ImageUploadAdvanced
                        config={config}
                        generatePresignedUrl={generatePresignedUrl}
                        onUploadComplete={(imageKey) => field.onChange(imageKey)}
                        onUploadError={(error: string) => onUploadError(new Error(error))}
                        currentImageUrl={field.value}
                        label="Restaurant Image"
                        description="Upload a high-quality image of your restaurant (min 1080x1080px)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Social Media & Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Social Media */}
              <div>
                <h4 className="text-sm font-medium mb-4">Social Media</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input placeholder="https://facebook.com/restaurant" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <FormControl>
                          <Input placeholder="https://twitter.com/restaurant" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input placeholder="https://instagram.com/restaurant" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube</FormLabel>
                        <FormControl>
                          <Input placeholder="https://youtube.com/channel/restaurant" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Menu Link */}
              <FormField
                control={form.control}
                name="menuLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Menu Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://restaurant.com/menu" {...field} />
                    </FormControl>
                    <FormDescription>
                      Link to your online menu
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dietary Options */}
              <FormField
                control={form.control}
                name="dietaryOptions"
                render={() => (
                  <FormItem>
                    <FormLabel>Dietary Options</FormLabel>
                    <FormDescription>
                      Select all dietary options available at your restaurant
                    </FormDescription>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {dietaryOptions.map((option: any) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="dietaryOptions"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.name)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, option.name])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.name
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {option.displayName}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amenities */}
              <FormField
                control={form.control}
                name="amenities"
                render={() => (
                  <FormItem>
                    <FormLabel>Amenities</FormLabel>
                    <FormDescription>
                      Select all amenities available at your restaurant
                    </FormDescription>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                      {AMENITIES_OPTIONS.map((option) => (
                        <FormField
                          key={option.value}
                          control={form.control}
                          name="amenities"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, option.value])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.value
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Admin Notes */}
              <FormField
                control={form.control}
                name="adminNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Internal notes for admins..."
                        className="h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Internal notes visible only to administrators
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </Form>
    </div>
  );
}