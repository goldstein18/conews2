/**
 * Genre navigation component
 * Displays circular main genre selector with router navigation
 */

'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { GET_MAIN_GENRES } from '@/lib/graphql/tags';
import { MainGenreSelector } from '@/app/calendar/events/components/main-genre-selector';
import { genreNameToSlug } from '@/app/calendar/events/utils';
import type { MainGenresResponse } from '@/types/genres';

interface GenreNavigationProps {
  currentGenreName: string; // "MUSIC", "ART", "VISUAL_ARTS", etc.
}

export function GenreNavigation({ currentGenreName }: GenreNavigationProps) {
  const router = useRouter();

  // Query for main genres
  const {
    data: mainGenresData,
    loading: mainGenresLoading
  } = useQuery<MainGenresResponse>(GET_MAIN_GENRES, {
    fetchPolicy: 'cache-first'
  });

  const mainGenres = useMemo(() => {
    return mainGenresData?.mainGenres || [];
  }, [mainGenresData]);

  // Find the ID of the current genre by name
  const selectedGenreId = useMemo(() => {
    const normalizedCurrentName = currentGenreName.toUpperCase();
    const currentGenre = mainGenres.find(
      g => g.name.toUpperCase() === normalizedCurrentName
    );
    return currentGenre?.id || null;
  }, [currentGenreName, mainGenres]);

  // Handle genre selection with router navigation
  const handleSelectGenre = (genreId: string | null) => {
    if (!genreId) {
      // If clicking the same genre (to deselect), go to all events
      router.push('/calendar/events');
      return;
    }

    // Find the genre object
    const genre = mainGenres.find(g => g.id === genreId);
    if (!genre) {
      console.warn('⚠️ Genre not found for ID:', genreId);
      return;
    }

    // Convert genre name to slug
    const slug = genreNameToSlug(genre.name);
    if (!slug) {
      console.warn('⚠️ Could not convert genre name to slug:', genre.name);
      return;
    }

    // Navigate to the genre page
    console.log(`🔄 Navigating to /genre/${slug}`);

    // Mark as internal navigation to skip initial query
    sessionStorage.setItem('lastInternalNavigation', Date.now().toString());

    router.push(`/genre/${slug}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <MainGenreSelector
        genres={mainGenres}
        selectedGenreId={selectedGenreId}
        onSelectGenre={handleSelectGenre}
        loading={mainGenresLoading}
      />
    </div>
  );
}
