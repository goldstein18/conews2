import { useQuery } from "@apollo/client";
import { LIST_NEWS_ARTICLES } from "@/lib/graphql/news";
import {
  NewsResponse,
  NewsVariables,
  NewsStatus
} from "@/types/news";
import { useMemo } from "react";

interface UseNewsDataProps {
  debouncedSearchTerm: string;
  selectedCategory: string;
  selectedStatus: string;
  selectedTag: string;
  selectedSummaryFilter: string;
}

export function useNewsData({
  debouncedSearchTerm,
  selectedCategory,
  selectedStatus,
  selectedTag,
  selectedSummaryFilter,
}: UseNewsDataProps) {
  // News query variables
  const variables: NewsVariables = useMemo(() => ({
    filter: {
      ...(debouncedSearchTerm && { searchTerm: debouncedSearchTerm }),
      ...(selectedCategory !== "all" && { categoryId: selectedCategory }),
      ...(selectedStatus !== "all" && { status: selectedStatus as NewsStatus }),
      ...(selectedTag !== "all" && { tagId: selectedTag }),
      ...(selectedSummaryFilter !== "all" && (() => {
        if (selectedSummaryFilter === "approved") return { status: NewsStatus.APPROVED };
        if (selectedSummaryFilter === "draft") return { status: NewsStatus.DRAFT };
        if (selectedSummaryFilter === "pending") return { status: NewsStatus.PENDING };
        if (selectedSummaryFilter === "featured") return { featured: true };
        return {};
      })()),
    },
  }), [debouncedSearchTerm, selectedCategory, selectedStatus, selectedTag, selectedSummaryFilter]);

  // News list query
  const { data, loading, error, refetch } = useQuery<NewsResponse>(LIST_NEWS_ARTICLES, {
    variables,
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  // Process data - API returns array directly, not paginated
  const news = data?.news || [];
  const totalCount = news.length;

  // Filter out AbortError and similar navigation-related errors from displaying to user
  const isAbortError = (err: Error | null | undefined) => {
    if (!err) return false;
    const message = err.message || '';
    return message.includes('AbortError') ||
           message.includes('signal is aborted') ||
           message.includes('operation was aborted') ||
           message.includes('Request aborted') ||
           err.name === 'AbortError';
  };

  const displayError = error && !isAbortError(error) ? error : null;

  return {
    // News data
    news,
    totalCount,
    loading,
    error: displayError,
    refetch,

    // Raw data for advanced usage
    data,
  };
}