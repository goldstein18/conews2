import { useQuery } from '@apollo/client';
import { GET_NEWS_DETAIL } from '@/lib/graphql/news';
import { NewsArticle } from '@/types/news';

interface UseNewsDetailReturn {
  news: NewsArticle | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useNewsDetail(newsId: string): UseNewsDetailReturn {
  const { data, loading, error, refetch } = useQuery(GET_NEWS_DETAIL, {
    variables: { id: newsId },
    skip: !newsId,
    fetchPolicy: 'cache-and-network'
  });

  return {
    news: data?.newsById || null,
    loading,
    error: error || null,
    refetch
  };
}
