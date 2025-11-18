'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { MarqueeSidebarNavigation, MarqueeMobileNavigation } from '@/app/dashboard/marquee/components';
import { MarqueeBasicForm } from './marquee-basic-form';
import { MarqueeAdvancedForm } from './marquee-advanced-form';
import type { Marquee } from '@/types/marquee';

interface MarqueeCreationWizardProps {
  onCancel: () => void;
}

export function MarqueeCreationWizard({ onCancel }: MarqueeCreationWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createdMarquee, setCreatedMarquee] = useState<Marquee | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;

  const handleStep1Start = () => {
    setIsLoading(true);
  };

  const handleStep1Complete = async (marquee: Marquee) => {
    console.log('✅ Step 1 completed, marquee created:', marquee);
    setCreatedMarquee(marquee);
    setCurrentStep(2);
    setIsLoading(false);
  };

  const handleStep2Start = () => {
    setIsLoading(true);
  };

  const handleStep2Complete = async () => {
    console.log('✅ Step 2 completed, navigating to marquee list');
    setIsLoading(true);
    router.push('/dashboard/marquee');
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  // Step navigation functions for sidebar
  const canNavigateToStep = (stepNumber: number): boolean => {
    if (stepNumber === 1) return true;
    if (stepNumber === 2) return !!createdMarquee;
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
          <MarqueeBasicForm
            onSubmit={handleStep1Complete}
            onCancel={onCancel}
            loading={isLoading}
            onLoadingStart={handleStep1Start}
          />
        );
      case 2:
        return createdMarquee ? (
          <MarqueeAdvancedForm
            marquee={createdMarquee}
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
      <MarqueeMobileNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        marquee={createdMarquee}
        onBack={currentStep > 1 ? handleBackToStep1 : undefined}
      />

      {/* Split-screen layout */}
      <div className="flex flex-1">
        {/* Left Sidebar - Fixed position, hidden on mobile */}
        <MarqueeSidebarNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          marquee={createdMarquee}
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
                <h1 className="text-2xl font-semibold tracking-tight mb-2">
                  Create New Marquee
                </h1>
                <p className="text-sm text-muted-foreground">
                  {currentStep === 1
                    ? 'Set up a new marquee banner for your site'
                    : 'Upload media for desktop and mobile displays'}
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
                      <div>Created Marquee ID: {createdMarquee?.id || 'None'}</div>
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
