import { toast } from "sonner";

export interface S3UploadResult {
  success: boolean;
  key?: string;
  error?: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
  maxFileSize: number;
  recommendedDimensions?: {
    width: number;
    height: number;
  };
}

export class S3UploadService {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  /**
   * Upload file to S3 using presigned URL
   */
  static async uploadFile(
    file: File,
    presignedData: PresignedUrlResponse
  ): Promise<S3UploadResult> {
    const { uploadUrl, key } = presignedData;

    // Validate file size
    if (file.size > presignedData.maxFileSize) {
      const maxSizeMB = Math.round(presignedData.maxFileSize / (1024 * 1024));
      toast.error(`File size exceeds ${maxSizeMB}MB limit`);
      return { 
        success: false, 
        error: `File size exceeds ${maxSizeMB}MB limit` 
      };
    }

    return this.uploadWithRetry(file, uploadUrl, key, 0);
  }

  /**
   * Upload with retry logic
   */
  private static async uploadWithRetry(
    file: File,
    uploadUrl: string,
    key: string,
    attempt: number
  ): Promise<S3UploadResult> {
    try {
      console.log('📡 S3UploadService: Starting upload attempt', {
        attempt: attempt + 1,
        uploadUrl,
        key,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
      
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      
      console.log('📡 S3UploadService: Upload response received', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      return { success: true, key };
    } catch (error) {
      console.error(`S3 upload attempt ${attempt + 1} failed:`, error);
      
      if (attempt < this.MAX_RETRIES - 1) {
        // Wait before retrying
        await this.delay(this.RETRY_DELAY * (attempt + 1));
        return this.uploadWithRetry(file, uploadUrl, key, attempt + 1);
      }

      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      toast.error(`Upload failed: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Utility function to delay execution
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate file type for images
   */
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Please select JPEG, PNG, or WebP images only.'
      };
    }

    return { valid: true };
  }

  /**
   * Get file size in human readable format
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Generate unique filename with timestamp
   */
  static generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    const baseName = originalName.split('.').slice(0, -1).join('.');
    
    return `${baseName}-${timestamp}-${randomString}.${extension}`;
  }

  /**
   * Generate unique filename with module path prefix
   */
  static generateModuleFileName(originalName: string, module: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    const baseName = originalName.split('.').slice(0, -1).join('.');
    
    // Sanitize module name for security
    const sanitizedModule = module.replace(/[^a-zA-Z0-9-_]/g, '');
    
    return `${sanitizedModule}/${baseName}-${timestamp}-${randomString}.${extension}`;
  }

  /**
   * Validate image dimensions
   */
  static async validateImageDimensions(
    file: File,
    minWidth: number,
    minHeight: number
  ): Promise<{ valid: boolean; error?: string; dimensions?: { width: number; height: number } }> {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      
      image.onload = () => {
        URL.revokeObjectURL(url);
        const dimensions = {
          width: image.naturalWidth,
          height: image.naturalHeight
        };
        
        if (dimensions.width < minWidth || dimensions.height < minHeight) {
          resolve({
            valid: false,
            error: `Image must be at least ${minWidth}x${minHeight} pixels. Current: ${dimensions.width}x${dimensions.height}`,
            dimensions
          });
        } else {
          resolve({ valid: true, dimensions });
        }
      };
      
      image.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          valid: false,
          error: 'Failed to load image'
        });
      };
      
      image.src = url;
    });
  }
}