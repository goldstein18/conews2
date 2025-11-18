import { CropArea, ImageDimensions, ImageValidationResult, ImageUploadConfig } from './types';

/**
 * Load an image and return its dimensions
 */
export const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
};

/**
 * Get image dimensions from a File
 */
export const getImageDimensions = (file: File): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight
      });
    };
    
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    image.src = url;
  });
};

/**
 * Validate image dimensions and file size
 */
export const validateImage = async (
  file: File,
  config: ImageUploadConfig
): Promise<ImageValidationResult> => {
  // Validate file size
  const maxSize = config.maxFileSize || 10 * 1024 * 1024; // Default 10MB
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
      requiredDimensions: { width: config.minWidth, height: config.minHeight }
    };
  }

  // Validate file type
  const allowedTypes = config.acceptedFileTypes || ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please select JPEG, PNG, or WebP images only.',
      requiredDimensions: { width: config.minWidth, height: config.minHeight }
    };
  }

  try {
    const dimensions = await getImageDimensions(file);
    
    // Validate minimum dimensions
    if (dimensions.width < config.minWidth || dimensions.height < config.minHeight) {
      return {
        valid: false,
        error: `Image must be at least ${config.minWidth}x${config.minHeight} pixels. Current: ${dimensions.width}x${dimensions.height}`,
        actualDimensions: dimensions,
        requiredDimensions: { width: config.minWidth, height: config.minHeight }
      };
    }

    return {
      valid: true,
      actualDimensions: dimensions,
      requiredDimensions: { width: config.minWidth, height: config.minHeight }
    };
  } catch {
    return {
      valid: false,
      error: 'Failed to process image',
      requiredDimensions: { width: config.minWidth, height: config.minHeight }
    };
  }
};

/**
 * Convert degrees to radians
 */
export const getRadianAngle = (degreeValue: number): number => {
  return (degreeValue * Math.PI) / 180;
};

/**
 * Calculate the new bounding area after rotation
 */
export const rotateSize = (width: number, height: number, rotation: number) => {
  const rotRad = getRadianAngle(rotation);
  
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
};

/**
 * Create a cropped image from canvas
 */
export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: CropArea,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
  quality = 0.9,
  outputSize?: { width: number; height: number }
): Promise<{ blob: Blob; url: string }> => {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const rotRad = getRadianAngle(rotation);

  // Calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // Set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Draw rotated image
  ctx.drawImage(image, 0, 0);

  // Create a new canvas for the final crop
  const cropCanvas = document.createElement('canvas');
  const cropCtx = cropCanvas.getContext('2d');

  if (!cropCtx) {
    throw new Error('Could not get crop canvas context');
  }

  // Set the crop canvas size - use outputSize if specified, otherwise use crop dimensions
  const finalWidth = outputSize?.width || pixelCrop.width;
  const finalHeight = outputSize?.height || pixelCrop.height;
  
  cropCanvas.width = finalWidth;
  cropCanvas.height = finalHeight;

  // Draw the cropped image, scaling to output size if different from crop size
  cropCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    finalWidth,
    finalHeight
  );

  return new Promise((resolve, reject) => {
    cropCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        
        const url = URL.createObjectURL(blob);
        resolve({ blob, url });
      },
      'image/jpeg',
      quality
    );
  });
};

/**
 * Generate unique filename with timestamp
 */
export const generateUniqueFileName = (originalName: string, module: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const baseName = originalName.split('.').slice(0, -1).join('.');
  
  return `${module}/${baseName}-${timestamp}-${randomString}.${extension}`;
};

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Calculate crop area in pixels from percentage crop
 */
export const getCropAreaInPixels = (
  crop: CropArea,
  imageWidth: number,
  imageHeight: number
): CropArea => {
  return {
    x: Math.round((crop.x / 100) * imageWidth),
    y: Math.round((crop.y / 100) * imageHeight),
    width: Math.round((crop.width / 100) * imageWidth),
    height: Math.round((crop.height / 100) * imageHeight),
  };
};

/**
 * Validate that cropped area meets minimum dimensions
 */
export const validateCroppedDimensions = (
  croppedDimensions: ImageDimensions,
  config: ImageUploadConfig
): { valid: boolean; error?: string } => {
  if (croppedDimensions.width < config.minWidth || croppedDimensions.height < config.minHeight) {
    return {
      valid: false,
      error: `Cropped area must be at least ${config.minWidth}x${config.minHeight} pixels. Current: ${croppedDimensions.width}x${croppedDimensions.height}`
    };
  }
  
  return { valid: true };
};