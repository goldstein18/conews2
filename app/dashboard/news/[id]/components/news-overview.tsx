"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewsDetail } from "@/types/news";

interface NewsOverviewProps {
  news: NewsDetail | null;
  loading?: boolean;
}

export function NewsOverview({ news, loading = false }: NewsOverviewProps) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Type</h3>
            <Badge variant="outline">{news?.articleType || 'Editorial'}</Badge>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
            <Badge variant={news?.status === 'APPROVED' ? 'default' : 'secondary'}>
              {news?.status || 'DRAFT'}
            </Badge>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Author</h3>
            <p className="text-gray-900">{news?.authorName || 'Unknown'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Slug</h3>
            <p className="text-gray-900 font-mono text-sm">{news?.slug || 'auto-generated'}</p>
          </div>
        </div>
        
        {news?.tags && news.tags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}