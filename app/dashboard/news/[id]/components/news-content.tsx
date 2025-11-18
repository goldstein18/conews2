"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

import { NewsDetail } from "@/types/news";

interface NewsContentProps {
  news: NewsDetail | null;
  loading?: boolean;
}

export function NewsContent({ news, loading = false }: NewsContentProps) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Featured Image */}
        {news?.heroImage && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <Image
              src={news.heroImageUrl || news.heroImage}
              alt={news?.heroImageAlt || news?.title || 'Article image'}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose max-w-none">
          <div
            className="text-gray-900 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: news?.body || '<p>No content available</p>'
            }}
          />
        </div>

        {/* Reading Time */}
        {news?.body && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Estimated reading time: {Math.ceil(news.body.split(' ').length / 200)} minutes
              </span>
              <span>
                {news.body.split(' ').length} words
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}