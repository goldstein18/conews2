import { useState, useCallback } from 'react';
import type { MarqueeStatus } from '@/types/marquee';

export interface MarqueeFilters {
  search: string;
  status?: MarqueeStatus;
  market?: string;
}

export function useMarqueeFilters() {
  const [filters, setFilters] = useState<MarqueeFilters>({
    search: '',
    status: undefined,
    market: undefined,
  });

  const updateFilters = useCallback((newFilters: Partial<MarqueeFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: undefined,
      market: undefined,
    });
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setStatus = useCallback((status: MarqueeStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const setMarket = useCallback((market: string | undefined) => {
    setFilters((prev) => ({ ...prev, market }));
  }, []);

  return {
    filters,
    updateFilters,
    resetFilters,
    setSearch,
    setStatus,
    setMarket,
  };
}
