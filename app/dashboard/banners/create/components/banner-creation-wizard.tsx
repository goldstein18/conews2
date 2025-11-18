'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { BannerSidebarNavigation, BannerMobileNavigation } from '@/app/dashboard/banners/components';
import { useBannerStore } from '@/store/banner-store';
import { BannerBasicForm } from './banner-basic-form';
import { BannerImageForm } from './banner-image-form';
import type { Banner, BannerType } from '@/types/banners';
import { getBannerDimensions } from '../../utils';

export interface BannerCreationWizardProps {
  bannerType?: BannerType | null;
  onCancel?: () => void;
}

export function BannerCreationWizard({ bannerType, onCancel }: BannerCreationWizardProps) {
  const router = useRouter();
  const { 
    creationFlow, 
    setCurrentStep, 
    setCreatedBanner,
    resetCreationFlow,
    setIsCreating 
  } = useBannerStore();

  const { currentStep, createdBanner } = creationFlow;
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 2;

  // Get banner type info for display
  const getBannerTypeInfo = () => {
    if (!bannerType) {
      return { title: 'Schedule New Banner', description: 'Schedule your banner campaign' };
    }
    
    const bannerInfo = getBannerDimensions(bannerType);
    const baseTitle = `Schedule New ${bannerInfo.label}`;
    const baseDescription = `Schedule your ${bannerInfo.description.toLowerCase()} banner campaign`;
    
    // For Premium banners, show dimensions; for others, keep simple description
    const description = bannerType === 'PREMIUM' 
      ? `${baseDescription} (${bannerInfo.dimensions})`
      : baseDescription;
    
    return { title: baseTitle, description };
  };

  const { title, description } = getBannerTypeInfo();

  // Initialize wizard
  useEffect(() => {
    setCurrentStep(1);
    return () => {
      // Clean up on unmount
      resetCreationFlow();
    };
  }, [setCurrentStep, resetCreationFlow]);

  const handleStep1Start = () => {
    setIsLoading(true);
    setIsCreating(true);
  };

  const handleStep1Complete = async (banner: Banner) => {
    console.log('✅ Step 1 completed, banner created:', banner);
    setCreatedBanner(banner);
    setCurrentStep(2);
    setIsLoading(false);
    setIsCreating(false);
  };

  const handleStep2Start = () => {
    setIsLoading(true);
    setIsCreating(true);
  };

  const handleStep2Complete = async () => {
    console.log('✅ Step 2 completed, navigating to banners list');
    setIsLoading(true);
    resetCreationFlow();
    router.push('/dashboard/banners');
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  // Step navigation functions for sidebar
  const canNavigateToStep = (stepNumber: number): boolean => {
    // Allow navigation to step 1 always, step 2 only if banner is created
    if (stepNumber === 1) return true;
    if (stepNumber === 2) return !!createdBanner;
    return false;
  };

  const handleStepClick = (stepNumber: number) => {
    if (canNavigateToStep(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  const handleCancel = () => {
    resetCreationFlow();
    if (onCancel) {
      onCancel();
    } else {
      router.push('/dashboard/banners');
    }
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BannerBasicForm
            bannerType={bannerType}
            onSubmit={handleStep1Complete}
            onCancel={handleCancel}
            loading={isLoading}
            onLoadingStart={handleStep1Start}
          />
        );
      case 2:
        if (!createdBanner) {
          return (
            <div className="text-center py-8">
              <p className="text-red-600">Error: No banner created. Please start over.</p>
            </div>
          );
        }
        return (
          <BannerImageForm
            banner={createdBanner}
            bannerType={bannerType}
            onSubmit={handleStep2Complete}
            onBack={handleBackToStep1}
            loading={isLoading}
            onLoadingStart={handleStep2Start}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-full flex flex-col">
      {/* Mobile Navigation */}
      <BannerMobileNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        banner={createdBanner}
        onBack={currentStep > 1 ? handleBackToStep1 : undefined}
      />
      
      {/* Split-screen layout */}
      <div className="flex flex-1">
        {/* Left Sidebar - Fixed position, hidden on mobile */}
        <BannerSidebarNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          banner={createdBanner}
          onStepClick={handleStepClick}
          canNavigateToStep={canNavigateToStep}
        />
        
        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          {/* Main Content Container */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Page Header - Only show on desktop */}
              <div className="hidden lg:block mb-6">
                <h1 className="text-2xl font-semibold tracking-tight mb-2">{title}</h1>
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
              
              {/* Form Content */}
              <Card>
                <CardContent className="p-6">
                  {renderStepContent()}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}