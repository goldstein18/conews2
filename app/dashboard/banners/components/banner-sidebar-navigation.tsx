'use client';

import { Image, Calendar } from 'lucide-react';
import { CreationSidebarNavigation, StepConfig, PreviewCardData } from '@/app/dashboard/shared/components';
import type { Banner } from '@/types/banners';

interface BannerSidebarNavigationProps {
  currentStep: number;
  totalSteps: number;
  banner?: Banner | null;
  onStepClick?: (stepNumber: number) => void;
  canNavigateToStep?: (stepNumber: number) => boolean;
  isEditMode?: boolean;
  onUpdate?: () => void;
  updateLoading?: boolean;
  hasUnsavedChanges?: boolean;
  className?: string;
}

export function BannerSidebarNavigation({
  currentStep,
  totalSteps,
  banner,
  onStepClick,
  canNavigateToStep,
  isEditMode,
  onUpdate,
  updateLoading,
  hasUnsavedChanges,
  className
}: BannerSidebarNavigationProps) {
  
  const steps: StepConfig[] = [
    {
      id: 1,
      title: 'Campaign Details',
      description: 'Set campaign name, dates, target market and link',
      icon: Calendar
    },
    {
      id: 2,
      title: 'Upload Banner',
      description: 'Upload banner image and finalize campaign',
      icon: Image
    }
  ];

  const getBannerImage = () => {
    if (!banner) return undefined;
    
    // Use imageUrl if available, otherwise use the image field (S3 key)
    return banner.imageUrl || 
           (banner.image && banner.image !== 'placeholder' ? banner.image : '') || 
           undefined;
  };

  const getBannerSubtitle = () => {
    if (!banner) return undefined;
    
    const parts = [];
    if (banner.market) parts.push(banner.market);
    if (banner.startDate && banner.endDate) {
      const startDate = new Date(banner.startDate).toLocaleDateString();
      const endDate = new Date(banner.endDate).toLocaleDateString();
      parts.push(`${startDate} - ${endDate}`);
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'No campaign dates set';
  };

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

  const previewCard: PreviewCardData = {
    title: banner?.name || 'Untitled Banner Campaign',
    subtitle: getBannerSubtitle(),
    status: getBannerStatus(),
    image: getBannerImage(),
    fallbackIcon: Image
  };

  return (
    <CreationSidebarNavigation
      currentStep={currentStep}
      totalSteps={totalSteps}
      steps={steps}
      previewCard={previewCard}
      backLink="/dashboard/banners"
      backLinkText="Back to banners"
      moduleName="Banner"
      colorScheme={{
        primary: 'purple-500',
        secondary: 'purple-100',
        gradient: 'from-purple-100 to-pink-100'
      }}
      onStepClick={onStepClick}
      canNavigateToStep={canNavigateToStep}
      isEditMode={isEditMode}
      onUpdate={onUpdate}
      updateLoading={updateLoading}
      hasUnsavedChanges={hasUnsavedChanges}
      className={className}
    />
  );
}