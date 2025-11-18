/**
 * Market-related utility functions for restaurants
 */

import { MARKETS, type MarketValue } from '@/types/public-restaurants';

/**
 * Get market display name from value
 * Example: "miami" => "Miami"
 */
export function getMarketDisplayName(marketValue: MarketValue | string): string {
  const market = MARKETS.find(m => m.value === marketValue);
  return market?.label || marketValue;
}

/**
 * Get all available markets
 */
export function getAllMarkets() {
  return MARKETS;
}

/**
 * Check if a market value is valid
 */
export function isValidMarket(market: string): market is MarketValue {
  return MARKETS.some(m => m.value === market);
}

/**
 * Get default market
 */
export function getDefaultMarket(): MarketValue {
  return 'miami';
}
