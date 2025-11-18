'use client';

import React, { useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { bannerImageSchema, BannerImageFormData } from '../../../lib/validations';
import type { Banner } from '@/types/banners';
import { ImageUploadAdvanced } from '@/components/ui/image-upload-advanced';
import { useBannerImageUpload } from '../../../create/hooks/use-banner-image-upload';

export interface BannerAdvancedEditFormRef {
  submitForm: () => void;
}

interface BannerAdvancedEditFormProps {
  banner: Banner;
  formData?: Record<string, unknown>;
  onSubmit: (data: unknown) => Promise<void>;
  onBack: () => void;
  loading?: boolean;
  onFormChange?: () => void;
}

// Helper function to convert banner to form data
const bannerToAdvancedFormData = (banner: Banner): BannerImageFormData => ({
  image: banner.imageUrl || banner.image || '',
  notes: ''
});

export const BannerAdvancedEditForm = React.forwardRef<BannerAdvancedEditFormRef, BannerAdvancedEditFormProps>(({ 
  banner, 
  formData = {}, 
  onSubmit, 
  onBack, 
  loading = false, 
  onFormChange
}, ref) => {

  // Form setup
  const form = useForm({
    resolver: zodResolver(bannerImageSchema),
    defaultValues: bannerToAdvancedFormData(banner),
    mode: 'onChange'
  });

  // Watch form values for change detection
  const watchedValues = useWatch({
    control: form.control
  });

  // Get original values for comparison
  const originalValues = React.useMemo(() => bannerToAdvancedFormData(banner), [banner]);

  // Detect form changes
  React.useEffect(() => {
    const hasChanges = JSON.stringify(watchedValues) !== JSON.stringify(originalValues);
    if (hasChanges && onFormChange) {
      onFormChange();
    }
  }, [watchedValues, originalValues, onFormChange]);

  const handleSubmit = useCallback(async (data: BannerImageFormData) => {
    try {
      // Combine basic and advanced data
      const combinedData = {
        ...formData,
        ...data,
        id: banner.id
      };
      
      await onSubmit(combinedData);
    } catch (error) {
      console.error('Error in advanced form submission:', error);
    }
  }, [formData, banner.id, onSubmit]);

  // Expose submitForm function to parent
  React.useImperativeHandle(ref, () => ({
    submitForm: () => {
      form.handleSubmit(handleSubmit)();
    }
  }), [form, handleSubmit]);

  // Image upload configuration
  const {
    config: imageConfig,
    generatePresignedUrl,
    handleUploadComplete,
    handleUploadError
  } = useBannerImageUpload({
    bannerId: banner.id,
    onUploadComplete: (imageKey) => {
      form.setValue('image', imageKey);
    }
  });

  // Get current banner image
  const currentImageUrl = banner.imageUrl || 
                         (banner.image && banner.image !== 'placeholder' ? banner.image : '');

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Banner Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Banner Image</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <ImageUploadAdvanced
                      config={imageConfig}
                      generatePresignedUrl={generatePresignedUrl}
                      onUploadComplete={(imageKey) => {
                        field.onChange(imageKey);
                        handleUploadComplete(imageKey);
                      }}
                      onUploadError={handleUploadError}
                      currentImageUrl={currentImageUrl}
                      label="Banner Image"
                      description="Upload a high-quality banner image (recommended dimensions vary by banner type)"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes about this banner campaign..."
                        className="min-h-24"
                        {...field}
                      />
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
              Back to Campaign Details
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Banner...
                </>
              ) : (
                'Update Banner'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
});

BannerAdvancedEditForm.displayName = 'BannerAdvancedEditForm';