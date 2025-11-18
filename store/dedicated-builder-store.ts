import { create } from 'zustand';

/**
 * Campaign state for Brevo campaign management
 */
export interface DedicatedCampaignState {
  campaignId: number | null;
  campaignStatus: 'not_created' | 'created' | 'test_sent' | 'sent' | 'error';
  lastError?: string;
}

/**
 * Settings for Brevo campaign configuration
 */
export interface DedicatedBuilderSettings {
  selectedBrevoLists: string[];
  selectedBrevoSegments: string[];
  exclusionListIds: string[];
}

/**
 * Dedicated Builder Store State
 * Manages the state for the dedicated campaign builder interface
 */
export interface DedicatedBuilderState {
  // Current dedicated being edited
  currentDedicatedId: string | null;

  // Preview state
  generatedHtml: string | null;
  isGeneratingPreview: boolean;

  // Campaign settings
  settings: DedicatedBuilderSettings;

  // Campaign state
  campaign: DedicatedCampaignState;

  // Actions
  setCurrentDedicatedId: (id: string) => void;

  // Preview management
  setGeneratedHtml: (html: string | null) => void;
  setIsGeneratingPreview: (isGenerating: boolean) => void;
  generatePreviewHtml: () => void;

  // Settings management
  updateSettings: (settings: Partial<DedicatedBuilderSettings>) => void;
  setSelectedBrevoLists: (lists: string[]) => void;
  setSelectedBrevoSegments: (segments: string[]) => void;
  setExclusionListIds: (lists: string[]) => void;

  // Campaign management
  setCampaignId: (id: number | null) => void;
  setCampaignStatus: (status: DedicatedCampaignState['campaignStatus']) => void;
  setCampaignError: (error: string) => void;
  clearCampaignError: () => void;

  // Reset
  reset: () => void;
}

const initialSettings: DedicatedBuilderSettings = {
  selectedBrevoLists: [],
  selectedBrevoSegments: [],
  exclusionListIds: []
};

const initialCampaign: DedicatedCampaignState = {
  campaignId: null,
  campaignStatus: 'not_created',
  lastError: undefined
};

/**
 * Zustand store for Dedicated Builder
 * Manages state for campaign creation and Brevo integration
 */
export const useDedicatedBuilderStore = create<DedicatedBuilderState>((set, get) => ({
  // Initial state
  currentDedicatedId: null,
  generatedHtml: null,
  isGeneratingPreview: false,
  settings: initialSettings,
  campaign: initialCampaign,

  // Basic setters
  setCurrentDedicatedId: (id) => set({ currentDedicatedId: id }),

  // Preview management
  setGeneratedHtml: (html) => set({ generatedHtml: html }),
  setIsGeneratingPreview: (isGenerating) => set({ isGeneratingPreview: isGenerating }),

  generatePreviewHtml: () => {
    const state = get();
    if (!state.currentDedicatedId) {
      console.warn('No dedicated ID set for preview generation');
      return;
    }

    set({ isGeneratingPreview: true });

    try {
      // The HTML will be generated in the preview panel component
      // using the dedicated data and generateDedicatedHtmlContent utility
      console.log('Preview generation requested for dedicated:', state.currentDedicatedId);
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      set({ isGeneratingPreview: false });
    }
  },

  // Settings management
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    })),

  setSelectedBrevoLists: (lists) =>
    set((state) => ({
      settings: { ...state.settings, selectedBrevoLists: lists }
    })),

  setSelectedBrevoSegments: (segments) =>
    set((state) => ({
      settings: { ...state.settings, selectedBrevoSegments: segments }
    })),

  setExclusionListIds: (lists) =>
    set((state) => ({
      settings: { ...state.settings, exclusionListIds: lists }
    })),

  // Campaign management
  setCampaignId: (id) =>
    set((state) => ({
      campaign: { ...state.campaign, campaignId: id }
    })),

  setCampaignStatus: (status) =>
    set((state) => ({
      campaign: { ...state.campaign, campaignStatus: status }
    })),

  setCampaignError: (error) =>
    set((state) => ({
      campaign: {
        ...state.campaign,
        campaignStatus: 'error',
        lastError: error
      }
    })),

  clearCampaignError: () =>
    set((state) => ({
      campaign: { ...state.campaign, lastError: undefined }
    })),

  // Reset
  reset: () =>
    set({
      currentDedicatedId: null,
      generatedHtml: null,
      isGeneratingPreview: false,
      settings: initialSettings,
      campaign: initialCampaign
    })
}));
