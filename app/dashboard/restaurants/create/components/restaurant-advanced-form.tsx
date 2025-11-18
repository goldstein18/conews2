'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useQuery } from '@apollo/client';
import { ImageUploadAdvanced } from '@/components/ui/image-upload-advanced';
import { Restaurant } from '@/types/restaurants';
import { 
  restaurantAdvancedSchema,
  RestaurantAdvancedFormData,
  defaultRestaurantAdvancedValues,
  AMENITIES_OPTIONS
} from '../../lib/validations';
import { GET_DIETARY_OPTIONS } from '@/lib/graphql/restaurants';
import { useRestaurantImageUpload } from '../../hooks/use-restaurant-image-upload';
import { useRestaurantActions } from '../../hooks/use-restaurant-actions';
import { useImageUploadStore } from '@/store/image-upload-store';

interface RestaurantAdvancedFormProps {
  restaurant: Restaurant;
  onSubmit: () => void;
  onBack: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;
}

export function RestaurantAdvancedForm({
  restaurant,
  onSubmit,
  onBack,
  loading = false,
  onLoadingStart
}: RestaurantAdvancedFormProps) {
  const { updateRestaurant } = useRestaurantActions();
  const imageUploadStore = useImageUploadStore();
  
  const form = useForm<RestaurantAdvancedFormData>({
    resolver: zodResolver(restaurantAdvancedSchema),
    defaultValues: defaultRestaurantAdvancedValues
  });

  // Fetch dietary options
  const { data: dietaryOptionsData, loading: dietaryOptionsLoading } = useQuery(GET_DIETARY_OPTIONS);
  const dietaryOptions = dietaryOptionsData?.restaurantDietaryOptions || [];

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

  const handleSubmit = async (data: RestaurantAdvancedFormData) => {
    try {
      if (onLoadingStart) onLoadingStart();
      
      // Handle temporary image upload FIRST
      let finalImageKey = data.image;
      if (data.image && imageUploadStore.isTemporaryImage(data.image)) {
        finalImageKey = await imageUploadStore.uploadPendingImage(
          data.image, 
          generatePresignedUrl
        );
      }
      
      // Update restaurant with real S3 key and advanced data
      const updateInput = {
        id: restaurant.id,
        // Optional social media fields - only include if they have values
        ...(data.facebook && data.facebook.trim() && { facebook: data.facebook.trim() }),
        ...(data.twitter && data.twitter.trim() && { twitter: data.twitter.trim() }),
        ...(data.instagram && data.instagram.trim() && { instagram: data.instagram.trim() }),
        ...(data.youtube && data.youtube.trim() && { youtube: data.youtube.trim() }),
        ...(data.tiktok && data.tiktok.trim() && { tiktok: data.tiktok.trim() }),
        ...(data.menuLink && data.menuLink.trim() && { menuLink: data.menuLink.trim() }),
        // Arrays - only include if they have items
        ...(data.dietaryOptions && data.dietaryOptions.length > 0 && { dietaryOptions: data.dietaryOptions }),
        ...(data.amenities && data.amenities.length > 0 && { amenities: data.amenities }),
        // Image - only include if we have a real image key
        ...(finalImageKey && finalImageKey !== 'placeholder' && { 
          image: finalImageKey 
        })
      };
      
      console.log('🔄 Updating restaurant with:', updateInput);
      
      const updatedRestaurant = await updateRestaurant(updateInput);
      if (!updatedRestaurant) {
        throw new Error('Failed to update restaurant');
      }
      
      console.log('✅ Restaurant updated successfully:', updatedRestaurant);
      onSubmit(); // Navigate to list
    } catch (error) {
      console.error('Error updating restaurant:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Details & Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Restaurant Image */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant Image *</FormLabel>
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

            {/* Social Media Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Media</h3>
              
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

                <FormField
                  control={form.control}
                  name="tiktok"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TikTok</FormLabel>
                      <FormControl>
                        <Input placeholder="https://tiktok.com/@restaurant" {...field} />
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
                    {dietaryOptionsLoading ? (
                      <div>Loading dietary options...</div>
                    ) : (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      dietaryOptions.map((option: any) => (
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
                      ))
                    )}
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

            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={loading}
              >
                Back to Step 1
              </Button>
              
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving Restaurant...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}