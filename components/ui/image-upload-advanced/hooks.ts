'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ImageUploadConfig, ImageValidationResult, CroppedImageData } from './types';
import { validateImage } from './utils';
import { useImageUploadStore } from '@/store/image-upload-store';

export function useImageValidation() {
  const [validationResult, setValidationResult] = useState<ImageValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateImageFile = useCallback(async (file: File, config: ImageUploadConfig) => {
    setIsValidating(true);
    try {
      const result = await validateImage(file, config);
      setValidationResult(result);
      return result;
    } catch {
      const errorResult: ImageValidationResult = {
        valid: false,
        error: 'Failed to validate image',
        requiredDimensions: { width: config.minWidth, height: config.minHeight }
      };
      setValidationResult(errorResult);
      return errorResult;
    } finally {
      setIsValidating(false);
    }
  }, []);

  return {
    validationResult,
    isValidating,
    validateImageFile,
    clearValidation: () => setValidationResult(null)
  };
}

export function useImageCrop() {
  const [croppedData, setCroppedData] = useState<CroppedImageData | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const startCropping = useCallback(() => {
    setIsCropping(true);
  }, []);

  const saveCrop = useCallback((data: CroppedImageData) => {
    setCroppedData(data);
    setIsCropping(false);
  }, []);

  const cancelCrop = useCallback(() => {
    setIsCropping(false);
  }, []);

  const clearCrop = useCallback(() => {
    setCroppedData(null);
    setIsCropping(false);
  }, []);

  return {
    croppedData,
    isCropping,
    startCropping,
    saveCrop,
    cancelCrop,
    clearCrop
  };
}

interface UseImageUploadProps {
  config: ImageUploadConfig;
  generatePresignedUrl: (fileName: string, contentType: string, fileSize: number) => Promise<{
    uploadUrl: string;
    key: string;
    expiresIn: number;
    maxFileSize: number;
  }>;
  onUploadComplete?: (key: string, croppedData: CroppedImageData) => void;
  onUploadError?: (error: string) => void;
}

export function useImageUpload({
  config,
  generatePresignedUrl,
  onUploadComplete,
  onUploadError
}: UseImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [temporaryImageId, setTemporaryImageId] = useState<string | null>(null);

  const { validateImageFile, validationResult, isValidating } = useImageValidation();
  const { croppedData, isCropping, startCropping, saveCrop, cancelCrop, clearCrop } = useImageCrop();
  const imageUploadStore = useImageUploadStore();

  const clearFile = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (temporaryImageId) {
      imageUploadStore.removeTemporaryImage(temporaryImageId);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setTemporaryImageId(null);
    clearCrop();
  }, [previewUrl, temporaryImageId, imageUploadStore, clearCrop]);

  const selectFile = useCallback(async (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    
    // Validate the file
    const validation = await validateImageFile(file, config);
    
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid image file');
      return false;
    }
    
    return true;
  }, [config, validateImageFile]);

  const saveCroppedImageTemporarily = useCallback(async (croppedImageData: CroppedImageData) => {
    if (!selectedFile) {
      toast.error('No file selected');
      return;
    }

    try {
      console.log('💾 Saving cropped image temporarily...');
      
      // Convert blob to data URL for preview
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(croppedImageData.blob);
      });

      // Save to temporary store
      const tempId = imageUploadStore.addTemporaryImage({
        blob: croppedImageData.blob,
        dataUrl,
        dimensions: croppedImageData.dimensions,
        crop: croppedImageData.crop,
        zoom: croppedImageData.zoom,
        rotation: croppedImageData.rotation,
        originalFile: selectedFile,
        module: config.module
      });

      setTemporaryImageId(tempId);
      
      // Notify parent component with temporary ID
      onUploadComplete?.(tempId, croppedImageData);
      
      toast.success('Image prepared successfully');
      console.log(`💾 Image saved temporarily with ID: ${tempId}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to prepare image';
      console.error('Failed to save temporary image:', error);
      toast.error(errorMessage);
      onUploadError?.(errorMessage);
    }
  }, [selectedFile, config.module, imageUploadStore, onUploadComplete, onUploadError]);

  const handleCropSave = useCallback((data: CroppedImageData) => {
    saveCrop(data);
    // Save cropped image temporarily instead of uploading to S3
    saveCroppedImageTemporarily(data);
  }, [saveCrop, saveCroppedImageTemporarily]);

  // Function to actually upload a temporary image to S3
  const uploadTemporaryImage = useCallback(async (tempId: string) => {
    try {
      setIsUploading(true);
      setUploadProgress(25);
      
      const s3Key = await imageUploadStore.uploadPendingImage(tempId, generatePresignedUrl);
      
      setUploadProgress(100);
      setIsUploading(false);
      
      return s3Key;
    } catch (error) {
      setIsUploading(false);
      throw error;
    }
  }, [imageUploadStore, generatePresignedUrl]);

  return {
    // File selection
    selectedFile,
    previewUrl,
    selectFile,
    clearFile,
    
    // Validation
    validationResult,
    isValidating,
    validateImageFile,
    
    // Cropping
    croppedData,
    isCropping,
    startCropping,
    handleCropSave,
    cancelCrop,
    
    // Temporary image management
    temporaryImageId,
    uploadTemporaryImage,
    
    // Upload states
    isUploading,
    uploadProgress,
    
    // Combined states
    isProcessing: isValidating || isUploading
  };
}