import { useEffect, useCallback, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { useNewsDraftStore, useAutoSave, NewsDraft } from '@/store/news-draft-store';
import { CreateNewsFormData } from '../lib/validations';
import { CREATE_NEWS_DRAFT, UPDATE_NEWS_DRAFT } from '@/lib/graphql/news';
import { showSuccessToast, showErrorToast } from '@/lib/toast-utils';

interface UseNewsDraftProps {
  form: UseFormReturn<CreateNewsFormData>;
  isEditing?: boolean;
  onAutoSaveStart?: () => void;
  onAutoSaveComplete?: (date: Date) => void;
}

export function useNewsDraft({
  form,
  isEditing = false,
  onAutoSaveStart,
  onAutoSaveComplete
}: UseNewsDraftProps) {
  const router = useRouter();
  const draftStore = useNewsDraftStore();
  const { autoSaveToLocalStorage, clearAutoSave, hasAutoSave, restoreFromAutoSave } = useAutoSave();

  const [createDraftMutation] = useMutation(CREATE_NEWS_DRAFT);
  const [updateDraftMutation] = useMutation(UPDATE_NEWS_DRAFT);

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isInitializedRef = useRef(false);
  const currentDraftIdRef = useRef<string | null>(null);

  // Initialize draft system
  useEffect(() => {
    if (isInitializedRef.current || isEditing) return;
    
    // Check if there's an auto-save to restore
    if (hasAutoSave()) {
      const shouldRestore = window.confirm(
        'We found an unsaved draft of your article. Would you like to restore it?'
      );
      
      if (shouldRestore) {
        const draftId = restoreFromAutoSave();
        if (draftId) {
          const draft = draftStore.getDraft(draftId);
          if (draft) {
            // Restore form data
            Object.keys(draft.data).forEach(key => {
              const value = draft.data[key as keyof CreateNewsFormData];
              if (value !== undefined) {
                form.setValue(key as keyof CreateNewsFormData, value);
              }
            });
            currentDraftIdRef.current = draftId;
            showSuccessToast('Draft restored successfully');
          }
        }
      } else {
        clearAutoSave();
      }
    } else {
      // Create a new draft
      const initialData = form.getValues();
      const draftId = draftStore.createDraft(initialData);
      currentDraftIdRef.current = draftId;
    }
    
    isInitializedRef.current = true;
  }, [isEditing, form, hasAutoSave, restoreFromAutoSave, clearAutoSave, draftStore]);

  // Auto-save functionality - Now saves to database
  const scheduleAutoSave = useCallback((data: Partial<CreateNewsFormData>) => {
    if (isEditing || !draftStore.autoSaveEnabled) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      onAutoSaveStart?.();
      
      try {
        // Generate a draft title for organization
        const draftTitle = (data as CreateNewsFormData).title?.trim() || 
          `Auto-saved ${new Date().toLocaleString()}`;

        if (currentDraftIdRef.current) {
          // Update existing draft
          await updateDraftMutation({
            variables: {
              input: {
                id: currentDraftIdRef.current,
                draftTitle,
                draftData: data,
                isAutoSave: true, // Auto-save
              }
            },
          });
        } else {
          // Create new draft
          const result = await createDraftMutation({
            variables: {
              input: {
                draftTitle,
                draftData: data,
                isAutoSave: true, // Auto-save
              }
            },
          });

          if (result.data?.createNewsDraft) {
            currentDraftIdRef.current = result.data.createNewsDraft.id;
          }
        }

        // Still maintain localStorage for immediate recovery
        autoSaveToLocalStorage(data);
        
        const now = new Date();
        onAutoSaveComplete?.(now);
      } catch (error) {
        // Fallback to local storage if database save fails
        autoSaveToLocalStorage(data);
        console.warn('Auto-save to database failed, saved locally:', error);
        
        const now = new Date();
        onAutoSaveComplete?.(now);
      }
    }, 5000); // Auto-save after 5 seconds of inactivity (slightly longer for less server load)
  }, [isEditing, draftStore, autoSaveToLocalStorage, onAutoSaveStart, onAutoSaveComplete, createDraftMutation, updateDraftMutation]);

  // Watch form changes for auto-save
  useEffect(() => {
    const subscription = form.watch((data) => {
      scheduleAutoSave(data as Partial<CreateNewsFormData>);
    });

    return () => subscription.unsubscribe();
  }, [form, scheduleAutoSave]);

  // Save as draft function - Now with flexible validation
  const saveAsDraft = useCallback(async () => {
    if (isEditing) return;

    try {
      const formData = form.getValues();
      
      // Generate a draft title for organization
      const draftTitle = formData.title?.trim() || 
        `Draft ${new Date().toLocaleDateString()}`;

      // Check if we're updating an existing draft or creating a new one
      if (currentDraftIdRef.current) {
        // Update existing draft
        const result = await updateDraftMutation({
          variables: {
            input: {
              id: currentDraftIdRef.current,
              draftTitle,
              draftData: formData,
              isAutoSave: false, // Manual save
            }
          },
        });

        if (result.data?.updateNewsDraft) {
          showSuccessToast('Draft updated successfully!');
        }
      } else {
        // Create new draft
        const result = await createDraftMutation({
          variables: {
            input: {
              draftTitle,
              draftData: formData,
              isAutoSave: false, // Manual save
            }
          },
        });

        if (result.data?.createNewsDraft) {
          currentDraftIdRef.current = result.data.createNewsDraft.id;
          
          // Clear local storage since it's now saved to database
          clearAutoSave();
          
          showSuccessToast('Draft saved successfully!');
          
          // Navigate back to news dashboard after a short delay
          setTimeout(() => {
            router.replace('/dashboard/news');
          }, 1500);
        }
      }
    } catch (error: unknown) {
      console.error('Save draft error:', error);
      let errorMessage = 'Failed to save draft';
      
      if (error && typeof error === 'object') {
        const err = error as { graphQLErrors?: Array<{ message: string }>; message?: string };
        errorMessage = err.graphQLErrors?.[0]?.message || err.message || errorMessage;
      }
      
      showErrorToast(errorMessage);
    }
  }, [isEditing, form, createDraftMutation, updateDraftMutation, clearAutoSave, router]);

  // Manual save draft to store only (not database)
  const saveToLocalDraft = useCallback(() => {
    if (isEditing) return;

    const formData = form.getValues();
    
    if (currentDraftIdRef.current) {
      draftStore.updateDraft(currentDraftIdRef.current, formData, false);
    } else {
      const draftId = draftStore.createDraft(formData);
      currentDraftIdRef.current = draftId;
    }
    
    autoSaveToLocalStorage(formData);
    showSuccessToast('Draft saved locally');
  }, [isEditing, form, draftStore, autoSaveToLocalStorage]);

  // Get available drafts
  const drafts = draftStore.getDraftsList();

  // Load draft
  const loadDraft = useCallback((draft: NewsDraft) => {
    Object.keys(draft.data).forEach(key => {
      const value = draft.data[key as keyof CreateNewsFormData];
      if (value !== undefined) {
        form.setValue(key as keyof CreateNewsFormData, value);
      }
    });
    currentDraftIdRef.current = draft.id;
    showSuccessToast(`Draft "${draft.title}" loaded`);
  }, [form]);

  // Delete draft
  const deleteDraft = useCallback((draftId: string) => {
    draftStore.deleteDraft(draftId);
    if (currentDraftIdRef.current === draftId) {
      currentDraftIdRef.current = null;
    }
    showSuccessToast('Draft deleted');
  }, [draftStore]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Actions
    saveAsDraft,
    saveToLocalDraft,
    loadDraft,
    deleteDraft,
    
    // State
    drafts,
    currentDraftId: currentDraftIdRef.current,
    autoSaveEnabled: draftStore.autoSaveEnabled,
    
    // Utils
    setAutoSaveEnabled: draftStore.setAutoSaveEnabled,
    hasAutoSave: hasAutoSave(),
  };
}