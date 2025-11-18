'use client';

import { useRouter } from 'next/navigation';
import { RestaurantCreationWizard } from './components';

export default function CreateRestaurantPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/dashboard/restaurants');
  };

  return (
    <RestaurantCreationWizard onCancel={handleCancel} />
  );
}