"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { ArtsGroupSidebarNavigation, ArtsGroupMobileNavigation } from '@/app/dashboard/arts-groups/components';
import { ArtsGroupBasicForm } from './arts-group-basic-form';
import { ArtsGroupAdvancedForm } from './arts-group-advanced-form';
import { ArtsGroup } from '@/types/arts-groups';

interface ArtsGroupCreationWizardProps {
  onCancel: () => void;
}

export function ArtsGroupCreationWizard({ onCancel }: ArtsGroupCreationWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createdArtsGroup, setCreatedArtsGroup] = useState<ArtsGroup | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;

  const handleStep1Start = () => {
    setIsLoading(true);
  };

  const handleStep1Complete = async (artsGroup: ArtsGroup) => {
    console.log('✅ Step 1 completed, arts group created:', artsGroup);
    setCreatedArtsGroup(artsGroup);
    setCurrentStep(2);
    setIsLoading(false); // Reset loading after step completion
  };

  const handleStep2Start = () => {
    setIsLoading(true);
  };

  const handleStep2Complete = async () => {
    console.log('✅ Step 2 completed, navigating to arts groups list');
    setIsLoading(true);
    router.push('/dashboard/arts-groups');
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  // Step navigation functions for sidebar
  const canNavigateToStep = (stepNumber: number): boolean => {
    // Allow navigation to step 1 always, step 2 only if arts group is created
    if (stepNumber === 1) return true;
    if (stepNumber === 2) return !!createdArtsGroup;
    return false;
  };

  const handleStepClick = (stepNumber: number) => {
    if (canNavigateToStep(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ArtsGroupBasicForm
            onSubmit={handleStep1Complete}
            onCancel={onCancel}
            loading={isLoading}
            onLoadingStart={handleStep1Start}
          />
        );
      case 2:
        return createdArtsGroup ? (
          <ArtsGroupAdvancedForm
            artsGroup={createdArtsGroup}
            onSubmit={handleStep2Complete}
            onBack={handleBackToStep1}
            loading={isLoading}
            onLoadingStart={handleStep2Start}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-full flex flex-col">
      {/* Mobile Navigation */}
      <ArtsGroupMobileNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        artsGroup={createdArtsGroup}
        onBack={currentStep > 1 ? handleBackToStep1 : undefined}
      />

      {/* Split-screen layout */}
      <div className="flex flex-1">
        {/* Left Sidebar - Fixed position, hidden on mobile */}
        <ArtsGroupSidebarNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          artsGroup={createdArtsGroup}
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
                <h1 className="text-2xl font-semibold tracking-tight mb-2">Add New Arts Group</h1>
                <p className="text-sm text-muted-foreground">
                  {currentStep === 1
                    ? 'Provide basic arts group information to get started'
                    : 'Add advanced details and upload arts group image'}
                </p>
              </div>

              {/* Form Content */}
              <Card>
                <CardContent className="p-6">{renderStepContent()}</CardContent>
              </Card>

              {/* Debug Info (development only) */}
              {process.env.NODE_ENV === 'development' && (
                <Card className="bg-gray-50 mt-6">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium mb-2">Debug Info</h3>
                    <div className="text-xs space-y-1 text-gray-600">
                      <div>Current Step: {currentStep}</div>
                      <div>Created Arts Group ID: {createdArtsGroup?.id || 'None'}</div>
                      <div>Progress: {progress.toFixed(0)}%</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
