'use client';

import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { GENERATE_RESTAURANT_IMAGE_UPLOAD_URL, UPDATE_RESTAURANT_IMAGES } from '@/lib/graphql/restaurants';
import { REMOVE_RESTAURANT_IMAGE } from '@/lib/graphql/image-uploads';

export interface RestaurantImageUploadResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
  maxFileSize: number;
  recommendedDimensions?: { width: number; height: number; };
  allowedFileTypes?: string[];
  imageType: string;
}

interface UseRestaurantImageUploadProps {
  restaurantId: string;
  onUploadComplete?: (imageKey: string) => void;
  onUploadError?: (error: Error) => void;
  onRemoveComplete?: () => void; // Callback después de remover imagen exitosamente
}

export function useRestaurantImageUpload({
  restaurantId,
  onUploadComplete,
  onUploadError,
  onRemoveComplete
}: UseRestaurantImageUploadProps) {
  const [generatePresignedUrl] = useMutation(GENERATE_RESTAURANT_IMAGE_UPLOAD_URL);
  const [updateRestaurantImages] = useMutation(UPDATE_RESTAURANT_IMAGES);
  const [removeRestaurantImage] = useMutation(REMOVE_RESTAURANT_IMAGE);

  const handleGeneratePresignedUrl = async (
    fileName: string,
    contentType: string,
    fileSize: number
  ): Promise<RestaurantImageUploadResponse> => {
    try {
      const response = await generatePresignedUrl({
        variables: {
          generateRestaurantImageUploadUrlInput: {
            restaurantId: restaurantId || 'temp-restaurant-id',
            fileName,
            contentType,
            fileSize,
            imageType: 'MAIN'
          }
        }
      });

      return response.data.generateRestaurantImageUploadUrl;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      const errorMessage = error instanceof Error ? error : new Error('Failed to generate upload URL');
      if (onUploadError) onUploadError(errorMessage);
      throw errorMessage;
    }
  };

  const handleUploadComplete = async (imageKey: string) => {
    try {
      // Check if this is a temporary image ID (starts with 'temp_')
      const isTemporaryImage = imageKey.startsWith('temp_');

      console.log('🎯 handleUploadComplete called:', {
        imageKey,
        isTemporaryImage,
        hasRestaurantId: !!restaurantId
      });

      if (restaurantId && restaurantId !== 'temp-restaurant-id' && !isTemporaryImage) {
        // Only update restaurant if we have a real restaurant ID and this is NOT a temporary image
        // This means the image was already uploaded to S3 (direct upload without cropping)
        await updateRestaurantImages({
          variables: {
            updateRestaurantImagesInput: {
              restaurantId,
              imageKey,
              imageBigKey: imageKey // Use same key for both sizes
            }
          }
        });
        toast.success('Image uploaded successfully');
      } else if (isTemporaryImage) {
        // For temporary images, just pass the ID to the form
        // The actual upload to S3 will happen when the form is submitted
        console.log('📝 Storing temporary image ID in form:', imageKey);
      }

      if (onUploadComplete) {
        onUploadComplete(imageKey);
      }
    } catch (error) {
      console.error('Error updating restaurant images:', error);
      const errorMessage = error instanceof Error ? error : new Error('Failed to update restaurant images');
      if (onUploadError) onUploadError(errorMessage);
      toast.error('Failed to update restaurant images');
    }
  };

  const handleUploadError = (error: Error) => {
    console.error('Image upload error:', error);
    if (onUploadError) onUploadError(error);
    toast.error(error.message || 'Failed to upload image');
  };

  const handleRemoveImage = async () => {
    if (!restaurantId) {
      toast.error('Restaurant ID is required to remove image');
      return;
    }

    try {
      await removeRestaurantImage({
        variables: {
          restaurantId
        }
      });
      toast.success('Restaurant image removed successfully');
      onRemoveComplete?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove restaurant image';
      toast.error(errorMessage);
    }
  };

  return {
    config: {
      minWidth: 1080,
      minHeight: 1080,
      aspectRatio: 1,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      quality: 0.9,
      allowRotation: true,
      allowZoom: true,
      zoomRange: [1, 3] as [number, number],
      module: 'restaurants' as const
    },
    generatePresignedUrl: handleGeneratePresignedUrl,
    onUploadComplete: handleUploadComplete,
    onUploadError: handleUploadError,
    handleRemoveImage,
    removeImage: handleRemoveImage // Alias para mayor claridad
  };
}