'use client';

import { CreationMobileNavigation, MobileStepConfig } from '@/app/dashboard/shared/components';
import type { Venue } from '@/types/venues';

interface VenueMobileNavigationProps {
  currentStep: number;
  totalSteps: number;
  venue?: Venue | null;
  onBack?: () => void;
  className?: string;
  // Edit mode specific props
  isEditMode?: boolean;
  onUpdate?: () => void;
  updateLoading?: boolean;
  hasUnsavedChanges?: boolean;
}

export function VenueMobileNavigation({
  currentStep,
  totalSteps,
  venue,
  onBack,
  className,
  // Edit mode props
  isEditMode = false,
  onUpdate,
  updateLoading = false,
  hasUnsavedChanges = false
}: VenueMobileNavigationProps) {
  
  const steps: MobileStepConfig[] = [
    { id: 1, title: 'Basic Information' },
    { id: 2, title: 'Advanced Details' }
  ];

  const getVenueStatus = () => {
    if (!venue?.status) return 'draft';
    
    switch (venue.status.toLowerCase()) {
      case 'approved': return 'approved';
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
      entityTitle={venue?.name}
      entityStatus={getVenueStatus()}
      colorScheme={{
        primary: 'blue-500',
        secondary: 'blue-100'
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