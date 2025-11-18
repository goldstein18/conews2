/**
 * Utilities for converting between location data and URL slugs
 * Example: "Miami, FL" <-> "miami-fl"
 */

export interface LocationData {
  city: string;
  state: string;
}

/**
 * Convert city and state to URL-friendly slug
 * Example: ("Miami", "FL") => "miami-fl"
 */
export function locationToSlug(city: string, state: string): string {
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const stateSlug = state.toLowerCase();
  return `${citySlug}-${stateSlug}`;
}

/**
 * Convert URL slug back to location data
 * Example: "miami-fl" => { city: "Miami", state: "FL" }
 * Returns null if slug format is invalid
 */
export function slugToLocation(slug: string): LocationData | null {
  // Expected format: "city-name-ST" where ST is 2-letter state code
  const parts = slug.split('-');

  if (parts.length < 2) return null;

  // Last part should be the state code (2 letters)
  const stateCode = parts[parts.length - 1];

  // State code should be exactly 2 characters
  if (stateCode.length !== 2) return null;

  // Everything before the last part is the city name
  const cityParts = parts.slice(0, -1);
  const city = cityParts
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return {
    city,
    state: stateCode.toUpperCase()
  };
}

/**
 * Get display name for location
 * Example: { city: "Miami", state: "FL" } => "Miami, FL"
 */
export function getLocationDisplayName(city: string, state: string): string {
  return `${city}, ${state}`;
}

/**
 * Validate location slug format
 */
export function isValidLocationSlug(slug: string): boolean {
  return slugToLocation(slug) !== null;
}
