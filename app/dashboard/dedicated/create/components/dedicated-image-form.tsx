'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ImageIcon } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { ImageUploadAdvanced } from '@/components/ui/image-upload-advanced';
import { useImageUploadStore } from '@/store/image-upload-store';
import { Dedicated } from '@/types/dedicated';
import { useDedicatedActions, useDedicatedImageUpload } from '../../hooks';

interface DedicatedImageFormProps {
  dedicated: Dedicated;
  onSubmit: () => void;
  onBack: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;
}

// Simple schema - only image required
const dedicatedImageSchema = z.object({
  image: z.string().min(1, 'Campaign image is required')
});

type DedicatedImageFormData = z.infer<typeof dedicatedImageSchema>;

export function DedicatedImageForm({
  dedicated,
  onBack,
  loading = false,
  onLoadingStart
}: DedicatedImageFormProps) {
  const router = useRouter();
  const { updateDedicated } = useDedicatedActions();
  const imageUploadStore = useImageUploadStore();

  // Image upload configuration
  const {
    config: imageConfig,
    generatePresignedUrl,
    onUploadError
  } = useDedicatedImageUpload({
    dedicatedId: dedicated.id
  });

  const form = useForm<DedicatedImageFormData>({
    resolver: zodResolver(dedicatedImageSchema),
    defaultValues: {
      image: dedicated.image || ''
    }
  });

  const watchedImage = form.watch('image');

  const handleImageUploadComplete = (imageKey: string) => {
    form.setValue('image', imageKey);
  };

  const handleSubmit = async (data: DedicatedImageFormData) => {
    try {
      if (onLoadingStart) {
        onLoadingStart();
      }

      // Handle temporary image upload if needed
      let finalImageKey = data.image;
      if (data.image && imageUploadStore.isTemporaryImage(data.image)) {
        finalImageKey = await imageUploadStore.uploadPendingImage(
          data.image,
          generatePresignedUrl
        );
      }

      // Update dedicated with real image S3 key
      const updatedDedicated = await updateDedicated({
        id: dedicated.id,
        image: finalImageKey
      });

      if (!updatedDedicated) {
        throw new Error('Failed to update dedicated with image');
      }

      // Success - redirect to list
      router.push('/dashboard/dedicated');
    } catch (error) {
      console.error('Error uploading image:', error);
      form.setError('root', {
        message: 'Failed to upload image. Please try again.'
      });
    }
  };

  const isFormValid = () => {
    return watchedImage && watchedImage !== 'placeholder';
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Campaign Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Campaign Image
            </CardTitle>
            <CardDescription>
              Upload the image for your dedicated email campaign (700px width minimum)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormControl>
                    <ImageUploadAdvanced
                      config={imageConfig}
                      generatePresignedUrl={generatePresignedUrl}
                      onUploadComplete={handleImageUploadComplete}
                      onUploadError={onUploadError}
                      onRemove={() => form.setValue('image', '')}
                      currentImageUrl={
                        watchedImage && watchedImage !== '' && watchedImage !== 'placeholder'
                          ? dedicated.imageUrl || undefined
                          : undefined
                      }
                      label="Dedicated Campaign Image"
                      description="Upload image (700px width minimum, any height). The image will be clickable in the email."
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {form.formState.errors.root && (
          <div className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={loading}
          >
            Back to Step 1
          </Button>
          <Button
            type="submit"
            disabled={loading || !isFormValid()}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Uploading Image...
              </>
            ) : (
              'Complete'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
