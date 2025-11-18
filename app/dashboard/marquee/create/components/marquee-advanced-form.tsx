'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, Video, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  FormDescription,
} from '@/components/ui/form';
import { ImageUploadAdvanced } from '@/components/ui/image-upload-advanced';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Marquee } from '@/types/marquee';
import { useMarqueeActions } from '../../hooks/use-marquee-actions';
import { useMarqueeMediaUpload } from '../hooks/use-marquee-media-upload';
import { useImageUploadStore } from '@/store/image-upload-store';
import {
  marqueeAdvancedSchema,
  MarqueeAdvancedFormData,
  defaultMarqueeAdvancedValues,
} from '../../lib/validations';

interface MarqueeAdvancedFormProps {
  marquee: Marquee;
  onSubmit: () => void;
  onBack: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;
}

type MediaType = 'image' | 'video' | 'none';

export function MarqueeAdvancedForm({
  marquee,
  onSubmit,
  onBack,
  loading = false,
  onLoadingStart,
}: MarqueeAdvancedFormProps) {
  const { updateMarquee } = useMarqueeActions();
  const imageUploadStore = useImageUploadStore();

  const [desktopMediaType, setDesktopMediaType] = useState<MediaType>('none');
  const [mobileMediaType, setMobileMediaType] = useState<MediaType>('none');

  const form = useForm<MarqueeAdvancedFormData>({
    resolver: zodResolver(marqueeAdvancedSchema),
    defaultValues: defaultMarqueeAdvancedValues,
  });

  // Desktop media upload hooks
  const desktopImageUpload = useMarqueeMediaUpload({
    marqueeId: marquee.id,
    mediaType: 'desktop',
    onUploadComplete: (imageKey) => {
      form.setValue('desktopImage', imageKey);
    },
  });

  // Mobile media upload hooks
  const mobileImageUpload = useMarqueeMediaUpload({
    marqueeId: marquee.id,
    mediaType: 'mobile',
    onUploadComplete: (imageKey) => {
      form.setValue('mobileImage', imageKey);
    },
  });

  const handleSubmit = async (data: MarqueeAdvancedFormData) => {
    try {
      if (onLoadingStart) {
        onLoadingStart();
      }

      // Handle temporary image uploads
      let finalDesktopImage = data.desktopImage;
      let finalMobileImage = data.mobileImage;

      if (data.desktopImage && imageUploadStore.isTemporaryImage(data.desktopImage)) {
        finalDesktopImage = await imageUploadStore.uploadPendingImage(
          data.desktopImage,
          desktopImageUpload.generatePresignedUrl
        );
      }

      if (data.mobileImage && imageUploadStore.isTemporaryImage(data.mobileImage)) {
        finalMobileImage = await imageUploadStore.uploadPendingImage(
          data.mobileImage,
          mobileImageUpload.generatePresignedUrl
        );
      }

      // Update marquee with media
      const updateInput: {
        id: string;
        desktopImage?: string;
        desktopVideo?: string;
        mobileImage?: string;
        mobileVideo?: string;
      } = {
        id: marquee.id,
      };

      // Add desktop media (ensure mutual exclusivity)
      if (desktopMediaType === 'image' && finalDesktopImage) {
        updateInput.desktopImage = finalDesktopImage;
        updateInput.desktopVideo = undefined; // Explicitly clear video
      } else if (desktopMediaType === 'video' && data.desktopVideo) {
        updateInput.desktopVideo = data.desktopVideo;
        updateInput.desktopImage = undefined; // Explicitly clear image
      }

      // Add mobile media (ensure mutual exclusivity)
      if (mobileMediaType === 'image' && finalMobileImage) {
        updateInput.mobileImage = finalMobileImage;
        updateInput.mobileVideo = undefined; // Explicitly clear video
      } else if (mobileMediaType === 'video' && data.mobileVideo) {
        updateInput.mobileVideo = data.mobileVideo;
        updateInput.mobileImage = undefined; // Explicitly clear image
      }

      await updateMarquee(updateInput);

      console.log('✅ Marquee updated successfully with media');
      onSubmit();
    } catch (error) {
      console.error('❌ Error updating marquee:', error);
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Info Alert */}
        <Alert className="border-blue-200 bg-blue-50">
          <ImageIcon className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Media Guidelines:</strong> You can upload either an image OR a video for each device type (desktop/mobile).
            Images: max 10MB. Videos: max 50MB. Recommended dimensions will be shown in each section.
          </AlertDescription>
        </Alert>

        {/* Desktop Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="h-5 w-5" />
              <span>Desktop Media</span>
            </CardTitle>
            <CardDescription>
              Upload media for desktop display (1920x600px recommended)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormItem>
              <FormLabel>Media Type</FormLabel>
              <RadioGroup
                value={desktopMediaType}
                onValueChange={(value) => setDesktopMediaType(value as MediaType)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="desktop-none" />
                  <label htmlFor="desktop-none" className="text-sm cursor-pointer">
                    No media
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="desktop-image" />
                  <label htmlFor="desktop-image" className="text-sm cursor-pointer">
                    Image
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="desktop-video" />
                  <label htmlFor="desktop-video" className="text-sm cursor-pointer">
                    Video
                  </label>
                </div>
              </RadioGroup>
            </FormItem>

            {desktopMediaType === 'image' && (
              <FormField
                control={form.control}
                name="desktopImage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploadAdvanced
                        config={desktopImageUpload.config}
                        generatePresignedUrl={desktopImageUpload.generatePresignedUrl}
                        onUploadComplete={desktopImageUpload.handleUploadComplete}
                        onUploadError={desktopImageUpload.handleUploadError}
                        currentImageUrl={field.value}
                        label="Desktop Image"
                        description="Upload desktop image (1920x600px)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {desktopMediaType === 'video' && (
              <FormField
                control={form.control}
                name="desktopVideo"
                render={() => (
                  <FormItem>
                    <FormLabel>Desktop Video</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2">
                          Video upload will be implemented with S3 direct upload
                        </p>
                        <p className="text-xs text-gray-500">
                          Max 50MB, MP4 format recommended
                        </p>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a video file for desktop marquee (max 50MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Mobile Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>Mobile Media</span>
            </CardTitle>
            <CardDescription>
              Upload media for mobile display (768x432px recommended)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormItem>
              <FormLabel>Media Type</FormLabel>
              <RadioGroup
                value={mobileMediaType}
                onValueChange={(value) => setMobileMediaType(value as MediaType)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="mobile-none" />
                  <label htmlFor="mobile-none" className="text-sm cursor-pointer">
                    No media
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="mobile-image" />
                  <label htmlFor="mobile-image" className="text-sm cursor-pointer">
                    Image
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="mobile-video" />
                  <label htmlFor="mobile-video" className="text-sm cursor-pointer">
                    Video
                  </label>
                </div>
              </RadioGroup>
            </FormItem>

            {mobileMediaType === 'image' && (
              <FormField
                control={form.control}
                name="mobileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploadAdvanced
                        config={mobileImageUpload.config}
                        generatePresignedUrl={mobileImageUpload.generatePresignedUrl}
                        onUploadComplete={mobileImageUpload.handleUploadComplete}
                        onUploadError={mobileImageUpload.handleUploadError}
                        currentImageUrl={field.value}
                        label="Mobile Image"
                        description="Upload mobile image (768x432px)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {mobileMediaType === 'video' && (
              <FormField
                control={form.control}
                name="mobileVideo"
                render={() => (
                  <FormItem>
                    <FormLabel>Mobile Video</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2">
                          Video upload will be implemented with S3 direct upload
                        </p>
                        <p className="text-xs text-gray-500">
                          Max 50MB, MP4 format recommended
                        </p>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a video file for mobile marquee (max 50MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} disabled={loading}>
            Back to Step 1
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving Marquee...
              </>
            ) : (
              'Complete & Save'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
