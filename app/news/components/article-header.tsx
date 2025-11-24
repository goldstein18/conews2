/**
 * Article header component
 * Displays title, author, date, and social sharing buttons
 * Matches Timeout-style article header
 */

'use client';

import { format } from 'date-fns';
import { ArticleShareButtons } from './article-share-buttons';
import type { NewsArticle } from '@/types/news';

interface ArticleHeaderProps {
  article: NewsArticle;
  currentUrl: string;
}

export function ArticleHeader({ article, currentUrl }: ArticleHeaderProps) {
  const publishDate = article.publishedAt 
    ? format(new Date(article.publishedAt), 'MMMM d, yyyy')
    : format(new Date(article.createdAt), 'MMMM d, yyyy');

  const authorName = article.authorName || 'Time Out Contributor';

  return (
    <header className="space-y-6">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-titleAcumin text-gray-900">
        {article.title}
      </h1>

      {/* Author and Date */}
      <div className="flex items-center gap-4 flex-wrap text-gray-600">
        {authorName && (
          <div className="text-sm font-medium">
            <span className="font-semibold text-gray-900">{authorName}</span>
          </div>
        )}
        <div className="text-sm">
          <time dateTime={article.publishedAt || article.createdAt}>
            {publishDate}
          </time>
        </div>
      </div>

      {/* Social Share Buttons */}
      <ArticleShareButtons 
        title={article.title}
        url={currentUrl}
        className="pt-4 border-t border-gray-200"
      />
    </header>
  );
}

