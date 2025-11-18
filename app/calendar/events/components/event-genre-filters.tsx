/**
 * Event genre filters component
 * Combines date filter, main genres, and subgenres in a two-row layout
 * Supports intelligent routing for genre-based navigation
 */

'use client';

import { useRouter } from 'next/navigation';
import { DateFilterDropdown } from './date-filter-dropdown';
import { MainGenreSelector } from './main-genre-selector';
import { SubgenreSelector } from './subgenre-selector';
import { useGenreFilters } from '../hooks/use-genre-filters';
import { buildEventUrl } from '../utils';
import type { DateFilterType } from '@/types/public-events';
import { useEffect, useRef } from 'react';

interface EventGenreFiltersProps {
  // Date filter props
  selectedDateFilter: DateFilterType;
  onDateFilterChange: (filter: DateFilterType) => void;

  // Tag names for filtering events (changed from IDs to names)
  onTagNamesChange: (tagNames: string[]) => void;

  // Routing context props
  initialGenreName?: string;
  enableRouting?: boolean;
  locationContext?: { city: string; state: string };
}

export function EventGenreFilters({
  selectedDateFilter,
  onDateFilterChange,
  onTagNamesChange,
  initialGenreName,
  enableRouting = false,
  locationContext
}: EventGenreFiltersProps) {
  const router = useRouter();

  // Track if the change is user-initiated to prevent duplicate queries
  const isUserActionRef = useRef(false);

  // Use genre filters hook (still needed for UI state management)
  const {
    mainGenres,
    subgenres,
    selectedMainGenre,
    selectedSubgenres,
    selectMainGenre,
    toggleSubgenre,
    clearGenreFilters,
    mainGenresLoading,
    subgenresLoading
  } = useGenreFilters();

  // Sync state with URL when genre changes (only when NOT user-initiated)
  useEffect(() => {
    // Skip if this was a user action - handler already called onTagNamesChange
    if (isUserActionRef.current) {
      isUserActionRef.current = false;
      return;
    }

    // If there's a genre name from the URL and it's different from current selection
    if (initialGenreName && initialGenreName !== selectedMainGenre) {
      // Find the genre to get its ID for UI state
      const genre = mainGenres.find(g => g.name.toUpperCase() === initialGenreName.toUpperCase());
      if (genre) {
        selectMainGenre(genre.id);
        onTagNamesChange([initialGenreName]);  // Pass genre NAME directly to backend
      }
    } else if (!initialGenreName && selectedMainGenre) {
      // No genre in URL but one is selected - clear it
      selectMainGenre(null);
      onTagNamesChange([]);
    }
  }, [initialGenreName, selectedMainGenre, mainGenres, selectMainGenre, onTagNamesChange]);

  // Handle main genre selection with intelligent routing
  const handleSelectMainGenre = (genreId: string | null) => {
    // Mark this as a user action to prevent useEffect from calling onTagNamesChange again
    isUserActionRef.current = true;

    const genre = mainGenres.find(g => g.id === genreId);

    // Si clickean el mismo genre que ya está seleccionado, deseleccionar
    if (genreId && genreId === selectedMainGenre) {
      selectMainGenre(null);
      onTagNamesChange([]);  // Clear tag names

      if (enableRouting) {
        if (locationContext) {
          router.push(buildEventUrl({ location: locationContext }));
        } else {
          router.push('/calendar/events');
        }
      }
      return;
    }

    // Si clickean un genre diferente o seleccionan por primera vez
    selectMainGenre(genreId);

    // If deselecting (null), clear tag filters
    if (!genreId || !genre) {
      onTagNamesChange([]);

      // If routing is enabled, navigate back
      if (enableRouting) {
        if (locationContext) {
          router.push(buildEventUrl({ location: locationContext }));
        } else {
          router.push('/calendar/events');
        }
      }
      return;
    }

    // Update tag NAMES (not IDs) - pass genre name directly to backend
    onTagNamesChange([genre.name]);

    // If routing is enabled, navigate to appropriate genre page
    if (enableRouting && genre) {
      // Mark this as an internal navigation to prevent duplicate query on destination page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('lastInternalNavigation', Date.now().toString());
      }

      const url = buildEventUrl({
        genre: genre.name,
        location: locationContext
      });
      router.push(url);
    }
  };

  // Handle subgenre toggle with URL updates
  const handleToggleSubgenre = (subgenreId: string) => {
    // Mark this as a user action
    isUserActionRef.current = true;

    const subgenre = subgenres.find(s => s.id === subgenreId);
    if (!subgenre) return;

    const newSubgenres = selectedSubgenres.includes(subgenreId)
      ? selectedSubgenres.filter(id => id !== subgenreId)
      : [...selectedSubgenres, subgenreId];

    toggleSubgenre(subgenreId);

    // Get subgenre NAMES (not IDs) for backend
    const subgenreNames = newSubgenres
      .map(id => {
        const sub = subgenres.find(s => s.id === id);
        return sub?.name;  // Use the full name, not lowercased
      })
      .filter(Boolean) as string[];

    // Update tag NAMES for the query
    onTagNamesChange(subgenreNames);

    // If routing is enabled, update URL with query strings
    if (enableRouting && selectedMainGenre) {
      const genre = mainGenres.find(g => g.id === selectedMainGenre);
      if (genre) {
        // Get subgenre slugs for URL (lowercase for URL)
        const subgenreSlugs = subgenreNames.map(name => name.toLowerCase());

        const url = buildEventUrl({
          genre: genre.name,
          location: locationContext,
          subgenres: subgenreSlugs
        });

        router.push(url, { scroll: false });
      }
    }
  };

  // Handle clear subgenres (show all)
  const handleClearSubgenres = () => {
    // Mark this as a user action
    isUserActionRef.current = true;

    clearGenreFilters();
    onTagNamesChange([]);  // Clear tag names

    // If routing enabled, navigate to genre page without subgenres
    if (enableRouting && selectedMainGenre) {
      const genre = mainGenres.find(g => g.id === selectedMainGenre);
      if (genre) {
        const url = buildEventUrl({
          genre: genre.name,
          location: locationContext
        });
        router.push(url);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Row 1: Main Genres Only (circular icons) */}
      <div className="w-full">
        <MainGenreSelector
          genres={mainGenres}
          selectedGenreId={selectedMainGenre}
          onSelectGenre={handleSelectMainGenre}
          loading={mainGenresLoading}
        />
      </div>

      {/* Row 2: Date Filter + Subgenres (always visible, centered) */}
      <div className="flex items-center gap-3 justify-center">
        {/* Date filter dropdown */}
        <div className="flex-shrink-0">
          <DateFilterDropdown
            selectedDateFilter={selectedDateFilter}
            onDateFilterChange={onDateFilterChange}
          />
        </div>

        {/* Subgenres selector (always visible, shows all when no main genre selected) */}
        <div className="flex-shrink-0 max-w-4xl">
          <SubgenreSelector
            subgenres={subgenres}
            selectedSubgenres={selectedSubgenres}
            onToggleSubgenre={handleToggleSubgenre}
            onClearSubgenres={handleClearSubgenres}
            loading={subgenresLoading}
            showAllWhenEmpty={!selectedMainGenre}
          />
        </div>
      </div>
    </div>
  );
}
