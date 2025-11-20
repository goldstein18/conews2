/**
 * News hero section for featured article
 * Displays large hero image (1200x628) with headline and metadata
 */

'use client';

import Link from 'next/link';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import type { NewsArticle } from '@/types/news';
import { DEFAULT_IMAGE } from '@/lib/constants/images';
import { format } from 'date-fns';

interface NewsHeroProps {
  article: NewsArticle;
}

export function NewsHero({ article }: NewsHeroProps) {
  const imageUrl = article.heroImageUrl || DEFAULT_IMAGE;
  
  // Format publish date
  const publishDate = article.publishedAt 
    ? format(new Date(article.publishedAt), 'MMMM d, yyyy')
    : format(new Date(article.createdAt), 'MMMM d, yyyy');

  // Get primary category
  const primaryCategory = article.categories?.[0];

  // Extract excerpt from body
  const excerpt = article.body 
    ? article.body.replace(/<[^>]*>/g, '').substring(0, 200)
    : '';

  return (
    <Link href={`/news/${article.slug}`} className="block group">
      <div className="relative w-full aspect-[1200/628] overflow-hidden rounded-lg bg-gray-100">
        <ImageWithFallback
          src={imageUrl}
          alt={article.heroImageAlt || article.title}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          sizes="100vw"
          priority
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
          <div className="max-w-4xl space-y-4">
            {/* Category badge */}
            {primaryCategory && (
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
                <Tag className="h-3 w-3 mr-1" />
                {primaryCategory.name}
              </Badge>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight group-hover:text-[#e74e3d] transition-colors font-titleAcumin">
              {article.title}
            </h1>

            {/* Meta information */}
            <div className="flex items-center gap-6 text-sm md:text-base flex-wrap">
              {article.authorName && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.authorName}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{publishDate}</span>
              </div>
            </div>

            {/* Excerpt */}
            {excerpt && (
              <p className="text-lg md:text-xl text-white/90 line-clamp-2 max-w-3xl">
                {excerpt}...
              </p>
            )}

            {/* Read more button */}
            <div className="pt-4">
              <Button 
                variant="secondary" 
                className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                Read More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

