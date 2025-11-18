import { useState, useCallback, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_EVENTS, type SearchEvent, type SearchEventsVariables, type SearchEventsData } from '@/lib/graphql/events';
import type { ApolloError } from '@apollo/client';

interface UseEventSearchProps {
  companyId?: string;
  enabled?: boolean;
}

interface UseEventSearchReturn {
  events: SearchEvent[];
  loading: boolean;
  error: ApolloError | undefined;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  search: (term: string) => void;
  clearResults: () => void;
  loadInitialEvents: () => void;
}

export function useEventSearch({
  companyId,
  enabled = true
}: UseEventSearchProps = {}): UseEventSearchReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<SearchEvent[]>([]);

  const [searchEvents, { loading, error }] = useLazyQuery<SearchEventsData, SearchEventsVariables>(
    SEARCH_EVENTS,
    {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        if (data?.searchEvents) {
          setEvents(data.searchEvents);
        }
      }
    }
  );

  // Debounced search function
  const search = useCallback((term: string) => {
    if (!enabled) return;

    const variables: SearchEventsVariables = {
      input: {
        search: term.trim().length > 0 ? term : '', // Empty string for all events
      }
    };

    if (companyId) {
      variables.input!.companyId = companyId;
    }

    searchEvents({ variables });
  }, [searchEvents, companyId, enabled]);

  // Debounce search by 300ms
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, search]);

  const clearResults = useCallback(() => {
    setEvents([]);
    setSearchTerm('');
  }, []);

  const loadInitialEvents = useCallback(() => {
    if (!enabled) return;

    const variables: SearchEventsVariables = {
      input: {
        search: '' // Empty search to get all events
      }
    };

    if (companyId) {
      variables.input!.companyId = companyId;
    }

    searchEvents({ variables });
  }, [searchEvents, companyId, enabled]);

  return {
    events,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    search,
    clearResults,
    loadInitialEvents
  };
}