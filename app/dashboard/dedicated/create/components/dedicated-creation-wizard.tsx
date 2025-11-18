'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dedicated } from '@/types/dedicated';
import { DedicatedBasicForm } from './dedicated-basic-form';
import { DedicatedImageForm } from './dedicated-image-form';
import { DedicatedSidebarNavigation } from '../../components/dedicated-sidebar-navigation';
import { DedicatedMobileNavigation } from '../../components/dedicated-mobile-navigation';

export function DedicatedCreationWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createdDedicated, setCreatedDedicated] = useState<Dedicated | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 2;

  const handleStep1Start = () => setIsLoading(true);
  const handleStep1Complete = (dedicated: Dedicated) => {
    setCreatedDedicated(dedicated);
    setCurrentStep(2);
    setIsLoading(false);
  };

  const handleStep2Start = () => setIsLoading(true);
  const handleStep2Complete = () => {
    router.push('/dashboard/dedicated');
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleCancel = () => {
    router.push('/dashboard/dedicated');
  };

  // Determine if navigation to a step is allowed
  const canNavigateToStep = (step: number): boolean => {
    if (step === 1) return true;
    if (step === 2) return createdDedicated !== null;
    return false;
  };

  // Handle step navigation from sidebar
  const handleStepClick = (step: number) => {
    if (canNavigateToStep(step)) {
      setCurrentStep(step);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <DedicatedBasicForm
            onSubmit={handleStep1Complete}
            onCancel={handleCancel}
            loading={isLoading}
            onLoadingStart={handleStep1Start}
          />
        );
      case 2:
        return createdDedicated ? (
          <DedicatedImageForm
            dedicated={createdDedicated}
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
      <div className="lg:hidden">
        <DedicatedMobileNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          dedicated={createdDedicated}
        />
      </div>

      {/* Desktop Layout */}
      <div className="flex-1 flex">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <DedicatedSidebarNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            dedicated={createdDedicated}
            canNavigateToStep={canNavigateToStep}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6 lg:p-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Create Dedicated Campaign</h1>
              <p className="text-muted-foreground mt-2">
                Create a new dedicated email campaign with custom image and recipients
              </p>
            </div>

            {renderStepContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
