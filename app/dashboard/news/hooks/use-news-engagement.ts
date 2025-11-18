import { useQuery } from "@apollo/client";
import { GET_NEWS_ENGAGEMENT_STATS } from "@/lib/graphql/news";

// Placeholder types for engagement (not yet implemented in API)
interface NewsEngagementStats {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  readTime: number;
  bounceRate: number;
  clickThroughRate: number;
}

interface NewsEngagementResponse {
  newsEngagementStats: NewsEngagementStats;
}

interface NewsEngagementVariables {
  newsId: string;
  timeRange?: string;
}

interface UseNewsEngagementProps {
  newsId: string;
  timeRange?: 'day' | 'week' | 'month' | 'year';
}

export function useNewsEngagement({ newsId, timeRange = 'month' }: UseNewsEngagementProps) {
  const { data, loading, error, refetch } = useQuery<NewsEngagementResponse, NewsEngagementVariables>(
    GET_NEWS_ENGAGEMENT_STATS,
    {
      variables: { 
        newsId,
        timeRange,
      },
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
      skip: !newsId,
    }
  );

  const engagementStats = data?.newsEngagementStats || {
    views: 0,
    likes: 0,
    shares: 0,
    comments: 0,
    readTime: 0,
    bounceRate: 0,
    clickThroughRate: 0,
  };

  return {
    engagementStats,
    loading,
    error,
    refetch,
  };
}