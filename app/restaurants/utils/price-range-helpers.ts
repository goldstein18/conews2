/**
 * Price range utility functions and display helpers
 */

import { PriceRange, PRICE_RANGE_LABELS, PRICE_RANGE_NAMES } from '@/types/public-restaurants';

/**
 * Get price range symbol ($, $$, $$$, $$$$)
 */
export function getPriceRangeSymbol(priceRange: PriceRange): string {
  return PRICE_RANGE_LABELS[priceRange] || '$$';
}

/**
 * Get price range name (Budget, Moderate, Upscale, Fine Dining)
 */
export function getPriceRangeName(priceRange: PriceRange): string {
  return PRICE_RANGE_NAMES[priceRange] || 'Moderate';
}

/**
 * Get price range color (for UI elements)
 */
export function getPriceRangeColor(priceRange: PriceRange): string {
  const colors: Record<PriceRange, string> = {
    [PriceRange.BUDGET]: 'text-green-600 bg-green-50',
    [PriceRange.MODERATE]: 'text-blue-600 bg-blue-50',
    [PriceRange.UPSCALE]: 'text-purple-600 bg-purple-50',
    [PriceRange.FINE_DINING]: 'text-amber-600 bg-amber-50'
  };

  return colors[priceRange] || colors[PriceRange.MODERATE];
}

/**
 * Get price range icon/emoji
 */
export function getPriceRangeIcon(priceRange: PriceRange): string {
  const icons: Record<PriceRange, string> = {
    [PriceRange.BUDGET]: '💵',
    [PriceRange.MODERATE]: '💰',
    [PriceRange.UPSCALE]: '💎',
    [PriceRange.FINE_DINING]: '✨'
  };

  return icons[priceRange] || icons[PriceRange.MODERATE];
}

/**
 * Get full price range description
 */
export function getPriceRangeDescription(priceRange: PriceRange): string {
  const descriptions: Record<PriceRange, string> = {
    [PriceRange.BUDGET]: 'Affordable dining options under $15 per person',
    [PriceRange.MODERATE]: 'Mid-range dining between $15-$30 per person',
    [PriceRange.UPSCALE]: 'Premium dining experience $30-$60 per person',
    [PriceRange.FINE_DINING]: 'Luxury fine dining experience over $60 per person'
  };

  return descriptions[priceRange] || descriptions[PriceRange.MODERATE];
}
