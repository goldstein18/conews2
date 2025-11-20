/**
 * News card component optimized for 1200x628 images
 * Displays news article with category, author, and publish date
 */

'use client';

import Link from 'next/link';
import { Calendar, User, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import type { NewsArticle } from '@/types/news';
import { DEFAULT_IMAGE } from '@/lib/constants/images';
import { format } from 'date-fns';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean; // For featured articles (larger size)
}

export function NewsCard({ article, featured = false }: NewsCardProps) {
  const imageUrl = article.heroImageUrl || DEFAULT_IMAGE;
  
  // Format publish date
  const publishDate = article.publishedAt 
    ? format(new Date(article.publishedAt), 'MMM d, yyyy')
    : format(new Date(article.createdAt), 'MMM d, yyyy');

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

          {/* Category badge overlay */}
          {primaryCategory && (
            <div className="absolute top-4 left-4 z-10">
              <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/80">
                <Tag className="h-3 w-3 mr-1" />
                {primaryCategory.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Card content */}
        <CardContent className="p-6 space-y-3">
          {/* Title */}
          <h3 className={`font-normal line-clamp-2 group-hover:text-primary transition-colors font-titleAcumin ${
            featured ? 'text-2xl' : 'text-xl'
          }`}>
            {article.title}
          </h3>

          {/* Meta information */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            {article.authorName && (
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{article.authorName}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{publishDate}</span>
            </div>
          </div>

          {/* Summary/excerpt from body */}
          {article.body && (
            <p className="text-muted-foreground line-clamp-3 text-sm">
              {article.body.replace(/<[^>]*>/g, '').substring(0, 150)}...
            </p>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2">
              {article.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
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

