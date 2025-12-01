/**
 * Industry news landing page
 * Reuses the same layout as /news but lives at /industry-news
 */

'use client';

import Link from 'next/link';
import {
  NewsCategorySections,
  NewsHeader,
  type NewsHeaderCategory
} from '@/app/news/components';
import { usePublicNews } from '@/app/news/hooks';
import { DEFAULT_IMAGE } from '@/lib/constants/images';
import { useMemo, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  INDUSTRY_NEWS_HEADER_CATEGORIES,
  INDUSTRY_CATEGORY_TITLE_MAP
} from './constants';

export default function IndustryNewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    router.push(`/industry-news/category/${categoryId}`);
  };

  const {
    news,
    loading,
    error,
    refetch
  } = usePublicNews({});

  const filteredNews = useMemo(() => news || [], [news]);

  useEffect(() => {
    if (selectedCategory === 'all') return;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const normalizedCategory = selectedCategory.toLowerCase().replace(/\s+/g, '-');
      const categoryId = `category-${normalizedCategory}`;

      let element = document.getElementById(categoryId);

      if (!element) {
        const allSections = document.querySelectorAll('[id^="category-"]');
        allSections.forEach((section) => {
          const sectionId = section.id.replace('category-', '');
          if (sectionId === normalizedCategory ||
              sectionId.includes(normalizedCategory) ||
              normalizedCategory.includes(sectionId)) {
            element = section as HTMLElement;
          }
        });
      }

      if (element) {
        const headerOffset = 120;
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

  const featuredArticle = useMemo(() => {
    if (!filteredNews.length) return undefined;
    const now = new Date();
    const featured = filteredNews.find(article => {
      if (!article.featuredUntil) return false;
      return new Date(article.featuredUntil) > now;
    });
    return featured || filteredNews[0];
  }, [filteredNews]);

  if (loading && filteredNews.length === 0) {
    return (
      <div className="w-full">
        <NewsHeader
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categories={INDUSTRY_NEWS_HEADER_CATEGORIES}
          viewMode="industry"
        />
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
          <div className="h-96 animate-pulse bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  const isBackendError = error && (
    error.message?.includes('500') ||
    (error && 'networkError' in error && typeof error.networkError === 'object' &&
     error.networkError !== null && 'statusCode' in error.networkError &&
     (error.networkError as { statusCode?: number }).statusCode === 500) ||
    (error && 'networkError' in error && typeof error.networkError === 'object' &&
     error.networkError !== null && 'name' in error.networkError &&
     (error.networkError as { name?: string }).name === 'ServerError')
  );

  if (error && !isBackendError) {
    return (
      <div className="w-full">
        <NewsHeader
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categories={INDUSTRY_NEWS_HEADER_CATEGORIES}
          viewMode="industry"
        />
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to load industry news
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              {error.message || 'An error occurred while loading articles. Please try again later.'}
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

  const latestArticles = filteredNews.slice(0, 4);

  const getBadgeColor = (slug: string) => {
    switch (slug) {
      case 'things-to-do':
        return '#e74e3d';
      case 'art-museums':
        return '#f5a623';
      case 'culinary':
        return '#f05d7a';
      case 'dance':
        return '#3d98d3';
      case 'festivals-and-fairs':
        return '#d1546d';
      case 'film':
        return '#695ba8';
      case 'music':
        return '#3b82f6';
      case 'theater':
        return '#111827';
      case 'city-guides':
        return '#111827';
      default:
        return '#111827';
    }
  };
  return (
    <div className="w-full">
      <NewsHeader
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        showIndustryButton={false}
        categories={INDUSTRY_NEWS_HEADER_CATEGORIES}
        viewMode="industry"
      />
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-[0.15em] text-black typography-header">
                LATEST ARTICLES
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Stay up-to-date with the newest content across all our categories.
              </p>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center rounded-full border border-blue-500 px-4 py-1 text-sm font-semibold tracking-widest text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {latestArticles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-xl"
              >
                <div
                  className="h-36 w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${article.heroImageUrl || DEFAULT_IMAGE})`
                  }}
                />
                <div className="px-4 pt-4 pb-6">
                  <div
                    className="mb-3 inline-flex items-center rounded-full px-3 py-1 text-xs uppercase tracking-[0.35em] text-white"
                    style={{ backgroundColor: getBadgeColor(article.categories?.[0]?.slug || '') }}
                  >
                    {article.categories?.[0]?.name || 'Industry News'}
                  </div>
                  <h3 className="text-lg font-semibold leading-tight text-gray-900">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-xs uppercase text-gray-500">
                    {new Date(article.publishedAt || article.createdAt).toLocaleDateString(undefined, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
        <div className="space-y-8">
          {filteredNews.length > 0 ? (
            <NewsCategorySections
              articles={filteredNews}
              featuredArticle={featuredArticle}
              selectedCategory={selectedCategory}
              categoryNameMap={INDUSTRY_CATEGORY_TITLE_MAP}
            />
          ) : !loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                <span className="text-4xl">📰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Industry News Available
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Check back soon for the latest industry updates!
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

