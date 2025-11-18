/**
 * Genre Events Section Component
 * Main orchestrator for all genre-based event carousels
 * Fetches main genres, filters to included genres only, sorts alphabetically, and renders carousels
 * Now fetches real events from API instead of using mock data
 */

'use client';

import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { GET_MAIN_GENRES } from '@/lib/graphql/tags';
import { GenreEventsCarousel } from './genre-events-carousel';
import { usePublicEvents } from '@/app/calendar/events/hooks/use-public-events';
import { Skeleton } from '@/components/ui/skeleton';
import type { MainGenresResponse } from '@/types/genres';
import type { MainGenre } from '@/types/genres';

// Only include these 8 main genres (exclude CULINARY, FILM, LITERARY, PERFORMING_ARTS, VISUAL_ARTS)
const INCLUDED_GENRES = ['ART', 'CLASS', 'DANCE', 'FESTIVAL', 'KIDS', 'MUSEUM', 'MUSIC', 'THEATER'];

/**
 * Wrapper component that fetches events for a specific genre
 */
function GenreCarouselWithData({ genre }: { genre: MainGenre }) {
  // Fetch events for this specific genre using tagNames filter
  const { events: eventEdges, loading } = usePublicEvents({
    first: 20,
    tagNames: [genre.name]  // Filter by genre name
  });

  // Extract event nodes from edges
  const events = eventEdges.map(edge => edge.node);

  // Loading state with skeleton
  if (loading) {
    return (
      <section className="w-full py-8 bg-background">
        <div className="container mx-auto px-4 mb-6">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="overflow-hidden px-4 md:px-8 lg:px-16">
          <div className="flex gap-3 md:gap-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex-[0_0_48%] min-w-0 sm:flex-[0_0_32%] lg:flex-[0_0_19%]"
              >
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Skip if no events for this genre
  if (events.length === 0) {
    return null;
  }

  return (
    <GenreEventsCarousel
      genre={genre}
      events={events}
    />
  );
}

export function GenreEventsSection() {
  // Query for main genres
  const {
    data: mainGenresData,
    loading: mainGenresLoading,
    error: mainGenresError
  } = useQuery<MainGenresResponse>(GET_MAIN_GENRES, {
    fetchPolicy: 'cache-first'
  });

  // Filter to included genres only and sort alphabetically by display name
  const filteredGenres = useMemo(() => {
    if (!mainGenresData?.mainGenres) return [];

    return mainGenresData.mainGenres
      .filter(genre => INCLUDED_GENRES.includes(genre.name))
      .sort((a, b) => a.display.localeCompare(b.display));
  }, [mainGenresData]);

  // Loading state
  if (mainGenresLoading) {
    return (
      <section className="w-full py-8 bg-background">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground">Loading genre events...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (mainGenresError) {
    console.error('Error loading main genres:', mainGenresError);
    return null;
  }

  // No genres found
  if (filteredGenres.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-8 bg-background">
      {/* Render one carousel per genre */}
      {filteredGenres.map((genre) => (
        <GenreCarouselWithData
          key={genre.id}
          genre={genre}
        />
      ))}
    </section>
  );
}
