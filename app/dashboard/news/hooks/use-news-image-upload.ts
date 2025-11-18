'use client';

import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { GENERATE_NEWS_IMAGE_UPLOAD_URL } from '@/lib/graphql/news';
import { MODULE_CONFIGS } from '@/components/ui/image-upload-advanced';
import { CroppedImageData } from '@/components/ui/image-upload-advanced/types';

interface UseNewsImageUploadProps {
  newsId?: string;
  onUploadComplete?: (imageKey: string, croppedData?: CroppedImageData) => void;
  onUploadError?: (error: string) => void;
}

export function useNewsImageUpload({
  newsId,
  onUploadComplete,
  onUploadError
}: UseNewsImageUploadProps = {}) {

  const [generatePresignedUrl] = useMutation(GENERATE_NEWS_IMAGE_UPLOAD_URL);

  const handleGeneratePresignedUrl = async (
    fileName: string,
    contentType: string,
    fileSize: number
  ) => {
    try {
      // newsId is REQUIRED by the backend (String!)
      // In Step 2, newsId should always be available from the created article
      if (!newsId) {
        throw new Error('News ID is required to generate upload URL. Article must be created first.');
      }

      const response = await generatePresignedUrl({
        variables: {
          generateHeroImageUploadUrlInput: {
            newsId,  // ✅ REQUIRED - ID from Step 1
            fileName,
            contentType,
            fileSize
          }
        }
      });

      if (!response.data?.generateHeroImageUploadUrl) {
        throw new Error('Failed to generate presigned URL');
      }

      return response.data.generateHeroImageUploadUrl;
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
        hasNewsId: !!newsId,
        hasCroppedData: !!croppedData
      });

      // For news, we don't update the entity here
      // The image will be uploaded to S3 in Step 2 when form is submitted
      if (isTemporaryImage) {
        console.log('📝 Storing temporary image ID in form:', imageKey);
      } else {
        toast.success('News hero image uploaded successfully');
      }

      onUploadComplete?.(imageKey, croppedData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload news image';
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
      ...MODULE_CONFIGS.news,
      acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
      minWidth: MODULE_CONFIGS.news.minWidth!,
      minHeight: MODULE_CONFIGS.news.minHeight!,
      module: MODULE_CONFIGS.news.module!
    },
    generatePresignedUrl: handleGeneratePresignedUrl,
    handleUploadComplete,
    handleUploadError
  };
}
