'use client';

import { Eye, Send } from 'lucide-react';
import { CreationSidebarNavigation, StepConfig, PreviewCardData } from '@/app/dashboard/shared/components';
import type { Dedicated } from '@/types/dedicated';

interface DedicatedSidebarNavigationProps {
  currentSection: string;
  dedicated?: Dedicated | null;
  onSectionClick?: (section: string) => void;
  className?: string;
}

export function DedicatedSidebarNavigation({
  currentSection,
  dedicated,
  onSectionClick,
  className
}: DedicatedSidebarNavigationProps) {

  const sections: StepConfig[] = [
    {
      id: 1,
      title: 'Email Preview',
      description: 'Preview your dedicated campaign email',
      icon: Eye
    },
    {
      id: 2,
      title: 'Campaign Management',
      description: 'Create and send your Brevo campaign',
      icon: Send
    }
  ];

  const getCurrentStepNumber = () => {
    switch (currentSection) {
      case 'preview':
        return 1;
      case 'campaign':
        return 2;
      default:
        return 1;
    }
  };

  const handleStepClick = (stepId: number) => {
    if (onSectionClick) {
      switch (stepId) {
        case 1:
          onSectionClick('preview');
          break;
        case 2:
          onSectionClick('campaign');
          break;
      }
    }
  };

  const previewCard: PreviewCardData = {
    title: dedicated?.subject || 'Dedicated Campaign',
    subtitle: dedicated?.market ? `Market: ${dedicated.market.toUpperCase()}` : undefined,
    status: dedicated?.status as PreviewCardData['status'] || 'pending',
    image: (dedicated?.imageUrl && dedicated.imageUrl !== 'placeholder') ? dedicated.imageUrl : undefined,
    companyName: dedicated?.company?.name,
    sendDate: dedicated?.sendDate
      ? new Date(dedicated.sendDate).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })
      : undefined
  };

  return (
    <CreationSidebarNavigation
      currentStep={getCurrentStepNumber()}
      totalSteps={2}
      steps={sections}
      previewCard={previewCard}
      backLink="/dashboard/dedicated"
      backLinkText="Back to Dedicated"
      moduleName="Dedicated Campaign Builder"
      colorScheme={{
        primary: 'purple-500',
        secondary: 'purple-100',
        gradient: 'from-purple-100 to-pink-100'
      }}
      onStepClick={handleStepClick}
      canNavigateToStep={() => true}
      className={className}
    />
  );
}
