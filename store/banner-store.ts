import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Banner, 
  BannerType, 
  BannerStatus, 
  BannerSortField, 
  BannerSortDirection,
  BannerFormData 
} from '@/types/banners';

interface BannerFilters {
  search: string;
  bannerType: BannerType | 'ALL';
  status: BannerStatus | 'ALL';
  market: string;
  companyId?: string;
  after?: string;
}

interface BannerSorting {
  field: BannerSortField;
  direction: BannerSortDirection;
}

interface BannerCreationFlow {
  selectedBannerType: BannerType | null;
  createdBanner: Banner | null;
  formData: Partial<BannerFormData>;
  currentStep: number;
}

interface BannerStore {
  // List view state
  filters: BannerFilters;
  sorting: BannerSorting;
  selectedTab: BannerType | 'ALL';
  
  // Creation flow state
  creationFlow: BannerCreationFlow;
  
  // UI state
  isCreating: boolean;
  isEditing: boolean;
  
  // Filter actions
  setFilters: (filters: Partial<BannerFilters>) => void;
  setSearch: (search: string) => void;
  setBannerTypeFilter: (bannerType: BannerType | 'ALL') => void;
  setStatusFilter: (status: BannerStatus | 'ALL') => void;
  setMarketFilter: (market: string) => void;
  setCompanyFilter: (companyId?: string) => void;
  setAfter: (after?: string) => void;
  clearFilters: () => void;
  
  // Sorting actions
  setSorting: (field: BannerSortField, direction?: BannerSortDirection) => void;
  
  // Tab actions
  setSelectedTab: (tab: BannerType | 'ALL') => void;
  
  // Creation flow actions
  setSelectedBannerType: (type: BannerType | null) => void;
  setCreatedBanner: (banner: Banner | null) => void;
  updateFormData: (data: Partial<BannerFormData>) => void;
  setCurrentStep: (step: number) => void;
  resetCreationFlow: () => void;
  
  // UI state actions
  setIsCreating: (isCreating: boolean) => void;
  setIsEditing: (isEditing: boolean) => void;
  
  // Utility functions
  hasActiveFilters: () => boolean;
  resetPagination: () => void;
}

const initialFilters: BannerFilters = {
  search: '',
  bannerType: 'ALL',
  status: 'ALL',
  market: '',
  companyId: undefined,
  after: undefined
};

const initialSorting: BannerSorting = {
  field: BannerSortField.CREATED_AT,
  direction: 'desc'
};

const initialCreationFlow: BannerCreationFlow = {
  selectedBannerType: null,
  createdBanner: null,
  formData: {},
  currentStep: 0
};

export const useBannerStore = create<BannerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      filters: initialFilters,
      sorting: initialSorting,
      selectedTab: 'ALL',
      creationFlow: initialCreationFlow,
      isCreating: false,
      isEditing: false,

      // Filter actions
      setFilters: (newFilters) => {
        set((state) => ({
          filters: {
            ...state.filters,
            ...newFilters,
            // Reset pagination when filters change
            after: newFilters.after === undefined ? undefined : newFilters.after
          }
        }));
      },

      setSearch: (search) => {
        set((state) => ({
          filters: {
            ...state.filters,
            search,
            after: undefined // Reset pagination
          }
        }));
      },

      setBannerTypeFilter: (bannerType) => {
        set((state) => ({
          filters: {
            ...state.filters,
            bannerType,
            after: undefined // Reset pagination
          }
        }));
      },

      setStatusFilter: (status) => {
        set((state) => ({
          filters: {
            ...state.filters,
            status,
            after: undefined // Reset pagination
          }
        }));
      },

      setMarketFilter: (market) => {
        set((state) => ({
          filters: {
            ...state.filters,
            market,
            after: undefined // Reset pagination
          }
        }));
      },

      setCompanyFilter: (companyId) => {
        set((state) => ({
          filters: {
            ...state.filters,
            companyId,
            after: undefined // Reset pagination
          }
        }));
      },

      setAfter: (after) => {
        set((state) => ({
          filters: {
            ...state.filters,
            after
          }
        }));
      },

      clearFilters: () => {
        set({
          filters: initialFilters // Reset all filters including companyId
        });
      },

      // Sorting actions
      setSorting: (field, direction) => {
        const currentState = get();
        const newDirection = direction || 
          (currentState.sorting.field === field && currentState.sorting.direction === 'asc' 
            ? 'desc' 
            : 'asc');
        
        set({
          sorting: { field, direction: newDirection },
          filters: {
            ...currentState.filters,
            after: undefined // Reset pagination when sorting changes
          }
        });
      },

      // Tab actions
      setSelectedTab: (tab) => {
        set((state) => ({
          selectedTab: tab,
          filters: {
            ...state.filters,
            bannerType: tab,
            after: undefined // Reset pagination when tab changes
          }
        }));
      },

      // Creation flow actions
      setSelectedBannerType: (type) => {
        set((state) => ({
          creationFlow: {
            ...state.creationFlow,
            selectedBannerType: type,
            currentStep: type ? 1 : 0
          }
        }));
      },

      setCreatedBanner: (banner) => {
        set((state) => ({
          creationFlow: {
            ...state.creationFlow,
            createdBanner: banner,
            currentStep: banner ? 2 : 1
          }
        }));
      },

      updateFormData: (data) => {
        set((state) => ({
          creationFlow: {
            ...state.creationFlow,
            formData: {
              ...state.creationFlow.formData,
              ...data
            }
          }
        }));
      },

      setCurrentStep: (step) => {
        set((state) => ({
          creationFlow: {
            ...state.creationFlow,
            currentStep: step
          }
        }));
      },

      resetCreationFlow: () => {
        set({
          creationFlow: initialCreationFlow,
          isCreating: false
        });
      },

      // UI state actions
      setIsCreating: (isCreating) => {
        set({ isCreating });
      },

      setIsEditing: (isEditing) => {
        set({ isEditing });
      },

      // Utility functions
      hasActiveFilters: () => {
        const { filters } = get();
        return !!(
          filters.search.trim() ||
          filters.bannerType !== 'ALL' ||
          filters.status !== 'ALL' ||
          filters.market.trim()
        );
      },

      resetPagination: () => {
        set((state) => ({
          filters: {
            ...state.filters,
            after: undefined
          }
        }));
      }
    }),
    {
      name: 'banner-store',
      partialize: (state) => ({
        // Only persist certain parts of the state
        filters: {
          ...state.filters,
          after: undefined // Don't persist pagination
        },
        sorting: state.sorting,
        selectedTab: state.selectedTab
        // Don't persist creation flow or UI states
      })
    }
  )
);