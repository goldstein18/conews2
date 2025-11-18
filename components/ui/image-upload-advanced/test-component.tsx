'use client';

import { ImageUploadAdvanced } from './image-upload-advanced';
import { useVenueImageUpload } from '@/app/dashboard/venues/hooks/use-venue-image-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ImageUploadTestProps {
  venueId?: string;
}

export function ImageUploadTest({ venueId }: ImageUploadTestProps) {
  const {
    config,
    generatePresignedUrl,
    handleUploadComplete,
    handleUploadError
  } = useVenueImageUpload({
    venueId,
    onUploadComplete: (imageKey) => {
      console.log('Image uploaded successfully:', imageKey);
    },
    onUploadError: (error) => {
      console.error('Image upload error:', error);
    }
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Venue Image Upload Test</CardTitle>
        <p className="text-sm text-muted-foreground">
          Test the advanced image upload component with venue configuration
        </p>
      </CardHeader>
      <CardContent>
        <ImageUploadAdvanced
          config={config}
          generatePresignedUrl={generatePresignedUrl}
          onUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          label="Venue Image"
          description={`Upload a high-quality image for this venue. Minimum size: ${config.minWidth}x${config.minHeight}px`}
        />
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-sm mb-2">Configuration:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>Module: {config.module}</li>
            <li>Min dimensions: {config.minWidth}x{config.minHeight}px</li>
            <li>Aspect ratio: {config.aspectRatio === 1 ? 'Square (1:1)' : config.aspectRatio}</li>
            <li>Max file size: {Math.round((config.maxFileSize || 0) / (1024 * 1024))}MB</li>
            <li>Quality: {Math.round((config.quality || 0.9) * 100)}%</li>
            <li>Zoom range: {config.zoomRange?.join(' - ')}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}