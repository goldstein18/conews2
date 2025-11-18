'use client';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  eventBasicSchema, 
  type EventBasicFormData,
  type AutoSaveEventData
} from '../lib/validations';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  status: string;
  isDraft: boolean;
  summary?: string;
  description?: string;
  companyId?: string;
  mainGenreId?: string;
  subgenreId?: string;
  supportingTagIds?: string[];
  audienceTagIds?: string[];
}

interface UseEventFormProps {
  initialData?: Event | null;
  mode: 'create' | 'draft' | 'edit';
  canSelectCompany: boolean;
  userCompanyId: string | undefined;
  draftFormData: Partial<AutoSaveEventData>;
  onSubmit: (event: Event) => void;
  onLoadingStart?: () => void;
  draftId?: string;
  immediateAutoSave: (saveHandler: () => Promise<void>) => Promise<void>;
  handleManualSave: () => Promise<void>;
}

export function useEventForm({
  initialData,
  mode,
  canSelectCompany,
  userCompanyId,
  draftFormData,
  onSubmit,
  onLoadingStart,
  draftId,
  immediateAutoSave,
  handleManualSave
}: UseEventFormProps) {
  // Form setup
  const form = useForm({
    resolver: zodResolver(eventBasicSchema),
    defaultValues: {
      title: '',
      summary: '',
      description: '',
      companyId: canSelectCompany ? '' : userCompanyId || '',
      mainGenreId: '',
      subgenreId: '',
      supportingTagIds: [],
      audienceTagIds: []
    }
  });
  
  // Watch form values for auto-save
  const watchedValues = useWatch({
    control: form.control
  });

  // Update form values when initialData changes
  // Note: draftFormData properties are intentionally excluded from deps to avoid infinite loops
  useEffect(() => {
    
    if (initialData && mode !== 'create') {
      
      // For draft mode, allow any saved title (even if it starts with "Draft Event -")
      // Use draft store data as fallback if initialData is empty
      
      
      const mainGenreId = initialData.mainGenreId || (draftFormData.mainGenreId as string) || '';
      const subgenreId = initialData.subgenreId || (draftFormData.subgenreId as string) || '';
      
      // Clear subgenreId if it might be incompatible (this will be validated by TagSelector)
      const cleanSubgenreId = mainGenreId && subgenreId ? subgenreId : '';
      
      const formData = {
        title: initialData.title || (draftFormData.title as string) || '',
        summary: initialData.summary || (draftFormData.summary as string) || '',
        description: initialData.description || (draftFormData.description as string) || '',
        companyId: canSelectCompany ? (initialData.companyId || '') : userCompanyId || '',
        mainGenreId,
        subgenreId: cleanSubgenreId,
        supportingTagIds: initialData.supportingTagIds || (draftFormData.supportingTagIds as string[]) || [],
        audienceTagIds: initialData.audienceTagIds || (draftFormData.audienceTagIds as string[]) || []
      };


      form.reset(formData);

      // Force a re-render after reset to update watched values
      setTimeout(() => {
        const currentMainGenre = form.getValues('mainGenreId');
        
        // Force trigger form watchers to update TagSelector
        if (formData.mainGenreId && currentMainGenre !== formData.mainGenreId) {
          form.setValue('mainGenreId', formData.mainGenreId, { shouldValidate: false });
          
          // Clear subgenre first, then set it after TagSelector updates
          form.setValue('subgenreId', '', { shouldValidate: false });
          
          // Wait for TagSelector to load new subgenres, then set the value
          setTimeout(() => {
            if (formData.subgenreId) {
              form.setValue('subgenreId', formData.subgenreId, { shouldValidate: false });
              
              // Force one more update if needed
              setTimeout(() => {
                const finalSubgenre = form.getValues('subgenreId');
                if (finalSubgenre !== formData.subgenreId) {
                  form.setValue('subgenreId', formData.subgenreId, { shouldValidate: false });
                }
              }, 100);
            }
          }, 500);
        } else if (formData.subgenreId) {
          // If mainGenre was already correct, just update subgenre
          form.setValue('subgenreId', formData.subgenreId, { shouldValidate: false });
        }
      }, 200);
    }
  }, [initialData, form, canSelectCompany, userCompanyId, mode, draftFormData]);

  // Form submission
  const handleSubmit = async (data: EventBasicFormData) => {
    if (!draftId) {
      toast.error('No draft available. Please refresh and try again.');
      return;
    }
    
    try {
      if (onLoadingStart) onLoadingStart();
      
      // Perform immediate save before continuing
      await immediateAutoSave(handleManualSave);
      
      // Create the event object to pass to next step
      const event: Event = {
        id: draftId,
        title: data.title,
        status: 'DRAFT',
        isDraft: true
      };
      
      toast.success('Basic information saved!');
      onSubmit(event);
      
    } catch (error) {
      console.error('Failed to save event:', error);
      toast.error('Failed to save event. Please try again.');
    }
  };

  // Character counters
  const titleValue = form.watch('title') || '';
  const titleCharsLeft = 75 - titleValue.length;
  
  const summaryValue = form.watch('summary') || '';
  const summaryCharsLeft = 140 - summaryValue.length;

  return {
    form,
    watchedValues,
    handleSubmit,
    titleCharsLeft,
    summaryCharsLeft
  };
}