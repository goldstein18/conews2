"use client";

import { useRouter, useParams } from 'next/navigation';
import { ProtectedPage } from '@/components/protected-page';
import { EscoopEditForm } from './components/escoop-edit-form';
import { EscoopFormSkeleton } from '../../components/escoop-skeleton';

export default function EditEscoopPage() {
  return (
    <ProtectedPage
      requiredRoles={['SUPER_ADMIN', 'ADMIN']}
    >
      <EditEscoopPageContent />
    </ProtectedPage>
  );
}

function EditEscoopPageContent() {
  const router = useRouter();
  const params = useParams();
  const escoopId = params.id as string;

  const handleCancel = () => {
    router.back();
  };

  // Show loading skeleton while checking permissions
  if (!router || !escoopId) {
    return <EscoopFormSkeleton />;
  }

  return (
    <EscoopEditForm
      escoopId={escoopId}
      onCancel={handleCancel}
    />
  );
}