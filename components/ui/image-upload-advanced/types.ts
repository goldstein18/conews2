export interface ImageUploadConfig {
  minWidth: number;
  minHeight: number;
  aspectRatio?: number; // Optional: 1 for square, 16/9 for landscape
  maxFileSize?: number; // in bytes
  quality?: number; // 0-1 for compression
  allowRotation?: boolean;
  allowZoom?: boolean;
  zoomRange?: [number, number]; // [min, max] zoom levels
  acceptedFileTypes?: string[];
  module: string; // e.g., 'venues', 'events', 'restaurants', 'banners'
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface CroppedImageData {
  blob: Blob;
  url: string;
  dimensions: ImageDimensions;
  crop: CropArea;
  zoom: number;
  rotation: number;
}

export interface ImageUploadAdvancedProps {
  config: ImageUploadConfig;
  onUploadComplete?: (key: string, croppedData: CroppedImageData) => void;
  onUploadError?: (error: string) => void;
  onRemove?: () => void; // Handler personalizado para remoción
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
  currentImageUrl?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  description?: string;
}

export interface ImageCropModalProps {
  imageUrl: string;
  config: ImageUploadConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedData: CroppedImageData) => void;
  onCancel: () => void;
}

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  actualDimensions?: ImageDimensions;
  requiredDimensions: ImageDimensions;
}

// Predefined configurations for different modules
export const MODULE_CONFIGS: Record<string, Partial<ImageUploadConfig>> = {
  venues: {
    minWidth: 1080,
    minHeight: 1080,
    aspectRatio: 1,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    quality: 0.9,
    allowRotation: true,
    allowZoom: true,
    zoomRange: [1, 3],
    module: 'venues'
  },
  events: {
    minWidth: 1080,
    minHeight: 1080,
    aspectRatio: 1,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    quality: 0.9,
    allowRotation: true,
    allowZoom: true,
    zoomRange: [1, 3],
    module: 'events'
  },
  restaurants: {
    minWidth: 1080,
    minHeight: 1080,
    aspectRatio: 1,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    quality: 0.9,
    allowRotation: true,
    allowZoom: true,
    zoomRange: [1, 3],
    module: 'restaurants'
  },
  // Banner configurations by type
  'banners-ros': {
    minWidth: 300,
    minHeight: 600,
    aspectRatio: 1 / 2,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    quality: 0.9,
    allowRotation: false,  // No image manipulation for banners
    allowZoom: false,      // No zoom
    module: 'banners'
  },
  'banners-premium': {
    minWidth: 970,  // Default to 728x90, will be configurable
    minHeight: 250,
    aspectRatio: 97 / 25,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    quality: 0.9,
    allowRotation: false,
    allowZoom: false,
    module: 'banners'
  },
  'banners-blue': {
    minWidth: 350,
    minHeight: 350,
    aspectRatio: 1 / 1,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    quality: 0.9,
    allowRotation: false,
    allowZoom: false,
    module: 'banners'
  },
  'banners-green': {
    minWidth: 970,
    minHeight: 250,
    aspectRatio: 97 / 25,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    quality: 0.9,
    allowRotation: false,
    allowZoom: false,
    module: 'banners'
  },
  'banners-red': {
    minWidth: 300,
    minHeight: 600,
    aspectRatio: 300 / 600,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    quality: 0.9,
    allowRotation: false,
    allowZoom: false,
    module: 'banners'
  },
  'banners-escoop': {
    minWidth: 970,
    minHeight: 250,
    aspectRatio: 97 / 25,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    quality: 0.9,
    allowRotation: false,
    allowZoom: false,
    module: 'banners'
  },
  // Legacy banner config (keep for backward compatibility)
  banners: {
    minWidth: 970,
    minHeight: 250,
    aspectRatio: 970 / 250,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    quality: 0.9,
    allowRotation: false,  // No image manipulation for banners
    allowZoom: false,      // No zoom
    module: 'banners'
  },
  profile: {
    minWidth: 400,
    minHeight: 400,
    aspectRatio: 1,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    quality: 0.8,
    allowRotation: true,
    allowZoom: true,
    zoomRange: [1, 2],
    module: 'profile'
  },
  news: {
    minWidth: 1200,
    minHeight: 628,
    aspectRatio: 1200 / 628, // ~1.91:1 - standard news hero image ratio
    maxFileSize: 10 * 1024 * 1024, // 10MB
    quality: 0.9,
    allowRotation: true,
    allowZoom: true,
    zoomRange: [1, 3],
    module: 'news'
  },
  'arts-groups': {
    minWidth: 1080,
    minHeight: 1080,
    aspectRatio: 1,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    quality: 0.9,
    allowRotation: true,
    allowZoom: true,
    zoomRange: [1, 3],
    module: 'arts-groups'
  },
  dedicated: {
    minWidth: 700,
    minHeight: 100,  // Any height is acceptable, minimum 100px
    aspectRatio: undefined, // No aspect ratio constraint - accept any proportions
    maxFileSize: 10 * 1024 * 1024, // 10MB
    quality: 1, // No compression - keep original quality
    allowRotation: false, // No rotation needed - upload original image
    allowZoom: false, // No zoom - disable cropping interface
    module: 'dedicated'
  },
  // Marquee configurations
  'marquee-desktop': {
    minWidth: 1920,
    minHeight: 600,
    aspectRatio: 1920 / 600, // 3.2:1 aspect ratio
    maxFileSize: 10 * 1024 * 1024, // 10MB for images
    quality: 0.9,
    allowRotation: false,  // No manipulation for marquee
    allowZoom: false,
    module: 'marquee'
  },
  'marquee-mobile': {
    minWidth: 768,
    minHeight: 432,
    aspectRatio: 768 / 432, // 16:9 aspect ratio (approximately)
    maxFileSize: 10 * 1024 * 1024, // 10MB for images
    quality: 0.9,
    allowRotation: false,  // No manipulation for marquee
    allowZoom: false,
    module: 'marquee'
  }
};