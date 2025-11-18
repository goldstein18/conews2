"use client";

import { Filter, FileText, Eye, MessageSquare, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NewsStatsProps {
  selectedSummaryFilter: string;
  onSummaryClick: (filterType: string) => void;
  onClearSummaryFilter: () => void;
}

export function NewsStats({
  selectedSummaryFilter,
  onSummaryClick,
  onClearSummaryFilter,
}: NewsStatsProps) {
  // if (statsLoading) {
  //   return (
  //     <div className="space-y-6">
  //       {/* Loading skeleton */}
  //       <div className="animate-pulse">
  //         <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
  //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  //           {[...Array(3)].map((_, i) => (
  //             <Card key={i}>
  //               <CardContent className="p-6">
  //                 <div className="h-12 bg-gray-200 rounded mb-2"></div>
  //                 <div className="h-6 bg-gray-200 rounded w-20"></div>
  //               </CardContent>
  //             </Card>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (statsError) {
  //   return (
  //     <div className="text-center py-8">
  //       <p className="text-red-500">Failed to load statistics</p>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
          {selectedSummaryFilter !== "all" && (
            <Badge 
              variant="secondary" 
              className="cursor-pointer"
              onClick={onClearSummaryFilter}
            >
              <Filter className="h-3 w-3 mr-1" />
              {selectedSummaryFilter} filter active
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card 
            className={`cursor-pointer transition-colors ${
              selectedSummaryFilter === "all" ? "ring-2 ring-blue-500" : "hover:bg-gray-50"
            }`}
            onClick={() => onSummaryClick("all")}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Articles</p>
                  {/* <p className="text-2xl font-bold text-gray-900">{summary.totalArticles}</p> */}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-colors ${
              selectedSummaryFilter === "published" ? "ring-2 ring-green-500" : "hover:bg-gray-50"
            }`}
            onClick={() => onSummaryClick("published")}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  {/* <p className="text-2xl font-bold text-gray-900">{summary.publishedArticles}</p> */}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-colors ${
              selectedSummaryFilter === "draft" ? "ring-2 ring-yellow-500" : "hover:bg-gray-50"
            }`}
            onClick={() => onSummaryClick("draft")}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Drafts</p>
                  {/* <p className="text-2xl font-bold text-gray-900">{summary.draftArticles}</p> */}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-colors ${
              selectedSummaryFilter === "featured" ? "ring-2 ring-purple-500" : "hover:bg-gray-50"
            }`}
            onClick={() => onSummaryClick("featured")}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <ThumbsUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  {/* <p className="text-2xl font-bold text-gray-900">{summary.featuredArticles}</p> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Statistics */}
      {/* {statusStats.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">By Status</h2>
            {selectedStatus !== "all" && (
              <Badge 
                variant="secondary" 
                className="cursor-pointer"
                onClick={onClearStatusFilter}
              >
                <Filter className="h-3 w-3 mr-1" />
                {selectedStatus} filter active
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statusStats.map((stat) => (
              <Card 
                key={stat.statusSlug}
                className={`cursor-pointer transition-colors ${
                  selectedStatus === stat.statusSlug ? "ring-2 ring-blue-500" : "hover:bg-gray-50"
                }`}
                onClick={() => onStatusClick(stat.statusSlug)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.statusName}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                    </div>
                    {stat.color && (
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: stat.color }}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}