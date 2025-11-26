/**
 * Article header component
 * Displays title, author, date, and social sharing buttons
 * Matches Timeout-style article header
 */

'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ArticleShareButtons } from './article-share-buttons';
import type { NewsArticle } from '@/types/news';

interface ArticleHeaderProps {
  article: NewsArticle;
  currentUrl: string;
  backHref?: string;
}

export function ArticleHeader({ article, currentUrl, backHref = "/news" }: ArticleHeaderProps) {
  const publishDate = article.publishedAt 
    ? format(new Date(article.publishedAt), 'MMMM d, yyyy')
    : format(new Date(article.createdAt), 'MMMM d, yyyy');

  const authorName = article.authorName || 'Time Out Contributor';

  return (
    <header className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <Link
            href={backHref}
            className="text-gray-600 hover:text-gray-900 transition-colors pt-1"
            aria-label="Back to news"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="min-w-0 space-y-3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-titleAcumin text-gray-900">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
              {authorName && (
                <span className="font-semibold text-gray-900">{authorName}</span>
              )}
              <time dateTime={article.publishedAt || article.createdAt}>
                {publishDate}
              </time>
            </div>
          </div>
        </div>

        <ArticleShareButtons 
          title={article.title}
          url={currentUrl}
          className="flex-shrink-0"
        />
      </div>
    </header>
  );
}

