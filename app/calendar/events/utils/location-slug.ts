/**
 * Location slug utilities for events
 * Converts city/state to URL-friendly slugs and vice versa
 * Reused from venues pattern
 */

export interface LocationInfo {
  city: string;
  state: string;
}

/**
 * Convert city and state to URL slug
 * Example: "Miami", "FL" -> "miami-fl"
 */
export function locationToSlug(city: string, state: string): string {
  return `${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase()}`;
}

/**
 * Convert slug back to city and state
 * Example: "miami-fl" -> { city: "Miami", state: "FL" }
 */
export function slugToLocation(slug: string): LocationInfo | null {
  const parts = slug.split('-');

  if (parts.length < 2) {
    return null;
  }

  // Last part is state, rest is city
  const state = parts[parts.length - 1].toUpperCase();
  const cityParts = parts.slice(0, -1);
  const city = cityParts
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return { city, state };
}

/**
 * Get display name for location
 * Example: "Miami", "FL" -> "Miami, FL"
 */
export function getLocationDisplayName(city: string, state: string): string {
  return `${city}, ${state}`;
}

/**
 * Validate if slug is a valid location format
 */
export function isValidLocationSlug(slug: string): boolean {
  const parts = slug.split('-');
  return parts.length >= 2 && parts[parts.length - 1].length === 2;
}
