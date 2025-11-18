"use client";

import { useRouter } from 'next/navigation';
import { ProtectedPage } from '@/components/protected-page';

import { VenueCreationWizard } from './components/venue-creation-wizard';
import { VenueFormSkeleton } from '../components/venue-skeleton';

export default function CreateVenuePage() {
  return (
    <ProtectedPage 
      requiredRoles={['SUPER_ADMIN', 'ADMIN', 'CALENDAR_MEMBER', 'DINNING_MEMBER']}
    >
      <CreateVenuePageContent />
    </ProtectedPage>
  );
}

function CreateVenuePageContent() {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  // Show loading skeleton while checking permissions
  if (!router) {
    return <VenueFormSkeleton />;
  }

  return (
    <VenueCreationWizard onCancel={handleCancel} />
  );
}