import { useMutation, useApolloClient } from '@apollo/client';
import { toast } from 'sonner';
import {
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  SUBMIT_DRAFT,
  CLONE_EVENT,
  BULK_UPDATE_EVENTS,
  LIST_EVENTS
} from '@/lib/graphql/events';
import { 
  CompleteEventFormData
} from '../lib/validations';
import { transformRecurringDatesToAPI } from '../lib/recurring-patterns';

interface EventDate {
  date: string;
  startTime?: string;
  endTime?: string;
}

interface UpdateEventInput {
  id: string;
  title?: string;
  description?: string;
  virtual?: boolean;
  virtualEventLink?: string;
  venueId?: string;
  venueName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  eventDates?: EventDate[];
  image?: string;
  lineup?: {
    performers: Array<{
      name: string;
      role: string;
      type: 'ARTIST' | 'SPEAKER' | 'GUEST';
      description?: string;
      orderIndex: number;
    }>;
  };
  agenda?: {
    items: Array<{
      title: string;
      startTime: string;
      duration: number;
      description?: string;
      orderIndex: number;
    }>;
  };
  // Add other fields as needed
  [key: string]: unknown;
}

export interface UseEventActionsReturn {
  // Mutations
  createEvent: (data: Partial<CompleteEventFormData>) => Promise<unknown>;
  updateEvent: (id: string, data: Partial<CompleteEventFormData>) => Promise<unknown>;
  updateEventStatus: (id: string, status: string) => Promise<unknown>;
  deleteEvent: (id: string) => Promise<void>;
  submitDraft: (id: string) => Promise<unknown>;
  cloneEvent: (id: string) => Promise<unknown>;
  bulkUpdateEvents: (ids: string[], action: string) => Promise<unknown>;

  // Loading states
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  submitLoading: boolean;
  cloneLoading: boolean;
  bulkLoading: boolean;
}

export function useEventActions(): UseEventActionsReturn {
  const client = useApolloClient();
  
  // Create Event Mutation
  const [createEventMutation, { loading: createLoading }] = useMutation(CREATE_EVENT, {
    onCompleted: () => {
      toast.success('Event created successfully');
      // Update cache
      client.refetchQueries({
        include: [LIST_EVENTS]
      });
    },
    onError: (error) => {
      console.error('Create event error:', error);
      toast.error(error.message || 'Failed to create event');
    }
  });
  
  // Update Event Mutation
  const [updateEventMutation, { loading: updateLoading }] = useMutation(UPDATE_EVENT, {
    onCompleted: () => {
      toast.success('Event updated successfully');
    },
    onError: (error) => {
      console.error('Update event error:', error);
      toast.error(error.message || 'Failed to update event');
    }
  });
  
  // Delete Event Mutation
  const [deleteEventMutation, { loading: deleteLoading }] = useMutation(DELETE_EVENT, {
    onCompleted: () => {
      toast.success('Event deleted successfully');
      // Update cache
      client.refetchQueries({
        include: [LIST_EVENTS]
      });
    },
    onError: (error) => {
      console.error('Delete event error:', error);
      toast.error(error.message || 'Failed to delete event');
    }
  });
  
  // Submit Draft Mutation
  const [submitDraftMutation, { loading: submitLoading }] = useMutation(SUBMIT_DRAFT, {
    onCompleted: () => {
      toast.success('Event submitted for review');
      // Update cache
      client.refetchQueries({
        include: [LIST_EVENTS]
      });
    },
    onError: (error) => {
      console.error('Submit draft error:', error);
      toast.error(error.message || 'Failed to submit event');
    }
  });
  
  // Clone Event Mutation
  const [cloneEventMutation, { loading: cloneLoading }] = useMutation(CLONE_EVENT, {
    onCompleted: () => {
      toast.success('Event cloned successfully');
      // Update cache
      client.refetchQueries({
        include: [LIST_EVENTS]
      });
    },
    onError: (error) => {
      console.error('Clone event error:', error);
      toast.error(error.message || 'Failed to clone event');
    }
  });
  
  // Bulk Update Mutation
  const [bulkUpdateEventsMutation, { loading: bulkLoading }] = useMutation(BULK_UPDATE_EVENTS, {
    onCompleted: (data) => {
      const { updatedCount } = data.bulkUpdateEvents;
      toast.success(`${updatedCount} events updated successfully`);
      // Update cache
      client.refetchQueries({
        include: [LIST_EVENTS]
      });
    },
    onError: (error) => {
      console.error('Bulk update error:', error);
      toast.error(error.message || 'Failed to update events');
    }
  });
  
  // Action handlers
  const createEvent = async (data: Partial<CompleteEventFormData>) => {
    try {
      const result = await createEventMutation({
        variables: {
          createEventInput: {
            ...data,
            // Map form data to GraphQL input structure
            tags: data.mainGenreId || data.subgenreId || data.supportingTagIds || data.audienceTagIds ? {
              mainGenre: data.mainGenreId ? [data.mainGenreId] : [],
              subgenre: data.subgenreId ? [data.subgenreId] : [],
              supporting: data.supportingTagIds || [],
              audience: data.audienceTagIds || []
            } : undefined
          }
        }
      });
      
      return result.data.createEvent;
    } catch (error) {
      throw error;
    }
  };
  
  const updateEvent = async (id: string, data: Partial<CompleteEventFormData>) => {
    try {
      // Transform form data to match backend UpdateEventInput schema
      const transformedData: UpdateEventInput = {
        id,
        // Basic fields that match 1:1
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.virtual !== undefined && { virtual: data.virtual }),
        ...(data.virtualEventLink && { virtualEventLink: data.virtualEventLink }),
        ...(data.venueId && { venueId: data.venueId }),
        ...(data.venueName && { venueName: data.venueName }),
        ...(data.address && { address: data.address }),
        ...(data.city && { city: data.city }),
        ...(data.state && { state: data.state }),
        ...(data.zipcode && { zipcode: data.zipcode }),
        
        // Transform event dates based on type
        ...(data.eventType === 'SINGLE' && data.date && (() => {

          const eventDateObj: EventDate = {
            date: data.date
          };

          // Send startTime as string (HH:MM format)
          if (data.startTime && typeof data.startTime === 'string' && data.startTime.trim() !== '') {
            eventDateObj.startTime = data.startTime.trim();
          }

          // Send endTime as string (HH:MM format)
          if (data.endTime && typeof data.endTime === 'string' && data.endTime.trim() !== '') {
            eventDateObj.endTime = data.endTime.trim();
          }

          return { eventDates: [eventDateObj] };
        })()),
        
        // Transform recurring event data using intelligent API transformation
        ...(data.eventType === 'RECURRING' && data.recurringDates && data.recurringDates.length > 0 && (() => {
          
          // Convert form data to RecurringDate format for transformation
          const recurringDatesWithIds = data.recurringDates.map((rd, index) => ({
            id: `temp-${index}`,
            date: rd.date,
            repeats: rd.repeats,
            timeSlots: rd.timeSlots
          }));
          
          const transformation = transformRecurringDatesToAPI(recurringDatesWithIds);
          
          if (transformation.useEventDates) {
            // Use individual event dates (for inconsistent times, once patterns, etc.)
            return { eventDates: transformation.eventDates };
          } else if (transformation.useRecurringPattern) {
            // Use simple recurring pattern (for consistent patterns)
            return {
              recurringPattern: transformation.pattern,
              recurringStart: transformation.startDate,
              recurringEnd: transformation.endDate,
              times: transformation.times
            };
          } else if (transformation.useRRule) {
            // Use RRULE for complex patterns
            return {
              rrulePattern: transformation.rrule,
              times: transformation.times
            };
          }
          
          // Fallback to eventDates if transformation doesn't specify format
          return { eventDates: transformation.eventDates || [] };
        })()),
        
        // Fallback to legacy recurring pattern fields if no recurringDates
        ...(data.eventType === 'RECURRING' && (!data.recurringDates || data.recurringDates.length === 0) && {
          ...(data.recurringStart && { recurringStart: data.recurringStart }),
          ...(data.recurringEnd && { recurringEnd: data.recurringEnd }),
          ...(data.recurringPattern && { recurringPattern: data.recurringPattern }),
          ...(data.rrule && { rrulePattern: data.rrule })
        }),
        
        // Map Step 3 fields (Media & Social)
        // Only include image field if it's a new S3 key, not an existing URL
        ...(data.image && 
           data.image !== 'placeholder' && 
           !data.image.startsWith('http') && 
           !data.image.includes('amazonaws.com') && 
           !data.image.includes('cloudfront.net') && 
           { image: data.image }),
        ...(data.video && { video: data.video }),
        ...(data.videoType && { videoType: data.videoType }),
        ...(data.free !== undefined && { free: data.free }),
        ...(data.pricing && { pricing: data.pricing }),
        ...(data.ticketUrl && { ticketUrl: data.ticketUrl }),
        ...(data.website && { website: data.website }),
        ...(data.facebook && { facebook: data.facebook }),
        ...(data.twitter && { twitter: data.twitter }),
        ...(data.instagram && { instagram: data.instagram }),
        ...(data.youtube && { youtube: data.youtube }),
        ...(data.tiktok && { tiktok: data.tiktok }),
        
        // Map lineup and agenda data
        ...(data.lineup && { lineup: data.lineup }),
        ...(data.agenda && { agenda: data.agenda }),
        
        // Map Additional Information fields
        ...(data.ageInfo && { ageInfo: data.ageInfo }),
        ...(data.doorTime && { doorTime: data.doorTime }),
        ...(data.parkingInfo && { parkingInfo: data.parkingInfo }),
        ...(data.accessibilityInfo && { accessibilityInfo: data.accessibilityInfo }),
        
        // Map FAQs field - Backend expects JSONObject format
        ...(data.faqs && data.faqs.length > 0 ? {
          faqs: { questions: data.faqs }
        } : {
          faqs: null
        }),

        // Map Admin fields (status and adminNotes)
        ...(data.status && { status: data.status }),
        ...(data.adminNotes && { adminNotes: data.adminNotes }),

        // Map tags structure
        tags: data.mainGenreId || data.subgenreId || data.supportingTagIds || data.audienceTagIds ? {
          mainGenre: data.mainGenreId ? [data.mainGenreId] : [],
          subgenre: data.subgenreId ? [data.subgenreId] : [],
          supporting: data.supportingTagIds || [],
          audience: data.audienceTagIds || []
        } : undefined
      };

      // 🔍 DEBUG: Log GraphQL mutation payload
      console.log('='.repeat(80));
      console.log('🚀 UPDATE EVENT MUTATION - GraphQL Variables');
      console.log('='.repeat(80));
      console.log('updateEventInput:');
      console.log(JSON.stringify(transformedData, null, 2));
      console.log('='.repeat(80));

      const result = await updateEventMutation({
        variables: {
          updateEventInput: transformedData
        }
      });
      
      if (!result.data || !result.data.updateEvent) {
        console.error('Update event mutation returned unexpected data:', result);
        throw new Error('Failed to update event: Invalid response from server');
      }
      
      return result.data.updateEvent;
    } catch (error) {
      throw error;
    }
  };

  const updateEventStatus = async (id: string, status: string) => {
    try {
      const result = await updateEventMutation({
        variables: {
          updateEventInput: {
            id,
            status
          }
        }
      });

      if (result.data?.updateEvent) {
        const statusLabel = status === 'APPROVED' ? 'approved' : 'set to pending';
        toast.success(`Event status ${statusLabel} successfully`);
        return result.data.updateEvent;
      }

      toast.error('Failed to update event status');
      return null;
    } catch (error) {
      console.error('Update event status error:', error);
      toast.error('Failed to update event status');
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteEventMutation({
        variables: { id }
      });
    } catch (error) {
      throw error;
    }
  };
  
  const submitDraft = async (id: string) => {
    try {
      const result = await submitDraftMutation({
        variables: { eventId: id }
      });
      
      return result.data.submitDraft;
    } catch (error) {
      throw error;
    }
  };
  
  const cloneEvent = async (id: string) => {
    try {
      const result = await cloneEventMutation({
        variables: { eventId: id }
      });
      
      return result.data.cloneEvent;
    } catch (error) {
      throw error;
    }
  };
  
  const bulkUpdateEvents = async (ids: string[], action: string) => {
    try {
      const result = await bulkUpdateEventsMutation({
        variables: {
          eventIds: ids,
          action
        }
      });
      
      return result.data.bulkUpdateEvents;
    } catch (error) {
      throw error;
    }
  };
  
  return {
    createEvent,
    updateEvent,
    updateEventStatus,
    deleteEvent,
    submitDraft,
    cloneEvent,
    bulkUpdateEvents,
    createLoading,
    updateLoading,
    deleteLoading,
    submitLoading,
    cloneLoading,
    bulkLoading
  };
}