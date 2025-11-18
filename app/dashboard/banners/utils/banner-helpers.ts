import { BannerType } from '@/types/banners';
import { MODULE_CONFIGS } from '@/components/ui/image-upload-advanced/types';

export interface BannerDimensionInfo {
  label: string;
  dimensions: string;
  description: string;
}

/**
 * Get banner dimension information from MODULE_CONFIGS
 * @param bannerType The banner type
 * @returns Formatted banner dimension info
 */
export function getBannerDimensions(bannerType: BannerType): BannerDimensionInfo {
  const configKey = `banners-${bannerType.toLowerCase()}`;
  const config = MODULE_CONFIGS[configKey] || MODULE_CONFIGS.banners;
  
  // Format dimensions from config
  const dimensions = config?.minWidth && config?.minHeight 
    ? `${config.minWidth}×${config.minHeight}px`
    : 'Various';

  switch (bannerType) {
    case BannerType.ROS:
      return { 
        label: 'ROS Banner', 
        dimensions, 
        description: 'Run of Site' 
      };
    case BannerType.PREMIUM:
      return { 
        label: 'Premium Banner', 
        dimensions, 
        description: 'Premium placement' 
      };
    case BannerType.BLUE:
      return { 
        label: 'Blue Banner', 
        dimensions, 
        description: 'Blue pages' 
      };
    case BannerType.GREEN:
      return { 
        label: 'Green Banner', 
        dimensions, 
        description: 'Green pages' 
      };
    case BannerType.RED:
      return { 
        label: 'Red Banner', 
        dimensions, 
        description: 'Red pages' 
      };
    case BannerType.ESCOOP:
      return { 
        label: 'Escoop Banner', 
        dimensions, 
        description: 'Escoop network' 
      };
    default:
      return { 
        label: 'Banner', 
        dimensions: 'Various', 
        description: 'Standard banner' 
      };
  }
}

/**
 * Get all banner dimensions for display purposes
 * @returns Array of banner dimension info for all types
 */
export function getAllBannerDimensions(): Array<BannerDimensionInfo & { type: BannerType }> {
  const bannerTypes: BannerType[] = [
    BannerType.ROS, 
    BannerType.PREMIUM, 
    BannerType.BLUE, 
    BannerType.GREEN, 
    BannerType.RED, 
    BannerType.ESCOOP
  ];
  
  return bannerTypes.map(type => ({
    type,
    ...getBannerDimensions(type)
  }));
}

/**
 * Get MODULE_CONFIG key for a banner type
 * @param bannerType The banner type
 * @returns The config key for MODULE_CONFIGS
 */
export function getBannerConfigKey(bannerType: BannerType): string {
  return `banners-${bannerType.toLowerCase()}`;
}