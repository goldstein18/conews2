/**
 * Genre routing utilities for events
 * Converts genre names to URL-friendly slugs and vice versa
 * Builds SEO-friendly URLs for genre filtering with nested routes
 */

import { locationToSlug } from './location-slug';

/**
 * Genre slug mapping (for SEO-friendly URLs)
 * Maps genre slugs to their backend genre names
 * IMPORTANT: Must match EXACTLY with backend genre names (from mainGenres query)
 */
export const GENRE_SLUG_MAP: Record<string, string> = {
  'music': 'MUSIC',
  'visual-arts': 'VISUAL_ARTS',
  'performing-arts': 'PERFORMING_ARTS',
  'dance': 'DANCE',
  'theater': 'THEATER',
  'festival': 'FESTIVAL',  // Singular to match backend
  'museum': 'MUSEUM',      // Singular to match backend
  'class': 'CLASS',        // Singular to match backend
  'kids': 'KIDS',
  'art': 'ART',
  'film': 'FILM',
  'literary': 'LITERARY',
  'culinary': 'CULINARY'
};

/**
 * Reverse mapping: genre name to slug
 * Maps backend genre names to URL slugs
 */
export const GENRE_NAME_TO_SLUG: Record<string, string> =
  Object.fromEntries(Object.entries(GENRE_SLUG_MAP).map(([k, v]) => [v, k]));

/**
 * Convert genre slug to genre name
 * Example: "music" -> "MUSIC"
 */
export function slugToGenreName(slug: string): string | null {
  const normalized = slug.toLowerCase();
  const mapped = GENRE_SLUG_MAP[normalized];

  if (!mapped) {
    console.warn(`⚠️ Genre slug "${slug}" not found in GENRE_SLUG_MAP. Available slugs:`, Object.keys(GENRE_SLUG_MAP));
  } else {
    console.log(`✅ slugToGenreName: "${slug}" → "${mapped}"`);
  }

  return mapped || null;
}

/**
 * Convert genre name to slug
 * Example: "MUSIC" -> "music"
 */
export function genreNameToSlug(genreName: string): string | null {
  const normalized = genreName.toUpperCase();
  const slug = GENRE_NAME_TO_SLUG[normalized];

  if (!slug) {
    console.warn(`⚠️ Genre name "${genreName}" (normalized: "${normalized}") not found in GENRE_NAME_TO_SLUG. Available names:`, Object.keys(GENRE_NAME_TO_SLUG));
  } else {
    console.log(`✅ genreNameToSlug: "${genreName}" → "${slug}"`);
  }

  return slug || null;
}

/**
 * Build URL for event filtering based on context
 * Supports various combinations of genre, location, subgenres, and other filters
 */
export function buildEventUrl(options: {
  genre?: string;        // Genre name (e.g., "MUSIC")
  location?: { city: string; state: string };
  subgenres?: string[];  // Subgenre IDs or names
  dateFilter?: string;
  virtual?: boolean;
}): string {
  const { genre, location, subgenres, dateFilter, virtual } = options;

  console.log('🔨 buildEventUrl called:', options);

  let path = '/calendar/events';
  const params = new URLSearchParams();

  // Build path based on genre and location
  if (genre) {
    const genreSlug = genreNameToSlug(genre);
    console.log('🔨 genreNameToSlug result:', { genre, genreSlug });
    if (genreSlug) {
      path += `/${genreSlug}`;

      // If location is provided, create nested route
      if (location) {
        const locationSlug = locationToSlug(location.city, location.state);
        path += `/location/${locationSlug}`;
      }
    } else {
      console.warn('⚠️ genreSlug is null for genre:', genre);
    }
  } else if (location) {
    // Only location, no genre
    const locationSlug = locationToSlug(location.city, location.state);
    path += `/location/${locationSlug}`;
  }

  // Add query parameters (only for filters, not main categories)
  if (subgenres && subgenres.length > 0) {
    params.set('subgenre', subgenres.join(','));
  }
  if (dateFilter) {
    params.set('date', dateFilter.toLowerCase());
  }
  if (virtual !== undefined) {
    params.set('virtual', virtual.toString());
  }

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

/**
 * Parse subgenres from URL search params
 * Example: "?subgenre=jazz,concert" -> ["jazz", "concert"]
 */
export function parseSubgenresFromUrl(searchParams: URLSearchParams): string[] {
  const subgenreParam = searchParams.get('subgenre');
  return subgenreParam ? subgenreParam.split(',').filter(Boolean) : [];
}

/**
 * Parse date filter from URL search params
 */
export function parseDateFilterFromUrl(searchParams: URLSearchParams): string | null {
  return searchParams.get('date');
}

/**
 * Parse virtual filter from URL search params
 */
export function parseVirtualFromUrl(searchParams: URLSearchParams): boolean | undefined {
  const virtualParam = searchParams.get('virtual');
  if (virtualParam === 'true') return true;
  if (virtualParam === 'false') return false;
  return undefined;
}

/**
 * Get display name for genre
 * Example: "MUSIC" -> "Music"
 */
export function getGenreDisplayName(genreName: string): string {
  // Capitalize first letter, lowercase rest, handle special cases
  const formatted = genreName.charAt(0) + genreName.slice(1).toLowerCase();

  // Handle special cases with underscores
  return formatted
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Validate if slug is a valid genre slug
 */
export function isValidGenreSlug(slug: string): boolean {
  return slug.toLowerCase() in GENRE_SLUG_MAP;
}
