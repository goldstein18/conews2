'use client';

import { useMutation } from '@apollo/client';
import { GENERATE_BANNER_UPLOAD_URL } from '@/lib/graphql/banners';
import { MODULE_CONFIGS } from '@/components/ui/image-upload-advanced/types';
import type { ImageUploadConfig } from '@/components/ui/image-upload-advanced/types';
import type { BannerType } from '@/types/banners';

interface UseBannerImageUploadProps {
  bannerId: string;
  bannerType?: BannerType | null;
  onUploadComplete?: (imageKey: string) => void;
  onUploadError?: (error: string) => void;
}

interface UseBannerImageUploadReturn {
  config: ImageUploadConfig;
  generatePresignedUrl: (fileName: string, contentType: string, fileSize: number) => Promise<{
    uploadUrl: string;
    key: string;
    expiresIn: number;
    maxFileSize: number;
    recommendedDimensions?: {
      width: number;
      height: number;
    };
    allowedFileTypes?: string[];
  }>;
  handleUploadComplete: (imageKey: string) => void;
  handleUploadError: (error: string) => void;
}

export function useBannerImageUpload({
  bannerId,
  bannerType,
  onUploadComplete,
  onUploadError
}: UseBannerImageUploadProps): UseBannerImageUploadReturn {
  const [generateBannerUploadUrlMutation] = useMutation(GENERATE_BANNER_UPLOAD_URL);

  // Get banner-specific configuration based on type from MODULE_CONFIGS
  const getBannerConfig = (): ImageUploadConfig => {
    const configKey = bannerType ? `banners-${bannerType.toLowerCase()}` : 'banners';
    const baseConfig = MODULE_CONFIGS[configKey] || MODULE_CONFIGS.banners;
    
    return {
      ...baseConfig,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      quality: 0.9,
      allowRotation: false,  // No image manipulation for banners
      allowZoom: false,      // No zoom
      module: 'banners'
    } as ImageUploadConfig;
  };

  const config = getBannerConfig();

  const handleGeneratePresignedUrl = async (
    fileName: string, 
    contentType: string, 
    fileSize: number
  ) => {
    try {
      const { data } = await generateBannerUploadUrlMutation({
        variables: {
          input: {
            bannerId,
            fileName,
            contentType,
            fileSize
          }
        }
      });

      if (!data?.generateBannerUploadUrl) {
        throw new Error('Failed to generate upload URL');
      }

      const response = data.generateBannerUploadUrl;
      
      return {
        uploadUrl: response.uploadUrl,
        key: response.key,
        expiresIn: response.expiresIn,
        maxFileSize: response.maxFileSize,
        recommendedDimensions: response.recommendedDimensions,
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp']
      };
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw new Error('Failed to generate upload URL');
    }
  };

  const handleUploadComplete = (imageKey: string) => {
    console.log('✅ Banner image uploaded successfully:', imageKey);
    if (onUploadComplete) {
      onUploadComplete(imageKey);
    }
  };

  const handleUploadError = (error: string) => {
    console.error('❌ Banner image upload failed:', error);
    if (onUploadError) {
      onUploadError(error);
    }
  };

  return {
    config,
    generatePresignedUrl: handleGeneratePresignedUrl,
    handleUploadComplete,
    handleUploadError
  };
}