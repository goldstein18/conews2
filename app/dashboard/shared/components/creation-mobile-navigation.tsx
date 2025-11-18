'use client';

import { ChevronLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface MobileStepConfig {
  id: number;
  title: string;
}

interface CreationMobileNavigationProps {
  currentStep: number;
  totalSteps: number;
  steps: MobileStepConfig[];
  entityTitle?: string;
  entityStatus?: 'draft' | 'active' | 'pending' | 'approved' | 'rejected';
  colorScheme?: {
    primary: string;
    secondary: string;
  };
  onBack?: () => void;
  className?: string;
  // Edit mode specific props
  isEditMode?: boolean;
  onUpdate?: () => void;
  updateLoading?: boolean;
  hasUnsavedChanges?: boolean;
}

export function CreationMobileNavigation({
  currentStep,
  totalSteps,
  steps,
  entityTitle,
  entityStatus = 'draft',
  colorScheme = {
    primary: 'blue-500',
    secondary: 'blue-100'
  },
  onBack,
  className,
  // Edit mode props
  isEditMode = false,
  onUpdate,
  updateLoading = false,
  hasUnsavedChanges = false
}: CreationMobileNavigationProps) {
  
  const progress = (currentStep / totalSteps) * 100;
  const currentStepInfo = steps.find(step => step.id === currentStep);

  const getStatusBadgeVariant = () => {
    switch (entityStatus) {
      case 'active':
      case 'approved':
        return 'default';
      case 'draft':
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = () => {
    switch (entityStatus) {
      case 'active': return 'Active';
      case 'approved': return 'Approved';
      case 'draft': return 'Draft';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      default: return 'Draft';
    }
  };

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
              <div className="w-8" /> // Spacer to maintain alignment
            )}
            
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {entityTitle || 'New Item'}
              </h2>
              {currentStepInfo && (
                <p className="text-sm text-gray-500">
                  {currentStepInfo.title}
                </p>
              )}
            </div>
          </div>

          {/* Status badge and update button */}
          <div className="flex items-center space-x-2">
            <Badge 
              variant={getStatusBadgeVariant()}
              className="text-xs flex-shrink-0"
            >
              {getStatusLabel()}
            </Badge>
            
            {/* Update button for edit mode */}
            {isEditMode && onUpdate && (
              <Button
                onClick={onUpdate}
                disabled={updateLoading || !hasUnsavedChanges}
                variant={hasUnsavedChanges ? "default" : "outline"}
                size="sm"
                className="text-xs h-7 px-2"
              >
                {updateLoading ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                ) : (
                  <>
                    <Save className="h-3 w-3 mr-1" />
                    Update
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Progress section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Step {currentStep} of {totalSteps}
            </p>
            <p className="text-xs text-gray-500">
              {Math.round(progress)}% complete
            </p>
          </div>
          <Progress 
            value={progress} 
            className="h-2"
          />
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center mt-3 space-x-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                step.id < currentStep && "bg-green-500",
                step.id === currentStep && `bg-${colorScheme.primary}`,
                step.id > currentStep && "bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}