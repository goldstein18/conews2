'use client';

import { Palette, Settings, Building } from 'lucide-react';
import { CreationSidebarNavigation, StepConfig, PreviewCardData } from '@/app/dashboard/shared/components';
import type { ArtsGroup } from '@/types/arts-groups';

interface ArtsGroupSidebarNavigationProps {
  currentStep: number;
  totalSteps: number;
  artsGroup?: ArtsGroup | null;
  onStepClick?: (stepNumber: number) => void;
  canNavigateToStep?: (stepNumber: number) => boolean;
  className?: string;
  // Edit mode specific props
  isEditMode?: boolean;
  onUpdate?: () => void;
  updateLoading?: boolean;
  hasUnsavedChanges?: boolean;
  onStatusChange?: (newStatus: string) => void;
}

export function ArtsGroupSidebarNavigation({
  currentStep,
  totalSteps,
  artsGroup,
  onStepClick,
  canNavigateToStep,
  className,
  // Edit mode props
  isEditMode = false,
  onUpdate,
  updateLoading = false,
  hasUnsavedChanges = false,
  onStatusChange
}: ArtsGroupSidebarNavigationProps) {

  const steps: StepConfig[] = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Add arts group name, description, location and contact details',
      icon: Building
    },
    {
      id: 2,
      title: 'Advanced Details',
      description: 'Upload arts group image and add additional information',
      icon: Settings
    }
  ];

  const getArtsGroupImage = () => {
    if (!artsGroup) return undefined;

    // Follow the priority logic: imageUrl -> image (S3 key)
    return artsGroup.imageUrl ||
           (artsGroup.image && artsGroup.image !== 'placeholder' ? artsGroup.image : '') ||
           undefined;
  };

  const getArtsGroupSubtitle = () => {
    if (!artsGroup) return undefined;

    const parts = [];
    if (artsGroup.market) parts.push(artsGroup.market);
    if (artsGroup.artType) parts.push(artsGroup.artType);

    return parts.length > 0 ? parts.join(' • ') : 'Details not set';
  };

  const getArtsGroupStatus = () => {
    if (!artsGroup?.status) return 'draft';

    switch (artsGroup.status) {
      case 'APPROVED': return 'approved';
      case 'PENDING': return 'pending';
      case 'DECLINED': return 'rejected';
      default: return 'draft';
    }
  };

  const previewCard: PreviewCardData = {
    title: artsGroup?.name || 'Untitled Arts Group',
    subtitle: getArtsGroupSubtitle(),
    status: getArtsGroupStatus(),
    image: getArtsGroupImage(),
    fallbackIcon: Palette,
    // Edit mode specific fields
    companyName: artsGroup?.company?.name,
    lastUpdated: artsGroup?.updatedAt ? new Date(artsGroup.updatedAt).toLocaleDateString() : undefined
  };

  return (
    <CreationSidebarNavigation
      currentStep={currentStep}
      totalSteps={totalSteps}
      steps={steps}
      previewCard={previewCard}
      backLink="/dashboard/arts-groups"
      backLinkText="Back to arts groups"
      moduleName="Arts Group"
      colorScheme={{
        primary: 'purple-500',
        secondary: 'purple-100',
        gradient: 'from-purple-100 to-pink-100'
      }}
      onStepClick={onStepClick}
      canNavigateToStep={canNavigateToStep}
      className={className}
      // Edit mode props
      isEditMode={isEditMode}
      onUpdate={onUpdate}
      updateLoading={updateLoading}
      hasUnsavedChanges={hasUnsavedChanges}
      // Status toggle props
      currentStatus={artsGroup?.status}
      onStatusChange={onStatusChange}
      entityType="arts group"
    />
  );
}
