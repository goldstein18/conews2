"use client";

import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutoSaveIndicatorProps {
  isAutoSaving: boolean;
  lastSaved?: Date;
  autoSaveEnabled: boolean;
  className?: string;
}

export function AutoSaveIndicator({
  isAutoSaving,
  lastSaved,
  autoSaveEnabled,
  className
}: AutoSaveIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!autoSaveEnabled) {
    return null;
  }

  const getStatusText = () => {
    if (!isOnline) return "Offline - changes saved locally";
    if (isAutoSaving) return "Saving...";
    if (lastSaved) {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
      if (diffInSeconds < 60) return "Saved just now";
      if (diffInSeconds < 3600) return `Saved ${Math.floor(diffInSeconds / 60)}m ago`;
      return `Saved ${Math.floor(diffInSeconds / 3600)}h ago`;
    }
    return "Auto-save enabled";
  };

  const getStatusColor = () => {
    if (!isOnline) return "destructive";
    if (isAutoSaving) return "default";
    return "secondary";
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="h-3 w-3" />;
    if (isAutoSaving) return <Clock className="h-3 w-3 animate-pulse" />;
    return <CheckCircle className="h-3 w-3" />;
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge variant={getStatusColor()} className="flex items-center gap-1 text-xs">
        {getStatusIcon()}
        {getStatusText()}
      </Badge>
      
      {isOnline && (
        <div className="flex items-center gap-1">
          <Wifi className="h-3 w-3 text-green-500" />
          <span className="text-xs text-green-600">Online</span>
        </div>
      )}
    </div>
  );
}