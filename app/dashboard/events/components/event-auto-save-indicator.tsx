'use client';

import { useState, useEffect } from 'react';
import { Check, Clock, AlertCircle, Loader2, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAutoSave, type AutoSaveStatus } from '@/store/event-draft-store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// Using popover as tooltip alternative since tooltip component doesn't exist
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface AutoSaveIndicatorProps {
  className?: string;
  onManualSave?: () => Promise<void>;
  showManualSave?: boolean;
}

export function EventAutoSaveIndicator({ 
  className, 
  onManualSave,
  showManualSave = false 
}: AutoSaveIndicatorProps) {
  const { 
    autoSaveStatus, 
    lastSaved, 
    hasChanges, 
    lastError,
    retryCount,
    immediateAutoSave,
    getMetrics,
    dirtyFields
  } = useAutoSave();
  
  // Get performance metrics
  const metrics = getMetrics ? getMetrics() : null;
  const [optimisticSaveCount, setOptimisticSaveCount] = useState(0);
  
  const [isOnline, setIsOnline] = useState(true);
  const [isManualSaving, setIsManualSaving] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [lastOptimisticUpdate, setLastOptimisticUpdate] = useState<Date | null>(null);
  
  // Track optimistic updates for better UX
  useEffect(() => {
    if (hasChanges && Object.keys(dirtyFields || {}).length > 0) {
      setLastOptimisticUpdate(new Date());
      setOptimisticSaveCount(prev => prev + 1);
    }
  }, [hasChanges, dirtyFields]);
  
  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Format last saved time
  const formatLastSaved = (date: Date | null) => {
    if (!date) return 'Never';
    
    // Ensure date is a Date object
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    
    if (diffSeconds < 10) return 'Just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    return dateObj.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Handle manual save
  const handleManualSave = async () => {
    if (!onManualSave || !hasChanges) return;
    
    setIsManualSaving(true);
    try {
      await immediateAutoSave(onManualSave);
    } finally {
      setIsManualSaving(false);
    }
  };
  
  // Determine status display
  const getStatusConfig = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        text: 'Offline',
        variant: 'destructive' as const,
        className: 'text-red-600',
        description: 'No internet connection. Changes will be saved when connection is restored.'
      };
    }
    
    switch (autoSaveStatus) {
      case 'saving':
        return {
          icon: Loader2,
          text: 'Saving...',
          variant: 'secondary' as const,
          className: 'text-blue-600 animate-spin',
          description: 'Your changes are being saved automatically.'
        };
      
      case 'saved':
        return {
          icon: hasChanges ? Clock : Check,
          text: hasChanges ? 'Unsaved changes' : 'Saved',
          variant: hasChanges ? 'outline' as const : 'default' as const,
          className: hasChanges ? 'text-amber-600' : 'text-green-600',
          description: hasChanges 
            ? 'You have unsaved changes. They will be auto-saved shortly.'
            : `Last saved ${formatLastSaved(lastSaved)}`
        };
      
      case 'error':
        return {
          icon: AlertCircle,
          text: retryCount > 2 ? 'Save failed' : 'Retrying...',
          variant: 'destructive' as const,
          className: 'text-red-600',
          description: lastError || 'Failed to save changes automatically. You can try saving manually.'
        };
      
      default:
        return {
          icon: Clock,
          text: 'Ready',
          variant: 'outline' as const,
          className: 'text-gray-600',
          description: 'Auto-save is ready. Start typing to see changes saved automatically.'
        };
    }
  };
  
  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;
  
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* Status Badge */}
      <Popover open={showTooltip} onOpenChange={setShowTooltip}>
        <PopoverTrigger asChild>
          <Badge 
            variant={statusConfig.variant}
            className={cn(
              'flex items-center space-x-1 cursor-help',
              statusConfig.variant === 'destructive' && 'bg-red-50 text-red-700 border-red-200',
              statusConfig.variant === 'default' && 'bg-green-50 text-green-700 border-green-200',
              statusConfig.variant === 'secondary' && 'bg-blue-50 text-blue-700 border-blue-200'
            )}
          >
            <StatusIcon className={cn('h-3 w-3', statusConfig.className)} />
            <span className="text-xs font-medium">{statusConfig.text}</span>
          </Badge>
        </PopoverTrigger>
        <PopoverContent side="bottom" className="max-w-sm p-4">
          <div className="space-y-3">
            {/* Status Description */}
            <div>
              <p className="text-sm font-medium mb-1">{statusConfig.text}</p>
              <p className="text-xs text-muted-foreground">{statusConfig.description}</p>
            </div>
            
            {/* Save Information */}
            <div className="border-t pt-3">
              {lastSaved && (
                <p className="text-xs text-muted-foreground">
                  Last saved: {formatLastSaved(lastSaved)}
                </p>
              )}
              {lastOptimisticUpdate && (
                <p className="text-xs text-blue-600 mt-1">
                  ✨ Optimistic update: {formatLastSaved(lastOptimisticUpdate)}
                </p>
              )}
              {retryCount > 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  ⚠️ Retry attempts: {retryCount}
                </p>
              )}
            </div>
            
            {/* Performance Metrics */}
            {metrics && (
              <div className="border-t pt-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Performance</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="text-green-600 font-medium">{metrics.totalSaves}</span>
                    <span className="ml-1">Total saves</span>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">{metrics.batchedSaves}</span>
                    <span className="ml-1">Batched</span>
                  </div>
                  <div>
                    <span className="text-purple-600 font-medium">{optimisticSaveCount}</span>
                    <span className="ml-1">Optimistic</span>
                  </div>
                  <div>
                    <span className="text-orange-600 font-medium">{metrics.averageDebounceTime.toFixed(0)}ms</span>
                    <span className="ml-1">Avg time</span>
                  </div>
                  {metrics.failureCount > 0 && (
                    <div className="col-span-2">
                      <span className="text-red-600 font-medium">{metrics.failureCount}</span>
                      <span className="ml-1">Failures</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Dirty Fields Information */}
            {dirtyFields && Object.keys(dirtyFields).length > 0 && (
              <div className="border-t pt-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Pending Changes</p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(dirtyFields).slice(0, 5).map(([fieldName]) => (
                    <Badge 
                      key={fieldName} 
                      variant="outline" 
                      className="text-xs px-1 py-0"
                    >
                      {fieldName}
                    </Badge>
                  ))}
                  {Object.keys(dirtyFields).length > 5 && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      +{Object.keys(dirtyFields).length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
        
        {/* Manual Save Button */}
        {showManualSave && (hasChanges || autoSaveStatus === 'error') && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleManualSave}
            disabled={isManualSaving || !isOnline}
            className="h-6 px-2 text-xs"
          >
            {isManualSaving ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-3 w-3 mr-1" />
                Save now
              </>
            )}
          </Button>
        )}
        
        {/* Network Status */}
        {!isOnline && (
          <div title="You're offline. Changes will be saved when connection is restored.">
            <WifiOff className="h-4 w-4 text-red-500" />
          </div>
        )}
      </div>
  );
}

// Enhanced simplified version for forms with optimistic updates
export function AutoSaveStatus() {
  const { autoSaveStatus, hasChanges, lastSaved, dirtyFields } = useAutoSave();
  const [showOptimistic, setShowOptimistic] = useState(false);
  const [optimisticTimer, setOptimisticTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Show optimistic update feedback
  useEffect(() => {
    if (hasChanges && Object.keys(dirtyFields || {}).length > 0) {
      setShowOptimistic(true);
      
      // Clear optimistic feedback after a short time
      if (optimisticTimer) clearTimeout(optimisticTimer);
      const timer = setTimeout(() => {
        setShowOptimistic(false);
      }, 1500);
      setOptimisticTimer(timer);
    }
    
    return () => {
      if (optimisticTimer) clearTimeout(optimisticTimer);
    };
  }, [hasChanges, dirtyFields, optimisticTimer]);
  
  if (autoSaveStatus === 'saving') {
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Saving...
      </div>
    );
  }
  
  // Show optimistic feedback for better UX
  if (showOptimistic && hasChanges) {
    return (
      <div className="flex items-center text-sm text-blue-600">
        <div className="h-4 w-4 mr-2 rounded-full bg-blue-600 animate-pulse" />
        <span className="animate-pulse">Changes detected...</span>
      </div>
    );
  }
  
  if (hasChanges) {
    const dirtyCount = Object.keys(dirtyFields || {}).length;
    return (
      <div className="flex items-center text-sm text-amber-600">
        <Clock className="h-4 w-4 mr-2" />
        Unsaved changes {dirtyCount > 0 && `(${dirtyCount} fields)`}
      </div>
    );
  }
  
  if (autoSaveStatus === 'saved' && lastSaved) {
    const dateObj = lastSaved instanceof Date ? lastSaved : new Date(lastSaved);
    const isRecent = !isNaN(dateObj.getTime()) && new Date().getTime() - dateObj.getTime() < 5000;
    
    return (
      <div className="flex items-center text-sm text-green-600">
        <Check className="h-4 w-4 mr-2" />
        Saved {isRecent ? 'just now' : 'automatically'}
      </div>
    );
  }
  
  return null;
}