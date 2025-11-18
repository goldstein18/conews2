import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  CREATE_ESCOOP_ENTRY,
  UPDATE_ESCOOP_ENTRY,
  DELETE_ESCOOP_ENTRY,
  GET_ESCOOP_ENTRY,
  SEARCH_ESCOOPS,
  SEARCH_EVENTS,
  LIST_ESCOOP_ENTRIES
} from '@/lib/graphql/escoop-entries';
import type {
  CreateEscoopEntryInput,
  UpdateEscoopEntryInput,
  EscoopSearchInput,
  EventSearchInput,
  EscoopEntriesPaginatedFilterInput
} from '@/types/escoop-entries';

// Hook for creating escoop entries
export function useCreateEscoopEntry() {
  const router = useRouter();

  const [createEscoopEntry, { loading, error }] = useMutation(CREATE_ESCOOP_ENTRY, {
    onCompleted: () => {
      toast.success('Escoop entry created successfully');
      router.push('/dashboard/escoop-entries');
    },
    onError: (error) => {
      toast.error(`Failed to create escoop entry: ${error.message}`);
    },
    // Refetch queries after creation
    refetchQueries: [
      { query: LIST_ESCOOP_ENTRIES, variables: { paginatedFilter: { first: 20, includeTotalCount: true } } }
    ]
  });

  const handleCreateEscoopEntry = async (input: CreateEscoopEntryInput) => {
    try {
      await createEscoopEntry({
        variables: { createEscoopEntryInput: input }
      });
    } catch (err) {
      // Error handled by onError callback
      console.error('Create escoop entry error:', err);
    }
  };

  return {
    createEscoopEntry: handleCreateEscoopEntry,
    loading,
    error
  };
}

// Hook for updating escoop entries
export function useUpdateEscoopEntry() {
  const [updateEscoopEntry, { loading, error }] = useMutation(UPDATE_ESCOOP_ENTRY, {
    onCompleted: () => {
      toast.success('Escoop entry updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update escoop entry: ${error.message}`);
    },
    refetchQueries: [
      { query: LIST_ESCOOP_ENTRIES, variables: { paginatedFilter: { first: 20, includeTotalCount: true } } }
    ]
  });

  const handleUpdateEscoopEntry = async (input: UpdateEscoopEntryInput) => {
    try {
      await updateEscoopEntry({
        variables: { updateEscoopEntryInput: input }
      });
    } catch (err) {
      console.error('Update escoop entry error:', err);
    }
  };

  return {
    updateEscoopEntry: handleUpdateEscoopEntry,
    loading,
    error
  };
}

// Hook for deleting escoop entries
export function useDeleteEscoopEntry() {
  const [deleteEscoopEntry, { loading, error }] = useMutation(DELETE_ESCOOP_ENTRY, {
    onCompleted: () => {
      toast.success('Escoop entry deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete escoop entry: ${error.message}`);
    },
    refetchQueries: [
      { query: LIST_ESCOOP_ENTRIES, variables: { paginatedFilter: { first: 20, includeTotalCount: true } } }
    ]
  });

  const handleDeleteEscoopEntry = async (id: string) => {
    try {
      await deleteEscoopEntry({
        variables: { id }
      });
    } catch (err) {
      console.error('Delete escoop entry error:', err);
    }
  };

  return {
    deleteEscoopEntry: handleDeleteEscoopEntry,
    loading,
    error
  };
}

// Hook for searching escoops
export function useSearchEscoops(input?: EscoopSearchInput) {
  const { data, loading, error, refetch } = useQuery(SEARCH_ESCOOPS, {
    variables: { input: input || {} },
    errorPolicy: 'all'
  });

  return {
    escoops: data?.searchEscoops || [],
    loading,
    error,
    refetch: (newInput?: EscoopSearchInput) => refetch({ input: newInput || {} })
  };
}

// Hook for searching events
export function useSearchEvents(input?: EventSearchInput) {
  const { data, loading, error, refetch } = useQuery(SEARCH_EVENTS, {
    variables: { input: input || {} },
    errorPolicy: 'all',
    skip: !input?.companyId // Skip query if no companyId is provided
  });

  return {
    events: data?.searchEvents || [],
    loading,
    error,
    refetch: (newInput?: EventSearchInput) => refetch({ input: newInput || {} })
  };
}

// Hook for listing escoop entries
export function useEscoopEntries(paginatedFilter?: EscoopEntriesPaginatedFilterInput) {
  const { data, loading, error, refetch, fetchMore } = useQuery(LIST_ESCOOP_ENTRIES, {
    variables: {
      paginatedFilter: paginatedFilter || {
        first: 20,
        includeTotalCount: true
      }
    },
    errorPolicy: 'all'
  });

  const loadMore = () => {
    if (data?.escoopEntriesPaginated?.pageInfo?.hasNextPage) {
      return fetchMore({
        variables: {
          paginatedFilter: {
            ...paginatedFilter,
            after: data.escoopEntriesPaginated.pageInfo.endCursor
          }
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return {
            ...fetchMoreResult,
            escoopEntriesPaginated: {
              ...fetchMoreResult.escoopEntriesPaginated,
              edges: [
                ...prev.escoopEntriesPaginated.edges,
                ...fetchMoreResult.escoopEntriesPaginated.edges
              ]
            }
          };
        }
      });
    }
  };

  return {
    data: data?.escoopEntriesPaginated,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    escoopEntries: data?.escoopEntriesPaginated?.edges?.map((edge: any) => edge.node) || [],
    loading,
    error,
    refetch,
    loadMore
  };
}

// Hook for getting a single escoop entry by ID
export function useGetEscoopEntry(id: string) {
  const { data, loading, error, refetch } = useQuery(GET_ESCOOP_ENTRY, {
    variables: { id },
    errorPolicy: 'all',
    skip: !id
  });

  return {
    escoopEntry: data?.escoopEntry || null,
    loading,
    error,
    refetch
  };
}