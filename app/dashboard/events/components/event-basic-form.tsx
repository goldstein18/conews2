'use client';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEventBasicSchema, type EventBasicFormData } from '../lib/validations';
import { Form } from '@/components/ui/form';
import { EventBasicInfoCard } from './event-basic-info-card';
import { EventCategoriesCard } from './event-categories-card';
import { EventFormActions } from './event-form-actions';
import { useEventDraft } from '../hooks/use-event-draft';
import { useAuthStore } from '@/store/auth-store';
import { isSuperAdmin, isAdmin } from '@/lib/roles';
import { toast } from 'sonner';
import { useQuery } from '@apollo/client';
import { MY_COMPANY_PROFILE } from '@/lib/graphql/settings';

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

interface EventBasicFormProps {
  eventId: string; // Now required since we always work with existing events
  initialData?: Event | null;
  onSubmit: (event: Event) => void;
  onCancel: () => void;
  mode?: 'draft' | 'edit';
  isDraft?: boolean;
}

export function EventBasicForm({
  eventId,
  initialData,
  onSubmit,
  onCancel
}: EventBasicFormProps) {
  const { user } = useAuthStore();

  // Determine if user can select company (admin/super-admin only)
  const canSelectCompany = user && (isSuperAdmin(user) || isAdmin(user));

  // Get user's company profile (for members)
  const { data: companyData } = useQuery(MY_COMPANY_PROFILE, {
    skip: !!canSelectCompany,
    errorPolicy: 'all'
  });

  const userCompanyId = companyData?.myCompanyProfile?.id;

  // Form setup with dynamic schema based on user permissions
  const dynamicSchema = createEventBasicSchema(!!canSelectCompany);
  const form = useForm({
    resolver: zodResolver(dynamicSchema),
    mode: 'all', // Validate on change, blur, and submit
    defaultValues: {
      title: initialData?.title || '',
      summary: initialData?.summary || '',
      description: initialData?.description || '',
      companyId: initialData?.companyId || userCompanyId || '',
      mainGenreId: initialData?.mainGenreId || '',
      subgenreId: initialData?.subgenreId || '',
      supportingTagIds: initialData?.supportingTagIds || [],
      audienceTagIds: initialData?.audienceTagIds || []
    }
  });
  
  // Watch form values for auto-save
  const watchedValues = useWatch({
    control: form.control
  });

  // Draft management hook
  const {
    draftId,
    isInitializing
  } = useEventDraft({
    eventId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: form as any,
    watchedValues
  });

  // Form submission handler - navigate to next step (auto-save handles saving)
  const handleSubmit = async (data: EventBasicFormData) => {
    if (!draftId) {
      console.error('No draftId available for submit');
      toast.error('No draft available. Please refresh and try again.');
      return;
    }

    // For members, ensure companyId is set to their company
    if (!canSelectCompany && userCompanyId) {
      data.companyId = userCompanyId;
    }

    // Create the event object to pass to next step
    // Preserve existing status and isDraft when editing, use defaults for new events
    const event: Event = {
      id: draftId,
      title: data.title,
      status: initialData?.status || 'DRAFT',
      isDraft: initialData?.isDraft ?? true,
      summary: data.summary,
      description: data.description,
      companyId: data.companyId,
      mainGenreId: data.mainGenreId,
      subgenreId: data.subgenreId,
      supportingTagIds: data.supportingTagIds,
      audienceTagIds: data.audienceTagIds
    };

    // Navigate to next step (auto-save already handles saving)
    onSubmit(event);
  };

  // Character counters and form values for validation
  const titleValue = form.watch('title') || '';
  const titleCharsLeft = 75 - titleValue.length;
  
  const summaryValue = form.watch('summary') || '';
  const summaryCharsLeft = 140 - summaryValue.length;
  
  const companyIdValue = form.watch('companyId');
  const mainGenreIdValue = form.watch('mainGenreId');
  const subgenreIdValue = form.watch('subgenreId');

  // Re-initialize form when initialData changes (for editing existing events)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      form.reset({
        title: initialData.title || '',
        summary: initialData.summary || '',
        description: initialData.description || '',
        companyId: initialData.companyId || userCompanyId || '',
        mainGenreId: initialData.mainGenreId || '',
        subgenreId: initialData.subgenreId || '',
        supportingTagIds: initialData.supportingTagIds || [],
        audienceTagIds: initialData.audienceTagIds || []
      });

      // Debug logging
      console.log('🔍 Form reset with initialData:', {
        companyId: initialData.companyId,
        title: initialData.title
      });
    }
  }, [initialData, form, userCompanyId]);

  // Trigger validation when key values change
  useEffect(() => {
    form.trigger(); // Re-validate form
  }, [titleValue, companyIdValue, mainGenreIdValue, subgenreIdValue, form]);
  
  // Don't render anything when initializing - let parent handle skeleton
  if (isInitializing) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Build your event page</h1>
        <p className="text-gray-600">Add all of your event details and let attendees know what to expect</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <EventBasicInfoCard
            control={
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              form.control as any
            }
            titleCharsLeft={titleCharsLeft}
            summaryCharsLeft={summaryCharsLeft}
            canSelectCompany={!!canSelectCompany}
          />

          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <EventCategoriesCard form={form as any} />

          <EventFormActions
            onCancel={onCancel}
            isValid={form.formState.isValid}
            draftId={draftId || undefined}
          />
        </form>
      </Form>
    </div>
  );
}