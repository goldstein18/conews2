"use client";

import { useState, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';
import { UseFormReturn } from 'react-hook-form';
import {
  GET_MARKET_BY_ZIPCODE,
  GetMarketByZipcodeResponse,
  GetMarketByZipcodeVariables
} from '@/lib/graphql/markets';

/**
 * Configuration options for the useZipcodeMarket hook
 */
export interface UseZipcodeMarketOptions {
  /** React Hook Form instance */
  form: UseFormReturn<any>;
  /** Name of the zipcode field in the form */
  zipcodeField: string;
  /** Name of the market field in the form */
  marketField: string;
  /** Optional: Name of the city field in the form */
  cityField?: string;
  /** Optional: Name of the state field in the form */
  stateField?: string;
  /** Optional: Callback when market is successfully fetched */
  onSuccess?: (market: string, place: string, state: string) => void;
  /** Optional: Callback when an error occurs */
  onError?: (error: string) => void;
}

/**
 * Return type for the useZipcodeMarket hook
 */
export interface UseZipcodeMarketReturn {
  /** Whether the market data is being fetched */
  isLoading: boolean;
  /** Error message if the ZIP code is invalid or fetch failed */
  error: string | null;
  /** Function to validate and fetch market data for a ZIP code */
  validateZipCode: (zipcode: string) => Promise<void>;
  /** Clear the error state */
  clearError: () => void;
}

/**
 * Custom hook to automatically fetch and set market data based on ZIP code
 *
 * This hook handles:
 * - Fetching market data from the GraphQL API
 * - Auto-populating market, city, and state fields
 * - Validation of ZIP code format
 * - Error handling for invalid ZIP codes
 * - Loading states
 *
 * @example
 * ```tsx
 * const { isLoading, error, validateZipCode } = useZipcodeMarket({
 *   form,
 *   zipcodeField: 'zipcode',
 *   marketField: 'market',
 *   cityField: 'city',
 *   stateField: 'state'
 * });
 *
 * <Input
 *   onBlur={(e) => validateZipCode(e.target.value)}
 *   {...field}
 * />
 * ```
 */
export function useZipcodeMarket(options: UseZipcodeMarketOptions): UseZipcodeMarketReturn {
  const {
    form,
    zipcodeField,
    marketField,
    cityField,
    stateField,
    onSuccess,
    onError
  } = options;

  const [error, setError] = useState<string | null>(null);

  const [getMarketData, { loading }] = useLazyQuery<
    GetMarketByZipcodeResponse,
    GetMarketByZipcodeVariables
  >(GET_MARKET_BY_ZIPCODE, {
    fetchPolicy: 'network-only', // Always fetch fresh data
    onCompleted: (data) => {
      if (data.marketByZipCode) {
        const { market, place, state2 } = data.marketByZipCode;

        // Set market field (required)
        form.setValue(marketField, market, {
          shouldValidate: true,
          shouldDirty: true
        });

        // Set city field if provided
        if (cityField) {
          form.setValue(cityField, place, {
            shouldValidate: true,
            shouldDirty: true
          });
        }

        // Set state field if provided
        if (stateField) {
          form.setValue(stateField, state2, {
            shouldValidate: true,
            shouldDirty: true
          });
        }

        // Clear any previous errors
        setError(null);

        // Call success callback if provided
        if (onSuccess) {
          onSuccess(market, place, state2);
        }
      } else {
        // ZIP code not found in database
        const errorMessage = 'Invalid ZIP code. Please enter a valid US ZIP code.';
        setError(errorMessage);

        // Clear the market field if ZIP is invalid
        form.setValue(marketField, '', {
          shouldValidate: true
        });

        // Call error callback if provided
        if (onError) {
          onError(errorMessage);
        }
      }
    },
    onError: (err) => {
      // Network error or other GraphQL error
      const errorMessage = 'Unable to verify ZIP code. Please try again.';
      setError(errorMessage);

      console.error('Error fetching market data:', err);

      // Call error callback if provided
      if (onError) {
        onError(errorMessage);
      }
    }
  });

  /**
   * Validate ZIP code format and fetch market data
   */
  const validateZipCode = useCallback(async (zipcode: string) => {
    // Clear previous errors
    setError(null);

    // Trim the zipcode
    const trimmedZip = zipcode?.trim();

    // Don't validate if empty
    if (!trimmedZip) {
      return;
    }

    // Validate ZIP code format (5 digits or 5+4 format)
    const zipRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;
    if (!zipRegex.test(trimmedZip)) {
      const errorMessage = 'Invalid ZIP code format. Use 5 digits (e.g., 33139) or 9 digits (e.g., 33139-1234).';
      setError(errorMessage);

      if (onError) {
        onError(errorMessage);
      }
      return;
    }

    // Extract just the 5-digit ZIP for the query
    const fiveDigitZip = trimmedZip.split('-')[0];

    // Fetch market data
    await getMarketData({
      variables: {
        zip: fiveDigitZip
      }
    });
  }, [getMarketData, onError]);

  /**
   * Clear the error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading: loading,
    error,
    validateZipCode,
    clearError
  };
}
