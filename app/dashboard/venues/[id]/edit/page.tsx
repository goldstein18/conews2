"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProtectedPage } from '@/components/protected-page';

import { 
  VenueFormSkeleton 
} from '../../components';
import { VenueEditWizard } from './components';
import { useVenueDataForEdit } from '../../hooks/use-venues-data';
import { useVenueActions } from '../../hooks/use-venue-actions';
import { filterVenueUpdateFields } from '@/lib/utils/form-data-helpers';

import type { VenueFormData, FAQFormData, OperatingHoursFormData } from '../../lib/validations';
import { 
  VenueFAQ, 
  CreateVenueFAQInput, 
  UpdateVenueFAQInput,
  VenueOperatingHours,
  CreateVenueOperatingHoursInput,
  UpdateVenueInput
} from '@/types/venues';

export default function EditVenuePage() {
  return (
    <ProtectedPage 
      requiredRoles={['SUPER_ADMIN', 'ADMIN', 'CALENDAR_MEMBER', 'DINNING_MEMBER']}
    >
      <EditVenuePageContent />
    </ProtectedPage>
  );
}

function EditVenuePageContent() {
  const router = useRouter();
  const params = useParams();
  const venueId = params.id as string;
  
  const { 
    updateVenue, 
    createFAQ, 
    updateFAQ, 
    deleteFAQ,
    createOperatingHours,
    deleteOperatingHours,
    loading: updateLoading 
  } = useVenueActions();
  const { venue, loading: venueLoading, error } = useVenueDataForEdit({
    identifier: venueId,
    skip: !venueId
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle FAQs updates
  const handleFAQsUpdate = async (formFAQs: Array<Omit<FAQFormData, 'order'> & {id?: string}>, existingFAQs: VenueFAQ[]) => {
    try {
      console.log('🔄 Processing FAQs updates...');
      
      // Convert existing FAQs to a Map for easier lookup
      const existingFAQsMap = new Map(existingFAQs.map(faq => [faq.id, faq]));
      
      // Track which existing FAQs are still present in the form
      const processedIds = new Set<string>();
      
      // Process form FAQs
      for (const formFAQ of formFAQs) {
        if (formFAQ.id && existingFAQsMap.has(formFAQ.id)) {
          // Update existing FAQ
          console.log(`📝 Updating FAQ: ${formFAQ.id}`);
          const updateInput: UpdateVenueFAQInput = {
            id: formFAQ.id,
            question: formFAQ.question,
            answer: formFAQ.answer,
            order: 0,
            isActive: formFAQ.isActive !== false // Default to true
          };
          await updateFAQ(updateInput);
          processedIds.add(formFAQ.id);
        } else {
          // Create new FAQ (no ID or not found in existing)
          console.log('➕ Creating new FAQ');
          const createInput: CreateVenueFAQInput = {
            venueId: venueId,
            question: formFAQ.question,
            answer: formFAQ.answer,
            order: 0,
            isActive: formFAQ.isActive !== false // Default to true
          };
          await createFAQ(createInput);
        }
      }
      
      // Delete FAQs that were removed from the form
      for (const existingFAQ of existingFAQs) {
        if (!processedIds.has(existingFAQ.id)) {
          console.log(`🗑️ Deleting FAQ: ${existingFAQ.id}`);
          await deleteFAQ(existingFAQ.id);
        }
      }
      
      console.log('✅ FAQs updated successfully');
    } catch (error) {
      console.error('❌ Error updating FAQs:', error);
      throw error; // Re-throw to handle in main submission
    }
  };

  // Handle Operating Hours updates - Delete all existing and recreate
  const handleOperatingHoursUpdate = async (formOperatingHours: OperatingHoursFormData[], existingOperatingHours: VenueOperatingHours[]) => {
    try {
      console.log('🔄 Processing Operating Hours updates...');
      
      // First, delete all existing operating hours to avoid conflicts
      for (const existingHour of existingOperatingHours) {
        console.log(`🗑️ Deleting existing Operating Hours: ${existingHour.id}`);
        await deleteOperatingHours(existingHour.id);
      }
      
      // Then, create all operating hours from the form
      for (const formHour of formOperatingHours) {
        console.log('➕ Creating Operating Hours for:', formHour.dayOfWeek);
        const createInput: CreateVenueOperatingHoursInput = {
          venueId: venueId,
          dayOfWeek: formHour.dayOfWeek,
          startTime: formHour.startTime,
          endTime: formHour.endTime,
          isClosed: formHour.isClosed || false
        };
        await createOperatingHours(createInput);
      }
      
      console.log('✅ Operating Hours updated successfully');
    } catch (error) {
      console.error('❌ Error updating Operating Hours:', error);
      throw error; // Re-throw to handle in main submission
    }
  };

  const handleSubmit = async (data: VenueFormData) => {
    try {
      setIsSubmitting(true);

      // Prepare the update data with all fields
      const rawUpdateInput = {
        id: venueId,
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        zipcode: data.zipcode,
        market: data.market,
        phone: data.phone,
        website: data.website,
        venueType: data.venueType,
        hostsPrivateEvents: data.hostsPrivateEvents,
        parkingInformation: data.parkingInformation,
        accessibilityFeatures: data.accessibilityFeatures,
        adminNotes: data.adminNotes,
        companyId: data.companyId,
        status: data.status,
        image: data.image,
        imageBig: data.imageBig,
        video: data.video,
        facebook: data.facebook,
        twitter: data.twitter,
        instagram: data.instagram,
        youtube: data.youtube,
        tiktok: data.tiktok,
        metadescription: data.metadescription,
        cityId: data.cityId
      };

      // Filter out empty strings to prevent backend validation errors
      const updateInput = filterVenueUpdateFields(rawUpdateInput) as unknown as UpdateVenueInput;

      console.log('🔍 Raw update input:', rawUpdateInput);
      console.log('✅ Filtered update input (empty fields removed):', updateInput);

      // Update the venue
      const updatedVenue = await updateVenue(updateInput);

      if (updatedVenue) {
        // Handle FAQs updates
        await handleFAQsUpdate(data.faqs || [], venue?.faqs || []);
        
        // Handle Operating Hours updates
        await handleOperatingHoursUpdate(data.operatingHours || [], venue?.operatingHours || []);
        
        // Redirect back to the venues list
        router.push('/dashboard/venues');
      }
    } catch (error) {
      console.error('Update venue error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  // Loading state
  if (venueLoading) {
    return <VenueFormSkeleton />;
  }

  // Error state
  if (error || !venue) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Error Loading Venue</h1>
            <p className="text-sm text-muted-foreground">
              Unable to load the venue for editing
            </p>
          </div>
        </div>
        
        <Alert variant="destructive">
          <AlertDescription>
            {error?.message || 'The venue could not be found or you do not have permission to edit it.'}
          </AlertDescription>
        </Alert>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <VenueEditWizard
      venue={venue}
      onSubmit={handleSubmit}
      loading={isSubmitting || updateLoading}
    />
  );
}