/**
 * Public news directory page
 * Displays news articles in a Timeout-style layout with featured hero and grid
 */

'use client';

import { NewsCategorySections, NewsSkeleton, NewsHeader } from './components';
import { usePublicNews } from './hooks';
import { useMemo, useState, useEffect, useRef } from 'react';

export default function NewsPage() {
  // Category selection state (for scrolling, not filtering)
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch all approved news articles (no filtering)
  const {
    news,
    loading,
    error,
    refetch
  } = usePublicNews({});

  // Use all news (no filtering)
  const filteredNews = useMemo(() => {
    return news || [];
  }, [news]);

  // Scroll to selected category when it changes
  useEffect(() => {
    if (selectedCategory === 'all') return;

    // Clear any pending scroll
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Wait a bit for DOM to update, then scroll
    scrollTimeoutRef.current = setTimeout(() => {
      // Normalize the selected category to match section IDs
      const normalizedCategory = selectedCategory.toLowerCase().replace(/\s+/g, '-');
      const categoryId = `category-${normalizedCategory}`;
      
      // Try to find the element by ID
      let element = document.getElementById(categoryId);
      
      // If not found, try to find by matching category names/slugs
      if (!element) {
        const allSections = document.querySelectorAll('[id^="category-"]');
        allSections.forEach((section) => {
          const sectionId = section.id.replace('category-', '');
          // Check if the selected category matches the section (by slug or name)
          if (sectionId === normalizedCategory || 
              sectionId.includes(normalizedCategory) || 
              normalizedCategory.includes(sectionId)) {
            element = section as HTMLElement;
          }
        });
      }
      
      if (element) {
        const headerOffset = 120; // Account for sticky headers
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 150);

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [selectedCategory]);

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
          {/* News category sections with featured article */}
          {filteredNews.length > 0 ? (
            <NewsCategorySections 
              articles={filteredNews} 
              featuredArticle={featuredArticle}
              selectedCategory={selectedCategory}
            />
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
