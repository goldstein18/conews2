'use client';

import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
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
import { useArtsGroupImageUpload } from '../../../hooks/use-arts-group-image-upload';
import { useImageUploadStore } from '@/store/image-upload-store';
import {
  artsGroupAdvancedSchema,
  ArtsGroupAdvancedFormData
} from '../../../lib/validations';

interface ArtsGroupAdvancedEditFormProps {
  artsGroup: ArtsGroup;
  formData: Record<string, unknown>;
  onSubmit: (data: unknown) => Promise<void>;
  onBack?: () => void;
  loading?: boolean;
  onFormChange?: () => void;
}

export interface ArtsGroupAdvancedEditFormRef {
  submitForm: () => void;
}

export const ArtsGroupAdvancedEditForm = forwardRef<
  ArtsGroupAdvancedEditFormRef,
  ArtsGroupAdvancedEditFormProps
>(({
  artsGroup,
  formData,
  onSubmit,
  onBack,
  loading = false,
  onFormChange
}, ref) => {
  const imageUploadStore = useImageUploadStore();

  const form = useForm<ArtsGroupAdvancedFormData>({
    resolver: zodResolver(artsGroupAdvancedSchema),
    defaultValues: {
      description: artsGroup.description || '',
      image: artsGroup.image || '',
      memberCount: artsGroup.memberCount || undefined,
      foundedYear: artsGroup.foundedYear || undefined
    }
  });

  const {
    config,
    generatePresignedUrl,
    handleUploadComplete,
    handleUploadError,
    removeImage
  } = useArtsGroupImageUpload({
    artsGroupId: artsGroup.id,
    onUploadComplete: (imageKey) => {
      form.setValue('image', imageKey);
    }
  });

  // Handler para remover imagen - marca como removida, no ejecuta inmediatamente
  const handleRemoveImage = () => {
    console.log('🗑️ Marking image for removal (staged change)');
    form.setValue('image', 'REMOVE'); // Valor especial para indicar remoción pendiente
  };

  // Watch image value to detect 'REMOVE' status
  const imageValue = form.watch('image');

  // Expose submitForm method via ref
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      form.handleSubmit(handleInternalSubmit)();
    }
  }));

  // Track form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      onFormChange?.();
    });
    return () => subscription.unsubscribe();
  }, [form, onFormChange]);

  const handleInternalSubmit = async (data: ArtsGroupAdvancedFormData) => {
    try {
      let finalImageKey = data.image;

      // Caso especial: remoción pendiente
      if (data.image === 'REMOVE') {
        console.log('🗑️ Executing pending image removal for arts group:', artsGroup.id);
        try {
          await removeImage();
          finalImageKey = ''; // Limpiar el campo después de remover
        } catch (error) {
          console.error('❌ Failed to remove arts group image:', error);
          throw error;
        }
      }
      // Caso: imagen temporal (pendiente de subir)
      else if (data.image && imageUploadStore.isTemporaryImage(data.image)) {
        finalImageKey = await imageUploadStore.uploadPendingImage(
          data.image,
          generatePresignedUrl
        );
      }

      // Combine data from Step 1 + Step 2 with final image
      const completeData = {
        ...formData,
        description: data.description,
        memberCount: data.memberCount,
        foundedYear: data.foundedYear,
        image: finalImageKey && finalImageKey !== 'placeholder' ? finalImageKey : undefined
      };

      // Pass complete data to wizard
      await onSubmit(completeData);
    } catch (error) {
      console.error('Error in advanced form:', error);
      throw error;
    }
  };

  // Get current arts group image
  const currentImageUrl = artsGroup.imageUrl ||
                         (artsGroup.image && artsGroup.image !== 'placeholder' ? artsGroup.image : '');

  // Determinar qué imagen mostrar
  const shouldHideImage = imageValue === 'REMOVE';
  const displayImageUrl = shouldHideImage ? undefined : currentImageUrl;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleInternalSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5" />
              <span>Arts Group Image</span>
            </CardTitle>
            <CardDescription>
              Upload or update arts group image (1080x1080px)
            </CardDescription>
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
                        🗑️ Image marked for removal - will be deleted when you save the arts group
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

                  <FormControl>
                    <ImageUploadAdvanced
                      config={config}
                      generatePresignedUrl={generatePresignedUrl}
                      onUploadComplete={handleUploadComplete}
                      onUploadError={handleUploadError}
                      onRemove={displayImageUrl && !shouldHideImage ? handleRemoveImage : undefined}
                      currentImageUrl={displayImageUrl}
                      label="Arts Group Image"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Additional Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[100px]" {...field} disabled={loading} />
                  </FormControl>
                  <FormDescription>Brief description (10-500 characters)</FormDescription>
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
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        value={field.value || ''}
                        disabled={loading}
                      />
                    </FormControl>
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
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        value={field.value || ''}
                        disabled={loading}
                        min={1800}
                        max={new Date().getFullYear()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex justify-between items-center">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              ← Back to Step 1
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              // Trigger form submission via ref (called from wizard)
              const form = document.querySelector('form');
              if (form) {
                form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
              }
            }}
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            {loading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Updating...
              </>
            ) : (
              'Update Arts Group'
            )}
          </button>
        </div>
      </form>
    </Form>
  );
});

ArtsGroupAdvancedEditForm.displayName = 'ArtsGroupAdvancedEditForm';
