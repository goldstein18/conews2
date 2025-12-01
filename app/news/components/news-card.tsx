/**
 * News card component optimized for 1200x628 images
 * Displays news article with category, author, and publish date
 */

'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import type { NewsArticle } from '@/types/news';
import { DEFAULT_IMAGE } from '@/lib/constants/images';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean; // For featured articles (larger size)
}

export function NewsCard({ article, featured = false }: NewsCardProps) {
  const imageUrl = article.heroImageUrl || DEFAULT_IMAGE;

  // Get primary category
  const primaryCategory = article.categories?.[0];

  return (
    <Link href={`/news/${article.slug}`} className="block group">
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-xl border-gray-200 h-full ${
        featured ? 'md:col-span-2' : ''
      }`}>
        {/* Image container - optimized for 1200x628 aspect ratio (~1.91:1) */}
        <div className={`relative overflow-hidden bg-gray-100 ${
          featured 
            ? 'aspect-[1200/628]' // Hero image ratio
            : 'aspect-[1200/628]' // Same ratio for consistency
        }`}>
          <ImageWithFallback
            src={imageUrl}
            alt={article.heroImageAlt || article.title}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            sizes={featured ? "(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 1200px" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
            priority={featured}
          />
        </div>

        {/* Card content */}
        <CardContent className="p-6 space-y-3">
          {/* Title */}
          <h2 className={`line-clamp-2 group-hover:text-primary transition-colors font-titleAcumin font-normal text-gray-900 ${
            featured ? 'text-2xl' : 'text-xl'
          }`} style={{ opacity: 0.9 }}>
            {article.title}
          </h2>

          {/* Summary/excerpt from body */}
          {article.body && (
            <p className="text-muted-foreground line-clamp-3 text-sm">
              {article.body.replace(/<[^>]*>/g, '').substring(0, 150)}...
            </p>
          )}

          {/* Tags - including category and article tags */}
          {(primaryCategory || (article.tags && article.tags.length > 0)) && (
            <div className="flex items-center gap-2 flex-wrap pt-2">
              {/* Category tag */}
              {primaryCategory && (
                <Badge variant="outline" className="text-[10px]">
                  {primaryCategory.name}
                </Badge>
              )}
              {/* Article tags */}
              {article.tags && article.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-[10px]">
                  {tag.display || tag.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

