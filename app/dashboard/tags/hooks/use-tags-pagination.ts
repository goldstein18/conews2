"use client";

import { useState } from 'react';

export function useTagsPagination() {
  const [after, setAfter] = useState<string | undefined>();

  // Reset pagination when filters change
  const resetPagination = () => {
    setAfter(undefined);
  };

  const handleNextPage = (endCursor?: string) => {
    if (endCursor) {
      setAfter(endCursor);
    }
  };

  const handlePreviousPage = () => {
    setAfter(undefined);
  };

  return {
    after,
    setAfter,
    resetPagination,
    handleNextPage,
    handlePreviousPage,
  };
}