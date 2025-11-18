import { gql } from '@apollo/client';

/**
 * GraphQL query to get market information by ZIP code
 *
 * Returns market details including:
 * - zip: The ZIP code
 * - market: Market identifier (e.g., "miami", "tampa")
 * - place: City/place name (e.g., "Miami Beach")
 * - state2: Two-letter state code (e.g., "FL")
 */
export const GET_MARKET_BY_ZIPCODE = gql`
  query GetMarketByZipCode($zip: String!) {
    marketByZipCode(zip: $zip) {
      zip
      market
      place
      state2
    }
  }
`;

/**
 * TypeScript interface for the market data returned by the query
 */
export interface MarketData {
  zip: string;
  market: string;
  place: string;
  state2: string;
}

/**
 * TypeScript interface for the GraphQL query response
 */
export interface GetMarketByZipcodeResponse {
  marketByZipCode: MarketData | null;
}

/**
 * TypeScript interface for the GraphQL query variables
 */
export interface GetMarketByZipcodeVariables {
  zip: string;
}
