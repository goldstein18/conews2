/**
 * Home page genre navigation component
 * Displays circular main genre selector with navigation to genre pages
 */

'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { GET_MAIN_GENRES } from '@/lib/graphql/tags';
import { MainGenreSelector } from '@/app/calendar/events/components/main-genre-selector';
import { genreNameToSlug } from '@/app/calendar/events/utils/genre-routing';
import type { MainGenresResponse } from '@/types/genres';

export function HomeGenreNavigation() {
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

  // Handle genre selection with router navigation
  const handleSelectGenre = (genreId: string | null) => {
    if (!genreId) {
      // If genreId is null, navigate to all events
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
    router.push(`/genre/${slug}`);
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <MainGenreSelector
        genres={mainGenres}
        selectedGenreId={null} // No selection on home page
        onSelectGenre={handleSelectGenre}
        loading={mainGenresLoading}
        size="large" // Large buttons for home page
        showLabels={true} // Show labels below icons
      />
    </section>
  );
}
