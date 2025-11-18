import { useQuery } from "@apollo/client";
import { GET_NEWS_DETAIL } from "@/lib/graphql/news";
import { 
  NewsDetailResponse, 
  NewsDetailVariables,
} from "@/types/news";

interface UseNewsDetailProps {
  newsId: string;
}

export function useNewsDetail({ newsId }: UseNewsDetailProps) {
  const { data, loading, error, refetch } = useQuery<NewsDetailResponse, NewsDetailVariables>(
    GET_NEWS_DETAIL,
    {
      variables: { id: newsId },
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true,
      skip: !newsId,
    }
  );

  // Filter out AbortError from displaying to user
  const displayError = error && !error.message.includes('AbortError') && !error.message.includes('signal is aborted') ? error : null;

  return {
    news: data?.newsById,
    loading,
    error: displayError,
    refetch,
  };
}