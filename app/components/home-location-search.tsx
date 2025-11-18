/**
 * Home page location search section
 * Displays location search with selected location info
 * Positioned between genre navigation and featured events
 */

'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { LocationSearch, LocationDisplay } from '@/components/search';
import { useLocationSearch } from '@/hooks/use-location-search';
import type { SearchLocation } from '@/types/search';

export function HomeLocationSearch() {
  const [selectedLocation, setSelectedLocation] = useState<SearchLocation | null>(null);

  const handleLocationSelect = (location: SearchLocation) => {
    setSelectedLocation(location);
  };

  const handleClearLocation = () => {
    setSelectedLocation(null);
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Find Events Near You</h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Search for events happening in your city
          </p>
        </div>

        {/* Location Search */}
        <div className="max-w-2xl mx-auto mb-6">
          <LocationSearch
            useSearch={useLocationSearch}
            onLocationSelect={handleLocationSelect}
            placeholder="Search for a city..."
            className="w-full"
          />
        </div>

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="flex justify-center">
            <LocationDisplay
              location={selectedLocation}
              onClear={handleClearLocation}
            />
          </div>
        )}
      </div>
    </section>
  );
}
