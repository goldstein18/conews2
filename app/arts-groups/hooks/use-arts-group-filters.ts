/**
 * useArtsGroupFilters Hook
 * Zustand store for managing arts group filter state
 */

'use client';

import { create } from 'zustand';
import type { ArtsGroupFilters, MarketValue } from '@/types/public-arts-groups';
import { DEFAULT_ARTS_GROUP_FILTERS } from '@/types/public-arts-groups';

interface ArtsGroupFiltersState {
  filters: ArtsGroupFilters;
  setMarket: (market: MarketValue | undefined) => void;
  setSearch: (search: string) => void;
  setArtType: (artType: string | undefined) => void;
  setLocation: (city: string | undefined, state: string | undefined) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;
}

export const useArtsGroupFilters = create<ArtsGroupFiltersState>((set, get) => ({
  filters: DEFAULT_ARTS_GROUP_FILTERS,

  setMarket: (market) =>
    set((state) => ({
      filters: { ...state.filters, market },
    })),

  setSearch: (search) =>
    set((state) => ({
      filters: { ...state.filters, search },
    })),

  setArtType: (artType) =>
    set((state) => ({
      filters: { ...state.filters, artType },
    })),

  setLocation: (city, state) =>
    set((prevState) => ({
      filters: { ...prevState.filters, city, state },
    })),

  clearFilters: () =>
    set({
      filters: DEFAULT_ARTS_GROUP_FILTERS,
    }),

  hasActiveFilters: () => {
    const { filters } = get();
    return !!(
      filters.market ||
      filters.search ||
      filters.artType ||
      filters.city ||
      filters.state
    );
  },
}));
