'use client';

import { useMemo } from 'react';
import { CreationMobileNavigation, MobileStepConfig } from '@/app/dashboard/shared/components';
import type { Dedicated } from '@/types/dedicated';

interface DedicatedMobileNavigationProps {
  currentStep: number;
  totalSteps: number;
  dedicated?: Dedicated | null;
  onBack?: () => void;
  className?: string;
  // Edit mode specific props
  isEditMode?: boolean;
  onUpdate?: () => void;
  updateLoading?: boolean;
  hasUnsavedChanges?: boolean;
}

const STEPS: MobileStepConfig[] = [
  { id: 1, title: 'Basic Information' },
  { id: 2, title: 'Campaign Image' }
];

const COLOR_SCHEME = {
  primary: 'blue-500',
  secondary: 'blue-100'
};

export function DedicatedMobileNavigation({
  currentStep,
  totalSteps,
  dedicated,
  onBack,
  className,
  // Edit mode props
  isEditMode = false,
  onUpdate,
  updateLoading = false,
  hasUnsavedChanges = false
}: DedicatedMobileNavigationProps) {

  const dedicatedStatus = useMemo(() => {
    if (!dedicated?.status) return 'draft';

    switch (dedicated.status) {
      case 'SCHEDULED': return 'active';
      case 'SENT': return 'approved';
      case 'PENDING': return 'pending';
      default: return 'draft';
    }
  }, [dedicated?.status]);

  return (
    <CreationMobileNavigation
      currentStep={currentStep}
      totalSteps={totalSteps}
      steps={STEPS}
      entityTitle={dedicated?.subject}
      entityStatus={dedicatedStatus}
      colorScheme={COLOR_SCHEME}
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
