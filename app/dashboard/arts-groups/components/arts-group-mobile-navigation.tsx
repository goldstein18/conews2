'use client';

import { CreationMobileNavigation, MobileStepConfig } from '@/app/dashboard/shared/components';
import type { ArtsGroup } from '@/types/arts-groups';

interface ArtsGroupMobileNavigationProps {
  currentStep: number;
  totalSteps: number;
  artsGroup?: ArtsGroup | null;
  onBack?: () => void;
  className?: string;
  // Edit mode specific props
  isEditMode?: boolean;
  onUpdate?: () => void;
  updateLoading?: boolean;
  hasUnsavedChanges?: boolean;
}

export function ArtsGroupMobileNavigation({
  currentStep,
  totalSteps,
  artsGroup,
  onBack,
  className,
  // Edit mode props
  isEditMode = false,
  onUpdate,
  updateLoading = false,
  hasUnsavedChanges = false
}: ArtsGroupMobileNavigationProps) {

  const steps: MobileStepConfig[] = [
    { id: 1, title: 'Basic Information' },
    { id: 2, title: 'Advanced Details' }
  ];

  const getArtsGroupStatus = () => {
    if (!artsGroup?.status) return 'draft';

    switch (artsGroup.status) {
      case 'APPROVED': return 'approved';
      case 'PENDING': return 'pending';
      case 'DECLINED': return 'rejected';
      default: return 'draft';
    }
  };

  return (
    <CreationMobileNavigation
      currentStep={currentStep}
      totalSteps={totalSteps}
      steps={steps}
      entityTitle={artsGroup?.name}
      entityStatus={getArtsGroupStatus()}
      colorScheme={{
        primary: 'purple-500',
        secondary: 'purple-100'
      }}
      onBack={onBack}
      className={className}
      // Edit mode props
      isEditMode={isEditMode}
      onUpdate={onUpdate}
      updateLoading={updateLoading}
      hasUnsavedChanges={hasUnsavedChanges}
    />
  );
}
