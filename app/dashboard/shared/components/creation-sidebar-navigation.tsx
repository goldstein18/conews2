'use client';

import { Check, ArrowLeft, LucideIcon, Save, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { StatusSelector } from './status-selector';

export interface StepConfig {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface PreviewCardData {
  title?: string;
  subtitle?: string;
  status?: 'draft' | 'active' | 'pending' | 'approved' | 'rejected' | 'scheduled' | 'sent';
  image?: string;
  fallbackIcon?: LucideIcon;
  // Edit mode specific fields
  companyName?: string;
  lastUpdated?: string;
  sendDate?: string;
}

interface CreationSidebarNavigationProps {
  currentStep: number;
  totalSteps: number;
  steps: StepConfig[];
  previewCard: PreviewCardData;
  backLink: string;
  backLinkText: string;
  moduleName: string;
  colorScheme?: {
    primary: string;
    secondary: string;
    gradient: string;
  };
  onStepClick?: (stepNumber: number) => void;
  canNavigateToStep?: (stepNumber: number) => boolean;
  className?: string;
  // Edit mode specific props
  isEditMode?: boolean;
  onUpdate?: () => void;
  updateLoading?: boolean;
  hasUnsavedChanges?: boolean;
  // Save functionality props
  onSave?: () => void;
  saveLoading?: boolean;
  canSave?: boolean;
  // Status selector props (edit mode only)
  currentStatus?: string;
  onStatusChange?: (newStatus: string) => void;
  entityType?: string;
}

export function CreationSidebarNavigation({
  currentStep,
  totalSteps: _totalSteps, // eslint-disable-line @typescript-eslint/no-unused-vars
  steps,
  previewCard,
  backLink,
  backLinkText,
  moduleName,
  colorScheme = {
    primary: 'blue-500',
    secondary: 'blue-100',
    gradient: 'from-blue-100 to-indigo-100'
  },
  onStepClick,
  canNavigateToStep,
  className,
  // Edit mode props
  isEditMode = false,
  onUpdate,
  updateLoading = false,
  hasUnsavedChanges = false,
  // Save props
  onSave,
  saveLoading = false,
  canSave = true,
  // Status toggle props
  currentStatus,
  onStatusChange,
  entityType = 'item'
}: CreationSidebarNavigationProps) {
  
  const getStepStatus = (stepNumber: number): 'completed' | 'active' | 'pending' => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'pending';
  };

  const handleStepClick = (stepNumber: number) => {
    if (onStepClick && canNavigateToStep?.(stepNumber)) {
      onStepClick(stepNumber);
    }
  };

  const getStatusBadgeVariant = () => {
    switch (previewCard.status) {
      case 'active':
      case 'approved':
      case 'sent':
      case 'scheduled':
        return 'default'; // Green badge
      case 'draft':
        return 'secondary'; // Gray badge
      case 'pending':
        return 'outline'; // Will customize with yellow
      case 'rejected':
        return 'destructive'; // Red badge
      default:
        return 'secondary';
    }
  };

  const getStatusBadgeClasses = () => {
    switch (previewCard.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-100';
      default:
        return '';
    }
  };

  const getStatusLabel = () => {
    switch (previewCard.status) {
      case 'active': return 'Active';
      case 'approved': return 'Approved';
      case 'scheduled': return 'Scheduled'; // ✅ Show "Scheduled" for SCHEDULED status
      case 'sent': return 'Sent'; // ✅ Show "Sent" for SENT status
      case 'draft': return 'Draft';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      default: return 'Draft';
    }
  };

  const stepsWithStatus = steps.map(step => ({
    ...step,
    status: getStepStatus(step.id)
  }));

  return (
    <div className={cn(`w-80 min-h-screen bg-gray-50 border-r border-gray-200 hidden lg:flex lg:flex-col sticky top-0 flex-shrink-0`, className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
        <Link href={backLink} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {backLinkText}
        </Link>
        
        {/* Preview Card */}
        <div className={cn(`bg-gradient-to-r rounded-lg p-4 mb-4`, `bg-gradient-to-r ${colorScheme.gradient}`)}>
          <div className="relative h-20 bg-gradient-to-r from-white/20 to-white/10 rounded-md mb-3 flex items-center justify-center overflow-hidden">
            {previewCard.image &&
             previewCard.image.trim() !== '' &&
             previewCard.image !== 'placeholder' &&
             (previewCard.image.startsWith('http') || previewCard.image.startsWith('/')) ? (
              <Image
                src={previewCard.image}
                alt={previewCard.title || moduleName}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized={!previewCard.image.startsWith('http')}
                onError={(e) => {
                  console.error('Image failed to load:', previewCard.image);
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = parent.querySelector('.fallback-icon');
                    if (fallback) {
                      (fallback as HTMLElement).style.display = 'flex';
                    }
                  }
                }}
              />
            ) : (
              <div className="fallback-icon w-12 h-12 bg-white bg-opacity-50 rounded-full flex items-center justify-center">
                {previewCard.fallbackIcon ? (
                  <previewCard.fallbackIcon className={`h-6 w-6 text-${colorScheme.primary}`} />
                ) : (
                  <div className={`h-6 w-6 bg-${colorScheme.primary} rounded`} />
                )}
              </div>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
            {previewCard.title || `Untitled ${moduleName}`}
          </h3>
          
          {/* Company info for edit mode */}
          {isEditMode && previewCard.companyName && (
            <div className="flex items-center text-xs text-gray-600 mb-2">
              <Building2 className="h-3 w-3 mr-1" />
              <span className="truncate">{previewCard.companyName}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs text-gray-600">
                {previewCard.subtitle || 'No details set'}
              </p>
              {isEditMode && previewCard.lastUpdated && (
                <p className="text-xs text-gray-500 mt-1">
                  Updated {previewCard.lastUpdated}
                </p>
              )}
              {previewCard.sendDate && (
                <p className="text-xs text-gray-500 mt-1">
                  📅 Send: {previewCard.sendDate}
                </p>
              )}
            </div>
            <Badge
              variant={getStatusBadgeVariant()}
              className={cn("text-xs", getStatusBadgeClasses())}
            >
              {getStatusLabel()}
            </Badge>
          </div>
        </div>

        {/* Status Selector for Edit Mode (SUPER_ADMIN/ADMIN only) */}
        {isEditMode && currentStatus && onStatusChange && (
          <div className="mt-3">
            <StatusSelector
              currentStatus={currentStatus}
              onStatusChange={onStatusChange}
              loading={updateLoading}
              entityType={entityType}
            />
          </div>
        )}

        {/* Update button for edit mode */}
        {isEditMode && onUpdate && (
          <Button
            onClick={onUpdate}
            disabled={updateLoading || !hasUnsavedChanges}
            className={cn(
              "w-full mt-3 text-xs h-8",
              hasUnsavedChanges ? `bg-${colorScheme.primary} hover:bg-${colorScheme.primary}/90` : ""
            )}
            variant={hasUnsavedChanges ? "default" : "outline"}
            size="sm"
          >
            {updateLoading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-3 w-3 mr-2" />
                {hasUnsavedChanges ? 'Update Changes' : 'No Changes'}
              </>
            )}
          </Button>
        )}

        {/* Save button for creation mode */}
        {!isEditMode && onSave && (
          <Button
            onClick={onSave}
            disabled={saveLoading || !canSave}
            className={cn(
              "w-full mt-3 text-xs h-8",
              `bg-${colorScheme.primary} hover:bg-${colorScheme.primary}/90`
            )}
            variant="default"
            size="sm"
          >
            {saveLoading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-3 w-3 mr-2" />
                Save eScoop
              </>
            )}
          </Button>
        )}
      </div>

      {/* Steps Navigation */}
      <div className="flex-1 p-6">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-6">Steps</p>
        <div className="space-y-4">
          {stepsWithStatus.map((step, index) => {
            const isClickable = canNavigateToStep?.(step.id) ?? false;
            const Icon = step.icon;
            
            return (
              <div 
                key={step.id}
                className={cn(
                  "flex items-start space-x-3 group",
                  isClickable && "cursor-pointer"
                )}
                onClick={() => handleStepClick(step.id)}
              >
                {/* Step Icon */}
                <div className="flex-shrink-0">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step.status === 'completed' && `bg-green-500 text-white`,
                    step.status === 'active' && `bg-${colorScheme.primary} text-white`,
                    step.status === 'pending' && "bg-gray-200 text-gray-600",
                    isClickable && step.status === 'pending' && "group-hover:bg-gray-300"
                  )}>
                    {step.status === 'completed' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  
                  {/* Connector line */}
                  {index < stepsWithStatus.length - 1 && (
                    <div className="w-px h-8 bg-gray-200 ml-4 mt-2" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    "text-sm font-medium mb-1",
                    step.status === 'active' && "text-gray-900",
                    step.status === 'completed' && "text-gray-900",
                    step.status === 'pending' && "text-gray-500",
                    isClickable && "group-hover:text-gray-900"
                  )}>
                    {step.title}
                  </h4>
                  <p className={cn(
                    "text-xs leading-relaxed",
                    step.status === 'active' && "text-gray-600",
                    step.status === 'completed' && "text-gray-500",
                    step.status === 'pending' && "text-gray-400"
                  )}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}