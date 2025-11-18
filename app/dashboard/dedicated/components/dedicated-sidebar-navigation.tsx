'use client';

import { useMemo } from 'react';
import { Mail, Settings, Send } from 'lucide-react';
import { CreationSidebarNavigation, StepConfig, PreviewCardData } from '@/app/dashboard/shared/components';
import type { Dedicated } from '@/types/dedicated';

interface DedicatedSidebarNavigationProps {
  currentStep: number;
  totalSteps: number;
  dedicated?: Dedicated | null;
  onStepClick?: (stepNumber: number) => void;
  canNavigateToStep?: (stepNumber: number) => boolean;
  className?: string;
  // Edit mode specific props
  isEditMode?: boolean;
  onUpdate?: () => void;
  updateLoading?: boolean;
  hasUnsavedChanges?: boolean;
}

const STEPS: StepConfig[] = [
  {
    id: 1,
    title: 'Basic Information',
    description: 'Campaign details, subject, link and scheduling',
    icon: Mail
  },
  {
    id: 2,
    title: 'Campaign Image',
    description: 'Upload campaign image (700px width minimum)',
    icon: Settings
  }
];

const COLOR_SCHEME = {
  primary: 'blue-500',
  secondary: 'blue-100',
  gradient: 'from-blue-100 to-cyan-100'
};

export function DedicatedSidebarNavigation({
  currentStep,
  totalSteps,
  dedicated,
  onStepClick,
  canNavigateToStep,
  className,
  // Edit mode props
  isEditMode = false,
  onUpdate,
  updateLoading = false,
  hasUnsavedChanges = false
}: DedicatedSidebarNavigationProps) {

  const dedicatedImage = useMemo(() => {
    if (!dedicated) return undefined;

    return dedicated.imageUrl ||
           (dedicated.image && dedicated.image !== 'placeholder' ? dedicated.image : '') ||
           undefined;
  }, [dedicated]);

  const dedicatedSubtitle = useMemo(() => {
    if (!dedicated) return undefined;

    const parts = [];
    if (dedicated.market) parts.push(dedicated.market);
    if (dedicated.status) parts.push(dedicated.status);

    return parts.length > 0 ? parts.join(' • ') : 'Details not set';
  }, [dedicated]);

  const dedicatedStatus = useMemo(() => {
    if (!dedicated?.status) return 'draft';

    switch (dedicated.status) {
      case 'SCHEDULED': return 'scheduled';
      case 'SENT': return 'sent';
      case 'PENDING': return 'pending';
      default: return 'draft';
    }
  }, [dedicated?.status]);

  const previewCard: PreviewCardData = useMemo(() => ({
    title: dedicated?.subject || 'Untitled Campaign',
    subtitle: dedicatedSubtitle,
    status: dedicatedStatus,
    image: dedicatedImage,
    fallbackIcon: Send,
    // Edit mode specific fields
    companyName: dedicated?.company?.name,
    lastUpdated: dedicated?.updatedAt ? new Date(dedicated.updatedAt).toLocaleDateString() : undefined,
    sendDate: dedicated?.sendDate ? new Date(dedicated.sendDate).toLocaleDateString() : undefined
  }), [dedicated, dedicatedSubtitle, dedicatedStatus, dedicatedImage]);

  return (
    <CreationSidebarNavigation
      currentStep={currentStep}
      totalSteps={totalSteps}
      steps={STEPS}
      previewCard={previewCard}
      backLink="/dashboard/dedicated"
      backLinkText="Back to campaigns"
      moduleName="Dedicated Campaign"
      colorScheme={COLOR_SCHEME}
      onStepClick={onStepClick}
      canNavigateToStep={canNavigateToStep}
      className={className}
      // Edit mode props
      isEditMode={isEditMode}
      onUpdate={onUpdate}
      updateLoading={updateLoading}
      hasUnsavedChanges={hasUnsavedChanges}
    />
  );
}
