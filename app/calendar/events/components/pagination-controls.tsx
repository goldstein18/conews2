/**
 * Pagination controls for infinite scroll
 * Shows "Load More" button when more events available
 */

'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PageInfo } from '@/types/public-events';

interface PaginationControlsProps {
  pageInfo: PageInfo;
  onNextPage: () => Promise<void>;
  loading?: boolean;
}

export function PaginationControls({
  pageInfo,
  onNextPage,
  loading = false
}: PaginationControlsProps) {
  // Don't show if no more pages
  if (!pageInfo.hasNextPage) {
    return null;
  }

  return (
    <div className="flex justify-center pt-8">
      <Button
        onClick={onNextPage}
        disabled={loading}
        size="lg"
        className="gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading...
          </>
        ) : (
          'Load More Events'
        )}
      </Button>
    </div>
  );
}
