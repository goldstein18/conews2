'use client';

import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { GENERATE_DEDICATED_IMAGE_UPLOAD_URL } from '@/lib/graphql/dedicated';
import type { CroppedImageData, ImageUploadConfig } from '@/components/ui/image-upload-advanced/types';

interface UseDedicatedImageUploadProps {
  dedicatedId?: string;
  onUploadComplete?: (imageKey: string, croppedData: CroppedImageData) => void;
  onUploadError?: (error: string) => void;
}

const DEDICATED_IMAGE_CONFIG: ImageUploadConfig = {
  minWidth: 700,
  minHeight: 100, // Minimum height, no maximum
  aspectRatio: undefined, // No aspect ratio - accept any proportions
  maxFileSize: 10 * 1024 * 1024, // 10MB
  quality: 1, // No compression - keep original quality
  allowRotation: false, // No rotation needed
  allowZoom: false, // Disable zoom - no cropping interface
  module: 'dedicated'
};

export function useDedicatedImageUpload({
  dedicatedId,
  onUploadComplete,
  onUploadError
}: UseDedicatedImageUploadProps) {
  const [generatePresignedUrl] = useMutation(GENERATE_DEDICATED_IMAGE_UPLOAD_URL);

  const handleGeneratePresignedUrl = async (
    fileName: string,
    contentType: string,
    fileSize: number
  ) => {
    try {
      const response = await generatePresignedUrl({
        variables: {
          generateDedicatedImageUploadUrlInput: {
            dedicatedId: dedicatedId || 'temp-dedicated-id',
            fileName,
            contentType,
            fileSize
          }
        }
      });

      const data = response.data?.generateDedicatedImageUploadUrl;

      if (!data) {
        throw new Error('Failed to generate upload URL');
      }

      return {
        uploadUrl: data.uploadUrl,
        key: data.key,
        expiresIn: data.expiresIn,
        maxFileSize: data.maxFileSize,
        recommendedDimensions: data.recommendedDimensions
      };
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate upload URL';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleUploadComplete = (imageKey: string, croppedData: CroppedImageData) => {
    toast.success('Image uploaded successfully');
    if (onUploadComplete) {
      onUploadComplete(imageKey, croppedData);
    }
  };

  const handleUploadError = (error: string) => {
    toast.error(error);
    if (onUploadError) {
      onUploadError(error);
    }
  };

  return {
    config: DEDICATED_IMAGE_CONFIG,
    generatePresignedUrl: handleGeneratePresignedUrl,
    onUploadComplete: handleUploadComplete,
    onUploadError: handleUploadError
  };
}
