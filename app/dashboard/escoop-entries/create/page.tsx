"use client";

import { useRouter } from 'next/navigation';
import { ProtectedPage } from '@/components/protected-page';

import { EscoopEntryCreationWizard } from './components/escoop-entry-creation-wizard';

export default function CreateEscoopEntryPage() {
  return (
    <ProtectedPage
      requiredRoles={['SUPER_ADMIN', 'ADMIN']}
    >
      <CreateEscoopEntryPageContent />
    </ProtectedPage>
  );
}

function CreateEscoopEntryPageContent() {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  return (
    <EscoopEntryCreationWizard onCancel={handleCancel} />
  );
}