/**
 * Location slug utilities for SEO-friendly URLs
 * Converts between "City, State" and "city-state" formats
 */

/**
 * Map of US state names to their abbreviations
 */
const STATE_NAME_TO_ABBR: Record<string, string> = {
  'alabama': 'AL',
  'alaska': 'AK',
  'arizona': 'AZ',
  'arkansas': 'AR',
  'california': 'CA',
  'colorado': 'CO',
  'connecticut': 'CT',
  'delaware': 'DE',
  'florida': 'FL',
  'georgia': 'GA',
  'hawaii': 'HI',
  'idaho': 'ID',
  'illinois': 'IL',
  'indiana': 'IN',
  'iowa': 'IA',
  'kansas': 'KS',
  'kentucky': 'KY',
  'louisiana': 'LA',
  'maine': 'ME',
  'maryland': 'MD',
  'massachusetts': 'MA',
  'michigan': 'MI',
  'minnesota': 'MN',
  'mississippi': 'MS',
  'missouri': 'MO',
  'montana': 'MT',
  'nebraska': 'NE',
  'nevada': 'NV',
  'new hampshire': 'NH',
  'new jersey': 'NJ',
  'new mexico': 'NM',
  'new york': 'NY',
  'north carolina': 'NC',
  'north dakota': 'ND',
  'ohio': 'OH',
  'oklahoma': 'OK',
  'oregon': 'OR',
  'pennsylvania': 'PA',
  'rhode island': 'RI',
  'south carolina': 'SC',
  'south dakota': 'SD',
  'tennessee': 'TN',
  'texas': 'TX',
  'utah': 'UT',
  'vermont': 'VT',
  'virginia': 'VA',
  'washington': 'WA',
  'west virginia': 'WV',
  'wisconsin': 'WI',
  'wyoming': 'WY'
};

/**
 * Convert state name to abbreviation
 * @example stateToAbbr('Florida') → 'FL'
 * @example stateToAbbr('FL') → 'FL' (already abbreviated)
 */
function stateToAbbr(state: string): string {
  const normalized = state.toLowerCase().trim();

  // If it's already an abbreviation (2 letters), return uppercase
  if (normalized.length === 2) {
    return normalized.toUpperCase();
  }

  // Look up in map
  const abbr = STATE_NAME_TO_ABBR[normalized];
  if (abbr) {
    return abbr;
  }

  // If not found, return as-is (fallback)
  return state.toUpperCase();
}

/**
 * Convert city and state to URL slug
 * Handles both state abbreviations (FL) and full names (Florida)
 * @example locationToSlug('Key West', 'FL') → 'key-west-fl'
 * @example locationToSlug('Key West', 'Florida') → 'key-west-fl'
 * @example locationToSlug('Miami Beach', 'FL') → 'miami-beach-fl'
 */
export function locationToSlug(city: string, state: string): string {
  const citySlug = city
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^\w-]/g, '');         // Remove non-alphanumeric except hyphens

  // Convert state to abbreviation (handles both "FL" and "Florida")
  const stateAbbr = stateToAbbr(state);
  const stateSlug = stateAbbr.toLowerCase();

  return `${citySlug}-${stateSlug}`;
}

/**
 * Parse URL slug back to city and state
 * @example slugToLocation('key-west-fl') → { city: 'Key West', state: 'FL' }
 * @example slugToLocation('miami-beach-fl') → { city: 'Miami Beach', state: 'FL' }
 * @returns Location object or null if invalid slug format
 */
export function slugToLocation(slug: string): { city: string; state: string } | null {
  if (!slug || typeof slug !== 'string') return null;

  const parts = slug.toLowerCase().split('-');

  // Need at least 2 parts: city + state
  if (parts.length < 2) return null;

  // Last part should be the state (2 letters)
  const statePart = parts[parts.length - 1];
  if (statePart.length !== 2) return null;

  // Everything else is the city name
  const cityParts = parts.slice(0, -1);

  // Capitalize each word in city name
  const city = cityParts
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const state = statePart.toUpperCase();

  return { city, state };
}

/**
 * Validate if a slug is a valid location slug format
 * @example isValidLocationSlug('key-west-fl') → true
 * @example isValidLocationSlug('some-venue') → false
 */
export function isValidLocationSlug(slug: string): boolean {
  return slugToLocation(slug) !== null;
}

/**
 * Get display name from location data
 * @example getLocationDisplayName('Miami', 'FL') → 'Miami, FL'
 */
export function getLocationDisplayName(city: string, state: string): string {
  return `${city}, ${state}`;
}
