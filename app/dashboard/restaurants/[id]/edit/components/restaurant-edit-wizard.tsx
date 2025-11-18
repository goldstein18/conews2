'use client';

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RestaurantSidebarNavigation, RestaurantMobileNavigation } from '../../../components';
import { RestaurantBasicEditForm, RestaurantBasicEditFormRef } from './restaurant-basic-edit-form';
import { RestaurantAdvancedEditForm, RestaurantAdvancedEditFormRef } from './restaurant-advanced-edit-form';
import { RestaurantStatus } from '@/types/restaurants';
import type { Restaurant } from '@/types/restaurants';

export interface RestaurantEditWizardProps {
  restaurant: Restaurant;
  onSubmit: (data: unknown) => Promise<void>;
  loading?: boolean;
}

export function RestaurantEditWizard({
  restaurant,
  onSubmit,
  loading = false
}: RestaurantEditWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Refs to trigger form submission
  const basicFormRef = useRef<RestaurantBasicEditFormRef>(null);
  const advancedFormRef = useRef<RestaurantAdvancedEditFormRef>(null);

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

  const handleUpdate = async () => {
    console.log('🔵 handleUpdate called for step:', currentStep);
    try {
      // Trigger form submission from current step
      if (currentStep === 1) {
        console.log('📋 Calling basic form submitForm');
        await basicFormRef.current?.submitForm();
        console.log('✅ Basic form submitForm completed');
      } else if (currentStep === 2) {
        console.log('📋 Calling advanced form submitForm');
        await advancedFormRef.current?.submitForm();
        console.log('✅ Advanced form submitForm completed');
      }
    } catch (error) {
      // Error is already handled by form components and propagated up
      // This catch ensures the function completes properly
      console.error('❌ Error in handleUpdate:', error);
    }
  };

  const handleFormChange = () => {
    setHasUnsavedChanges(true);
  };

  const handleSubmitSuccess = async (data: unknown) => {
    console.log('🟢 handleSubmitSuccess called in wizard with data:', data);
    console.log('🔄 Current formData state (includes status from toggle):', formData);
    try {
      console.log('📤 Calling onSubmit from wizard');

      // Merge formData changes (including status from toggle) with form submission data
      const mergedData = {
        ...(data as Record<string, unknown>),
        ...formData, // This includes the status change from toggle if any
      };

      console.log('✅ Merged data being sent to parent:', mergedData);
      await onSubmit(mergedData);
      console.log('✅ onSubmit completed in wizard');
      setHasUnsavedChanges(false); // Reset after successful save
    } catch (error) {
      console.error('❌ Error in handleSubmitSuccess:', error);
      // Error is handled by parent component
      throw error;
    }
  };

  const handleStatusChange = (newStatus: string) => {
    // Update form data with new status (passes string directly)
    setFormData(prev => ({ ...prev, status: newStatus }));

    // Mark as having unsaved changes to enable "Update Changes" button
    setHasUnsavedChanges(true);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <RestaurantBasicEditForm
            ref={basicFormRef}
            restaurant={restaurant}
            onSubmit={handleSubmitSuccess}
            onNext={() => setCurrentStep(2)}
            loading={loading}
            onDataChange={setFormData}
            onFormChange={handleFormChange}
          />
        );
      case 2:
        return (
          <RestaurantAdvancedEditForm
            ref={advancedFormRef}
            restaurant={restaurant}
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

  // Merge restaurant with formData changes for display purposes
  const currentRestaurant = {
    ...restaurant,
    ...formData,
    status: (formData.status || restaurant.status) as RestaurantStatus
  };

  return (
    <div className="bg-gray-50 min-h-full flex flex-col">
      {/* Mobile Navigation */}
      <RestaurantMobileNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        restaurant={currentRestaurant}
        onBack={currentStep > 1 ? handleBackToStep1 : undefined}
        isEditMode={true}
        onUpdate={handleUpdate}
        updateLoading={loading}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* Split-screen layout */}
      <div className="flex flex-1">
        {/* Left Sidebar - Fixed position, hidden on mobile */}
        <RestaurantSidebarNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          restaurant={currentRestaurant}
          onStepClick={handleStepClick}
          canNavigateToStep={canNavigateToStep}
          isEditMode={true}
          onUpdate={handleUpdate}
          updateLoading={loading}
          hasUnsavedChanges={hasUnsavedChanges}
          onStatusChange={handleStatusChange}
        />
        
        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          {/* Main Content Container */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Page Header - Only show on desktop */}
              <div className="hidden lg:block mb-6">
                <h1 className="text-2xl font-semibold tracking-tight mb-2">
                  Edit Restaurant: {restaurant.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Update restaurant information and settings
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