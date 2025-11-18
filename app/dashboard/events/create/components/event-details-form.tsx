'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { EventAutoSaveIndicator } from '../../components/event-auto-save-indicator';
import { useAutoSave } from '@/store/event-draft-store';
import { useRecurringDatesStore } from '@/store/recurring-dates-store';
import { EventDetailsFormData } from '../../lib/validations';
import { AUTO_SAVE_EVENT } from '@/lib/graphql/events';
import { expandAPIPatternToRecurringDates } from '../../lib/recurring-patterns';
import { SingleEventDate } from './single-event-date';
import { RecurringEventDate } from './recurring-event-date';
import { PhysicalVenueLocation } from './physical-venue-location';
import { VirtualEventLocation } from './virtual-event-location';
import { Calendar, MapPin } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  eventType?: 'SINGLE' | 'RECURRING';
  date?: string;
  startTime?: string;
  endTime?: string;
  virtual?: boolean;
  venueId?: string;
  virtualEventLink?: string;
  venueName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  market?: string;

  // Recurring pattern fields for detection
  recurringPattern?: string;
  recurringStart?: string;
  recurringEnd?: string;
  rrule?: string;
  eventDates?: Array<{
    date: string;
    startTime?: string;
    endTime?: string;
  }>;
  times?: Array<{
    startTime: string;
    endTime: string;
  }>;

  // Media and Social fields for Step 3
  video?: string;
  videoType?: 'YOUTUBE' | 'VIMEO' | 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK' | 'DIRECT' | 'OTHER';
  free?: boolean;
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
}

interface EventDetailsFormProps {
  event: Event;
  onSubmit: () => void;
  onBack: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;
  onError?: () => void;
}

export function EventDetailsForm({
  event,
  onSubmit,
  onBack,
  loading = false,
  onLoadingStart,
  onError
}: EventDetailsFormProps) {
  const [eventType, setEventType] = useState<'SINGLE' | 'RECURRING'>('SINGLE');
  const [locationType, setLocationType] = useState<'PHYSICAL' | 'VIRTUAL'>('PHYSICAL');
  
  const [autoSaveEventMutation] = useMutation(AUTO_SAVE_EVENT);
  
  const {
    formData,
    updateFormData
  } = useAutoSave();
  
  const { clear, addRecurringDate, recurringDates: recurringDatesFromStore } = useRecurringDatesStore();

  // Get initial values from store or defaults - field-by-field checking
  const getInitialValues = useCallback((): EventDetailsFormData => {
    // Intelligently determine event type based on available data
    const determineEventType = (): 'SINGLE' | 'RECURRING' => {

      // Priority 1: Explicit form data eventType
      if (formData.eventType) {
        return formData.eventType;
      }

      // Priority 2: Backend event eventType if provided
      if (event.eventType) {
        return event.eventType as 'SINGLE' | 'RECURRING';
      }

      // Priority 3: Detect based on recurringDates presence
      if (formData.recurringDates && formData.recurringDates.length > 0) {
        return 'RECURRING';
      }

      // Priority 4: Check if backend has recurring pattern data
      if (event.eventDates || event.recurringPattern || event.rrule ||
          (event.recurringStart && event.recurringEnd)) {
        return 'RECURRING';
      }

      // Default to SINGLE
      return 'SINGLE';
    };

    const eventType = determineEventType();

    // Populate recurringDates from backend if it's a recurring event and no form data exists
    const getRecurringDates = () => {
      // If we already have form data, use it
      if (formData.recurringDates && formData.recurringDates.length > 0) {
        return formData.recurringDates;
      }

      // If it's a recurring event, try to expand from backend data
      if (eventType === 'RECURRING') {
        const backendRecurringDates = expandAPIPatternToRecurringDates({
          eventDates: event.eventDates,
          recurringPattern: event.recurringPattern,
          recurringStart: event.recurringStart,
          recurringEnd: event.recurringEnd,
          rrulePattern: event.rrule,
          times: event.times
        });

        // Return the data - store update will happen in useEffect to avoid render issues
        return backendRecurringDates;
      }

      return [];
    };

    // CRITICAL: Determine if we're in VENUE mode or MANUAL mode
    // This prevents loading manual data when venue is selected (and vice versa)
    const currentVenueId = formData.venueId || event.venueId || '';
    const isVenueMode = !!currentVenueId;

    // VENUE MODE: Only load venueId + zipcode + market, IGNORE manual fields from BD
    if (isVenueMode) {
      return {
        eventType: eventType,
        date: eventType === 'RECURRING' ? '' : (formData.date || event.date || ''),
        startTime: eventType === 'RECURRING' ? '' : (formData.startTime || event.startTime || ''),
        endTime: eventType === 'RECURRING' ? '' : (formData.endTime || event.endTime || ''),
        recurringPattern: formData.recurringPattern || '',
        recurringStart: formData.recurringStart || '',
        recurringEnd: formData.recurringEnd || '',
        rrule: formData.rrule || '',
        recurringDates: getRecurringDates(),
        virtual: formData.virtual ?? event.virtual ?? false,
        virtualEventLink: formData.virtualEventLink || event.virtualEventLink || '',
        // VENUE fields
        venueId: currentVenueId,
        zipcode: formData.zipcode || event.zipcode || '',
        market: formData.market || event.market || '',
        // FORCE manual fields to EMPTY (ignore BD values)
        venueName: '',
        address: '',
        city: '',
        state: ''
      };
    }

    // MANUAL MODE: Load manual fields, IGNORE venueId
    return {
      eventType: eventType,
      date: eventType === 'RECURRING' ? '' : (formData.date || event.date || ''),
      startTime: eventType === 'RECURRING' ? '' : (formData.startTime || event.startTime || ''),
      endTime: eventType === 'RECURRING' ? '' : (formData.endTime || event.endTime || ''),
      recurringPattern: formData.recurringPattern || '',
      recurringStart: formData.recurringStart || '',
      recurringEnd: formData.recurringEnd || '',
      rrule: formData.rrule || '',
      recurringDates: getRecurringDates(),
      virtual: formData.virtual ?? event.virtual ?? false,
      virtualEventLink: formData.virtualEventLink || event.virtualEventLink || '',
      // FORCE venueId to EMPTY
      venueId: '',
      // MANUAL fields
      venueName: formData.venueName || event.venueName || '',
      address: formData.address || event.address || '',
      city: formData.city || event.city || '',
      state: formData.state || event.state || '',
      zipcode: formData.zipcode || event.zipcode || '',
      market: formData.market || event.market || ''
    };
  }, [formData, event]);

  const form = useForm<EventDetailsFormData>({
    defaultValues: getInitialValues(),
    mode: 'onChange'
  });

  const watchedValues = form.watch();


  // Update local state and schema when form values change
  useEffect(() => {
    setEventType(watchedValues.eventType);
    setLocationType(watchedValues.virtual ? 'VIRTUAL' : 'PHYSICAL');
    
    // Clear existing errors when switching types
    form.clearErrors();
  }, [watchedValues.eventType, watchedValues.virtual, form]);

  // Re-initialize form when event prop changes
  useEffect(() => {
    if (event && event.id && Object.keys(event).length > 0) {
      const newValues = getInitialValues();
      form.reset(newValues);
    }
  }, [event, event?.id, getInitialValues, form]); // Re-run when event or getInitialValues changes

  // Update store with backend recurring dates when needed (separate from render)
  useEffect(() => {
    
    // Only update if we have event data and the recurring dates store is empty
    if (event && event.id && recurringDatesFromStore.length === 0) {
      // Check if this should be a recurring event
      const shouldBeRecurring = event.eventDates || event.recurringPattern || event.rrule || 
        (event.recurringStart && event.recurringEnd);
      
      
      
      if (shouldBeRecurring) {
        const apiData = {
          eventDates: event.eventDates,
          recurringPattern: event.recurringPattern,
          recurringStart: event.recurringStart,
          recurringEnd: event.recurringEnd,
          rrulePattern: event.rrule,
          times: event.times
        };
        
        
        const backendRecurringDates = expandAPIPatternToRecurringDates(apiData);
        
        
        if (backendRecurringDates.length > 0) {
          // Update both stores with recovered recurring dates
          updateFormData({ 
            recurringDates: backendRecurringDates,
            eventType: 'RECURRING' 
          });
          // Also update the recurring dates store for the calendar component
          clear(); // Clear existing dates first
          backendRecurringDates.forEach(date => {
            addRecurringDate(date);
          });
        } else {
        }
      }
    }
  }, [event, event?.id, recurringDatesFromStore, updateFormData, clear, addRecurringDate]);

  // Initial synchronization: populate recurring-dates-store from formData if it exists
  useEffect(() => {

    // If we have recurringDates in formData but store is empty, sync them
    if (formData.recurringDates && formData.recurringDates.length > 0 && recurringDatesFromStore.length === 0) {
      
      clear(); // Clear store first
      formData.recurringDates.forEach((recurringDateData, index) => {
        const recurringDate = {
          id: `synced-${index}`,
          date: recurringDateData.date || '',
          repeats: recurringDateData.repeats || 'once' as const,
          timeSlots: recurringDateData.timeSlots || [{
            id: `slot-${index}`,
            startTime: '09:00',
            endTime: '10:00',
            duration: '1h'
          }]
        };
        addRecurringDate(recurringDate);
      });
    }
  }, [formData.recurringDates, recurringDatesFromStore.length, clear, addRecurringDate]);

  // Simplified auto-save for step 2 to prevent conflicts with step 1
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const subscription = form.watch((value, { name }) => {
      if (name && Object.keys(value).length > 0) {
        // Update store immediately for persistence
        updateFormData(value as Partial<EventDetailsFormData>);
        
        // Clear previous timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        // Simple debounced autosave without complex store interactions
        timeoutId = setTimeout(async () => {
          try {
            const autoSaveData: Record<string, unknown> = {};

            // Date and time fields (Step 2)
            if (value.eventType) autoSaveData.eventType = value.eventType;
            if (value.date) autoSaveData.date = value.date;
            if (value.startTime) autoSaveData.startTime = value.startTime;
            if (value.endTime) autoSaveData.endTime = value.endTime;

            // Recurring dates - include from store if this is a recurring event
            if (value.eventType === 'RECURRING' && recurringDatesFromStore.length > 0) {
              autoSaveData.recurringDates = recurringDatesFromStore;
            }

            // Location fields - CRITICAL: Clean based on mode
            if (value.virtual !== undefined) autoSaveData.virtual = value.virtual;
            if (value.virtualEventLink) autoSaveData.virtualEventLink = value.virtualEventLink;

            // VENUE SELECTION vs MANUAL ENTRY logic
            const currentVenueId = value.venueId;
            const isVenueMode = currentVenueId && currentVenueId !== '';

            console.log('[AUTO-SAVE] Mode detection:', {
              venueId: currentVenueId,
              isVenueMode,
              venueName: value.venueName,
              address: value.address
            });

            if (isVenueMode) {
              // VENUE SELECTION MODE: Only save venueId + zipcode + market
              console.log('[AUTO-SAVE] Using VENUE mode - clearing manual fields');
              autoSaveData.venueId = value.venueId;
              if (value.zipcode) autoSaveData.zipcode = value.zipcode;
              if (value.market) autoSaveData.market = value.market;
              // Explicitly clear manual fields
              autoSaveData.venueName = '';
              autoSaveData.address = '';
              autoSaveData.city = '';
              autoSaveData.state = '';
            } else {
              // MANUAL ENTRY MODE: Save manual fields
              console.log('[AUTO-SAVE] Using MANUAL mode - clearing venueId');
              // DO NOT send venueId at all if it's empty (send null or omit)
              autoSaveData.venueId = null; // Use null instead of empty string
              if (value.venueName) autoSaveData.venueName = value.venueName;
              if (value.address) autoSaveData.address = value.address;
              if (value.city) autoSaveData.city = value.city;
              if (value.state) autoSaveData.state = value.state;
              if (value.zipcode) autoSaveData.zipcode = value.zipcode;
              if (value.market) autoSaveData.market = value.market;

              // Also clear these to ensure no venue data persists
              autoSaveData.venueName = value.venueName || '';
              autoSaveData.address = value.address || '';
              autoSaveData.city = value.city || '';
              autoSaveData.state = value.state || '';
              autoSaveData.zipcode = value.zipcode || '';
              autoSaveData.market = value.market || '';
            }

            // Only auto-save if there are meaningful changes
            if (Object.keys(autoSaveData).length > 0) {
              await autoSaveEventMutation({
                variables: {
                  eventId: event.id,
                  data: autoSaveData
                }
              });
            }
          } catch (error) {
            console.error('Step 2 auto-save failed:', error);
          }
        }, 2500); // Increased debounce to prevent conflicts during mode switching
      }
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [form, updateFormData, autoSaveEventMutation, event.id, recurringDatesFromStore]);

  // Simplified recurring dates autosave to prevent infinite loops
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Only trigger if we have an event ID and recurring dates
    if (event.id && recurringDatesFromStore.length >= 0) {
      
      // Simple debounced autosave for recurring date changes
      timeoutId = setTimeout(async () => {
        try {
          // Transform recurring dates to API format for autosave
          const { transformRecurringDatesToAPI } = await import('../../lib/recurring-patterns');
          const transformation = transformRecurringDatesToAPI(recurringDatesFromStore);
          
          let autoSaveData: Record<string, unknown> = {
            eventType: 'RECURRING'
          };

          if (transformation.useEventDates) {
            autoSaveData = { ...autoSaveData, eventDates: transformation.eventDates };
          } else if (transformation.useRecurringPattern) {
            autoSaveData = {
              ...autoSaveData,
              recurringPattern: transformation.pattern,
              recurringStart: transformation.startDate,
              recurringEnd: transformation.endDate,
              times: transformation.times
            };
          } else if (transformation.useRRule) {
            autoSaveData = {
              ...autoSaveData,
              rrulePattern: transformation.rrule,
              times: transformation.times
            };
          } else {
            // Fallback to raw recurringDates if no transformation
            autoSaveData = { ...autoSaveData, recurringDates: recurringDatesFromStore };
          }
          
          await autoSaveEventMutation({
            variables: {
              eventId: event.id,
              data: autoSaveData
            }
          });
        } catch (error) {
          console.error('EventDetailsForm: Recurring dates autosave failed:', error);
        }
      }, 800); // Slightly faster for date changes
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [recurringDatesFromStore, event.id, autoSaveEventMutation]);

  const handleSubmit = async (data: EventDetailsFormData) => {
    try {
      if (onLoadingStart) onLoadingStart();


      // If this is a recurring event, make sure we include the recurring dates from store
      if (data.eventType === 'RECURRING' && recurringDatesFromStore.length > 0) {
        data.recurringDates = recurringDatesFromStore;
      }

      // Basic validation: only check critical fields
      if (data.eventType === 'SINGLE' && !data.date) {
        form.setError('date', { message: 'Date is required for single events' });
        if (onError) onError();
        return;
      }

      if (data.eventType === 'RECURRING' && (!data.recurringDates || data.recurringDates.length === 0)) {
        console.warn('No recurring dates found, but continuing...');
      }

      // CRITICAL: Clean data based on venue selection vs manual entry
      // This ensures we only send relevant data to backend
      if (data.venueId) {
        // VENUE SELECTION MODE: Only send venueId + zipcode + market
        // Clear all manual entry fields to prevent confusion
        data.venueName = '';
        data.address = '';
        data.city = '';
        data.state = '';
        // Keep: venueId, zipcode, market
      } else {
        // MANUAL ENTRY MODE: Send manual fields, ensure venueId is cleared
        data.venueId = undefined as unknown as string; // Use undefined to omit from request
        // Keep: venueName, address, city, state, zipcode, market
      }

      // Update store with cleaned data - autosave has already handled backend updates
      updateFormData(data);


      // Proceed to Step 3 - autosave has already saved everything
      onSubmit();
    } catch (error) {
      console.error('Step 2: Error in handleSubmit:', error);
      if (onError) onError();
    }
  };

  const handleEventTypeChange = (newType: 'SINGLE' | 'RECURRING') => {
    setEventType(newType);
    form.setValue('eventType', newType);
    
    // Clear opposite type fields
    if (newType === 'SINGLE') {
      form.setValue('recurringPattern', '');
      form.setValue('recurringStart', '');
      form.setValue('recurringEnd', '');
      form.setValue('rrule', '');
    } else {
      form.setValue('date', '');
    }
  };

  const handleLocationTypeChange = (newType: 'PHYSICAL' | 'VIRTUAL') => {
    setLocationType(newType);
    form.setValue('virtual', newType === 'VIRTUAL');
    
    // Clear opposite type fields
    if (newType === 'VIRTUAL') {
      form.setValue('venueId', '');
      form.setValue('venueName', '');
      form.setValue('address', '');
      form.setValue('city', '');
      form.setValue('state', '');
      form.setValue('zipcode', '');
    } else {
      form.setValue('virtualEventLink', '');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Date & Location</h1>
        <p className="text-gray-600">Set up your event dates, times, and location details</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="space-y-8">
            {/* Date and Time Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Date and time</h3>
              </div>
              
              {/* Event Type Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer transition-all border-2 ${
                    eventType === 'SINGLE' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleEventTypeChange('SINGLE')}
                >
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                    <h4 className="font-semibold mb-2">Single Event</h4>
                    <p className="text-sm text-muted-foreground">
                      Set a single date and time for your event
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all border-2 ${
                    eventType === 'RECURRING' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleEventTypeChange('RECURRING')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="h-8 w-8 mx-auto mb-3 rounded-full border-2 border-gray-400 flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                    <h4 className="font-semibold mb-2">Recurring Events</h4>
                    <p className="text-sm text-muted-foreground">
                      For events that repeat on a schedule or run across multiple days
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Date/Time Fields */}
              {eventType === 'SINGLE' ? (
                <SingleEventDate form={form} />
              ) : (
                <RecurringEventDate form={form} eventId={event.id} />
              )}
            </div>

            {/* Location Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Location</h3>
              </div>
              
              {/* Location Type Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer transition-all border-2 ${
                    locationType === 'PHYSICAL' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleLocationTypeChange('PHYSICAL')}
                >
                  <CardContent className="p-6 text-center">
                    <h4 className="font-semibold text-blue-500">Physical Venue</h4>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all border-2 ${
                    locationType === 'VIRTUAL' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleLocationTypeChange('VIRTUAL')}
                >
                  <CardContent className="p-6 text-center">
                    <h4 className="font-semibold text-gray-700">Virtual Event</h4>
                  </CardContent>
                </Card>
              </div>

              {/* Location Fields */}
              {locationType === 'PHYSICAL' ? (
                <PhysicalVenueLocation form={form} />
              ) : (
                <VirtualEventLocation form={form} />
              )}
            </div>

            {/* Auto-save status */}
            <div className="flex justify-center py-4">
              <EventAutoSaveIndicator />
            </div>
            
            {/* Form Actions */}
            <div className="flex space-x-4 justify-end pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={loading}
              >
                Back to Step 1
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  'Continue to Step 3'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}