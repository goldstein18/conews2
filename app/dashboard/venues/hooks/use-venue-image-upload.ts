'use client';

import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { 
  GENERATE_VENUE_IMAGE_UPLOAD_URL,
  UPDATE_VENUE_IMAGES,
  REMOVE_VENUE_IMAGE
} from '@/lib/graphql/image-uploads';
import { MODULE_CONFIGS } from '@/components/ui/image-upload-advanced';
import { CroppedImageData } from '@/components/ui/image-upload-advanced/types';

interface UseVenueImageUploadProps {
  venueId?: string;
  onUploadComplete?: (imageKey: string, croppedData?: CroppedImageData) => void;
  onUploadError?: (error: string) => void;
  onRemoveComplete?: () => void; // Callback después de remover imagen exitosamente
}

export function useVenueImageUpload({
  venueId,
  onUploadComplete,
  onUploadError,
  onRemoveComplete
}: UseVenueImageUploadProps = {}) {

  const [generatePresignedUrl] = useMutation(GENERATE_VENUE_IMAGE_UPLOAD_URL);
  const [updateVenueImages] = useMutation(UPDATE_VENUE_IMAGES);
  const [removeVenueImage] = useMutation(REMOVE_VENUE_IMAGE);

  const handleGeneratePresignedUrl = async (
    fileName: string,
    contentType: string,
    fileSize: number
  ) => {
    try {
      const response = await generatePresignedUrl({
        variables: {
          generateVenueImageUploadUrlInput: {
            fileName,
            contentType,
            fileSize,
            venueId: venueId || 'temp-venue-id', // For new venues, we'll use a temp ID
            imageType: 'main' // Default to main image type
          }
        }
      });

      if (!response.data?.generateVenueImageUploadUrl) {
        throw new Error('Failed to generate presigned URL');
      }

      return response.data.generateVenueImageUploadUrl;
    } catch (error) {
      console.error('Generate presigned URL error:', error);
      throw error;
    }
  };

  const handleUploadComplete = async (imageKey: string, croppedData?: CroppedImageData) => {
    try {
      // Check if this is a temporary image ID (starts with 'temp_')
      const isTemporaryImage = imageKey.startsWith('temp_');
      
      console.log('🎯 handleUploadComplete called:', {
        imageKey,
        isTemporaryImage,
        hasVenueId: !!venueId,
        hasCroppedData: !!croppedData
      });

      if (venueId && !isTemporaryImage) {
        // Only update venue if we have a real venue ID and this is not a temporary image
        await updateVenueImages({
          variables: {
            updateVenueImagesInput: {
              id: venueId,
              image: imageKey  // The S3 key
            }
          }
        });
        toast.success('Venue image uploaded successfully');
      } else if (isTemporaryImage) {
        // For temporary images, just pass the ID to the form
        console.log('📝 Storing temporary image ID in form:', imageKey);
      }

      onUploadComplete?.(imageKey, croppedData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update venue image';
      toast.error(errorMessage);
      onUploadError?.(errorMessage);
    }
  };

  const handleUploadError = (error: string) => {
    toast.error(`Upload failed: ${error}`);
    onUploadError?.(error);
  };

  const handleRemoveImage = async () => {
    if (!venueId) {
      toast.error('Venue ID is required to remove image');
      return;
    }

    try {
      await removeVenueImage({
        variables: {
          venueId
        }
      });
      toast.success('Venue image removed successfully');
      onRemoveComplete?.(); // Llamar callback después de remoción exitosa
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove venue image';
      toast.error(errorMessage);
    }
  };

  return {
    config: {
      ...MODULE_CONFIGS.venues,
      acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
      minWidth: MODULE_CONFIGS.venues.minWidth!,
      minHeight: MODULE_CONFIGS.venues.minHeight!,
      module: MODULE_CONFIGS.venues.module!
    },
    generatePresignedUrl: handleGeneratePresignedUrl,
    handleUploadComplete,
    handleUploadError,
    handleRemoveImage,
    removeImage: handleRemoveImage // Alias para mayor claridad
  };
}