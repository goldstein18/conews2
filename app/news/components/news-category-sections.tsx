/**
 * News category sections component
 * Groups articles by category and displays each category with its articles
 */

'use client';

import type { NewsArticle } from '@/types/news';
import { NewsCard } from './news-card';
import { NewsHero } from './news-hero';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface NewsCategorySectionsProps {
  articles: NewsArticle[];
  featuredArticle?: NewsArticle;
  selectedCategory?: string;
}

interface CategoryGroup {
  category: {
    id: string;
    name: string;
    slug: string;
  };
  articles: NewsArticle[];
}

export function NewsCategorySections({ articles, featuredArticle, selectedCategory }: NewsCategorySectionsProps) {
  // Group articles by category
  const categoryGroups = articles.reduce((groups: CategoryGroup[], article) => {
    // Skip featured article from grouping
    if (featuredArticle && article.id === featuredArticle.id) {
      return groups;
    }

    // Get primary category (first category)
    const primaryCategory = article.categories?.[0];
    
    if (!primaryCategory) {
      // If no category, add to "Uncategorized" group
      const uncategorizedGroup = groups.find(g => g.category.id === 'uncategorized');
      if (uncategorizedGroup) {
        uncategorizedGroup.articles.push(article);
      } else {
        groups.push({
          category: {
            id: 'uncategorized',
            name: 'Uncategorized',
            slug: 'uncategorized'
          },
          articles: [article]
        });
      }
      return groups;
    }

    // Normalize category name for grouping (case-insensitive, trim whitespace)
    const normalizedName = primaryCategory.name.trim().toLowerCase();
    const normalizedSlug = (primaryCategory.slug || primaryCategory.id || '').trim().toLowerCase();
    
    // Check if category group already exists by normalized name or slug
    const existingGroup = groups.find(g => {
      const existingName = g.category.name.trim().toLowerCase();
      const existingSlug = g.category.slug.trim().toLowerCase();
      return existingName === normalizedName || existingSlug === normalizedSlug;
    });
    
    if (existingGroup) {
      existingGroup.articles.push(article);
    } else {
      groups.push({
        category: {
          id: primaryCategory.id,
          name: primaryCategory.name, // Keep original casing for display
          slug: primaryCategory.slug || primaryCategory.id
        },
        articles: [article]
      });
    }

    return groups;
  }, []);

  // Sort articles within each category by date (newest first)
  categoryGroups.forEach(group => {
    group.articles.sort((a, b) => {
      const aDate = a.publishedAt || a.createdAt;
      const bDate = b.publishedAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
  });

  // Sort categories by name
  categoryGroups.sort((a, b) => a.category.name.localeCompare(b.category.name));

  // Empty state
  if (categoryGroups.length === 0 && !featuredArticle) {
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
    <div className="space-y-12">
      {/* Featured article hero section */}
      {featuredArticle && (
        <div>
          <NewsHero article={featuredArticle} />
        </div>
      )}

      {/* Category sections */}
      {categoryGroups.map((group) => {
        // Create a slug-based ID for scrolling
        const categorySlug = group.category.slug || group.category.name.toLowerCase().replace(/\s+/g, '-');
        const categoryId = `category-${categorySlug}`;
        
        return (
          <section key={group.category.id} id={categoryId} className="space-y-6 scroll-mt-24">
            {/* Category header with title and "More" button */}
            <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3">
              <h2 className="text-3xl font-bold font-titleAcumin uppercase" style={{ color: '#3D98D3' }}>
                {group.category.name}
              </h2>
              <Button
                size="sm"
                asChild
                className="gap-2 bg-[#3D98D3] hover:bg-[#2d7fb8] text-white"
              >
                <Link href={`/news?category=${group.category.slug || group.category.id}`}>
                  More {group.category.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Articles grid - 3 columns on desktop, 2 on tablet, 1 on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

