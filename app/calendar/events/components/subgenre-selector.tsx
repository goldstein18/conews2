/**
 * Subgenre selector component
 * Displays scrollable badges for subgenres with icons and "All" option
 */

'use client';

import {
  List,
  Palette,
  Music2,
  Drama,
  Users,
  Utensils,
  Film,
  Heart,
  GraduationCap,
  Baby,
  type LucideIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Subgenre } from '@/types/genres';

/**
 * Map subgenre names/types to icons
 */
const SUBGENRE_ICONS: Record<string, LucideIcon> = {
  // Music subgenres
  'symphony': Music2,
  'concert': Music2,
  'opera': Drama,
  'festival': Heart,

  // Art subgenres
  'painting': Palette,
  'sculpture': Palette,
  'photography': Palette,

  // Dance subgenres
  'ballet': Users,
  'contemporary': Users,
  'salsa': Users,

  // Culinary
  'culinary': Utensils,
  'food': Utensils,

  // Film
  'film': Film,
  'cinema': Film,

  // Classes
  'class': GraduationCap,
  'workshop': GraduationCap,

  // Kids
  'kids': Baby,
  'children': Baby
};

/**
 * Get icon for subgenre, defaults to List if not found
 */
function getSubgenreIcon(subgenreName: string): LucideIcon {
  const normalizedName = subgenreName.toLowerCase().replace(/\s+/g, '-');
  return SUBGENRE_ICONS[normalizedName] || List;
}

interface SubgenreSelectorProps {
  subgenres: Subgenre[];
  selectedSubgenres: string[];
  onToggleSubgenre: (subgenreId: string) => void;
  onClearSubgenres: () => void;
  loading?: boolean;
  showAllWhenEmpty?: boolean; // Show "All" button even when no subgenres
}

export function SubgenreSelector({
  subgenres,
  selectedSubgenres,
  onToggleSubgenre,
  onClearSubgenres,
  loading = false,
  showAllWhenEmpty = false
}: SubgenreSelectorProps) {
  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto py-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
        ))}
      </div>
    );
  }

  // If no subgenres and showAllWhenEmpty is false, don't show anything
  if (subgenres.length === 0 && !showAllWhenEmpty) {
    return null;
  }

  // Sort subgenres by order
  const sortedSubgenres = [...subgenres].sort((a, b) => a.order - b.order);
  const hasSelection = selectedSubgenres.length > 0;

  return (
    <div className="relative">
      {/* Gradient overlay left (only show if there are subgenres to scroll) */}
      {subgenres.length > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      )}

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {/* "All" button */}
          <Badge
            variant={!hasSelection ? 'default' : 'outline'}
            className={cn(
              "cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors flex-shrink-0",
              "gap-1.5 h-9 px-4 rounded-full"
            )}
            onClick={onClearSubgenres}
          >
            <List className="h-3.5 w-3.5" />
            All
          </Badge>

          {/* Subgenre badges with icons */}
          {sortedSubgenres.map((subgenre) => {
            const isSelected = selectedSubgenres.includes(subgenre.id);
            const SubgenreIcon = getSubgenreIcon(subgenre.name);

            return (
              <Badge
                key={subgenre.id}
                variant={isSelected ? 'default' : 'outline'}
                className={cn(
                  "cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors flex-shrink-0",
                  "h-9 px-4 uppercase text-xs font-medium gap-1.5 rounded-full"
                )}
                style={{
                  backgroundColor: isSelected ? subgenre.color : undefined,
                  borderColor: isSelected ? subgenre.color : undefined,
                  color: isSelected ? 'white' : undefined
                }}
                onClick={() => onToggleSubgenre(subgenre.id)}
              >
                <SubgenreIcon className="h-3.5 w-3.5" />
                {subgenre.display}
              </Badge>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>

      {/* Gradient overlay right (only show if there are subgenres to scroll) */}
      {subgenres.length > 0 && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      )}
    </div>
  );
}
