import { useQuery } from "@apollo/client";
import { LIST_TAGS } from "@/lib/graphql/tags";

interface TagsResponse {
  tagsPaginated: {
    edges: Array<{
      node: {
        id: string;
        name: string;
        display?: string;
        color?: string;
        isActive: boolean;
      };
    }>;
  };
}

export function useNewsTags() {
  const { data, loading, error } = useQuery<TagsResponse>(
    LIST_TAGS,
    {
      variables: {
        first: 100,
        filter: {
          isActive: true
        }
      },
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    }
  );

  const tags = data?.tagsPaginated.edges.map(edge => edge.node) || [];

  return {
    tags,
    loading,
    error,
  };
}