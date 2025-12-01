/**
 * Individual news article page
 * Matches Timeout-style article layout with hero image, content, and related articles
 */

'use client';

import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { GET_NEWS_BY_SLUG } from '@/lib/graphql/news';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Skeleton } from '@/components/ui/skeleton';
import { DEFAULT_IMAGE } from '@/lib/constants/images';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ArticleShareButtons } from '../components/article-share-buttons';
import { RelatedArticles } from '../components/related-articles';
import { usePublicNews } from '../hooks/use-public-news';
import { MOCK_NEWS_ARTICLES } from '../mock-news';
import type { NewsArticle } from '@/types/news';

export default function NewsArticlePage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, loading } = useQuery(GET_NEWS_BY_SLUG, {
    variables: { slug },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    skip: false // Always try to fetch, but use mock as fallback
  });

  // Fetch related articles for "You may also like" section
  const { news: allNews } = usePublicNews({ limit: 10 });

  const article = data?.newsBySlug;

  // Find mock article first (always available)
  // Check mock articles immediately so they work even if backend fails
  const mockArticle = MOCK_NEWS_ARTICLES.find(a => a.slug === slug) || null;

  // Debug: Log to help troubleshoot slug matching
  if (process.env.NODE_ENV === 'development') {
    if (!mockArticle) {
      console.log('Mock article not found for slug:', slug);
      console.log('Available slugs:', MOCK_NEWS_ARTICLES.map(a => a.slug));
    }
  }

  // Use backend article if available and loaded, otherwise use mock
  // This ensures mock articles always work even if backend fails or is still loading
  // Only prefer backend article if it actually exists
  const displayArticle: NewsArticle | null = article ?? mockArticle;

  // Get current URL for sharing
  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `https://cultureowl.com/news/${slug}`;

  // Loading state - only show skeleton if we don't have any article (backend or mock)
  // If we have mock data, show it immediately even if backend is still loading
  if (loading && !article && !mockArticle) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back button skeleton */}
          <Skeleton className="h-10 w-32" />
          
          {/* Title skeleton */}
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-6 w-48" />
          
          {/* Hero image skeleton */}
          <div className="relative w-full aspect-[1200/628] overflow-hidden rounded-lg bg-gray-200">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Content skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  // Error state or article not found - only show error if no mock article found
  // Wait a bit for loading to complete, then check mock data
  if (!loading && !displayArticle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Article Not Found
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-4">
            The news article you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/news">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to News
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!displayArticle) return null;

  const imageUrl = displayArticle.heroImageUrl || DEFAULT_IMAGE;

  return (
    <article className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            {/* Back Arrow - Left side */}
            <Link
              href="/news"
              className="text-gray-600 hover:text-gray-900 transition-colors pt-1 flex-shrink-0"
              aria-label="Back to news"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>

            {/* Content Column - Aligned with image */}
            <div className="flex-1 space-y-6">
              {/* Article Header (Title, Author, Date, Share Buttons) */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 space-y-3">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-titleAcumin text-gray-900">
                    {displayArticle.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                    {(displayArticle.authorName || 'Time Out Contributor') && (
                      <span className="font-semibold text-gray-900">
                        By {displayArticle.authorName || 'Time Out Contributor'}
                      </span>
                    )}
                    <time dateTime={displayArticle.publishedAt || displayArticle.createdAt}>
                      {displayArticle.publishedAt 
                        ? format(new Date(displayArticle.publishedAt), 'MMMM d, yyyy')
                        : format(new Date(displayArticle.createdAt), 'MMMM d, yyyy')}
                    </time>
                  </div>
                </div>

                <ArticleShareButtons 
                  title={displayArticle.title}
                  url={currentUrl}
                  className="flex-shrink-0"
                />
              </div>

              {/* Meta Placeholder - Above image */}
              <div className="space-y-1 tracking-[0.35em] text-black font-semibold" style={{ fontSize: '1.25rem' }}>
                <p>Meta placeholder sentence one.</p>
                <p>Meta placeholder sentence two.</p>
              </div>

              {/* Hero Image */}
              <div className="relative w-full aspect-[1200/628] overflow-hidden rounded-lg bg-gray-100">
                <ImageWithFallback
                  src={imageUrl}
                  alt={displayArticle.heroImageAlt || displayArticle.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Article Content */}
              <div 
                className="article-content mt-8"
                dangerouslySetInnerHTML={{ __html: displayArticle.body }}
              />

              {/* Related Articles */}
              {(allNews.length > 0 || MOCK_NEWS_ARTICLES.length > 0) && (
                <RelatedArticles
                  articles={allNews.length > 0 ? allNews : MOCK_NEWS_ARTICLES}
                  currentArticleId={displayArticle.id}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
