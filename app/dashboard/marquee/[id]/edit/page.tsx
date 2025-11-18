'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProtectedPage } from '@/components/protected-page';
import { MarqueeEditForm } from './components';
import { useMarquee, useMarqueeActions } from '../../hooks';
import { MarqueeSkeleton } from '../../components';
import { useImageUploadStore } from '@/store/image-upload-store';
import type { MarqueeEditFormData } from '../../lib/validations';
import type { UpdateMarqueeInput } from '@/types/marquee';

export default function EditMarqueePage() {
  return (
    <ProtectedPage requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
      <EditMarqueePageContent />
    </ProtectedPage>
  );
}

function EditMarqueePageContent() {
  const router = useRouter();
  const params = useParams();
  const marqueeId = params.id as string;

  const { updateMarquee } = useMarqueeActions();
  const { marquee, loading: marqueeLoading, error } = useMarquee(marqueeId);
  const imageUploadStore = useImageUploadStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: MarqueeEditFormData) => {
    try {
      setIsSubmitting(true);

      // Handle temporary image uploads FIRST
      const finalDesktopImage = data.desktopImage;
      const finalMobileImage = data.mobileImage;

      // Upload any temporary desktop image
      if (data.desktopImage && imageUploadStore.isTemporaryImage(data.desktopImage)) {
        // We need the upload function - this will be handled by the form component
        console.log('Desktop image needs upload:', data.desktopImage);
      }

      // Upload any temporary mobile image
      if (data.mobileImage && imageUploadStore.isTemporaryImage(data.mobileImage)) {
        console.log('Mobile image needs upload:', data.mobileImage);
      }

      // Prepare update input
      const updateInput: UpdateMarqueeInput = {
        id: marqueeId,
        name: data.name,
        link: data.link,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        market: data.market,
        buttonText: data.buttonText || undefined,
        buttonColor: data.buttonColor || undefined,
        buttonFontWeight: data.buttonFontWeight || undefined,
      };

      // Add media if changed
      if (finalDesktopImage && finalDesktopImage !== marquee?.desktopImage) {
        updateInput.desktopImage = finalDesktopImage;
      }
      if (finalMobileImage && finalMobileImage !== marquee?.mobileImage) {
        updateInput.mobileImage = finalMobileImage;
      }

      await updateMarquee(updateInput);

      // Redirect back to marquees list
      router.push('/dashboard/marquee');
    } catch (error) {
      console.error('Update marquee error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (marqueeLoading) {
    return <MarqueeSkeleton />;
  }

  // Error state
  if (error || !marquee) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Error Loading Marquee
            </h1>
            <p className="text-sm text-muted-foreground">
              Unable to load the marquee for editing
            </p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertDescription>
            {error?.message ||
              'The marquee could not be found or you do not have permission to edit it.'}
          </AlertDescription>
        </Alert>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Edit Marquee</h1>
            <p className="text-sm text-muted-foreground">
              Update marquee settings and media
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <MarqueeEditForm marquee={marquee} onSubmit={handleSubmit} loading={isSubmitting} />

      {/* Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="container max-w-5xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                const form = document.querySelector('form');
                if (form) {
                  form.requestSubmit();
                }
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Updating Marquee...
                </>
              ) : (
                'Update Marquee'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
