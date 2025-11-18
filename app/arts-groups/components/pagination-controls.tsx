/**
 * PaginationControls Component
 * Cursor-based pagination controls for arts groups
 */

'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight, Loader2 } from 'lucide-react';

interface PaginationControlsProps {
  hasNextPage: boolean;
  onLoadMore: () => void;
  loading?: boolean;
  currentCount: number;
  totalCount?: number;
}

export function PaginationControls({
  hasNextPage,
  onLoadMore,
  loading = false,
  currentCount,
  totalCount,
}: PaginationControlsProps) {
  if (!hasNextPage && currentCount === totalCount) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <div className="text-sm text-muted-foreground">
        Showing {currentCount} of {totalCount?.toLocaleString() || 'many'} arts groups
      </div>

      {hasNextPage && (
        <Button
          onClick={onLoadMore}
          disabled={loading}
          variant="outline"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              Load More
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}
