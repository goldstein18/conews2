/**
 * Main genre selector component
 * Displays circular icons for main genres with horizontal scroll
 */

'use client';

import {
  Palette,
  Music,
  Sparkles,
  Users,
  Building2,
  Drama,
  GraduationCap,
  Baby,
  Utensils,
  Film,
  Mic,
  Heart,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MainGenre } from '@/types/genres';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface MainGenreSelectorProps {
  genres: MainGenre[];
  selectedGenreId: string | null;
  onSelectGenre: (genreId: string | null) => void;
  loading?: boolean;
  size?: 'default' | 'large'; // Add size variant
  showLabels?: boolean; // Option to hide labels
}

/**
 * Map genre names to Lucide icons
 * Add more mappings as needed
 */
const GENRE_ICONS: Record<string, LucideIcon> = {
  'visual-arts': Palette,
  'music': Music,
  'festivals': Sparkles,
  'dance': Users,
  'museums': Building2,
  'theater': Drama,
  'classes': GraduationCap,
  'kids': Baby,
  'culinary': Utensils,
  'film': Film,
  'performance': Mic,
  'fundraiser': Heart
};

/**
 * Get icon component for genre
 * Falls back to Sparkles if not found
 */
function getGenreIcon(genreName: string): LucideIcon {
  const normalizedName = genreName.toLowerCase().replace(/\s+/g, '-');
  return GENRE_ICONS[normalizedName] || Sparkles;
}

export function MainGenreSelector({
  genres,
  selectedGenreId,
  onSelectGenre,
  loading = false,
  size = 'default',
  showLabels = true
}: MainGenreSelectorProps) {
  // Dynamic sizing classes
  const circleSize = size === 'large' ? 'w-20 h-20 md:w-24 md:h-24' : 'w-16 h-16';
  const iconSize = size === 'large' ? 'w-10 h-10 md:w-12 md:h-12' : 'w-8 h-8';
  const gapSize = size === 'large' ? 'gap-4 md:gap-6' : 'gap-4';

  if (loading) {
    return (
      <div className={cn("flex overflow-x-auto py-2", gapSize)}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className={cn(circleSize, "rounded-full bg-gray-200 animate-pulse")} />
            {showLabels && <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />}
          </div>
        ))}
      </div>
    );
  }

  if (genres.length === 0) {
    return null;
  }

  // Sort genres by order
  const sortedGenres = [...genres].sort((a, b) => a.order - b.order);

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className={cn("flex pb-2 justify-center", gapSize)}>
        {sortedGenres.map((genre) => {
          const Icon = getGenreIcon(genre.name);
          const isSelected = selectedGenreId === genre.id;

          return (
            <button
              key={genre.id}
              onClick={() => onSelectGenre(isSelected ? null : genre.id)}
              className="flex flex-col items-center gap-2 p-2 transition-all flex-shrink-0 group"
              title={genre.display}
            >
              <div
                className={cn(
                  circleSize,
                  "rounded-full flex items-center justify-center",
                  "border-2 transition-all duration-200",
                  isSelected
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white border-gray-300 text-gray-600 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500"
                )}
              >
                <Icon className={iconSize} />
              </div>
              {showLabels && (
                <span className={cn(
                  "text-xs font-medium uppercase text-center max-w-[80px] truncate",
                  isSelected ? "font-semibold text-blue-500" : "text-gray-600"
                )}>
                  {genre.display}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" className="h-2" />
    </ScrollArea>
  );
}
