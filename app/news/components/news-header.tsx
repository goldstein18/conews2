/**
 * News header navigation component
 * Matches Timeout-style header with location selector, category links, and action buttons
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface NewsHeaderCategory {
  id: string;
  name: string;
  slug: string;
  href?: string;
}

export const NEWS_HEADER_CATEGORIES: NewsHeaderCategory[] = [
  { id: 'things-to-do', name: 'THINGS TO DO', slug: 'things-to-do' },
  { id: 'art', name: 'ART & MUSEUMS', slug: 'art' },
  { id: 'dance', name: 'DANCE', slug: 'dance' },
  { id: 'festivals', name: 'FESTIVALS', slug: 'festivals' },
  { id: 'film', name: 'FILM', slug: 'film' },
  { id: 'theater', name: 'THEATER', slug: 'theater' },
  { id: 'city-guides', name: 'CITY GUIDES', slug: 'city-guides' },
];

// Mock locations for now - can be replaced with real location data
const LOCATIONS = [
  { id: 'miami', name: 'MIAMI', slug: 'miami' },
  { id: 'new-york', name: 'NEW YORK', slug: 'new-york' },
  { id: 'los-angeles', name: 'LOS ANGELES', slug: 'los-angeles' },
  { id: 'chicago', name: 'CHICAGO', slug: 'chicago' },
  { id: 'orlando', name: 'ORLANDO', slug: 'orlando' },
];

interface NewsHeaderProps {
  selectedCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
  selectedLocation?: string;
  onLocationChange?: (locationId: string) => void;
}

export function NewsHeader({
  selectedCategory,
  onCategoryChange,
  selectedLocation = 'miami',
  onLocationChange
}: NewsHeaderProps) {
  const [currentLocation, setCurrentLocation] = useState(
    LOCATIONS.find(loc => loc.id === selectedLocation) || LOCATIONS[0]
  );

  const handleLocationSelect = (location: typeof LOCATIONS[0]) => {
    setCurrentLocation(location);
    onLocationChange?.(location.id);
  };

  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange?.(categoryId);
  };

  return (
    <div className="w-full bg-white sticky top-0 z-[60] border-b border-blue-200 shadow-sm">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Top row: Location and action buttons */}
        <div className="flex items-center gap-2 sm:gap-4 py-2 sm:py-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Location Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-3 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap text-xs sm:text-sm shrink-0"
              >
                <span className="hidden sm:inline">{currentLocation.name}</span>
                <span className="sm:hidden">{currentLocation.name.split(' ')[0]}</span>
                <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[200px]">
              {LOCATIONS.map((location) => (
                <DropdownMenuItem
                  key={location.id}
                  onClick={() => handleLocationSelect(location)}
                  className={cn(
                    'cursor-pointer',
                    currentLocation.id === location.id && 'bg-blue-50 font-semibold'
                  )}
                >
                  {location.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Industry News Button - Hidden on very small screens */}
          <Button
            variant="default"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md px-3 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap text-xs sm:text-sm shrink-0 hidden xs:inline-flex"
            asChild
          >
            <Link href="/dashboard/news" target="_blank" rel="noopener noreferrer">
              <span className="hidden sm:inline">INDUSTRY NEWS</span>
              <span className="sm:hidden">INDUSTRY</span>
              <ExternalLink className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </Button>

          {/* Events Button - Hidden on very small screens */}
          <Button
            variant="default"
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-md px-3 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap text-xs sm:text-sm shrink-0 hidden xs:inline-flex"
            asChild
          >
            <Link href="/calendar/events" target="_blank" rel="noopener noreferrer">
              EVENTS
              <ExternalLink className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </Button>
        </div>

        {/* Category Navigation Links - Scrollable row */}
        <div className="flex items-center gap-3 sm:gap-6 pb-2 sm:pb-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {NEWS_HEADER_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  'text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap relative pb-1 shrink-0',
                  isActive && 'text-blue-600'
                )}
              >
                {category.name}
                {/* Active indicator underline */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 -mb-0.5 z-10" />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Bottom border line - light blue background */}
        <div className="h-0.5 bg-blue-200 w-full" />
      </div>
    </div>
  );
}

