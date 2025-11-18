'use client';

import { useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useAuthStore } from '@/store/auth-store';
import { useAutoSave } from '@/store/event-draft-store';
import { 
  AUTO_SAVE_EVENT 
} from '@/lib/graphql/events';
import { MY_COMPANY_PROFILE } from '@/lib/graphql/settings';
import { isSuperAdmin, isAdmin } from '@/lib/roles';
import type { UseFormReturn, FieldValues } from 'react-hook-form';

interface UseEventDraftProps {
  eventId: string; // Now required - we always have an event ID
  mode: 'draft' | 'edit'; // Removed 'create' mode
  form: UseFormReturn<FieldValues>;
  watchedValues: Record<string, unknown>;
}

export function useEventDraft({ eventId, form, watchedValues }: Omit<UseEventDraftProps, 'mode'>) {
  const { user } = useAuthStore();
  
  // Track initialization time to prevent immediate autosave
  const initTimeRef = useRef<number>(0);
  
  // Enhanced auto-save store
  const {
    draftId,
    initializeDraft,
    immediateAutoSave,
    formData: draftFormData,
    getMetrics
  } = useAutoSave();
  
  // Determine if user can see company selector
  const canSelectCompany = user && (isSuperAdmin(user) || isAdmin(user));
  
  // Get user's company profile (for members)
  const { data: companyData } = useQuery(MY_COMPANY_PROFILE, {
    skip: !!canSelectCompany,
    errorPolicy: 'all'
  });
  
  const userCompanyId = companyData?.myCompanyProfile?.id;
  
  // GraphQL mutation for autosave
  const [autoSaveEventMutation] = useMutation(AUTO_SAVE_EVENT);

  // Initialize the draft store with the provided eventId
  useEffect(() => {
    if (eventId) {
      // Always use the provided eventId for both draft and edit modes
      initializeDraft(eventId);
      
      // Set company ID for non-admin users
      if (!canSelectCompany && userCompanyId) {
        form.setValue('companyId', userCompanyId);
      }
      
      // Mark initialization time to prevent immediate autosave
      initTimeRef.current = Date.now();
    }
  }, [eventId, initializeDraft, canSelectCompany, userCompanyId, form]);

  // Enhanced auto-save with intelligent field tracking and loop prevention
  const lastProcessedRef = useRef<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (!draftId) return;
    
    // Prevent autosave for 3 seconds after initialization to avoid duplicates
    const timeSinceInit = Date.now() - initTimeRef.current;
    const isJustInitialized = initTimeRef.current > 0 && timeSinceInit < 3000;
    
    if (isJustInitialized) return;
    
    // Create a hash of watchedValues to prevent duplicate processing
    const currentHash = JSON.stringify(watchedValues);
    if (lastProcessedRef.current === currentHash) return;
    lastProcessedRef.current = currentHash;
    
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Debounce the autosave to prevent excessive calls
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const formData = form.getValues();

        // Prepare autosave data with same logic as before but simpler
        const autoSaveData: Record<string, unknown> = {};

        // Always save title, even if empty - critical for syncing
        autoSaveData.title = (formData.title || '').trim();
        autoSaveData.summary = (formData.summary || '').trim();
        autoSaveData.description = (formData.description || '').trim();

        // Save selection fields only if they have values
        if (formData.companyId) autoSaveData.companyId = formData.companyId;
        if (formData.market) autoSaveData.market = formData.market;

        // ALWAYS include tag fields - critical for syncing tag selections
        if (formData.mainGenreId) autoSaveData.mainGenreId = formData.mainGenreId;
        if (formData.subgenreId) autoSaveData.subgenreId = formData.subgenreId;
        // Always include tag arrays, even if empty (to handle tag removal)
        if (formData.supportingTagIds !== undefined) {
          autoSaveData.supportingTagIds = formData.supportingTagIds || [];
        }
        if (formData.audienceTagIds !== undefined) {
          autoSaveData.audienceTagIds = formData.audienceTagIds || [];
        }

        if (formData.lineup) autoSaveData.lineup = formData.lineup;
        if (formData.agenda) autoSaveData.agenda = formData.agenda;

        // Directly call the GraphQL mutation without complex store interactions
        if (Object.keys(autoSaveData).length > 0) {
          await autoSaveEventMutation({
            variables: {
              eventId: draftId,
              data: autoSaveData
            }
          });
        }
      } catch (error) {
        console.error('Enhanced auto-save failed:', error);
      }
    }, 2000);
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    
  }, [watchedValues, draftId, form, autoSaveEventMutation]);

  // Enhanced manual save with current form state
  const handleManualSave = async () => {
    if (!draftId) return;

    try {
      const formData = form.getValues();

      // Prepare complete form data for manual save
      const autoSaveData: Record<string, unknown> = {};

      // Always save title, even if empty - critical for syncing
      autoSaveData.title = (formData.title || '').trim();
      autoSaveData.summary = (formData.summary || '').trim();
      autoSaveData.description = (formData.description || '').trim();

      // Save selection fields only if they have values
      if (formData.companyId) autoSaveData.companyId = formData.companyId;
      if (formData.market) autoSaveData.market = formData.market;

      // ALWAYS include tag fields - critical for syncing tag selections
      if (formData.mainGenreId) autoSaveData.mainGenreId = formData.mainGenreId;
      if (formData.subgenreId) autoSaveData.subgenreId = formData.subgenreId;
      // Always include tag arrays, even if empty (to handle tag removal)
      if (formData.supportingTagIds !== undefined) {
        autoSaveData.supportingTagIds = formData.supportingTagIds || [];
      }
      if (formData.audienceTagIds !== undefined) {
        autoSaveData.audienceTagIds = formData.audienceTagIds || [];
      }

      if (formData.lineup) autoSaveData.lineup = formData.lineup;
      if (formData.agenda) autoSaveData.agenda = formData.agenda;

      // Use immediate save for manual saves (bypass batching)
      await immediateAutoSave(async () => {
        await autoSaveEventMutation({
          variables: {
            eventId: draftId,
            data: autoSaveData
          }
        });
      });

    } catch (error) {
      console.error('Manual save failed:', error);
      throw error;
    }
  };

  return {
    draftId: eventId, // Always use the provided eventId
    draftFormData,
    handleManualSave,
    immediateAutoSave,
    canSelectCompany,
    userCompanyId,
    isInitializing: false, // No async initialization needed
    // Performance monitoring
    metrics: getMetrics ? getMetrics() : null
  };
}