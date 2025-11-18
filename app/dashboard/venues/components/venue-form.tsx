"use client";

import React, { useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useForm, useFieldArray, UseFormReturn, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
 
  Building2, 
  MapPin, 
  Clock,
  HelpCircle,
  Eye,
  EyeOff,
  Trash2
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

import { 
  defaultVenueFormValues, 
  defaultOperatingHoursValues,
  defaultFAQValues,
  VenueFormData,
  venueFormSchema 
} from '../lib/validations';
import {
  VenueType,
  VenueStatus,
  DayOfWeek,
  Venue,
} from '@/types/venues';
import { useCompaniesDropdown } from '../hooks/use-venues-data';
import { useVenueImageUpload } from '../hooks/use-venue-image-upload';
import { useImageUploadStore } from '@/store/image-upload-store';
import { useAuthStore } from '@/store/auth-store';
import { useQuery } from '@apollo/client';
import { MY_COMPANY_PROFILE } from '@/lib/graphql/settings';
import { isSuperAdmin, isAdmin } from '@/lib/roles';
import { cn } from '@/lib/utils';

// Extended venue interface to include new API fields
interface ExtendedVenue extends Venue {
  market?: string;
  video?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  metadescription?: string;
  cityId?: string;
  imageUrl?: string; // URL completa de S3
}

interface VenueFormProps {
  venue?: Venue | null;
  onSubmit: (data: VenueFormData) => Promise<void>;
  loading?: boolean;
  className?: string;
  currentStatus?: VenueStatus;
}

export interface VenueFormRef {
  handleSubmit: () => void;
}

// Venue type options
const venueTypeOptions = [
  { value: VenueType.THEATER, label: 'Theater' },
  { value: VenueType.PERFORMING_ARTS_CENTER, label: 'Performing Arts Center' },
  { value: VenueType.ART_CENTER, label: 'Art Center' },
  { value: VenueType.GALLERY, label: 'Gallery' },
  { value: VenueType.MUSEUM, label: 'Museum' },
  { value: VenueType.EVENT_SPACE, label: 'Event Space' },
  { value: VenueType.AMPHITHEATRE, label: 'Amphitheatre' },
  { value: VenueType.STUDIO, label: 'Studio' },
  { value: VenueType.ARTIST_COMPLEX, label: 'Artist Complex' },
  { value: VenueType.COMMUNITY_CENTER, label: 'Community Center' },
  { value: VenueType.HISTORIC_HOMES, label: 'Historic Homes' },
  { value: VenueType.ATTRACTION, label: 'Tourist Attraction' },
  { value: VenueType.Z_OTHER, label: 'Other' }
];

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

export const VenueForm = forwardRef<VenueFormRef, VenueFormProps>(function VenueForm({ 
  venue, 
  onSubmit, 
  loading = false, 
  className,
  currentStatus
}, ref) {
  const { user } = useAuthStore();
  
  // Determine if user can see company selector
  const canSelectCompany = user && (isSuperAdmin(user) || isAdmin(user));
  
  // Get user's company profile (for members)
  const { data: companyData } = useQuery(MY_COMPANY_PROFILE, {
    skip: !!canSelectCompany, // Skip if user is admin (they can select any company)
    errorPolicy: 'all'
  });
  
  // GraphQL mutation for generating presigned URLs
  
  const userCompanyId = companyData?.myCompanyProfile?.id;
  const userCompany = companyData?.myCompanyProfile;
  
  // Get companies based on user role
  const { data: companiesData, loading: companiesLoading } = useCompaniesDropdown({ 
    skip: !canSelectCompany 
  });
  const companies = companiesData?.companies || [];
  
  // Collapsible sections state
  const [operatingHoursOpen, setOperatingHoursOpen] = useState(false);
  const [parkingInfoOpen, setParkingInfoOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);

  // Helper function to convert venue to form data
  const venueToFormData = (venue: Venue): Partial<VenueFormData> => {
    const extendedVenue = venue as ExtendedVenue;
    
    console.log('🖼️ Venue image data for edit form:', {
      venueId: venue.id,
      imageKey: venue.image,
      imageUrl: extendedVenue.imageUrl,
      isPlaceholder: venue.image === 'placeholder',
      imageLength: venue.image?.length
    });
    
    return {
      name: venue.name,
      description: venue.description || '',
      address: venue.address,
      city: venue.city,
      state: venue.state,
      zipcode: venue.zipcode,
      market: extendedVenue.market || '',
      phone: venue.phone || '',
      website: venue.website || '',
      venueType: venue.venueType,
      companyId: venue.companyId || venue.company?.id || '',
      image: venue.image && venue.image !== 'placeholder' ? venue.image : '',
      imageBig: venue.imageBig || '',
      video: extendedVenue.video || '',
      facebook: extendedVenue.facebook || '',
      twitter: extendedVenue.twitter || '',
      instagram: extendedVenue.instagram || '',
      youtube: extendedVenue.youtube || '',
      metadescription: extendedVenue.metadescription || '',
      cityId: extendedVenue.cityId || '',
      hostsPrivateEvents: venue.hostsPrivateEvents || false,
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

  // Form setup
  const form = useForm<VenueFormData>({
    resolver: zodResolver(venueFormSchema) as unknown as Resolver<VenueFormData>,
    defaultValues: venue ? (venueToFormData(venue) as VenueFormData) : ({
      ...defaultVenueFormValues,
      // For members, auto-assign their company ID
      companyId: !!canSelectCompany ? '' : (userCompanyId || '')
    } as VenueFormData)
  });

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
  const imageUploadRef = React.useRef<{
    uploadPendingImage?: () => Promise<string | null>;
  }>({});

  const handleSubmit = useCallback(async (data: VenueFormData) => {
    try {
      // For members, ensure companyId is set to their company
      if (!canSelectCompany && userCompanyId) {
        data.companyId = userCompanyId;
      }
      
      // Process pending image changes (temporary upload or removal)
      if (data.image === 'REMOVE' || data.image?.startsWith('temp_')) {
        console.log('🔄 Processing pending image changes before venue submission...');
        
        const uploadFunction = imageUploadRef.current.uploadPendingImage;
        if (uploadFunction) {
          try {
            const processedImageKey = await uploadFunction();
            
            if (processedImageKey === null) {
              // Image was removed or will be removed
              data.image = ''; // Set to empty for backend
            } else if (processedImageKey) {
              // Image was uploaded to S3
              data.image = processedImageKey;
            }
            
            console.log('✅ Image processing completed, final value:', data.image);
          } catch (uploadError) {
            console.error('❌ Failed to process image:', uploadError);
            throw new Error('Failed to process image. Please try again.');
          }
        } else {
          console.warn('⚠️ No upload function available, proceeding with current image value');
        }
      }
      
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
      throw error; // Re-throw to show error in form
    }
  }, [canSelectCompany, userCompanyId, onSubmit]);

  const addOperatingHours = () => {
    appendOperatingHours(defaultOperatingHoursValues);
    setOperatingHoursOpen(true);
  };

  const addFAQ = () => {
    appendFAQ(defaultFAQValues);
  };

  // Expose form submit function to parent
  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      form.handleSubmit(handleSubmit)();
    }
  }), [form, handleSubmit]);

  return (
    <Form {...form}>
      <form className={cn("space-y-6", className)}>
        {/* Client Assignment - Conditional rendering based on user role */}
        {canSelectCompany ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Company Assignment</span>
              </CardTitle>
              <CardDescription>
                Assign this venue to a company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Company *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={companiesLoading || loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={companiesLoading ? "Loading companies..." : "Choose a company"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companiesLoading ? (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            Loading companies...
                          </div>
                        ) : companies.length > 0 ? (
                          companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              <div className="font-medium">{company.name}</div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No companies available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ) : (
          // For members, show their company info (read-only)
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Company Assignment</span>
              </CardTitle>
              <CardDescription>
                This venue will be assigned to your company
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userCompany ? (
                <>
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{userCompany.name}</div>
                      {userCompany.email && (
                        <div className="text-sm text-muted-foreground">{userCompany.email}</div>
                      )}
                    </div>
                  </div>
                  {/* Hidden field to store the company ID */}
                  <FormField
                    control={form.control}
                    name="companyId"
                    render={({ field }) => (
                      <input type="hidden" {...field} value={userCompany.id} />
                    )}
                  />
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No company assigned to your account. Please contact an administrator.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Venue Information */}
        <Card>
          <CardHeader>
            <CardTitle>Venue Information</CardTitle>
            <CardDescription>
              Provide the essential details about the venue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter venue name" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="venueType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Type *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select venue type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {venueTypeOptions.map((type) => (
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

              <FormField
                control={form.control}
                name="hostsPrivateEvents"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Private Events</FormLabel>
                      <FormDescription>
                        Does this venue host private events?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={loading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

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
                      <Input placeholder="https://venue-website.com" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the venue, its unique features, and what makes it special..."
                      className="min-h-[100px]"
                      {...field} 
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of the venue (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

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
                    currentImageUrl={venue ? (venue as ExtendedVenue).imageUrl : undefined}
                    venueId={venue?.id} // Pasar venueId para habilitar remoción
                    uploadRef={imageUploadRef}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Location Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Location Details</span>
            </CardTitle>
            <CardDescription>
              Provide the address and location information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address *</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main Street" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *</FormLabel>
                    <FormControl>
                      <Input placeholder="NY" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="10001" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select market" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="miami">Miami</SelectItem>
                      <SelectItem value="orlando">Orlando</SelectItem>
                      <SelectItem value="tampa">Tampa</SelectItem>
                      <SelectItem value="jacksonville">Jacksonville</SelectItem>
                      <SelectItem value="tallahassee">Tallahassee</SelectItem>
                      <SelectItem value="fort-lauderdale">Fort Lauderdale</SelectItem>
                      <SelectItem value="west-palm-beach">West Palm Beach</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the market area for this venue
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

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
        {canSelectCompany && venue && (
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
                      value={field.value || currentStatus || VenueStatus.PENDING}
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

        {/* Bottom padding for fixed action bar */}
        <div className="pb-24"></div>
      </form>
    </Form>
  );
});

// Operating Hours Field Component
function OperatingHoursField({ 
  index, 
  form, 
  onRemove, 
  disabled 
}: {
  index: number;
  form: UseFormReturn<VenueFormData>;
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
  form: UseFormReturn<VenueFormData>;
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
  currentImageUrl?: string; // URL completa para visualización
  venueId?: string; // Para habilitar remoción real en edit mode
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