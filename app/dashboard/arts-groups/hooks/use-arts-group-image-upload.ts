'use client';

import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  GENERATE_ARTS_GROUP_IMAGE_UPLOAD_URL,
  UPDATE_ARTS_GROUP_IMAGE,
  REMOVE_ARTS_GROUP_IMAGE
} from '@/lib/graphql/arts-groups';
import { MODULE_CONFIGS } from '@/components/ui/image-upload-advanced';
import { CroppedImageData } from '@/components/ui/image-upload-advanced/types';

interface UseArtsGroupImageUploadProps {
  artsGroupId?: string;
  onUploadComplete?: (imageKey: string, croppedData?: CroppedImageData) => void;
  onUploadError?: (error: string) => void;
  onRemoveComplete?: () => void;
}

export function useArtsGroupImageUpload({
  artsGroupId,
  onUploadComplete,
  onUploadError,
  onRemoveComplete
}: UseArtsGroupImageUploadProps = {}) {

  const [generatePresignedUrl] = useMutation(GENERATE_ARTS_GROUP_IMAGE_UPLOAD_URL);
  const [updateArtsGroupImage] = useMutation(UPDATE_ARTS_GROUP_IMAGE);
  const [removeArtsGroupImage] = useMutation(REMOVE_ARTS_GROUP_IMAGE);

  const handleGeneratePresignedUrl = async (
    fileName: string,
    contentType: string,
    fileSize: number
  ) => {
    try {
      const response = await generatePresignedUrl({
        variables: {
          generateArtsGroupImageUploadUrlInput: {
            fileName,
            contentType,
            fileSize,
            artsGroupId: artsGroupId || 'temp-arts-group-id', // For new arts groups, use temp ID
            imageType: 'main' // Default to main image type
          }
        }
      });

      if (!response.data?.generateArtsGroupImageUploadUrl) {
        throw new Error('Failed to generate presigned URL');
      }

      return response.data.generateArtsGroupImageUploadUrl;
    } catch (error) {
      console.error('Generate presigned URL error:', error);
      throw error;
    }
  };

  const handleUploadComplete = async (imageKey: string, croppedData?: CroppedImageData) => {
    try {
      const isTemporaryImage = imageKey.startsWith('temp_');

      console.log('🎯 handleUploadComplete called:', {
        imageKey,
        isTemporaryImage,
        hasArtsGroupId: !!artsGroupId,
        hasCroppedData: !!croppedData
      });

      if (artsGroupId && !isTemporaryImage) {
        await updateArtsGroupImage({
          variables: {
            updateArtsGroupImageInput: {
              id: artsGroupId,
              image: imageKey
            }
          }
        });
        toast.success('Arts group image uploaded successfully');
      } else if (isTemporaryImage) {
        console.log('📝 Storing temporary image ID in form:', imageKey);
      }

      onUploadComplete?.(imageKey, croppedData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update arts group image';
      toast.error(errorMessage);
      onUploadError?.(errorMessage);
    }
  };

  const handleUploadError = (error: string) => {
    toast.error(`Upload failed: ${error}`);
    onUploadError?.(error);
  };

  const handleRemoveImage = async () => {
    if (!artsGroupId) {
      toast.error('Arts group ID is required to remove image');
      return;
    }

    try {
      await removeArtsGroupImage({
        variables: {
          artsGroupId
        }
      });
      toast.success('Arts group image removed successfully');
      onRemoveComplete?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove arts group image';
      toast.error(errorMessage);
    }
  };

  return {
    config: {
      ...MODULE_CONFIGS['arts-groups'],
      acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
      minWidth: MODULE_CONFIGS['arts-groups'].minWidth!,
      minHeight: MODULE_CONFIGS['arts-groups'].minHeight!,
      module: MODULE_CONFIGS['arts-groups'].module!
    },
    generatePresignedUrl: handleGeneratePresignedUrl,
    handleUploadComplete,
    handleUploadError,
    handleRemoveImage,
    removeImage: handleRemoveImage
  };
}
