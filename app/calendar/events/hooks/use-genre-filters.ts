/**
 * Hook for genre filtering (main genres and subgenres)
 * Fetches genres from GraphQL and manages selection state
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MAIN_GENRES, GET_SUBGENRES } from '@/lib/graphql/tags';
import type {
  MainGenre,
  Subgenre,
  MainGenresResponse,
  SubgenresResponse,
  SubgenresVariables
} from '@/types/genres';
import type { ApolloError } from '@apollo/client';

export interface UseGenreFiltersOptions {
  defaultMainGenre?: string | null;
  defaultSubgenres?: string[];
}

export interface UseGenreFiltersReturn {
  // Data
  mainGenres: MainGenre[];
  subgenres: Subgenre[];

  // Selection state
  selectedMainGenre: string | null;
  selectedSubgenres: string[];

  // Actions
  selectMainGenre: (genreId: string | null) => void;
  toggleSubgenre: (subgenreId: string) => void;
  clearGenreFilters: () => void;
  findGenreIdByName: (genreName: string) => string | null;
  findSubgenreIdByName: (subgenreName: string) => string | null;

  // Loading states
  mainGenresLoading: boolean;
  subgenresLoading: boolean;

  // Errors
  mainGenresError: ApolloError | undefined;
  subgenresError: ApolloError | undefined;
}

/**
 * Hook to manage genre filtering with GraphQL queries
 */
export const useGenreFilters = ({
  defaultMainGenre = null,
  defaultSubgenres = []
}: UseGenreFiltersOptions = {}): UseGenreFiltersReturn => {
  // State for selected genres
  const [selectedMainGenre, setSelectedMainGenre] = useState<string | null>(defaultMainGenre);
  const [selectedSubgenres, setSelectedSubgenres] = useState<string[]>(defaultSubgenres);

  // Query for main genres
  const {
    data: mainGenresData,
    loading: mainGenresLoading,
    error: mainGenresError
  } = useQuery<MainGenresResponse>(GET_MAIN_GENRES, {
    fetchPolicy: 'cache-first'
  });

  // Extract main genres data first
  const mainGenres = useMemo(() => {
    return mainGenresData?.mainGenres || [];
  }, [mainGenresData]);

  // Get the name of the selected main genre for the query
  const selectedMainGenreName = useMemo(() => {
    if (!selectedMainGenre) return 'MUSIC'; // Default to MUSIC
    const genre = mainGenres.find(g => g.id === selectedMainGenre);
    return genre?.name.toUpperCase() || 'MUSIC';
  }, [selectedMainGenre, mainGenres]);

  // Query for subgenres (filtered by selected main genre name, defaults to MUSIC)
  const {
    data: subgenresData,
    loading: subgenresLoading,
    error: subgenresError
  } = useQuery<SubgenresResponse, SubgenresVariables>(GET_SUBGENRES, {
    variables: {
      mainGenre: selectedMainGenreName // Use genre NAME (e.g., "MUSIC", "ART"), not ID
    },
    fetchPolicy: 'cache-first'
  });

  const subgenres = useMemo(() => {
    return subgenresData?.subgenres || [];
  }, [subgenresData]);

  // Select main genre
  const selectMainGenre = useCallback((genreId: string | null) => {
    setSelectedMainGenre(genreId);
    // Clear subgenres when changing main genre
    setSelectedSubgenres([]);
  }, []);

  // Toggle subgenre selection
  const toggleSubgenre = useCallback((subgenreId: string) => {
    setSelectedSubgenres(prev =>
      prev.includes(subgenreId)
        ? prev.filter(id => id !== subgenreId)
        : [...prev, subgenreId]
    );
  }, []);

  // Clear all genre filters
  const clearGenreFilters = useCallback(() => {
    setSelectedMainGenre(null);
    setSelectedSubgenres([]);
  }, []);

  // Find genre ID by name
  const findGenreIdByName = useCallback((genreName: string): string | null => {
    const genre = mainGenres.find(g => g.name.toUpperCase() === genreName.toUpperCase());
    console.log(`🔍 findGenreIdByName: "${genreName}" →`, genre ? `${genre.id} (${genre.name})` : 'NOT FOUND', {
      availableGenres: mainGenres.map(g => ({ id: g.id, name: g.name }))
    });
    return genre?.id || null;
  }, [mainGenres]);

  // Find subgenre ID by name
  const findSubgenreIdByName = useCallback((subgenreName: string): string | null => {
    const subgenre = subgenres.find(s => s.name.toLowerCase() === subgenreName.toLowerCase());
    return subgenre?.id || null;
  }, [subgenres]);

  return {
    mainGenres,
    subgenres,
    selectedMainGenre,
    selectedSubgenres,
    selectMainGenre,
    toggleSubgenre,
    clearGenreFilters,
    findGenreIdByName,
    findSubgenreIdByName,
    mainGenresLoading,
    subgenresLoading,
    mainGenresError,
    subgenresError
  };
};
