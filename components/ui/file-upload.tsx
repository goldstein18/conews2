"use client";

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { FilePond, registerPlugin } from 'react-filepond';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Import and register FilePond plugins
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

import { S3UploadService, type PresignedUrlResponse } from '@/lib/services/s3-upload.service';

// Register plugins with error handling for CSP issues
if (typeof window !== 'undefined') {
  registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize,
    FilePondPluginImageResize,
    FilePondPluginImageTransform
  );
}

const fileUploadVariants = cva(
  "file-upload-container",
  {
    variants: {
      variant: {
        default: "w-full",
        avatar: "w-32 h-32 mx-auto",
        logo: "w-full max-w-md"
      },
      shape: {
        default: "rounded-lg",
        circle: "rounded-full",
        square: "rounded-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      shape: "default"
    }
  }
);

export interface FileUploadProps extends VariantProps<typeof fileUploadVariants> {
  onUploadComplete?: (key: string) => void;
  onUploadError?: (error: string) => void;
  generatePresignedUrl: (fileName: string, contentType: string, fileSize: number) => Promise<PresignedUrlResponse>;
  currentImageUrl?: string;
  maxFileSize?: number;
  className?: string;
  disabled?: boolean;
  acceptedFileTypes?: string[];
  label?: string;
  description?: string;
}

export function FileUpload({
  variant,
  shape,
  onUploadComplete,
  onUploadError,
  generatePresignedUrl,
  currentImageUrl,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  className,
  disabled = false,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  label,
  description,
  ...props
}: FileUploadProps) {
  const [files, setFiles] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [isUploading, setIsUploading] = useState(false);

  // Handle file upload process
  const handleProcess = useCallback(
    (
      fieldName: string,
      file: any, // eslint-disable-line @typescript-eslint/no-explicit-any
      metadata: any, // eslint-disable-line @typescript-eslint/no-explicit-any
      load: (p: string) => void,
      error: (errorText: string) => void,
      progress: (computable: boolean, loaded: number, total: number) => void,
      abort: () => void
    ) => {
      const uploadFile = async () => {
        try {
          setIsUploading(true);
          
          // Validate file
          const validation = S3UploadService.validateImageFile(file);
          if (!validation.valid) {
            error(validation.error || 'Invalid file');
            return;
          }

          // Generate unique filename
          const fileName = S3UploadService.generateUniqueFileName(file.name);
          
          // Get presigned URL
          const presignedData = await generatePresignedUrl(
            fileName,
            file.type,
            file.size
          );

          // Upload to S3
          const result = await S3UploadService.uploadFile(file, presignedData);
          
          if (result.success && result.key) {
            // Call success callback
            onUploadComplete?.(result.key);
            load(result.key);
            toast.success('File uploaded successfully');
          } else {
            error(result.error || 'Upload failed');
            onUploadError?.(result.error || 'Upload failed');
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Upload failed';
          error(errorMessage);
          onUploadError?.(errorMessage);
          toast.error('Upload failed');
        } finally {
          setIsUploading(false);
        }
      };

      uploadFile();

      // Return abort function
      return {
        abort: () => {
          abort();
          setIsUploading(false);
        }
      };
    },
    [generatePresignedUrl, onUploadComplete, onUploadError]
  );

  const filePondProps = {
    files,
    onupdatefiles: setFiles,
    allowMultiple: false,
    maxFiles: 1,
    server: { process: handleProcess },
    name: 'file',
    labelIdle: getLabelIdle(),
    acceptedFileTypes,
    maxFileSize: maxFileSize.toString(),
    disabled: disabled || isUploading,
    imageResizeTargetWidth: getImageResizeWidth(),
    imageResizeTargetHeight: getImageResizeHeight(),
    imageResizeMode: 'cover' as const,
    stylePanelAspectRatio: getAspectRatio(),
    allowImageTransform: false, // Disable transform to avoid worker issues
    allowWorkerScripts: false,  // Disable worker scripts for CSP compliance
    ...(variant === 'logo' && {
      stylePanelLayout: 'compact' as const,
    }),
    ...(variant === 'avatar' && { 
      stylePanelLayout: 'compact circle' as const,
      imagePreviewHeight: 128
    }),
    ...(variant === 'logo' && {
      stylePanelLayout: 'compact' as const
    })
  };

  function getLabelIdle(): string {
    if (label) {
      if (description) {
        return `${label}<br/><small style="color: #6B7280; font-weight: normal;">${description}</small>`;
      }
      return label;
    }
    
    const actionText = currentImageUrl ? 'Drag & drop to replace' : 'Drag & drop';
    const supportText = 'or <span class="filepond--label-action">Browse</span>';
    
    if (description) {
      return `${actionText} ${supportText}<br/><small style="color: #6B7280; font-weight: normal;">${description}</small>`;
    }
    
    return `${actionText} ${supportText}`;
  }

  function getImageResizeWidth(): number {
    switch (variant) {
      case 'avatar': return 128;
      case 'logo': return 400;
      default: return 800;
    }
  }

  function getImageResizeHeight(): number {
    switch (variant) {
      case 'avatar': return 128;
      case 'logo': return 400;
      default: return 600;
    }
  }

  function getAspectRatio(): string {
    switch (variant) {
      case 'avatar': return '1:1';
      case 'logo': return '16:9';
      default: return '4:3';
    }
  }

  return (
    <div className={cn(fileUploadVariants({ variant, shape }), className)} {...props}>
      {currentImageUrl && (
        <div className="mb-4 text-center">
          <div className={cn(
            "mx-auto relative border border-gray-200 overflow-hidden bg-gray-50",
            variant === 'avatar' && "w-24 h-24 rounded-full",
            variant === 'logo' && "w-48 h-32 rounded-lg",
            variant === 'default' && "w-48 h-32 rounded-lg"
          )}>
            <Image
              src={currentImageUrl}
              alt="Current"
              fill
              className={cn(
                variant === 'logo' ? "object-contain p-2" : "object-cover"
              )}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">Current image</p>
        </div>
      )}
      
      <FilePond {...filePondProps} />
    </div>
  );
}

// Export for convenience
export { fileUploadVariants };