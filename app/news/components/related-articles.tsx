/**
 * Related articles component
 * Shows "You may also like" section with related news articles
 */

'use client';

import Link from 'next/link';
import type { NewsArticle } from '@/types/news';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { DEFAULT_IMAGE } from '@/lib/constants/images';

interface RelatedArticlesProps {
  articles: NewsArticle[];
  currentArticleId: string;
  title?: string;
}

export function RelatedArticles({ 
  articles, 
  currentArticleId, 
  title = 'You may also like' 
}: RelatedArticlesProps) {
  // Filter out current article and limit to 3
  const relatedArticles = articles
    .filter(article => article.id !== currentArticleId)
    .slice(0, 3);

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-12 border-t border-gray-200">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 font-titleAcumin">
        {title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedArticles.map((article) => {
          const imageUrl = article.heroImageUrl || DEFAULT_IMAGE;
          
          return (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group block"
            >
              <article className="space-y-3">
                {/* Article Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                  <ImageWithFallback
                    src={imageUrl}
                    alt={article.heroImageAlt || article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Article Info */}
                <div className="space-y-2">
                  {article.categories && article.categories.length > 0 && (
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {article.categories[0].name}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors font-titleAcumin">
                    {article.title}
                  </h3>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

