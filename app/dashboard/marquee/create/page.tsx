'use client';

import { useRouter } from 'next/navigation';
import { ProtectedPage } from '@/components/protected-page';
import { MarqueeCreationWizard } from './components';

export default function CreateMarqueePage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/dashboard/marquee');
  };

  return (
    <ProtectedPage requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
      <div className="flex-1 p-0">
        <MarqueeCreationWizard onCancel={handleCancel} />
      </div>
    </ProtectedPage>
  );
}
