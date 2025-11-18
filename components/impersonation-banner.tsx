"use client";

import { useEffect, useState, useCallback } from 'react';
import { AlertCircle, X, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useImpersonationStore } from '@/store/impersonation-store';
import { useImpersonationActions } from '@/app/dashboard/impersonate/hooks/use-impersonation-actions';

export function ImpersonationBanner() {
  const {
    isImpersonating,
    targetUserEmail,
    targetUserName,
    originalAdminName,
    getTimeRemaining,
    isExpired,
  } = useImpersonationStore();

  const { endImpersonation, loading: isEnding } = useImpersonationActions();
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  const handleEndImpersonation = useCallback(async () => {
    try {
      await endImpersonation();
    } catch (error) {
      console.error('Error ending impersonation:', error);
      alert('Failed to end impersonation. Please try again.');
    }
  }, [endImpersonation]);

  // Update time remaining every second
  useEffect(() => {
    if (!isImpersonating) return;

    const updateTime = () => {
      const remaining = getTimeRemaining();
      setTimeRemaining(remaining);

      // Auto end if expired
      if (isExpired()) {
        handleEndImpersonation();
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [isImpersonating, getTimeRemaining, isExpired, handleEndImpersonation]);

  if (!isImpersonating) {
    return null;
  }

  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <div>
            <span className="font-semibold text-amber-900 dark:text-amber-100">
              Impersonating:
            </span>{' '}
            <span className="text-amber-800 dark:text-amber-200">
              {targetUserName} ({targetUserEmail})
            </span>
          </div>
          {timeRemaining && (
            <div className="flex items-center space-x-1 text-sm text-amber-700 dark:text-amber-300">
              <Clock className="h-3.5 w-3.5" />
              <span>{timeRemaining}</span>
            </div>
          )}
          {originalAdminName && (
            <div className="text-sm text-amber-600 dark:text-amber-400">
              Original admin: {originalAdminName}
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEndImpersonation}
          disabled={isEnding}
          className="bg-white hover:bg-amber-100 dark:bg-amber-900 dark:hover:bg-amber-800 border-amber-300 dark:border-amber-700"
        >
          {isEnding ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-amber-600 mr-2" />
              Ending...
            </>
          ) : (
            <>
              <X className="h-3.5 w-3.5 mr-1" />
              Stop Impersonation
            </>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
