'use client';

import { Check, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface EventMobileNavigationProps {
  currentStep: number;
  totalSteps: number;
  eventTitle?: string;
  eventStatus?: 'draft' | 'published';
  onBack?: () => void;
  className?: string;
}

export function EventMobileNavigation({
  currentStep,
  totalSteps,
  eventTitle,
  eventStatus,
  onBack,
  className
}: EventMobileNavigationProps) {
  
  const progress = (currentStep / totalSteps) * 100;
  
  const steps = [
    { id: 1, title: 'Basic Information' },
    { id: 2, title: 'Date & Location' }, 
    { id: 3, title: 'Media & Details' }
  ];
  
  const currentStepInfo = steps.find(step => step.id === currentStep);

  return (
    <div className={cn("lg:hidden bg-white border-b border-gray-200", className)}>
      {/* Mobile Header */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          {/* Back button and title */}
          <div className="flex items-center space-x-3">
            {currentStep > 1 && onBack ? (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onBack}
                className="p-0 h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            ) : (
              <Link 
                href="/dashboard/events" 
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
            )}
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-gray-900 truncate">
                {eventTitle || 'Create Event'}
              </h1>
              <p className="text-xs text-gray-500">
                {currentStepInfo?.title}
              </p>
            </div>
          </div>
          
          {/* Status badge */}
          <Badge 
            variant={eventStatus === 'published' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {eventStatus === 'published' ? 'Live' : 'Draft'}
          </Badge>
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-center space-x-2 mt-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                step.id < currentStep && "bg-green-500 text-white",
                step.id === currentStep && "bg-blue-500 text-white", 
                step.id > currentStep && "bg-gray-200 text-gray-600"
              )}>
                {step.id < currentStep ? (
                  <Check className="h-3 w-3" />
                ) : (
                  step.id
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-8 h-px mx-1",
                  step.id < currentStep ? "bg-green-500" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}