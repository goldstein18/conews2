'use client';

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { VenueSidebarNavigation, VenueMobileNavigation } from '../../../components';
import { VenueBasicEditForm, VenueBasicEditFormRef } from './venue-basic-edit-form';
import { VenueAdvancedEditForm, VenueAdvancedEditFormRef } from './venue-advanced-edit-form';
import { VenueStatus } from '@/types/venues';
import type { Venue } from '@/types/venues';
import type { VenueFormData } from '../../../lib/validations';

export interface VenueEditWizardProps {
  venue: Venue;
  onSubmit: (data: VenueFormData) => Promise<void>;
  loading?: boolean;
}

export function VenueEditWizard({
  venue,
  onSubmit,
  loading = false
}: VenueEditWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Refs to trigger form submission
  const basicFormRef = useRef<VenueBasicEditFormRef>(null);
  const advancedFormRef = useRef<VenueAdvancedEditFormRef>(null);

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
      // Merge formData changes (including status from toggle) with form submission data
      const mergedData = {
        ...(data as Record<string, unknown>),
        ...formData, // This includes the status change from toggle if any
      } as VenueFormData;

      await onSubmit(mergedData);
      setHasUnsavedChanges(false); // Reset after successful save
    } catch (error) {
      // Error is handled by parent component
      throw error;
    }
  };

  const handleDataChange = (data: unknown) => {
    setFormData(data as Record<string, unknown>);
  };

  const handleStatusChange = (newStatus: string) => {
    // Update form data with new status (passes string directly)
    setFormData(prev => ({ ...prev, status: newStatus }));

    // Mark as having unsaved changes to enable "Update Changes" button
    setHasUnsavedChanges(true);

    // Update the form's status field if we have a ref
    if (currentStep === 1 && basicFormRef.current) {
      // The form will be updated via formData when user clicks "Update Changes"
    } else if (currentStep === 2 && advancedFormRef.current) {
      // The form will be updated via formData when user clicks "Update Changes"
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <VenueBasicEditForm
            ref={basicFormRef}
            venue={venue}
            onSubmit={handleSubmitSuccess}
            onNext={() => setCurrentStep(2)}
            loading={loading}
            onDataChange={handleDataChange}
            onFormChange={handleFormChange}
          />
        );
      case 2:
        return (
          <VenueAdvancedEditForm
            ref={advancedFormRef}
            venue={venue}
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

  // Merge venue with formData changes for display purposes
  const currentVenue = {
    ...venue,
    ...formData,
    status: (formData.status || venue.status) as VenueStatus
  };

  return (
    <div className="bg-gray-50 min-h-full flex flex-col">
      {/* Mobile Navigation */}
      <VenueMobileNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        venue={currentVenue}
        onBack={currentStep > 1 ? handleBackToStep1 : undefined}
        isEditMode={true}
        onUpdate={handleUpdate}
        updateLoading={loading}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* Split-screen layout */}
      <div className="flex flex-1">
        {/* Left Sidebar - Fixed position, hidden on mobile */}
        <VenueSidebarNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          venue={currentVenue}
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
                  Edit Venue: {venue.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Update venue information and settings
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