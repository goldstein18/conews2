import { MARKETS, type MarketValue } from '@/types/public-venues';

/**
 * Get display name for a market value
 */
export const getMarketDisplayName = (market: MarketValue | ''): string => {
  if (!market) return 'All Markets';
  const marketObj = MARKETS.find(m => m.value === market);
  return marketObj?.label || market;
};

/**
 * Get market options for select dropdown
 */
export const getMarketOptions = () => {
  return MARKETS.map(market => ({
    value: market.value,
    label: market.label
  }));
};

/**
 * Validate if a string is a valid market value
 */
export const isValidMarket = (value: string): value is MarketValue => {
  return MARKETS.some(market => market.value === value);
};

/**
 * Get default market (Miami)
 */
export const getDefaultMarket = (): MarketValue => {
  return 'miami';
};
