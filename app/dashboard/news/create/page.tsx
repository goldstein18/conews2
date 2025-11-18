'use client';

import { useRouter } from 'next/navigation';
import { ProtectedPage } from '@/components/protected-page';
import { NewsCreationWizard } from './components';

export default function CreateNewsPage() {
  return (
    <ProtectedPage
      requiredRoles={['SUPER_ADMIN', 'ADMIN', 'EDITORIAL_WRITER']}
    >
      <CreateNewsPageContent />
    </ProtectedPage>
  );
}

function CreateNewsPageContent() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/dashboard/news');
  };

  return (
    <NewsCreationWizard onCancel={handleCancel} />
  );
}
