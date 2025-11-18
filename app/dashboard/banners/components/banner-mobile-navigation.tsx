'use client';

import { CreationMobileNavigation, MobileStepConfig } from '@/app/dashboard/shared/components';
import type { Banner } from '@/types/banners';

interface BannerMobileNavigationProps {
  currentStep: number;
  totalSteps: number;
  banner?: Banner | null;
  onBack?: () => void;
  isEditMode?: boolean;
  onUpdate?: () => void;
  updateLoading?: boolean;
  hasUnsavedChanges?: boolean;
  className?: string;
}

export function BannerMobileNavigation({
  currentStep,
  totalSteps,
  banner,
  onBack,
  isEditMode,
  onUpdate,
  updateLoading,
  hasUnsavedChanges,
  className
}: BannerMobileNavigationProps) {
  
  const steps: MobileStepConfig[] = [
    { id: 1, title: 'Campaign Details' },
    { id: 2, title: 'Upload Banner' }
  ];

  const getBannerStatus = () => {
    if (!banner?.status) return 'draft';
    
    switch (banner.status.toLowerCase()) {
      case 'approved': return 'approved';
      case 'active': return 'active';
      case 'pending': 
      case 'pending_review': return 'pending';
      case 'rejected': return 'rejected';
      case 'draft':
      default: return 'draft';
    }
  };

  return (
    <CreationMobileNavigation
      currentStep={currentStep}
      totalSteps={totalSteps}
      steps={steps}
      entityTitle={banner?.name}
      entityStatus={getBannerStatus()}
      colorScheme={{
        primary: 'purple-500',
        secondary: 'purple-100'
      }}
      onBack={onBack}
      isEditMode={isEditMode}
      onUpdate={onUpdate}
      updateLoading={updateLoading}
      hasUnsavedChanges={hasUnsavedChanges}
      className={className}
    />
  );
}