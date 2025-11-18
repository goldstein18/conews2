import { create } from 'zustand';
import { AutoSaveEventData } from '@/app/dashboard/events/lib/validations';
import { autosaveDebugger } from '@/lib/autosave-debug';

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';
export type FieldType = 'text' | 'select' | 'complex';

// Field-specific autosave configuration
export interface FieldConfig {
  type: FieldType;
  debounceMs: number;
  priority: number; // Lower = higher priority
}

// Performance tracking
export interface AutoSaveMetrics {
  totalSaves: number;
  batchedSaves: number;
  lastSaveTime: number;
  averageDebounceTime: number;
  failureCount: number;
}

// Dirty field tracking
export interface DirtyFields {
  [fieldName: string]: {
    oldValue: unknown;
    newValue: unknown;
    timestamp: number;
    config: FieldConfig;
  };
}

export interface EventDraftState {
  // Draft management
  draftId: string | null;
  lastSaved: Date | null;
  autoSaveStatus: AutoSaveStatus;
  hasChanges: boolean;
  autoSaveTimer: NodeJS.Timeout | null;
  isInitializing: boolean;
  
  // Form data cache
  formData: Partial<AutoSaveEventData>;
  currentStep: number;
  
  // Error handling
  lastError: string | null;
  retryCount: number;
  
  // Enhanced performance features
  dirtyFields: DirtyFields;
  pendingRequest: Promise<void> | null;
  metrics: AutoSaveMetrics;
  fieldConfigs: Record<string, FieldConfig>;
  
  // Request queue for batching
  requestQueue: Array<{
    fieldName: string;
    value: unknown;
    timestamp: number;
    priority: number;
  }>;
  
  // Actions
  initializeDraft: (draftId: string) => void;
  updateFormData: (data: Partial<AutoSaveEventData>) => void;
  setAutoSaveStatus: (status: AutoSaveStatus) => void;
  setLastSaved: (date: Date) => void;
  setHasChanges: (hasChanges: boolean) => void;
  setCurrentStep: (step: number) => void;
  setAutoSaveTimer: (timer: NodeJS.Timeout | null) => void;
  setLastError: (error: string | null) => void;
  incrementRetryCount: () => void;
  resetRetryCount: () => void;
  setIsInitializing: (isInitializing: boolean) => void;
  
  // Enhanced actions
  updateField: (fieldName: string, value: unknown, config?: FieldConfig) => void;
  markFieldDirty: (fieldName: string, oldValue: unknown, newValue: unknown, config: FieldConfig) => void;
  getDirtyFieldsData: () => Partial<AutoSaveEventData>;
  clearDirtyFields: () => void;
  batchSave: (callback: (data: Partial<AutoSaveEventData>) => Promise<void>) => Promise<void>;
  
  // Performance methods
  getMetrics: () => AutoSaveMetrics;
  resetMetrics: () => void;
  
  // Cleanup
  clearDraft: () => void;
  reset: () => void;
}

// Default field configurations
const DEFAULT_FIELD_CONFIGS: Record<string, FieldConfig> = {
  // Text fields - longer debounce for typing
  title: { type: 'text', debounceMs: 2000, priority: 1 },
  summary: { type: 'text', debounceMs: 2000, priority: 1 },
  description: { type: 'text', debounceMs: 2000, priority: 1 },
  venueName: { type: 'text', debounceMs: 2000, priority: 2 },
  address: { type: 'text', debounceMs: 2000, priority: 2 },
  city: { type: 'text', debounceMs: 2000, priority: 2 },
  state: { type: 'text', debounceMs: 2000, priority: 2 },
  zipcode: { type: 'text', debounceMs: 2000, priority: 2 },
  virtualEventLink: { type: 'text', debounceMs: 2000, priority: 2 },
  
  // Selection fields - faster debounce
  companyId: { type: 'select', debounceMs: 1000, priority: 1 },
  market: { type: 'select', debounceMs: 1000, priority: 1 },
  mainGenreId: { type: 'select', debounceMs: 1000, priority: 1 },
  subgenreId: { type: 'select', debounceMs: 1000, priority: 1 },
  venueId: { type: 'select', debounceMs: 1000, priority: 2 },
  eventType: { type: 'select', debounceMs: 1000, priority: 1 },
  virtual: { type: 'select', debounceMs: 1000, priority: 2 },
  
  // Complex data - fastest debounce
  supportingTagIds: { type: 'complex', debounceMs: 500, priority: 1 },
  audienceTagIds: { type: 'complex', debounceMs: 500, priority: 1 },
  lineup: { type: 'complex', debounceMs: 500, priority: 2 },
  agenda: { type: 'complex', debounceMs: 500, priority: 2 },
  recurringDates: { type: 'complex', debounceMs: 500, priority: 1 },
  date: { type: 'select', debounceMs: 1000, priority: 1 },
  startTime: { type: 'select', debounceMs: 1000, priority: 1 },
  endTime: { type: 'select', debounceMs: 1000, priority: 1 },
};

const initialState = {
  draftId: null,
  lastSaved: null,
  autoSaveStatus: 'idle' as AutoSaveStatus,
  hasChanges: false,
  autoSaveTimer: null,
  isInitializing: false,
  formData: {},
  currentStep: 1,
  lastError: null,
  retryCount: 0,
  
  // Enhanced features
  dirtyFields: {},
  pendingRequest: null,
  metrics: {
    totalSaves: 0,
    batchedSaves: 0,
    lastSaveTime: 0,
    averageDebounceTime: 0,
    failureCount: 0
  },
  fieldConfigs: DEFAULT_FIELD_CONFIGS,
  requestQueue: []
};

// Simple store without localStorage persistence - eventId comes from URL
export const useEventDraftStore = create<EventDraftState>()((set, get) => ({
  ...initialState,
  
  initializeDraft: (draftId: string) => {
        // Clear any existing timer
        const currentTimer = get().autoSaveTimer;
        if (currentTimer) {
          clearTimeout(currentTimer);
        }
        
        // CRITICAL: Only reset formData if switching to a different event
        const currentDraftId = get().draftId;
        const shouldResetFormData = currentDraftId !== draftId;
        
        set({
          draftId,
          lastSaved: new Date(),
          autoSaveStatus: 'saved',
          hasChanges: false,
          formData: shouldResetFormData ? {} : get().formData,
          currentStep: shouldResetFormData ? 1 : get().currentStep,
          lastError: null,
          retryCount: 0,
          autoSaveTimer: null
        });
      },
      
      updateFormData: (data: Partial<AutoSaveEventData>) => {
        set(state => ({
          formData: { ...state.formData, ...data },
          hasChanges: true,
          autoSaveStatus: 'idle'
        }));
      },
      
      // Enhanced field update with intelligent change tracking
      updateField: (fieldName: string, value: unknown, config?: FieldConfig) => {
        const state = get();
        const fieldConfig = config || state.fieldConfigs[fieldName] || DEFAULT_FIELD_CONFIGS.title;
        const oldValue = state.formData[fieldName as keyof AutoSaveEventData];
        
        // Only proceed if value actually changed
        if (oldValue === value) return;
        
        // Debug logging
        autosaveDebugger.logFieldChange(fieldName, fieldConfig as unknown as Record<string, unknown>);
        
        // Batch all updates in a single set() call to prevent multiple re-renders
        set(currentState => ({
          formData: { ...currentState.formData, [fieldName]: value },
          hasChanges: true,
          autoSaveStatus: 'idle',
          dirtyFields: {
            ...currentState.dirtyFields,
            [fieldName]: {
              oldValue,
              newValue: value,
              timestamp: Date.now(),
              config: fieldConfig
            }
          }
        }));
      },
      
      markFieldDirty: (fieldName: string, oldValue: unknown, newValue: unknown, config: FieldConfig) => {
        set(state => ({
          dirtyFields: {
            ...state.dirtyFields,
            [fieldName]: {
              oldValue,
              newValue,
              timestamp: Date.now(),
              config
            }
          }
        }));
      },
      
      getDirtyFieldsData: () => {
        const { dirtyFields } = get();
        const data: Partial<AutoSaveEventData> = {};
        
        Object.entries(dirtyFields).forEach(([fieldName, fieldInfo]) => {
          (data as any)[fieldName] = fieldInfo.newValue;
        });
        
        return data;
      },
      
      clearDirtyFields: () => {
        set({ dirtyFields: {} });
      },
      
      setAutoSaveStatus: (status: AutoSaveStatus) => {
        set({ autoSaveStatus: status });
        
        // If successfully saved, update timestamp and clear changes flag
        if (status === 'saved') {
          set({ 
            lastSaved: new Date(), 
            hasChanges: false,
            lastError: null,
            retryCount: 0 
          });
        }
      },
      
      setLastSaved: (date: Date) => set({ lastSaved: date }),
      
      setHasChanges: (hasChanges: boolean) => set({ hasChanges }),
      
      setCurrentStep: (step: number) => set({ currentStep: step }),
      
      setAutoSaveTimer: (timer: NodeJS.Timeout | null) => {
        const state = get();
        
        // Prevent setting the same timer reference multiple times
        if (state.autoSaveTimer === timer) return;
        
        // Clear existing timer before setting new one
        if (state.autoSaveTimer) {
          clearTimeout(state.autoSaveTimer);
        }
        
        // Only update if the timer is actually different
        set((currentState) => {
          // Double-check that we're not setting the same timer
          if (currentState.autoSaveTimer === timer) return currentState;
          return { autoSaveTimer: timer };
        });
      },
      
      // Intelligent batch save with request coalescing
      batchSave: async (callback: (data: Partial<AutoSaveEventData>) => Promise<void>) => {
        const state = get();
        
        // If there's already a pending request, wait for it
        if (state.pendingRequest) {
          try {
            await state.pendingRequest;
          } catch (error) {
            // Ignore errors from previous request
          }
        }
        
        // Get only dirty fields for the save
        const dirtyData = get().getDirtyFieldsData();
        
        // Skip if no changes
        if (Object.keys(dirtyData).length === 0) {
          return;
        }
        
        // Create the save request
        const saveRequest = async () => {
          const saveId = `save-${Date.now()}`;
          const fieldsCount = Object.keys(dirtyData).length;
          
          try {
            get().setAutoSaveStatus('saving');
            autosaveDebugger.logSaveStart(saveId, fieldsCount);
            
            // Track performance metrics
            const startTime = Date.now();
            
            await callback(dirtyData);
            
            // Update metrics
            const saveTime = Date.now() - startTime;
            set(state => ({
              metrics: {
                ...state.metrics,
                totalSaves: state.metrics.totalSaves + 1,
                batchedSaves: state.metrics.batchedSaves + 1,
                lastSaveTime: saveTime,
                averageDebounceTime: (state.metrics.averageDebounceTime + saveTime) / 2
              }
            }));
            
            get().setAutoSaveStatus('saved');
            get().clearDirtyFields();
            
            autosaveDebugger.logSaveComplete(saveId, true);
            
          } catch (error) {
            console.error('Batch save failed:', error);
            get().setAutoSaveStatus('error');
            get().setLastError(error instanceof Error ? error.message : 'Batch save failed');
            get().incrementRetryCount();
            
            set(state => ({
              metrics: {
                ...state.metrics,
                failureCount: state.metrics.failureCount + 1
              }
            }));
            
            autosaveDebugger.logSaveComplete(saveId, false, error instanceof Error ? error : String(error));
            
            throw error;
          } finally {
            set({ pendingRequest: null });
          }
        };
        
        // Store the pending request
        const request = saveRequest();
        set({ pendingRequest: request });
        
        return request;
      },
      
      setLastError: (error: string | null) => set({ lastError: error }),
      
      incrementRetryCount: () => set(state => ({ retryCount: state.retryCount + 1 })),
      
      resetRetryCount: () => set({ retryCount: 0 }),
      
      setIsInitializing: (isInitializing: boolean) => set({ isInitializing }),
      
      // Performance tracking methods
      getMetrics: () => get().metrics,
      
      resetMetrics: () => {
        set(state => ({
          metrics: {
            totalSaves: 0,
            batchedSaves: 0,
            lastSaveTime: 0,
            averageDebounceTime: 0,
            failureCount: 0
          }
        }));
      },
      
      clearDraft: () => {
        const currentTimer = get().autoSaveTimer;
        if (currentTimer) {
          clearTimeout(currentTimer);
        }
        
        set({
          draftId: null,
          lastSaved: null,
          autoSaveStatus: 'idle',
          hasChanges: false,
          autoSaveTimer: null,
          isInitializing: false,
          formData: {},
          currentStep: 1,
          lastError: null,
          retryCount: 0,
          dirtyFields: {},
          pendingRequest: null,
          requestQueue: []
        });
      },
      
      reset: () => {
        const currentTimer = get().autoSaveTimer;
        if (currentTimer) {
          clearTimeout(currentTimer);
        }
        set({
          ...initialState,
          dirtyFields: {},
          pendingRequest: null,
          requestQueue: []
        });
    }
}));

// Enhanced utility hook for intelligent auto-save functionality
export const useAutoSave = () => {
  const store = useEventDraftStore();
  
  // Simplified and safe smart autosave
  let activeAutoSaveTimer: NodeJS.Timeout | null = null;
  
  const scheduleSmartAutoSave = (callback: (data: Partial<AutoSaveEventData>) => Promise<void>) => {
    const { dirtyFields, pendingRequest } = store;
    
    // Skip if there's already a pending request
    if (pendingRequest) {
      return;
    }
    
    // Skip if no dirty fields
    if (Object.keys(dirtyFields).length === 0) {
      return;
    }
    
    // Clear any existing timer to prevent multiple simultaneous schedules
    if (activeAutoSaveTimer) {
      clearTimeout(activeAutoSaveTimer);
      activeAutoSaveTimer = null;
    }
    
    // Calculate optimal debounce time
    const debounceTime = calculateOptimalDebounce(dirtyFields);
    const fieldsCount = Object.keys(dirtyFields).length;
    
    // Log batch creation for performance monitoring
    autosaveDebugger.logBatchCreated(fieldsCount, debounceTime);
    
    // Create new timer
    activeAutoSaveTimer = setTimeout(async () => {
      activeAutoSaveTimer = null; // Clear reference immediately
      
      // Final check before saving
      if (Object.keys(store.dirtyFields).length === 0 || store.pendingRequest) {
        return;
      }
      
      try {
        await store.batchSave(callback);
      } catch (error) {
        console.error('Smart autosave failed:', error);
      }
    }, debounceTime);
  };
  
  // Legacy support for immediate saves
  const scheduleAutoSave = (callback: () => Promise<void>, delay = 2000) => {
    // Clear existing timer
    if (store.autoSaveTimer) {
      clearTimeout(store.autoSaveTimer);
    }
    
    // Schedule new auto-save
    const timer = setTimeout(async () => {
      if (store.hasChanges && store.draftId) {
        try {
          store.setAutoSaveStatus('saving');
          await callback();
          store.setAutoSaveStatus('saved');
        } catch (error) {
          console.error('Auto-save failed:', error);
          store.setAutoSaveStatus('error');
          store.setLastError(error instanceof Error ? error.message : 'Auto-save failed');
          store.incrementRetryCount();
        }
      }
    }, delay);
    
    store.setAutoSaveTimer(timer);
  };
  
  const immediateAutoSave = async (callback: () => Promise<void>) => {
    if (!store.draftId) return;
    
    try {
      store.setAutoSaveStatus('saving');
      await callback();
      store.setAutoSaveStatus('saved');
    } catch (error) {
      console.error('Immediate auto-save failed:', error);
      store.setAutoSaveStatus('error');
      store.setLastError(error instanceof Error ? error.message : 'Auto-save failed');
      store.incrementRetryCount();
    }
  };
  
  // Field-specific update with intelligent batching
  const updateFieldValue = (fieldName: string, value: unknown, config?: FieldConfig) => {
    store.updateField(fieldName, value, config);
  };
  
  return {
    ...store,
    scheduleAutoSave,
    scheduleSmartAutoSave,
    immediateAutoSave,
    updateFieldValue
  };
};

// Calculate optimal debounce time based on field priorities and types
function calculateOptimalDebounce(dirtyFields: DirtyFields): number {
  if (Object.keys(dirtyFields).length === 0) return 2000;
  
  let minDebounce = Infinity;
  let hasHighPriority = false;
  
  Object.values(dirtyFields).forEach(field => {
    minDebounce = Math.min(minDebounce, field.config.debounceMs);
    if (field.config.priority <= 1) {
      hasHighPriority = true;
    }
  });
  
  // If we have high-priority fields, use their debounce time
  // Otherwise use the minimum debounce time found
  return hasHighPriority ? Math.min(minDebounce, 1500) : minDebounce;
}