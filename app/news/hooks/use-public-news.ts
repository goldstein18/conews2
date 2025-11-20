/**
 * Hook for fetching public news articles
 * Only fetches approved/published news articles
 */

'use client';

import { useQuery } from '@apollo/client';
import { LIST_NEWS_ARTICLES } from '@/lib/graphql/news';
import type { NewsArticle, NewsFilterInput } from '@/types/news';
import { NewsStatus } from '@/types/news';
import { MOCK_NEWS_ARTICLES } from '../mock-news';

export interface UsePublicNewsOptions {
  market?: string;
  categoryId?: string;
  tagId?: string;
  searchTerm?: string;
  featured?: boolean;
  limit?: number;
}

export interface UsePublicNewsReturn {
  news: NewsArticle[];
  loading: boolean;
  error: Error | undefined;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch public news articles (only approved/published)
 * 
 * Note: Backend may not support status filtering for public queries.
 * We filter client-side to ensure only approved articles are shown.
 */
export const usePublicNews = ({
  market,
  categoryId,
  tagId,
  searchTerm,
  featured,
  limit
}: UsePublicNewsOptions = {}): UsePublicNewsReturn => {
  // Build filter WITHOUT status - some backends don't allow status filtering for public queries
  // We'll filter by status client-side instead
  const filter: NewsFilterInput = {};
  
  // Add optional filters only if provided (excluding status to avoid 500 errors)
  if (market) filter.market = market;
  if (categoryId) filter.categoryId = categoryId;
  if (tagId) filter.tagId = tagId;
  if (searchTerm?.trim()) filter.searchTerm = searchTerm.trim();
  if (featured !== undefined) filter.featured = featured;

  // Build variables - try omitting filter entirely if empty to avoid backend crashes
  // Some GraphQL backends crash on empty filter objects
  const hasFilters = Object.keys(filter).length > 0;
  const variables = hasFilters ? { filter } : {};

  const { data, loading, error, refetch } = useQuery(LIST_NEWS_ARTICLES, {
    variables,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all', // Continue even if there are GraphQL errors
    skip: false,
    onError: (error) => {
      // Log the full error for debugging
      console.error('News query error:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        extraInfo: error.extraInfo,
        variables: variables
      });
    }
  });

  // Check if we should use mock data (backend error or development mode)
  const useMockData = error && (
    error.message?.includes('500') || 
    (error as any)?.networkError?.statusCode === 500 ||
    (error as any)?.networkError?.name === 'ServerError'
  ) || process.env.NODE_ENV === 'development' && !data?.news;

  // Get news articles - use mock data if backend fails, otherwise filter real data
  let news: NewsArticle[] = [];
  
  if (useMockData) {
    // Use mock data when backend fails or in development
    console.log('Using mock news data for preview');
    news = MOCK_NEWS_ARTICLES;
  } else {
    // Filter real data to only approved status client-side
    // Also filter to only articles with publishedAt date
    news = (data?.news || []).filter((article: NewsArticle) => {
      // Only show approved articles
      if (article.status !== NewsStatus.APPROVED) return false;
      
      // Only show articles that have been published (have publishedAt date)
      if (!article.publishedAt) return false;
      
      // Check if published date is in the past
      const publishedDate = new Date(article.publishedAt);
      if (publishedDate > new Date()) return false; // Not yet published
      
      return true;
    });
  }

  // Apply limit if specified
  if (limit) {
    news = news.slice(0, limit);
  }

  // Sort by publishedAt (most recent first), then by createdAt
  news = [...news].sort((a, b) => {
    const aDate = a.publishedAt || a.createdAt;
    const bDate = b.publishedAt || b.createdAt;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return {
    news,
    loading,
    error: error as Error | undefined,
    refetch: async () => { await refetch(); }
  };
};
