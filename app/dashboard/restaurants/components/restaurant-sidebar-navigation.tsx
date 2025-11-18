'use client';

import { Utensils, Settings, Building } from 'lucide-react';
import { CreationSidebarNavigation, StepConfig, PreviewCardData } from '@/app/dashboard/shared/components';
import type { Restaurant } from '@/types/restaurants';

interface RestaurantSidebarNavigationProps {
  currentStep: number;
  totalSteps: number;
  restaurant?: Restaurant | null;
  onStepClick?: (stepNumber: number) => void;
  canNavigateToStep?: (stepNumber: number) => boolean;
  isEditMode?: boolean;
  onUpdate?: () => void;
  updateLoading?: boolean;
  hasUnsavedChanges?: boolean;
  onStatusChange?: (newStatus: string) => void;
  className?: string;
}

export function RestaurantSidebarNavigation({
  currentStep,
  totalSteps,
  restaurant,
  onStepClick,
  canNavigateToStep,
  isEditMode,
  onUpdate,
  updateLoading,
  hasUnsavedChanges,
  onStatusChange,
  className
}: RestaurantSidebarNavigationProps) {
  
  const steps: StepConfig[] = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Add restaurant name, description, location and contact details',
      icon: Building
    },
    {
      id: 2,
      title: 'Advanced Details',
      description: 'Upload restaurant image and add additional information',
      icon: Settings
    }
  ];

  const getRestaurantImage = () => {
    if (!restaurant) return undefined;
    
    // Follow the priority logic: imageUrl -> imageBigUrl -> image (S3 key)
    return restaurant.imageUrl || 
           restaurant.imageBigUrl || 
           (restaurant.image && restaurant.image !== 'placeholder' ? restaurant.image : '') || 
           undefined;
  };

  const getRestaurantSubtitle = () => {
    if (!restaurant) return undefined;
    
    const parts = [];
    if (restaurant.city) parts.push(restaurant.city);
    if (restaurant.state) parts.push(restaurant.state);
    
    return parts.length > 0 ? parts.join(', ') : 'Location not set';
  };

  const getRestaurantStatus = () => {
    if (!restaurant?.status) return 'draft';
    
    switch (restaurant.status.toLowerCase()) {
      case 'approved': return 'approved';
      case 'pending':
      case 'pending_review': return 'pending';
      case 'rejected': return 'rejected';
      case 'draft':
      default: return 'draft';
    }
  };

  const previewCard: PreviewCardData = {
    title: restaurant?.name || 'Untitled Restaurant',
    subtitle: getRestaurantSubtitle(),
    status: getRestaurantStatus(),
    image: getRestaurantImage(),
    fallbackIcon: Utensils
  };

  return (
    <CreationSidebarNavigation
      currentStep={currentStep}
      totalSteps={totalSteps}
      steps={steps}
      previewCard={previewCard}
      backLink="/dashboard/restaurants"
      backLinkText="Back to restaurants"
      moduleName="Restaurant"
      colorScheme={{
        primary: 'green-500',
        secondary: 'green-100',
        gradient: 'from-green-100 to-teal-100'
      }}
      onStepClick={onStepClick}
      canNavigateToStep={canNavigateToStep}
      isEditMode={isEditMode}
      onUpdate={onUpdate}
      updateLoading={updateLoading}
      hasUnsavedChanges={hasUnsavedChanges}
      currentStatus={restaurant?.status}
      onStatusChange={onStatusChange}
      entityType="restaurant"
      className={className}
    />
  );
}