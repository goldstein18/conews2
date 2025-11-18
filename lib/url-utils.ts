/**
 * URL Utility Functions
 *
 * Smart URL normalization and validation utilities for handling
 * user input across all forms (venues, restaurants, events, etc.)
 */

/**
 * Normalizes a URL by intelligently adding protocol if missing
 *
 * Features:
 * - Auto-prepends protocol (http:// or https://) if missing
 * - Preserves existing protocol (doesn't change http to https or vice versa)
 * - Fixes double protocol issues (https://https://example.com → https://example.com)
 * - Normalizes protocol case (HTTPS:// → https://)
 * - Trims whitespace
 * - Handles empty/null values gracefully
 *
 * @param url - The URL string to normalize
 * @param defaultProtocol - Protocol to use if none exists (default: 'https')
 * @returns Normalized URL string
 *
 * @example
 * normalizeUrl('www.example.com') // → 'https://www.example.com'
 * normalizeUrl('example.com') // → 'https://example.com'
 * normalizeUrl('http://old-site.com') // → 'http://old-site.com' (preserved)
 * normalizeUrl('HTTPS://Site.com') // → 'https://site.com'
 * normalizeUrl('https://https://error.com') // → 'https://error.com' (fixed)
 */
export function normalizeUrl(
  url: string | null | undefined,
  defaultProtocol: 'http' | 'https' = 'https'
): string {
  // Handle empty values
  if (!url || !url.trim()) {
    return '';
  }

  let normalized = url.trim();

  // Check if already has a valid protocol
  const protocolMatch = normalized.match(/^(https?):\/\//i);

  if (protocolMatch) {
    // Normalize the protocol case (HTTPS → https)
    const protocol = protocolMatch[1].toLowerCase();

    // Remove the matched protocol
    normalized = normalized.substring(protocolMatch[0].length);

    // Remove any additional malformed protocols that might have been concatenated
    // e.g., "https://https://example.com" → "example.com"
    normalized = normalized.replace(/^(https?:\/\/)+/gi, '');

    // Return with the original (normalized) protocol
    return `${protocol}://${normalized}`;
  }

  // No protocol found - remove any malformed protocol attempts
  normalized = normalized.replace(/^(https?:\/\/)+/gi, '');

  // Add default protocol
  return `${defaultProtocol}://${normalized}`;
}

/**
 * Validates if a string is a properly formatted URL
 *
 * @param url - The URL string to validate
 * @returns True if valid URL format, false otherwise
 *
 * @example
 * isValidUrl('https://example.com') // → true
 * isValidUrl('www.example.com') // → false (no protocol)
 * isValidUrl('not a url') // → false
 */
export function isValidUrl(url: string | null | undefined): boolean {
  if (!url || !url.trim()) {
    return false;
  }

  try {
    // Use native URL constructor for validation
    const urlObject = new URL(url);

    // Check if protocol is http or https
    return urlObject.protocol === 'http:' || urlObject.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Extracts the domain from a URL
 *
 * @param url - The full URL
 * @returns Just the domain (hostname) or empty string if invalid
 *
 * @example
 * extractDomain('https://www.example.com/path') // → 'www.example.com'
 * extractDomain('http://subdomain.example.com') // → 'subdomain.example.com'
 */
export function extractDomain(url: string | null | undefined): string {
  if (!url || !url.trim()) {
    return '';
  }

  try {
    const urlObject = new URL(url);
    return urlObject.hostname;
  } catch {
    return '';
  }
}

/**
 * Formats a URL for display purposes (removes protocol)
 *
 * @param url - The full URL
 * @returns URL without protocol for cleaner display
 *
 * @example
 * formatUrlForDisplay('https://www.example.com') // → 'www.example.com'
 * formatUrlForDisplay('http://example.com/path') // → 'example.com/path'
 */
export function formatUrlForDisplay(url: string | null | undefined): string {
  if (!url || !url.trim()) {
    return '';
  }

  return url.replace(/^https?:\/\//i, '');
}

/**
 * Validates and normalizes a URL in one step
 * Returns the normalized URL if valid, or empty string if invalid
 *
 * @param url - The URL to validate and normalize
 * @param defaultProtocol - Protocol to use if none exists
 * @returns Normalized URL if valid, empty string if invalid
 *
 * @example
 * validateAndNormalizeUrl('www.example.com') // → 'https://www.example.com'
 * validateAndNormalizeUrl('not a url') // → ''
 */
export function validateAndNormalizeUrl(
  url: string | null | undefined,
  defaultProtocol: 'http' | 'https' = 'https'
): string {
  if (!url || !url.trim()) {
    return '';
  }

  const normalized = normalizeUrl(url, defaultProtocol);

  return isValidUrl(normalized) ? normalized : '';
}

/**
 * Checks if a URL uses HTTPS protocol
 *
 * @param url - The URL to check
 * @returns True if uses HTTPS, false otherwise
 *
 * @example
 * isHttps('https://example.com') // → true
 * isHttps('http://example.com') // → false
 */
export function isHttps(url: string | null | undefined): boolean {
  if (!url || !url.trim()) {
    return false;
  }

  try {
    const urlObject = new URL(url);
    return urlObject.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Converts an HTTP URL to HTTPS
 * Only converts if the URL is currently HTTP
 *
 * @param url - The URL to convert
 * @returns URL with HTTPS protocol
 *
 * @example
 * convertToHttps('http://example.com') // → 'https://example.com'
 * convertToHttps('https://example.com') // → 'https://example.com' (no change)
 */
export function convertToHttps(url: string | null | undefined): string {
  if (!url || !url.trim()) {
    return '';
  }

  return url.replace(/^http:\/\//i, 'https://');
}

/**
 * Social media URL validators for specific platforms
 */
export const socialMediaValidators = {
  facebook: (url: string): boolean => {
    return /^https?:\/\/(www\.)?(facebook|fb)\.com\/.+/i.test(url);
  },

  twitter: (url: string): boolean => {
    return /^https?:\/\/(www\.)?(twitter|x)\.com\/.+/i.test(url);
  },

  instagram: (url: string): boolean => {
    return /^https?:\/\/(www\.)?instagram\.com\/.+/i.test(url);
  },

  youtube: (url: string): boolean => {
    return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/i.test(url);
  },

  tiktok: (url: string): boolean => {
    return /^https?:\/\/(www\.)?tiktok\.com\/@.+/i.test(url);
  }
};
