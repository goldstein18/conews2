'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PageInfo } from '@/types/public-venues';

interface PaginationControlsProps {
  pageInfo?: PageInfo;
  onNextPage: () => void;
  onPreviousPage?: () => void;
  loading?: boolean;
}

/**
 * Cursor-based pagination controls with Previous/Next buttons
 * Shows total count and disables buttons appropriately
 */
export function PaginationControls({
  pageInfo,
  onNextPage,
  onPreviousPage,
  loading = false
}: PaginationControlsProps) {
  if (!pageInfo) return null;

  const { hasNextPage, hasPreviousPage, totalCount } = pageInfo;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
      {/* Total count */}
      <div className="text-sm text-muted-foreground">
        {totalCount !== undefined && totalCount > 0 && (
          <span>
            <strong>{totalCount}</strong> {totalCount === 1 ? 'venue' : 'venues'} found
          </span>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        {onPreviousPage && (
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousPage}
            disabled={!hasPreviousPage || loading}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
        )}

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!hasNextPage || loading}
          className="gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
