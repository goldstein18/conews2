'use client';

import React, { useState, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Building2,
  Clock,
  HelpCircle,
  Eye,
  EyeOff,
  Trash2,
  Phone
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageUploadAdvanced } from '@/components/ui/image-upload-advanced';
import { UrlInput } from '@/components/ui/url-input';

import { 
  venueAdvancedSchema,
  VenueAdvancedFormData,
  defaultOperatingHoursValues,
  defaultFAQValues
} from '../../../lib/validations';
import { z } from 'zod';
import { 
  VenueStatus,
  DayOfWeek, 
  Venue,
} from '@/types/venues';
import { useVenueImageUpload } from '../../../hooks/use-venue-image-upload';
import { useImageUploadStore } from '@/store/image-upload-store';
import { useAuthStore } from '@/store/auth-store';
import { isSuperAdmin, isAdmin } from '@/lib/roles';

interface VenueAdvancedEditFormProps {
  venue: Venue;
  formData?: Record<string, unknown>; // Data from basic form
  onSubmit: (data: unknown) => Promise<void>;
  onBack?: () => void;
  loading?: boolean;
  onFormChange?: () => void;
}

// Days of week options
const dayOfWeekOptions = [
  { value: DayOfWeek.MONDAY, label: 'Monday' },
  { value: DayOfWeek.TUESDAY, label: 'Tuesday' },
  { value: DayOfWeek.WEDNESDAY, label: 'Wednesday' },
  { value: DayOfWeek.THURSDAY, label: 'Thursday' },
  { value: DayOfWeek.FRIDAY, label: 'Friday' },
  { value: DayOfWeek.SATURDAY, label: 'Saturday' },
  { value: DayOfWeek.SUNDAY, label: 'Sunday' }
];

// Create a modified schema that matches the expected types
const advancedFormSchema = venueAdvancedSchema.extend({
  operatingHours: z.array(z.object({
    id: z.string().optional(),
    dayOfWeek: z.nativeEnum(DayOfWeek),
    startTime: z.string(),
    endTime: z.string(),
    isClosed: z.boolean()
  })),
  faqs: z.array(z.object({
    id: z.string().optional(),
    question: z.string(),
    answer: z.string(),
    order: z.number().optional(),
    isActive: z.boolean()
  }))
});

// Create a type for the form based on the custom schema
type AdvancedFormType = ReturnType<typeof useForm<z.infer<typeof advancedFormSchema>>>;

export interface VenueAdvancedEditFormRef {
  submitForm: () => void;
}

export const VenueAdvancedEditForm = forwardRef<VenueAdvancedEditFormRef, VenueAdvancedEditFormProps>(({ 
  venue, 
  formData = {}, 
  onSubmit, 
  onBack, 
  loading = false,
  onFormChange
}, ref) => {
  const { user } = useAuthStore();
  
  // Determine if user can see admin fields
  const canSelectCompany = user && (isSuperAdmin(user) || isAdmin(user));
  
  // Collapsible sections state
  const [contactInfoOpen, setContactInfoOpen] = useState(true);
  const [operatingHoursOpen, setOperatingHoursOpen] = useState(false);
  const [parkingInfoOpen, setParkingInfoOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);

  // Convert venue to advanced form data
  const venueToAdvancedFormData = (venue: Venue): VenueAdvancedFormData => {
    const extendedVenue = venue as Venue & Record<string, unknown>;
    return {
      image: venue.image && venue.image !== 'placeholder' ? venue.image : '',
      imageBig: venue.imageBig || '',
      video: (extendedVenue.video as string) || '',
      phone: venue.phone || '',
      website: venue.website || '',
      facebook: (extendedVenue.facebook as string) || '',
      twitter: (extendedVenue.twitter as string) || '',
      instagram: (extendedVenue.instagram as string) || '',
      youtube: (extendedVenue.youtube as string) || '',
      tiktok: (extendedVenue.tiktok as string) || '',
      metadescription: (extendedVenue.metadescription as string) || '',
      cityId: (extendedVenue.cityId as string) || '',
      parkingInformation: venue.parkingInformation || '',
      accessibilityFeatures: venue.accessibilityFeatures || '',
      adminNotes: venue.adminNotes || '',
      status: venue.status,
      operatingHours: venue.operatingHours?.map(oh => ({
        id: oh.id,
        dayOfWeek: oh.dayOfWeek,
        startTime: oh.startTime,
        endTime: oh.endTime,
        isClosed: oh.isClosed
      })) || [],
      faqs: venue.faqs?.map(faq => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        order: faq.order || 0,
        isActive: faq.isActive
      })) || []
    };
  };

  // Form setup with explicit typing
  const form = useForm<z.infer<typeof advancedFormSchema>>({
    resolver: zodResolver(advancedFormSchema),
    defaultValues: {
      ...venueToAdvancedFormData(venue),
      operatingHours: venueToAdvancedFormData(venue).operatingHours || [],
      faqs: venueToAdvancedFormData(venue).faqs || []
    }
  });

  // Track form changes
  const watchedValues = form.watch();
  const originalValues = React.useMemo(() => venueToAdvancedFormData(venue), [venue]);
  
  React.useEffect(() => {
    // Compare current form values with original values
    const hasChanges = JSON.stringify(watchedValues) !== JSON.stringify(originalValues);
    if (hasChanges && onFormChange) {
      onFormChange();
    }
  }, [watchedValues, originalValues, onFormChange]);

  // Field arrays for dynamic sections
  const { 
    fields: operatingHoursFields, 
    append: appendOperatingHours, 
    remove: removeOperatingHours 
  } = useFieldArray({
    control: form.control,
    name: 'operatingHours'
  });

  const { 
    fields: faqFields, 
    append: appendFAQ, 
    remove: removeFAQ 
  } = useFieldArray({
    control: form.control,
    name: 'faqs'
  });

  // Ref to store the image upload function
  const imageUploadRef = useRef<{
    uploadPendingImage?: () => Promise<string | null>;
  }>({});

  const handleSubmit = useCallback(async (data: VenueAdvancedFormData) => {
    try {
      // Combine basic form data with advanced form data
      const combinedData = {
        ...formData,
        ...data,
        id: venue.id
      };
      
      // Process pending image changes (temporary upload or removal)
      if (data.image === 'REMOVE' || data.image?.startsWith('temp_')) {
        console.log('🔄 Processing pending image changes before venue submission...');
        
        const uploadFunction = imageUploadRef.current.uploadPendingImage;
        if (uploadFunction) {
          try {
            const processedImageKey = await uploadFunction();
            
            if (processedImageKey === null) {
              // Image was removed or will be removed
              combinedData.image = ''; // Set to empty for backend
            } else if (processedImageKey) {
              // Image was uploaded to S3
              combinedData.image = processedImageKey;
            }
            
            console.log('✅ Image processing completed, final value:', combinedData.image);
          } catch (uploadError) {
            console.error('❌ Failed to process image:', uploadError);
            throw new Error('Failed to process image. Please try again.');
          }
        } else {
          console.warn('⚠️ No upload function available, proceeding with current image value');
        }
      }
      
      await onSubmit(combinedData);
    } catch (error) {
      console.error('Advanced form error:', error);
    }
  }, [formData, venue.id, onSubmit]);

  // Expose submitForm function to parent
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      form.handleSubmit(handleSubmit)();
    }
  }), [form, handleSubmit]);

  const addOperatingHours = () => {
    appendOperatingHours(defaultOperatingHoursValues);
    setOperatingHoursOpen(true);
  };

  const addFAQ = () => {
    appendFAQ(defaultFAQValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Venue Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Venue Image</span>
            </CardTitle>
            <CardDescription>
              Upload a high-quality image that represents this venue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <ImageUploadSection
                    value={field.value}
                    onChange={field.onChange}
                    disabled={loading}
                    currentImageUrl={venue ? (venue as Venue & { imageUrl?: string }).imageUrl : undefined}
                    venueId={venue?.id}
                    uploadRef={imageUploadRef}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Collapsible open={contactInfoOpen} onOpenChange={setContactInfoOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <CardTitle>Contact Information</CardTitle>
                  </div>
                  {contactInfoOpen ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <CardDescription>
                  Phone, website, and social media links
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {/* Phone & Website */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} disabled={loading} />
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
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <UrlInput
                            {...field}
                            socialPlatform="website"
                            placeholder="www.example.com"
                            disabled={loading}
                            onValueChange={(url) => field.onChange(url)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Facebook & Instagram */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <UrlInput
                            {...field}
                            socialPlatform="facebook"
                            placeholder="facebook.com/yourpage"
                            disabled={loading}
                            onValueChange={(url) => field.onChange(url)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <UrlInput
                            {...field}
                            socialPlatform="instagram"
                            placeholder="instagram.com/username"
                            disabled={loading}
                            onValueChange={(url) => field.onChange(url)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* X (Twitter) & YouTube */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>X (Twitter)</FormLabel>
                        <FormControl>
                          <UrlInput
                            {...field}
                            socialPlatform="twitter"
                            placeholder="x.com/username"
                            disabled={loading}
                            onValueChange={(url) => field.onChange(url)}
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
                        <FormLabel>YouTube</FormLabel>
                        <FormControl>
                          <UrlInput
                            {...field}
                            socialPlatform="youtube"
                            placeholder="youtube.com/@channel"
                            disabled={loading}
                            onValueChange={(url) => field.onChange(url)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* TikTok */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tiktok"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TikTok</FormLabel>
                        <FormControl>
                          <UrlInput
                            {...field}
                            socialPlatform="tiktok"
                            placeholder="tiktok.com/@username"
                            disabled={loading}
                            onValueChange={(url) => field.onChange(url)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>
              Optional details to enhance the venue profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Operating Hours */}
            <Collapsible open={operatingHoursOpen} onOpenChange={setOperatingHoursOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Operating Hours</span>
                    {operatingHoursFields.length > 0 && (
                      <Badge variant="secondary">{operatingHoursFields.length}</Badge>
                    )}
                  </span>
                  {operatingHoursOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                {operatingHoursFields.length === 0 && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      No operating hours set. Click &quot;Add Time Slot&quot; to add venue hours.
                    </AlertDescription>
                  </Alert>
                )}
                
                {operatingHoursFields.map((field, index) => (
                  <OperatingHoursField
                    key={field.id}
                    index={index}
                    form={form}
                    onRemove={() => removeOperatingHours(index)}
                    disabled={loading}
                  />
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOperatingHours}
                  disabled={loading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Time Slot
                </Button>
              </CollapsibleContent>
            </Collapsible>

            {/* Parking Information */}
            <Collapsible open={parkingInfoOpen} onOpenChange={setParkingInfoOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>Parking Information</span>
                  {parkingInfoOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <FormField
                  control={form.control}
                  name="parkingInformation"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe parking availability, cost, accessibility, and any special instructions..."
                          className="min-h-[80px]"
                          {...field} 
                          disabled={loading}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide details about parking options for visitors
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>

            {/* Accessibility Information */}
            <Collapsible open={accessibilityOpen} onOpenChange={setAccessibilityOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>Accessibility Information</span>
                  {accessibilityOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <FormField
                  control={form.control}
                  name="accessibilityFeatures"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe accessibility features such as wheelchair access, elevators, accessible restrooms, etc..."
                          className="min-h-[80px]"
                          {...field} 
                          disabled={loading}
                        />
                      </FormControl>
                      <FormDescription>
                        Detail the accessibility features and accommodations available
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Frequently Asked Questions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5" />
                  <span>Frequently Asked Questions</span>
                </CardTitle>
                <CardDescription>
                  Add common questions and answers about the venue
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFAQ}
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqFields.length === 0 && (
              <Alert>
                <HelpCircle className="h-4 w-4" />
                <AlertDescription>
                  No FAQs added yet. Click &quot;Add Question&quot; to create frequently asked questions.
                </AlertDescription>
              </Alert>
            )}
            
            {faqFields.map((field, index) => (
              <FAQField
                key={field.id}
                index={index}
                form={form}
                onRemove={() => removeFAQ(index)}
                disabled={loading}
              />
            ))}
          </CardContent>
        </Card>

        {/* Admin Notes - Only for admins and only when editing */}
        {canSelectCompany && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
              <CardDescription>
                Internal notes and comments for administrative purposes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Selection - Admin Only */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || VenueStatus.PENDING}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select venue status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={VenueStatus.DRAFT}>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span>Draft</span>
                          </div>
                        </SelectItem>
                        <SelectItem value={VenueStatus.PENDING}>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span>Pending</span>
                          </div>
                        </SelectItem>
                        <SelectItem value={VenueStatus.PENDING_REVIEW}>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>Pending Review</span>
                          </div>
                        </SelectItem>
                        <SelectItem value={VenueStatus.APPROVED}>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Approved</span>
                          </div>
                        </SelectItem>
                        <SelectItem value={VenueStatus.REJECTED}>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>Rejected</span>
                          </div>
                        </SelectItem>
                        <SelectItem value={VenueStatus.SUSPENDED}>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Suspended</span>
                          </div>
                        </SelectItem>
                        <SelectItem value={VenueStatus.DELETED}>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-black rounded-full"></div>
                            <span>Deleted</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Change the venue status (admin only)
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
                      These notes are only visible to administrators
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
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
            className="min-w-[120px]"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Updating Venue...
              </>
            ) : (
              'Update Venue'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
});

VenueAdvancedEditForm.displayName = 'VenueAdvancedEditForm';

// Operating Hours Field Component
function OperatingHoursField({ 
  index, 
  form, 
  onRemove, 
  disabled 
}: {
  index: number;
  form: AdvancedFormType;
  onRemove: () => void;
  disabled: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end p-4 border border-border rounded-lg">
      <FormField
        control={form.control}
        name={`operatingHours.${index}.dayOfWeek`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Day</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {dayOfWeekOptions.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`operatingHours.${index}.startTime`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Time</FormLabel>
            <FormControl>
              <Input 
                type="time" 
                {...field} 
                disabled={disabled || form.watch(`operatingHours.${index}.isClosed`)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`operatingHours.${index}.endTime`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Time</FormLabel>
            <FormControl>
              <Input 
                type="time" 
                {...field} 
                disabled={disabled || form.watch(`operatingHours.${index}.isClosed`)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`operatingHours.${index}.isClosed`}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
            <FormLabel className="text-sm">Closed</FormLabel>
          </FormItem>
        )}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRemove}
        disabled={disabled}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

// FAQ Field Component
function FAQField({ 
  index, 
  form, 
  onRemove, 
  disabled 
}: {
  index: number;
  form: AdvancedFormType;
  onRemove: () => void;
  disabled: boolean;
}) {
  return (
    <div className="border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Question {index + 1}</h4>
        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name={`faqs.${index}.isActive`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
                <FormLabel className="text-sm">
                  {field.value ? (
                    <span className="flex items-center text-green-600">
                      <Eye className="h-3 w-3 mr-1" />
                      Visible
                    </span>
                  ) : (
                    <span className="flex items-center text-muted-foreground">
                      <EyeOff className="h-3 w-3 mr-1" />
                      Hidden
                    </span>
                  )}
                </FormLabel>
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRemove}
            disabled={disabled}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <FormField
        control={form.control}
        name={`faqs.${index}.question`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Question</FormLabel>
            <FormControl>
              <Input 
                placeholder="What should I bring to the event?"
                {...field} 
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`faqs.${index}.answer`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Answer</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Please bring a valid ID, your ticket (printed or digital), and comfortable clothing..."
                className="min-h-[80px]"
                {...field} 
                disabled={disabled}
              />
            </FormControl>
            <FormDescription>
              Characters: {field.value?.length || 0}/1000
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// Image Upload Section Component
interface ImageUploadSectionProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  currentImageUrl?: string;
  venueId?: string;
  uploadRef: React.MutableRefObject<{
    uploadPendingImage?: () => Promise<string | null>;
  }>;
}

function ImageUploadSection({ value, onChange, disabled, currentImageUrl, venueId, uploadRef }: ImageUploadSectionProps) {
  const imageUploadStore = useImageUploadStore();
  
  const {
    config,
    generatePresignedUrl,
    handleUploadComplete,
    handleUploadError,
    removeImage
  } = useVenueImageUpload({
    venueId,
    onUploadComplete: (imageKey) => {
      console.log('🎯 ImageUploadSection onUploadComplete called with:', imageKey);
      onChange(imageKey);
    },
    onUploadError: (error) => {
      console.error('Image upload error:', error);
    }
  });

  // Handler para remover imagen - solo marca como removida, no ejecuta inmediatamente
  const handleRemoveClick = () => {
    console.log('🗑️ Marking image for removal (staged change)');
    onChange('REMOVE'); // Valor especial para indicar remoción pendiente
  };

  // Store the upload function in the ref for the parent form to access
  React.useEffect(() => {
    // Function to upload a temporary image to S3 (used during form submit)
    const uploadPendingImage = async (): Promise<string | null> => {
      // Caso especial: remoción pendiente
      if (value === 'REMOVE') {
        if (venueId) {
          console.log('🗑️ Executing pending image removal for venue:', venueId);
          try {
            await removeImage();
            return null; // Retornar null para indicar que no hay imagen
          } catch (error) {
            console.error('❌ Failed to remove venue image:', error);
            throw error;
          }
        }
        return null;
      }

      // Caso normal: imagen temporal
      if (!value || !imageUploadStore.isTemporaryImage(value)) {
        return value || null; // Return as-is if not a temporary image
      }

      try {
        console.log('📤 Uploading pending venue image:', value);
        const s3Key = await imageUploadStore.uploadPendingImage(value, generatePresignedUrl);
        console.log('✅ Venue image uploaded to S3:', s3Key);
        return s3Key;
      } catch (error) {
        console.error('❌ Failed to upload venue image:', error);
        throw error;
      }
    };

    // Store the upload function in the ref for parent form access
    uploadRef.current.uploadPendingImage = uploadPendingImage;
  }, [value, imageUploadStore, generatePresignedUrl, removeImage, venueId, uploadRef]);

  // Determinar qué imagen mostrar
  const shouldHideImage = value === 'REMOVE';
  const displayUrl = shouldHideImage ? undefined : (currentImageUrl || value);

  return (
    <div>
      {shouldHideImage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            🗑️ Image marked for removal - will be deleted when you save the venue
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange(currentImageUrl || '')}
            className="mt-2"
          >
            Undo Remove
          </Button>
        </div>
      )}
      
      <ImageUploadAdvanced
        config={config}
        generatePresignedUrl={generatePresignedUrl}
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
        onRemove={venueId && !shouldHideImage ? handleRemoveClick : undefined}
        currentImageUrl={displayUrl}
        disabled={disabled}
        label="Venue Image"
        description={`Upload a high-quality image for this venue. Minimum size: ${config.minWidth}x${config.minHeight}px`}
      />
    </div>
  );
}