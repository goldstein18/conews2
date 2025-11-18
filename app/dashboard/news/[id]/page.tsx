"use client";

import { useParams } from "next/navigation";
import { NewsDetail } from "@/types/news";
import { useNewsDetail } from "./hooks";
import { 
  NewsHeader, 
  NewsOverview, 
  NewsStats, 
  NewsContent 
} from "./components";

export default function NewsDetailPage() {
  const params = useParams();
  const newsId = params.id as string;

  const { news, loading, error } = useNewsDetail({ newsId });

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading news article: {error.message}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <NewsHeader news={{} as NewsDetail} loading={true} />
        <NewsStats loading={true} />
        <NewsOverview news={{} as NewsDetail} loading={true} />
        <NewsContent news={{} as NewsDetail} loading={true} />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">News article not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <NewsHeader news={news} />

      {/* Statistics Cards */}
      <NewsStats />

      {/* Article Details & Metadata */}
      <NewsOverview news={news} />

      {/* Article Content */}
      <NewsContent news={news} />
    </div>
  );
}