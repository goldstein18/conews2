/**
 * Image constants for the application
 * Centralizes default and placeholder images for consistency
 */

/**
 * Default fallback image used when entity images fail to load or are not available
 * Features the CultureOwl logo on a gradient background
 *
 * Used across all directory modules:
 * - Events
 * - Venues
 * - Restaurants
 * - Arts Groups
 * - News
 * - Banners
 *
 * Dimensions: Should work with 4:5 aspect ratio (DirectoryCard standard)
 */
export const DEFAULT_IMAGE = '/images/owl.png';

/**
 * Alternative: Full path for absolute URLs (if needed for external sharing)
 */
export const DEFAULT_IMAGE_ABSOLUTE = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/images/owl.png`;

/**
 * Recommended minimum dimensions for entity images
 */
export const IMAGE_DIMENSIONS = {
  /** Standard card image (DirectoryCard) */
  CARD: {
    width: 1080,
    height: 1350, // 4:5 aspect ratio
  },
  /** Hero/banner images */
  HERO: {
    width: 1920,
    height: 1080, // 16:9 aspect ratio
  },
  /** News hero images */
  NEWS_HERO: {
    width: 1200,
    height: 628, // ~1.91:1 aspect ratio (standard news hero)
  },
} as const;
