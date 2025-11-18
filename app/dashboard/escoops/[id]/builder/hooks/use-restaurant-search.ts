import { useState, useCallback, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_RESTAURANTS, type SearchRestaurant, type SearchRestaurantsVariables, type SearchRestaurantsData } from '@/lib/graphql/restaurants';
import type { ApolloError } from '@apollo/client';

interface UseRestaurantSearchProps {
  market?: string;
  limit?: number;
  enabled?: boolean;
}

interface UseRestaurantSearchReturn {
  restaurants: SearchRestaurant[];
  loading: boolean;
  error: ApolloError | undefined;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  search: (term: string) => void;
  clearResults: () => void;
  loadInitialRestaurants: () => void;
}

export function useRestaurantSearch({
  market,
  limit = 10,
  enabled = true
}: UseRestaurantSearchProps = {}): UseRestaurantSearchReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurants, setRestaurants] = useState<SearchRestaurant[]>([]);

  const [searchRestaurants, { loading, error }] = useLazyQuery<SearchRestaurantsData, SearchRestaurantsVariables>(
    SEARCH_RESTAURANTS,
    {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        if (data?.searchRestaurants) {
          setRestaurants(data.searchRestaurants);
        }
      }
    }
  );

  // Debounced search function
  const search = useCallback((term: string) => {
    if (!enabled) return;

    const variables: SearchRestaurantsVariables = {
      search: term.trim().length > 0 ? term : undefined, // If empty, search all
      limit
    };

    if (market) {
      variables.market = market;
    }

    searchRestaurants({ variables });
  }, [searchRestaurants, market, limit, enabled]);

  // Debounce search by 300ms
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, search]);

  const clearResults = useCallback(() => {
    setRestaurants([]);
    setSearchTerm('');
  }, []);

  const loadInitialRestaurants = useCallback(() => {
    if (!enabled) return;

    const variables: SearchRestaurantsVariables = {
      limit
    };

    if (market) {
      variables.market = market;
    }

    searchRestaurants({ variables });
  }, [searchRestaurants, market, limit, enabled]);

  return {
    restaurants,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    search,
    clearResults,
    loadInitialRestaurants
  };
}