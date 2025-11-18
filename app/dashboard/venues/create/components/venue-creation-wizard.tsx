"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { VenueSidebarNavigation, VenueMobileNavigation } from '@/app/dashboard/venues/components';

import { VenueBasicForm } from './venue-basic-form';
import { VenueAdvancedForm } from './venue-advanced-form';
import type { Venue } from '@/types/venues';

interface VenueCreationWizardProps {
  onCancel: () => void;
}

export function VenueCreationWizard({ onCancel }: VenueCreationWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createdVenue, setCreatedVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;

  const handleStep1Start = () => {
    setIsLoading(true);
  };

  const handleStep1Complete = async (venue: Venue) => {
    console.log('✅ Step 1 completed, venue created:', venue);
    setCreatedVenue(venue);
    setCurrentStep(2);
    setIsLoading(false); // Reset loading after step completion
  };

  const handleStep2Start = () => {
    setIsLoading(true);
  };

  const handleStep2Complete = async () => {
    console.log('✅ Step 2 completed, navigating to venues list');
    setIsLoading(true);
    router.push('/dashboard/venues');
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  // Step navigation functions for sidebar
  const canNavigateToStep = (stepNumber: number): boolean => {
    // Allow navigation to step 1 always, step 2 only if venue is created
    if (stepNumber === 1) return true;
    if (stepNumber === 2) return !!createdVenue;
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
          <VenueBasicForm
            onSubmit={handleStep1Complete}
            onCancel={onCancel}
            loading={isLoading}
            onLoadingStart={handleStep1Start}
          />
        );
      case 2:
        return createdVenue ? (
          <VenueAdvancedForm
            venue={createdVenue}
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
      <VenueMobileNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        venue={createdVenue}
        onBack={currentStep > 1 ? handleBackToStep1 : undefined}
      />
      
      {/* Split-screen layout */}
      <div className="flex flex-1">
        {/* Left Sidebar - Fixed position, hidden on mobile */}
        <VenueSidebarNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          venue={createdVenue}
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
                <h1 className="text-2xl font-semibold tracking-tight mb-2">Add New Venue</h1>
                <p className="text-sm text-muted-foreground">
                  {currentStep === 1 
                    ? 'Provide basic venue information to get started'
                    : 'Add advanced details and upload venue image'
                  }
                </p>
              </div>
              
              {/* Form Content */}
              <Card>
                <CardContent className="p-6">
                  {renderStepContent()}
                </CardContent>
              </Card>

              {/* Debug Info (remove in production) */}
              {process.env.NODE_ENV === 'development' && (
                <Card className="bg-gray-50 mt-6">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium mb-2">Debug Info</h3>
                    <div className="text-xs space-y-1 text-gray-600">
                      <div>Current Step: {currentStep}</div>
                      <div>Created Venue ID: {createdVenue?.id || 'None'}</div>
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