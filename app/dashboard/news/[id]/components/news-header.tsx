"use client";

import { ArrowLeft, Edit, Calendar, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusInfo } from "../../utils/news-helpers";
import { NewsDetail } from "@/types/news";

interface NewsHeaderProps {
  news: NewsDetail | null;
  loading?: boolean;
}

export function NewsHeader({ news, loading = false }: NewsHeaderProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="bg-white border-b border-gray-200 px-6 py-8 animate-pulse">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div>
                <div className="h-8 bg-gray-200 rounded w-96 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = news ? getStatusInfo(news) : null;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/news')}
              className="mt-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {news?.title || 'Loading...'}
              </h1>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Badge 
                    variant={statusInfo?.color === 'green' ? 'default' : 'secondary'}
                  >
                    {statusInfo?.label || 'Unknown'}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{news?.authorName || 'Unknown Author'}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {news?.publishedAt 
                      ? `Published ${formatDate(news.publishedAt)}` 
                      : news?.createdAt ? `Created ${formatDate(news.createdAt)}` : 'No date'
                    }
                  </span>
                </div>
                
                {/* Views stats not yet available in API */}
              </div>

              {/* Excerpt can be derived from body if needed */}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/news/${news?.id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}