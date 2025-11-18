import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ClientAssetReport, ReportPreview, OverallAnalytics } from '@/lib/graphql/asset-reports';

// Asset types for filtering
export type AssetType = 'ALL' | 'EVENTS' | 'BANNERS';

// Report status for UI
export type ReportStatus = 'idle' | 'previewing' | 'generating' | 'polling' | 'completed' | 'failed';

// Tab types
export type ReportTab = 'client-reports' | 'overall-analytics';

// Client Reports State
export interface ClientReportsState {
  selectedCompany: string | null;
  startDate: Date | null;
  endDate: Date | null;
  includeEvents: boolean;
  includeBanners: boolean;
  currentReportId: string | null;
  reportStatus: ReportStatus;
  previewData: ReportPreview | null;
  reportHistory: ClientAssetReport[];
  pollingInterval: number | null;
}

// Overall Analytics State
export interface AnalyticsState {
  startDate: Date | null;
  endDate: Date | null;
  assetType: AssetType;
  statsData: OverallAnalytics | null;
  loading: boolean;
}

// Main Store Interface
export interface ReportsStore {
  // Current active tab
  activeTab: ReportTab;
  
  // Client Reports State
  clientReports: ClientReportsState;
  
  // Overall Analytics State
  analytics: AnalyticsState;
  
  // Client Reports Actions
  setActiveTab: (tab: ReportTab) => void;
  setClientCompany: (companyId: string | null) => void;
  setClientDateRange: (startDate: Date | null, endDate: Date | null) => void;
  setIncludeEvents: (include: boolean) => void;
  setIncludeBanners: (include: boolean) => void;
  setReportStatus: (status: ReportStatus) => void;
  setCurrentReportId: (reportId: string | null) => void;
  setPreviewData: (data: ReportPreview | null) => void;
  setReportHistory: (reports: ClientAssetReport[]) => void;
  setPollingInterval: (interval: number | null) => void;
  clearClientReportsState: () => void;
  
  // Analytics Actions
  setAnalyticsDateRange: (startDate: Date | null, endDate: Date | null) => void;
  setAnalyticsAssetType: (assetType: AssetType) => void;
  setAnalyticsData: (data: OverallAnalytics | null) => void;
  setAnalyticsLoading: (loading: boolean) => void;
  clearAnalyticsState: () => void;
  
  // General Actions
  resetStore: () => void;
}

// Initial states
const initialClientReportsState: ClientReportsState = {
  selectedCompany: null,
  startDate: null,
  endDate: null,
  includeEvents: true,
  includeBanners: true,
  currentReportId: null,
  reportStatus: 'idle',
  previewData: null,
  reportHistory: [],
  pollingInterval: null,
};

const initialAnalyticsState: AnalyticsState = {
  startDate: null,
  endDate: null,
  assetType: 'ALL',
  statsData: null,
  loading: false,
};

// Create the store
export const useReportsStore = create<ReportsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      activeTab: 'client-reports',
      clientReports: initialClientReportsState,
      analytics: initialAnalyticsState,
      
      // Tab Actions
      setActiveTab: (tab: ReportTab) => set({ activeTab: tab }),
      
      // Client Reports Actions
      setClientCompany: (companyId: string | null) =>
        set((state) => ({
          clientReports: {
            ...state.clientReports,
            selectedCompany: companyId,
            previewData: null,
            reportHistory: [],
          },
        })),
        
      setClientDateRange: (startDate: Date | null, endDate: Date | null) =>
        set((state) => ({
          clientReports: {
            ...state.clientReports,
            startDate,
            endDate,
            previewData: null,
          },
        })),
        
      setIncludeEvents: (include: boolean) =>
        set((state) => ({
          clientReports: {
            ...state.clientReports,
            includeEvents: include,
            previewData: null,
          },
        })),
        
      setIncludeBanners: (include: boolean) =>
        set((state) => ({
          clientReports: {
            ...state.clientReports,
            includeBanners: include,
            previewData: null,
          },
        })),
        
      setReportStatus: (status: ReportStatus) =>
        set((state) => ({
          clientReports: {
            ...state.clientReports,
            reportStatus: status,
          },
        })),
        
      setCurrentReportId: (reportId: string | null) =>
        set((state) => ({
          clientReports: {
            ...state.clientReports,
            currentReportId: reportId,
          },
        })),
        
      setPreviewData: (data: ReportPreview | null) =>
        set((state) => ({
          clientReports: {
            ...state.clientReports,
            previewData: data,
          },
        })),
        
      setReportHistory: (reports: ClientAssetReport[]) =>
        set((state) => ({
          clientReports: {
            ...state.clientReports,
            reportHistory: reports,
          },
        })),
        
      setPollingInterval: (interval: number | null) =>
        set((state) => ({
          clientReports: {
            ...state.clientReports,
            pollingInterval: interval,
          },
        })),
        
      clearClientReportsState: () =>
        set((state) => ({
          clientReports: {
            ...initialClientReportsState,
            selectedCompany: state.clientReports.selectedCompany, // Keep company selection
          },
        })),
        
      // Analytics Actions
      setAnalyticsDateRange: (startDate: Date | null, endDate: Date | null) =>
        set((state) => ({
          analytics: {
            ...state.analytics,
            startDate,
            endDate,
          },
        })),
        
      setAnalyticsAssetType: (assetType: AssetType) =>
        set((state) => ({
          analytics: {
            ...state.analytics,
            assetType,
          },
        })),
        
      setAnalyticsData: (data: OverallAnalytics | null) =>
        set((state) => ({
          analytics: {
            ...state.analytics,
            statsData: data,
          },
        })),
        
      setAnalyticsLoading: (loading: boolean) =>
        set((state) => ({
          analytics: {
            ...state.analytics,
            loading,
          },
        })),
        
      clearAnalyticsState: () =>
        set((state) => ({
          analytics: initialAnalyticsState,
        })),
        
      // General Actions
      resetStore: () =>
        set({
          activeTab: 'client-reports',
          clientReports: initialClientReportsState,
          analytics: initialAnalyticsState,
        }),
    }),
    {
      name: 'reports-store',
      // Only persist basic preferences, not sensitive data
      partialize: (state) => ({
        activeTab: state.activeTab,
        clientReports: {
          includeEvents: state.clientReports.includeEvents,
          includeBanners: state.clientReports.includeBanners,
        },
        analytics: {
          assetType: state.analytics.assetType,
        },
      }),
    }
  )
);