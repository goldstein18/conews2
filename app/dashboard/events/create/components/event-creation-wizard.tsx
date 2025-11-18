'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { EventBasicForm } from '../../components/event-basic-form';
import { EventDetailsForm } from './event-details-form';
import { EventMediaForm } from './event-media-form';
import { EventSidebarNavigation } from '../../components/event-sidebar-navigation';
import { EventMobileNavigation } from '../../components/event-mobile-navigation';
import { useAutoSave } from '@/store/event-draft-store';
import { useEventActions } from '../../hooks/use-event-actions';
import { GET_EVENT } from '@/lib/graphql/events';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Venue {
  id?: string;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
}

interface Event {
  id: string;
  title: string;
  status: string;
  isDraft: boolean;
  summary?: string;
  companyId?: string;
  market?: string;
  mainGenreId?: string;
  subgenreId?: string;
  supportingTagIds?: string[];
  audienceTagIds?: string[];
  // Image fields
  image?: string;
  mainImageUrl?: string;
  bigImageUrl?: string;
  featuredImageUrl?: string;
  // Date fields
  eventType?: 'SINGLE' | 'RECURRING';
  date?: string;
  startTime?: string;
  endTime?: string;
  recurringPattern?: string;
  recurringStart?: string;
  recurringEnd?: string;
  rrule?: string;
  eventDates?: Array<{
    id?: string;
    date: string;
    startTime?: string;
    endTime?: string;
  }>;
  // Location fields  
  virtual?: boolean;
  virtualEventLink?: string;
  venueId?: string;
  venueName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  venue?: Venue;
  // Media and Social fields
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

interface EventCreationWizardProps {
  eventId?: string;
  isDraft?: boolean;
  mode?: 'draft' | 'edit';
}

export function EventCreationWizard({ eventId, isDraft = false, mode = 'edit' }: EventCreationWizardProps = {}) {

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createdEvent, setCreatedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const { clearDraft, hasChanges, isInitializing, formData: autoSaveFormData } = useAutoSave();
  const { updateEvent, updateEventStatus } = useEventActions();

  // Query existing event if eventId is provided
  const { data: eventData, loading: eventLoading, error: eventError } = useQuery(GET_EVENT, {
    variables: { id: eventId },
    skip: !eventId,
    fetchPolicy: 'no-cache', // Force fresh data from server
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      console.log('🔍 GET_EVENT completed - Raw data from backend:', {
        event: data?.event,
        companyId: data?.event?.companyId,
        market: data?.event?.market,
        title: data?.event?.title
      });
    },
    onError: (error) => {
      console.error('❌ GET_EVENT error:', error);
    }
  });

  // Helper function to transform eventTags to form format
  const transformEventDataForForm = (event: Record<string, unknown>) => {
    // Debug: Log the event data to see what's coming from backend
    console.log('🔍 Event data from backend:', {
      id: event.id,
      title: event.title,
      companyId: event.companyId,
      market: event.market,
      summary: event.summary,
      description: event.description
    });
    
    // Handle eventTags if they exist
    let mainGenreId = '';
    let subgenreId = '';
    let supportingTagIds: string[] = [];
    let audienceTagIds: string[] = [];

    if (event.eventTags && Array.isArray(event.eventTags)) {
      
      interface EventTag {
        assignmentType: string;
        tag: { id: string };
      }
      
      const eventTags = event.eventTags as EventTag[];
      
      const mainGenreTag = eventTags.find(et => et.assignmentType === 'MAIN_GENRE');
      const subgenreTag = eventTags.find(et => et.assignmentType === 'SUBGENRE');
      const supportingTags = eventTags.filter(et => et.assignmentType === 'SUPPORTING') || [];
      const audienceTags = eventTags.filter(et => et.assignmentType === 'AUDIENCE') || [];

      mainGenreId = mainGenreTag?.tag?.id || '';
      subgenreId = subgenreTag?.tag?.id || '';
      supportingTagIds = supportingTags.map(et => et.tag.id);
      audienceTagIds = audienceTags.map(et => et.tag.id);
    } else {
      // If eventTags don't exist, try to use direct fields (might be from auto-save)
      mainGenreId = (event.mainGenreId as string) || '';
      subgenreId = (event.subgenreId as string) || '';
      supportingTagIds = (event.supportingTagIds as string[]) || [];
      audienceTagIds = (event.audienceTagIds as string[]) || [];
    }

    // Extract date information from eventDates array
    let eventType: 'SINGLE' | 'RECURRING' = 'SINGLE';
    let date = '';
    let startTime = '';
    let endTime = '';
    let recurringPattern = '';
    const recurringStart = '';
    const recurringEnd = '';
    let rrule = '';


    if (event.eventDates && Array.isArray(event.eventDates) && event.eventDates.length > 0) {
      // Determine event type based on number of dates
      eventType = event.eventDates.length > 1 ? 'RECURRING' : 'SINGLE';
      
      interface EventDate {
        date: string;
        startTime?: string | null;
        endTime?: string | null;
      }
      
      // For single events, process the first (and only) date
      if (eventType === 'SINGLE') {
        const eventDate = event.eventDates[0] as EventDate;
      
      // Handle timestamp conversion to date format
      if (eventDate.date) {
        // If it's a timestamp (numeric string), convert it
        if (/^\d+$/.test(eventDate.date)) {
          const timestamp = parseInt(eventDate.date);
          const dateObj = new Date(timestamp);
          date = dateObj.toISOString().split('T')[0]; // Convert to yyyy-MM-dd
        } else {
          date = eventDate.date;
        }
      }
      
      // Process startTime - can come as timestamp or string
      if (eventDate.startTime) {
        if (/^\d+$/.test(eventDate.startTime)) {
          // It's a timestamp
          const timestamp = parseInt(eventDate.startTime);
          const dateObj = new Date(timestamp);
          startTime = dateObj.toTimeString().slice(0, 5); // "HH:mm"
        } else {
          startTime = eventDate.startTime;
        }
      } else {
        startTime = '';
      }
      
      // Process endTime - can come as timestamp or string
      if (eventDate.endTime) {
        if (/^\d+$/.test(eventDate.endTime)) {
          // It's a timestamp
          const timestamp = parseInt(eventDate.endTime);
          const dateObj = new Date(timestamp);
          endTime = dateObj.toTimeString().slice(0, 5); // "HH:mm"
        } else {
          endTime = eventDate.endTime;
        }
        } else {
          endTime = '';
        }
      } else {
        // Multiple eventDates - this is a recurring event
        // For now, don't extract individual date/time fields since they'll be handled 
        // by the recurring dates system in the EventDetailsForm
      }
    } else if (event.eventOccurrences && Array.isArray(event.eventOccurrences) && event.eventOccurrences.length > 0) {
      // Recurring event - extract from eventOccurrences
      interface EventOccurrence {
        rrule?: string;
        startTime?: string;
        endTime?: string;
      }
      
      const occurrence = event.eventOccurrences[0] as EventOccurrence;
      eventType = 'RECURRING';
      rrule = occurrence.rrule || '';
      
      // Process recurring startTime - can come as timestamp or string
      if (occurrence.startTime) {
        if (/^\d+$/.test(occurrence.startTime)) {
          // It's a timestamp
          const timestamp = parseInt(occurrence.startTime);
          const dateObj = new Date(timestamp);
          startTime = dateObj.toTimeString().slice(0, 5); // "HH:mm"
        } else {
          startTime = occurrence.startTime;
        }
      } else {
        startTime = '';
      }
      
      // Process recurring endTime - can come as timestamp or string  
      if (occurrence.endTime) {
        if (/^\d+$/.test(occurrence.endTime)) {
          // It's a timestamp
          const timestamp = parseInt(occurrence.endTime);
          const dateObj = new Date(timestamp);
          endTime = dateObj.toTimeString().slice(0, 5); // "HH:mm"
        } else {
          endTime = occurrence.endTime;
        }
      } else {
        endTime = '';
      }
      
      // Extract pattern from rrule if available
      if (rrule) {
        if (rrule.includes('FREQ=DAILY')) recurringPattern = 'daily';
        else if (rrule.includes('FREQ=WEEKLY')) recurringPattern = 'weekly';
        else if (rrule.includes('FREQ=MONTHLY')) recurringPattern = 'monthly';
        else if (rrule.includes('FREQ=YEARLY')) recurringPattern = 'yearly';
      }
    }

    const transformedEvent = {
      ...event,
      id: event.id as string,
      title: event.title as string,
      companyId: event.companyId as string,
      market: event.market as string,
      summary: (event.summary as string) || (event.description as string) || '',
      mainGenreId,
      subgenreId,
      supportingTagIds,
      audienceTagIds,
      // Date fields for form
      eventType,
      date,
      startTime,
      endTime,
      recurringPattern,
      recurringStart,
      recurringEnd,
      rrule,
      // Venue fields - extract from venue object or direct fields
      venueId: (event.venueId as string) || '',
      venueName: (event.venueName as string) || 
                 (event.venue ? (event.venue as Venue).name || '' : '') || '',
      address: (event.address as string) || 
               (event.venue ? (event.venue as Venue).address || '' : '') || '',
      city: (event.city as string) || 
            (event.venue ? (event.venue as Venue).city || '' : '') || '',
      state: (event.state as string) || 
             (event.venue ? (event.venue as Venue).state || '' : '') || '',
      zipcode: (event.zipcode as string) || 
               (event.venue ? (event.venue as Venue).zipcode || '' : '') || '',
      virtual: (event.virtual as boolean) ?? false,
      virtualEventLink: (event.virtualEventLink as string) || '',
      
      // Preserve status and isDraft from backend
      status: (event.status as string) || 'DRAFT',
      isDraft: (event.isDraft as boolean) ?? true,
      
      // Image URL fields from backend - these are the display URLs
      mainImageUrl: (event.mainImageUrl as string) || '',
      bigImageUrl: (event.bigImageUrl as string) || '',
      featuredImageUrl: (event.featuredImageUrl as string) || '',
      
      // Media and Social fields for Step 3
      video: (event.video as string) || '',
      videoType: (event.videoType as 'YOUTUBE' | 'VIMEO' | 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK' | 'DIRECT' | 'OTHER') || undefined,
      free: (event.free as boolean) ?? false,
      website: (event.website as string) || '',
      facebook: (event.facebook as string) || '',
      twitter: (event.twitter as string) || '',
      instagram: (event.instagram as string) || '',
      youtube: (event.youtube as string) || '',
      tiktok: (event.tiktok as string) || '',
      // Preserve the S3 key for image
      image: (event.image as string) || ''
    };

    console.log('🔍 After transformation - transformedEvent:', {
      id: transformedEvent.id,
      title: transformedEvent.title,
      companyId: transformedEvent.companyId,
      market: transformedEvent.market,
      summary: transformedEvent.summary
    });


    return transformedEvent as Event;
  };

  // Initialize event data when loaded
  useEffect(() => {
    if (eventData?.event && !createdEvent) {
      console.log('🔍 useEffect - Processing eventData:', {
        eventId: eventData.event.id,
        title: eventData.event.title,
        companyId: eventData.event.companyId,
        market: eventData.event.market
      });
      
      // Check if GET_EVENT returned meaningful data - including title as valid data
      const hasRealData = eventData.event.title || 
                         eventData.event.summary || 
                         eventData.event.description || 
                         eventData.event.market || 
                         eventData.event.companyId ||
                         eventData.event.venueId ||
                         eventData.event.venueName ||
                         eventData.event.address ||
                         eventData.event.venue ||
                         (eventData.event.eventTags && eventData.event.eventTags.length > 0) ||
                         (eventData.event.eventDates && eventData.event.eventDates.length > 0) ||
                         (eventData.event.eventOccurrences && eventData.event.eventOccurrences.length > 0);
      
      console.log('🔍 hasRealData check:', {
        hasRealData,
        title: eventData.event.title,
        summary: eventData.event.summary,
        description: eventData.event.description,
        market: eventData.event.market,
        companyId: eventData.event.companyId
      });
      
      if (hasRealData) {
        const transformedEvent = transformEventDataForForm(eventData.event);
        console.log('🔍 Setting transformedEvent:', {
          id: transformedEvent.id,
          title: transformedEvent.title,
          companyId: transformedEvent.companyId,
          market: transformedEvent.market
        });
        setCreatedEvent(transformedEvent);
      } else {
        // If GET_EVENT didn't return useful data, create a minimal event object
        // The auto-save data should still be in the browser/form state
        const minimalEvent = {
          id: eventData.event.id,
          title: eventData.event.title || '',
          status: 'DRAFT',
          isDraft: true,
          summary: '',
          market: '',
          companyId: '',
          mainGenreId: '',
          subgenreId: '', 
          supportingTagIds: [],
          audienceTagIds: []
        };
        setCreatedEvent(minimalEvent);
      }
    }
  }, [eventData, createdEvent]);
  
  const totalSteps = 3;
  
  // Step completion handlers
  const handleStep1Complete = (event: Event) => {
    
    // Merge new event data with existing transformed data to preserve all fields
    setCreatedEvent(prevEvent => {
      if (prevEvent && prevEvent.id === event.id) {
        // If we already have a transformed event, merge the Step 1 updates with existing data
        const mergedEvent = {
          ...prevEvent, // Keep existing transformed data (dates, venue, etc.)
          ...event      // Update with new Step 1 data (title, summary, etc.)
        };
        return mergedEvent;
      } else {
        // First time or different event, just use the new event
        return event;
      }
    });
    
    // Always move to step 2 for all modes
    setCurrentStep(2);
  };
  
  const handleStep2Start = () => {
    setIsLoading(true);
  };
  
  const handleStep2Complete = () => {
    setCurrentStep(3);
    setIsLoading(false);
  };

  const handleStep2Error = () => {
    setIsLoading(false);
  };
  
  const handleStep3Start = () => {
    setIsLoading(true);
  };
  
  const handleStep3Complete = () => {
    clearDraft();
    router.push('/dashboard/events');
  };

  const handleStep3Error = () => {
    setIsLoading(false);
  };
  
  // Navigation handlers
  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleBackToStep2 = () => {
    setCurrentStep(2);
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelDialog(true);
    } else {
      handleConfirmCancel();
    }
  };

  const handleConfirmCancel = () => {
    clearDraft();
    router.push('/dashboard/events');
  };

  // Status change handler for sidebar selector
  const handleStatusChange = (newStatus: string) => {
    // Update form data with new status (passes string directly)
    setFormData(prev => ({ ...prev, status: newStatus }));

    // Update createdEvent to reflect change immediately in UI
    setCreatedEvent(prev => prev ? { ...prev, status: newStatus } : null);

    // Mark as having unsaved changes to enable "Update Changes" button
    setHasUnsavedChanges(true);
  };

  // Handler para el botón "Update Changes" del sidebar
  const handleUpdate = async () => {
    if (!createdEvent) return;

    try {
      setIsLoading(true);

      // Merge autoSaveFormData (from Zustand store with all form changes including tags)
      // with status changes from sidebar toggle
      const dataToUpdate = {
        ...autoSaveFormData, // This has ALL form data including tags from React Hook Form
        ...(formData.status ? { status: formData.status as string } : {}) // Merge status change if exists
      };

      let updatedEvent;

      // Check if only status changed and no other form data exists
      if (formData.status && Object.keys(formData).length === 1 && Object.keys(autoSaveFormData).length === 0) {
        updatedEvent = await updateEventStatus(createdEvent.id, formData.status as string);
      } else {
        // Update with complete form data (includes tags, dates, pricing, etc. from autoSaveFormData)
        // Cast to Partial to satisfy type checker - updateEvent accepts Partial<CompleteEventFormData>
        updatedEvent = await updateEvent(createdEvent.id, dataToUpdate as Partial<Record<string, unknown>>);
      }

      // Actualizar createdEvent con los datos guardados
      if (updatedEvent) {
        setCreatedEvent(prev => prev ? { ...prev, ...updatedEvent } : null);
      }

      // Limpiar cambios sin guardar
      setHasUnsavedChanges(false);
      setFormData({});

    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state for existing event
  if (eventId && eventLoading) {
    return (
      <div className="bg-gray-50 min-h-full flex flex-col">
        {/* Mobile Navigation Skeleton */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        
        <div className="flex flex-1">
          {/* Steps Sidebar skeleton */}
          <div className="w-80 h-screen bg-gray-50 border-r border-gray-200 hidden lg:flex lg:flex-col sticky top-0 flex-shrink-0">
            {/* Header section */}
            <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
              <Skeleton className="h-4 w-32 mb-4" />
              
              {/* Event Preview Card skeleton */}
              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-4 mb-4">
                <Skeleton className="h-20 w-full mb-3 rounded-md" />
                <Skeleton className="h-4 w-24 mb-1" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
              </div>
            </div>
            
            {/* Steps navigation skeleton */}
            <div className="flex-1 p-6">
              <Skeleton className="h-4 w-16 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-start space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="flex-1 min-w-0">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Header skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                
                {/* Form content skeleton */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Form fields grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        ))}
                      </div>
                      
                      {/* Description field */}
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex justify-between pt-4">
                        <Skeleton className="h-10 w-20" />
                        <Skeleton className="h-10 w-32" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (eventId && eventError) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="flex flex-1 min-h-0">
          {/* Steps Sidebar */}
          <EventSidebarNavigation
            currentStep={1}
            totalSteps={totalSteps}
            eventTitle="Error"
            onStepClick={() => {}}
            canNavigateToStep={() => false}
          />
          
          {/* Error content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-8 text-center">
                  <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Event</h2>
                  <p className="text-gray-600 mb-4">{eventError.message}</p>
                  <Button onClick={() => router.push('/dashboard/events')}>Back to Events</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Helper functions for sidebar navigation
  const canNavigateToStep = (stepNumber: number): boolean => {
    // Can always go back to completed steps
    if (stepNumber < currentStep) return true;
    // Can't skip ahead
    if (stepNumber > currentStep) return false;
    // Current step is always accessible
    return stepNumber === currentStep;
  };

  const handleStepClick = (stepNumber: number) => {
    if (canNavigateToStep(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  const formatEventDate = () => {
    if (!createdEvent?.date) return undefined;
    return createdEvent.date;
  };

  const getEventStatus = (): "draft" | "published" | undefined => {
    // Return the actual status from the event
    if (createdEvent?.status) {
      const status = createdEvent.status.toLowerCase();
      // Map backend status to sidebar format (only return valid types)
      if (status === 'draft') return 'draft';
      // All other statuses (approved, pending, rejected) are treated as published
      return 'published';
    }
    // Fallback to the prop passed from the route
    return isDraft ? 'draft' : 'published';
  };

  const getEventImage = () => {
    if (!createdEvent) return undefined;
    
    // Follow the same priority logic as in EventMediaForm - prefer full URLs over S3 keys
    const imageUrl = createdEvent.mainImageUrl ||      // Use full URL first for display
                     createdEvent.bigImageUrl || 
                     createdEvent.featuredImageUrl ||
                     (createdEvent.image && createdEvent.image !== 'placeholder' ? createdEvent.image : '') || // S3 key as fallback
                     '';
                     
    // Debug: Uncomment for troubleshooting image display
    // console.log('🔍 getEventImage calculation:', {
    //   mainImageUrl: createdEvent.mainImageUrl,
    //   bigImageUrl: createdEvent.bigImageUrl,
    //   featuredImageUrl: createdEvent.featuredImageUrl,
    //   image: createdEvent.image,
    //   selectedImageUrl: imageUrl
    // });
                     
    return imageUrl || undefined;
  };

  
  return (
    <div className="bg-gray-50 min-h-full flex flex-col">
      {/* Mobile Navigation */}
      <EventMobileNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        eventTitle={createdEvent?.title}
        eventStatus={getEventStatus()}
        onBack={currentStep > 1 ? (currentStep === 2 ? handleBackToStep1 : handleBackToStep2) : undefined}
      />
      
      {/* Split-screen layout */}
      <div className="flex flex-1">
        {/* Left Sidebar - Fixed position, hidden on mobile */}
        <EventSidebarNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          eventTitle={createdEvent?.title}
          eventDate={formatEventDate()}
          eventStatus={getEventStatus()}
          eventImage={getEventImage()}
          onStepClick={handleStepClick}
          canNavigateToStep={canNavigateToStep}
          isEditMode={mode === 'edit'}
          onUpdate={handleUpdate}
          updateLoading={isLoading}
          hasUnsavedChanges={hasUnsavedChanges}
          onStatusChange={handleStatusChange}
          event={createdEvent || undefined}
        />
        
        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          {/* Draft indicator */}
          {getEventStatus() === 'draft' && (
            <div className="bg-orange-50 border-b border-orange-100 px-6 py-3">
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                  DRAFT
                </div>
                <p className="text-sm text-gray-600">
                  This event is in draft mode and not visible publicly
                </p>
              </div>
            </div>
          )}
      
          {/* Main Content Container */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Show skeleton when initializing draft */}
            {currentStep === 1 && isInitializing ? (
              // Complete initialization skeleton
              <div className="space-y-6 max-w-4xl mx-auto">
                {/* Header skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                
                {/* Form content skeleton */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Basic info section */}
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-40" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Description section */}
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                      
                      {/* Categories section */}
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-2">
                              <Skeleton className="h-5 w-20" />
                              <Skeleton className="h-10 w-full" />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Loading indicator */}
                      <div className="text-center py-6 border-t">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Initializing event draft...</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (eventId || createdEvent?.id) && (
                  <div className="animate-in slide-in-from-right-4 duration-300">
                    <EventBasicForm
                      key={`event-form-${eventId || createdEvent?.id}`}
                      eventId={eventId || createdEvent?.id || ''}
                      initialData={createdEvent}
                      onSubmit={handleStep1Complete}
                      onCancel={handleCancel}
                      mode={mode}
                      isDraft={isDraft}
                    />
                  </div>
                )}
                
                {/* Step 2: Date & Location */}
                {currentStep === 2 && createdEvent && (
                  <div className="animate-in slide-in-from-right-4 duration-300">
                    <EventDetailsForm
                      event={createdEvent}
                      onSubmit={handleStep2Complete}
                      onBack={handleBackToStep1}
                      loading={isLoading}
                      onLoadingStart={handleStep2Start}
                      onError={handleStep2Error}
                    />
                  </div>
                )}
                
                {/* Step 3: Media & Details */}
                {currentStep === 3 && createdEvent && (
                  <div className="animate-in slide-in-from-right-4 duration-300">
                    <EventMediaForm
                      event={createdEvent}
                      onSubmit={handleStep3Complete}
                      onBack={handleBackToStep2}
                      loading={isLoading}
                      onLoadingStart={handleStep3Start}
                      onError={handleStep3Error}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Event Creation?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes that will be lost if you cancel. 
              Your progress is automatically saved, so you can continue later from where you left off.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Editing</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>
              Cancel Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}