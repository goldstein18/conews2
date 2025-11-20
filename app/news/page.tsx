/**
 * Public news directory page
 * Displays news articles in a Timeout-style layout with featured hero and grid
 */

'use client';

import { NewsGrid, NewsSkeleton, NewsHeader } from './components';
import { usePublicNews } from './hooks';
import { useMemo, useState } from 'react';

export default function NewsPage() {
  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch all approved news articles with optional category filter
  const {
    news,
    loading,
    error,
    refetch
  } = usePublicNews({
    categoryId: selectedCategory !== 'all' ? selectedCategory : undefined
  });

  // Filter news by category slug if category is selected
  const filteredNews = useMemo(() => {
    if (!news || news.length === 0) return [];
    if (selectedCategory === 'all') return news;

    // Filter by category slug (match by slug, id, or name)
    return news.filter(article => {
      return article.categories?.some(category => {
        const categorySlug = category.slug?.toLowerCase() || '';
        const categoryId = category.id?.toLowerCase() || '';
        const categoryName = category.name?.toLowerCase() || '';
        const selectedSlug = selectedCategory.toLowerCase();
        
        // Match by slug, id, or name
        return categorySlug === selectedSlug || 
               categoryId === selectedSlug ||
               categoryName === selectedSlug ||
               categorySlug.includes(selectedSlug);
      });
    });
  }, [news, selectedCategory]);

  // Get featured article (first article with featuredUntil date in future, or first article)
  const featuredArticle = useMemo(() => {
    if (!filteredNews || filteredNews.length === 0) return undefined;
    
    // Find article with featuredUntil in the future
    const now = new Date();
    const featured = filteredNews.find(article => {
      if (!article.featuredUntil) return false;
      return new Date(article.featuredUntil) > now;
    });

    // Fallback to first article if no featured article
    return featured || filteredNews[0];
  }, [filteredNews]);

  // Show loading skeleton on initial load
  if (loading && filteredNews.length === 0) {
    return (
      <div className="w-full">
        <NewsHeader
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <div className="container mx-auto px-4 py-8 md:py-12">
          <NewsSkeleton />
        </div>
      </div>
    );
  }

  // Check if backend error (we'll use mock data silently)
  const isBackendError = error && (
    error.message?.includes('500') || 
    (error && 'networkError' in error && 
     typeof error.networkError === 'object' && 
     error.networkError !== null && 
     'statusCode' in error.networkError && 
     (error.networkError as { statusCode?: number }).statusCode === 500) ||
    (error && 'networkError' in error && 
     typeof error.networkError === 'object' && 
     error.networkError !== null && 
     'name' in error.networkError && 
     (error.networkError as { name?: string }).name === 'ServerError')
  );

  // Only show error if it's not a backend error (backend errors are handled by mock data)
  if (error && !isBackendError) {
    console.error('News page error:', error);
    return (
      <div className="w-full">
        <NewsHeader
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to load news
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              {error.message || 'An error occurred while loading news articles. Please try again later.'}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* News Header Navigation */}
      <NewsHeader
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-8">
          {/* News grid with featured article */}
          {filteredNews.length > 0 ? (
            <NewsGrid articles={filteredNews} featuredArticle={featuredArticle} />
          ) : !loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                <span className="text-4xl">📰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No News Articles Available
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Check back soon for the latest cultural news and updates!
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
