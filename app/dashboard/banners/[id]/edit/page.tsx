'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProtectedPage } from '@/components/protected-page';

import { 
  BannerEditFormSkeleton 
} from '../../components';
import { BannerEditWizard } from './components';
import { useBanner } from '../../hooks/use-banners-data';
import { useBannerActions } from '../../hooks/use-banner-actions';

import type { BannerEditFormData } from '../../lib/validations';

export default function EditBannerPage() {
  return (
    <ProtectedPage 
      requiredRoles={['SUPER_ADMIN', 'ADMIN', 'CALENDAR_MEMBER', 'DINNING_MEMBER']}
    >
      <EditBannerPageContent />
    </ProtectedPage>
  );
}

function EditBannerPageContent() {
  const router = useRouter();
  const params = useParams();
  const bannerId = params.id as string;
  
  const { 
    updateBanner,
    updateBannerImage
  } = useBannerActions();
  const { banner, loading: bannerLoading, error } = useBanner(bannerId);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: unknown) => {
    const formData = data as BannerEditFormData;
    try {
      setIsSubmitting(true);

      // Prepare the update data (excluding companyId and image)
      const updateInput = {
        bannerId: bannerId,
        name: formData.name,
        link: formData.link,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        market: formData.market,
        zoneId: formData.zoneId
      };

      console.log('🔍 Update input:', updateInput);

      // Update the banner (basic fields only)
      await updateBanner(updateInput);

      // Handle image update separately if image changed
      if (formData.image && formData.image !== banner?.image) {
        await updateBannerImage({
          bannerId: bannerId,
          imageKey: formData.image
        });
      }
      
      // Redirect back to the banners list
      router.push('/dashboard/banners');
    } catch (error) {
      console.error('Update banner error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (bannerLoading) {
    return <BannerEditFormSkeleton />;
  }

  // Error state
  if (error || !banner) {
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
            <h1 className="text-2xl font-semibold tracking-tight">Error Loading Banner</h1>
            <p className="text-sm text-muted-foreground">
              Unable to load the banner for editing
            </p>
          </div>
        </div>
        
        <Alert variant="destructive">
          <AlertDescription>
            {error?.message || 'The banner could not be found or you do not have permission to edit it.'}
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
    <BannerEditWizard
      banner={banner}
      onSubmit={handleSubmit}
      loading={isSubmitting}
    />
  );
}