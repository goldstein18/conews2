"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import {
  EscoopEntrySidebarNavigation,
  EscoopEntryMobileNavigation
} from '@/app/dashboard/escoop-entries/components';

import { EscoopEntryFormContent } from './escoop-entry-form-content';
import type { EscoopSearchResult, EventSearchResult } from '@/types/escoop-entries';

interface EscoopEntryCreationWizardProps {
  onCancel: () => void;
}

export function EscoopEntryCreationWizard({ onCancel }: EscoopEntryCreationWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEscoop, setSelectedEscoop] = useState<EscoopSearchResult | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventSearchResult | null>(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 1; // Single step for escoop entries

  const handleFormStart = () => {
    setIsLoading(true);
  };

  const handleFormComplete = async () => {
    console.log('✅ Escoop entry created, navigating to entries list');
    setIsLoading(false);
    router.push('/dashboard/escoop-entries');
  };

  const handleEscoopSelect = (escoop: EscoopSearchResult) => {
    setSelectedEscoop(escoop);
  };

  const handleEventSelect = (event: EventSearchResult) => {
    setSelectedEvent(event);
  };

  const handleCompanySelect = (companyName: string) => {
    setSelectedCompanyName(companyName);
  };

  // Step navigation functions for sidebar
  const canNavigateToStep = (stepNumber: number): boolean => {
    // Only one step, always allow navigation to step 1
    return stepNumber === 1;
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
          <EscoopEntryFormContent
            onSubmit={handleFormComplete}
            onCancel={onCancel}
            loading={isLoading}
            onLoadingStart={handleFormStart}
            onEscoopSelect={handleEscoopSelect}
            onEventSelect={handleEventSelect}
            onCompanySelect={handleCompanySelect}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-full flex flex-col">
      {/* Mobile Navigation */}
      <EscoopEntryMobileNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        selectedEscoop={selectedEscoop}
        selectedEvent={selectedEvent}
        companyName={selectedCompanyName}
      />

      {/* Desktop Layout */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <EscoopEntrySidebarNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          selectedEscoop={selectedEscoop}
          selectedEvent={selectedEvent}
          companyName={selectedCompanyName}
          onStepClick={handleStepClick}
          canNavigateToStep={canNavigateToStep}
        />

        {/* Main Content */}
        <div className="flex-1 lg:pl-0">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-none border-none lg:border lg:shadow-sm lg:rounded-lg lg:m-6">
              <CardContent className="p-6 lg:p-8">
                {renderStepContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}