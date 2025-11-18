'use client';

import { Calendar, Ticket, Globe } from 'lucide-react';
import { CreationSidebarNavigation, StepConfig, PreviewCardData } from '@/app/dashboard/shared/components/creation-sidebar-navigation';

interface EventSidebarNavigationProps {
  currentStep: number;
  totalSteps: number;
  eventTitle?: string;
  eventDate?: string;
  eventStatus?: 'draft' | 'published' | 'pending' | 'approved';
  eventImage?: string;
  onStepClick?: (stepNumber: number) => void;
  canNavigateToStep?: (stepNumber: number) => boolean;
  className?: string;
  // Edit mode props
  isEditMode?: boolean;
  onUpdate?: () => void;
  updateLoading?: boolean;
  hasUnsavedChanges?: boolean;
  onStatusChange?: (status: string) => void;
  event?: {
    id: string;
    status?: string;
  };
}

/**
 * Map event status to sidebar status format for badge display
 */
function mapEventStatus(status?: string): PreviewCardData['status'] {
  if (!status) return 'draft';
  const normalized = status.toUpperCase();
  if (normalized === 'APPROVED') return 'approved';
  if (normalized === 'PENDING' || normalized === 'PENDING_REVIEW') return 'pending';
  if (normalized === 'REJECTED' || normalized === 'SUSPENDED' || normalized === 'DELETED') return 'rejected';
  if (normalized === 'DRAFT') return 'draft';
  return 'draft';
}


export function EventSidebarNavigation({
  currentStep,
  totalSteps,
  eventTitle,
  eventDate,
  eventStatus,
  eventImage,
  onStepClick,
  canNavigateToStep,
  className,
  // Edit mode props
  isEditMode = false,
  onUpdate,
  updateLoading = false,
  hasUnsavedChanges = false,
  onStatusChange,
  event
}: EventSidebarNavigationProps) {

  const steps: StepConfig[] = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Add event title, summary, description and categories',
      icon: Calendar
    },
    {
      id: 2,
      title: 'Date & Location',
      description: 'Set up your event dates, times, and location details',
      icon: Ticket
    },
    {
      id: 3,
      title: 'Media & Details',
      description: 'Add media, lineup, agenda, and additional information',
      icon: Globe
    }
  ];

  const previewCard: PreviewCardData = {
    title: eventTitle || 'Untitled Event',
    subtitle: eventDate || 'No date set',
    status: mapEventStatus(eventStatus || event?.status),
    image: eventImage,
    fallbackIcon: Calendar
  };

  return (
    <CreationSidebarNavigation
      currentStep={currentStep}
      totalSteps={totalSteps}
      steps={steps}
      previewCard={previewCard}
      backLink="/dashboard/events"
      backLinkText="Back to events"
      moduleName="Event"
      colorScheme={{
        primary: 'orange-500',
        secondary: 'orange-100',
        gradient: 'from-orange-100 to-red-100'
      }}
      onStepClick={onStepClick}
      canNavigateToStep={canNavigateToStep}
      className={className}
      // Edit mode props
      isEditMode={isEditMode}
      onUpdate={onUpdate}
      updateLoading={updateLoading}
      hasUnsavedChanges={hasUnsavedChanges}
      // Status selector props
      currentStatus={event?.status || 'DRAFT'}
      onStatusChange={onStatusChange}
      entityType="event"
    />
  );
}