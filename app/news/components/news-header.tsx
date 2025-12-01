/**
 * News header navigation component
 * Matches Timeout-style header with location selector, category links, and action buttons
 */

'use client';

import { useEffect, useState } from 'react';
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
import { useRouter } from 'next/navigation';

export interface NewsHeaderCategory {
  id: string;
  name: string;
  slug: string;
  href?: string;
}

export const NEWS_HEADER_CATEGORIES: NewsHeaderCategory[] = [
  { id: 'all', name: 'ALL', slug: 'all' },
  { id: 'things-to-do', name: 'THINGS TO DO', slug: 'things-to-do' },
  { id: 'art-museums', name: 'ART & MUSEUMS', slug: 'art-museums' },
  { id: 'culinary', name: 'CULINARY', slug: 'culinary' },
  { id: 'dance', name: 'DANCE', slug: 'dance' },
  { id: 'festivals-and-fairs', name: 'FESTIVALS & FAIRS', slug: 'festivals-and-fairs' },
  { id: 'film', name: 'FILM', slug: 'film' },
  { id: 'music', name: 'MUSIC', slug: 'music' },
  { id: 'theater', name: 'THEATER', slug: 'theater' },
  { id: 'city-guides', name: 'CITY GUIDES', slug: 'city-guides' },
];

export type NewsViewMode = 'cultural' | 'industry';

const NEWS_VIEW_OPTIONS: { id: NewsViewMode; label: string }[] = [
  { id: 'cultural', label: 'Cultural News' },
  { id: 'industry', label: 'Industry News' }
];

// Mock locations for now - can be replaced with real location data
const LOCATIONS = [
  { id: 'greater-atlanta', name: 'GREATER ATLANTA', slug: 'greater-atlanta' },
  { id: 'floridas-west-coast', name: "FLORIDA'S WEST COAST", slug: 'floridas-west-coast' },
  { id: 'the-palm-beaches', name: 'THE PALM BEACHES', slug: 'palm-beaches' },
  { id: 'miami-fort-lauderdale', name: 'MIAMI/FORT LAUDERDALE', slug: 'miami-fort-lauderdale' },
];

interface NewsHeaderProps {
  selectedCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
  selectedLocation?: string;
  onLocationChange?: (locationId: string) => void;
  showIndustryButton?: boolean;
  industryHref?: string;
  categories?: NewsHeaderCategory[];
  viewMode?: NewsViewMode;
  onViewModeChange?: (mode: NewsViewMode) => void;
}

export function NewsHeader({
  selectedCategory,
  onCategoryChange,
  selectedLocation = 'miami',
  onLocationChange,
  showIndustryButton = true,
  industryHref = "/industry-news",
  categories = NEWS_HEADER_CATEGORIES,
  viewMode,
  onViewModeChange
}: NewsHeaderProps) {
  const [currentLocation, setCurrentLocation] = useState(
    LOCATIONS.find(loc => loc.id === selectedLocation) || LOCATIONS[0]
  );
  const [currentViewMode, setCurrentViewMode] = useState<NewsViewMode>(viewMode ?? 'cultural');
  const router = useRouter();

  useEffect(() => {
    if (typeof viewMode !== 'undefined') {
      setCurrentViewMode(viewMode);
    }
  }, [viewMode]);

  const handleLocationSelect = (location: typeof LOCATIONS[0]) => {
    setCurrentLocation(location);
    onLocationChange?.(location.id);
  };

  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange?.(categoryId);
  };

  const handleViewModeChange = (mode: NewsViewMode) => {
    if (currentViewMode === mode) return;
    setCurrentViewMode(mode);
    onViewModeChange?.(mode);
    const destination = mode === 'industry' ? '/industry-news' : '/news';
    router.push(destination);
  };

  return (
    <div className="w-full bg-white sticky top-0 z-40 border-b border-blue-200 shadow-sm">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 py-2 sm:py-3 justify-between">
        {/* Location selector and view toggle */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="bg-[#3d98d3] hover:bg-[#2b85ba] text-white font-normal rounded-md px-2.5 sm:px-3 py-1 h-auto whitespace-nowrap text-sm sm:text-sm shrink-0 border-0 typography-subheader"
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
                    'cursor-pointer typography-subheader',
                    currentLocation.id === location.id && 'bg-blue-50 font-semibold'
                  )}
                >
                  {location.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-0.5 rounded-full bg-white border border-[#3d98d3]/50 p-0.5 shadow-inner">
            {NEWS_VIEW_OPTIONS.map((option) => {
              const isActive = currentViewMode === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleViewModeChange(option.id)}
                  className={cn(
                    'px-3 py-1 text-sm sm:text-sm tracking-[0.15em] rounded-full transition-colors font-normal typography-subheader',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3d98d3]'
                  )}
                style={
                  isActive
                    ? option.id === 'industry'
                      ? { backgroundColor: '#e74e3d', color: '#fff' }
                      : { backgroundColor: '#3d98d3', color: '#fff' }
                    : { backgroundColor: '#fff', color: '#0f172a', opacity: 0.85 }
                }
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

          {/* Industry News Button */}
          {showIndustryButton && (
            <Button
              variant="default"
              className="bg-[#695ba8] hover:bg-[#4c3a8c] text-white font-normal rounded-md px-2.5 sm:px-3 py-1 sm:py-1.5 whitespace-nowrap text-sm sm:text-sm shrink-0 inline-flex typography-subheader"
              asChild
            >
              <Link href={industryHref} target="_blank" rel="noopener noreferrer">
                <span className="hidden sm:inline">INDUSTRY NEWS</span>
                <span className="sm:hidden">INDUSTRY</span>
                <ExternalLink className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          )}

          {/* Category Navigation Links - Scrollable middle section */}
          <div className="flex-1 min-w-0 mx-2 order-last sm:order-none">
            <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {categories.map((category) => {
                const isActive = selectedCategory === category.id;

                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={cn(
                      'text-sm font-normal text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap relative shrink-0 typography-subheader flex items-center py-1 sm:py-1.5',
                      isActive && 'text-blue-600'
                    )}
                  >
                    {category.name}
                    {/* Active indicator underline */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Events Button - Hidden on very small screens */}
          <Button
            variant="default"
            className="bg-[#3d98d3] hover:bg-[#3d98d3] text-white gap-1 font-normal rounded-md px-2.5 sm:px-3 py-1 h-auto whitespace-nowrap text-sm sm:text-sm shrink-0 inline-flex typography-subheader"
            asChild
          >
            <Link href="/calendar/events" target="_blank" rel="noopener noreferrer">
              EVENTS
              <ExternalLink className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </Button>
        </div>
        
        {/* Bottom border line - light blue background */}
        <div className="h-0.5 bg-blue-200 w-full" />
      </div>
    </div>
  );
}

