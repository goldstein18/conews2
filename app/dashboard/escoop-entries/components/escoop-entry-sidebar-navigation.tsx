'use client';

import { Mail, Calendar } from 'lucide-react';
import { CreationSidebarNavigation, StepConfig, PreviewCardData } from '@/app/dashboard/shared/components';
import type { EscoopSearchResult, EventSearchResult } from '@/types/escoop-entries';

interface EscoopEntrySidebarNavigationProps {
  currentStep: number;
  totalSteps: number;
  selectedEscoop?: EscoopSearchResult | null;
  selectedEvent?: EventSearchResult | null;
  companyName?: string;
  onStepClick?: (stepNumber: number) => void;
  canNavigateToStep?: (stepNumber: number) => boolean;
  className?: string;
}

export function EscoopEntrySidebarNavigation({
  currentStep,
  totalSteps,
  selectedEscoop,
  selectedEvent,
  companyName,
  onStepClick,
  canNavigateToStep,
  className
}: EscoopEntrySidebarNavigationProps) {

  const steps: StepConfig[] = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Select escoop, event, and target locations',
      icon: Mail
    }
  ];

  const getPreviewTitle = () => {
    if (selectedEvent) {
      return selectedEvent.title;
    }
    if (selectedEscoop) {
      return `Entry for ${selectedEscoop.name}`;
    }
    return 'New Escoop Entry';
  };

  const getPreviewSubtitle = () => {
    if (selectedEscoop && selectedEvent) {
      return `${selectedEscoop.name} • Event selected`;
    }
    if (selectedEscoop) {
      return `${selectedEscoop.name} • ${selectedEscoop.remaining} slots remaining`;
    }
    return 'No escoop selected';
  };

  const getPreviewStatus = (): 'draft' | 'active' | 'pending' | 'approved' | 'rejected' => {
    if (selectedEvent && selectedEscoop) {
      return 'pending';
    }
    return 'draft';
  };

  const previewCard: PreviewCardData = {
    title: getPreviewTitle(),
    subtitle: getPreviewSubtitle(),
    status: getPreviewStatus(),
    image: selectedEvent?.mainImageUrl,
    fallbackIcon: selectedEvent ? Calendar : Mail,
    companyName: companyName
  };

  return (
    <CreationSidebarNavigation
      currentStep={currentStep}
      totalSteps={totalSteps}
      steps={steps}
      previewCard={previewCard}
      backLink="/dashboard/escoop-entries"
      backLinkText="Back to escoop entries"
      moduleName="Escoop Entry"
      colorScheme={{
        primary: 'blue-500',
        secondary: 'blue-100',
        gradient: 'from-blue-100 to-indigo-100'
      }}
      onStepClick={onStepClick}
      canNavigateToStep={canNavigateToStep}
      className={className}
    />
  );
}