'use client';

import { useCallback, useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Edit3, X, Image as ImageIcon, RotateCw, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageUploadAdvancedProps, CropArea, Point, CroppedImageData } from './types';
import { useImageUpload } from './hooks';
import { formatFileSize, getCroppedImg } from './utils';
import { useImageUploadStore } from '@/store/image-upload-store';
import Cropper from 'react-easy-crop';
import { Slider } from '@/components/ui/slider';

export function ImageUploadAdvanced({
  config,
  onUploadComplete,
  onUploadError,
  onRemove,
  generatePresignedUrl,
  currentImageUrl,
  disabled = false,
  className,
  label,
  description,
  ...props
}: ImageUploadAdvancedProps) {
  const imageUploadStore = useImageUploadStore();
  
  // Inline cropping state
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [isProcessingCrop, setIsProcessingCrop] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [initialZoomSet, setInitialZoomSet] = useState(false);
  
  const {
    selectedFile,
    previewUrl,
    selectFile,
    clearFile,
    validationResult,
    isValidating,
    validateImageFile,
    croppedData,
    temporaryImageId,
    isUploading,
    uploadProgress,
    isProcessing
  } = useImageUpload({
    config,
    generatePresignedUrl,
    onUploadComplete,
    onUploadError
  });

  // Check if current value is a temporary image
  const isTemporaryImage = currentImageUrl && imageUploadStore.isTemporaryImage(currentImageUrl);
  const temporaryImage = isTemporaryImage ? imageUploadStore.getTemporaryImage(currentImageUrl) : null;

  // Inline cropping handlers
  const startCropping = useCallback(() => {
    setIsCropping(true);
    setInitialZoomSet(false);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setRotation(0);
    setCroppedAreaPixels(null);
    setImageDimensions(null);
  }, []);

  const cancelCrop = useCallback(() => {
    setIsCropping(false);
    setInitialZoomSet(false);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setRotation(0);
    setCroppedAreaPixels(null);
    setImageDimensions(null);
  }, []);

  const onMediaLoaded = useCallback((mediaSize: { width: number; height: number }) => {
    setImageDimensions(mediaSize);
    console.log('📐 Image dimensions loaded:', mediaSize);
    
    // Start with zoom = 1 always - this shows the full image
    // The crop area will be determined by the aspect ratio (1:1 for squares)
    // and will always result in the minimum required dimensions when cropped
    if (!initialZoomSet) {
      setZoom(1);
      setInitialZoomSet(true);
      console.log(`🎯 Setting initial zoom to 1 - crop area will be constrained by aspect ratio to maintain ${config.minWidth}x${config.minHeight}px output`);
    }
  }, [config.minWidth, config.minHeight, initialZoomSet]);

  const onCropComplete = useCallback(
    (_croppedArea: CropArea, croppedAreaPixels: CropArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleZoomChange = useCallback((value: number[]) => {
    setZoom(value[0]);
  }, []);

  const handleRotateLeft = useCallback(() => {
    setRotation((prev) => prev - 90);
  }, []);

  const handleRotateRight = useCallback(() => {
    setRotation((prev) => prev + 90);
  }, []);

  const handleCropSave = useCallback(async () => {
    if (!croppedAreaPixels || !previewUrl) return;

    try {
      setIsProcessingCrop(true);

      // Since we're scaling to exact output dimensions, we don't need to validate
      // the crop size - any square crop will be scaled to 1080x1080px
      console.log(`🎯 Cropping ${Math.round(croppedAreaPixels.width)}x${Math.round(croppedAreaPixels.height)}px area and scaling to ${config.minWidth}x${config.minHeight}px`);

      // Create cropped image - always resize to exact minimum dimensions
      const { blob, url } = await getCroppedImg(
        previewUrl,
        croppedAreaPixels,
        rotation,
        { horizontal: false, vertical: false },
        config.quality || 0.9,
        { width: config.minWidth, height: config.minHeight } // Force exact output size
      );

      const croppedImageData: CroppedImageData = {
        blob,
        url,
        dimensions: {
          width: config.minWidth,  // Always the final output dimensions
          height: config.minHeight
        },
        crop: croppedAreaPixels,
        zoom,
        rotation
      };

      // Store the cropped data in the image upload hook
      const temporaryId = imageUploadStore.addTemporaryImage({
        dataUrl: url,
        blob,
        originalFile: selectedFile!,
        dimensions: croppedImageData.dimensions,
        crop: croppedAreaPixels,
        zoom,
        rotation,
        module: config.module
      });

      onUploadComplete?.(temporaryId, croppedImageData);
      setIsCropping(false);
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Failed to crop image. Please try again.');
    } finally {
      setIsProcessingCrop(false);
    }
  }, [croppedAreaPixels, previewUrl, rotation, zoom, config, selectedFile, imageUploadStore, onUploadComplete]);

  // Calculate minimum zoom to ensure we can always get the required minimum dimensions
  const calculateMinZoom = useCallback(() => {
    if (!imageDimensions) return 1;
    
    const { width: imageWidth, height: imageHeight } = imageDimensions;
    const { minWidth, minHeight } = config;
    
    // With aspect ratio = 1, react-easy-crop will maintain a square crop area
    // The minimum zoom should ensure that even at minimum zoom, we get at least our required dimensions
    // Since we're using aspect ratio = 1, the crop will always be square
    // We need: min(imageWidth, imageHeight) / zoom >= max(minWidth, minHeight)
    // So: zoom <= min(imageWidth, imageHeight) / max(minWidth, minHeight)
    
    const minImageDimension = Math.min(imageWidth, imageHeight);
    const maxRequiredDimension = Math.max(minWidth, minHeight);
    
    // For square crops, both width and height will be the same
    // The actual crop size will be: minImageDimension / zoom
    // We want this to be at least our minimum requirement
    const maxAllowedZoom = minImageDimension / maxRequiredDimension;
    
    // Set minimum zoom to 1 (shows full image) but cap at maxAllowedZoom if image is too small
    const finalMinZoom = 1;
    const finalMaxZoom = Math.max(maxAllowedZoom, 1);
    
    console.log('🔍 Zoom range calculation:', {
      imageSize: imageDimensions,
      required: { minWidth, minHeight },
      minImageDimension,
      maxRequiredDimension,
      maxAllowedZoom: maxAllowedZoom.toFixed(3),
      finalMinZoom,
      finalMaxZoom: finalMaxZoom.toFixed(3),
      cropSizeAtMinZoom: `${Math.round(minImageDimension/finalMinZoom)}x${Math.round(minImageDimension/finalMinZoom)}`,
      cropSizeAtMaxZoom: `${Math.round(minImageDimension/finalMaxZoom)}x${Math.round(minImageDimension/finalMaxZoom)}`
    });
    
    return finalMinZoom;
  }, [imageDimensions, config]);

  const minZoom = calculateMinZoom();
  const maxZoom = config.zoomRange?.[1] || 3;

  // Adjust zoom when image dimensions are loaded or minZoom changes
  useEffect(() => {
    if (imageDimensions && zoom < minZoom && initialZoomSet) {
      console.log(`🔍 Adjusting zoom from ${zoom} to ${minZoom} (minimum required)`);
      setZoom(minZoom);
    }
  }, [imageDimensions, minZoom, zoom, initialZoomSet]);

  // Handle direct upload without cropping (for banners and dedicated)
  const handleDirectUpload = useCallback(async (file: File) => {
    try {
      // Validate image dimensions using the hook
      const validationResult = await validateImageFile(file, config);

      if (!validationResult.valid) {
        onUploadError?.(validationResult.error || 'Invalid image');
        return;
      }

      // For banners (with aspectRatio defined), require exact dimensions
      // For dedicated (aspectRatio undefined), only minimum dimensions are checked by validateImageFile
      if (config.aspectRatio !== undefined && validationResult.actualDimensions) {
        const { width, height } = validationResult.actualDimensions;
        if (width !== config.minWidth || height !== config.minHeight) {
          const error = `Image must be exactly ${config.minWidth}×${config.minHeight}px. Found: ${width}×${height}px`;
          onUploadError?.(error);
          return;
        }
      }
      
      // Create blob from file (no processing needed)
      const actualDimensions = validationResult.actualDimensions || { width: config.minWidth, height: config.minHeight };
      const croppedImageData: CroppedImageData = {
        blob: file,
        url: URL.createObjectURL(file),
        dimensions: actualDimensions,
        crop: { x: 0, y: 0, width: actualDimensions.width, height: actualDimensions.height },
        zoom: 1,
        rotation: 0
      };
      
      // Store directly in temporary storage
      const temporaryId = imageUploadStore.addTemporaryImage({
        dataUrl: URL.createObjectURL(file),
        blob: file,
        originalFile: file,
        dimensions: actualDimensions,
        crop: croppedImageData.crop,
        zoom: 1,
        rotation: 0,
        module: config.module
      });
      
      onUploadComplete?.(temporaryId, croppedImageData);
    } catch (error) {
      console.error('Error in direct upload:', error);
      onUploadError?.('Failed to process image');
    }
  }, [config, imageUploadStore, onUploadComplete, onUploadError, validateImageFile]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      selectFile(file);
      
      // Check if cropping is needed (when zoom or rotation is allowed)
      if (config.allowZoom || config.allowRotation) {
        // Start cropping automatically when a file is selected
        setTimeout(() => {
          startCropping();
        }, 100); // Small delay to allow file processing
      } else {
        // For banners or other non-cropping uploads, validate and upload directly
        setTimeout(() => {
          handleDirectUpload(file);
        }, 100);
      }
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  }, [selectFile, startCropping, config.allowZoom, config.allowRotation, handleDirectUpload]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      selectFile(file);
      
      // Check if cropping is needed (when zoom or rotation is allowed)
      if (config.allowZoom || config.allowRotation) {
        // Start cropping automatically when a file is dropped
        setTimeout(() => {
          startCropping();
        }, 100); // Small delay to allow file processing
      } else {
        // For banners or other non-cropping uploads, validate and upload directly
        setTimeout(() => {
          handleDirectUpload(file);
        }, 100);
      }
    }
  }, [selectFile, startCropping, config.allowZoom, config.allowRotation, handleDirectUpload]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  // Helper function to check if a URL is valid for image display
  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url || url === 'placeholder') return false;
    try {
      new URL(url);
      return true;
    } catch {
      return url.startsWith('data:') || url.startsWith('blob:');
    }
  };

  const displayImageUrl = croppedData?.url || previewUrl || temporaryImage?.dataUrl || (isValidImageUrl(currentImageUrl) ? currentImageUrl : undefined);
  const hasValidFile = selectedFile && validationResult?.valid;
  const hasPendingImage = temporaryImageId || isTemporaryImage;

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Label and Description */}
      {(label || description) && (
        <div className="mb-3">
          {label && (
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}

      {/* Upload Area */}
      <Card className={cn(
        "relative overflow-hidden transition-colors",
        disabled && "opacity-50 cursor-not-allowed"
      )}>
        <CardContent className="p-0">
          {/* Progress Bar */}
          {isUploading && (
            <div className="absolute top-0 left-0 right-0 z-10">
              <Progress value={uploadProgress} className="h-1 rounded-none" />
            </div>
          )}

          {/* Image Preview or Cropping Interface */}
          {displayImageUrl ? (
            <div className="space-y-4">
              {isCropping && previewUrl ? (
                /* Inline Cropping Interface */
                <div className="space-y-4">
                  {/* Cropper Area */}
                  <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                    <Cropper
                      image={previewUrl}
                      crop={crop}
                      zoom={zoom}
                      rotation={rotation}
                      aspect={config.aspectRatio}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                      onRotationChange={setRotation}
                      onMediaLoaded={onMediaLoaded}
                      minZoom={minZoom}
                      maxZoom={maxZoom}
                      showGrid={true}
                      style={{
                        containerStyle: {
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#f3f4f6'
                        }
                      }}
                    />
                  </div>

                  {/* Cropping Controls */}
                  <div className="space-y-4">
                    {/* Zoom Control */}
                    {config.allowZoom && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Zoom</Label>
                          <div className="flex items-center space-x-1">
                            <ZoomOut className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                              {Math.round(zoom * 100)}%
                            </span>
                            <ZoomIn className="h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                        <Slider
                          value={[zoom]}
                          onValueChange={handleZoomChange}
                          max={maxZoom}
                          min={minZoom}
                          step={0.1}
                          className="w-full"
                          disabled={!imageDimensions}
                        />
                      </div>
                    )}

                    {/* Rotation Control */}
                    {config.allowRotation && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Rotation</Label>
                        <div className="flex items-center justify-center space-x-4">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRotateLeft}
                            disabled={isProcessingCrop}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Rotate Left
                          </Button>
                          <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                            {rotation}°
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRotateRight}
                            disabled={isProcessingCrop}
                          >
                            <RotateCw className="h-4 w-4 mr-1" />
                            Rotate Right
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Dimension Info */}
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium">Required minimum:</span>{' '}
                          {config.minWidth} × {config.minHeight}px
                        </div>
                        <div>
                          <span className="font-medium">Current crop:</span>{' '}
                          <span className="text-green-600">
                            {config.minWidth} × {config.minHeight}px
                          </span>
                          {croppedAreaPixels && (
                            <span className="text-gray-500 text-xs ml-1">
                              (from {Math.round(croppedAreaPixels.width)} × {Math.round(croppedAreaPixels.height)}px area)
                            </span>
                          )}
                        </div>
                      </div>
                      {imageDimensions && (
                        <div className="mt-2">
                          <span className="font-medium">Original image:</span>{' '}
                          {imageDimensions.width} × {imageDimensions.height}px
                        </div>
                      )}
                      <div className="mt-2">
                        <span className="font-medium">Zoom:</span>{' '}
                        {Math.round(zoom * 100)}% 
                        <span className="text-xs text-gray-500 ml-1">
                          (range: {Math.round(minZoom * 100)}% - {Math.round(maxZoom * 100)}%)
                        </span>
                      </div>
                      
                      {/* Status message */}
                      {imageDimensions && (
                        <div className="mt-3 p-2 rounded border-l-4 border-l-blue-500 bg-blue-50">
                          <div className="text-xs text-blue-800">
                            {imageDimensions.width === config.minWidth && imageDimensions.height === config.minHeight ? (
                              <span>📏 Image is exactly minimum size - no cropping needed</span>
                            ) : imageDimensions.width < config.minWidth || imageDimensions.height < config.minHeight ? (
                              <span>⚠️ Image is smaller than minimum required size</span>
                            ) : (
                              <span>✂️ Use zoom and drag to select the area you want to crop</span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-2">
                        <span className="text-green-600 font-medium">✓ Output will be scaled to {config.minWidth}×{config.minHeight}px</span>
                      </div>
                    </div>

                    {/* Cropping Actions */}
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelCrop}
                        disabled={isProcessingCrop}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCropSave}
                        disabled={isProcessingCrop || !croppedAreaPixels}
                      >
                        {isProcessingCrop ? 'Processing...' : 'Apply Crop'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Image Preview */
                <div className="relative group">
                  <div className="aspect-square w-full max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden relative">
                    <Image
                      src={displayImageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={true}
                    />
                  </div>
                  
                  {/* Pending Upload Indicator */}
                  {hasPendingImage && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium border border-yellow-200">
                        Pending Upload
                      </div>
                    </div>
                  )}

                  {/* Image Actions */}
                  {(hasValidFile || displayImageUrl) && !isProcessing && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex space-x-2">
                        {/* Edit button only for selected files */}
                        {hasValidFile && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={startCropping}
                            disabled={disabled}
                          >
                            <Edit3 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        )}
                        {/* Remove button for any displayed image */}
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={onRemove || clearFile}
                          disabled={disabled}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Upload Drop Zone */
            <div
              className={cn(
                "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors",
                !disabled && "cursor-pointer",
                isProcessing && "pointer-events-none"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => !disabled && !isProcessing && document.getElementById('image-upload-input')?.click()}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <ImageIcon className="h-8 w-8 text-gray-600" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">
                    Drop your image here
                  </p>
                  <p className="text-sm text-gray-600">
                    or <span className="text-blue-600 hover:text-blue-800">browse files</span>
                  </p>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>Minimum size: {config.minWidth} × {config.minHeight}px</p>
                  <p>Maximum size: {formatFileSize(config.maxFileSize || 10 * 1024 * 1024)}</p>
                  <p>Formats: JPEG, PNG, WebP</p>
                </div>
              </div>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            id="image-upload-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || isProcessing}
          />
        </CardContent>
      </Card>

      {/* File Info */}
      {selectedFile && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-gray-600">{formatFileSize(selectedFile.size)}</p>
            </div>
            
            {validationResult && (
              <div className={cn(
                "px-2 py-1 rounded text-xs font-medium",
                validationResult.valid 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              )}>
                {validationResult.valid ? 'Valid' : 'Invalid'}
              </div>
            )}
          </div>

          {validationResult?.actualDimensions && (
            <div className="mt-2 text-gray-600">
              Dimensions: {validationResult.actualDimensions.width} × {validationResult.actualDimensions.height}px
            </div>
          )}

          {validationResult && !validationResult.valid && (
            <div className="mt-2 text-red-600 text-xs">
              {validationResult.error}
            </div>
          )}
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="mt-3 flex items-center justify-center space-x-2 text-sm text-gray-600">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          <span>
            {isValidating && 'Validating image...'}
            {isUploading && `Uploading... ${uploadProgress}%`}
          </span>
        </div>
      )}

      {/* Pending Upload Message */}
      {hasPendingImage && !isProcessing && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-blue-800">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>Image will be uploaded when you save the form</span>
          </div>
        </div>
      )}

    </div>
  );
}