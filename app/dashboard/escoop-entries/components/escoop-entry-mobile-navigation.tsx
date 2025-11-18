'use client';

import { ArrowLeft, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { EscoopSearchResult, EventSearchResult } from '@/types/escoop-entries';

interface EscoopEntryMobileNavigationProps {
  currentStep: number;
  totalSteps: number;
  selectedEscoop?: EscoopSearchResult | null;
  selectedEvent?: EventSearchResult | null;
  companyName?: string;
  onBack?: () => void;
}

export function EscoopEntryMobileNavigation({
  currentStep,
  totalSteps,
  selectedEscoop,
  selectedEvent,
  companyName,
  onBack
}: EscoopEntryMobileNavigationProps) {
  const progress = (currentStep / totalSteps) * 100;

  const getTitle = () => {
    if (selectedEvent) {
      return selectedEvent.title;
    }
    if (selectedEscoop) {
      return `Entry for ${selectedEscoop.name}`;
    }
    return 'New Escoop Entry';
  };

  const getStatus = () => {
    if (selectedEvent && selectedEscoop) {
      return 'Ready to submit';
    }
    if (selectedEscoop) {
      return 'Select an event';
    }
    return 'Getting started';
  };

  return (
    <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        {onBack ? (
          <Button variant="ghost" size="sm" onClick={onBack} className="p-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        ) : (
          <Link href="/dashboard/escoop-entries">
            <Button variant="ghost" size="sm" className="p-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        )}

        <div className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2 mb-3" />

      {/* Preview Card */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-3">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-50 rounded-full flex items-center justify-center flex-shrink-0">
            {selectedEvent ? (
              <Calendar className="h-5 w-5 text-blue-500" />
            ) : (
              <Mail className="h-5 w-5 text-blue-500" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-sm truncate">
              {getTitle()}
            </h3>

            {companyName && (
              <p className="text-xs text-gray-600 mb-1">
                {companyName}
              </p>
            )}

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600">
                {getStatus()}
              </p>
              <Badge variant="secondary" className="text-xs">
                Draft
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}