'use client';

import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { GENERATE_EVENT_IMAGE_UPLOAD_URL } from '@/lib/graphql/events';
import { MODULE_CONFIGS } from '@/components/ui/image-upload-advanced';
import { CroppedImageData } from '@/components/ui/image-upload-advanced/types';

interface UseEventImageUploadProps {
  eventId?: string;
  onUploadComplete?: (imageKey: string, croppedData?: CroppedImageData) => void;
  onUploadError?: (error: string) => void;
}

export function useEventImageUpload({
  eventId,
  onUploadComplete,
  onUploadError
}: UseEventImageUploadProps = {}) {

  const [generatePresignedUrl] = useMutation(GENERATE_EVENT_IMAGE_UPLOAD_URL);

  const handleGeneratePresignedUrl = async (
    fileName: string,
    contentType: string,
    fileSize: number
  ) => {
    try {
      
      const response = await generatePresignedUrl({
        variables: {
          generateEventImageUploadUrlInput: {
            eventId: eventId || 'temp-event-id',
            fileName,
            contentType,
            fileSize,
            imageType: 'main' // Only use main image type as requested
          }
        }
      });

      if (!response.data?.generateEventImageUploadUrl) {
        throw new Error('Failed to generate presigned URL');
      }

      // The API now returns the proper object with all required fields
      const presignedData = response.data.generateEventImageUploadUrl;
      
      
      return presignedData;
    } catch (error) {
      console.error('Generate presigned URL error details:', {
        error,
        errorMessage: error instanceof Error ? error.message : String(error),
        graphQLErrors: (error as { graphQLErrors?: unknown })?.graphQLErrors,
        networkError: (error as { networkError?: unknown })?.networkError,
        variables: {
          eventId: eventId || 'temp-event-id',
          fileName,
          contentType,
          fileSize
        }
      });
      throw error;
    }
  };

  const handleUploadComplete = async (imageKey: string, croppedData?: CroppedImageData) => {
    try {
      // Check if this is a temporary image ID (starts with 'temp_')
      const isTemporaryImage = imageKey.startsWith('temp_');
      
      if (isTemporaryImage) {
        // For temporary images, just pass the ID to the form
        toast.success('Image ready for upload');
      } else {
        toast.success('Event image uploaded successfully');
      }

      onUploadComplete?.(imageKey, croppedData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process event image';
      toast.error(errorMessage);
      onUploadError?.(errorMessage);
    }
  };

  const handleUploadError = (error: string) => {
    toast.error(`Upload failed: ${error}`);
    onUploadError?.(error);
  };

  return {
    config: {
      ...MODULE_CONFIGS.events,
      acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
      minWidth: MODULE_CONFIGS.events.minWidth!,
      minHeight: MODULE_CONFIGS.events.minHeight!,
      module: MODULE_CONFIGS.events.module!
    },
    generatePresignedUrl: handleGeneratePresignedUrl,
    handleUploadComplete,
    handleUploadError
  };
}