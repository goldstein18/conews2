'use client';

import { MapPin, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { SearchLocation } from '@/types/search';

interface LocationDisplayProps {
  location: SearchLocation;
  onClear?: () => void;
}

/**
 * Temporary component to display selected location information
 * Shows city, state, and placeholder lat/lng for testing purposes
 * Will be replaced in phase 2 with actual functionality
 */
export function LocationDisplay({ location, onClear }: LocationDisplayProps) {
  // Placeholder coordinates (will be replaced with real data later)
  const placeholderLat = 25.7617 + Math.random() * 2; // Miami area range
  const placeholderLng = -80.1918 + Math.random() * 2;

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">
                {location.city}, {location.state}
              </h3>
              {location.market && (
                <p className="text-sm text-muted-foreground capitalize">
                  Market: {location.market}
                </p>
              )}
              <div className="text-sm text-muted-foreground space-y-0.5 mt-2">
                <p>
                  <span className="font-medium">Latitude:</span>{' '}
                  {placeholderLat.toFixed(4)}
                </p>
                <p>
                  <span className="font-medium">Longitude:</span>{' '}
                  {placeholderLng.toFixed(4)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {location.eventCount || 0} event{(location.eventCount || 0) !== 1 ? 's' : ''} in this location
              </p>
            </div>
          </div>
          {onClear && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={onClear}
              aria-label="Clear location"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
