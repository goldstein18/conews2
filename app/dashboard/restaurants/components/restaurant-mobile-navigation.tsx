'use client';

import { CreationMobileNavigation, MobileStepConfig } from '@/app/dashboard/shared/components';
import type { Restaurant } from '@/types/restaurants';

interface RestaurantMobileNavigationProps {
  currentStep: number;
  totalSteps: number;
  restaurant?: Restaurant | null;
  onBack?: () => void;
  isEditMode?: boolean;
  onUpdate?: () => void;
  updateLoading?: boolean;
  hasUnsavedChanges?: boolean;
  className?: string;
}

export function RestaurantMobileNavigation({
  currentStep,
  totalSteps,
  restaurant,
  onBack,
  isEditMode,
  onUpdate,
  updateLoading,
  hasUnsavedChanges,
  className
}: RestaurantMobileNavigationProps) {
  
  const steps: MobileStepConfig[] = [
    { id: 1, title: 'Basic Information' },
    { id: 2, title: 'Advanced Details' }
  ];

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

  return (
    <CreationMobileNavigation
      currentStep={currentStep}
      totalSteps={totalSteps}
      steps={steps}
      entityTitle={restaurant?.name}
      entityStatus={getRestaurantStatus()}
      colorScheme={{
        primary: 'green-500',
        secondary: 'green-100'
      }}
      onBack={onBack}
      isEditMode={isEditMode}
      onUpdate={onUpdate}
      updateLoading={updateLoading}
      hasUnsavedChanges={hasUnsavedChanges}
      className={className}
    />
  );
}