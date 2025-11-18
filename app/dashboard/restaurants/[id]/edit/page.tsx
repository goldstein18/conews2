'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProtectedPage } from '@/components/protected-page';

import { 
  RestaurantEditSkeleton 
} from '../../components';
import { RestaurantEditWizard } from './components';
import { useRestaurantDataForEdit } from '../../hooks/use-restaurants-data';
import { useRestaurantActions } from '../../hooks/use-restaurant-actions';

import type { RestaurantEditFormData } from '../../lib/validations';

export default function EditRestaurantPage() {
  return (
    <ProtectedPage 
      requiredRoles={['SUPER_ADMIN', 'ADMIN', 'CALENDAR_MEMBER', 'DINNING_MEMBER']}
    >
      <EditRestaurantPageContent />
    </ProtectedPage>
  );
}

function EditRestaurantPageContent() {
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.id as string;
  
  const { 
    updateRestaurant,
    loading 
  } = useRestaurantActions();
  const { restaurant, loading: restaurantLoading, error } = useRestaurantDataForEdit({
    identifier: restaurantId,
    skip: !restaurantId
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: unknown) => {
    const formData = data as RestaurantEditFormData;
    console.log('🚀 handleSubmit started, setting isSubmitting to true');
    try {
      setIsSubmitting(true);

      // Base update input
      const updateInput = {
        id: formData.id,
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipcode,
        market: formData.market,
        restaurantTypeId: formData.restaurantTypeId,
        priceRange: formData.priceRange,
        // Optional fields - only include if they have values
        ...(formData.phone && formData.phone.trim() && { phone: formData.phone.trim() }),
        ...(formData.email && formData.email.trim() && { email: formData.email.trim() }),
        ...(formData.website && formData.website.trim() && { website: formData.website.trim() }),
        ...(formData.facebook && formData.facebook.trim() && { facebook: formData.facebook.trim() }),
        ...(formData.twitter && formData.twitter.trim() && { twitter: formData.twitter.trim() }),
        ...(formData.instagram && formData.instagram.trim() && { instagram: formData.instagram.trim() }),
        ...(formData.youtube && formData.youtube.trim() && { youtube: formData.youtube.trim() }),
        ...(formData.tiktok && formData.tiktok.trim() && { tiktok: formData.tiktok.trim() }),
        ...(formData.menuLink && formData.menuLink.trim() && { menuLink: formData.menuLink.trim() }),
        ...(formData.dietaryOptions && formData.dietaryOptions.length > 0 && { dietaryOptions: formData.dietaryOptions }),
        ...(formData.amenities && formData.amenities.length > 0 && { amenities: formData.amenities }),
        ...(formData.adminNotes && formData.adminNotes.trim() && { adminNotes: formData.adminNotes.trim() }),
        ...(formData.image && formData.image !== 'placeholder' && { image: formData.image }),
        // Include status if it was changed via the toggle
        ...(formData.status && { status: formData.status })
      };

      console.log('📝 About to call updateRestaurant with:', updateInput);
      const result = await updateRestaurant(updateInput);
      console.log('✅ updateRestaurant completed with result:', result);
      
      // Redirect back to the restaurants list
      router.push('/dashboard/restaurants');
    } catch (error) {
      console.error('❌ Update restaurant error:', error);
    } finally {
      console.log('🔚 handleSubmit finally block, setting isSubmitting to false');
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (restaurantLoading) {
    return <RestaurantEditSkeleton />;
  }

  // Error state
  if (error || !restaurant) {
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
            <h1 className="text-2xl font-semibold tracking-tight">Error Loading Restaurant</h1>
            <p className="text-sm text-muted-foreground">
              Unable to load the restaurant for editing
            </p>
          </div>
        </div>
        
        <Alert variant="destructive">
          <AlertDescription>
            {error?.message || 'The restaurant could not be found or you do not have permission to edit it.'}
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
    <RestaurantEditWizard
      restaurant={restaurant}
      onSubmit={handleSubmit}
      loading={isSubmitting || loading.update}
    />
  );
}