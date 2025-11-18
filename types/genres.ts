/**
 * Genre types for event filtering
 * Main genres and subgenres for the public events directory
 */

export type GenreType = 'MAIN_GENRE' | 'SUBGENRE' | 'SUPPORTING' | 'AUDIENCE';

/**
 * Main Genre (Parent category)
 * Examples: Music, Visual Arts, Theater, etc.
 */
export interface MainGenre {
  id: string;
  name: string;
  display: string;
  type: GenreType;
  color: string;
  order: number;
  isActive?: boolean;
}

/**
 * Subgenre (Child category)
 * Examples: Jazz, Rock, Classical (under Music)
 */
export interface Subgenre {
  id: string;
  name: string;
  display: string;
  type: GenreType;
  parentId: string; // ID of parent main genre
  mainGenre?: string; // Name of parent main genre
  color: string;
  order: number;
  isActive?: boolean;
}

/**
 * GraphQL response types
 */
export interface MainGenresResponse {
  mainGenres: MainGenre[];
}

export interface SubgenresResponse {
  subgenres: Subgenre[];
}

export interface SubgenresVariables {
  mainGenre?: string;
}

/**
 * Genre filter state
 */
export interface GenreFilters {
  selectedMainGenre: string | null;
  selectedSubgenres: string[];
}
