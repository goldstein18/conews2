'use client';

import { useEffect, useCallback } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { EventAutoSaveIndicator } from '../../components/event-auto-save-indicator';
import { EventPricingPanel } from './event-pricing-panel';
import { useAutoSave } from '@/store/event-draft-store';
import { useEventActions } from '../../hooks/use-event-actions';
import { eventMediaSchema, EventMediaFormData, VIDEO_TYPE_OPTIONS } from '../../lib/validations';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Video, Globe, Facebook, Twitter, Instagram, Youtube, Music, ImageIcon, Shield } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { EventStatus } from '@/types/events';
import { useAuthStore } from '@/store/auth-store';
import { isSuperAdmin, isAdmin } from '@/lib/roles';
import { ImageUploadAdvanced } from '@/components/ui/image-upload-advanced';
import { useImageUploadStore } from '@/store/image-upload-store';
import { useEventImageUpload } from '../../hooks/use-event-image-upload';
import { EventLineupPanel } from './event-lineup-panel';
import { EventAgendaPanel } from './event-agenda-panel';
import { EventAdditionalInfoPanel } from './event-additional-info-panel';
import { EventFAQsPanel } from './event-faqs-panel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Event {
  id: string;
  title: string;
  // Tag fields
  mainGenreId?: string;
  subgenreId?: string;
  supportingTagIds?: string[];
  audienceTagIds?: string[];
  companyId?: string;
  market?: string;
  // Image fields
  image?: string;
  mainImageUrl?: string;
  bigImageUrl?: string;
  featuredImageUrl?: string;
  video?: string;
  videoType?: 'YOUTUBE' | 'VIMEO' | 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK' | 'DIRECT' | 'OTHER';
  free?: boolean;
  pricing?: Record<string, unknown>;
  ticketUrl?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  // Backend format (from GraphQL) - using plural names
  eventLineups?: Array<{
    id: string;
    name: string;
    role: string;
    type: 'ARTIST' | 'SPEAKER' | 'GUEST';
    description?: string;
    image?: string;
    orderIndex: number;
  }>;
  eventAgendas?: Array<{
    id: string;
    title: string;
    description?: string;
    startTime: string;
    duration: number;
    orderIndex: number;
    status?: string;
  }>;
  // Form format (legacy, for backward compatibility)
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
  // Additional Information fields
  ageInfo?: string;
  doorTime?: string;
  parkingInfo?: string;
  accessibilityInfo?: string;
  // FAQs field - Can be array (form) or object (backend)
  faqs?: Array<{
    question: string;
    answer: string;
    orderIndex: number;
  }> | { questions: Array<{
    question: string;
    answer: string;
    orderIndex: number;
  }> };
  // Admin fields
  status?: string;
  adminNotes?: string;
}

interface EventMediaFormProps {
  event: Event;
  onSubmit: () => void;
  onBack: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;
  onError?: () => void;
}

export function EventMediaForm({
  event,
  onSubmit,
  onBack,
  loading = false,
  onLoadingStart,
  onError
}: EventMediaFormProps) {
  const { user } = useAuthStore();
  const { updateEvent } = useEventActions();
  const imageUploadStore = useImageUploadStore();
  const {
    formData,
    updateFormData,
    immediateAutoSave
  } = useAutoSave();

  // Determine if user can see admin fields
  const canSelectCompany = user && (isSuperAdmin(user) || isAdmin(user));

  // Image upload configuration for this specific event
  const {
    config,
    generatePresignedUrl,
    handleUploadComplete,
    handleUploadError
  } = useEventImageUpload({
    eventId: event.id,
    onUploadComplete: (imageKey) => {
      form.setValue('image', imageKey);
    },
    onUploadError: (error) => {
      console.error('❌ Image upload failed:', error);
    }
  });

  // Get initial values from store or defaults - prioritize URLs over keys for display
  const getInitialValues = useCallback((): EventMediaFormData => {
    // For display purposes, prefer full URLs over S3 keys
    const calculatedImageValue = (formData as Record<string, unknown>).image as string || 
                                 event.mainImageUrl ||  // Use full URL first for display
                                 event.bigImageUrl || 
                                 event.featuredImageUrl ||
                                 (event.image && event.image !== 'placeholder' ? event.image : '') || // S3 key as fallback
                                 '';
    
    // Debug logging for image
    console.log('🔍 EventMediaForm - getInitialValues image calculation:', {
      formDataImage: (formData as Record<string, unknown>).image,
      eventImage: event.image,
      eventMainImageUrl: event.mainImageUrl,
      eventBigImageUrl: event.bigImageUrl,
      eventFeaturedImageUrl: event.featuredImageUrl,
      calculatedImageValue
    });
    
    return {
      // For each field, use formData value if it exists and is meaningful, otherwise use event data
      image: calculatedImageValue,
      video: formData.video || event.video || '',
      videoType: formData.videoType || event.videoType || undefined,
      free: formData.free ?? event.free ?? false,
      // Pricing fields - extract from formData or event.pricing JSON
      pricingType: (() => {
        const formPricingType = (formData as Record<string, unknown>).pricingType as 'free' | 'single' | 'range';
        if (formPricingType) return formPricingType;
        
        // Check if event has pricing JSON data
        if (event.pricing && typeof event.pricing === 'object') {
          const pricing = event.pricing as Record<string, unknown>;
          const pricingType = pricing.type as 'free' | 'single' | 'range';
          return pricingType || 'single';
        }
        
        // Default based on free status
        return event.free ? 'free' : 'single';
      })() as 'free' | 'single' | 'range',
      singlePrice: (() => {
        const formPrice = (formData as Record<string, unknown>).singlePrice as string;
        if (formPrice) return formPrice;
        
        if (event.pricing && typeof event.pricing === 'object') {
          const pricing = event.pricing as Record<string, unknown>;
          return pricing.singlePrice ? String(pricing.singlePrice) : '';
        }
        
        return '';
      })(),
      minPrice: (() => {
        const formMinPrice = (formData as Record<string, unknown>).minPrice as string;
        if (formMinPrice) return formMinPrice;
        
        if (event.pricing && typeof event.pricing === 'object') {
          const pricing = event.pricing as Record<string, unknown>;
          return pricing.minPrice ? String(pricing.minPrice) : '';
        }
        
        return '';
      })(),
      maxPrice: (() => {
        const formMaxPrice = (formData as Record<string, unknown>).maxPrice as string;
        if (formMaxPrice) return formMaxPrice;
        
        if (event.pricing && typeof event.pricing === 'object') {
          const pricing = event.pricing as Record<string, unknown>;
          return pricing.maxPrice ? String(pricing.maxPrice) : '';
        }
        
        return '';
      })(),
      ticketUrl: ((formData as Record<string, unknown>).ticketUrl as string) || 
                  (event.pricing && typeof event.pricing === 'object' 
                    ? ((event.pricing as Record<string, unknown>).ticketUrl as string) || ''
                    : '') ||
                  event.ticketUrl || '',
      website: formData.website || event.website || '',
      facebook: formData.facebook || event.facebook || '',
      twitter: (formData as Record<string, unknown>).twitter as string || event.twitter || '',
      instagram: (formData as Record<string, unknown>).instagram as string || event.instagram || '',
      youtube: (formData as Record<string, unknown>).youtube as string || event.youtube || '',
      tiktok: (formData as Record<string, unknown>).tiktok as string || event.tiktok || '',
      // Lineup and Agenda with proper structure - transform from backend format (plural)
      lineup: formData.lineup || event.lineup || (event.eventLineups ? {
        performers: event.eventLineups.map(performer => ({
          name: performer.name,
          role: performer.role,
          type: performer.type,
          description: performer.description || '',
          orderIndex: performer.orderIndex
        }))
      } : { performers: [] }),
      agenda: formData.agenda || event.agenda || (event.eventAgendas ? {
        items: event.eventAgendas.map(item => ({
          title: item.title,
          startTime: item.startTime,
          duration: item.duration,
          description: item.description || '',
          orderIndex: item.orderIndex
        }))
      } : { items: [] }),
      
      // Additional Information fields
      ageInfo: (formData as Record<string, unknown>).ageInfo as string || event.ageInfo || '',
      doorTime: (formData as Record<string, unknown>).doorTime as string || event.doorTime || '',
      parkingInfo: (formData as Record<string, unknown>).parkingInfo as string || event.parkingInfo || '',
      accessibilityInfo: (formData as Record<string, unknown>).accessibilityInfo as string || event.accessibilityInfo || '',
      
      // FAQs field - Handle backend format { questions: [...] }
      faqs: (() => {
        // Check form data first
        const formFaqs = (formData as Record<string, unknown>).faqs as Array<{question: string; answer: string; orderIndex: number}>;
        if (formFaqs && Array.isArray(formFaqs)) {
          return formFaqs;
        }

        // Handle backend format
        if (event.faqs) {
          if (Array.isArray(event.faqs)) {
            // Direct array format
            return event.faqs;
          } else if (typeof event.faqs === 'object' && 'questions' in event.faqs) {
            // Backend format { questions: [...] }
            return event.faqs.questions;
          }
        }

        return [];
      })(),

      // Admin fields
      status: ((formData as Record<string, unknown>).status as EventStatus) ||
              (event.status as EventStatus) ||
              EventStatus.PENDING,
      adminNotes: (formData as Record<string, unknown>).adminNotes as string || event.adminNotes || ''
    };
  }, [formData, event]);

  const form = useForm<EventMediaFormData>({
    resolver: zodResolver(eventMediaSchema) as unknown as Resolver<EventMediaFormData>,
    defaultValues: getInitialValues(),
    mode: 'onChange'
  });

  // Debug log to verify image initialization

  // Re-initialize form when event prop changes
  useEffect(() => {
    if (event && event.id && Object.keys(event).length > 0) {
      const newValues = getInitialValues();
      form.reset(newValues);
    }
  }, [event, event?.id, getInitialValues, form, formData]);

  // Update form data in store on changes (for persistence, no auto-save)
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Only update if we have valid data and specific field changes
      if (name && Object.keys(value).length > 0 && name in value) {
        // Convert EventMediaFormData to partial AutoSaveEventData format
        const autosaveData = {
          ...formData, // Keep existing data from all previous steps
          ...value     // Update only the changed fields
        } as Parameters<typeof updateFormData>[0];
        updateFormData(autosaveData);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, updateFormData, formData]);

  const handleSubmit = async (data: EventMediaFormData) => {
    try {
      if (onLoadingStart) onLoadingStart();
      
      // Validate with current schema before proceeding
      const validationResult = eventMediaSchema.safeParse(data);
      
      if (!validationResult.success) {
        // Set validation errors on the form
        const errors = validationResult.error.flatten().fieldErrors;
        Object.entries(errors).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            form.setError(field as keyof EventMediaFormData, {
              type: 'validation',
              message: messages[0]
            });
          }
        });
        // Reset loading state on validation error
        if (onError) onError();
        return;
      }
      
      
      // Handle temporary image upload FIRST
      let finalImageKey: string | null = null;
      const isExistingImageUrl = data.image && (
        data.image.startsWith('http') || 
        data.image.includes('amazonaws.com') ||
        data.image.includes('cloudfront.net')
      );
      
      
      if (data.image && imageUploadStore.isTemporaryImage(data.image)) {
        try {
          finalImageKey = await imageUploadStore.uploadPendingImage(data.image, generatePresignedUrl);
        } catch (uploadError) {
          console.error('❌ Failed to upload image to S3:', uploadError);
          throw new Error('Failed to upload image. Please try again.');
        }
      } else if (data.image && !isExistingImageUrl && data.image !== 'placeholder') {
        // If it's not a temporary image, not an existing URL, and not placeholder, 
        // it might be a direct S3 key - use it
        finalImageKey = data.image;
      }
      
      // Combine all form data for final save
      // Priority: formData (changes from steps 1-2) > event (initial data) > data (Step 3)
      const completeEventData = {
        // Start with initial event data to ensure we have all fields including tags
        mainGenreId: event.mainGenreId,
        subgenreId: event.subgenreId,
        supportingTagIds: event.supportingTagIds || [],
        audienceTagIds: event.audienceTagIds || [],
        companyId: event.companyId,
        market: event.market,
        // Override with any changes from previous steps stored in formData
        ...formData, // Data from all previous steps (includes changed values)
        // Finally apply current Step 3 data
        ...data,     // Current Step 3 data
      };
      
      // Only include image field if we have a new S3 key (not existing URLs)
      if (finalImageKey && finalImageKey !== 'placeholder' && finalImageKey.trim() !== '') {
        completeEventData.image = finalImageKey;
      }
      
      // Transform pricing data for backend compatibility
      if (data.free) {
        completeEventData.pricing = { type: 'free' };
      } else if (data.pricingType === 'single' && data.singlePrice) {
        completeEventData.pricing = {
          type: 'single',
          singlePrice: parseFloat(data.singlePrice),
          currency: 'USD'
        };
      } else if (data.pricingType === 'range' && data.minPrice && data.maxPrice) {
        completeEventData.pricing = {
          type: 'range',
          minPrice: parseFloat(data.minPrice),
          maxPrice: parseFloat(data.maxPrice),
          currency: 'USD'
        };
      }
      
      // Add ticketUrl if provided (separate from pricing object)
      if (data.ticketUrl && data.ticketUrl.trim() !== '') {
        completeEventData.ticketUrl = data.ticketUrl;
      }

      // 🔍 DEBUG: Log complete payload before sending to backend
      console.log('='.repeat(80));
      console.log('📤 UPDATE EVENT PAYLOAD - Step 3 (Media & Details)');
      console.log('='.repeat(80));
      console.log('Event ID:', event.id);
      console.log('\n📋 Complete Event Data (will be sent to updateEvent):');
      console.log(JSON.stringify(completeEventData, null, 2));
      console.log('='.repeat(80));

      // Final save with all event data
      await immediateAutoSave(async () => {
        await updateEvent(event.id, completeEventData);
      });

      console.log('✅ Event updated successfully.');
      console.log('📍 Calling onSubmit() - Redirect will be handled by wizard...');
      onSubmit(); // This calls handleStep3Complete in the wizard
    } catch (error) {
      console.error('Step 3: Error saving complete event:', error);
      // Reset loading state
      if (onError) onError();
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Media & Details</h1>
        <p className="text-gray-600">Add media, social links, and additional event information</p>
      </div>
      
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(handleSubmit)} 
          className="space-y-8"
          onKeyDown={(e) => {
            // Prevent form submission on Enter key unless it's the submit button
            if (e.key === 'Enter' && e.target instanceof HTMLElement) {
              const target = e.target as HTMLElement;
              const inputTarget = target as HTMLInputElement;
              if (inputTarget.type !== 'submit' && !target.closest('[role="dialog"]')) {
                e.preventDefault();
              }
            }
          }}
        >
          <div className="space-y-8">
            {/* Event Image Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ImageIcon className="h-5 w-5" />
                  <span>Event Image</span>
                </CardTitle>
                <CardDescription>
                  Upload a high-quality image for this event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => {
                    console.log('🔍 EventMediaForm - ImageUploadAdvanced render:', {
                      fieldValue: field.value,
                      eventImage: event.image,
                      eventMainImageUrl: event.mainImageUrl
                    });

                    return (
                      <FormItem>
                        <ImageUploadAdvanced
                          config={config}
                          generatePresignedUrl={generatePresignedUrl}
                          onUploadComplete={handleUploadComplete}
                          onUploadError={handleUploadError}
                          currentImageUrl={field.value}
                        disabled={loading}
                        label="Event Image"
                        description={`Upload a high-quality image for this event. Minimum size: ${config.minWidth}x${config.minHeight}px`}
                      />
                    </FormItem>
                  );
                  }}
                />
              </CardContent>
            </Card>

            {/* Video Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="h-5 w-5" />
                  <span>Video</span>
                </CardTitle>
                <CardDescription>
                  Add a video to showcase your event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="video"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="videoType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select video platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {VIDEO_TYPE_OPTIONS.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Ticketing Section */}
            <EventPricingPanel 
              form={form}
              disabled={loading}
            />

            {/* Social Media Links Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Social Media</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-lg font-medium">
                          <Instagram className="h-5 w-5" />
                          <span>Instagram</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.instagram.com/yourusername"
                            className="px-4 py-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-lg font-medium">
                          <Facebook className="h-5 w-5" />
                          <span>Facebook</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.facebook.com/yourpage"
                            className="px-4 py-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-lg font-medium">
                          <Twitter className="h-5 w-5" />
                          <span>X</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.x.com/yourusername"
                            className="px-4 py-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-lg font-medium">
                          <Youtube className="h-5 w-5" />
                          <span>YouTube</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.youtube.com/c/yourchannel"
                            className="px-4 py-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tiktok"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-lg font-medium">
                          <Music className="h-5 w-5" />
                          <span>TikTok</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.tiktok.com/@yourusername"
                            className="px-4 py-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-lg font-medium">
                          <Globe className="h-5 w-5" />
                          <span>Website</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.yourwebsite.com"
                            className="px-4 py-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lineup & Agenda Section */}
            <div className="space-y-8">
              <div className="border-t pt-8">
                <h2 className="text-xl font-semibold mb-6">Lineup & Agenda</h2>
                <p className="text-muted-foreground mb-6">
                  Add performers and schedule details to help attendees know what to expect.
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                  {/* Lineup Panel */}
                  <FormField
                    control={form.control}
                    name="lineup"
                    render={({ field }) => (
                      <FormItem>
                        <EventLineupPanel
                          performers={(field.value?.performers || []).map((performer, index) => ({
                            ...performer,
                            id: `performer-${index}`,
                            orderIndex: performer.orderIndex ?? index
                          }))}
                          onUpdateLineup={(performers) => {
                            const performersData = performers.map(({ orderIndex, ...performer }) => ({
                              ...performer,
                              orderIndex
                            }));
                            field.onChange({ performers: performersData });
                          }}
                          disabled={loading}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Agenda Panel */}
                  <FormField
                    control={form.control}
                    name="agenda"
                    render={({ field }) => (
                      <FormItem>
                        <EventAgendaPanel
                          agendaItems={(field.value?.items || []).map((item, index) => ({
                            ...item,
                            id: `agenda-${index}`,
                            orderIndex: item.orderIndex ?? index
                          }))}
                          onUpdateAgenda={(items) => {
                            const itemsData = items.map(({ orderIndex, ...item }) => ({
                              ...item,
                              orderIndex
                            }));
                            field.onChange({ items: itemsData });
                          }}
                          disabled={loading}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="border-t pt-8">
              <EventAdditionalInfoPanel 
                form={form}
                disabled={loading}
              />
            </div>

            {/* FAQs Section */}
            <div className="border-t pt-8">
              <EventFAQsPanel
                form={form}
                disabled={loading}
              />
            </div>

            {/* Admin Settings - Only for admins */}
            {canSelectCompany && (
              <div className="border-t pt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Admin Settings</span>
                    </CardTitle>
                    <CardDescription>
                      Internal administrative controls and notes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Status Selection - Admin Only */}
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || EventStatus.PENDING}
                            disabled={loading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select event status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={EventStatus.DRAFT}>
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <span>Draft</span>
                                </div>
                              </SelectItem>
                              <SelectItem value={EventStatus.PENDING}>
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                  <span>Pending</span>
                                </div>
                              </SelectItem>
                              <SelectItem value={EventStatus.PENDING_REVIEW}>
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                  <span>Pending Review</span>
                                </div>
                              </SelectItem>
                              <SelectItem value={EventStatus.APPROVED}>
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span>Approved</span>
                                </div>
                              </SelectItem>
                              <SelectItem value={EventStatus.REJECTED}>
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  <span>Rejected</span>
                                </div>
                              </SelectItem>
                              <SelectItem value={EventStatus.SUSPENDED}>
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                  <span>Suspended</span>
                                </div>
                              </SelectItem>
                              <SelectItem value={EventStatus.DELETED}>
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-black rounded-full"></div>
                                  <span>Deleted</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Change the event status (admin only)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Admin Notes Textarea */}
                    <FormField
                      control={form.control}
                      name="adminNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Internal Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add any internal notes, review comments, or administrative information..."
                              className="min-h-[100px]"
                              {...field}
                              disabled={loading}
                            />
                          </FormControl>
                          <FormDescription>
                            These notes are for internal use only and not visible to the public
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

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
                Back to Step 2
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
                  'Finish & Go to Events'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}