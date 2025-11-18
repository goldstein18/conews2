/**
 * Location Slug Utilities
 * Functions for converting between location data and URL-friendly slugs
 */

export interface Location {
  city: string;
  state: string;
}

/**
 * Convert a location to a URL-friendly slug
 * @example locationToSlug({ city: 'Miami', state: 'FL' }) => 'miami-fl'
 */
export function locationToSlug(location: Location): string {
  const { city, state } = location;
  return `${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase()}`;
}

/**
 * Parse a location slug back to city and state
 * @example slugToLocation('miami-fl') => { city: 'Miami', state: 'FL' }
 */
export function slugToLocation(slug: string): Location | null {
  const parts = slug.split('-');

  if (parts.length < 2) {
    return null;
  }

  // Last part is state, rest is city
  const state = parts[parts.length - 1].toUpperCase();
  const city = parts
    .slice(0, -1)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return { city, state };
}

/**
 * Get a display name for a location
 * @example getLocationDisplayName('Miami', 'FL') => 'Miami, Florida'
 */
export function getLocationDisplayName(city: string, state: string): string {
  const stateNames: Record<string, string> = {
    FL: 'Florida',
    AL: 'Alabama',
    GA: 'Georgia',
    // Add more states as needed
  };

  const stateName = stateNames[state.toUpperCase()] || state;
  return `${city}, ${stateName}`;
}

/**
 * Validate if a location slug is valid
 */
export function isValidLocationSlug(slug: string): boolean {
  const location = slugToLocation(slug);
  return location !== null && location.city.length > 0 && location.state.length > 0;
}
