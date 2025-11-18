'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNext: () => void;
  onPrevious: () => void;
  loading?: boolean;
  className?: string;
}

/**
 * Cursor-based pagination controls
 * Shows Previous/Next buttons with loading states
 */
export function PaginationControls({
  hasNextPage,
  hasPreviousPage,
  onNext,
  onPrevious,
  loading = false,
  className = ''
}: PaginationControlsProps) {
  if (!hasNextPage && !hasPreviousPage) {
    return null;
  }

  return (
    <div className={`flex justify-center items-center gap-4 ${className}`}>
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!hasPreviousPage || loading}
        className="gap-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
        Previous
      </Button>

      <Button
        variant="outline"
        onClick={onNext}
        disabled={!hasNextPage || loading}
        className="gap-2"
      >
        Next
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
