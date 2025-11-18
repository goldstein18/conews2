import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { S3UploadService } from '@/lib/services/s3-upload.service';
import type { CropArea } from '@/components/ui/image-upload-advanced/types';

export interface TemporaryImage {
  id: string;
  blob: Blob;
  dataUrl: string;
  dimensions: { width: number; height: number };
  crop: CropArea;
  zoom: number;
  rotation: number;
  originalFile: File;
  module: string;
  createdAt: number;
}

export interface ImageUploadState {
  // Map of temporary images by ID
  temporaryImages: Map<string, TemporaryImage>;
  
  // Actions
  addTemporaryImage: (imageData: Omit<TemporaryImage, 'id' | 'createdAt'>) => string;
  removeTemporaryImage: (id: string) => void;
  getTemporaryImage: (id: string) => TemporaryImage | undefined;
  updateTemporaryImage: (id: string, updates: Partial<TemporaryImage>) => void;
  clearAllTemporary: () => void;
  clearExpiredImages: () => void;
  uploadPendingImage: (
    id: string, 
    generatePresignedUrl: (fileName: string, contentType: string, fileSize: number) => Promise<any>
  ) => Promise<string>;
  
  // Utilities
  isTemporaryImage: (value: string) => boolean;
  getTemporaryImageCount: () => number;
}

// Helper to generate unique temporary image IDs
const generateTempId = (): string => {
  return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Helper to convert blob to data URL
const blobToDataUrl = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

export const useImageUploadStore = create<ImageUploadState>()(
  persist(
    (set, get) => ({
      temporaryImages: new Map<string, TemporaryImage>(),

      addTemporaryImage: (imageData) => {
        const id = generateTempId();
        const tempImage: TemporaryImage = {
          ...imageData,
          id,
          createdAt: Date.now()
        };

        set((state) => {
          // Handle case where state.temporaryImages might not be a proper Map after hydration
          const currentMap = state.temporaryImages instanceof Map 
            ? state.temporaryImages 
            : new Map(Object.entries(state.temporaryImages || {}) as [string, TemporaryImage][]);
          
          const newMap = new Map(currentMap);
          newMap.set(id, tempImage);
          return { ...state, temporaryImages: newMap };
        });

        console.log(`🖼️ Added temporary image: ${id}`);
        return id;
      },

      removeTemporaryImage: (id) => {
        set((state) => {
          // Handle case where state.temporaryImages might not be a proper Map after hydration
          const currentMap = state.temporaryImages instanceof Map 
            ? state.temporaryImages 
            : new Map(Object.entries(state.temporaryImages || {}) as [string, TemporaryImage][]);
          
          const newMap = new Map(currentMap);
          const image = newMap.get(id);
          
          if (image) {
            // Revoke object URL to free memory
            if (image.dataUrl.startsWith('blob:')) {
              URL.revokeObjectURL(image.dataUrl);
            }
            newMap.delete(id);
            console.log(`🗑️ Removed temporary image: ${id}`);
          }
          
          return { ...state, temporaryImages: newMap };
        });
      },

      getTemporaryImage: (id) => {
        const state = get();
        const currentMap = state.temporaryImages instanceof Map 
          ? state.temporaryImages 
          : new Map(Object.entries(state.temporaryImages || {}) as [string, TemporaryImage][]);
        return currentMap.get(id);
      },

      updateTemporaryImage: (id, updates) => {
        set((state) => {
          // Handle case where state.temporaryImages might not be a proper Map after hydration
          const currentMap = state.temporaryImages instanceof Map 
            ? state.temporaryImages 
            : new Map(Object.entries(state.temporaryImages || {}) as [string, TemporaryImage][]);
          
          const newMap = new Map(currentMap);
          const existing = newMap.get(id);
          
          if (existing) {
            newMap.set(id, { ...existing, ...updates });
          }
          
          return { ...state, temporaryImages: newMap };
        });
      },

      clearAllTemporary: () => {
        const { temporaryImages } = get();
        
        // Handle case where temporaryImages might not be a proper Map after hydration
        const currentMap = temporaryImages instanceof Map 
          ? temporaryImages 
          : new Map(Object.entries(temporaryImages || {}) as [string, TemporaryImage][]);
        
        // Cleanup object URLs
        currentMap.forEach((image) => {
          if (image.dataUrl.startsWith('blob:')) {
            URL.revokeObjectURL(image.dataUrl);
          }
        });

        set({ temporaryImages: new Map<string, TemporaryImage>() });
        console.log('🧹 Cleared all temporary images');
      },

      clearExpiredImages: () => {
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        set((state) => {
          // Handle case where state.temporaryImages might not be a proper Map after hydration
          const currentMap = state.temporaryImages instanceof Map 
            ? state.temporaryImages 
            : new Map(Object.entries(state.temporaryImages || {}) as [string, TemporaryImage][]);
          
          const newMap = new Map<string, TemporaryImage>();
          let removedCount = 0;

          currentMap.forEach((image, id) => {
            if (now - image.createdAt < maxAge) {
              newMap.set(id, image);
            } else {
              // Cleanup expired image
              if (image.dataUrl.startsWith('blob:')) {
                URL.revokeObjectURL(image.dataUrl);
              }
              removedCount++;
            }
          });

          if (removedCount > 0) {
            console.log(`🧹 Removed ${removedCount} expired temporary images`);
          }

          return { ...state, temporaryImages: newMap };
        });
      },

      uploadPendingImage: async (id, generatePresignedUrl) => {
        const image = get().getTemporaryImage(id);
        
        if (!image) {
          throw new Error(`Temporary image not found: ${id}`);
        }

        try {
          console.log(`📤 Uploading temporary image: ${id}`);
          
          // Generate unique filename
          const fileName = S3UploadService.generateModuleFileName(
            image.originalFile.name, 
            image.module
          );
          
          // Get presigned URL - preserve original content type
          const contentType = image.originalFile.type || 'image/jpeg';
          const presignedData = await generatePresignedUrl(
            fileName,
            contentType,
            image.blob.size
          );

          // Upload to S3 - preserve original content type
          const uploadResult = await S3UploadService.uploadFile(
            new File([image.blob], fileName, { type: contentType }),
            presignedData
          );

          if (uploadResult.success && uploadResult.key) {
            // Remove temporary image after successful upload
            get().removeTemporaryImage(id);
            
            console.log(`✅ Successfully uploaded image: ${uploadResult.key}`);
            return uploadResult.key;
          } else {
            throw new Error(uploadResult.error || 'Upload failed');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Upload failed';
          console.error(`❌ Failed to upload temporary image ${id}:`, errorMessage);
          toast.error(`Upload failed: ${errorMessage}`);
          throw error;
        }
      },

      isTemporaryImage: (value) => {
        return typeof value === 'string' && value.startsWith('temp_');
      },

      getTemporaryImageCount: () => {
        const state = get();
        const currentMap = state.temporaryImages instanceof Map 
          ? state.temporaryImages 
          : new Map(Object.entries(state.temporaryImages || {}) as [string, TemporaryImage][]);
        return currentMap.size;
      }
    }),
    {
      name: 'image-upload-storage',
      partialize: (state) => ({
        // Don't persist the actual images, only metadata
        // This prevents memory issues and forces fresh uploads
        temporaryImages: new Map<string, TemporaryImage>()
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Clear any expired images on app start
          state.clearExpiredImages();
        }
      }
    }
  )
);