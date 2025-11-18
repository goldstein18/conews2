"use client";

import React, { useState } from 'react';
import { useForm, useFieldArray, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, 
  Trash2,
  Image as ImageIcon,
  Phone,
  Car,
  Clock,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
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
import { ImageUploadAdvanced } from '@/components/ui/image-upload-advanced';
import { UrlInput } from '@/components/ui/url-input';

import { DayOfWeek, type Venue } from '@/types/venues';
import { useVenueImageUpload } from '../../hooks/use-venue-image-upload';
import { useVenueActions } from '../../hooks/use-venue-actions';
import { useImageUploadStore } from '@/store/image-upload-store';

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

// Validation schema for Step 2 (advanced fields)
const venueAdvancedSchema = z.object({
  // Image
  image: z.string().optional(),
  
  // Contact Information
  phone: z.string()
    .regex(/^(\+1-?)?\(?([0-9]{3})\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  
  website: z.string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),
  
  // Social Media
  facebook: z.string()
    .url('Invalid Facebook URL')
    .optional()
    .or(z.literal('')),
  
  twitter: z.string()
    .url('Invalid Twitter URL')
    .optional()
    .or(z.literal('')),
  
  instagram: z.string()
    .url('Invalid Instagram URL')
    .optional()
    .or(z.literal('')),
  
  youtube: z.string()
    .url('Invalid YouTube URL')
    .optional()
    .or(z.literal('')),

  tiktok: z.string()
    .url('Invalid TikTok URL')
    .optional()
    .or(z.literal('')),

  // Additional Details
  parkingInformation: z.string()
    .max(300, 'Parking information must be less than 300 characters')
    .trim()
    .optional(),
  
  accessibilityFeatures: z.string()
    .max(300, 'Accessibility information must be less than 300 characters')
    .trim()
    .optional(),
  
  adminNotes: z.string()
    .max(500, 'Admin notes must be less than 500 characters')
    .trim()
    .optional(),
  
  metadescription: z.string()
    .max(160, 'Meta description must be less than 160 characters')
    .trim()
    .optional(),
  
  video: z.string().optional(),
  imageBig: z.string().optional(),
  cityId: z.string().optional(),
  
  // Operating Hours
  operatingHours: z.array(z.object({
    dayOfWeek: z.nativeEnum(DayOfWeek),
    startTime: z.string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
    endTime: z.string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
    isClosed: z.boolean().default(false)
  })).optional().default([]),
  
  // FAQs
  faqs: z.array(z.object({
    question: z.string()
      .min(10, 'Question must be at least 10 characters')
      .max(200, 'Question must be less than 200 characters')
      .trim(),
    answer: z.string()
      .min(20, 'Answer must be at least 20 characters')
      .max(1000, 'Answer must be less than 1000 characters')
      .trim(),
    isActive: z.boolean().default(true)
  })).optional().default([])
});

type VenueAdvancedFormData = z.infer<typeof venueAdvancedSchema>;

interface VenueAdvancedFormProps {
  venue: Venue;
  onSubmit: () => void;
  onBack: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;
}

export function VenueAdvancedForm({ venue, onSubmit, onBack, loading = false, onLoadingStart }: VenueAdvancedFormProps) {
  const { updateVenue } = useVenueActions();
  const imageUploadStore = useImageUploadStore();
  
  // Collapsible sections state
  const [operatingHoursOpen, setOperatingHoursOpen] = useState(false);
  const [contactInfoOpen, setContactInfoOpen] = useState(true);
  const [additionalDetailsOpen, setAdditionalDetailsOpen] = useState(false);
  const [faqsOpen, setFaqsOpen] = useState(false);

  const form = useForm<VenueAdvancedFormData>({
    resolver: zodResolver(venueAdvancedSchema) as unknown as Resolver<VenueAdvancedFormData>,
    defaultValues: {
      image: venue.image === 'placeholder' ? '' : venue.image || '',
      phone: venue.phone || '',
      website: venue.website || '',
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: '',
      tiktok: '',
      parkingInformation: venue.parkingInformation || '',
      accessibilityFeatures: venue.accessibilityFeatures || '',
      adminNotes: venue.adminNotes || '',
      metadescription: '',
      video: '',
      imageBig: '',
      cityId: '',
      operatingHours: [],
      faqs: []
    }
  });

  // Field arrays for dynamic sections
  const { fields: operatingHoursFields, append: appendOperatingHours, remove: removeOperatingHours } = useFieldArray({
    control: form.control,
    name: 'operatingHours'
  });

  const { fields: faqFields, append: appendFAQ, remove: removeFAQ } = useFieldArray({
    control: form.control,
    name: 'faqs'
  });

  // Image upload configuration for this specific venue
  const {
    config,
    generatePresignedUrl,
    handleUploadComplete,
    handleUploadError
  } = useVenueImageUpload({
    venueId: venue.id,
    onUploadComplete: (imageKey) => {
      console.log('🎯 Image uploaded successfully:', imageKey);
      form.setValue('image', imageKey);
    },
    onUploadError: (error) => {
      console.error('❌ Image upload failed:', error);
    }
  });

  const handleSubmit = async (data: VenueAdvancedFormData) => {
    try {
      // Start loading state
      if (onLoadingStart) {
        onLoadingStart();
      }
      
      console.log('🔄 Updating venue with advanced details:', data);
      console.log('🖼️ Image value from form:', {
        imageValue: data.image,
        isPlaceholder: data.image === 'placeholder',
        isEmpty: !data.image || data.image.trim() === '',
        venueCurrentImage: venue.image,
        isTemporary: imageUploadStore.isTemporaryImage(data.image || '')
      });

      // Handle temporary image upload first
      let finalImageKey = data.image;
      if (data.image && imageUploadStore.isTemporaryImage(data.image)) {
        console.log('📤 Uploading temporary image to S3...');
        try {
          finalImageKey = await imageUploadStore.uploadPendingImage(data.image, generatePresignedUrl);
          console.log('✅ Temporary image uploaded to S3:', finalImageKey);
        } catch (uploadError) {
          console.error('❌ Failed to upload image to S3:', uploadError);
          throw new Error('Failed to upload image. Please try again.');
        }
      }

      // Helper function to convert empty strings to undefined
      const nullifyEmptyString = (value: string | undefined) => {
        return value && value.trim() !== '' ? value : undefined;
      };

      // Log form data before processing
      console.log('📝 Form data received:', {
        phone: data.phone,
        website: data.website,
        facebook: data.facebook,
        twitter: data.twitter,
        instagram: data.instagram,
        youtube: data.youtube,
        tiktok: data.tiktok
      });

      const updateInput = {
        id: venue.id,
        // Only include fields that have values
        ...(nullifyEmptyString(data.phone) && { phone: nullifyEmptyString(data.phone) }),
        ...(nullifyEmptyString(data.website) && { website: nullifyEmptyString(data.website) }),
        // Social Media Links (CRITICAL FIX - These were missing!)
        ...(nullifyEmptyString(data.facebook) && { facebook: nullifyEmptyString(data.facebook) }),
        ...(nullifyEmptyString(data.twitter) && { twitter: nullifyEmptyString(data.twitter) }),
        ...(nullifyEmptyString(data.instagram) && { instagram: nullifyEmptyString(data.instagram) }),
        ...(nullifyEmptyString(data.youtube) && { youtube: nullifyEmptyString(data.youtube) }),
        ...(nullifyEmptyString(data.tiktok) && { tiktok: nullifyEmptyString(data.tiktok) }),
        ...(nullifyEmptyString(data.parkingInformation) && { parkingInformation: nullifyEmptyString(data.parkingInformation) }),
        ...(nullifyEmptyString(data.accessibilityFeatures) && { accessibilityFeatures: nullifyEmptyString(data.accessibilityFeatures) }),
        ...(nullifyEmptyString(data.adminNotes) && { adminNotes: nullifyEmptyString(data.adminNotes) }),
        // Include final image key if it was uploaded and is not the placeholder
        ...(finalImageKey && finalImageKey !== 'placeholder' && finalImageKey.trim() !== '' && { image: finalImageKey }),
      };

      console.log('🔧 Update input object with final image key:', updateInput);
      
      if (Object.keys(updateInput).length > 1) { // More than just 'id'
        await updateVenue(updateInput);
        console.log('✅ Venue updated successfully');
      } else {
        console.log('⚠️ No fields to update (only ID present)');
      }

      console.log('✅ Step 2 completed');
      onSubmit();
      
    } catch (error) {
      console.error('❌ Error updating venue:', error);
      throw error;
    }
  };

  const addOperatingHours = () => {
    appendOperatingHours({
      dayOfWeek: DayOfWeek.MONDAY,
      startTime: '09:00',
      endTime: '17:00',
      isClosed: false
    });
    setOperatingHoursOpen(true);
  };

  const addFAQ = () => {
    appendFAQ({
      question: '',
      answer: '',
      isActive: true
    });
    setFaqsOpen(true);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        
        {/* Venue Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5" />
              <span>Venue Image</span>
            </CardTitle>
            <CardDescription>
              Upload a high-quality image to showcase your venue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <ImageUploadAdvanced
                    config={config}
                    generatePresignedUrl={generatePresignedUrl}
                    onUploadComplete={handleUploadComplete}
                    onUploadError={handleUploadError}
                    currentImageUrl={field.value}
                    disabled={loading}
                    label="Venue Image"
                    description={`Upload a high-quality image for this venue. Minimum size: ${config.minWidth}x${config.minHeight}px`}
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
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>Contact Information</span>
                  </div>
                  {contactInfoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CardTitle>
                <CardDescription>
                  Phone, website, and social media links
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
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

                {/* Row 3: TikTok */}
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

        {/* Additional Details */}
        <Collapsible open={additionalDetailsOpen} onOpenChange={setAdditionalDetailsOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Car className="h-5 w-5" />
                    <span>Additional Details</span>
                  </div>
                  {additionalDetailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CardTitle>
                <CardDescription>
                  Parking, accessibility, and other important information
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="parkingInformation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parking Information</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe parking availability, rates, restrictions..."
                          className="min-h-[80px]"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accessibilityFeatures"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accessibility Features</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe wheelchair accessibility, hearing assistance, etc..."
                          className="min-h-[80px]"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adminNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Internal notes for administrative purposes..."
                          className="min-h-[80px]"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormDescription>
                        These notes are for internal use and won&apos;t be visible to the public
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Operating Hours (Optional) */}
        <Collapsible open={operatingHoursOpen} onOpenChange={setOperatingHoursOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Operating Hours</span>
                    <span className="text-sm text-gray-500 font-normal">(Optional)</span>
                  </div>
                  {operatingHoursOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CardTitle>
                <CardDescription>
                  Define when your venue is open to the public
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {operatingHoursFields.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No operating hours defined</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOperatingHours}
                      className="mt-2"
                      disabled={loading}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Operating Hours
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {operatingHoursFields.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 flex-1">
                          <FormField
                            control={form.control}
                            name={`operatingHours.${index}.dayOfWeek`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
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
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`operatingHours.${index}.startTime`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="time" {...field} disabled={loading} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`operatingHours.${index}.endTime`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="time" {...field} disabled={loading} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`operatingHours.${index}.isClosed`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={loading}
                                  />
                                </FormControl>
                                <span className="text-sm">Closed</span>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOperatingHours(index)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOperatingHours}
                      disabled={loading}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Another Day
                    </Button>
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* FAQs (Optional) */}
        <Collapsible open={faqsOpen} onOpenChange={setFaqsOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5" />
                    <span>Frequently Asked Questions</span>
                    <span className="text-sm text-gray-500 font-normal">(Optional)</span>
                  </div>
                  {faqsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CardTitle>
                <CardDescription>
                  Common questions and answers about your venue
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {faqFields.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <HelpCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No FAQs defined</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addFAQ}
                      className="mt-2"
                      disabled={loading}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add FAQ
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {faqFields.map((field, index) => (
                      <div key={field.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">FAQ #{index + 1}</h4>
                          <div className="flex items-center space-x-2">
                            <FormField
                              control={form.control}
                              name={`faqs.${index}.isActive`}
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={loading}
                                    />
                                  </FormControl>
                                  <span className="text-sm">
                                    {field.value ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                  </span>
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeFAQ(index)}
                              disabled={loading}
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
                                <Input placeholder="What is your question?" {...field} disabled={loading} />
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
                                  placeholder="Provide a detailed answer..."
                                  className="min-h-[80px]"
                                  {...field}
                                  disabled={loading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addFAQ}
                      disabled={loading}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Another FAQ
                    </Button>
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Form Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} disabled={loading}>
            Back to Step 1
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Completing Venue...
              </>
            ) : (
              'Complete Venue Setup'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}