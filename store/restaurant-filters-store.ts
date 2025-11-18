import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { RestaurantStatus, PriceRange } from '@/types/restaurants';

interface RestaurantFiltersState {
  // Filter values
  search: string;
  status: RestaurantStatus | 'ALL';
  priceRange: PriceRange | 'ALL';
  city: string;
  market: string;
  cuisineType: string;
  after?: string; // Pagination cursor
  
  // Actions
  setSearch: (search: string) => void;
  setStatus: (status: RestaurantStatus | 'ALL') => void;
  setPriceRange: (priceRange: PriceRange | 'ALL') => void;
  setCity: (city: string) => void;
  setMarket: (market: string) => void;
  setCuisineType: (cuisineType: string) => void;
  setAfter: (after?: string) => void;
  clearFilters: () => void;
  
  // Getters for GraphQL variables
  getFilterVariables: () => {
    search?: string;
    status?: RestaurantStatus;
    priceRange?: PriceRange;
    city?: string;
    market?: string;
    cuisineType?: string;
    first: number;
    after?: string;
    includeTotalCount: boolean;
  };
}

export const useRestaurantFiltersStore = create<RestaurantFiltersState>()(
  persist(
    (set, get) => ({
      // Initial state
      search: '',
      status: 'ALL',
      priceRange: 'ALL',
      city: '',
      market: '',
      cuisineType: '',
      after: undefined,
      
      // Actions
      setSearch: (search) => set({ search, after: undefined }), // Reset pagination on search
      
      setStatus: (status) => set({ status, after: undefined }), // Reset pagination on filter change
      
      setPriceRange: (priceRange) => set({ priceRange, after: undefined }),
      
      setCity: (city) => set({ city, after: undefined }),
      
      setMarket: (market) => set({ market, after: undefined }),
      
      setCuisineType: (cuisineType) => set({ cuisineType, after: undefined }),
      
      setAfter: (after) => set({ after }),
      
      clearFilters: () => set({
        search: '',
        status: 'ALL',
        priceRange: 'ALL',
        city: '',
        market: '',
        cuisineType: '',
        after: undefined
      }),
      
      // Getter for GraphQL variables
      getFilterVariables: () => {
        const state = get();
        const variables: any = {
          first: 20,
          includeTotalCount: true
        };
        
        // Only include non-empty/non-default values
        if (state.search.trim()) {
          variables.search = state.search.trim();
        }
        
        if (state.status !== 'ALL') {
          variables.status = state.status;
        }
        
        if (state.priceRange !== 'ALL') {
          variables.priceRange = state.priceRange;
        }
        
        if (state.city.trim()) {
          variables.city = state.city.trim();
        }
        
        if (state.market.trim()) {
          variables.market = state.market.trim();
        }
        
        if (state.cuisineType.trim()) {
          variables.cuisineType = state.cuisineType.trim();
        }
        
        if (state.after) {
          variables.after = state.after;
        }
        
        return variables;
      }
    }),
    {
      name: 'restaurant-filters',
      storage: createJSONStorage(() => sessionStorage), // Use session storage for filters
      partialize: (state) => ({
        // Only persist certain fields, not pagination
        search: state.search,
        status: state.status,
        priceRange: state.priceRange,
        city: state.city,
        market: state.market,
        cuisineType: state.cuisineType
      })
    }
  )
);

// Hook for easy access to filter actions
export const useRestaurantFilters = () => {
  const store = useRestaurantFiltersStore();
  
  return {
    // State
    search: store.search,
    status: store.status,
    priceRange: store.priceRange,
    city: store.city,
    market: store.market,
    cuisineType: store.cuisineType,
    after: store.after,
    
    // Actions
    setSearch: store.setSearch,
    setStatus: store.setStatus,
    setPriceRange: store.setPriceRange,
    setCity: store.setCity,
    setMarket: store.setMarket,
    setCuisineType: store.setCuisineType,
    setAfter: store.setAfter,
    clearFilters: store.clearFilters,
    
    // Helper
    getFilterVariables: store.getFilterVariables
  };
};