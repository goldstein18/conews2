'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUploadAdvanced } from '@/components/ui/image-upload-advanced';
import { useBannerActions } from '@/app/dashboard/banners/hooks/use-banner-actions';
import { useBannerImageUpload } from '../hooks/use-banner-image-upload';
import { useBannerStore } from '@/store/banner-store';
import { useImageUploadStore } from '@/store/image-upload-store';
import { Info, AlertCircle } from 'lucide-react';
import type { Banner, BannerType } from '@/types/banners';
import { bannerImageSchema, BannerImageFormData } from '../../lib/validations';


export interface BannerImageFormProps {
  banner: Banner;
  bannerType?: BannerType | null;
  onSubmit: () => void;
  onBack: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;
}

export function BannerImageForm({
  banner,
  bannerType,
  onSubmit,
  onBack,
  loading = false,
  onLoadingStart
}: BannerImageFormProps) {
  const { updateBannerImage } = useBannerActions();
  const { updateFormData } = useBannerStore();
  const imageUploadStore = useImageUploadStore();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<BannerImageFormData>({
    resolver: zodResolver(bannerImageSchema),
    defaultValues: {
      image: banner.image || ''
    }
  });


  const {
    config,
    generatePresignedUrl,
    handleUploadComplete,
    handleUploadError
  } = useBannerImageUpload({
    bannerId: banner.id,
    bannerType,
    onUploadComplete: (imageKey) => {
      form.setValue('image', imageKey);
      setUploadError(null);
    },
    onUploadError: (error) => {
      setUploadError(error);
    }
  });

  const handleSubmit = async (data: BannerImageFormData) => {
    try {
      if (onLoadingStart) onLoadingStart();

      console.log('🔄 Updating banner with image:', data);
      console.log('🖼️ Image value from form:', {
        imageValue: data.image,
        isEmpty: !data.image || data.image.trim() === '',
        bannerCurrentImage: banner.image,
        isTemporary: imageUploadStore.isTemporaryImage(data.image || '')
      });

      // Handle temporary image upload first (same as venues flow)
      let finalImageKey = data.image;
      if (data.image && imageUploadStore.isTemporaryImage(data.image)) {
        console.log('📤 Uploading temporary image to S3...');
        try {
          finalImageKey = await imageUploadStore.uploadPendingImage(data.image, generatePresignedUrl);
          console.log('✅ Temporary image uploaded to S3:', finalImageKey);
        } catch (uploadError) {
          console.error('❌ Failed to upload image to S3:', uploadError);
          throw new Error('Failed to upload image. Please try again.');
        }
      }

      // Save form data to Zustand store
      updateFormData({ image: finalImageKey });

      // Update banner with the real S3 image key
      if (finalImageKey && finalImageKey.trim() !== '') {
        console.log('🔧 Updating banner with final image key:', finalImageKey);
        const updatedBanner = await updateBannerImage({
          bannerId: banner.id,
          imageKey: finalImageKey
        });

        if (updatedBanner) {
          console.log('✅ Banner image updated successfully');
          onSubmit();
        }
      } else {
        console.log('⚠️ No image to update');
        onSubmit(); // Continue anyway if no image
      }
    } catch (error) {
      console.error('❌ Error updating banner image:', error);
      setUploadError('Failed to update banner image');
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Banner Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Banner Name:</span> {banner.name}
            </div>
            <div>
              <span className="font-medium">Market:</span> {banner.market}
            </div>
            <div>
              <span className="font-medium">Start Date:</span> {new Date(banner.startDate).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">End Date:</span> {new Date(banner.endDate).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Banner Image Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Banner Image</h3>
            
            {/* Image Size Notice */}
            <Alert className="border-yellow-200 bg-yellow-50">
              <Info className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Banner image size: {config.minWidth}×{config.minHeight} pixels (Required)</strong>
                <br />
                Please ensure your image matches these exact dimensions for optimal display
              </AlertDescription>
            </Alert>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploadAdvanced
                      config={config}
                      generatePresignedUrl={generatePresignedUrl}
                      onUploadComplete={(imageKey) => {
                        field.onChange(imageKey);
                        handleUploadComplete(imageKey);
                      }}
                      onUploadError={(error) => {
                        setUploadError(error);
                        handleUploadError(error);
                      }}
                      currentImageUrl={field.value}
                      disabled={loading}
                      description={`Upload a banner image (${config.minWidth}×${config.minHeight}px)`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {uploadError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {uploadError}
                </AlertDescription>
              </Alert>
            )}

            {/* Best Practice Notice */}
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Best Practice:</strong> Use little text on banners - they link to the information. 
                Banners with a lot of text (address, website, etc.) look unprofessional and don&apos;t perform as well.
              </AlertDescription>
            </Alert>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={loading}
              className="w-32"
            >
              Back to Step 1
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !form.watch('image')}
              className="w-48"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving Banner...
                </>
              ) : (
                'Complete Banner Creation'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}