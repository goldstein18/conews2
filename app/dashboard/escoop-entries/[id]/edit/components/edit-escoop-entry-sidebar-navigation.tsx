'use client';

import { Mail, Calendar, Edit } from 'lucide-react';
import { CreationSidebarNavigation, StepConfig, PreviewCardData } from '@/app/dashboard/shared/components';
import type { EscoopEntry, EscoopSearchResult, EventFullData } from '@/types/escoop-entries';

interface EditEscoopEntrySidebarNavigationProps {
  currentStep: number;
  totalSteps: number;
  selectedEscoop?: EscoopSearchResult | null;
  selectedEvent?: EventFullData | null;
  companyName?: string;
  escoopEntry: EscoopEntry;
  onStepClick?: (stepNumber: number) => void;
  canNavigateToStep?: (stepNumber: number) => boolean;
  className?: string;
}

export function EditEscoopEntrySidebarNavigation({
  currentStep,
  totalSteps,
  selectedEscoop,
  selectedEvent,
  companyName,
  escoopEntry,
  onStepClick,
  canNavigateToStep,
  className
}: EditEscoopEntrySidebarNavigationProps) {

  const steps: StepConfig[] = [
    {
      id: 1,
      title: 'Edit Entry',
      description: 'Update escoop, event, locations, and status',
      icon: Edit
    }
  ];

  const getPreviewTitle = () => {
    if (selectedEvent) {
      return selectedEvent.title;
    }
    if (escoopEntry.event) {
      return escoopEntry.event.title;
    }
    if (selectedEscoop) {
      return `Entry for ${selectedEscoop.name}`;
    }
    return `Entry for ${escoopEntry.escoop.name}`;
  };

  const getPreviewSubtitle = () => {
    const escoopName = selectedEscoop?.name || escoopEntry.escoop.name;
    const remaining = selectedEscoop?.remaining || escoopEntry.escoop.remaining;

    if (selectedEvent || escoopEntry.event) {
      return `${escoopName} • Event selected`;
    }
    return `${escoopName} • ${remaining} slots remaining`;
  };

  const getPreviewStatus = (): 'draft' | 'active' | 'pending' | 'approved' | 'rejected' => {
    switch (escoopEntry.status) {
      case 'PENDING':
        return 'pending';
      case 'APPROVED':
        return 'approved';
      case 'DECLINED':
        return 'rejected';
      case 'DELETED':
        return 'rejected';
      case 'EXPIRED':
        return 'rejected';
      default:
        return 'draft';
    }
  };

  const getPreviewImage = () => {
    if (selectedEvent?.mainImageUrl) {
      return selectedEvent.mainImageUrl;
    }
    if (escoopEntry.event?.mainImageUrl) {
      return escoopEntry.event.mainImageUrl;
    }
    return undefined;
  };

  const previewCard: PreviewCardData = {
    title: getPreviewTitle(),
    subtitle: getPreviewSubtitle(),
    status: getPreviewStatus(),
    image: getPreviewImage(),
    fallbackIcon: selectedEvent || escoopEntry.event ? Calendar : Mail,
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
      moduleName="Edit Escoop Entry"
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