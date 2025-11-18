import { useMutation } from '@apollo/client';
import { GENERATE_MARQUEE_MEDIA_UPLOAD_URL } from '@/lib/graphql/marquee';
import { MODULE_CONFIGS, type ImageUploadConfig } from '@/components/ui/image-upload-advanced/types';

interface UseMarqueeMediaUploadProps {
  marqueeId: string;
  mediaType: 'desktop' | 'mobile';
  onUploadComplete?: (mediaKey: string) => void;
  onUploadError?: (error: string) => void;
}

export function useMarqueeMediaUpload({
  marqueeId,
  mediaType,
  onUploadComplete,
  onUploadError,
}: UseMarqueeMediaUploadProps) {
  const [generatePresignedUrlMutation] = useMutation(GENERATE_MARQUEE_MEDIA_UPLOAD_URL);

  const configKey = mediaType === 'desktop' ? 'marquee-desktop' : 'marquee-mobile';
  const baseConfig = MODULE_CONFIGS[configKey];

  const config: ImageUploadConfig = {
    minWidth: baseConfig?.minWidth ?? 1920,
    minHeight: baseConfig?.minHeight ?? 600,
    aspectRatio: baseConfig?.aspectRatio,
    maxFileSize: baseConfig?.maxFileSize ?? 10 * 1024 * 1024,
    quality: baseConfig?.quality ?? 0.9,
    allowRotation: baseConfig?.allowRotation ?? false,
    allowZoom: baseConfig?.allowZoom ?? false,
    zoomRange: baseConfig?.zoomRange,
    acceptedFileTypes: baseConfig?.acceptedFileTypes,
    module: 'marquee',
  };

  const handleGeneratePresignedUrl = async (
    fileName: string,
    contentType: string,
    fileSize: number
  ): Promise<{
    uploadUrl: string;
    key: string;
    expiresIn: number;
    maxFileSize: number;
    recommendedDimensions?: {
      width: number;
      height: number;
    };
    allowedFileTypes?: string[];
  }> => {
    try {
      // Determine if it's an image or video based on contentType
      const isImage = contentType.startsWith('image/');
      const actualMediaType = isImage
        ? `${mediaType}_image`
        : `${mediaType}_video`;

      const { data } = await generatePresignedUrlMutation({
        variables: {
          generateMarqueeMediaUploadUrlInput: {
            marqueeId,
            fileName,
            contentType,
            fileSize,
            mediaType: actualMediaType,
          },
        },
      });

      if (!data?.generateMarqueeMediaUploadUrl) {
        throw new Error('Failed to generate upload URL');
      }

      const response = data.generateMarqueeMediaUploadUrl;

      // Transform the response to match expected format
      return {
        uploadUrl: response.uploadUrl,
        key: response.key,
        expiresIn: response.expiresIn,
        maxFileSize: response.maxFileSize,
        // Parse recommendedDimensions from string to object if present
        recommendedDimensions: response.recommendedDimensions
          ? (() => {
              // Try to parse dimensions like "1920x600px" or "1920x600"
              const match = response.recommendedDimensions.match(/(\d+)x(\d+)/);
              if (match) {
                return {
                  width: parseInt(match[1], 10),
                  height: parseInt(match[2], 10),
                };
              }
              return undefined;
            })()
          : undefined,
        allowedFileTypes: undefined,
      };
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw error;
    }
  };

  const handleUploadComplete = (imageKey: string) => {
    if (onUploadComplete) {
      onUploadComplete(imageKey);
    }
  };

  const handleUploadError = (error: string) => {
    if (onUploadError) {
      onUploadError(error);
    }
  };

  return {
    config,
    generatePresignedUrl: handleGeneratePresignedUrl,
    handleUploadComplete,
    handleUploadError,
  };
}
