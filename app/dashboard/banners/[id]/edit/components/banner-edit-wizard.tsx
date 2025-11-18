'use client';

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BannerSidebarNavigation, BannerMobileNavigation } from '../../../components';
import { BannerBasicEditForm, BannerBasicEditFormRef } from './banner-basic-edit-form';
import { BannerAdvancedEditForm, BannerAdvancedEditFormRef } from './banner-advanced-edit-form';
import type { Banner } from '@/types/banners';

export interface BannerEditWizardProps {
  banner: Banner;
  onSubmit: (data: unknown) => Promise<void>;
  loading?: boolean;
}

export function BannerEditWizard({ 
  banner, 
  onSubmit, 
  loading = false 
}: BannerEditWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Refs to trigger form submission
  const basicFormRef = useRef<BannerBasicEditFormRef>(null);
  const advancedFormRef = useRef<BannerAdvancedEditFormRef>(null);

  const totalSteps = 2;

  // Step navigation functions for sidebar
  const canNavigateToStep = (stepNumber: number): boolean => {
    // Allow navigation to both steps since we're editing
    return stepNumber === 1 || stepNumber === 2;
  };

  const handleStepClick = (stepNumber: number) => {
    if (canNavigateToStep(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleUpdate = () => {
    // Trigger form submission from current step
    if (currentStep === 1) {
      basicFormRef.current?.submitForm();
    } else if (currentStep === 2) {
      advancedFormRef.current?.submitForm();
    }
  };

  const handleFormChange = () => {
    setHasUnsavedChanges(true);
  };

  const handleSubmitSuccess = async (data: unknown) => {
    try {
      await onSubmit(data);
      setHasUnsavedChanges(false); // Reset after successful save
    } catch (error) {
      // Error is handled by parent component
      throw error;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BannerBasicEditForm
            ref={basicFormRef}
            banner={banner}
            onSubmit={handleSubmitSuccess}
            onNext={() => setCurrentStep(2)}
            loading={loading}
            onDataChange={setFormData}
            onFormChange={handleFormChange}
          />
        );
      case 2:
        return (
          <BannerAdvancedEditForm
            ref={advancedFormRef}
            banner={banner}
            formData={formData}
            onSubmit={handleSubmitSuccess}
            onBack={handleBackToStep1}
            loading={loading}
            onFormChange={handleFormChange}
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
        banner={banner}
        onBack={currentStep > 1 ? handleBackToStep1 : undefined}
        isEditMode={true}
        onUpdate={handleUpdate}
        updateLoading={loading}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      
      {/* Split-screen layout */}
      <div className="flex flex-1">
        {/* Left Sidebar - Fixed position, hidden on mobile */}
        <BannerSidebarNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          banner={banner}
          onStepClick={handleStepClick}
          canNavigateToStep={canNavigateToStep}
          isEditMode={true}
          onUpdate={handleUpdate}
          updateLoading={loading}
          hasUnsavedChanges={hasUnsavedChanges}
        />
        
        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          {/* Main Content Container */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Page Header - Only show on desktop */}
              <div className="hidden lg:block mb-6">
                <h1 className="text-2xl font-semibold tracking-tight mb-2">
                  Edit Banner: {banner.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Update banner campaign information and settings
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