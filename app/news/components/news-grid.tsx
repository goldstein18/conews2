/**
 * News grid layout component
 * Displays news articles in a responsive grid (3 columns on desktop)
 * Optimized for 1200x628 images
 */

'use client';

import type { NewsArticle } from '@/types/news';
import { NewsCard } from './news-card';
import { NewsHero } from './news-hero';

interface NewsGridProps {
  articles: NewsArticle[];
  featuredArticle?: NewsArticle; // Optional featured article to highlight
}

export function NewsGrid({ articles, featuredArticle }: NewsGridProps) {
  // Filter out featured article from grid if provided
  const gridArticles = featuredArticle
    ? articles.filter(article => article.id !== featuredArticle.id)
    : articles;

  // Empty state
  if (gridArticles.length === 0 && !featuredArticle) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
          <span className="text-4xl">📰</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No News Articles Found
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We couldn&apos;t find any news articles. Check back soon for updates!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Featured article hero section */}
      {featuredArticle && (
        <NewsHero article={featuredArticle} />
      )}

      {/* News grid - 3 columns on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gridArticles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

