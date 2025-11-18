"use client";

import { Eye, MessageSquare, ThumbsUp, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { NewsDetail } from "@/types/news";

interface NewsStatsProps {
  news: NewsDetail | null;
  loading?: boolean;
}

export function NewsStats({ loading = false }: Omit<NewsStatsProps, 'news'>) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Stats not yet available in API - placeholder for future implementation
  const stats = [
    {
      icon: Eye,
      label: "Views",
      value: 0, // Not yet available in API
      color: "text-blue-600",
    },
    {
      icon: MessageSquare,
      label: "Comments",
      value: 0, // Not yet available in API
      color: "text-green-600",
    },
    {
      icon: ThumbsUp,
      label: "Likes",
      value: 0, // Not yet available in API
      color: "text-red-600",
    },
    {
      icon: Share2,
      label: "Shares",
      value: 0, // Not yet available in API
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}