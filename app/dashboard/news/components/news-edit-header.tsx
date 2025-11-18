"use client";

import { ArrowLeft, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { NewsDetail } from "@/types/news";

interface NewsEditHeaderProps {
  news: NewsDetail | null;
  onBack: () => void;
  onToggleStatus: (published: boolean) => void;
}

export function NewsEditHeader({ news, onBack, onToggleStatus }: NewsEditHeaderProps) {
  const isPublished = news?.status === 'APPROVED';

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Edit Article: {news?.title || 'Loading...'}
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={isPublished ? "default" : "secondary"}>
                {news?.status || 'DRAFT'}
              </Badge>
              {news?.categories && news.categories.length > 0 && (
                <span className="text-sm text-gray-500">
                  {news.categories.map(cat => cat.name).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Draft</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleStatus(!isPublished)}
              className="p-1"
            >
              {isPublished ? (
                <ToggleRight className="h-6 w-6 text-green-600" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-gray-400" />
              )}
            </Button>
            <span className="text-sm text-gray-600">Published</span>
          </div>
        </div>
      </div>
    </div>
  );
}