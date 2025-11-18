"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { ImageUploadAdvanced } from '@/components/ui/image-upload-advanced';
import { ArtsGroup } from '@/types/arts-groups';
import { useArtsGroupActions } from '../../hooks/use-arts-group-actions';
import { useArtsGroupImageUpload } from '../../hooks/use-arts-group-image-upload';
import { useImageUploadStore } from '@/store/image-upload-store';
import {
  artsGroupAdvancedSchema,
  ArtsGroupAdvancedFormData
} from '../../lib/validations';

interface ArtsGroupAdvancedFormProps {
  artsGroup: ArtsGroup;
  onSubmit: () => void;
  onBack: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;
}

export function ArtsGroupAdvancedForm({
  artsGroup,
  onSubmit,
  onBack,
  loading = false,
  onLoadingStart
}: ArtsGroupAdvancedFormProps) {
  const { updateArtsGroup } = useArtsGroupActions();
  const imageUploadStore = useImageUploadStore();

  const form = useForm<ArtsGroupAdvancedFormData>({
    resolver: zodResolver(artsGroupAdvancedSchema),
    defaultValues: {
      description: '',
      image: '',
      memberCount: undefined,
      foundedYear: undefined
    }
  });

  const {
    config,
    generatePresignedUrl,
    handleUploadComplete,
    handleUploadError
  } = useArtsGroupImageUpload({
    artsGroupId: artsGroup.id,
    onUploadComplete: (imageKey) => {
      form.setValue('image', imageKey);
    }
  });

  const handleSubmit = async (data: ArtsGroupAdvancedFormData) => {
    try {
      if (onLoadingStart) {
        onLoadingStart();
      }

      // Handle temporary image upload FIRST
      let finalImageKey = data.image;
      if (data.image && imageUploadStore.isTemporaryImage(data.image)) {
        finalImageKey = await imageUploadStore.uploadPendingImage(
          data.image,
          generatePresignedUrl
        );
      }

      // Update arts group with real S3 key and other fields
      const updateInput = {
        id: artsGroup.id,
        ...(data.description && { description: data.description }),
        ...(data.memberCount && { memberCount: Number(data.memberCount) }),
        ...(data.foundedYear && { foundedYear: Number(data.foundedYear) }),
        ...(finalImageKey && finalImageKey !== 'placeholder' && { image: finalImageKey })
      };

      await updateArtsGroup(updateInput);

      console.log('✅ Arts group updated successfully');
      onSubmit();
    } catch (error) {
      console.error('❌ Error updating arts group:', error);
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5" />
              <span>Arts Group Image</span>
            </CardTitle>
            <CardDescription>
              Upload a high-quality image (minimum 1080x1080px, square aspect ratio)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploadAdvanced
                      config={config}
                      generatePresignedUrl={generatePresignedUrl}
                      onUploadComplete={handleUploadComplete}
                      onUploadError={handleUploadError}
                      currentImageUrl={field.value}
                      label="Arts Group Image"
                      description="Upload high-quality image (min 1080x1080px)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Additional Information</span>
            </CardTitle>
            <CardDescription>Optional details about the arts group</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the arts group, its mission, and activities..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of the arts group (10-500 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="memberCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member Count</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 25"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? Number(value) : undefined);
                        }}
                        value={field.value || ''}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormDescription>Number of members in the arts group</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="foundedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founded Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 2020"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? Number(value) : undefined);
                        }}
                        value={field.value || ''}
                        disabled={loading}
                        min={1800}
                        max={new Date().getFullYear()}
                      />
                    </FormControl>
                    <FormDescription>Year the arts group was founded</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                Saving Arts Group...
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
