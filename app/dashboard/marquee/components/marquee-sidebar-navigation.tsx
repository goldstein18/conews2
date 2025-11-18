'use client';

import { Info, ImageIcon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Marquee } from '@/types/marquee';

interface MarqueeSidebarNavigationProps {
  currentStep: number;
  totalSteps: number;
  marquee: Marquee | null;
  onStepClick: (step: number) => void;
  canNavigateToStep: (step: number) => boolean;
}

export function MarqueeSidebarNavigation({
  currentStep,
  totalSteps,
  marquee,
  onStepClick,
  canNavigateToStep,
}: MarqueeSidebarNavigationProps) {
  const steps = [
    {
      number: 1,
      title: 'Basic Information',
      description: 'Add marquee name, description, location and contact details',
      icon: Info,
    },
    {
      number: 2,
      title: 'Advanced Details',
      description: 'Upload marquee image and add additional information',
      icon: ImageIcon,
    },
  ];

  return (
    <div className="hidden lg:block w-80 bg-white border-r border-gray-200">
      <div className="p-8 sticky top-0">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {marquee ? marquee.name : 'Untitled Marquee'}
          </h2>
          <p className="text-sm text-gray-500">
            {marquee ? 'Complete setup' : 'No details set'}
          </p>
          <span className="inline-block px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded mt-2">
            Draft
          </span>
        </div>

        {/* Steps */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
            Steps
          </div>

          {steps.map((step) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            const canNavigate = canNavigateToStep(step.number);
            const StepIcon = step.icon;

            return (
              <button
                key={step.number}
                onClick={() => onStepClick(step.number)}
                disabled={!canNavigate}
                className={cn(
                  'w-full text-left p-4 rounded-lg transition-all',
                  'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500',
                  isActive && 'bg-purple-50 border border-purple-200',
                  !isActive && !isCompleted && 'border border-transparent',
                  isCompleted && 'bg-green-50 border border-green-200',
                  !canNavigate && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                      isActive && 'bg-purple-500 text-white',
                      isCompleted && 'bg-green-500 text-white',
                      !isActive && !isCompleted && 'bg-gray-200 text-gray-600'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        isActive && 'text-purple-700',
                        isCompleted && 'text-green-700',
                        !isActive && !isCompleted && 'text-gray-700'
                      )}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">
              {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
