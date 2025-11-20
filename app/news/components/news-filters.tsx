/**
 * News category filters component
 * Displays filter buttons for different news categories
 */

'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export const NEWS_CATEGORIES: NewsCategory[] = [
  { id: 'all', name: 'All', slug: 'all' },
  { id: 'shopping', name: 'Shopping', slug: 'shopping' },
  { id: 'things-to-do', name: 'Things to Do', slug: 'things-to-do' },
  { id: 'art', name: 'Art', slug: 'art' },
  { id: 'restaurants', name: 'Restaurants', slug: 'restaurants' },
];

interface NewsFiltersProps {
  selectedCategory?: string;
  onCategoryChange: (categoryId: string) => void;
}

export function NewsFilters({ selectedCategory = 'all', onCategoryChange }: NewsFiltersProps) {
  return (
    <div className="border-b pb-6 mb-8">
      <div className="flex items-center gap-2 flex-wrap">
        {NEWS_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                'transition-all',
                isSelected && 'font-semibold'
              )}
            >
              {category.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

