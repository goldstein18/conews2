import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CreateNewsFormData } from '@/app/dashboard/news/lib/validations';

export interface NewsDraft {
  id: string;
  title?: string;
  data: Partial<CreateNewsFormData>;
  lastSaved: Date;
  isAutoSaved: boolean;
}

interface NewsDraftState {
  drafts: Record<string, NewsDraft>;
  currentDraftId: string | null;
  autoSaveEnabled: boolean;
  
  // Actions
  createDraft: (initialData?: Partial<CreateNewsFormData>) => string;
  updateDraft: (draftId: string, data: Partial<CreateNewsFormData>, isAutoSave?: boolean) => void;
  getDraft: (draftId: string) => NewsDraft | null;
  deleteDraft: (draftId: string) => void;
  setCurrentDraft: (draftId: string | null) => void;
  clearAllDrafts: () => void;
  getDraftsList: () => NewsDraft[];
  setAutoSaveEnabled: (enabled: boolean) => void;
  
  // Utilities
  getAutoSaveKey: () => string;
  restoreFromAutoSave: () => string | null;
}

export const useNewsDraftStore = create<NewsDraftState>()(
  persist(
    (set, get) => ({
      drafts: {},
      currentDraftId: null,
      autoSaveEnabled: true,

      createDraft: (initialData = {}) => {
        const draftId = `draft_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const newDraft: NewsDraft = {
          id: draftId,
          title: initialData.title || 'Untitled Article',
          data: initialData,
          lastSaved: new Date(),
          isAutoSaved: false
        };

        set((state) => ({
          drafts: {
            ...state.drafts,
            [draftId]: newDraft
          },
          currentDraftId: draftId
        }));

        return draftId;
      },

      updateDraft: (draftId, data, isAutoSave = false) => {
        const existingDraft = get().drafts[draftId];
        if (!existingDraft) return;

        const updatedData = { ...existingDraft.data, ...data };
        const title = updatedData.title || 'Untitled Article';

        set((state) => ({
          drafts: {
            ...state.drafts,
            [draftId]: {
              ...existingDraft,
              title,
              data: updatedData,
              lastSaved: new Date(),
              isAutoSaved: isAutoSave
            }
          }
        }));
      },

      getDraft: (draftId) => {
        return get().drafts[draftId] || null;
      },

      deleteDraft: (draftId) => {
        set((state) => {
          const { [draftId]: removed, ...remainingDrafts } = state.drafts;
          return {
            drafts: remainingDrafts,
            currentDraftId: state.currentDraftId === draftId ? null : state.currentDraftId
          };
        });
      },

      setCurrentDraft: (draftId) => {
        set({ currentDraftId: draftId });
      },

      clearAllDrafts: () => {
        set({ drafts: {}, currentDraftId: null });
      },

      getDraftsList: () => {
        const drafts = Object.values(get().drafts);
        return drafts.sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime());
      },

      setAutoSaveEnabled: (enabled) => {
        set({ autoSaveEnabled: enabled });
      },

      getAutoSaveKey: () => {
        return 'news_autosave_draft';
      },

      restoreFromAutoSave: () => {
        const autoSaveKey = get().getAutoSaveKey();
        const saved = localStorage.getItem(autoSaveKey);
        
        if (saved) {
          try {
            const data = JSON.parse(saved);
            const draftId = get().createDraft(data);
            localStorage.removeItem(autoSaveKey); // Clean up auto-save after restoring
            return draftId;
          } catch (error) {
            console.error('Failed to restore from auto-save:', error);
            localStorage.removeItem(autoSaveKey);
          }
        }
        
        return null;
      }
    }),
    {
      name: 'news-drafts-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        drafts: state.drafts,
        autoSaveEnabled: state.autoSaveEnabled
      })
    }
  )
);

// Auto-save functionality
export const useAutoSave = () => {
  const store = useNewsDraftStore();
  
  const autoSaveToLocalStorage = (data: Partial<CreateNewsFormData>) => {
    if (!store.autoSaveEnabled) return;
    
    const autoSaveKey = store.getAutoSaveKey();
    try {
      localStorage.setItem(autoSaveKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to auto-save:', error);
    }
  };

  const clearAutoSave = () => {
    const autoSaveKey = store.getAutoSaveKey();
    localStorage.removeItem(autoSaveKey);
  };

  const hasAutoSave = () => {
    const autoSaveKey = store.getAutoSaveKey();
    return localStorage.getItem(autoSaveKey) !== null;
  };

  return {
    autoSaveToLocalStorage,
    clearAutoSave,
    hasAutoSave,
    restoreFromAutoSave: store.restoreFromAutoSave
  };
};