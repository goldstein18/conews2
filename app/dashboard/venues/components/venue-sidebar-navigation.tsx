'use client';

import { MapPin, Settings, Building } from 'lucide-react';
import { CreationSidebarNavigation, StepConfig, PreviewCardData } from '@/app/dashboard/shared/components';
import type { Venue } from '@/types/venues';

interface VenueSidebarNavigationProps {
  currentStep: number;
  totalSteps: number;
  venue?: Venue | null;
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

export function VenueSidebarNavigation({
  currentStep,
  totalSteps,
  venue,
  onStepClick,
  canNavigateToStep,
  className,
  // Edit mode props
  isEditMode = false,
  onUpdate,
  updateLoading = false,
  hasUnsavedChanges = false,
  onStatusChange
}: VenueSidebarNavigationProps) {
  
  const steps: StepConfig[] = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Add venue name, description, location and contact details',
      icon: Building
    },
    {
      id: 2,
      title: 'Advanced Details',
      description: 'Upload venue image and add additional information',
      icon: Settings
    }
  ];

  const getVenueImage = () => {
    if (!venue) return undefined;
    
    // Follow the priority logic: imageUrl -> imageBigUrl -> image (S3 key)
    return venue.imageUrl || 
           venue.imageBigUrl || 
           (venue.image && venue.image !== 'placeholder' ? venue.image : '') || 
           undefined;
  };

  const getVenueSubtitle = () => {
    if (!venue) return undefined;
    
    const parts = [];
    if (venue.city) parts.push(venue.city);
    if (venue.state) parts.push(venue.state);
    
    return parts.length > 0 ? parts.join(', ') : 'Location not set';
  };

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

  const previewCard: PreviewCardData = {
    title: venue?.name || 'Untitled Venue',
    subtitle: getVenueSubtitle(),
    status: getVenueStatus(),
    image: getVenueImage(),
    fallbackIcon: MapPin,
    // Edit mode specific fields
    companyName: venue?.company?.name,
    lastUpdated: venue?.updatedAt ? new Date(venue.updatedAt).toLocaleDateString() : undefined
  };

  return (
    <CreationSidebarNavigation
      currentStep={currentStep}
      totalSteps={totalSteps}
      steps={steps}
      previewCard={previewCard}
      backLink="/dashboard/venues"
      backLinkText="Back to venues"
      moduleName="Venue"
      colorScheme={{
        primary: 'blue-500',
        secondary: 'blue-100',
        gradient: 'from-blue-100 to-purple-100'
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
      currentStatus={venue?.status}
      onStatusChange={onStatusChange}
      entityType="venue"
    />
  );
}