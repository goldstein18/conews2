'use client';

import React, { useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { restaurantAdvancedSchema, RestaurantAdvancedFormData, AMENITIES_OPTIONS } from '../../../lib/validations';
import type { Restaurant } from '@/types/restaurants';
import { ImageUploadAdvanced } from '@/components/ui/image-upload-advanced';
import { useRestaurantImageUpload } from '../../../hooks/use-restaurant-image-upload';
import { useImageUploadStore } from '@/store/image-upload-store';

export interface RestaurantAdvancedEditFormRef {
  submitForm: () => Promise<void>;
}

interface RestaurantAdvancedEditFormProps {
  restaurant: Restaurant;
  formData?: Record<string, unknown>;
  onSubmit: (data: unknown) => Promise<void>;
  onBack: () => void;
  loading?: boolean;
  onFormChange?: () => void;
}

// Helper function to convert restaurant to form data
const restaurantToAdvancedFormData = (restaurant: Restaurant): RestaurantAdvancedFormData => ({
  image: restaurant.image || '',
  facebook: restaurant.facebook || '',
  twitter: restaurant.twitter || '',
  instagram: restaurant.instagram || '',
  youtube: restaurant.youtube || '',
  tiktok: restaurant.tiktok || '',
  menuLink: restaurant.menuLink || '',
  dietaryOptions: restaurant.dietaryOptions || [],
  amenities: restaurant.amenities || []
});

export const RestaurantAdvancedEditForm = React.forwardRef<RestaurantAdvancedEditFormRef, RestaurantAdvancedEditFormProps>(({ 
  restaurant, 
  formData = {}, 
  onSubmit, 
  onBack, 
  loading = false, 
  onFormChange
}, ref) => {

  // Form setup
  const form = useForm({
    resolver: zodResolver(restaurantAdvancedSchema),
    defaultValues: restaurantToAdvancedFormData(restaurant),
    mode: 'onChange'
  });

  // Watch form values for change detection
  const watchedValues = useWatch({
    control: form.control
  });

  // Get original values for comparison
  const originalValues = React.useMemo(() => restaurantToAdvancedFormData(restaurant), [restaurant]);

  // Detect form changes
  React.useEffect(() => {
    const hasChanges = JSON.stringify(watchedValues) !== JSON.stringify(originalValues);
    if (hasChanges && onFormChange) {
      onFormChange();
    }
  }, [watchedValues, originalValues, onFormChange]);

  // Get image upload store
  const imageUploadStore = useImageUploadStore();

  // Image upload configuration
  const {
    config: imageConfig,
    generatePresignedUrl,
    onUploadComplete: handleUploadComplete,
    onUploadError: handleUploadError,
    removeImage
  } = useRestaurantImageUpload({
    restaurantId: restaurant.id,
    onUploadComplete: (imageKey) => {
      form.setValue('image', imageKey);
    }
  });

  // Handler para remover imagen - marca como removida, no ejecuta inmediatamente
  const handleRemoveImage = useCallback(() => {
    console.log('🗑️ Marking image for removal (staged change)');
    form.setValue('image', 'REMOVE'); // Valor especial para indicar remoción pendiente
  }, [form]);

  const handleSubmit = useCallback(async (data: RestaurantAdvancedFormData) => {
    try {
      let finalImage = data.image;

      // Caso especial: remoción pendiente
      if (data.image === 'REMOVE') {
        console.log('🗑️ Executing pending image removal for restaurant:', restaurant.id);
        try {
          await removeImage();
          finalImage = ''; // Limpiar el campo después de remover
        } catch (error) {
          console.error('❌ Failed to remove restaurant image:', error);
          throw error;
        }
      }
      // Caso: imagen temporal (pendiente de subir)
      else if (data.image && imageUploadStore.isTemporaryImage(data.image)) {
        console.log('📤 Uploading pending restaurant image:', data.image);
        finalImage = await imageUploadStore.uploadPendingImage(data.image, generatePresignedUrl);
        console.log('✅ Restaurant image uploaded to S3:', finalImage);
      }

      // Combine basic and advanced data with final image
      const combinedData = {
        ...formData,
        ...data,
        image: finalImage,
        id: restaurant.id
      };

      await onSubmit(combinedData);
    } catch (error) {
      console.error('Error in advanced form submission:', error);
      // Re-throw to let parent handle the error
      throw error;
    }
  }, [formData, restaurant.id, onSubmit, removeImage, imageUploadStore, generatePresignedUrl]);

  // Expose submitForm function to parent
  React.useImperativeHandle(ref, () => ({
    submitForm: async () => {
      return new Promise<void>((resolve, reject) => {
        form.handleSubmit(
          // Success callback
          async (data) => {
            try {
              await handleSubmit(data);
              resolve();
            } catch (error) {
              reject(error);
            }
          },
          // Error callback (validation errors)
          (errors) => {
            console.error('Form validation errors:', errors);
            reject(new Error('Form validation failed'));
          }
        )();
      });
    }
  }), [form, handleSubmit]);

  // Watch image value to detect 'REMOVE' status
  const imageValue = form.watch('image');

  // Get current restaurant image
  const currentImageUrl = restaurant.imageUrl || restaurant.imageBigUrl ||
                         (restaurant.image && restaurant.image !== 'placeholder' ? restaurant.image : '');

  // Determinar qué imagen mostrar
  const shouldHideImage = imageValue === 'REMOVE';
  const displayImageUrl = shouldHideImage ? undefined : currentImageUrl;

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                    {/* Banner de remoción pendiente */}
                    {shouldHideImage && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          🗑️ Image marked for removal - will be deleted when you save the restaurant
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => field.onChange(currentImageUrl || '')}
                          className="mt-2"
                        >
                          Undo Remove
                        </Button>
                      </div>
                    )}

                    <ImageUploadAdvanced
                      config={imageConfig}
                      generatePresignedUrl={generatePresignedUrl}
                      onUploadComplete={(imageKey) => {
                        field.onChange(imageKey);
                        handleUploadComplete(imageKey);
                      }}
                      onUploadError={(error) => handleUploadError(new Error(error))}
                      onRemove={displayImageUrl && !shouldHideImage ? handleRemoveImage : undefined}
                      currentImageUrl={displayImageUrl}
                      label="Restaurant Image"
                      description="Upload a high-quality image that represents your restaurant (recommended: 1080x1080px or larger)"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media & Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://facebook.com/restaurant" {...field} />
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
                      <FormLabel>Instagram URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://instagram.com/restaurant" {...field} />
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
                      <FormLabel>Twitter URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://twitter.com/restaurant" {...field} />
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
                      <FormLabel>YouTube URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://youtube.com/restaurant" {...field} />
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
                      <FormLabel>TikTok URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://tiktok.com/@restaurant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="menuLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Menu Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://restaurant.com/menu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="amenities"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {AMENITIES_OPTIONS.map((amenity) => (
                        <FormField
                          key={amenity.value}
                          control={form.control}
                          name="amenities"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={amenity.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(amenity.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, amenity.value])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== amenity.value
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-sm">
                                  {amenity.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Dietary Options */}
          <Card>
            <CardHeader>
              <CardTitle>Dietary Options</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="dietaryOptions"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-2">
                        {[
                          'Vegetarian',
                          'Vegan',
                          'Gluten-Free',
                          'Dairy-Free',
                          'Nut-Free',
                          'Halal',
                          'Kosher'
                        ].map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value?.includes(option)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, option])
                                  : field.onChange(
                                      field.value?.filter((value) => value !== option)
                                    )
                              }}
                            />
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              Back to Basic Information
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Restaurant...
                </>
              ) : (
                'Update Restaurant'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
});

RestaurantAdvancedEditForm.displayName = 'RestaurantAdvancedEditForm';