'use client';

import { CreationMobileNavigation, MobileStepConfig } from '@/app/dashboard/shared/components';
import type { NewsArticle } from '@/types/news';

interface NewsMobileNavigationProps {
  currentStep: number;
  totalSteps: number;
  news?: NewsArticle | null;
  onBack?: () => void;
  className?: string;
  // Edit mode specific props
  isEditMode?: boolean;
  onUpdate?: () => void;
  updateLoading?: boolean;
  hasUnsavedChanges?: boolean;
}

export function NewsMobileNavigation({
  currentStep,
  totalSteps,
  news,
  onBack,
  className,
  // Edit mode props
  isEditMode = false,
  onUpdate,
  updateLoading = false,
  hasUnsavedChanges = false
}: NewsMobileNavigationProps) {

  const steps: MobileStepConfig[] = [
    { id: 1, title: 'Basic Information' },
    { id: 2, title: 'Advanced Details' }
  ];

  const getNewsStatus = () => {
    if (!news?.status) return 'draft';

    switch (news.status.toUpperCase()) {
      case 'APPROVED': return 'approved';
      case 'PENDING': return 'pending';
      case 'DECLINED': return 'rejected';
      case 'DRAFT':
      default: return 'draft';
    }
  };

  return (
    <CreationMobileNavigation
      currentStep={currentStep}
      totalSteps={totalSteps}
      steps={steps}
      entityTitle={news?.title}
      entityStatus={getNewsStatus()}
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
