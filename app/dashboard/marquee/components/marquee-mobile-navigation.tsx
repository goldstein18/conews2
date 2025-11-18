'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Marquee } from '@/types/marquee';

interface MarqueeMobileNavigationProps {
  currentStep: number;
  totalSteps: number;
  marquee: Marquee | null;
  onBack?: () => void;
}

export function MarqueeMobileNavigation({
  currentStep,
  totalSteps,
  marquee,
  onBack,
}: MarqueeMobileNavigationProps) {
  const stepTitles = ['Basic Information', 'Media Upload'];

  return (
    <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="px-4 py-3">
        {/* Top row with back button and title */}
        <div className="flex items-center space-x-3 mb-3">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {currentStep === 1 ? 'Create New Marquee' : stepTitles[currentStep - 1]}
            </h1>
            <p className="text-xs text-gray-500">
              {marquee ? marquee.name : 'Set up a new marquee banner for your site'}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="font-medium text-gray-900">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                currentStep === 1 && 'bg-blue-500',
                currentStep === 2 && 'bg-purple-500'
              )}
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
