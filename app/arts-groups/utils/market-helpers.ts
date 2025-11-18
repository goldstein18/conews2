/**
 * Market Helper Utilities
 * Functions for handling market data and display
 */

import type { MarketValue } from '@/types/public-arts-groups';

export const MARKET_DISPLAY_NAMES: Record<MarketValue, string> = {
  miami: 'Miami',
  orlando: 'Orlando',
  tampa: 'Tampa',
  jacksonville: 'Jacksonville',
};

/**
 * Get display name for a market
 */
export function getMarketDisplayName(market: string): string {
  return MARKET_DISPLAY_NAMES[market as MarketValue] || market;
}

/**
 * Get all available markets
 */
export function getAllMarkets(): { value: MarketValue; label: string }[] {
  return [
    { value: 'miami', label: 'Miami' },
    { value: 'orlando', label: 'Orlando' },
    { value: 'tampa', label: 'Tampa' },
    { value: 'jacksonville', label: 'Jacksonville' },
  ];
}

/**
 * Check if a string is a valid market
 */
export function isValidMarket(market: string): market is MarketValue {
  return Object.keys(MARKET_DISPLAY_NAMES).includes(market);
}

/**
 * Get market from URL parameter
 */
export function getMarketFromParam(param: string | null): MarketValue | undefined {
  if (!param) return undefined;
  return isValidMarket(param) ? (param as MarketValue) : undefined;
}
