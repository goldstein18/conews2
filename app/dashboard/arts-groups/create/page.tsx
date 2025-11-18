"use client";

import { useRouter } from 'next/navigation';
import { ArtsGroupCreationWizard } from './components';

export default function CreateArtsGroupPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/dashboard/arts-groups');
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">
      <ArtsGroupCreationWizard onCancel={handleCancel} />
    </div>
  );
}
