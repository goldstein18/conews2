"use client";

import { Eye, Edit, MoreHorizontal, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, getStatusInfo } from "../utils/news-helpers";
import { NewsSortField, SortDirection, NewsArticle } from "@/types/news";

type SortField = NewsSortField;

interface NewsTableProps {
  news: NewsArticle[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export function NewsTable({
  news,
  loading,
  error,
  totalCount,
  sortField,
  sortDirection,
  onSort,
}: NewsTableProps) {
  if (loading && news.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading articles...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Failed to load news articles: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (news.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Articles Found</CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <p className="text-gray-500 text-center">No news articles match your current filters.</p>
        </CardContent>
      </Card>
    );
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center space-x-1 hover:text-gray-600"
    >
      <span>{children}</span>
      {sortField === field && (
        sortDirection === 'asc' ?
          <ChevronUp className="h-4 w-4" /> :
          <ChevronDown className="h-4 w-4" />
      )}
    </button>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>News Articles ({totalCount})</CardTitle>
            <div className="text-sm text-gray-500">
              Showing {news.length} of {totalCount}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortButton field={NewsSortField.TITLE}>Title</SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton field={NewsSortField.ARTICLE_TYPE}>Type</SortButton>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>
                    <SortButton field={NewsSortField.PUBLISHED_AT}>Published</SortButton>
                  </TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((article) => {
                  const statusInfo = getStatusInfo(article);
                  
                  return (
                    <TableRow key={article.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{article.title}</div>
                          {article.body && (
                            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {article.body.substring(0, 100)}...
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {article.articleType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={statusInfo.color === 'green' ? 'default' : 'secondary'}
                        >
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {article.authorName ? (
                          <div className="text-sm">
                            <div>{article.authorName}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">No author</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {article.publishedAt ? (
                          formatDate(article.publishedAt)
                        ) : (
                          <span className="text-gray-400">Not published</span>
                        )}
                      </TableCell>
                      <TableCell>
                        0 {/* Views not yet available in API */}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <a href={`/dashboard/news/${article.id}`} className="flex items-center">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`/dashboard/news/${article.id}/edit`} className="flex items-center">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </a>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Total count */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Total: {totalCount} articles
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}