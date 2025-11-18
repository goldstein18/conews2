"use client";

import { useRouter } from 'next/navigation';
import { ProtectedPage } from '@/components/protected-page';
import { EscoopForm } from './components/escoop-form';
import { EscoopFormSkeleton } from '../components/escoop-skeleton';

export default function CreateEscoopPage() {
  return (
    <ProtectedPage
      requiredRoles={['SUPER_ADMIN', 'ADMIN']}
    >
      <CreateEscoopPageContent />
    </ProtectedPage>
  );
}

function CreateEscoopPageContent() {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  // Show loading skeleton while checking permissions
  if (!router) {
    return <EscoopFormSkeleton />;
  }

  return (
    <EscoopForm onCancel={handleCancel} />
  );
}